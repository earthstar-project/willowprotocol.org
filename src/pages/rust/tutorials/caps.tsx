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

export const tutorial_caps = (
  <TutorialTemplate
    name="caps"
    title="Create and use capabilities"
    preamble={
      <P>
        In this tutorial we'll create{" "}
        <R n="rs-willow_25-Capability">Capabilities</R> for{" "}
        <R n="communal_namespace">communal</R> and{" "}
        <R n="owned_namespace">owned</R>
        namespaces, and use them to create{" "}
        <R n="rs-willow_25-AuthorisedEntry">AuthorisedEntries</R>.
      </P>
    }
    deps={["willow_25"]}
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow_25-Area" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-grouping">dedicated tutorial for groupings</R>.
      </P>
    }
  >
    <>
      <Hsection title="Owned capabilities" n="tut-caps-1">
        <P>
          Firstly we'll create a <R n="rs-willow_25-Capability" /> for a{" "}
          <R n="owned_namespace" /> and delegate it.
        </P>

        <P>
          Open{" "}
          <Code>src/main.rs</Code>, delete its contents, and enter the
          following:
        </P>

        <RustSample path={["src", "code_samples", "tut_caps", "01.rs"]} />

        <P>
          In your terminal, run{" "}
          <TerminalInput>cargo run</TerminalInput>, and you should see the
          following output:
        </P>

        <TerminalOutput
          path={["src", "code_samples", "tut_caps", "01_output.txt"]}
        />
      </Hsection>

      <Hsection title="Communal capabilities" n="tut-caps-2">
        <P>
          Next we'll create two <R n="rs-willow_25-Capability">Capabilities</R>
          {" "}
          for a <R n="communal_namespace" /> and delegate it.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_caps", "02.rs"]}
          decorations={[
            {
              start: {
                line: 37,
                character: 0,
              },
              end: {
                line: 60,
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
          path={["src", "code_samples", "tut_caps", "02_output.txt"]}
        />
      </Hsection>

      <Hsection title="Authorised entries" n="tut-caps-3">
        <P>
          Finally we'll create two <R n="rs-willow_25-Entry">Entries</R>{" "}
          and try to create{" "}
          <R n="rs-willow_25-AuthorisationToken">AuthorisationTokens</R>{" "}
          for them using one of the{" "}
          <R n="rs-willow_25-Capability">Capabilities</R> we created.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_caps", "03.rs"]}
          decorations={[
            {
              start: {
                line: 0,
                character: 0,
              },
              end: {
                line: 4,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 62,
                character: 0,
              },
              end: {
                line: 95,
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
          path={["src", "code_samples", "tut_caps", "03_output.txt"]}
        />
      </Hsection>

      <Hsection title="Summary" n="tut-caps-summary">
        <P>
          In this tutorial, we explored <R n="meadowcap" />'s APIs:
        </P>
        <Ul>
          <Li>
            We created an <R n="owned_namespace">owned</R>{" "}
            <R n="rs-willow_25-Capability" /> and delegated it.
          </Li>
          <Li>
            Created two <R n="owned_namespace">communal</R>{" "}
            <R n="rs-willow_25-Capability">Capabilities</R>.
          </Li>
          <Li>
            Used a communal <R n="rs-willow_25-Capability" /> to create an{" "}
            <R n="rs-willow_25-AuthorisationToken" />{" "}
            for an entry, and demonstrated an unauthorised attempt to do so.
          </Li>
        </Ul>

        <P>
          We've now practiced everything we need to move on to the next
          tutorial: <R n="tut-store">Working with stores</R>.
        </P>
      </Hsection>
    </>
  </TutorialTemplate>
);
