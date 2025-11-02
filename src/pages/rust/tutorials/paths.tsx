import { Code, Li, P, Ul } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import { RustSample, TerminalInput, TerminalOutput } from "../../../macros.tsx";
import { TutorialTemplate } from "../tutorials.tsx";

export const tutorial_paths = (
  <TutorialTemplate
    name="path"
    preamble={
      <P>
        In this tutorial you will construct and compare <Rs n="Path" />{" "}
        using the <R n="rs-willow25-paths-Path" /> API.
      </P>
    }
    deps={["willow25"]}
    title="Create a path"
    otherPrereqs={<></>}
  >
    <>
      <Hsection title="Construct an empty path" n="tut-path-1">
        <P>
          We'll now create an empty <R n="rs-willow25-paths-Path" /> using{" "}
          <R n="rs-willow25-paths-Path-new" />.
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
          We'll now create two <R n="rs-willow25-paths-Component">Components</R>
          {" "}
          and append them to a <R n="rs-willow25-paths-Path" /> using{" "}
          <R n="rs-willow25-paths-Path-append_component" />.
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
                character: 45,
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
          We'll now append a slice of{" "}
          <R n="rs-willow25-paths-Component">Components</R> using{" "}
          <R n="rs-willow25-paths-Path-append_components" />.
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
                character: 51,
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
          We'll now create a new <R n="rs-willow25-paths-Path" />{" "}
          with a slice of many <R n="rs-willow25-paths-Component" />.
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
                character: 54,
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
          Next we'll use <R n="rs-willow25-paths-Path-is_prefix_of" />{" "}
          to check if one <R n="rs-willow25-paths-Path" /> is a{" "}
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
                character: 78,
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
          <R n="rs-willow25-paths-Path" />'s possible prefixes using{" "}
          <R n="rs-willow25-paths-Path-all_prefixes" />.
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
                character: 50,
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
          We'll use <R n="rs-willow25-paths-Path-longest_common_prefix" />{" "}
          to determine the longest common prefix of two{" "}
          <R n="rs-willow25-paths-Path" />s.
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
                character: 77,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection
        title="Create a path with the path! macro"
        n="tut-path-8"
      >
        <P>
          Finally we'll use <R n="rs-willow25-paths-path" /> macro{" "}
          to easily create a new <R n="rs-willow25-paths-Path" />.
        </P>

        <P>
          Add the following code to <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_paths", "08.rs"]}
          decorations={[
            {
              start: {
                line: 38,
                character: 0,
              },
              end: {
                line: 40,
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
          path={["src", "code_samples", "tut_paths", "08_output.txt"]}
          decorations={[
            {
              start: {
                line: 10,
                character: 0,
              },
              end: {
                line: 10,
                character: 60,
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
          In this tutorial we used the <R n="rs-willow25-paths-Path" />{" "}
          API to construct and compare paths:
        </P>

        <Ul>
          <Li>
            We added the <R n="rs-willow25" />{" "}
            crate as a dependency to a Rust project.
          </Li>
          <Li>
            We constructed an empty <R n="rs-willow25-paths-Path" />.
          </Li>
          <Li>
            We appended <R n="rs-willow25-paths-Component">Components</R>{" "}
            to an empty <R n="rs-willow25-paths-Path" />.
          </Li>
          <Li>
            We appended a slice of{" "}
            <R n="rs-willow25-paths-Component">Components</R> to an empty{" "}
            <R n="rs-willow25-paths-Path" />.
          </Li>
          <Li>
            We constructed a new <R n="rs-willow25-paths-Path" />{" "}
            with a slice of <R n="rs-willow25-paths-Component">Components</R>.
          </Li>
          <Li>
            We checked if one <R n="rs-willow25-paths-Path" />{" "}
            was a prefix of another.
          </Li>
          <Li>
            We iterated through all possible prefixes of a{" "}
            <R n="rs-willow25-paths-Path" />.
          </Li>
          <Li>
            We determined the longest common prefix of two{" "}
            <R n="rs-willow25-paths-Path">Paths</R>.
          </Li>
          <Li>
            We created a new <R n="rs-willow25-paths-Path" /> with the{" "}
            <R n="rs-willow25-paths-path" /> macro.
          </Li>
        </Ul>

        <P>
          <Rs n="Path" /> are perhaps the most fundamental concept of the{" "}
          <R n="data_model" />, and with this experience you’re ready to{" "}
          <R n="tut-entry">create some entries</R>.
        </P>
      </Hsection>
    </>
  </TutorialTemplate>
);
