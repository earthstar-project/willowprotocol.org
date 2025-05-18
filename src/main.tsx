import { Context } from "macromania";
import { LayoutStyles } from "./layoutStyles.tsx";
import { index } from "./pages/index.tsx";
import { misc_definitions } from "./pages/misc_definitions.tsx";
import { specs } from "./pages/specs.tsx";
import { data_model } from "./pages/specs/data_model.tsx";
import { willow25 } from "./pages/specs/willow25.tsx";
import { e2e } from "./pages/specs/e2e.tsx";
import { rbsr } from "./pages/specs/rbsr.tsx";
import { sync } from "./pages/specs/sync.tsx";
import { sideloading } from "./pages/specs/sideloading.tsx";
import { grouping_entries } from "./pages/specs/grouping_entries.tsx";
import { private_interest_overlap } from "./pages/specs/private_interest_overlap.tsx";
import { handshake_and_encryption } from "./pages/specs/handshake_and_encryption.tsx";
import { meadowcap } from "./pages/specs/meadowcap.tsx";
import { lcmux } from "./pages/specs/lcmux.tsx";
import { encodings } from "./pages/specs/encodings.tsx";
import { more } from "./pages/more.tsx";
import { about_us } from "./pages/more/about_us.tsx";
import { threedstorage } from "./pages/more/3dstorage.tsx";
import { changes } from "./pages/more/changes.tsx";
import { willow_compared } from "./pages/more/willow_compared.tsx";
import { projects_and_communities } from "./pages/more/projects_and_communities.tsx";
import { timestamps_really } from "./pages/more/timestamps_really.tsx";
import { why_willow } from "./pages/more/why_willow.tsx";
import { ScriptDependencyInfo } from "macromania-html-utils";
import { Config } from "macromania-config";
import { ConfigPseudocode } from "macromania-pseudocode";
import { ConfigKatex } from "macromania-katex";
import { ConfigHsection } from "macromania-hsection";
import { ConfigPreviews, PreviewScopePushWrapper } from "macromania-previews";
import { ConfigDefref } from "macromania-defref";
import { ConfigWip } from "macromania-wip";
import { Dir, File } from "macromania-outfs";
import { ServerRoot } from "macromania-webserverroot";
import { Assets } from "macromania-assets";
import { Div } from "macromania-html";
import { RenderAllWips } from "macromania-wip";

const ctx = new Context();

const prettyPreviewsInfo: ScriptDependencyInfo = {
  dep: ["pretty_previews.js"],
  scriptProps: { defer: true, type: "module" },
};

const refHighlighting: ScriptDependencyInfo = {
  dep: ["defs.js"],
  scriptProps: { defer: true, type: "module" },
};

const exp = (
  <Config
    options={[
      <ConfigPseudocode
        cssDeps={[{ dep: ["pseudocode.css"] }]}
        jsDeps={[{
          dep: ["pseudocode.js"],
          scriptProps: { defer: true, type: "module" },
        }]}
      />,
      <ConfigKatex stylesheet={["katex.min.css"]} />,
      <ConfigHsection
        titleRenderPre={(ctx, numbering) => {
          return "";
        }}
      />,
      <ConfigPreviews
        previewPath={["build", "previews"]}
        cssDeps={[{ dep: ["index.css"] }, {
          dep: [
            "pseudocode.css",
          ], /* The proper fix would be to add refDependency support to defref and configure macromania-rustic to use that feature */
        }]}
        jsDeps={[prettyPreviewsInfo]}
      />,
      <ConfigDefref
        depsCssDef={[]}
        depsJsDef={[prettyPreviewsInfo, refHighlighting]}
        depsCssPreview={[]}
        depsJsPreview={[]}
        depsCssRef={[]}
        depsJsRef={[prettyPreviewsInfo, refHighlighting]}
      />,
      <ConfigWip
        // hideWIP // uncomment this line to hide all WIP annotations and silence the warning
      />,
    ]}
  >
    {/* Create some assets before the "real" build step. */}
    <Dir clean={false} name="src">
      <Dir clean={false} name="assets">
        <File mode="assertive" name="layout.css">
          <LayoutStyles
            htmlFontSizeInPx={16}
            paddingLeft={0.8}
            paddingRight={0.8}
            maxMain={32}
            paddingMarginalia={2}
            marginalia={18}
            paddingToc={1.6}
            toc={13}
            // dev
          />
        </File>
      </Dir>
    </Dir>

    <Dir name="build">
      <ServerRoot url="">
        <Dir name="assets">
          {/* See https://github.com/worm-blossom/macromania-assets */}
          <Assets input={["src", "assets"]} assets={{}} />
        </Dir>
        <map
          fun={(evaled, _ctx) => {
            // Not really mapping anything here, just ensuring that printing the list of all remaining todos is done after all todos have been evaluated.

            return (
              <>
                <File name="todos.html">
                  <RenderAllWips />
                </File>
                {evaled}
              </>
            );
          }}
        >
          <PreviewScopePushWrapper
            wrapper={(_ctx, preview) => {
              return <Div id="wrapContent">{preview}</Div>;
            }}
          >
            {index}
            {misc_definitions}

            <Dir name="specs">
              {specs}
              {data_model}
              {e2e}
              {meadowcap}
              {encodings}
              {sideloading}
              {sync}
              {rbsr}
              {lcmux}
              {grouping_entries}
              {private_interest_overlap}
              {handshake_and_encryption}
              {willow25}
            </Dir>

            <Dir name="more">
              {more}
              {threedstorage}
              {about_us}
              {changes}
              {willow_compared}
              {projects_and_communities}
              {timestamps_really}
              {why_willow}
            </Dir>
          </PreviewScopePushWrapper>
        </map>
      </ServerRoot>
    </Dir>
  </Config>
);

ctx.evaluate(exp);
