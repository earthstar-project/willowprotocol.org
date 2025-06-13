import { Dir, File } from "macromania-outfs";
import { PageTemplate } from "../../../pageTemplate.tsx";
import { Code, Li, Ol, P, Ul } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import {
  Gwil,
  RustSample,
  TerminalInput,
  TerminalOutput,
} from "../../../macros.tsx";

export const tutorial_paths = (
  <Dir name="path">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Tutorial: Create a path"
        headingId="tut-create_a_path"
        heading="Tutorial: Create a path"
        toc
        parentId="rust"
      >
        <P>
          <Gwil>And indicate that this'll take like ten minutes.</Gwil>
          In this tutorial you will construct and compare <Rs n="Path" />{" "}
          using the <R n="rs-willow_data_model-Path" /> API.
        </P>

        <Hsection title="Prerequisites" n="tut-path-prereq">
          <P>
            A basic knowledge of the Rust programming language and executing
            commands in the terminal will be helpful for completing this
            tutorial.
          </P>
        </Hsection>

        <Hsection title="Setup" n="tut-path-setup">
          <Ol>
            <Li>
              Create a new directory on your filesystem and name it something
              like <Code>willow-paths</Code>.
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

        <Hsection title="Construct an empty path" n="tut-path-1">
          <P>
            We'll now create an empty <R n="rs-willow_data_model-Path" /> using
            {" "}
            <R n="rs-willow_data_model-Path-new_empty" />.
          </P>

          <P>
            Open{" "}
            <Code>src/main.rs</Code>, delete its contents, and enter the
            following:
          </P>

          <RustSample path={["src", "code_samples", "tut_paths", "01.rs"]} />

          <P>
            In your terminal, run{" "}
            <TerminalInput>cargo run</TerminalInput>, and you should see the
            following output:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "01_output.txt"]}
          />
        </Hsection>

        <Hsection title="Append components to a path" n="tut-path-2">
          <P>
            We'll now create two <R n="rs-willow_data_model-Component" />{" "}
            and append them to a <R n="rs-willow_data_model-Path" /> using{" "}
            <R n="rs-willow_data_model-Path-append" />.
          </P>

          <P>
            Add the following code to <Code>src/main.rs</Code>:
          </P>

          <RustSample
            path={["src", "code_samples", "tut_paths", "02.rs"]}
            decorations={[
              {
                start: {
                  line: 6,
                  character: 0,
                },
                end: {
                  line: 12,
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
            again, and you should see the following input:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "02_output.txt"]}
            decorations={[
              {
                start: {
                  line: 1,
                  character: 0,
                },
                end: {
                  line: 1,
                  character: 103,
                },
                properties: {
                  class: "addition",
                },
              },
            ]}
          />
        </Hsection>

        <Hsection
          title="Append slice of components to a path"
          n="tut-path-3"
        >
          <P>
            We'll now append a slice of <R n="rs-willow_data_model-Component" />
            {" "}
            using <R n="rs-willow_data_model-Path-append_slice" />.
          </P>

          <P>
            Add the following code to <Code>src/main.rs</Code>:
          </P>

          <RustSample
            path={["src", "code_samples", "tut_paths", "03.rs"]}
            decorations={[
              {
                start: {
                  line: 13,
                  character: 0,
                },
                end: {
                  line: 15,
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
            again, and you should see the following output:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "03_output.txt"]}
            decorations={[
              {
                start: {
                  line: 2,
                  character: 0,
                },
                end: {
                  line: 2,
                  character: 109,
                },
                properties: {
                  class: "addition",
                },
              },
            ]}
          />
        </Hsection>

        <Hsection title="Create a new path with a slice" n="tut-path-4">
          <P>
            We'll now create a new <R n="rs-willow_data_model-Path" />{" "}
            with a slice of many <R n="rs-willow_data_model-Component" />.
          </P>

          <P>
            Add the following code to <Code>src/main.rs</Code>:
          </P>

          <RustSample
            path={["src", "code_samples", "tut_paths", "04.rs"]}
            decorations={[
              {
                start: {
                  line: 16,
                  character: 0,
                },
                end: {
                  line: 19,
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
            again, and you should see the following output:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "04_output.txt"]}
            decorations={[
              {
                start: {
                  line: 3,
                  character: 0,
                },
                end: {
                  line: 3,
                  character: 148,
                },
                properties: {
                  class: "addition",
                },
              },
            ]}
          />
        </Hsection>

        <Hsection
          title="Check if a path is a prefix of another"
          n="tut-path-5"
        >
          <P>
            Next we'll use <R n="rs-willow_data_model-Path-is_prefix_of" />{" "}
            to check if one <R n="rs-willow_data_model-Path" /> is a{" "}
            <R n="path_prefix" /> of another.
          </P>

          <P>
            Add the following code to <Code>src/main.rs</Code>:
          </P>

          <RustSample
            path={["src", "code_samples", "tut_paths", "05.rs"]}
            decorations={[
              {
                start: {
                  line: 20,
                  character: 0,
                },
                end: {
                  line: 26,
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
            again, and you should see the following output:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "05_output.txt"]}
            decorations={[
              {
                start: {
                  line: 4,
                  character: 0,
                },
                end: {
                  line: 4,
                  character: 203,
                },
                properties: {
                  class: "addition",
                },
              },
            ]}
          />
        </Hsection>

        <Hsection title="Iterate through all prefixes of a path" n="tut-path-6">
          <P>
            Next we'll iterate through all of a{" "}
            <R n="rs-willow_data_model-Path" />'s possible prefixes using{" "}
            <R n="rs-willow_data_model-Path-all_prefixes" />.
          </P>

          <P>
            Add the following code to <Code>src/main.rs</Code>:
          </P>

          <RustSample
            path={["src", "code_samples", "tut_paths", "06.rs"]}
            decorations={[
              {
                start: {
                  line: 27,
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
            Run <TerminalInput>cargo run</TerminalInput>{" "}
            again, and you should see the following output:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "06_output.txt"]}
            decorations={[
              {
                start: {
                  line: 5,
                  character: 0,
                },
                end: {
                  line: 8,
                  character: 144,
                },
                properties: {
                  class: "addition",
                },
              },
            ]}
          />
        </Hsection>

        <Hsection
          title="Determine the longest common prefix of two paths"
          n="tut-path-7"
        >
          <P>
            Finally we'll use{" "}
            <R n="rs-willow_data_model-Path-longest_common_prefix" />{" "}
            to determine the longest common prefix of two{" "}
            <R n="rs-willow_data_model-Path" />s.
          </P>

          <P>
            Add the following code to <Code>src/main.rs</Code>:
          </P>

          <RustSample
            path={["src", "code_samples", "tut_paths", "07.rs"]}
            decorations={[
              {
                start: {
                  line: 31,
                  character: 0,
                },
                end: {
                  line: 37,
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
            again, and you should see the following output:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "07_output.txt"]}
            decorations={[
              {
                start: {
                  line: 9,
                  character: 0,
                },
                end: {
                  line: 9,
                  character: 108,
                },
                properties: {
                  class: "addition",
                },
              },
            ]}
          />
        </Hsection>

        <Hsection title="Summary" n="tut-path-summary">
          <P>
            In this tutorial we used the
            <R n="rs-willow_data_model-Path" />{" "}
            API to construct and compare paths:
          </P>

          <Ul>
            <Li>
              We added the <Code>willow_25</Code>{" "}
              crate as a dependency to a Rust project.
            </Li>
            <Li>You constructed an empty path.</Li>
            <Li>You appended component to an empty path.</Li>
            <Li>You appended a slice of components to an empty path.</Li>
            <Li>You constructed a new path with a slice of components.</Li>
            <Li>You checked if one path was a prefix of another.</Li>
            <Li>You iterated through all possible prefixes of a path.</Li>
            <Li>You determined the longest common prefix of two paths.</Li>
          </Ul>

          <P>
            <Rs n="Path" /> are perhaps the most fundamental concept of the{" "}
            <R n="data_model" />, and with this experience you're ready to{" "}
            <R n="tut-entry">create an entry</R>.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
