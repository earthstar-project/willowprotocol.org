import { Dir, File } from "macromania-outfs";
import { AE, Gwil, Vermillion } from "../../macros.tsx";
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

export const rbsr_old = (
  <Dir name="rbsr_3d">
    <File name="index.html">
      <PageTemplate
        htmlTitle="3d Range-Based Set Reconciliation"
        headingId="d3_range_based_set_reconciliation"
        heading="3d Range-Based Set Reconciliation"
        parentId="specifications"
      >
        <P>
          This page has been superseded by the page on{" "}
          <R n="region_based_set_reconciliation">
            region-based set reconciliation
          </R>. The only links to this page should be from the{" "}
          <R n="willow_confidential_sync">Confidential Sync</R>{" "}
          draft specification, whose development is put on hold and which uses a
          few obsoleted concepts.
        </P>

        <P>
          In particular, that specification refers to{" "}
          <Def
            n="d3rbsr"
            r="3d range-based set reconciliation"
            preview={
              <>
                <Def fake n="d3rbsr">3d range-based set reconciliation</Def>
                {" "}
                is an algorithm for letting two peers compute the union of their
                {" "}
                <Rs n="LengthyAuthorisedEntry" /> in some <R n="D3Range" />{" "}
                by exchanging <Rs n="D3RangeFingerprint" /> and{" "}
                <Rs n="D3RangeEntrySet" />.
              </>
            }
          />, which is <R n="rbsr">region-based set reconciliation</R> using
          {" "}
          <Rs n="D3Range" /> as regions. Our not-outdated specifications use
          {" "}
          <Rs n="AreaSlice" /> instead of <Rs n="D3Range" />.
        </P>

        <P>
          What follows are some definitions that are still referenced from the
          {" "}
          <R n="willow_confidential_sync">Confidential Sync</R>{" "}
          spec draft. We keep them here for completeness, but you should
          consider them deprecated; when we return to Confidential Sync
          development it will use <Rs n="AreaSlice" /> as regions as well.
        </P>

        <Hr />

        <PreviewScope>
          <P>
            Let <DefType n="d3rbsr_fp" r="Fingerprint" rs="Fingerprints" />{" "}
            denote the type of hashes of <Rs n="LengthyAuthorisedEntry" />{" "}
            that the peers exchange. Then the precise pieces of information that
            the peers need to exchange are the following:
          </P>
        </PreviewScope>

        <Pseudocode n="rbsr_message_defs">
          <StructDef
            comment={
              <>
                The <R n="d3rbsr_fp" /> over all{" "}
                <Rs n="LengthyAuthorisedEntry" /> a peer holds in some{" "}
                <R n="D3Range" />.
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
                      The <R n="d3rbsr_fp" /> over the{" "}
                      <Rs n="LengthyAuthorisedEntry" />{" "}
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
                The set of <Rs n="LengthyAuthorisedEntry" />{" "}
                a peer holds in some <R n="D3Range" />.
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
                      The <Rs n="LengthyAuthorisedEntry" />{" "}
                      that the sender holds in the{" "}
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
          <Code>false</Code>, and omitting all <Rs n="LengthyAuthorisedEntry" />
          {" "}
          it had just received in the other peer’s <R n="D3RangeEntrySet" />.
        </P>

        <P>
          When a peer receives a <R n="D3RangeFingerprint" /> that matches the
          {" "}
          <R n="d3rbsr_fp" /> over its local <Rs n="LengthyAuthorisedEntry" />
          {" "}
          in the same <R n="D3Range" />, the peer should reply with an empty
          {" "}
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
      </PageTemplate>
    </File>
  </Dir>
);
