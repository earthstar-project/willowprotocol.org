import { Code, P } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import { RustSample, TerminalInput, TerminalOutput } from "../../../macros.tsx";
import { TutorialTemplate } from "../tutorials.tsx";

export const tutorial_entry = (
  <TutorialTemplate
    name="entry"
    preamble={
      <P>
        We'll now create a new <R n="rs-willow_25-Entry" />{" "}
        and all its constituent fields.
      </P>
    }
    deps={["willow_25"]}
    title="Create an entry"
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow_25-Path" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-path">dedicated tutorial for paths</R>.
      </P>
    }
  >
    <>
      <Hsection title="Create an entry" n="tut-entry-1">
        <P>
          Open{" "}
          <Code>src/main.rs</Code>, delete its contents, and enter the
          following:
        </P>

        <RustSample path={["src", "code_samples", "tut_entry", "01.rs"]} />

        <P>
          In your terminal, run{" "}
          <TerminalInput>cargo run</TerminalInput>, and you should see the
          following output:
        </P>

        <TerminalOutput
          path={["src", "code_samples", "tut_entry", "01_output.txt"]}
        />
      </Hsection>

      <Hsection title="Compare with another entry" n="tut-entry-2">
        <P>
          Next, we'll compare two <R n="rs-willow_25-Entry">Entries</R> using
          {" "}
          <R n="rs-willow_data_model-Entry-is_newer_than" />.
        </P>

        <P>
          Add the following to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_entry", "02.rs"]}
          decorations={[
            {
              start: {
                line: 25,
                character: 0,
              },
              end: {
                line: 42,
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
          path={["src", "code_samples", "tut_entry", "02_output.txt"]}
          decorations={[
            {
              start: {
                line: 6,
                character: 0,
              },
              end: {
                line: 6,
                character: 27,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection
        title="Check if this entry would be pruned by another"
        n="tut-entry-3"
      >
        <P>
          Next, we'll compare two <R n="rs-willow_25-Entry">Entries</R> using
          {" "}
          <R n="rs-willow_data_model-Entry-is_pruned_by" />.
        </P>

        <P>
          Add the following to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_entry", "03.rs"]}
          decorations={[
            {
              start: {
                line: 43,
                character: 0,
              },
              end: {
                line: 61,
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
          path={["src", "code_samples", "tut_entry", "03_output.txt"]}
          decorations={[
            {
              start: {
                line: 7,
                character: 0,
              },
              end: {
                line: 7,
                character: 33,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Summary" n="tut-entry-summary">
        <P>
          In this tutorial we used the <R n="rs-willow_25-Entry" />{" "}
          API to create and compare entries. We also used various APIs from the
          {" "}
          <R n="rs-willow_25" /> crate, such as{" "}
          <R n="rs-willow_25-NamespaceId25" /> and{" "}
          <R n="rs-willow_25-PayloadDigest25" />, to provide the details we
          needed to create an <R n="rs-willow_25-Entry" />.
        </P>

        <P>
          <Rs n="Entry" />{" "}
          come into their element when you have many of them. In the next
          tutorial, we will <R n="tut-grouping">work with groupings</R>.
        </P>
      </Hsection>
    </>
  </TutorialTemplate>
);
