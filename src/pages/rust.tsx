import { File } from "macromania-outfs";
import { PageTemplate } from "../pageTemplate.tsx";
import { Li, P, Ul } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { DefsRustDocs } from "macromania-defs-rustdocs";
import { Hsection } from "macromania-hsection";
import { Gwil } from "../macros.tsx";

const rustdocs_willow_data_model = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/willow_data_model.json"),
);

const rustdocs_willow_25 = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/willow_25.json"),
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
        crate="willow_25"
        json={rustdocs_willow_25}
        prefix="rs-"
        typeClass="rustic type"
        functionClass="rustic function"
        interfaceClass="rustic interface"
        depsCss={[{ dep: ["pseudocode.css"] }]}
        cachingPath={["rustdocs_defs", "cached_defs"]}
      />

      <P>
        <Gwil>
          Illustration of Betty with a cowboy hat on riding a giant crab here.
        </Gwil>
        Implementations of Willow <R n="specifications" />{" "}
        are available through several Rust crates:
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
          <R n="rs-willow_25" />: All of the above, preconfigured with secure
          and efficient parameters from <R n="willow25" />.
        </Li>
      </Ul>

      <Hsection n="rs_tutorials" title="Tutorials">
        <P>
          <Gwil>
            It would be cool to have some time indications here. Even just
            saying that you could do all the tutorials in x minutes would be
            nice.
          </Gwil>
          Learn the basics of our Rust APIs with step-by-step tutorials.
        </P>
        <Ul>
          <Li>
            <R n="tut-create_a_path">Create a Path</R>
          </Li>
          <Li>
            <R n="tut-entry">Create an Entry</R>
          </Li>
          <Li>Work with groupings</Li>
          <Li>Create a capability</Li>
          <Li>Authorise an entry with Meadowcap</Li>
          <Li>Work with a store</Li>
          <Li>Create and ingest a sidedrop</Li>
          <Li>
            Sync two stores with the WGPS
          </Li>
        </Ul>
      </Hsection>

      <Hsection n="rs_gudies" title="Guides">
        <P>
          If you're already familiar with the basics, we've written some guides
          to help you achieve some common tasks.
        </P>
        <Ul>
          <Li>Create a drop and write it to disk</Li>
          <Li>Configure a WGPS session</Li>
          <Li>Run an always-online peer on a server</Li>
        </Ul>
      </Hsection>
    </PageTemplate>
  </File>
);
