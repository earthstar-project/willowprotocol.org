import { Code, Li, P, Ul } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import {
  Gwil,
  RustSample,
  TerminalInput,
  TerminalOutput,
} from "../../../macros.tsx";
import { TutorialTemplate } from "../tutorials.tsx";

export const tutorial_groupings = (
  <TutorialTemplate
    name="grouping"
    title="Work with groupings"
    preamble={
      <P>
        <Gwil>And indicate that this'll take like ten minutes.</Gwil>
        In this tutorial you will construct and compare various{" "}
        <Rs n="grouping_entries">entry groupings</Rs> with the{" "}
        <R n="rs-willow_data_model-grouping-Range" />,{" "}
        <R n="rs-willow_25-Range3d" />, and <R n="rs-willow_25-Area" /> APIs.
      </P>
    }
    deps={["willow_25", "willow_data_model"]}
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow_25-Entry" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-entry">dedicated tutorial for entries</R>.
      </P>
    }
  >
    <>
      <Hsection title="Range" n="tut-grouping-1">
        <P>
          Firstly we'll create a few <R n="rs-willow_25-Range">Ranges</R>{" "}
          and compare them.
        </P>

        <P>
          Open{" "}
          <Code>src/main.rs</Code>, delete its contents, and enter the
          following:
        </P>

        <RustSample path={["src", "code_samples", "tut_grouping", "01.rs"]} />

        <P>
          In your terminal, run{" "}
          <TerminalInput>cargo run</TerminalInput>, and you should see the
          following output:
        </P>

        <TerminalOutput
          path={["src", "code_samples", "tut_grouping", "01_output.txt"]}
        />
      </Hsection>

      <Hsection title="Areas" n="tut-grouping-2">
        <P>
          Next we'll create some <R n="rs-willow_25-Area">Areas</R> and some
          {" "}
          <R n="rs-willow_25-Entry">Entries</R>
          to test against them.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_grouping", "02.rs"]}
          decorations={[
            {
              start: {
                line: 0,
                character: 0,
              },
              end: {
                line: 3,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 32,
                character: 0,
              },
              end: {
                line: 85,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />

        <P>
          In your terminal, run{" "}
          <TerminalInput>cargo run</TerminalInput>, and you should see the
          following output:
        </P>

        <TerminalOutput
          path={["src", "code_samples", "tut_grouping", "02_output.txt"]}
          decorations={[
            {
              start: {
                line: 11,
                character: 0,
              },
              end: {
                line: 14,
                character: 59,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Summary" n="tut-grouping-summary">
        <P>
          In this tutorial, we explored some of Willow's{" "}
          <R n="grouping_entries">entry groupings</R>:
        </P>
        <Ul>
          <Li>
            We created a few{" "}
            <R n="rs-willow_25-Range">Ranges</R>, compared them, and created new
            intersecting ranges from them.
          </Li>
          <Li>
            Created some{"  "}
            <R n="rs-willow_25-Entry">Entries</R>, and tested if they were
            included by some <R n="rs-willow_25-Area">Areas</R> we'd created.
          </Li>
        </Ul>

        <P>
          We've now practiced everything we need to move on to the next
          tutorial: <R n="tut-caps">Create a capability</R>.
        </P>
      </Hsection>
    </>
  </TutorialTemplate>
);
