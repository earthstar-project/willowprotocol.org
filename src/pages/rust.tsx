import { File } from "macromania-outfs";
import { PageTemplate } from "../pageTemplate.tsx";
import { A, Img, Li, P, Ul } from "macromania-html";
import { R } from "macromania-defref";
import { DefsRustDocs } from "macromania-defs-rustdocs";
import { Hsection } from "macromania-hsection";
import { ResolveAsset } from "macromania-assets";
import { Marginale } from "macromania-marginalia";

const rustdocs_willow_data_model = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/willow_data_model.json"),
);

const rustdocs_willow25 = JSON.parse(
  await Deno.readTextFile("./rustdocs/source_json/willow25.json"),
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
        crate="willow25"
        json={rustdocs_willow25}
        prefix="rs-"
        typeClass="rustic type"
        functionClass="rustic function"
        interfaceClass="rustic interface"
        depsCss={[{ dep: ["pseudocode.css"] }]}
        cachingPath={["rustdocs", "cached_defs"]}
      />

      <P>
        <Marginale>
          <Img
            src={<ResolveAsset asset={["rust", "crab.png"]} />}
            alt="Betty is riding a giant crab, while Alfie screams, hanging on to a claw."
          />
        </Marginale>
        We're implementing Willow's <R n="specifications">specifications</R>
        {" "}
        in Rust. You can use them through the <R n="rs-willow25" />{" "}
        crate, which pre-configures all the specifications with secure,
        efficient parameters.
      </P>
      <P>
        The <R n="rs-willow25" /> crate currently implements the{" "}
        <R n="data_model" />. Over the coming weeks, we'll add implementations
        of <R n="meadowcap" />, persistent storage, and the{" "}
        <R n="willow_drop_format" />.
      </P>
      <Hsection n="rs_tutorials" title="Tutorials">
        <P>
          Get started with our step-by-step tutorials, which we'll be adding to
          as we add more features to <R n="rs-willow25" />.
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
          {
            /* <omnomnom>
            <Li>
              <R n="tut-caps">Create and use capabilities</R>
            </Li>
            <Li>
              <R n="tut-store">Work with a Store</R>
            </Li>
            <Li>
              <R n="tut-drop">Create and ingest a sidedrop</R>
            </Li>
          </omnomnom> */
          }
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
            href="https://codeberg.org/worm-blossom/willow_rs"
          >
            willow-rs Git repository
          </A>.
        </P>
      </Hsection>
    </PageTemplate>
  </File>
);
