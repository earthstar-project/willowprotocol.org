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
          <PreviewScope>
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
              and optionally their{" "}
              <Rs n="Payload" />, it can also request data by{" "}
              <R n="AreaOfInterest" /> or{" "}
              <R n="D3Range" />, it can request metadata for a purely{" "}
              <R n="wtp_client" />-driven{" "}
              <R n="d3_range_based_set_reconciliation">
                range-based set reconciliation
              </R>, and it can send new <Rs n="Entry" /> and their{" "}
              <Rs n="Payload" /> to the <R n="wtp_client" />. The{" "}
              <R n="wtp_server" />{" "}
              does not need to do anything but to reply to incoming requests —
              and it can always reply that it refused to do what was requested.
              The <R n="wtp_server" />{" "}
              needs to maintain only a tiny, constant amount of state for each
              connection (far eclipsed by the state necessary for maintaining
              the network connection itself).
            </P>
          </PreviewScope>

          <P>
            Whereas the <R n="wgps" />{" "}
            assembles some sophisticated techniques to allow for high
            confidentiality between completely untrusted peers, supports for
            bidirectional eager forwarding of novel information, multiplexes
            several independent data streams, and diligently optimises bandwidth
            usage, the <R n="wtp" />{" "}
            makes simplifying trust assumptions, has an unidirectionally flow of
            initiative, places responsibility for avoiding head-of-line blocking
            on the{" "}
            <R n="wtp_client" />, and sacrifices bandwidth for simplicity. In
            exchange, it goes easy on the computational resources of the{" "}
            <R n="wtp_server" />, and it is actually enjoyable and
            straightforward to implement.
          </P>

          <P>
            Partial implementations of the <R n="wtp" />{" "}
            can meaningfully interact with fully-featured ones. The{" "}
            <R n="wtp_client" />{" "}
            need not be able to process replies to types of requests it never
            makes. The <R n="wtp_server" />{" "}
            can refuse to process any incoming request, and it can communicate
            when the reason is due to unimplemented features. This allows the
            {" "}
            <R n="wtp_client" />{" "}
            to adapt its behaviour and to refrain from issuing requests the{" "}
            <R n="wtp_server" /> does not support.
          </P>

          <P>
            The <R n="wtp" />{" "}
            runs over any reliable, ordered, bidirectional, byte-oriented
            communication channel. If the <R n="wtp_client" />{" "}
            plans on working with non-public data, the communication channel
            must be confidential and it must be impossible for an active
            attacker to inpersonate the trusted <R n="wtp_server" />. If the
            {" "}
            <R n="wtp_client" />{" "}
            only works with public data, the channel is allowed to be
            non-confidential. Eavesdroppers might then learn about the{" "}
            <R n="wtp_client" />’s interests; it is up to the{" "}
            <R n="wtp_client" /> to gauge whether that is acceptable.
          </P>
        </Hsection>

        <Hsection n="wtp_parameters" title="Parameters">
          <P>
            <Marginale>
              See <R n="willow25" /> for a default recommendation of parameters.
            </Marginale>
            The <R n="wtp" />{" "}
            is generic over specific cryptographic primitives. In order to use
            it, one must first specify a full suite of instantiations of the
            {" "}
            <R n="willow_parameters">
              parameters of the core Willow data model
            </R>, as well as the following parameters:
          </P>

          <PreviewScope>
            <P>
              A type{" "}
              <DefType
                n="WtpReadCapability"
                r="ReadCapability"
                rs="ReadCapabilities"
              />{" "}
              of <Rs n="read_capability" />,<Marginale>
                We recommend the <R n="meadowcap" /> <Rs n="Capability" />{" "}
                with an <R n="cap_mode" /> of <R n="access_read" />{" "}
                as the type of <Rs n="WtpReadCapability" />.
              </Marginale>{" "}
              a type <DefType n="wtp_receiver" r="Receiver" rs="Receivers" /> of
              {" "}
              <Rs n="access_receiver" />, and the type{" "}
              <DefType n="wtp_signature" r="Signature" rs="Signatures" /> of
              {" "}
              <Rs n="dss_signature" /> issued by the <R n="wtp_receiver" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              A type{" "}
              <DefType n="WtpFingerprint" r="Fingerprint" rs="Fingerprints" />
              {" "}
              of <Rs n="d3rbsr_fp" /> (i.e., of hashes of{" "}
              <Rs n="LengthyAuthorisedEntry" />), and a hash function{" "}
              <DefFunction
                n="wtp_hash_lengthy_authorised_entries"
                r="hash_lengthy_authorised_entries"
              />{" "}
              from finite sets of <Rs n="LengthyAuthorisedEntry" /> to{" "}
              <R n="WtpFingerprint" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We specify the requirements for{" "}
              <R n="sync_verified_streaming">verified streaming</R>{" "}
              in a rather abstract way: there must be a{" "}
              <Sidenote
                note={
                  <>
                    A function in the mathematical sense, you would not actually
                    implement the transformation in this form.
                  </>
                }
              >
                function
              </Sidenote>{" "}
              <DefFunction n="wtp_transform_payload" r="transform_payload" />
              {" "}
              that maps a <R n="Payload" /> into a sequence of up to{" "}
              <M>
                2^<Curly>64</Curly> - 1
              </M>{" "}
              bytestrings, called the transformed{" "}
              <DefType n="WtpChunk" r="Chunk" rs="Chunks">Chunks</DefType>. The
              number and lengths of the <Rs n="WtpChunk" />{" "}
              must be fully determined by the length of the{" "}
              <R n="Payload" />; the actual values of the bytes of the{" "}
              <R n="Payload" /> must not affect the number and length of the
              {" "}
              <R n="WtpChunk" />.<Marginale>
                To give an example of how this construction maps to verifiable
                streaming: <R n="transform_payload" /> could map a{" "}
                <R n="Payload" /> to a{" "}
                <AE href="https://worm-blossom.github.io/bab/#baseline">
                  Bab baseline verifiable stream
                </AE>.
              </Marginale>{" "}
              Peers exchange concatenations of <Rs n="WtpChunk" />{" "}
              instead of actual payloads, and communicate offsets in that data
              in terms of <R n="WtpChunk" /> offsets.
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection n="wtp_protocol" title="Protocol">
          <P>
            The <R n="wtp" />{" "}
            is message-based. The first message sent by each peer is a dedicated
            setup message. After having sent its setup message, the{" "}
            <R n="wtp_client" />{" "}
            can send a number of request messages, in arbitrary order. The{" "}
            <R n="wtp_server" />{" "}
            replies to each request message with exactly one response message.
          </P>

          <P>
            Peers might receive invalid messages, both syntactically (i.e.,
            invalid encodings) and semantically (i.e., logically inconsistent
            messages). In both cases, the peer to detect this behaviour must
            abort the sync session. We indicate such situations by writing that
            something{" "}
            <Quotes>is an error</Quotes>. Whenever we state that a message must
            fulfil some criteria, but a peer receives a message that does not
            fulfil these criteria, that is an error.
          </P>

          <PreviewScope>
            <P>
              We start the message descriptions with the setup messages. The
              {" "}
              <R n="WtpServerSetupMessage" /> contains a{" "}
              <DefValue n="wtp_challenge" r="challenge" rs="challenges" />, a
              128-bit random number for which the <R n="wtp_client" />{" "}
              must provide a valid signature in its own setup message. The{" "}
              <R n="WtpServerSetupMessage" />{" "}
              also contains some (non-binding) information about which{" "}
              <R n="wtp" /> features the <R n="wtp_server" />{" "}
              implements. For each feature, the <R n="wtp_server" /> supplies an
              {" "}
              <R n="AvailabilityInfo" />:
            </P>
          </PreviewScope>

          <Pseudocode n="wtp_availability_def">
            <Enum
              comment={
                <>
                  Information about the degree to which the <R n="wtp_server" />
                  {" "}
                  implements and provides a feature of the <R n="wtp" />.
                </>
              }
              id={["AvailabilityInfo", "AvailabilityInfo", "AvailabilityInfo"]}
              variants={[
                {
                  tuple: true,
                  comment: (
                    <>
                      The <R n="wtp_server" />{" "}
                      does not want to supply any information about this
                      feature. Reasons might include reducing the surface for
                      fingerprinting particular implementations or deployments,
                      or perhaps the implementer did not want to spend time on
                      providing accurate information.
                    </>
                  ),
                  id: ["WontTell", "AvailabilityInfoWontTell"],
                },
                {
                  tuple: true,
                  comment: (
                    <>
                      The feature is not available to this <R n="wtp_client" />
                      {" "}
                      at all. Perhaps the <R n="wtp_server" />{" "}
                      does not implement it, perhaps the <R n="wtp_server" />
                      {" "}
                      does not want to spend the required resources for this
                      {" "}
                      <R n="wtp_client" />. No matter why, the{" "}
                      <R n="wtp_client" />{" "}
                      need not bother make requests which rely on this feature.
                    </>
                  ),
                  id: ["Unavailable", "AvailabilityInfoUnavailable"],
                },
                {
                  tuple: true,
                  comment: (
                    <>
                      The feature may or may not be available, depending on some
                      unknown factor such as perhaps the <R n="namespace" />,
                      {" "}
                      <R n="subspace" />{" "}
                      or other request data, or perhaps the weather. When making
                      requests which rely on this feature, the{" "}
                      <R n="wtp_client" />{" "}
                      should know that it may or may not get the response it
                      hoped for.
                    </>
                  ),
                  id: ["Depends", "AvailabilityInfoDepends"],
                },
                {
                  tuple: true,
                  comment: (
                    <>
                      The feature is available. The <R n="wtp_client" />{" "}
                      should assume that requests which rely on this feature
                      will get a satisfactory reply.
                    </>
                  ),
                  id: ["Available", "AvailabilityInfoAvailable"],
                },
              ]}
            />
          </Pseudocode>

          <P>
            The <R n="WtpServerSetupMessage" /> combines a{" "}
            <R n="wtp_challenge" /> with the <R n="AvailabilityInfo" />{" "}
            for various features:<Alj>
              TODO: add more features here as they come up in requests.
            </Alj>
          </P>

          <Pseudocode n="wtp_defs_server_setup_message">
            <StructDef
              comment={
                <>
                  The first message sent by the{" "}
                  <R n="wtp_server" />. The various <Rs n="AvailabilityInfo" />
                  {" "}
                  serve as optimisation hints for the{" "}
                  <R n="wtp_client" />, but they are not binding: the{" "}
                  <R n="wtp_server" /> might claim that a feature is{" "}
                  <R n="AvailabilityInfoAvailable" />, yet later reply to a
                  request that the feature is unsupported. Such behaviour is
                  obviously not ideal, but not expressly forbidden.
                </>
              }
              id={["ServerSetupMessage", "WtpServerSetupMessage"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        The <R n="wtp_challenge" /> for the <R n="wtp_client" />
                        {" "}
                        in this <R n="wtp" />{" "}
                        session. This must be a nonce, sending the same{" "}
                        <R n="wtp_challenge" /> twice might allow a malicious
                        {" "}
                        <R n="wtp_client" /> to sidestep access control. The
                        {" "}
                        <R n="wtp_challenge" />{" "}
                        is sufficiently large that generating a random number
                        for each connection keeps things secure.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      [
                        "challenge",
                        "WtpServerSetupMessageChallenge",
                        "challenges",
                      ],
                      <ArrayType count="16">
                        <R n="U8" />
                      </ArrayType>,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        Whether the <R n="wtp_server" />{" "}
                        supports working with transformed <R n="Payload" />{" "}
                        <Rs n="WtpChunk" />. If this feature is{" "}
                        <R n="AvailabilityInfoUnavailable" />, the{" "}
                        <R n="wtp_client" />{" "}
                        can fall back to working with raw, byte-indexed{" "}
                        <R n="Payload" />, foregoing incremental authentication
                        of <R n="Payload" /> slices.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      [
                        "availability_transformed_payloads",
                        "wtp_availability_transformed_payloads",
                      ],
                      <R n="AvailabilityInfo" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        Whether the <R n="wtp_server" />{" "}
                        supports working withraw, byte-indexed{" "}
                        <Rs n="Payload" />. If this feature is{" "}
                        <R n="AvailabilityInfoUnavailable" />, the{" "}
                        <R n="wtp_client" /> must work with transformed{" "}
                        <R n="Payload" /> <Rs n="WtpChunk" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      [
                        "availability_raw_payloads",
                        "wtp_availability_raw_payloads",
                      ],
                      <R n="AvailabilityInfo" />,
                    ],
                  },
                },
              ]}
            />
          </Pseudocode>

          <P>
            The first message sent by the <R n="wtp_client" /> consists of a
            {" "}
            <R n="wtp_receiver" />, and a signature with that{" "}
            <R n="wtp_receiver" /> over the previously received{" "}
            <R n="WtpServerSetupMessageChallenge" /> issued by the{" "}
            <R n="wtp_server" />. This <R n="wtp_receiver" /> must be the{" "}
            <R n="access_receiver" /> of every <R n="WtpReadCapability" />{" "}
            which the <R n="wtp_client" /> will supply over the course of this
            {" "}
            <R n="wtp" /> session. This <R n="wtp_receiver" />{" "}
            is one of the few pieces of state the <R n="wtp_server" />{" "}
            must maintain for the duration of the <R n="wtp" /> session.
          </P>

          <Pseudocode n="wtp_defs_client_setup_message">
            <StructDef
              comment={
                <>
                  The first message sent by the{" "}
                  <R n="wtp_client" />. If the underlying{" "}
                  <R n="signature_scheme" /> is secure, a valid{" "}
                  <R n="WtpClientSetupMessage" /> can only be sent after the
                  {" "}
                  <R n="wtp_client" /> has received the{" "}
                  <R n="WtpServerSetupMessage" /> message.
                </>
              }
              id={["ClientSetupMessage", "WtpClientSetupMessage"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        The single <R n="wtp_receiver" /> of every{" "}
                        <R n="WtpReadCapability" /> the <R n="wtp_client" />
                        {" "}
                        will send in this <R n="wtp" /> session.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      [
                        "read_capability_receiver",
                        "WtpClientSetupMessageReadCapabilityReceiver",
                        "read_capability_receivers",
                      ],
                      <R n="wtp_receiver" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        A <R n="dss_signature" /> issued by the{" "}
                        <R n="WtpClientSetupMessageReadCapabilityReceiver" />
                        {" "}
                        over the <R n="WtpServerSetupMessageChallenge" />{" "}
                        of the previously received{" "}
                        <R n="WtpServerSetupMessage" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      [
                        "signature",
                        "WtpClientSetupMessageSignature",
                      ],
                      <R n="wtp_signature" />,
                    ],
                  },
                },
              ]}
            />
          </Pseudocode>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
