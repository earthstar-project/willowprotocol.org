import { decompress, init } from "npm:@bokuweb/zstd-wasm@^0.0.27";
import { Expression } from "macromania";
import { createLogger } from "macromania-logger";
import { Def } from "macromania-defref";
import { StylesheetDependencyInfo } from "macromania-html-utils";

// Rustdoc JSON output is still unstable, so we need to pin the output version.
// TODO: They don't actually seem to support this yet.
const JSON_VERSION = 46;

type SymbolKind = "type" | "fn" | "interface" | "constant" | "module";

type RustDocsProps = {
  crate: string;
  json: any;
  prefix?: string;
  typeClass?: string;
  functionClass?: string;
  interfaceClass?: string;
  constantsClass?: string;
  moduleClass?: string;
  depsCss?: StylesheetDependencyInfo[];
};

const makeClassGetter = (
  classes: {
    typeClass?: string;
    functionClass?: string;
    interfaceClass?: string;
    constantsClass?: string;
    moduleClass?: string;
  },
) =>
(kind: SymbolKind) => {
  switch (kind) {
    case "type":
      return classes.typeClass;

    case "fn":
      return classes.functionClass;

    case "interface":
      return classes.interfaceClass;

    case "constant":
      return classes.constantsClass;

    case "module":
      return classes.moduleClass;

    default:
      return undefined;
  }
};

export function DefsRustDocs(props: RustDocsProps): Expression {
  const defsDict = createDefs(props.crate, props.json, props.prefix);

  const classGetter = makeClassGetter(props);

  return (
    <omnomnom>
      {Object.entries(defsDict).map(([id, { url, name, kind }]) => (
        <Def
          n={id}
          r={name}
          href={url}
          refClass={classGetter(kind)}
          depsCssRef={props.depsCss}
        />
      ))}
    </omnomnom>
  );
}

type DocsRsProps = {
  crate: string;
  version?: string;
  prefix?: string;
};

const logger = createLogger("LoggerDefsRustdocs");

export function DefsDocsRs(props: DocsRsProps): Expression {
  return (
    <impure
      fun={async (ctx) => {
        // TODO: Check if we already have this json cached.
        // Request JSON from docs.rs with the appropriate URL
        const jsonUrl = `https://docs.rs/crate/${props.crate}/${
          props.version || "latest"
        }/json/${JSON_VERSION}`;
        // TODO: log an error if this request fails.
        const res = await fetch(jsonUrl);

        console.log({ jsonUrl, res });

        switch (res.status) {
          case 404:
          case 500:
            logger.error(ctx, `Could not fetch docs.rs JSON from ${jsonUrl}`);
        }

        // unzstds it ()
        const compressed = new Uint8Array(await res.arrayBuffer());

        await init();

        const decompressed = decompress(compressed);
        const jsonString = new TextDecoder().decode(decompressed);

        const docsJson = JSON.parse(jsonString);

        return (
          <DefsRustDocs
            crate={props.crate}
            json={docsJson}
            prefix={props.prefix}
          />
        );
      }}
    />
  );
}

// The parser itself.

const innerToUrlIdentifier: Record<string, string> = {
  "function": "fn",
  "type_alias": "type",
  "trait": "trait",
  "struct": "struct",
  "enum": "enum",
  "constant": "constant",
};

