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

export const tutorial_paths = (
  <Dir name="path">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Tutorial: Create a path"
        headingId="tut-create_a_path"
        heading="Tutorial: Create a path"
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

        <Hsection title="Create a path with components" n="tut-path-2">
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
            The output from running <TerminalInput>cargo run</TerminalInput>
            {" "}
            should be as follows:
          </P>

          <TerminalOutput
            path={["src", "code_samples", "tut_paths", "02_output.txt"]}
          />
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
