import { join, outFullPath, serverPath } from "./deps.ts";
import { Expressions } from "./deps.ts";
import { hrefTo } from "./deps.ts";
import { absoluteOutFsPath } from "./deps.ts";
import { styleName } from "./deps.ts";
import { outFilename } from "./deps.ts";
import { serverUrl } from "./deps.ts";
import {
  A,
  AProps,
  Colors,
  Context,
  createLogger,
  createNamespace,
  DebuggingInformation,
  Expression,
  relative,
} from "./deps.ts";

const l = createLogger("LoggerNamesId");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerNamesId };

const ns = createNamespace<NameInfo>("Html Ids");

/**
 * The information to associate with each name.
 */
export type NameInfo = {
  /**
   * The html id for the element associated with this name. We enforce a
   * conformance to some stricter criteria than the html spec allows, based of
   * the following recommendation from MDN:
   *
   * > To avoid inadvertent errors, only ASCII letters, digits, `_`, and `-`
   * should be used, and the value for an id attribute should start with a
   * letter.
   */
  id: string;
  /**
   * The `url` of the current server when the name was registered, or `null`,
   * if no server was set.
   */
  serverUrl: string | null;
  /**
   * Absolute path components from the server mount to the out file when the
   * name was registered (if no server was specified, then smply the absolute
   * path in the OutFs).
   */
  absolutePath: string[];
};

/**
 * Add a name, with an HTML id (which defaults to the name itself). This
 * function automatically associates the current server URL and path in the
 * OutFS with the name, so that this package can generate hyperlinks to the id.
 *
 * Ids must start with an ASCII letter, followed by any number of ASCII
 * letters, digits, underscores, or minuses. This is not required by the HTML
 * standard, but it ensures that CSS selectors work as expected.
 */
export function addName(ctx: Context, name: string, id?: string) {
  const actualId = id ?? name;

  const currentServerUrl = serverUrl(ctx);
  const absolutePath = serverPath(ctx);

  const fileName = outFilename(ctx);

  if (fileName === null) {
    l.error(
      ctx,
      `Tried adding a name with an associated HTML id, but there is no current file.`,
    );
    l.logGroup(ctx, () => {
      l.error(
        ctx,
        `Must invoke this macro inside a ${Colors.yellow(`<File>`)} macro.`,
      );
    });
    return ctx.halt();
  }

  absolutePath.push(fileName);

  const info: NameInfo = {
    id: actualId,
    serverUrl: currentServerUrl,
    absolutePath: outFullPath(ctx).components,
  };

  ns.addName(ctx, name, info);

  // We check the validity of the id *after* adding the name, so that the more
  // important failure case/error message gets reported first.
  if (!isValidId(actualId)) {
    l.error(
      ctx,
      `Tried adding a name with an invalid id: ${styleId(actualId)}`,
    );
    l.logGroup(ctx, () => {
      l.error(
        ctx,
        `Ids must start with an ASCII letter, followed by any number of ASCII letters, digits, underscores, or minuses.`,
      );
      l.error(
        ctx,
        `This is not required by the HTML standard, but it ensures that CSS selectors work as expected.`,
      );
    });
    return ctx.halt();
  }
}

/**
 * Retrieve the {@linkcode NameInfo} associated with a given name.
 */
export function getName(ctx: Context, name: string): NameInfo | undefined {
  return ns.getName(ctx, name);
}

/**
 * Retrieve the {@linkcode NameInfo} associated with a given name, and the
 * `DebugInformation` about where it was bound.
 */
export function getNameAndDebug(
  ctx: Context,
  name: string,
): [NameInfo, DebuggingInformation] | undefined {
  return ns.getNameAndDebug(ctx, name);
}

/**
 * Create a URL suitable for hyperlinking to the given name.
 * 
 * If a `replacementId` is supplied, uses it instead of the registered id in the link.
 *
 * Returns null if the name has not been bound.
 */
export function hrefToName(ctx: Context, name: string, replacementId?: string): string | null {
  const targetInfo = getName(ctx, name);

  if (targetInfo === undefined) {
    return null;
  } else {
    return `${
      hrefTo(ctx, absoluteOutFsPath(targetInfo.absolutePath))
    }#${replacementId === undefined ? targetInfo.id : replacementId}`;
  }
}

/**
 * Create an `<A>` HTML element, with the `href` attribute being the link to the
 * given `name`, as determined by {@linkcode hrefToName}.
 * 
 * If a `replacementId` is supplied, uses it instead of the registered id in the link.
 */
export function IdA(
  props: AProps & { name: string; children?: Expressions, replacementId?: string; forceHref?: Expression },
): Expression {
  return (
    <impure
      fun={(ctx) => {
        const href = props.forceHref ? props.forceHref : hrefToName(ctx, props.name, props.replacementId);
        if (href === null) {
          if (ctx.mustMakeProgress()) {
            l.warn(
              ctx,
              `Could not resolve name ${
                styleName(props.name)
              }, creating an invalid link.`,
            );
            l.at(ctx);
            return A(props);
          } else {
            return null;
          }
        } else {
          props.href = href;
          return A(props);
        }
      }}
    />
  );
}

const idRegex = /^[A-Za-z][A-Za-z0-9_-]*$/;

function isValidId(id: string): boolean {
  if (id === "") {
    return true;
  }

  return idRegex.test(id);
}

function styleId(id: string): string {
  return Colors.brightMagenta(id);
}
