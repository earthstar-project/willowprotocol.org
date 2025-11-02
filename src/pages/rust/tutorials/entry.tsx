import { Code, Li, P, Ul } from "macromania-html";
import { R } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import { RustSample, TerminalInput, TerminalOutput } from "../../../macros.tsx";
import { TutorialTemplate } from "../tutorials.tsx";

export const tutorial_entry = (
  <TutorialTemplate
    name="entry"
    preamble={
      <P>
        We'll now create a new <R n="rs-willow25-entry-Entry" />{" "}
        and all its constituent fields.
      </P>
    }
    deps={["willow25"]}
    title="Create an entry"
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow25-paths-Path" />{" "}
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

      <Hsection title="Create an Entry based off another one" n="tut-entry-2">
        <P>
          Next, we'll create an <R n="rs-willow25-entry-Entry" />{" "}
          which is mostly identical to an earlier one.
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
                line: 16,
                character: 0,
              },
              end: {
                line: 23,
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
                line: 18,
                character: 0,
              },
              end: {
                line: 35,
                character: 1,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection
        title="Compare entries"
        n="tut-entry-3"
      >
        <P>
          Finally, we'll compare how the two{" "}
          <R n="rs-willow25-entry-Entry">Entries</R> relate to each other.
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
                line: 24,
                character: 0,
              },
              end: {
                line: 28,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />

        <P>
          When running this code with{" "}
          <TerminalInput>cargo run</TerminalInput>, all assertions should pass!
        </P>
      </Hsection>

      <Hsection title="Summary" n="tut-entry-summary">
        <P>
          In this tutorial we used the <R n="rs-willow25-entry-Entry" />{" "}
          API to create and compare entries:
        </P>

        <Ul>
          <Li>
            We used an <R n="rs-willow25-entry-EntryBuilder" />{" "}
            to construct an immutable <R n="rs-willow25-entry-Entry" />.
          </Li>
          <Li>
            We used the <R n="rs-willow25-entry-Entry-prefilled_builder" />{" "}
            method to create an entry based on a prior one.
          </Li>
          <Li>
            We accessed fields of the entries with methods such as{" "}
            <R n="rs-willow25-entry-Entrylike-namespace_id" />.
          </Li>
          <Li>
            We compared entries with methods such as{" "}
            <R n="rs-willow25-entry-EntrylikeExt-is_newer_than" /> and{" "}
            <R n="rs-willow25-entry-EntrylikeExt-is_pruned_by" />.
          </Li>
        </Ul>

        <P>
          Having created some individual entries, you can now move to the
          tutorial for working with{" "}
          <R n="tut-grouping">groupings of entries</R>.
        </P>
      </Hsection>
    </>
  </TutorialTemplate>
);
