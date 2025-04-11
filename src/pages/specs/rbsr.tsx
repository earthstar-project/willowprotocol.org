import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path, Vermillion } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Figcaption, Figure, Img, Li, P, Ul } from "macromania-html";
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
          yields the sets of <Rs n="Entry" />{" "}
          for which they then need to bring each other up to speed. In this
          document, we present a strategy for doing so efficiently.
        </P>

        <P>
          Given the <Rs n="Entry" />{" "}
          that the peers have available, there can be two cases that necessitate
          data exchange. First, one peer might have an <R n="Entry" />{" "}
          that the other does not have, and second, the peers might hold
          nonequal parts of the <R n="Payload" /> of some common{" "}
          <R n="Entry" />.
        </P>

        <P>
          As a first step to solving the problem, we simplify it. If{" "}
          <Rs n="Entry" /> contained information about locally available{" "}
          <R n="Payload" />{" "}
          bytes, then both cases would merge into a single case: one peer might
          have a datum that the other lacks. Hence, we do not synchronise{" "}
          <Rs n="Entry" /> directly, but <Rs n="LengthyEntry" />:
        </P>

        <Pseudocode n="lengthy_entry_definition">
          <StructDef
            comment={
              <>
                An <R n="Entry" />{" "}
                together with information about how much of its{" "}
                <R n="Payload" /> a peer holds.
              </>
            }
            id={["LengthyEntry", "LengthyEntry", "LengthyEntries"]}
            fields={[
              {
                commented: {
                  comment: (
                    <>
                      The <R n="Entry" /> in question.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["entry", "lengthy_entry_entry", "entries"],
                    <R n="Entry" />,
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
            <Rs n="LengthyEntry" />, and they need to inform each other about
            all <Rs n="LengthyEntry" />{" "}
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
          <Rs n="Entry" />{" "}
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
            produce equal fingerprints for all their <Rs n="Entry" /> in a given
            {" "}
            <R n="D3Range" />.
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
            <R n="d3_range_include">including</R> <Rs n="Entry" />{" "}
            <Code>A</Code> and <Code>B</Code>, and another <R n="D3Range" />
            {" "}
            <R n="d3_range_include">including</R>{" "}
            <Code>C</Code>, and sends these <Rs n="D3Range" />{" "}
            and their fingerprints to <Orange>Betty</Orange>.{" "}
            <Orange>Betty</Orange> produces a matching fingerprint for the first
            {" "}
            <R n="D3Range" />. As the other, mismatched <R n="D3Range" />{" "}
            includes so few <Rs n="Entry" />, <Orange>Betty</Orange> sends her
            {" "}
            <Rs n="Entry" /> <Code>Q</Code> and <Code>Y</Code> to{" "}
            <Purple>Alfie</Purple>. In response, <Purple>Alfie</Purple> sends
            {" "}
            <R n="Entry" /> <Code>C</Code> to <Orange>Betty</Orange>.
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
                <Rs n="LengthyEntry" /> in some <R n="D3Range" /> by exchanging
                {" "}
                <Rs n="D3RangeFingerprint" /> and <Rs n="D3RangeEntrySet" />.
              </>
            }
          />{" "}
          takes these ideas and applies them to Willow. The core design decision
          is to delimit sets of <Rs n="LengthyEntry" /> via{" "}
          <Rs n="D3Range" />. When a peer splits its{" "}
          <Rs n="D3Range" />, it is crucial for overall efficiency to not split
          based on volume (for example, by splitting the <Rs n="D3RangeTime" />
          {" "}
          in half numerically)", ", but to split into subranges in which the
          peer holds roughly the same number of <Rs n="Entry" />.
        </P>

        <P>
          Let <DefType n="d3rbsr_fp" r="Fingerprint" rs="Fingerprints" />{" "}
          denote the type of hashes of <Rs n="LengthyEntry" />{" "}
          that the peers exchange. Then the precise pieces of information that
          the peers need to exchange are the following:
          <Alj>The styling of alternating line colours feels a bit weird, especially with the pretty thin empty line of code between the two structs.</Alj>
        </P>

        <Pseudocode n="rbsr_message_defs">
          <StructDef
            comment={
              <>
                The <R n="d3rbsr_fp" /> over all <Rs n="LengthyEntry" />{" "}
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
                      The <R n="d3rbsr_fp" /> over the <Rs n="LengthyEntry" />
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

          <Loc/>

          <StructDef
            comment={
              <>
                The set of <Rs n="LengthyEntry" /> a peer holds in some{" "}
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
                      The <Rs n="LengthyEntry" /> that the sender holds in the
                      {" "}
                      <R n="D3RangeEntrySetRange" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["entries", "D3RangeEntrySetEntries", "entries"],
                    <SliceType>
                      <R n="LengthyEntry" />
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
          over its local <Rs n="LengthyEntry" /> in the same range.
        </P>

        {
          /*

    pinformative("If it does not match, the peer either sends a number of <Rs n="D3RangeFingerprint"/> whose <Rs n="D3Range"/> cover the <R n="D3Range"/> for which it received the mismatching <R n="d3rbsr_fp"/>. Or it replies with its <R n="D3RangeEntrySet"/> for that <R n="D3Range"/>, with the ", r("D3RangeEntrySetWantResponse"), " flag set to ", code("true"), "."),

    pinformative("To any such <R n="D3RangeEntrySet"/>, a peer replies with its own <R n="D3RangeEntrySet"/>, setting the ", r("D3RangeEntrySetWantResponse"), " flag to ", code("false"), ", and omitting all <Rs n="LengthyEntry"/> it had just received in the other peer’s <R n="D3RangeEntrySet"/>."),

    pinformative("When a peer receives a <R n="D3RangeFingerprint"/> that matches the <R n="d3rbsr_fp"/> over its local <Rs n="LengthyEntry"/> in the same <R n="D3Range"/>, the peer should reply with an empty <R n="D3RangeEntrySet"/> for that <R n="D3Range"/>, setting the ", r("D3RangeEntrySetWantResponse"), " flag to ", code("false"), ". This notifies the sender of the <R n="D3RangeFingerprint"/> that reconciliation has successfully concluded for the <R n="D3Range"/>."),

    hr(),

    pinformative("The peers might be interested in when they have successfully reconciled a particular <R n="D3Range"/>. Unfortunately, tracking all the <Rs n="D3Range"/> that you receive and determining whether their union covers the particular <R n="D3Range"/> you are interested in is a comparatively expensive (and annoying) algorithmic problem. To circumvent this problem, peers can attach small bits of metadata to their messages: whenever a peer splits a <R n="D3Range"/> into a set of covering <Rs n="D3Range"/>, the peer can simply attach some metadata to the final such subrange that it sends that indicates which of the <Rs n="D3Range"/> sent by the other peer has now been fully covered by subranges."),

    pinformative("As long as both peers are accurate in supplying this metadata, they can maintain perfect information about the progress of reconciliation without the need for any sophisticated data structures. Peers should be cautious that a malicious peer could provide wildly inadequate metadata, but in general this is tolerable: a malicious peer can sabotage reconciliation in all sorts of interesting ways regardless."),

    hsection("d3rbsr_parameters", "Fingerprinting", [
      pinformative(R("d3rbsr"), " requires the ability to hash arbitrary sets of <Rs n="LengthyEntry"/> into values of some type <R n="d3rbsr_fp"/>. To quickly compute ", rs("d3rbsr_fp"), ", it helps if the <R n="d3rbsr_fp"/> for a <R n="D3Range"/> can be assembled from precomputed ", rs("d3rbsr_fp"), " of other, smaller <Rs n="D3Range"/>. For this reason, we define the fingerprinting function in terms of some building blocks: <Rs n="LengthyEntry"/> are mapped into a set ", def_type({id: "d3rbsr_prefp", singular: "PreFingerprint"}), " with a function that satisfies certain algebraic properties that allow for incremental computation, and ", rs("d3rbsr_prefp"), " are then converted", marginale(["The split into ", rs("d3rbsr_prefp"), " and ", rs("d3rbsr_fp"), " allows for compression: the ", rs("d3rbsr_prefp"), " might be efficient to compute but rather large, so you would not want to exchange them over the network. Converting a ", r("d3rbsr_prefp"), " into a <R n="d3rbsr_fp"/> can be as simple as hashing it with a typical, secure hash function, thus preserving collision resistance but yielding smaller final fingerprints."]), " into the final <R n="d3rbsr_fp"/>."),

      pinformative("First, we require a function ", def_parameter_fn({id: "d3rbsr_fp_singleton", singular: "fingerprint_singleton"}), " that hashes individual <Rs n="LengthyEntry"/> into the set ", r("d3rbsr_prefp"), ". This hash function should take into account all aspects of the ",  r("LengthyEntry"), ": modifying its ", r("entry_namespace_id"), ", <R n="entry_subspace_id"/>, <R n="entry_path"/>, <R n="entry_timestamp"/>, <R n="entry_payload_digest"/>, <R n="entry_payload_length"/>, or its number of ", r("lengthy_entry_available"), " bytes, should result in a completely different ", r("d3rbsr_prefp"), "."),

      pinformative("Second, we require an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), " and ", sidenote(link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), ["Classic range-based set reconciliation does not require commutativity. We require it because we do not wish to prescribe how to linearise three-dimensional data into a single order."]), " function ", def_parameter_fn({id: "d3rbsr_fp_combine", singular: "fingerprint_combine"}), " that maps two ", rs("d3rbsr_prefp"), " to a single new ", r("d3rbsr_prefp"), ". The ", r("d3rbsr_fp_combine"), " function must further have a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " ", def_parameter_value({ id: "d3rbsr_neutral", singular: "fingerprint_neutral"}), "."),

      pinformative("Third, we require a function ", def_parameter_fn({id: "d3rbsr_fp_finalise", singular: "fingerprint_finalise"}), " that maps each ", r("d3rbsr_prefp"), " into the corresponding <R n="d3rbsr_fp"/>."),

      marginale_inlineable(
        figure(
          table(
            thead(
              tr(
                th("Set"),
                th("Fingerprint"),
              ),
            ),
            tbody(
              tr(
                td("{ }"),
                td(small_img(asset("3d_rbsr/fp_bottle_empty.png"), `An empty bottle.`)),
              ),
            ),
            tbody(
              td([
                "{ ",
                small_img(asset("3d_rbsr/fp_apple.png"), `A red apple.`, {
                  style: "vertical-align:middle",
                }),
                " }",
              ]),
              td(small_img(asset("3d_rbsr/fp_bottle_yellow.png"), `A bottle of apple juice.`)),
            ),
            tbody(
              td([
                "{ ",
                small_img(asset("3d_rbsr/fp_apple.png"), `A red apple.`, {
                  style: "vertical-align:middle",
                }),
                " ",
                small_img(asset("3d_rbsr/fp_celery.png"), `A celery.`, {
                  style: "vertical-align:middle",
                }),
                " ",
                small_img(asset("3d_rbsr/fp_lemon.png"), `A lemon.`, {
                  style: "vertical-align:middle",
                }),
                " }",
              ]),
              td(small_img(asset("3d_rbsr/fp_bottle_green.png"), `A bottle of apple-celery-lemon smoothie. Yum?`)),
            ),
          ),
          figcaption("A metaphorical juicing fingerprint. Although the number of ingredients in the set may change, the size of the bottle does not. Each bottle’s juice inherits its unique flavour from its ingredients.")
        ),
      ),

      pinformative("Given these building blocks, we define the function ", def_fn({id: "ddrbsr_fingerprint", singular: "fingerprint"}), " from sets of <Rs n="LengthyEntry"/> to <R n="d3rbsr_fp"/>:", lis(
        ["applying ", r("ddrbsr_fingerprint"), " to the empty set yields ", function_call(r("d3rbsr_fp_finalise"), r("d3rbsr_neutral")), ","],
        ["applying ", r("ddrbsr_fingerprint"), " to a set containing exactly one ", r("LengthyEntry"), " yields the same result as applying ", r("d3rbsr_fp_singleton"), " to that ", r("LengthyEntry"), " and then applying ", r("d3rbsr_fp_finalise"), ", and"],
        ["applying ", r("ddrbsr_fingerprint"), " to any other set of <Rs n="LengthyEntry"/> yields the result of applying ", r("d3rbsr_fp_singleton"), " to all members of the set individually, then combining the resulting ", rs("d3rbsr_fp"), " with ", r("d3rbsr_fp_combine"), " (grouping and ordering do not matter because of associativity and commutativity), and then applying ", r("d3rbsr_fp_finalise"), "."],
      )),

      pinformative("For <R n="d3rbsr"/> to work correctly, ", r("ddrbsr_fingerprint"), " must map distinct sets of <Rs n="LengthyEntry"/> to distinct ", rs("d3rbsr_fp"), " with high probability, even when facing maliciously crafted input sets. The ", link("range-based set reconciliation paper", "https://github.com/AljoschaMeyer/rbsr_short/blob/main/main.pdf"), " surveys suitable, cryptographically secure hash functions in section 5B. All but the Cayley hashes use commutative ", r("d3rbsr_fp_combine"), " functions, and are thus suitable for <R n="d3rbsr"/>. Further, ", r("d3rbsr_fp_finalise"), " must not map distinct inpus to equal outpts; suitable choices are the identity function (if no compression is needed) or traditional, secure hash functions."),
   */
        }
      </PageTemplate>
    </File>
  </Dir>
);
