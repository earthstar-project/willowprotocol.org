import { Code, Li, P, Ul } from "macromania-html";
import { R } from "macromania-defref";
import { Hsection } from "macromania-hsection";
import { RustSample, TerminalInput, TerminalOutput } from "../../../macros.tsx";
import { TutorialTemplate } from "../tutorials.tsx";

export const tutorial_store = (
  <TutorialTemplate
    name="store"
    title="Work with a Store"
    preamble={
      <P>
        In this tutorial we will instantiate a{" "}
        <R n="rs-willow_store_simple_sled-StoreSimpleSled" />{" "}
        and use it to store and retrieve an <R n="rs-willow_25-Entry" /> and its
        {" "}
        <R n="Payload" />.
      </P>
    }
    deps={["willow_25", "willow-store-simple-sled", "ufotofu", "smol"]}
    otherPrereqs={
      <P>
        Additionally, knowledge of the <R n="rs-willow_25-Capability" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-caps">dedicated tutorial for capabilities</R>.
      </P>
    }
  >
    <>
      <Hsection title="Instantiate a store" n="tut-store-1">
        <P>
          Firstly we'll instantiate a{" "}
          <R n="rs-willow_store_simple_sled-StoreSimpleSled" /> in the directory
          {" "}
          <Code>./my_db</Code>.
        </P>

        <P>
          Open{" "}
          <Code>src/main.rs</Code>, delete its contents, and enter the
          following:
        </P>

        <RustSample path={["src", "code_samples", "tut_store", "01.rs"]} />

        <P>
          In your terminal, run{" "}
          <TerminalInput>cargo run</TerminalInput>, and you should see the
          following output:
        </P>

        <TerminalOutput
          path={["src", "code_samples", "tut_store", "01_output.txt"]}
        />
      </Hsection>

      <Hsection title="Ingest an entry" n="tut-store-2">
        <P>
          Next, we'll create a new{" "}
          <R n="rs-willow_25-Entry" />, use that to create an{" "}
          <R n="rs-willow_25-AuthorisedEntry" />, and ingest it into the
          <R n="rs-willow_store_simple_sled-StoreSimpleSled" /> we instantiated.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_store", "02.rs"]}
          decorations={[
            {
              start: {
                line: 0,
                character: 0,
              },
              end: {
                line: 5,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 25,
                character: 0,
              },
              end: {
                line: 66,
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
          path={["src", "code_samples", "tut_store", "02_output.txt"]}
          decorations={[
            {
              start: {
                line: 1,
                character: 0,
              },
              end: {
                line: 2,
                character: 26,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Append a payload" n="tut-store-3">
        <P>
          Next, we'll try and retrieve the payload of the{" "}
          <R n="rs-willow_25-Entry" />{" "}
          we just ingested, append some data to its payload, and then try to
          retrieve it again.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_store", "03.rs"]}
          decorations={[
            {
              start: {
                line: 0,
                character: 0,
              },
              end: {
                line: 1,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 68,
                character: 0,
              },
              end: {
                line: 87,
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
          path={["src", "code_samples", "tut_store", "03_output.txt"]}
          decorations={[
            {
              start: {
                line: 3,
                character: 0,
              },
              end: {
                line: 5,
                character: 20,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Query an area" n="tut-store-4">
        <P>
          Next, we'll query an <R n="rs-willow_25-Area" />{" "}
          within the store and iterate through the results we get.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_store", "04.rs"]}
          decorations={[
            {
              start: {
                line: 0,
                character: 14,
              },
              end: {
                line: 0,
                character: 22,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 88,
                character: 0,
              },
              end: {
                line: 103,
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
          path={["src", "code_samples", "tut_store", "04_output.txt"]}
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

      <Hsection title="Forget an entry" n="tut-store-5">
        <P>
          Finally, we'll forget the <R n="rs-willow_25-Entry" />{" "}
          we ingested earlier.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_store", "05.rs"]}
          decorations={[
            {
              start: {
                line: 104,
                character: 0,
              },
              end: {
                line: 118,
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
          path={["src", "code_samples", "tut_store", "05_output.txt"]}
          decorations={[
            {
              start: {
                line: 7,
                character: 0,
              },
              end: {
                line: 8,
                character: 24,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Summary" n="tut-store-summary">
        <P>
          In this tutorial, we explored{" "}
          <R n="rs-willow_data_model-Store" />'s APIs via{" "}
          <R n="rs-willow_store_simple_sled-StoreSimpleSled" />:
        </P>
        <Ul>
          <Li>
            We created a <R n="rs-willow_store_simple_sled-StoreSimpleSled" />
          </Li>

          <Li>
            We created an{" "}
            <R n="rs-willow_25-Entry" />, authorised it, and ingested in the
            store with <R n="rs-willow_data_model-Store-ingest_entry" />.
          </Li>

          <Li>
            We appended data to a payload and retrieved that payload.
          </Li>

          <Li>
            We queried an <R n="rs-willow_25-Area" /> using{" "}
            <R n="rs-willow_data_model-Store-query_area" />{" "}
            and iterated through the results.
          </Li>

          <Li>
            We used <R n="rs-willow_data_model-Store-forget_area" /> the{" "}
            <R n="rs-willow_25-Entry" /> we originally ingested.
          </Li>
        </Ul>

        <P>
          We've now practiced everything we need to move on to the next
          tutorial: <R n="tut-drop">Create and ingest a sidedrop.</R>.
        </P>
      </Hsection>
    </>
  </TutorialTemplate>
);
