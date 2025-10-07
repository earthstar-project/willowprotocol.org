import { Code, Li, P } from "macromania-html";
import { R } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import { RustSample, TerminalInput, TerminalOutput } from "../../../macros.tsx";
import { TutorialTemplate } from "../tutorials.tsx";

export const tutorial_drop = (
  <TutorialTemplate
    name="drop"
    preamble={
      <P>
        In this tutorial we will use <R n="rs-willow_25-create_drop" /> and{" "}
        <R n="rs-willow_25-ingest_drop" /> to transport data between two{" "}
        <R n="rs-willow_data_model-Store">Stores</R> using the{" "}
        <R n="willow_drop_format" />.
      </P>
    }
    deps={[
      "willow_25",
      "willow-store-simple-sled",
      "sled",
      "smol",
      "ufotofu",
      "willow-sideload",
    ]}
    title="Create and ingest a drop"
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow_data_model-Store" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-store">dedicated tutorial for stores</R>.
      </P>
    }
  >
    <>
      <Hsection title="Create a store and ingest an entry" n="tut-drop-1">
        <P>
          Open{" "}
          <Code>src/main.rs</Code>, delete its contents, and enter the
          following:
        </P>

        <RustSample path={["src", "code_samples", "tut_drop", "01.rs"]} />

        <P>
          In your terminal, run{" "}
          <TerminalInput>cargo run</TerminalInput>, and you should see the
          following output:
        </P>

        <TerminalOutput
          path={["src", "code_samples", "tut_drop", "01_output.txt"]}
        />
      </Hsection>

      <Hsection title="Create a drop" n="tut-drop-2">
        <P>
          Next, we'll create a <R n="drop" /> using{" "}
          <R n="rs-willow_25-create_drop" /> and store it in a{" "}
          <Code>{"Vec<u8>"}</Code>.
        </P>

        <P>
          Add the following to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_drop", "02.rs"]}
          decorations={[
            {
              start: {
                line: 0,
                character: 0,
              },
              end: {
                line: 6,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 59,
                character: 0,
              },
              end: {
                line: 72,
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
          path={["src", "code_samples", "tut_drop", "02_output.txt"]}
          decorations={[
            {
              start: {
                line: 2,
                character: 0,
              },
              end: {
                line: 2,
                character: 20,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>
      <Hsection title="Ingest the drop" n="tut-drop-3">
        <P>
          Finally, we'll create a new <R n="rs-willow_data_model-Store" />{" "}
          and ingest the <R n="drop" /> into it using{" "}
          <R n="rs-willow_25-ingest_drop" />.
        </P>

        <RustSample
          path={["src", "code_samples", "tut_drop", "03.rs"]}
          decorations={[
            {
              start: {
                line: 0,
                character: 0,
              },
              end: {
                line: 7,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 74,
                character: 0,
              },
              end: {
                line: 100,
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
          path={["src", "code_samples", "tut_drop", "03_output.txt"]}
          decorations={[
            {
              start: {
                line: 3,
                character: 0,
              },
              end: {
                line: 4,
                character: 26,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Summary" n="tut-drop-summary">
        <P>
          In this tutorial we used <R n="sideload_protocol">sideloading</R>{" "}
          to transport willow data between two{" "}
          <R n="rs-willow_data_model-Store">Stores</R>.
        </P>

        <Li>
          We created a <R n="rs-willow_store_simple_sled-StoreSimpleSled" />
        </Li>

        <Li>
          We created an{" "}
          <R n="rs-willow_25-Entry" />, authorised it, and ingested in the store
          with <R n="rs-willow_data_model-Store-ingest_entry" />.
        </Li>

        <Li>
          We used <R n="rs-willow_25-create_drop" /> to create a drop of an{" "}
          <R n="Area" /> of the{" "}
          <R n="rs-willow_store_simple_sled-StoreSimpleSled" />'s contents.
        </Li>

        <Li>
          We created another{" "}
          <R n="rs-willow_store_simple_sled-StoreSimpleSled" />, and used{" "}
          <R n="rs-willow_25-ingest_drop" />{" "}
          to ingest the drop we'd just created into that store.
        </Li>
      </Hsection>
    </>
  </TutorialTemplate>
);
