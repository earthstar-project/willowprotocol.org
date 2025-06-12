import { Dir, File } from "macromania-outfs";
import { PageTemplate } from "../../../pageTemplate.tsx";
import { Code, Li, Ol, P, Pre } from "macromania-html";
import { R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import { Gwil } from "../../../macros.tsx";

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
              Using your terminal, run <Code>cargo init</Code>{" "}
              within the newly created directory.
            </Li>
            <Li>
              After than, run <Code>cargo add willow_25</Code>.
            </Li>
          </Ol>
        </Hsection>

        <Hsection title="Construct an empty path" n="tut-path-1">
          <P>
            Open{" "}
            <Code>src/main.rs</Code>, delete its contents, and enter the
            following:
          </P>

          <Code>
            <Pre>
              {`use willow_25::{Component, Path};

fn main() {
    let empty_path = Path::new_empty();
    println!("A path with nothing in it: {:?}", empty_path);
}`}
            </Pre>
          </Code>

          <P>
            In your terminal, run{" "}
            <Code>cargo run</Code>, and you should see the following output:
          </P>

          <Code>
            <Pre>A path with nothing in it: Path([])</Pre>
          </Code>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
