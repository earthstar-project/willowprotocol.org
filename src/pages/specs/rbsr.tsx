import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path, Vermillion } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import {
  Code,
  Figcaption,
  Figure,
  Hr,
  Img,
  Li,
  P,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Ul,
} from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  SliceType,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Loc, Pseudocode } from "macromania-pseudocode";
import { Bib } from "macromania-bib/mod.tsx";
import { Purple } from "../../macros.tsx";
import { Orange } from "../../macros.tsx";
import { Blue } from "../../macros.tsx";
import { Expression } from "macromaniajsx/jsx-runtime";

export const rbsr = (
  <Dir name="rbsr">
    <File name="index.html">
      <PageTemplate
        htmlTitle="3d Range-Based Set Reconciliation"
        headingId="d3_range_based_set_reconciliation"
        heading={"3d Range-Based Set Reconciliation"}
        bibliography
      >
        <P>
          When two peers wish to synchronise data, they typically first exchange
          which <Rs n="Area" /> in which <Rs n="namespace" />{" "}
          they are interested in. Intersecting these <Rs n="Area" />{" "}
          yields the sets of <Rs n="AuthorisedEntry" />{" "}
          for which they then need to bring each other up to speed. In this
          document, we present a strategy for doing so efficiently.
        </P>

        <P>
          Given the <Rs n="AuthorisedEntry" />{" "}
          that the peers have available, there can be two cases that necessitate
          data exchange. First, one peer might have an <R n="AuthorisedEntry" />
          {" "}
          that the other does not have, and second, the peers might hold
          nonequal parts of the <R n="Payload" /> of some common{" "}
          <R n="AuthorisedEntry" />.
        </P>

        <P>
          As a first step to solving the problem, we simplify it. If{" "}
          <Rs n="AuthorisedEntry" />{" "}
          contained information about locally available <R n="Payload" />{" "}
          bytes, then both cases would merge into a single case: one peer might
          have a datum that the other lacks. Hence, we do not synchronise{" "}
          <Rs n="AuthorisedEntry" /> directly, but <Rs n="LengthyAuthorisedEntry" />:
        </P>

        <Pseudocode n="lengthy_entry_definition">
          <StructDef
            comment={
              <>
                An <R n="AuthorisedEntry" />{" "}
                together with information about how much of its{" "}
                <R n="Payload" /> a peer holds.
              </>
            }
            id={[
              "LengthyAuthorisedEntry",
              "LengthyAuthorisedEntry",
              "LengthyAuthorisedEntries",
            ]}
            fields={[
              {
                commented: {
                  comment: (
                    <>
                      The <R n="AuthorisedEntry" /> in question.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["entry", "lengthy_entry_entry", "entries"],
                    <R n="AuthorisedEntry" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      The number of consecutive bytes from the start of the ",
                      r("lengthy_entry_entry"), "’s <R n="Payload" />{" "}
                      that the peer holds.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["available", "lengthy_entry_available", "availables"],
                    <R n="U64" />,
                  ],
                },
              },
            ]}
          />
        </Pseudocode>

        <PreviewScope>
          <P>
            The task of the two peers then becomes conceptually simple: they
            each have a set of{" "}
            <Rs n="LengthyAuthorisedEntry" />, and they need to inform each other about
            all <Rs n="LengthyAuthorisedEntry" />{" "}
            the other party does not have, that is, they each need to compute
            the union of their two sets. In the scientific literature, this
            problem is known as{" "}
            <Def n="set_reconciliation" r="set reconciliation" />
            <Bib item="minsky2003set" />.
          </P>
        </PreviewScope>

        <P>
          Once the two peers have reconciled their sets, they can filter out
          {" "}
          <Rs n="AuthorisedEntry" />{" "}
          that overwrite each other, and they can separately request any missing
          (suffixes of){" "}
          <Rs n="Payload" />. Going forward, we thus concentrate on the set
          reconciliation part only.
        </P>

        <PreviewScope>
          <P>
            To perform set reconciliation, we adapt the approach of{" "}
            <Def n="rbsr" r="range-based set reconciliation" />
            <Bib item="meyer2023range" />.
          </P>
        </PreviewScope>

        <P>
          Range-based set reconciliation solves the problem recursively. To
          reconcile two sets, one peer first computes a hash over all items in
          its set, and sends this fingerprint to the other peer. That peer then
          computes the fingerprint over its items as well. If the fingerprints
          match, they are done reconciling.
        </P>

        <Figure>
          <Img
            src={<ResolveAsset asset={["3d_rbsr", "fp_match.png"]} />}
            alt={`A glorified visualisation of equality: hashing the same objects yields the same fingerprints.`}
          />
          <Figcaption>
            <Purple>Alfie</Purple> and <Orange>Betty</Orange>{" "}
            produce equal fingerprints for all their <Rs n="AuthorisedEntry" />
            {" "}
            in a given <R n="D3Range" />.
          </Figcaption>
        </Figure>

        <P>
          If the fingerprints do not match, there are two options. First, the
          peer can split its set in half and then initiate set reconciliation
          for each half concurrently (by transmitting its hashes for both
          halves). Second, if the set is sufficiently small, the peer can
          instead simply transmit its items in the set. The other peer responds
          to this with all other items that it held in the set, completing the
          process of reconciliation.
        </P>

        <Figure>
          <Img
            src={<ResolveAsset asset={["3d_rbsr", "fp_nonmatching.png"]} />}
            alt={`A flow diagram that is already described in the caption.`}
          />
          <Figcaption>
            <Purple>Alfie</Purple> and <Orange>Betty</Orange>{" "}
            produce non-equal fingerprints. <Purple>Alfie</Purple> splits the
            {" "}
            <R n="D3Range" /> in two, yielding a <R n="D3Range" />{" "}
            <R n="d3_range_include">including</R> <Rs n="AuthorisedEntry" />
            {" "}
            <Code>A</Code> and <Code>B</Code>, and another <R n="D3Range" />
            {" "}
            <R n="d3_range_include">including</R>{" "}
            <Code>C</Code>, and sends these <Rs n="D3Range" />{" "}
            and their fingerprints to <Orange>Betty</Orange>.{" "}
            <Orange>Betty</Orange> produces a matching fingerprint for the first
            {" "}
            <R n="D3Range" />. As the other, mismatched <R n="D3Range" />{" "}
            includes so few <Rs n="AuthorisedEntry" />, <Orange>Betty</Orange>
            {" "}
            sends her <Rs n="AuthorisedEntry" /> <Code>Q</Code> and{" "}
            <Code>Y</Code> to <Purple>Alfie</Purple>. In response,{" "}
            <Purple>Alfie</Purple> sends <R n="AuthorisedEntry" />{" "}
            <Code>C</Code> to <Orange>Betty</Orange>.
          </Figcaption>
        </Figure>

        <P>
          Overall, the peers collaboratively drill down to the differences
          between their two sets in a logarithmic number of communication
          rounds, spending only little bandwidth on those regions of the
          original sets where they hold the same items. Note that peers can
          actually split sets into arbitrarily many subsets in each step.
          Splitting into more subsets per step decreases the total number of
          communication rounds.
        </P>

        <Figure>
          <Img
            src={<ResolveAsset asset={["3d_rbsr", "drilling_down.png"]} />}
            alt={`A contiguous range is recursively split into subranges. Some subranges are coloured blue to indicate matching fingerprints; these are not split further. The total picture is that of a thinning tree growing downwards, ending in the few areas that require actual data exchange.`}
          />
          <Figcaption>
            Split apart <Vermillion>non-equal ranges</Vermillion>{" "}
            to hone in on the locations of any differences, while disregarding
            {" "}
            <Blue>equal ranges</Blue>.
          </Figcaption>
        </Figure>

        <P>
          <Def
            n="d3rbsr"
            r="3d range-based set reconciliation"
            preview={
              <>
                <Def fake n="d3rbsr">3d range-based set reconciliation</Def>
                {" "}
                is an algorithm for letting two peers compute the union of their
                {" "}
                <Rs n="LengthyAuthorisedEntry" /> in some <R n="D3Range" /> by exchanging
                {" "}
                <Rs n="D3RangeFingerprint" /> and <Rs n="D3RangeEntrySet" />.
              </>
            }
          />{" "}
          takes these ideas and applies them to Willow. The core design decision
          is to delimit sets of <Rs n="LengthyAuthorisedEntry" /> via{" "}
          <Rs n="D3Range" />. When a peer splits its{" "}
          <Rs n="D3Range" />, it is crucial for overall efficiency to not split
          based on volume (for example, by splitting the <Rs n="D3RangeTime" />
          {" "}
          in half numerically), but to split into subranges in which the peer
          holds roughly the same number of <Rs n="AuthorisedEntry" />.
        </P>

        <PreviewScope>
          <P>
            Let <DefType n="d3rbsr_fp" r="Fingerprint" rs="Fingerprints" />{" "}
            denote the type of hashes of <Rs n="LengthyAuthorisedEntry" />{" "}
            that the peers exchange. Then the precise pieces of information that
            the peers need to exchange are the following:
            <Alj>
              The styling of alternating line colours feels a bit weird,
              especially with the pretty thin empty line of code between the two
              structs.
            </Alj>
          </P>
        </PreviewScope>

        <Pseudocode n="rbsr_message_defs">
          <StructDef
            comment={
              <>
                The <R n="d3rbsr_fp" /> over all <Rs n="LengthyAuthorisedEntry" />{" "}
                a peer holds in some <R n="D3Range" />.
              </>
            }
            id={[
              "3dRangeFingerprint",
              "D3RangeFingerprint",
              "3dRangeFingerprints",
            ]}
            fields={[
              {
                commented: {
                  comment: (
                    <>
                      The <R n="D3Range" /> in question.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["3d_range", "D3RangeFingerprintRange", "3d_ranges"],
                    <R n="D3Range" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      The <R n="d3rbsr_fp" /> over the <Rs n="LengthyAuthorisedEntry" />
                      {" "}
                      that the sender holds in the{" "}
                      <R n="D3RangeFingerprintRange" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    [
                      "fingerprint",
                      "D3RangeFingerprintFingerprint",
                      "fingerprints",
                    ],
                    <R n="d3rbsr_fp" />,
                  ],
                },
              },
            ]}
          />

          <Loc />

          <StructDef
            comment={
              <>
                The set of <Rs n="LengthyAuthorisedEntry" /> a peer holds in some{" "}
                <R n="D3Range" />.
              </>
            }
            id={["3dRangeEntrySet", "D3RangeEntrySet", "3dRangeEntrySets"]}
            fields={[
              {
                commented: {
                  comment: (
                    <>
                      The <R n="D3Range" /> in question.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["3d_range", "D3RangeEntrySetRange", "3d_ranges"],
                    <R n="D3Range" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      The <Rs n="LengthyAuthorisedEntry" /> that the sender holds in the
                      {" "}
                      <R n="D3RangeEntrySetRange" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["entries", "D3RangeEntrySetEntries", "entries"],
                    <SliceType>
                      <R n="LengthyAuthorisedEntry" />
                    </SliceType>,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      A boolean flag to indicate whether the sender wishes to
                      receive the other peer’s <R n="D3RangeEntrySet" />{" "}
                      for the same <R n="D3RangeEntrySetRange" /> in return.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    [
                      "want_response",
                      "D3RangeEntrySetWantResponse",
                      "want_response",
                    ],
                    <R n="Bool" />,
                  ],
                },
              },
            ]}
          />
        </Pseudocode>

        <P>
          To initiate reconciliation of a <R n="D3Range" />, a peer sends its
          {" "}
          <R n="D3RangeFingerprint" />. Upon receiving a{" "}
          <R n="D3RangeFingerprint" />, a peer computes the <R n="d3rbsr_fp" />
          {" "}
          over its local <Rs n="LengthyAuthorisedEntry" /> in the same range.
        </P>

        <P>
          If it does not match, the peer either sends a number of{" "}
          <Rs n="D3RangeFingerprint" /> whose <Rs n="D3Range" /> cover the{" "}
          <R n="D3Range" /> for which it received the mismatching{" "}
          <R n="d3rbsr_fp" />. Or it replies with its <R n="D3RangeEntrySet" />
          {" "}
          for that <R n="D3Range" />, with the{" "}
          <R n="D3RangeEntrySetWantResponse" /> flag set to <Code>true</Code>.
        </P>

        <P>
          To any such <R n="D3RangeEntrySet" />, a peer replies with its own
          {" "}
          <R n="D3RangeEntrySet" />, setting the{" "}
          <R n="D3RangeEntrySetWantResponse" /> flag to{" "}
          <Code>false</Code>, and omitting all <Rs n="LengthyAuthorisedEntry" />{" "}
          it had just received in the other peer’s <R n="D3RangeEntrySet" />.
        </P>

        <P>
          When a peer receives a <R n="D3RangeFingerprint" /> that matches the
          {" "}
          <R n="d3rbsr_fp" /> over its local <Rs n="LengthyAuthorisedEntry" /> in the same
          {" "}
          <R n="D3Range" />, the peer should reply with an empty{" "}
          <R n="D3RangeEntrySet" /> for that <R n="D3Range" />, setting the{" "}
          <R n="D3RangeEntrySetWantResponse" /> flag to{" "}
          <Code>false</Code>. This notifies the sender of the{" "}
          <R n="D3RangeFingerprint" />{" "}
          that reconciliation has successfully concluded for the{" "}
          <R n="D3Range" />.
        </P>

        <Hr />

        <P>
          The peers might be interested in when they have successfully completed
          reconciliation of a particular{" "}
          <R n="D3Range" />. Unfortunately, tracking all the <Rs n="D3Range" />
          {" "}
          that you receive and determining whether their union covers the
          particular <R n="D3Range" />{" "}
          you are interested in is a comparatively expensive (and annoying)
          algorithmic problem. To circumvent this problem, peers can attach
          small bits of metadata to their messages: whenever a peer splits a
          {" "}
          <R n="D3Range" /> into a set of covering{" "}
          <Rs n="D3Range" />, the peer can simply attach some metadata to the
          final such subrange that it sends that indicates which of the{" "}
          <Rs n="D3Range" />{" "}
          sent by the other peer has now been fully covered by subranges.
        </P>

        <P>
          As long as both peers are accurate in supplying this metadata, they
          can maintain perfect information about the progress of reconciliation
          without the need for any sophisticated data structures. Peers should
          be cautious that a malicious peer could provide wildly inadequate
          metadata, but in general this is tolerable: a malicious peer can
          sabotage reconciliation in all sorts of interesting ways regardless.
        </P>

        <Hsection n="d3rbsr_parameters" title="Fingerprinting">
          <P>
            <Rb n="d3rbsr" /> requires the ability to hash arbitrary sets of
            {" "}
            <Rs n="LengthyAuthorisedEntry" /> into values of some type{" "}
            <R n="d3rbsr_fp" />. We now describe the technique described in the
            paper for computing these efficiently. The key idea is to ensure
            that the <R n="d3rbsr_fp" /> for a <R n="D3Range" />{" "}
            can be assembled from precomputed <Rs n="d3rbsr_fp" />{" "}
            of other, smaller{" "}
            <Rs n="D3Range" />. What we describe now is not mandatory for
            Willow, but it probably is a good idea.
          </P>

          <PreviewScope>
            <P>
              We define the fingerprinting function in terms of some building
              blocks: <Rs n="LengthyAuthorisedEntry" /> are mapped into a set{" "}
              <DefType
                n="d3rbsr_prefp"
                r="PreFingerprint"
                rs="PreFingerprints"
              />{" "}
              with a function that satisfies certain algebraic properties that
              allow for incremental computation, and <Rs n="d3rbsr_prefp" />
              {" "}
              are then converted<Marginale>
                The split into <Rs n="d3rbsr_prefp" /> and <Rs n="d3rbsr_fp" />
                {" "}
                allows for compression: the <Rs n="d3rbsr_prefp" />{" "}
                might be efficient to compute but rather large, so you would not
                want to exchange them over the network. Converting a{" "}
                <R n="d3rbsr_prefp" /> into a <R n="d3rbsr_fp" />{" "}
                can be as simple as hashing it with a typical, secure hash
                function, thus preserving collision resistance but yielding
                smaller final fingerprints.
              </Marginale>{" "}
              into the final <R n="d3rbsr_fp" />.
            </P>

            <P>
              First, we require a function{" "}
              <DefFunction n="d3rbsr_fp_singleton" r="fingerprint_singleton" />
              {" "}
              that hashes individual <Rs n="LengthyAuthorisedEntry" /> into the set{" "}
              <R n="d3rbsr_prefp" />. This hash function should take into
              account all aspects of the <R n="LengthyAuthorisedEntry" />: modifying its
              {" "}
              <R n="entry_namespace_id" />, <R n="entry_subspace_id" />,{" "}
              <R n="entry_path" />, <R n="entry_timestamp" />,{" "}
              <R n="entry_payload_digest" />,{" "}
              <R n="entry_payload_length" />, or its number of{" "}
              <R n="lengthy_entry_available" />{" "}
              bytes, should result in a completely different{" "}
              <R n="d3rbsr_prefp" />.
            </P>

            <P>
              Second, we require an{" "}
              <AE href="https://en.wikipedia.org/wiki/Associative_property">
                associative
              </AE>{" "}
              and{" "}
              <Sidenote
                note={
                  <>
                    Classic range-based set reconciliation does not require
                    commutativity. We require it because we do not wish to
                    prescribe how to linearise three-dimensional data into a
                    single order.
                  </>
                }
              >
                <AE href="https://en.wikipedia.org/wiki/Commutative_property">
                  commutative
                </AE>
              </Sidenote>{" "}
              function{" "}
              <DefFunction n="d3rbsr_fp_combine" r="fingerprint_combine" />{" "}
              that maps two <Rs n="d3rbsr_prefp" /> to a single new{" "}
              <R n="d3rbsr_prefp" />. The <R n="d3rbsr_fp_combine" />{" "}
              function must further have a{" "}
              <AE href="https://en.wikipedia.org/wiki/Identity_element">
                neutral element
              </AE>{" "}
              <DefValue n="d3rbsr_neutral" r="fingerprint_neutral" />.
            </P>

            <P>
              Third, we require a function{" "}
              <DefFunction n="d3rbsr_fp_finalise" r="fingerprint_finalise" />
              {" "}
              that maps each <R n="d3rbsr_prefp" /> to the corresponding{" "}
              <R n="d3rbsr_fp" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Given these building blocks, we define the function{" "}
              <DefFunction n="ddrbsr_fingerprint" r="fingerprint" />{" "}
              from sets of <Rs n="LengthyAuthorisedEntry" /> to <R n="d3rbsr_fp" />:
            </P>
            <Ul>
              <Li>
                applying <R n="ddrbsr_fingerprint" /> to the empty set yields
                {" "}
                <Code>
                  <R n="d3rbsr_fp_finalise" />(<R n="d3rbsr_neutral" />)
                </Code>,
              </Li>
              <Li>
                applying <R n="ddrbsr_fingerprint" />{" "}
                to a set containing exactly one <R n="LengthyAuthorisedEntry" />{" "}
                yields the same result as applying <R n="d3rbsr_fp_singleton" />
                {" "}
                to that <R n="LengthyAuthorisedEntry" /> and then applying{" "}
                <R n="d3rbsr_fp_finalise" />, and
              </Li>
              <Li>
                applying <R n="ddrbsr_fingerprint" /> to any other set of{" "}
                <Rs n="LengthyAuthorisedEntry" /> yields the result of applying{" "}
                <R n="d3rbsr_fp_singleton" />{" "}
                to all members of the set individually, then combining the
                resulting <Rs n="d3rbsr_fp" /> with <R n="d3rbsr_fp_combine" />
                {" "}
                (grouping and ordering do not matter because of associativity
                and commutativity), and then applying{" "}
                <R n="d3rbsr_fp_finalise" />.
              </Li>
            </Ul>
          </PreviewScope>

          <Figure>
            <Table>
              <Thead>
                <Tr>
                  <Th>Set</Th>
                  <Th>Fingerprint</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {`{ }`}
                  </Td>
                  <Td>
                    <SmallImg asset={["3d_rbsr", "fp_bottle_empty.png"]}>
                      An empty bottle.
                    </SmallImg>
                  </Td>
                </Tr>
              </Tbody>
              <Tbody>
                <Td>
                  {`{ `}
                  <SmallImg asset={["3d_rbsr", "fp_apple.png"]}>
                    A red apple.
                  </SmallImg>
                  {` }`}
                </Td>
                <Td>
                  <SmallImg asset={["3d_rbsr", "fp_bottle_yellow.png"]}>
                    A bottle of apple juice.
                  </SmallImg>
                </Td>
              </Tbody>
              <Tbody>
                <Td>
                  {`{ `}
                  <SmallImg asset={["3d_rbsr", "fp_apple.png"]}>
                    A red apple.
                  </SmallImg>
                  <SmallImg asset={["3d_rbsr", "fp_celery.png"]}>
                    A celery.
                  </SmallImg>
                  <SmallImg asset={["3d_rbsr", "fp_lemon.png"]}>
                    A lemon.
                  </SmallImg>
                  {` }`}
                </Td>
                <Td>
                  <SmallImg asset={["3d_rbsr", "fp_bottle_green.png"]}>
                    A bottle of apple-celery-lemon smoothie. Yum?
                  </SmallImg>
                </Td>
              </Tbody>
            </Table>
            <Figcaption>
              A metaphorical juicing fingerprint. Although the number of
              ingredients in the set may change, the size of the bottle does
              not. Each bottle’s juice inherits its unique flavour from its
              ingredients.
            </Figcaption>
          </Figure>

          <P>
            For <R n="d3rbsr" /> to work correctly, <R n="ddrbsr_fingerprint" />
            {" "}
            must map distinct sets of <Rs n="LengthyAuthorisedEntry" /> to distinct{" "}
            <Rs n="d3rbsr_fp" />{" "}
            with high probability, even when facing maliciously crafted input
            sets. The "range-based set reconciliation paper surveys suitable,
            cryptographically secure hash functions in section
            5B<Bib item="meyer2023range" />. All but the Cayley hashes use
            commutative <R n="d3rbsr_fp_combine" />{" "}
            functions, and are thus suitable for <R n="d3rbsr" />. Further,{" "}
            <R n="d3rbsr_fp_finalise" />{" "}
            must not map distinct inpus to equal outpts; suitable choices are
            the identity function (if no compression is needed) or traditional,
            secure hash functions.
          </P>
        </Hsection>

        {
          /*

      pinformative(""),
   */
        }
      </PageTemplate>
    </File>
  </Dir>
);

function SmallImg(
  { children, asset }: { children: Expression; asset: string[] },
): Expression {
  return (
    <Img
      style="height: 32px; vertical-align: middle;"
      src={<ResolveAsset asset={asset} />}
      alt={children}
    />
  );
}
