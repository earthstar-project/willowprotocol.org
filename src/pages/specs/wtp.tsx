import { Dir, File } from "macromania-outfs";
import {
  AE,
  Alj,
  Blue,
  Curly,
  Gwil,
  NoWrap,
  Path,
  Quotes,
  Vermillion,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, Figcaption, Figure, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  ArrayType,
  ChoiceType,
  DefFunction,
  DefType,
  DefValue,
  DefVariant,
  Enum,
  SliceType,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { Bib } from "macromania-bib/mod.tsx";
import {
  bitfieldArbitrary,
  bitfieldConditionalString,
  bitfieldConstant,
  bitfieldIff,
  C64Encoding,
  c64Tag,
  CodeFor,
  EncodingRelationTemplate,
  RawBytes,
  ValAccess,
} from "../../encoding_macros.tsx";
import { EncConditional, ValName } from "../../encoding_macros.tsx";

export const wtp = (
  <Dir name="wtp">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow Transfer Protocol"
        headingId="wtp_spec"
        heading="Willow Transfer Protocol"
        toc
        status="proposal"
        statusDate="19.09.2025"
        parentId="specifications"
      >
        <PreviewScope>
          <P>
            The <R n="data_model">Willow data model</R>{" "}
            specifies how to arrange data, but it does not prescribe how peers
            can exchange it. In this document, we specify one possible protocol
            for data exchange: the{" "}
            <Def n="wtp" r="WTP">
              Willow Transfer Protocol
            </Def>. This document assumes familiarity with the{" "}
            <R n="data_model">Willow data model</R>.
          </P>
        </PreviewScope>

        <Hsection n="wtp_intro" title="Introduction">
          <P>
            The <R n="wtp" /> is an asymmetric protocol in which a{" "}
            <Def n="wtp_client" r="client" rs="server" />{" "}
            proactively sends requests to a purely reactive{" "}
            <Def n="wtp_server" r="server" rs="servers" />, who replies with a
            single response to each request. The <R n="wtp_client" />{" "}
            implicitly trusts the <R n="wtp_server" />{" "}
            to be allowed to know about all the metadata of its requests, such
            as <Rs n="NamespaceId" />, <Rs n="SubspaceId" />,{" "}
            <Rs n="Path" />, or <Rs n="AuthorisationToken" />. The{" "}
            <R n="wtp_server" />, however, does not need to trust the{" "}
            <R n="wtp_client" /> at all — the <R n="wtp_client" />{" "}
            must prove its access rights for all its requests.
          </P>

          <P>
            The <R n="wtp_client" /> can request individual <Rs n="Entry" />
            {" "}
            and optionally their <Rs n="Payload" />, it can also request data by
            {" "}
            <R n="AreaOfInterest" /> or{" "}
            <R n="D3Range" />, it can request metadata for a purely{" "}
            <R n="wtp_client" />-driven{" "}
            <R n="d3_range_based_set_reconciliation">
              range-based set reconciliation
            </R>, and it can send new <Rs n="Entry" /> and their{" "}
            <Rs n="Payload" /> to the <R n="wtp_client" />. The{" "}
            <R n="wtp_server" />{" "}
            does not need to do anything but to reply to incoming requests — and
            it can always reply that it refused to do what was requested. The
            {" "}
            <R n="wtp_server" />{" "}
            needs to maintain only a tiny, constant amount of state for each
            connection (far eclipsed by the state necessary for maintaining the
            network connection itself).
          </P>

          <P>
            Whereas the <R n="wgps" />{" "}
            assembles some sophisticated techniques to allow for high
            confidentiality between completely untrusted peers, supports for
            bidirectional eager forwarding of novel information, multiplexes
            several independent data streams, and diligently optimises bandwidth
            usage, the <R n="wtp" />{" "}
            makes simplifying trust assumptions, works only unidirectionally,
            places responsibility for avoiding head-of-line blocking on the{" "}
            <R n="wtp_client" />, and sacrifices bandwidth for simplicity. In
            exchange, it goes easy on the computational resources of the{" "}
            <R n="wtp_server" />, and it is actually enjoyable and
            straightforward to implement.
          </P>

          <P>
            The <R n="wtp" />{" "}
            runs over any reliable, ordered, bidirectional, byte-oriented
            communication channel.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
