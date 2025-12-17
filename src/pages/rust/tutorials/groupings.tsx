import { Code, Li, P, Ul } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import { RustSample, TerminalInput } from "../../../macros.tsx";
import { TutorialTemplate } from "../tutorials.tsx";

export const tutorial_groupings = (
  <TutorialTemplate
    name="grouping"
    title="Work with groupings"
    preamble={
      <P>
        In this tutorial you will construct and compare various{" "}
        <Rs n="grouping_entries">entry groupings</Rs> with the{" "}
        <R n="rs-willow_data_model-groupings" /> APIs.
      </P>
    }
    deps={["willow25", "willow_data_model"]}
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow25-entry-Entry" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-entry">dedicated tutorial for entries</R>.
      </P>
    }
  >
    <>
      <Hsection title="Range" n="tut-grouping-1">
        <P>
          Firstly we'll create a few{" "}
          <R n="rs-willow_data_model-groupings-WillowRange">WillowRanges</R>
          {" "}
          and check whether they contain an <R n="rs-willow25-entry-Entry" />.
        </P>

        <P>
          Open{" "}
          <Code>src/main.rs</Code>, delete its contents, and enter the
          following:
        </P>

        <RustSample path={["src", "code_samples", "tut_grouping", "01.rs"]} />

        <P>
          In your terminal, run <TerminalInput>cargo run</TerminalInput>{" "}
          to verify that all assertions pass.
        </P>
      </Hsection>

      <Hsection title="Areas" n="tut-grouping-2">
        <P>
          Next we'll create some <R n="rs-willow25-groupings-Area">Areas</R>
          {" "}
          and some <R n="rs-willow25-entry-Entry">Entries</R>{" "}
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
                line: 33,
                character: 0,
              },
              end: {
                line: 63,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />

        <P>
          Run <TerminalInput>cargo run</TerminalInput>{" "}
          again to verify that all assertions pass.
        </P>
      </Hsection>

      <Hsection title="Summary" n="tut-grouping-summary">
        <P>
          In this tutorial, we explored some of Willow's{" "}
          <R n="grouping_entries">entry groupings</R>:
        </P>
        <Ul>
          <Li>
            We created a few{" "}
            <R n="rs-willow_data_model-groupings-WillowRange">WillowRanges</R>
            {" "}
            (by way of creating{" "}
            <R n="rs-willow25-groupings-TimeRange">TimeRanges</R>), created new
            intersecting ranges from them, and used the{" "}
            <R n="rs-willow25-groupings-CoordinatelikeExt-is_in">is_in</R>{" "}
            method to test for entry membership.
          </Li>
          <Li>
            And we created some <R n="rs-willow25-groupings-Area">Areas</R>{" "}
            and did the same things!
          </Li>
        </Ul>
        <P>
          Now that we know about groupings, we can move on to the tutorial for
          {" "}
          <R n="tut-caps">creating and working with capabilities</R>.
        </P>
      </Hsection>
    </>
  </TutorialTemplate>
);
