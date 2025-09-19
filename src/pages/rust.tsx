import { File } from "macromania-outfs";
import { PageTemplate } from "../pageTemplate.tsx";
import { A, Li, P, Ul } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { DefsRustDocs } from "macromania-defs-rustdocs";
import { Hsection } from "macromania-hsection";
import { Gwil } from "../macros.tsx";

const rustdocs_willow_data_model = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/willow_data_model.json"),
);

const rustdocs_meadowcap = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/meadowcap.json"),
);

const rustdocs_sideload = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/willow_sideload.json"),
);

const rustdocs_willow_25 = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/willow_25.json"),
);

const rustdocs_simple_store_sled = JSON.parse(
  await Deno.readTextFile(
    "./rustdocs/source_json/willow_store_simple_sled.json",
  ),
);

export const rust = (
  <File name="index.html">
    <PageTemplate
      htmlTitle="Rust"
      headingId="rust"
      heading="Willow in Rust"
    >
      <DefsRustDocs
        crate="willow_data_model"
        json={rustdocs_willow_data_model}
        prefix="rs-"
        typeClass="rustic type"
        functionClass="rustic function"
        interfaceClass="rustic interface"
        depsCss={[{ dep: ["pseudocode.css"] }]}
        cachingPath={["rustdocs", "cached_defs"]}
      />
      <DefsRustDocs
        crate="meadowcap"
        json={rustdocs_meadowcap}
        prefix="rs-"
        typeClass="rustic type"
        functionClass="rustic function"
        interfaceClass="rustic interface"
        depsCss={[{ dep: ["pseudocode.css"] }]}
        cachingPath={["rustdocs", "cached_defs"]}
      />
      <DefsRustDocs
        crate="willow_sideload"
        json={rustdocs_sideload}
        prefix="rs-"
        typeClass="rustic type"
        functionClass="rustic function"
        interfaceClass="rustic interface"
        depsCss={[{ dep: ["pseudocode.css"] }]}
        cachingPath={["rustdocs", "cached_defs"]}
      />
      <DefsRustDocs
        crate="willow-store-simple-sled"
        json={rustdocs_simple_store_sled}
        prefix="rs-"
        typeClass="rustic type"
        functionClass="rustic function"
        interfaceClass="rustic interface"
        depsCss={[{ dep: ["pseudocode.css"] }]}
        cachingPath={["rustdocs", "cached_defs"]}
      />
      <DefsRustDocs
        crate="willow_25"
        json={rustdocs_willow_25}
        prefix="rs-"
        typeClass="rustic type"
        functionClass="rustic function"
        interfaceClass="rustic interface"
        depsCss={[{ dep: ["pseudocode.css"] }]}
        cachingPath={["rustdocs", "cached_defs"]}
      />

      <P>
        <Gwil>
          Illustration of Betty with a cowboy hat on riding a giant crab here.
        </Gwil>
        We've implemented Willow's <R n="specifications" />{"  "}
        in Rust. You can add secure, efficient, peer-to-peer storage to your
        applications by using these crates:
      </P>
      <Ul>
        <Li>
          <R n="rs-willow_data_model" />: Utilities and traits for working with
          Willow's <R n="data_model" />.
        </Li>
        <Li>
          <R n="rs-meadowcap" />: Mint and verify capabilities with{" "}
          <R n="meadowcap" />.
        </Li>
        <Li>
          <R n="rs-willow_sideload" />: Create and ingest <Rs n="drop" />{" "}
          with the <R n="sideloading" />.
        </Li>
        <Li>
          <R n="rs-wgps" />: Securely and efficiently sync stores using{" "}
          <R n="wgps" />.
        </Li>
        <Li>
          <R n="rs-willow_store_simple_sled" />: sled-powered persistent storage
          implementing the <R n="rs-willow_data_model-Store" /> trait.
        </Li>
        <Li>
          <R n="rs-willow_25" />: All of the above preconfigured with secure and
          efficient parameters from <R n="willow25" />.
        </Li>
      </Ul>

      <Hsection n="rs_tutorials" title="Tutorials">
        <P>
          Learn everything you need to get started with these step-by-step
          tutorials.
        </P>
        <Ul>
          <Li>
            <R n="tut-path">Create a Path</R>
          </Li>
          <Li>
            <R n="tut-entry">Create an Entry</R>
          </Li>
          <Li>
            <R n="tut-grouping">Work with groupings</R>
          </Li>
          <Li>
            <R n="tut-caps">Create and use capabilities</R>
          </Li>
          <Li>
            <R n="tut-store">Work with a Store</R>
          </Li>
          <Li>
            <R n="tut-drop">Create and ingest a sidedrop</R>
          </Li>
        </Ul>
      </Hsection>

      <Hsection n="rs-contribute" title="Contribute">
        <P>
          Willow's Rust implementations are open source and free for all to use
          and modify. They are provided as a public good, and have been built
          upon the hard work of volunteers, and the support of our donors. If
          you'd like to contribute to our implementations, please see the{" "}
          <A
            clazz="external"
            href="https://github.com/earthstar-project/willow-rs/"
          >
            willow-rs Git repository
          </A>.
        </P>
      </Hsection>
    </PageTemplate>
  </File>
);
