import { Dir, File } from "macromania-outfs";
import { PageTemplate } from "../../../pageTemplate.tsx";
import { Code, Li, Ol, P } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import {
  Gwil,
  RustSample,
  TerminalInput,
  TerminalOutput,
} from "../../../macros.tsx";

export const tutorial_entry = (
  <Dir name="entry">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Tutorial: Create an Entry"
        headingId="tut-entry"
        heading="Tutorial: Create an Entry"
        toc
        parentId="rust"
      >
        <P>
          <Gwil>And indicate that this'll take like ten minutes.</Gwil>
          In this tutorial you will construct and compare <Rs n="Entry" />{" "}
          using the <R n="rs-willow_25-Entry" /> API.
        </P>

        <Hsection title="Prerequisites" n="tut-entry-prereq">
          <P>
            A basic knowledge of the Rust programming language and executing
            commands in the terminal will be helpful for completing this
            tutorial
          </P>

          <P>
            Additionally, knowledge of the <R n="rs-willow_25-Path" />{" "}
            API would be helpful. If you're not yet familiar, please see our
            {" "}
            <R n="tut-create_a_path">dedicated tutorial for paths</R>.
          </P>
        </Hsection>

        <Hsection title="Setup" n="tut-entry-setup">
          <Ol>
            <Li>
              Create a new directory on your filesystem and name it something
              like <Code>willow-entry</Code>.
            </Li>
            <Li>
              Using your terminal, run <TerminalInput>cargo init</TerminalInput>
              {" "}
              within the newly created directory.
            </Li>
            <Li>
              After than, run{" "}
              <TerminalInput>cargo add willow_25</TerminalInput>.
            </Li>
          </Ol>
        </Hsection>

        <Hsection title="Create an entry" n="tut-entry-1">
          <P>
            We'll now create a new <R n="rs-willow_25-Entry" />{" "}
            and all its constituent fields.
          </P>

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

        <Hsection title="Summary" n="tut-entry-summary">
          <P>
            In this tutorial we used the <R n="rs-willow_25-Entry" />{" "}
            API to create and compare entries. We also used various APIs from
            the <R n="rs-willow_25" /> crate, such as{" "}
            <R n="rs-willow_25-NamespaceId25" /> and{" "}
            <R n="rs-willow_25-PayloadDigest25" />, to provide the details we
            needed to create an <R n="rs-willow_25-Entry" />.
          </P>

          <P>
            <Rs n="Path" />{" "}
            come into their element when you have many of them. In the next
            tutorial, we will <R n="tut-groupings">work with groupings</R>.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
