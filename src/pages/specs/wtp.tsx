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
import { Loc, Pseudocode } from "macromania-pseudocode";
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
            </R>. The <R n="hash_payload" /> function must be a member of the
            {" "}
            <AE href="https://worm-blossom.github.io/bab/">
              Bab family of hash functions
            </AE>. Additionally, the <R n="wtp" />{" "}
            requires the following parameters:
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

          <P>
            We define all messages as purely logical data types first, with the
            actual wire encoding defined <R n="wtp_encodings">last</R>.
          </P>

          <Hsection n="wtp_setup" title="Setup Messages">
            <PreviewScope>
              <P>
                We start the message descriptions with the setup messages. The
                {" "}
                <R n="WtpServerSetupMessage" /> contains a{" "}
                <DefValue n="wtp_challenge" r="challenge" rs="challenges" />, a
                128-bit random number for which the <R n="wtp_client" />{" "}
                must provide a valid signature in its own setup message. The
                {" "}
                <R n="WtpServerSetupMessage" />{" "}
                also contains some (non-binding) information about which{" "}
                <R n="wtp" /> features the <R n="wtp_server" />{" "}
                implements. For each feature, the <R n="wtp_server" />{" "}
                supplies an <R n="Availability" />:
              </P>
            </PreviewScope>

            <Pseudocode n="wtp_availability_def">
              <Enum
                comment={
                  <>
                    Information about the degree to which the{" "}
                    <R n="wtp_server" />{" "}
                    implements and provides a feature of the <R n="wtp" />.
                  </>
                }
                id={[
                  "Availability",
                  "Availability",
                  "Availability",
                ]}
                variants={[
                  {
                    tuple: true,
                    comment: (
                      <>
                        The <R n="wtp_server" />{" "}
                        does not want to supply any information about this
                        feature. Reasons might include reducing the surface for
                        fingerprinting particular implementations or
                        deployments, or perhaps the implementer did not want to
                        spend time on providing accurate information.
                      </>
                    ),
                    id: ["WontTell", "AvailabilityWontTell"],
                  },
                  {
                    tuple: true,
                    comment: (
                      <>
                        The feature is not available to this{" "}
                        <R n="wtp_client" /> at all. Perhaps the{" "}
                        <R n="wtp_server" /> does not implement it, perhaps the
                        {" "}
                        <R n="wtp_server" />{" "}
                        does not want to spend the required resources for this
                        {" "}
                        <R n="wtp_client" />. No matter why, the{" "}
                        <R n="wtp_client" />{" "}
                        need not bother make requests which rely on this
                        feature.
                      </>
                    ),
                    id: ["Unavailable", "AvailabilityUnavailable"],
                  },
                  {
                    tuple: true,
                    comment: (
                      <>
                        The feature may or may not be available, depending on
                        some unknown factor such as perhaps the{" "}
                        <R n="namespace" />, <R n="subspace" />{" "}
                        or other request data, or perhaps the weather. When
                        making requests which rely on this feature, the{" "}
                        <R n="wtp_client" />{" "}
                        should know that it may or may not get the response it
                        hoped for.
                      </>
                    ),
                    id: ["Depends", "AvailabilityDepends"],
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
                    id: ["Available", "AvailabilityAvailable"],
                  },
                ]}
              />
            </Pseudocode>

            <P>
              The <R n="WtpServerSetupMessage" /> combines a{" "}
              <R n="wtp_challenge" /> with the <R n="Availability" />{" "}
              for various features:<Alj>
                TODO: add more features here as they come up in requests.
              </Alj>
            </P>

            <Pseudocode n="wtp_defs_server_setup_message">
              <StructDef
                comment={
                  <>
                    The first message sent by the{" "}
                    <R n="wtp_server" />. The various <Rs n="Availability" />
                    {" "}
                    serve as optimisation hints for the{" "}
                    <R n="wtp_client" />, but they are not binding: the{" "}
                    <R n="wtp_server" /> might claim that a feature is{" "}
                    <R n="AvailabilityAvailable" />, yet later reply to a
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
                          The <R n="wtp_challenge" /> for the{" "}
                          <R n="wtp_client" /> in this <R n="wtp" />{" "}
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
                          supports properly responding to{" "}
                          <R n="WtpRequestSpecific" /> messages.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "feature_req_specific",
                          "wtp_feature_req_specific",
                        ],
                        <R n="Availability" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Whether the <R n="wtp_server" /> supports serving{" "}
                          <Rs n="Payload" /> via responses to{" "}
                          <R n="WtpRequestSpecific" /> messages.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "feature_req_specific_payload",
                          "wtp_feature_req_specific_payload",
                        ],
                        <R n="Availability" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Whether the <R n="wtp_server" /> supports serving{" "}
                          raw, byte-indexed <Rs n="Payload" />{" "}
                          slices in its responses to{" "}
                          <R n="WtpRequestSpecific" />{" "}
                          messages (as opposed to Bab-based authenticated
                          slices).
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "feature_req_specific_raw_slices",
                          "wtp_feature_req_specific_raw_slices",
                        ],
                        <R n="Availability" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Whether the <R n="wtp_server" /> supports serving{" "}
                          Bab authenticated <Rs n="Payload" />{" "}
                          slices in its responses to{" "}
                          <R n="WtpRequestSpecific" />{" "}
                          messages (as opposed to raw, byte-indexed slices).
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "feature_req_specific_authenticated_slices",
                          "wtp_feature_req_specific_authenticated_slices",
                        ],
                        <R n="Availability" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Whether the <R n="wtp_server" /> supports serving{" "}
                          Bab authenticated <Rs n="Payload" />{" "}
                          slices in its responses to{" "}
                          <R n="WtpRequestSpecific" /> messages with a{" "}
                          <R n="WtpPartialVerificationK" /> other than{" "}
                          <Code>1</Code>.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "feature_req_specific_fancy_k",
                          "wtp_feature_req_specific_fancy_k",
                        ],
                        <R n="Availability" />,
                      ],
                    },
                  },
                  // {
                  //   commented: {
                  //     comment: (
                  //       <>
                  //         Whether the <R n="wtp_server" />{" "}
                  //         supports sending transformed <R n="Payload" />{" "}
                  //         <Rs n="WtpChunk" />. If this feature is{" "}
                  //         <R n="AvailabilityUnavailable" />, the{" "}
                  //         <R n="wtp_client" />{" "}
                  //         can possibly fall back to requesting raw, byte-indexed
                  //         {" "}
                  //         <R n="Payload" />, foregoing incremental
                  //         authentication of the <R n="Payload" />{" "}
                  //         slices it receives.
                  //       </>
                  //     ),
                  //     dedicatedLine: true,
                  //     segment: [
                  //       [
                  //         "availability_send_transformed_payloads",
                  //         "wtp_availability_send_transformed_payloads",
                  //       ],
                  //       <R n="Availability" />,
                  //     ],
                  //   },
                  // },
                  // {
                  //   commented: {
                  //     comment: (
                  //       <>
                  //         Whether the <R n="wtp_server" />{" "}
                  //         supports sending raw, byte-indexed{" "}
                  //         <Rs n="Payload" />. If this feature is{" "}
                  //         <R n="AvailabilityUnavailable" />, the{" "}
                  //         <R n="wtp_client" /> should request transformed{" "}
                  //         <R n="Payload" /> <Rs n="WtpChunk" />{" "}
                  //         instead. If both this feature and the{" "}
                  //         <R n="wtp_availability_send_transformed_payloads" />
                  //         {" "}
                  //         feature are <R n="AvailabilityUnavailable" />, the
                  //         {" "}
                  //         <R n="wtp_server" /> signals that it does not send
                  //         {" "}
                  //         <Rs n="Payload" /> at all.
                  //       </>
                  //     ),
                  //     dedicatedLine: true,
                  //     segment: [
                  //       [
                  //         "availability_raw_payloads",
                  //         "wtp_availability_raw_payloads",
                  //       ],
                  //       <R n="Availability" />,
                  //     ],
                  //   },
                  // },
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
              <R n="access_receiver" /> of every <R n="WtpReadCapability" />
              {" "}
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

          <Hsection
            n="wtp_requests_and_responses"
            title="Requests and Responses"
          >
            <P>
              Now, we describe the requests the <R n="wtp_client" />{" "}
              can make, and the corresponding responses with which the{" "}
              <R n="wtp_server" /> can reply.
            </P>

            <PreviewScope>
              <P>
                The <R n="wtp_server" />{" "}
                can reply to requests in arbitrary order. To map responses to
                requests, each request is implictly assigned an unsigned 64-bit
                {" "}
                <DefType n="wtp_request_id" r="RequestId" />: the{" "}
                <Sidenote
                  note={
                    <>
                      The <R n="WtpClientSetupMessage" /> does <Em>not</Em>{" "}
                      count.
                    </>
                  }
                >
                  first
                </Sidenote>{" "}
                request sent by the <R n="wtp_client" /> has{" "}
                <R n="wtp_request_id" /> zero, the next has{" "}
                <R n="wtp_request_id" /> one, and so on. When{" "}
                <Sidenote
                  note={
                    <>
                      This will never happen in practice.{" "}
                      <M>
                        2^<Curly>64</Curly>
                      </M>{" "}
                      is a pretty large number.
                    </>
                  }
                >
                  reaching
                </Sidenote>{" "}
                <M post=",">
                  2^<Curly>64</Curly>
                </M>{" "}
                instead continue with <R n="wtp_request_id" /> zero again.
              </P>
            </PreviewScope>

            <P>
              There are three different kinds of requests, and three different
              kinds of request-specific responses. The responses each consist of
              the <R n="wtp_request_id" />{" "}
              of the request to which they reply, followed by a
              (request-specific) status code, followed by the (request-specific)
              response data — if the status code indicated success.
            </P>

            <Hsection
              n="wtp_request_specific"
              title={<Code>RequestSpecific</Code>}
            >
              <P>
                The first kind of request allows to request a specific
                contiguous slice of the <R n="Payload" /> of a specific{" "}
                <R n="AuthorisedEntry" />. The requested slice might be empty,
                which amounts to requesting only the <R n="AuthorisedEntry" />
                {" "}
                itself.
              </P>

              <Pseudocode n="wtp_defs_RequestSpecific">
                <StructDef
                  comment={
                    <>
                      Request a contiguous, possibly empty subslice of the{" "}
                      <R n="Payload" /> of a specific <R n="AuthorisedEntry" />.
                    </>
                  }
                  id={[
                    "RequestSpecific",
                    "WtpRequestSpecific",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="entry_namespace_id" /> of the requested
                            {" "}
                            <R n="AuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "namespace_id",
                            "WtpRequestSpecificNamespaceId",
                            "namespace_ids",
                          ],
                          <R n="NamespaceId" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="entry_subspace_id" /> of the requested
                            {" "}
                            <R n="AuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "subspace_id",
                            "WtpRequestSpecificSubspaceId",
                            "subspace_ids",
                          ],
                          <R n="SubspaceId" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="entry_path" /> of the requested{" "}
                            <R n="AuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "path",
                            "WtpRequestSpecificPath",
                            "paths",
                          ],
                          <R n="Path" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            A <R n="WtpReadCapability" /> whose{" "}
                            <R n="granted_namespace" /> must be the requested
                            {" "}
                            <R n="WtpRequestSpecificNamespaceId" />, and whose
                            {" "}
                            <R n="granted_area" /> must be able to{" "}
                            <R n="area_include" /> <Rs n="Entry" />{" "}
                            of the requested{" "}
                            <R n="WtpRequestSpecificSubspaceId" /> and{" "}
                            <R n="WtpRequestSpecificPath" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "read_capability",
                            "WtpRequestSpecificReadCapability",
                            "read_capabilities",
                          ],
                          <R n="Path" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Optionally the expected{" "}
                            <R n="entry_payload_digest" /> of the requested{" "}
                            <R n="AuthorisedEntry" />. If this is not{" "}
                            <R n="wtp_request_specific_payload_digest_none" />
                            {" "}
                            and the <R n="wtp_server" /> has an <R n="Entry" />
                            {" "}
                            of the correct <R n="entry_namespace_id" />,{" "}
                            <R n="entry_subspace_id" /> and{" "}
                            <R n="entry_path" />, but its{" "}
                            <R n="entry_payload_digest" />{" "}
                            does not match this value, then the{" "}
                            <R n="wtp_server" />{" "}
                            replies with a non-successful status code and no
                            additional data.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_digest",
                            "WtpRequestSpecificPayloadDigest",
                            "payload_digests",
                          ],
                          <ChoiceType
                            types={[
                              <R n="PayloadDigest" />,
                              <DefVariant
                                n="wtp_request_specific_payload_digest_none"
                                r="none"
                              />,
                            ]}
                          />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            If this is{" "}
                            <Code>true</Code>, the response to this request
                            omits the requested{" "}
                            <R n="AuthorisedEntry" />, transmitting{" "}
                            <Em>only</Em> the <R n="Payload" />{" "}
                            slice. Should only be used with an actual{" "}
                            <R n="WtpRequestSpecificPayloadDigest" />, to ensure
                            that the <R n="wtp_client" />{" "}
                            does not accidentally receive a <R n="Payload" />
                            {" "}
                            slice from an unexpected <R n="Entry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "skip_entry",
                            "WtpRequestSpecificSkipEntry",
                            "skip_entry",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            <P>
                              Specifies a minimum timestamp for any{" "}
                              <R n="AuthorisedEntry" /> the <R n="wtp_server" />
                              {" "}
                              might reply with. If this is not{" "}
                              <R n="wtp_request_specific_minimum_timestamp_none" />
                              {" "}
                              and the <R n="wtp_server" /> stores a matching
                              {" "}
                              <R n="AuthorisedEntry" />, but its{" "}
                              <R n="entry_timestamp" /> is less than this{" "}
                              <R n="WtpRequestSpecificMinimumTimestamp" />, the
                              {" "}
                              <R n="wtp_server" /> responds with the{" "}
                              <R n="WtpResponseSpecificStatusCodeTooOld" />{" "}
                              status code instead of supplying the{" "}
                              <R n="AuthorisedEntry" /> (and/or a part of its
                              {" "}
                              <R n="Payload" />).
                            </P>

                            <P>
                              If this is not{" "}
                              <R n="wtp_request_specific_minimum_timestamp_none" />,
                              and the <R n="WtpRequestSpecificPayloadDigest" />
                              {" "}
                              is also not{" "}
                              <R n="wtp_request_specific_payload_digest_none" />,
                              the semantics of the{" "}
                              <R n="WtpRequestSpecificPayloadDigest" />{" "}
                              change: it does not need to match exactly any
                              more, instead it factors into the{" "}
                              <R n="entry_newer" />-than relation: if the{" "}
                              <R n="wtp_server" /> has an appropriate{" "}
                              <R n="AuthorisedEntry" /> of{" "}
                              <R n="entry_timestamp" /> exactly{" "}
                              <R n="WtpRequestSpecificMinimumTimestamp" />, it
                              responds with the{" "}
                              <R n="WtpResponseSpecificStatusCodeTooOld" />{" "}
                              status code only if the{" "}
                              <R n="entry_payload_digest" /> of the candidate
                              {" "}
                              <R n="AuthorisedEntry" />{" "}
                              is strictly less than the{" "}
                              <R n="WtpRequestSpecificPayloadDigest" />.
                            </P>

                            <P>
                              Finally, this field must be{" "}
                              <R n="wtp_request_specific_minimum_timestamp_none" />
                              {" "}
                              if <R n="WtpRequestSpecificSkipEntry" /> is{" "}
                              <Code>true</Code>. There is no status code for
                              indicating a mismatch because the message encoding
                              ensures this.
                            </P>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "minimum_timestamp",
                            "WtpRequestSpecificMinimumTimestamp",
                            "minimum_timestamp",
                          ],
                          <ChoiceType
                            types={[
                              <R n="Timestamp" />,
                              <DefVariant
                                n="wtp_request_specific_minimum_timestamp_none"
                                r="none"
                              />,
                            ]}
                          />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The start offset (zero-indexed, inclusive) of the
                            requested <R n="Payload" /> slice.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "slice_from",
                            "WtpRequestSpecificSliceFrom",
                            "slice_from",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The length of the requested <R n="Payload" />{" "}
                            slice. Note that requesting a very large slice might
                            result in a very large reply, which could take a
                            very long time to transmit, blocking off possibly
                            smaller replies to other requests. Hence,{" "}
                            <Rs n="wtp_client" />{" "}
                            interested in large (slices of) <Rs n="Payload" />
                            {" "}
                            might want to issue multiple requests for smaller
                            subslices.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "slice_length",
                            "WtpRequestSpecificSliceLength",
                            "slice_length",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            If this is{" "}
                            <R n="wtp_request_specific_partial_verification_options_none" />,
                            then the <R n="WtpRequestSpecificSliceFrom" /> and
                            {" "}
                            <R n="WtpRequestSpecificSliceLength" />{" "}
                            fields are number of bytes, and the response simply
                            contains (a prefix of) the <R n="Payload" />{" "}
                            slice as raw bytes. If{" "}
                            <R n="WtpPartialVerification" /> is given, however,
                            {" "}
                            <R n="WtpRequestSpecificSliceFrom" /> and{" "}
                            <R n="WtpRequestSpecificSliceLength" />{" "}
                            are numbers of{" "}
                            <AE href="https://worm-blossom.github.io/bab/#chunk">
                              Bab chunks
                            </AE>. The response then contains not a raw subslice
                            of the{" "}
                            <R n="Payload" />, but part of a Bab verifiable
                            stream. The details are described on the{" "}
                            <R n="WtpPartialVerification" /> struct.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "partial_verification",
                            "WtpRequestSpecificPartialVerification",
                            "partial_verification",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpPartialVerification" />,
                              <DefVariant
                                n="wtp_request_specific_partial_verification_options_none"
                                r="none"
                              />,
                            ]}
                          />,
                        ],
                      },
                    },
                  ]}
                />
                <Loc />
                <StructDef
                  comment={
                    <>
                      Options for controlling the Bab-based, verifiable
                      transmission of the requested <R n="Payload" />{" "}
                      slice. A successful response to a{" "}
                      <R n="WtpRequestSpecific" /> with{" "}
                      <R n="WtpPartialVerification" /> uses Bab’s{" "}
                      <AE href="https://worm-blossom.github.io/bab/#kgrouped">
                        k-grouped light
                      </AE>{" "}
                      <AE href="https://worm-blossom.github.io/bab/#slice_streaming">
                        slice streaming
                      </AE>, with the value of <Code>k</Code>{" "}
                      specified in these options.
                    </>
                  }
                  id={[
                    "PartialVerification",
                    "WtpPartialVerification",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The{" "}
                            <AE href="https://worm-blossom.github.io/bab/#k">
                              <Code>k</Code>
                            </AE>{" "}
                            in{" "}
                            <AE href="https://worm-blossom.github.io/bab/#kgrouped">
                              k-grouped
                            </AE>{" "}
                            verifiable streaming.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "k",
                            "WtpPartialVerificationK",
                            "k",
                          ],
                          <R n="U8" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The{" "}
                            <AE href="https://worm-blossom.github.io/bab/#left_skip">
                              <Code>left_skip</Code>
                            </AE>{" "}
                            for the slice stream.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "left_skip",
                            "WtpPartialVerificationLeftSkip",
                            "left_skips",
                          ],
                          <R n="U8" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The{" "}
                            <AE href="https://worm-blossom.github.io/bab/#right_skip">
                              <Code>right_skip</Code>
                            </AE>{" "}
                            for the slice stream.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "right_skip",
                            "WtpPartialVerificationRightSkip",
                            "right_skips",
                          ],
                          <R n="U8" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>
            </Hsection>

            <Hsection
              n="wtp_response_specific"
              title={<Code>ResponseSpecific</Code>}
            >
              <P>
                The corresponding response starts with the{" "}
                <R n="wtp_request_id" /> of the <R n="WtpRequestSpecific" />
                {" "}
                message, followed by one of the following status codes:
              </P>

              <Pseudocode n="wtp_response_specific_status_code_def">
                <Enum
                  comment={
                    <>
                      The different status codes in a response to a{" "}
                      <R n="WtpRequestSpecific" />{" "}
                      message. If multiple codes would apply, the one listed
                      earliest takes precedence.
                    </>
                  }
                  id={[
                    "ResponseSpecificStatusCode",
                    "WtpResponseSpecificStatusCode",
                    "ResponseSpecificStatusCodes",
                  ]}
                  variants={[
                    {
                      tuple: true,
                      id: [
                        "nope",
                        "WtpResponseSpecificStatusCodeNope",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{" "}
                          chose to not meaningfully answer this request. It also
                          chose to not tell the <R n="wtp_client" /> why.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "yay",
                        "WtpResponseSpecificStatusCodeYay",
                      ],
                      comment: (
                        <>
                          The request could be processed, and the{" "}
                          <R n="wtp_server" /> stored an appropriate{" "}
                          <R n="AuthorisedEntry" />. The response contains it,
                          unless <R n="WtpRequestSpecificSkipEntry" /> was{" "}
                          <Code>true</Code>.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "not_processed",
                        "WtpResponseSpecificStatusCodeNotProcessed",
                      ],
                      comment: (
                        <>
                          The request was not processed. The{" "}
                          <R n="wtp_feature_req_specific" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "unauthorised",
                        "WtpResponseSpecificStatusCodeUnauthorised",
                      ],
                      comment: (
                        <>
                          <P>
                            The <R n="access_receiver" /> of the{" "}
                            <R n="WtpRequestSpecificReadCapability" />{" "}
                            was not the{" "}
                            <R n="WtpClientSetupMessageReadCapabilityReceiver" />
                            {" "}
                            in the <R n="wtp_client" />’s{" "}
                            <R n="WtpClientSetupMessage" />.
                          </P>
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "not_found",
                        "WtpResponseSpecificStatusCodeNotFound",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{"  "}
                          processed the reqest, but did not have an{" "}
                          <R n="AuthorisedEntry" /> of matching{" "}
                          <R n="entry_namespace_id" />,{" "}
                          <R n="entry_subspace_id" /> and <R n="entry_path" />.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "too_old",
                        "WtpResponseSpecificStatusCodeTooOld",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{"  "}
                          processed the reqest, did have an{" "}
                          <R n="AuthorisedEntry" /> of matching{" "}
                          <R n="entry_namespace_id" />,{" "}
                          <R n="entry_subspace_id" /> and{" "}
                          <R n="entry_path" />, but the request had a
                          non-<R n="wtp_request_specific_minimum_timestamp_none" />
                          {" "}
                          <R n="WtpRequestSpecificMinimumTimestamp" />, and the
                          {" "}
                          <R n="entry_timestamp" /> of the matching{" "}
                          <R n="AuthorisedEntry" /> was strictly less than the
                          {" "}
                          <R n="WtpRequestSpecificMinimumTimestamp" />{" "}
                          (or, if the request’s{" "}
                          <R n="WtpRequestSpecificPayloadDigest" /> is not{" "}
                          <R n="wtp_request_specific_payload_digest_none" />,
                          this status code is also sent if the{" "}
                          <R n="entry_timestamp" /> of the matching{" "}
                          <R n="AuthorisedEntry" /> is equal to the{" "}
                          <R n="WtpRequestSpecificMinimumTimestamp" /> but its
                          {" "}
                          <R n="entry_payload_digest" />{" "}
                          is strictly less than the request’s{" "}
                          <R n="WtpRequestSpecificPayloadDigest" />).
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "unexpected_payload_digest",
                        "WtpResponseSpecificStatusCodeUnexpectedPayloadDigest",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{"  "}
                          processed the reqest, did have an{" "}
                          <R n="AuthorisedEntry" /> of matching{" "}
                          <R n="entry_namespace_id" />,{" "}
                          <R n="entry_subspace_id" /> and{" "}
                          <R n="entry_path" />, but its{" "}
                          <R n="entry_payload_digest" />{" "}
                          did not match the expected{" "}
                          <R n="WtpRequestSpecificPayloadDigest" />{" "}
                          specified in the request.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "unexpected_timestamp",
                        "WtpResponseSpecificStatusCodeUnexpectedTimestamp",
                      ],
                      comment: (
                        <>
                          <P>
                            The <R n="wtp_server" />{"  "}
                            processed the reqest, did have an{" "}
                            <R n="AuthorisedEntry" /> of matching{" "}
                            <R n="entry_namespace_id" />,{" "}
                            <R n="entry_subspace_id" /> and{" "}
                            <R n="entry_path" />, but its{" "}
                            <R n="entry_timestamp" /> did not fall into the{" "}
                            <R n="TimeRange" /> of the <R n="granted_area" />
                            {" "}
                            of the <R n="WtpRequestSpecificReadCapability" />.
                          </P>
                        </>
                      ),
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                Every <R n="WtpResponseSpecificStatusCode" /> but{" "}
                <R n="WtpResponseSpecificStatusCodeYay" />{" "}
                marks the end of the response. If the{" "}
                <R n="WtpResponseSpecificStatusCode" /> <Em>is</Em>{" "}
                <R n="WtpResponseSpecificStatusCodeYay" />, the response
                continues with the requested <R n="AuthorisedEntry" />{" "}
                (skipped if the request had set{" "}
                <R n="WtpRequestSpecificSkipEntry" /> to{" "}
                <Code>true</Code>), followed by a new status code to indicate
                whether the requested <R n="Payload" /> slice can be served:
              </P>

              <Pseudocode n="wtp_response_specific_status_code_payload_def">
                <Enum
                  comment={
                    <>
                      The different status codes indicating whether a{" "}
                      <R n="Payload" /> slice could be served in response to a
                      {" "}
                      <R n="WtpRequestSpecific" />{" "}
                      message. If multiple codes would apply, the one listed
                      earliest takes precedence.
                    </>
                  }
                  id={[
                    "ResponseSpecificPayloadStatusCode",
                    "WtpResponseSpecificPayloadStatusCode",
                    "ResponseSpecificSPayloadtatusCodes",
                  ]}
                  variants={[
                    {
                      tuple: true,
                      id: [
                        "nope",
                        "WtpResponseSpecificPayloadStatusCodeNope",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" /> chose to not anwer with a
                          {" "}
                          <R n="Payload" /> slice. It also chose to not tell the
                          {" "}
                          <R n="wtp_client" /> why.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "yay",
                        "WtpResponseSpecificPayloadStatusCodeYay",
                      ],
                      comment: (
                        <>
                          The request could be processed, and a prefix of the
                          requested <R n="Payload" />{" "}
                          slice is part of this response.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "not_processed",
                        "WtpResponseSpecificPayloadStatusCodeNotProcessed",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed. The{" "}
                          <R n="wtp_feature_req_specific_payload" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "no_raw_slices",
                        "WtpResponseSpecificPayloadStatusCodeNoRawSlices",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed, because the{" "}
                          <R n="WtpRequestSpecificPartialVerification" /> was
                          {" "}
                          <R n="wtp_request_specific_partial_verification_options_none" />.
                          The <R n="wtp_feature_req_specific_raw_slices" />{" "}
                          of the <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "no_authenticated_slices",
                        "WtpResponseSpecificPayloadStatusCodeNoAuthenticatedSlices",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed, because the{" "}
                          <R n="WtpRequestSpecificPartialVerification" /> was
                          {" "}
                          not{" "}
                          <R n="wtp_request_specific_partial_verification_options_none" />.
                          The{" "}
                          <R n="wtp_feature_req_specific_authenticated_slices" />
                          {" "}
                          of the <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "no_fancy_k",
                        "WtpResponseSpecificPayloadStatusCodeNoFancyK",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed, because the{" "}
                          <R n="WtpRequestSpecificPartialVerification" /> set
                          {" "}
                          <R n="WtpPartialVerificationK" />{" "}
                          to a value other than <Code>1</Code>. The{" "}
                          <R n="wtp_feature_req_specific_fancy_k" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                Every <R n="WtpResponseSpecificPayloadStatusCode" /> but{" "}
                <R n="WtpResponseSpecificPayloadStatusCodeYay" />{" "}
                marks the end of the response. If the{" "}
                <R n="WtpResponseSpecificPayloadStatusCode" /> <Em>is</Em>{" "}
                <R n="WtpResponseSpecificPayloadStatusCodeYay" />, the response
                continues with the requested <R n="Payload" />{" "}
                slice, and some accompanying metadata.
              </P>

              <P>
                More specifically, the response does not have to contain the
                complete requested slice, but merely a prefix of it. The
                response first indicates how much of the requested slice is
                actually part of the response. If the{" "}
                <R n="WtpRequestSpecificPartialVerification" />{" "}
                of the request was{" "}
                <R n="wtp_request_specific_partial_verification_options_none" />,
                the response simply states the number of <R n="Payload" />{" "}
                bytes it contains, starting at the requested{" "}
                <R n="WtpRequestSpecificSliceFrom" />. If the{" "}
                <R n="WtpRequestSpecificPartialVerification" />{" "}
                of the request was <Em>not</Em>{" "}
                <R n="wtp_request_specific_partial_verification_options_none" />,
                then the response indicates the length of the response slice,
                measured in{" "}
                <AE href="https://worm-blossom.github.io/bab/#chunk">
                  Bab chunks
                </AE>. In both cases, the indicated slice length must not exceed
                the originally requested{" "}
                <R n="WtpRequestSpecificSliceLength" />.
              </P>

              <P>
                The slice data itself consists of raw <R n="Payload" />{" "}
                bytes if the <R n="WtpRequestSpecificPartialVerification" />
                {" "}
                of the request was{" "}
                <R n="wtp_request_specific_partial_verification_options_none" />,
                and of the{" "}
                <AE href="https://worm-blossom.github.io/bab/#slice_streaming">
                  k-grouped light verifiable slice stream
                </AE>{" "}
                over the indicated number of chunks otherwise, omitting the
                verification metadata indicated by the{" "}
                <R n="WtpPartialVerificationLeftSkip" /> and{" "}
                <R n="WtpPartialVerificationRightSkip" />{" "}
                of the request. Note that the{" "}
                <R n="WtpPartialVerificationRightSkip" />{" "}
                indicates which metadata to skip based on the originally
                requested slice, not based on the prefix with which the{" "}
                <R n="wtp_server" /> responds.
              </P>

              <P>
                If the <R n="WtpRequestSpecificSliceFrom" /> exceeds{" "}
                <R n="entry_payload_length" /> of the addressed{" "}
                <R n="AuthorisedEntry" />, the message must be treated as if
                {" "}
                <R n="WtpRequestSpecificSliceLength" /> was zero.
              </P>

              <P>
                Finally, if the response sends a strict prefix of the requested
                slice instead of the full slice, it contains a boolean to
                indicate whether the <R n="wtp_client" />{" "}
                should issue a new request for the remaining part (for example,
                if the <R n="wtp_server" />{" "}
                simply did not want to send a single, comically large response),
                or not (for example, if the <R n="wtp_server" /> has no{" "}
                <R n="Payload" /> bytes beyond the cutoff point).
              </P>

              <P>
                Bringing it all together:
              </P>

              <Pseudocode n="wtp_defs_ResponseSpecific">
                <StructDef
                  comment={
                    <>
                      Responds to a <R n="WtpRequestSpecific" /> message.
                    </>
                  }
                  id={[
                    "ResponseSpecific",
                    "WtpResponseSpecific",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="wtp_request_id" />{" "}
                            of the request to which this responds.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "request_id",
                            "WtpResponseSpecificRequestId",
                            "request_ids",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The status code for this response.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "status_code",
                            "WtpResponseSpecificStatusCodeField",
                            "status_codes",
                          ],
                          <R n="WtpResponseSpecificStatusCode" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="AuthorisedEntry" />{" "}
                            the the request requested. If the{" "}
                            <R n="WtpResponseSpecificStatusCodeField" /> is not
                            {" "}
                            <R n="WtpResponseSpecificStatusCodeYay" />, or if
                            the request set{" "}
                            <R n="WtpRequestSpecificSkipEntry" /> to{" "}
                            <Code>true</Code>, then and only then must this be
                            {" "}
                            <R n="wtp_request_specific_requested_entry_none" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "requested_entry",
                            "WtpResponseSpecificRequestedEntry",
                            "requested_entries",
                          ],
                          <ChoiceType
                            types={[
                              <R n="AuthorisedEntry" />,
                              <DefVariant
                                n="wtp_request_specific_requested_entry_none"
                                r="none"
                              />,
                            ]}
                          />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The status code for the <R n="Payload" />{" "}
                            part of this response. Must be{" "}
                            <R n="wtp_request_specific_payload_status_code_none" />
                            {" "}
                            if and only if the{" "}
                            <R n="WtpResponseSpecificStatusCodeField" />{" "}
                            field is not{" "}
                            <R n="WtpResponseSpecificStatusCodeYay" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_status_code",
                            "WtpResponseSpecificPayloadStatusCodeField",
                            "payload_status_codes",
                          ],
                          <ChoiceType
                            multiline
                            types={[
                              <R n="WtpResponseSpecificPayloadStatusCode" />,
                              <DefVariant
                                n="wtp_request_specific_payload_status_code_none"
                                r="none"
                              />,
                            ]}
                          />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The information concerning the requested{" "}
                            <R n="Payload" />. Must be{" "}
                            <R n="wtp_request_specific_payload_response_none" />
                            {" "}
                            if and only if{"  "}
                            <R n="WtpResponseSpecificStatusCodeField" />{" "}
                            field is not{" "}
                            <R n="WtpResponseSpecificStatusCodeYay" /> or{" "}
                            <R n="WtpResponseSpecificPayloadStatusCodeField" />
                            {" "}
                            field is not{" "}
                            <R n="WtpResponseSpecificPayloadStatusCodeYay" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_response",
                            "WtpResponseSpecificPayloadResponse",
                            "payload_response",
                          ],
                          <ChoiceType
                            multiline
                            types={[
                              <R n="WtpPayloadResponse" />,
                              <DefVariant
                                n="wtp_request_specific_payload_response_none"
                                r="none"
                              />,
                            ]}
                          />,
                        ],
                      },
                    },
                  ]}
                />
                <Loc />
                <StructDef
                  comment={
                    <>
                      Information concerning the requested <R n="Payload" />.
                    </>
                  }
                  id={[
                    "PayloadResponse",
                    "WtpPayloadResponse",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            <P>
                              The length of the prefix of the requested slice
                              contained in this response.
                            </P>

                            <P>
                              If the{" "}
                              <R n="WtpRequestSpecificPartialVerification" />
                              {" "}
                              of the request was{" "}
                              <R n="wtp_request_specific_partial_verification_options_none" />,
                              this is simply the number of bytes in the response
                              slice.
                            </P>

                            <P>
                              Otherwise, this is the number of{" "}
                              <AE href="https://worm-blossom.github.io/bab/#chunk">
                                Bab chunks
                              </AE>{" "}
                              this response provides. Note that the actual data
                              it transmits consists of more than just those
                              chunks; it also includes the verification data of
                              the requested{" "}
                              <AE href="https://worm-blossom.github.io/bab/#kgrouped">
                                k-grouped light
                              </AE>{" "}
                              <AE href="https://worm-blossom.github.io/bab/#slice_streaming">
                                slice stream
                              </AE>. The length of the actually transmitted{" "}
                              <R n="WtpPayloadResponseSliceData" />{" "}
                              in bytes can (and must) be deterministically
                              computed from the number of chunks and the index
                              of the first included chunk.
                            </P>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "slice_length",
                            "WtpPayloadResponseSliceLength",
                            "slice_lengths",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Whether the <R n="wtp_client" />{" "}
                            should issue more requests for this{" "}
                            <R n="Payload" />{" "}
                            in order to obtain the data missing from this
                            response. This must be false if the response{" "}
                            <R n="WtpPayloadResponseSliceLength" />{" "}
                            is equal to the requested{" "}
                            <R n="WtpRequestSpecificSliceLength" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "should_try_again",
                            "WtpPayloadResponseShouldTryAgain",
                            "should_try_again",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The slice data, either as raw bytes or as a Bab
                            stream. The length of this is given by (or can be
                            derived from){" "}
                            <R n="WtpPayloadResponseSliceLength" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "slice_data",
                            "WtpPayloadResponseSliceData",
                            "slice_data",
                          ],
                          <SliceType>
                            <R n="U8" />
                          </SliceType>,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>
            </Hsection>
          </Hsection>

          <Hsection n="wtp_encodings" title="Encodings">
            <P>
              <Alj inline>TODO</Alj>
            </P>

            <P>
              <Alj inline>
                TODO: allow for a well-known default read capability, intended
                for public data, and allow omitting the read capability from the
                encodings to indicate the default one.
              </Alj>
            </P>
          </Hsection>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
