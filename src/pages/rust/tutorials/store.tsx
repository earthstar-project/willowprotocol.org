import { Code, Em, Li, P, Ul } from "macromania-html";
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
        <R n="rs-willow25-storage-MemoryStore" />{" "}
        and use it to store and retrieve an <R n="rs-willow25-entry-Entry" />
        {" "}
        and its <R n="Payload" />.
      </P>
    }
    deps={["willow25", "rand@0.8.0", "ufotofu", "smol", "bab_rs"]}
    otherPrereqs={
      <P>
        Additionally, knowledge of the{" "}
        <R n="rs-willow25-authorisation-WriteCapability" />{" "}
        API would be helpful. If you're not yet familiar, please see our{" "}
        <R n="tut-caps">dedicated tutorial for capabilities</R>.
      </P>
    }
  >
    <>
      <Hsection title="Instantiate a store" n="tut-store-1">
        <P>
          Firstly we'll instantiate a <R n="rs-willow25-storage-MemoryStore" />.
        </P>

        <P>
          Open{" "}
          <Code>src/main.rs</Code>, delete its contents, and enter the
          following:
        </P>

        <RustSample path={["src", "code_samples", "tut_store", "01.rs"]} />

        <P>
          Now we have a <R n="rs-willow25-storage-Store" />, ready to work with.
        </P>
      </Hsection>

      <Hsection title="Ingest an entry" n="tut-store-2">
        <P>
          Next, we'll create a new{" "}
          <R n="rs-willow25-entry-Entry" />, use that to create an{" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" />, and insert it
          into the
          <R n="rs-willow25-storage-MemoryStore" /> we instantiated.
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
                line: 3,
                character: 0,
              },
              end: {
                line: 4,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 11,
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
          In your terminal, run{" "}
          <TerminalInput>cargo run</TerminalInput>, and you should see the
          following output:
        </P>

        <TerminalOutput
          path={["src", "code_samples", "tut_store", "02_output.txt"]}
        />
      </Hsection>

      <Hsection title="Retrieve the entry" n="tut-store-3">
        <P>
          Next, we'll try and retrieve the{" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" /> we just inserted.
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
                line: 38,
                character: 0,
              },
              end: {
                line: 50,
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
                line: 1,
                character: 0,
              },
              end: {
                line: 1,
                character: 26,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Try to retrieve the payload" n="tut-store-4">
        <P>
          Next, we'll <Em>try</Em> and retrieve the <R n="Payload" /> of the
          {" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" />{" "}
          we've successfully inserted.
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
                line: 52,
                character: 0,
              },
              end: {
                line: 70,
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
                line: 2,
                character: 0,
              },
              end: {
                line: 3,
                character: 39,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />

        <P>
          Our vec is empty! We never appended the corresponding{" "}
          <R n="Payload" /> for this{" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" />. So let's do that
          next.
        </P>
      </Hsection>

      <Hsection title="Append a payload (and retrieve it)" n="tut-store-5">
        <P>
          We're going to try and append some data to the <R n="Payload" />{" "}
          of our{" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" />, and then try to
          retrieve it again.
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
                line: 0,
                character: 0,
              },
              end: {
                line: 2,
                character: 0,
              },
              properties: {
                class: "addition",
              },
            },
            {
              start: {
                line: 73,
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
          path={["src", "code_samples", "tut_store", "05_output.txt"]}
          decorations={[
            {
              start: {
                line: 4,
                character: 0,
              },
              end: {
                line: 6,
                character: 20,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Query an area" n="tut-store-6">
        <P>
          Next we'll query a <R n="rs-willow25-groupings-Area" />{" "}
          to see which stored{" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" /> are{" "}
          <R n="area_include">included</R> by it.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_store", "06.rs"]}
          decorations={[
            {
              start: {
                line: 104,
                character: 0,
              },
              end: {
                line: 120,
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
          path={["src", "code_samples", "tut_store", "06_output.txt"]}
          decorations={[
            {
              start: {
                line: 7,
                character: 0,
              },
              end: {
                line: 7,
                character: 72,
              },
              properties: {
                class: "addition",
              },
            },
          ]}
        />
      </Hsection>

      <Hsection title="Forget an entry" n="tut-store-7">
        <P>
          Finally, we're going to forget the{" "}
          <R n="rs-willow25-authorisation-AuthorisedEntry" />{" "}
          we inserted, and then try to retrieve it again.
        </P>

        <P>
          Make the following changes to
          <Code>src/main.rs</Code>:
        </P>

        <RustSample
          path={["src", "code_samples", "tut_store", "07.rs"]}
          decorations={[
            {
              start: {
                line: 120,
                character: 0,
              },
              end: {
                line: 142,
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
          path={["src", "code_samples", "tut_store", "07_output.txt"]}
          decorations={[
            {
              start: {
                line: 8,
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
          In this tutorial, we explored the <R n="rs-willow25-storage-Store" />
          {" "}
          API:
        </P>
        <Ul>
          <Li>
            We instantiated a <R n="rs-willow25-storage-MemoryStore" />.
          </Li>

          <Li>
            We created an{" "}
            <R n="rs-willow25-entry-Entry" />, authorised it with a{" "}
            <R n="rs-willow25-authorisation-WriteCapability" />, and inserted in
            the store with <R n="rs-willow25-storage-Store-insert_entry" />.
          </Li>

          <Li>
            We saw what happened when we try to fetch a <R n="Payload" /> with
            {" "}
            <R n="rs-willow25-storage-PayloadPrefixStore-append_to_payload_prefix" />
            {" "}
            we hadn't appended any data to.
          </Li>

          <Li>
            We queried an <R n="rs-willow25-groupings-Area" /> using{" "}
            <R n="rs-willow25-storage-Store-get_area" />{" "}
            and counted the results.
          </Li>

          <Li>
            We used <R n="rs-willow25-storage-Store-forget_entry" />{" "}
            to forget the <R n="rs-willow25-authorisation-AuthorisedEntry" />
            {" "}
            we originally inserted.
          </Li>
        </Ul>
      </Hsection>
    </>
  </TutorialTemplate>
);
