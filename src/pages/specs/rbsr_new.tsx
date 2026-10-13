import { Dir, File } from "macromania-outfs";
import { AE, Alj, Gwil, Vermillion } from "../../macros.tsx";
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
  DefFunction,
  DefType,
  DefValue,
  SliceType,
  StructDef,
} from "macromania-rustic";
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
        htmlTitle="Region-Based Set Reconciliation"
        headingId="region_based_set_reconciliation"
        heading="Region-Based Set Reconciliation"
        bibliography
        toc
        parentId="specifications"
      >
        <P>
          When two peers wish to synchronise willow data, they typically start
          by determining which <Rs n="Area" />{" "}
          they share an interest in. Once that is done, they need to bring each
          other up to speed so that both peers have the most recent data in the
          intersection of their interests. This document presents a strategy for
          efficiently accomplishing that task.
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
          <Rs n="AuthorisedEntry" /> directly, but{" "}
          <Rs n="LengthyAuthorisedEntry" />:
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
                      The number of consecutive bytes from the start of the{" "}
                      <R n="lengthy_entry_entry" />’s <R n="Payload" />{" "}
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
            <Rs n="LengthyAuthorisedEntry" />, and they need to inform each
            other about all <Rs n="LengthyAuthorisedEntry" />{" "}
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
            <Def n="rangebsr" r="range-based set reconciliation" />
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
            src={<ResolveAsset asset={["rbsr", "fp_match.png"]} />}
            alt={`A glorified visualisation of equality: hashing the same objects yields the same fingerprints.`}
          />
          <Figcaption>
            <Purple>Alfie</Purple> and <Orange>Betty</Orange>{" "}
            produce equal fingerprints for all their <Rs n="AuthorisedEntry" />
            {" "}
            in a given <R n="AreaSlice" />.
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
            src={<ResolveAsset asset={["rbsr", "fp_nonmatching.png"]} />}
            alt={`A flow diagram that is already described in the caption.`}
          />
          <Figcaption>
            <Purple>Alfie</Purple> and <Orange>Betty</Orange>{" "}
            produce non-equal fingerprints. <Purple>Alfie</Purple> splits the
            {" "}
            <R n="AreaSlice" /> in two, yielding a <R n="AreaSlice" />{" "}
            <R n="area_slice_include">including</R> <Rs n="AuthorisedEntry" />
            {" "}
            <Code>A</Code> and <Code>B</Code>, and another <R n="AreaSlice" />
            {" "}
            <R n="area_slice_include">including</R>{" "}
            <Code>C</Code>, and sends these <Rs n="AreaSlice" />{" "}
            and their fingerprints to <Orange>Betty</Orange>.{" "}
            <Orange>Betty</Orange> produces a matching fingerprint for the first
            {" "}
            <R n="AreaSlice" />. As the other, mismatched <R n="AreaSlice" />
            {" "}
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
            src={<ResolveAsset asset={["rbsr", "drilling_down.png"]} />}
            alt={`A contiguous region is recursively split into subregions. Some subregions are coloured blue to indicate matching fingerprints; these are not split further. The total picture is that of a thinning tree growing downwards, ending in the few regions that require actual data exchange.`}
          />
          <Figcaption>
            Split apart <Vermillion>non-equal regions</Vermillion>{" "}
            to hone in on the locations of any differences, while disregarding
            {" "}
            <Blue>equal regions</Blue>.
          </Figcaption>
        </Figure>

        <P>
          <Def
            n="rbsr"
            r="region-based set reconciliation"
            preview={
              <>
                <Def fake n="rbsr">Region-based set reconciliation</Def>{" "}
                is an algorithm for letting two peers compute the union of their
                {" "}
                <Rs n="LengthyAuthorisedEntry" /> in some <R n="AreaSlice" />.
              </>
            }
          >
            Region-based set reconciliation
          </Def>{" "}
          takes these ideas and applies them to Willow. The core design decision
          is to delimit sets of <Rs n="LengthyAuthorisedEntry" /> via{" "}
          <Rs n="AreaSlice" />. When a peer splits an{" "}
          <Rs n="AreaSlice" />, it is crucial for overall efficiency to not
          split based on volume (for example, by splitting the{" "}
          <Rs n="ReconciliationRange" />{" "}
          in half numerically), but to split into subslices in which the peer
          holds roughly the same number of <Rs n="AuthorisedEntry" />.
        </P>

        <PreviewScope>
          <P>
            We will call the type of hashes of <Rs n="LengthyAuthorisedEntry" />
            {" "}
            that the peers exchange{" "}
            <DefType n="rbsr_fp" r="Fingerprint" rs="Fingerprints" />.
          </P>
        </PreviewScope>

        <Hsection n="rbsr_parameters" title="Fingerprinting">
          <P>
            <Rb n="rbsr" /> requires the ability to hash arbitrary sets of{" "}
            <Rs n="LengthyAuthorisedEntry" /> into values of some type{" "}
            <R n="rbsr_fp" />. We now describe the technique described in the
            range-based set reconciliation paper for computing fingerprints
            efficiently. The key idea is to ensure that the <R n="rbsr_fp" />
            {" "}
            for an <R n="AreaSlice" /> can be assembled from precomputed{" "}
            <Rs n="rbsr_fp" /> of other, smaller{" "}
            <Rs n="AreaSlice" />. What we describe now is not mandatory for
            Willow, but it probably is a good idea.
          </P>

          <PreviewScope>
            <P>
              We define the fingerprinting function in terms of some building
              blocks: <Rs n="LengthyAuthorisedEntry" /> are mapped into a set
              {" "}
              <DefType
                n="rbsr_prefp"
                r="PreFingerprint"
                rs="PreFingerprints"
              />{" "}
              with a function that satisfies certain algebraic properties that
              allow for incremental computation, and <Rs n="rbsr_prefp" />{" "}
              are then converted<Marginale>
                The split into <Rs n="rbsr_prefp" /> and <Rs n="rbsr_fp" />{" "}
                allows for compression: the <Rs n="rbsr_prefp" />{" "}
                might be efficient to compute but rather large, so you would not
                want to exchange them over the network. Converting a{" "}
                <R n="rbsr_prefp" /> into a <R n="rbsr_fp" />{" "}
                can be as simple as hashing it with a typical, secure hash
                function, thus preserving collision resistance but yielding
                smaller final fingerprints.
              </Marginale>{" "}
              into the final <R n="rbsr_fp" />.
            </P>

            <P>
              First, we require a function{" "}
              <DefFunction n="rbsr_fp_singleton" r="fingerprint_singleton" />
              {" "}
              that hashes individual <Rs n="LengthyAuthorisedEntry" />{" "}
              into the set{" "}
              <R n="rbsr_prefp" />. This hash function should take into account
              all aspects of the <R n="LengthyAuthorisedEntry" />: modifying its
              {" "}
              <R n="entry_namespace_id" />, <R n="entry_subspace_id" />,{" "}
              <R n="entry_path" />, <R n="entry_timestamp" />,{" "}
              <R n="entry_payload_digest" />,{" "}
              <R n="entry_payload_length" />, or its number of{" "}
              <R n="lengthy_entry_available" />{" "}
              bytes, should result in a completely different{" "}
              <R n="rbsr_prefp" />.
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
              <DefFunction n="rbsr_fp_combine" r="fingerprint_combine" />{" "}
              that maps two <Rs n="rbsr_prefp" /> to a single new{" "}
              <R n="rbsr_prefp" />. The <R n="rbsr_fp_combine" />{" "}
              function must further have a{" "}
              <AE href="https://en.wikipedia.org/wiki/Identity_element">
                neutral element
              </AE>{" "}
              <DefValue n="rbsr_neutral" r="fingerprint_neutral" />.
            </P>

            <P>
              Third, we require a function{" "}
              <DefFunction n="rbsr_fp_finalise" r="fingerprint_finalise" />{" "}
              that maps each <R n="rbsr_prefp" /> to the corresponding{" "}
              <R n="rbsr_fp" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Given these building blocks, we define the function{" "}
              <DefFunction n="ddrbsr_fingerprint" r="fingerprint" />{" "}
              from sets of <Rs n="LengthyAuthorisedEntry" /> to{" "}
              <R n="rbsr_fp" />:
            </P>
            <Ul>
              <Li>
                applying <R n="ddrbsr_fingerprint" /> to the empty set yields
                {" "}
                <Code>
                  <R n="rbsr_fp_finalise" />(<R n="rbsr_neutral" />)
                </Code>,
              </Li>
              <Li>
                applying <R n="ddrbsr_fingerprint" />{" "}
                to a set containing exactly one <R n="LengthyAuthorisedEntry" />
                {" "}
                yields the same result as applying <R n="rbsr_fp_singleton" />
                {" "}
                to that <R n="LengthyAuthorisedEntry" /> and then applying{" "}
                <R n="rbsr_fp_finalise" />, and
              </Li>
              <Li>
                applying <R n="ddrbsr_fingerprint" /> to any other set of{" "}
                <Rs n="LengthyAuthorisedEntry" /> yields the result of applying
                {" "}
                <R n="rbsr_fp_singleton" />{" "}
                to all members of the set individually, then combining the
                resulting <Rs n="rbsr_fp" /> with <R n="rbsr_fp_combine" />{" "}
                (grouping and ordering do not matter because of associativity
                and commutativity), and then applying{" "}
                <R n="rbsr_fp_finalise" />.
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
                    <SmallImg asset={["rbsr", "fp_bottle_empty.png"]}>
                      An empty bottle.
                    </SmallImg>
                  </Td>
                </Tr>
              </Tbody>
              <Tbody>
                <Td>
                  {`{ `}
                  <SmallImg asset={["rbsr", "fp_apple.png"]}>
                    A red apple.
                  </SmallImg>
                  {` }`}
                </Td>
                <Td>
                  <SmallImg asset={["rbsr", "fp_bottle_yellow.png"]}>
                    A bottle of apple juice.
                  </SmallImg>
                </Td>
              </Tbody>
              <Tbody>
                <Td>
                  {`{ `}
                  <SmallImg asset={["rbsr", "fp_apple.png"]}>
                    A red apple.
                  </SmallImg>
                  <SmallImg asset={["rbsr", "fp_celery.png"]}>
                    A celery.
                  </SmallImg>
                  <SmallImg asset={["rbsr", "fp_lemon.png"]}>
                    A lemon.
                  </SmallImg>
                  {` }`}
                </Td>
                <Td>
                  <SmallImg asset={["rbsr", "fp_bottle_green.png"]}>
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
            For <R n="rbsr" /> to work correctly, <R n="ddrbsr_fingerprint" />
            {" "}
            must map distinct sets of <Rs n="LengthyAuthorisedEntry" />{" "}
            to distinct <Rs n="rbsr_fp" />{" "}
            with high probability, even when facing maliciously crafted input
            sets. The range-based set reconciliation paper surveys suitable,
            cryptographically secure hash functions in section
            5B<Bib item="meyer2023range" />. All but the Cayley hashes use
            commutative <R n="rbsr_fp_combine" />{" "}
            functions, and are thus suitable for <R n="rbsr" />. Further,{" "}
            <R n="rbsr_fp_finalise" />{" "}
            must not map distinct inpus to equal outpts; suitable choices are
            the identity function (if no compression is needed) or traditional,
            secure hash functions.
          </P>
        </Hsection>
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
