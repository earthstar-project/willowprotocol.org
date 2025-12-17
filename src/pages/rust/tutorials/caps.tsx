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
        <R n="rs-willow25-authorisation-WriteCapability">Write capabilities</R>
        {" "}
        for <R n="communal_namespace">communal</R> and{" "}
        <R n="owned_namespace">owned</R> namespaces, and use them to create{" "}
        <R n="rs-willow25-authorisation-AuthorisedEntry">AuthorisedEntries</R>.
      </P>
    }
    deps={["willow25", "rand@0.8.0"]}
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow25-groupings-Area" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-grouping">dedicated tutorial for groupings</R>.
      </P>
    }
  >
    <>
      <Hsection title="Communal capabilities" n="tut-caps-1">
        <P>
          First we'll create a{" "}
          <R n="rs-willow25-authorisation-WriteCapability" /> for a{" "}
          <R n="communal_namespace" />.
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

      <Hsection title="Authorising an entry" n="tut-caps-2">
        <P>
          Next we'll use the <R n="rs-willow25-authorisation-WriteCapability" />
          {" "}
          we created and use it to turn an <R n="rs-willow25-entry-Entry" />
          {" "}
          into an <R n="rs-willow25-authorisation-AuthorisedEntry" />.
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
                line: 16,
                character: 0,
              },
              end: {
                line: 30,
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
          decorations={[
            {
              start: {
                line: 14,
                character: 0,
              },
              end: {
                line: 14,
                character: 44,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Owned capabilities and delegation" n="tut-caps-3">
        <P>
          Finally we'll create a{" "}
          <R n="rs-willow25-authorisation-WriteCapability" /> for an{" "}
          <R n="owned_namespace" />, delegate it, and use it to produce an{" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" />.
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
                line: 31,
                character: 0,
              },
              end: {
                line: 65,
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
          decorations={[{
            start: {
              line: 15,
              character: 0,
            },
            end: {
              line: 56,
              character: 41,
            },
            properties: {
              class: "addition",
            },
          }]}
        />
      </Hsection>

      <Hsection title="Summary" n="tut-caps-summary">
        <P>
          In this tutorial, we explored <R n="willow25" />'s authorisation APIs:
        </P>
        <Ul>
          <Li>
            We created an <R n="communal_namespace">communal</R>{" "}
            <R n="rs-willow25-authorisation-WriteCapability" />.
          </Li>
          <Li>
            We then used it to turn an <R n="rs-willow25-entry-Entry" /> into an
            {" "}
            <R n="rs-willow25-authorisation-AuthorisedEntry" />.
          </Li>
          <Li>
            Finally, we created an <R n="owned_namespace">owned</R>{" "}
            <R n="rs-willow25-authorisation-WriteCapability" />, delegated it,
            and used it to turn an <R n="rs-willow25-entry-Entry" /> into an
            {" "}
            <R n="rs-willow25-authorisation-AuthorisedEntry" />
          </Li>
        </Ul>

        <omnomnom>
          {
            /*
          <P>
            We've now practiced everything we need to move on to the next
            tutorial: <R n="tut-store">Working with stores</R>.
          </P>
          */
          }
        </omnomnom>
      </Hsection>
    </>
  </TutorialTemplate>
);
