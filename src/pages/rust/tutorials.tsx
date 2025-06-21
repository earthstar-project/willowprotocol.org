import { Dir, File } from "macromania-outfs";
import { tutorial_paths } from "./tutorials/paths.tsx";
import { tutorial_entry } from "./tutorials/entry.tsx";
import { tutorial_groupings } from "./tutorials/groupings.tsx";
import { tutorial_caps } from "./tutorials/caps.tsx";
import { Code, Li, Ol, P } from "macromania-html";
import { TerminalInput } from "../../macros.tsx";
import { Hsection } from "macromania-hsection";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Expression } from "macromania";

export const tutorials = (
  <Dir name="tutorials">
    {tutorial_paths}
    {tutorial_entry}
    {tutorial_groupings}
    {tutorial_caps}
  </Dir>
);

export function TutorialTemplate(
  { name, title, preamble, deps, otherPrereqs, children }: {
    name: string;
    title: Expression;
    preamble: Expression;
    otherPrereqs: Expression;
    deps: string[];
    children: Expression;
  },
) {
  return (
    <Dir name={name}>
      <File name="index.html">
        <PageTemplate
          htmlTitle={title}
          headingId={`tut-${name}`}
          heading={title}
          toc
          parentId="rust"
        >
          {preamble}
          <Hsection title="Prerequisites" n={`tut-${name}-prereq`}>
            <RustPrereq />
            {otherPrereqs}
          </Hsection>

          <BasicRustSetupSection
            name={name}
            suggestedDirName={name}
            deps={deps}
          />

          {children}
        </PageTemplate>
      </File>
    </Dir>
  );
}

export function RustPrereq() {
  return (
    <P>
      A basic knowledge of the Rust programming language and executing commands
      in the terminal will be helpful for completing this tutorial. Some of the
      steps below also require <Code>cargo</Code> to be installed.
    </P>
  );
}

export function BasicRustSetupSection(
  { name, suggestedDirName, deps }: {
    name: string;
    suggestedDirName: string;
    deps: string[];
  },
) {
  return (
    <Hsection title="Setup" n={`tut-${name}-setup`}>
      <Ol>
        <Li>
          Create a new directory on your filesystem and name it something like
          {" "}
          <Code>{suggestedDirName}</Code>.
        </Li>
        <Li>
          Using your terminal, run <TerminalInput>cargo init</TerminalInput>
          {" "}
          within the newly created directory.
        </Li>
        <Li>
          After than, run{" "}
          <TerminalInput>{`cargo add ${deps.join(" ")}`}</TerminalInput>.
        </Li>
      </Ol>
    </Hsection>
  );
}