/** This works with version 46 of the Rustdoc JSON schema */
function walkIndex(
  /** The docs record to pull info from */
  rustdocs: any,
  /** The ID of the index node to walk */
  id: number,
  /** The record of defs */
  defs: Record<string, { url: string; name: string; kind: SymbolKind }>,
  /** The module path which has been built up to this point.  */
  path: string[],
  /** The URL root to prefix to all URLs */
  urlRoot: string,
  /** is this provided by an impl? */
  isChildOfInner?: string,
) {
  const item = rustdocs["index"][id];

  if (!item) {
    // This is probably a foreign type
    // No easy way around it without crossreferencing multiple rustdoc JSON blobs.
    // https://github.com/rust-lang/rust/issues/106697
    return;
  }

  const itemType = Object.keys(item["inner"])[0];

  switch (itemType) {
    case "module": {
      if (item["visibility"] === "public") {
        const name = item["name"];

        const defId = [...path, name].join("-");
        const url = `${urlRoot}/${[...path, name].join("/")}/index.html`;

        defs[defId] = { url, name, kind: "module" };

        // Follow the items within.
        for (const id of item["inner"]["module"]["items"]) {
          walkIndex(rustdocs, id, defs, [...path, name], urlRoot);
        }
      } else {
        // Follow the items within.
        for (const id of item["inner"]["module"]["items"]) {
          walkIndex(rustdocs, id, defs, [...path], urlRoot);
        }
      }

      break;
    }
    case "use": {
      const useId = item["inner"]["use"]["id"];

      walkIndex(rustdocs, useId, defs, path, urlRoot);

      break;
    }
    case "impl": {
      // TODO: Add defs for trait implementations
      // Tricky because of generics being involved,
      // so it's annoying to build URLs for
      // and difficult to imagine ergonomic def IDs

      for (const id of item["inner"]["impl"]["items"]) {
        walkIndex(rustdocs, id, defs, [...path], urlRoot, "struct");
      }

      break;
    }
    case "assoc_type": {
      const rootId = rustdocs["index"][rustdocs["root"]]["crate_id"];

      if (item["crate_id"] !== rootId) {
        break;
      }

      const structName = path.pop();

      const defId = [...path, structName, item["name"]].join("-");
      const url = `${urlRoot}/${
        path.join("/")
      }/${isChildOfInner}.${structName}.html#associatedtype.${item["name"]}`;

      defs[defId] = {
        url,
        name: `${structName}::${item["name"]}`,
        kind: "type",
      };

      break;
    }
    case "function": {
      const itemName = item["name"];

      const defId = [...path, itemName].join("-");

      if (isChildOfInner) {
        const parentName = path.pop();

        const methodKind = isChildOfInner === "trait" ? "tymethod" : "method";

        const url = `${urlRoot}/${
          path.join("/")
        }/${isChildOfInner}.${parentName}.html#${methodKind}.${itemName}`;

        defs[defId] = { url, name: `${parentName}::${itemName}`, kind: "fn" };
      } else {
        const url = `${urlRoot}/${path.join("/")}/${
          innerToUrlIdentifier[itemType]
        }.${itemName}.html`;

        defs[defId] = { url, name: itemName, kind: "fn" };
      }

      break;
    }
    case "trait": {
      const itemName = item["name"];

      const defId = [...path, itemName].join("-");
      const url = `${urlRoot}/${path.join("/")}/${
        innerToUrlIdentifier[itemType]
      }.${itemName}.html`;

      defs[defId] = { url, name: itemName, kind: "interface" };

      for (const id of item["inner"]["trait"]["items"]) {
        walkIndex(rustdocs, id, defs, [...path, itemName], urlRoot, "trait");
      }

      break;
    }
    case "struct": {
      const itemName = item["name"];

      const defId = [...path, itemName].join("-");
      const url = `${urlRoot}/${path.join("/")}/${
        innerToUrlIdentifier[itemType]
      }.${itemName}.html`;

      defs[defId] = { url, name: itemName, kind: "type" };

      // And now follow the impls!
      for (const id of item["inner"]["struct"]["impls"]) {
        walkIndex(rustdocs, id, defs, [...path, itemName], urlRoot, "struct");
      }

      break;
    }
    case "type_alias":
    case "constant":
    case "enum": {
      const itemName = item["name"];

      const defId = [...path, itemName].join("-");
      const url = `${urlRoot}/${path.join("/")}/${
        innerToUrlIdentifier[itemType]
      }.${itemName}.html`;

      defs[defId] = { url, name: itemName, kind: "type" };
      break;
    }
    default:
      console.group("[TODO]", itemType, item["name"]);
      console.log(item);
      console.log(path);
      console.groupEnd();
  }
}

export function createDefs(
  crateName: string,
  docsJson: any,
  prefix?: string,
): Record<string, { url: string; name: string; kind: SymbolKind }> {
  if (docsJson["format_version"] !== JSON_VERSION) {
    throw Error(
      `Expected Rustdoc format version ${JSON_VERSION}, got ${
        docsJson["format_version"]
      }`,
    );
  }

  const crateVersion = docsJson["crate_version"];
  const rootId = docsJson["root"];

  const rootUrl = `https://docs.rs/${crateName}/${crateVersion}`;

  const defs: Record<string, { url: string; name: string; kind: SymbolKind }> =
    {};

  walkIndex(docsJson, rootId, defs, [], rootUrl);

  if (prefix) {
    const prefixedDefs: Record<
      string,
      { url: string; name: string; kind: SymbolKind }
    > = {};

    for (const key in defs) {
      const val = defs[key];

      prefixedDefs[`${prefix}${key}`] = val;
    }

    return prefixedDefs;
  }

  return defs;
}
