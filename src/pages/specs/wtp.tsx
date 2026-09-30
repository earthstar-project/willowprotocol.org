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
        status="sketch"
        statusDate="29.01.2026"
        parentId="specifications"
      >
        <PreviewScope>
          <P>
            The <R n="data_model">Willow data model</R>{" "}
            specifies how to arrange data, but it does not prescribe how peers
            can exchange <Rs n="Entry" /> and their <Rs n="Payload" />. The{" "}
            <Def n="wtp" r="WTP">
              Willow Transfer Protocol
            </Def>{" "}
            fills that gap.
          </P>

          <P>
            This document assumes familiarity with the{" "}
            <R n="data_model">Willow data model</R>.
          </P>
        </PreviewScope>

        <Hsection n="wtp_intro" title="Introduction">
          <P>
            The <R n="wtp" />{" "}
            is a message-based protocol where two peer can send and request{" "}
            <Rs n="Entry" /> and <Rs n="Payload" />{" "}
            to and from each other. Requests can be both one-shot or stay open,
            allowing for eager streaming of changes if desired.
          </P>

          <P>
            In addition to requesting individual{" "}
            <Rs n="Entry" />, peers can also query for whole <Rs n="Area" /> or
            {" "}
            <Rs n="D3Range" />. Peers can further request that requests for
            groupings containing many <Rs n="Entry" />{" "}
            are answered not with those <Rs n="Entry" />{" "}
            but merely with a hash of those <Rs n="Entry" />{" "}
            — a mechanism that enables{" "}
            <R n="d3_range_based_set_reconciliation">
              3d range-based set reconciliation
            </R>.
          </P>

          <P>
            Requests for <Rs n="Entry" />{" "}
            must be accompanied by read capabilities, peers should never send
            data to peers who are not authorised to access that data. Metadata,
            such as capabilities themselves, or requests for specific groupings
            of <Rs n="Entry" />{" "}
            are transmitted naively, however; peers must be mindful of possibly
            leaking information this way.
          </P>

          <P>
            The WTP is flexible in how much state peers need to maintain. For
            every message that acts as a response which refers back to the state
            set up by some request, there is also an alternate encoding in which
            the response is fully self-contained. Peers can choose for
            themselves whether to operate in a bandwidth-efficient stateful way
            or in a more bandwidth-costly but stateless way.
          </P>

          <P>
            The <R n="wtp" />{" "}
            runs over any reliable, ordered, bidirectional, byte-oriented
            communication channel. We highly recommend encrypting the
            communication, and provide a recommended scheme for doing so.
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
            <AE href="https://bab-hash.org/">
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
            The <R n="wtp" /> starts with the{" "}
            <R n="handshake_and_encryption">handshake specified here</R>, whose
            parameter instantiation must use <R n="wtp_receiver" /> as the type
            {" "}
            <R n="hs_pk" />. After the handshake, further communication may or
            may not be{" "}
            <R n="transport_encryption">encrypted as specified</R>; peers should
            encrypt if and only if the underlying communication channel is
            unencrypted. All communication after the handshake is message-based.
          </P>

          <P>
            Peers might receive invalid messages, both syntactically (i.e.,
            invalid encodings) and semantically (i.e., logically inconsistent
            messages). In both cases, the peer to detect this behaviour must
            abort the communication session. We indicate such situations by
            writing that something{" "}
            <Quotes>is an error</Quotes>. Whenever we state that a message must
            fulfil some criteria, but a peer receives a message that does not
            fulfil these criteria, that is an error.
          </P>

          <Hsection n="wtp_messages" title="Messages">
            <P>
              We define all messages as purely logical data types first, with
              the actual wire encoding defined <R n="wtp_encodings">last</R>.
            </P>

            <PreviewScope>
              <P>
                The WTP uses unsigned 64-bit{" "}
                <DefType
                  n="WtpMessageId"
                  r="WtpMessageId"
                  rs="WtpMessageIds"
                >
                  WtpMessageIds
                </DefType>{" "}
                to identify messages. They are, however, optional on a
                per-message basis. Each message indicates whether it has a{" "}
                <R n="WtpMessageId" /> or not. A message without a{" "}
                <R n="WtpMessageId" />{" "}
                cannot be referenced by any other messages. This means that the
                peers need not maintain any state for such a message.
              </P>

              <P>
                For messages that do have a <R n="WtpMessageId" />, these{" "}
                <Rs n="WtpMessageId" />{" "}
                are assigned implicitly: each peer maintains an unsigned 64-bit
                counter, initialised to zero. When sending a message that
                indicates that it has a{" "}
                <R n="WtpMessageId" />, the current value of the counter becomes
                its{" "}
                <R n="WtpMessageId" />, and then the counter is increased by
                one. If the counter would{" "}
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
                  overflow
                </Sidenote>, it is set to zero again.
              </P>

              <P>
                Some message types <Em>never</Em> have a{" "}
                <R n="WtpMessageId" />; these are exactly the message types that
                do not have a boolean flag whether the message should be
                assigned a <R n="WtpMessageId" /> or not.
              </P>
            </PreviewScope>

            <P>
              The different message kinds are the following:
            </P>

            <Ul>
              <Li>
                <R n="WtpSendEntry" />: for sending <Rs n="AuthorisedEntry" />.
              </Li>
              <Li>
                <R n="WtpSendPayloadSlice" />: for sending (parts of){" "}
                <Rs n="Payload" />.
              </Li>
              <Li>
                <R n="WtpRequestEntries" />: for requesting one or more{" "}
                <Rs n="AuthorisedEntry" />{" "}
                from the peer, together with some metadata that allows for{" "}
                <R n="d3_range_based_set_reconciliation">
                  3d range-based set reconciliation
                </R>.
              </Li>
              <Li>
                <R n="WtpRespondToRequestEntries" />: for indicating how an
                incoming <R n="WtpRequestEntries" /> message is processed.
              </Li>
              <Li>
                <R n="WtpRequestPayloadSlice" />: for requesting (part of) the
                {" "}
                <R n="Payload" /> of a specific <R n="Entry" />.
              </Li>
              <Li>
                <R n="WtpRespondToRequestPayloadSlice" />: for indicating how an
                incoming <R n="WtpRequestPayloadSlice" /> message is processed.
              </Li>
              <Li>
                <R n="WtpCancelOwnRequest" />: for indicating that a peer is not
                interested anymore in the response(s) to a{" "}
                <R n="WtpRequestEntries" /> or <R n="WtpRequestPayloadSlice" />
                {" "}
                message it had sent earlier.
              </Li>
            </Ul>

            <Hsection n="wtp_send_entry" title={<Code>SendEntry</Code>}>
              <P>
                The <R n="WtpSendEntry" /> messages let peers transmit{" "}
                <Rs n="LengthyAuthorisedEntry" />. They may specifically
                indicate a <R n="WtpRequestEntries" />{" "}
                message they are responding to, or they can be sent as
                standalone messages.
              </P>

              <P>
                Note that the <R n="lengthy_entry_available" />{" "}
                field of the transmitted <R n="LengthyAuthorisedEntry" />{" "}
                gives the length of the available prefix in Bab chunks, not in
                bytes.
              </P>

              <Pseudocode n="wtp_defs_SendEntry">
                <StructDef
                  comment={
                    <>
                      Transmit a{" "}
                      <R n="LengthyAuthorisedEntry" />, optionally in response
                      to a specific <R n="WtpRequestEntries" /> message.
                    </>
                  }
                  id={[
                    "SendEntry",
                    "WtpSendEntry",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="WtpMessageId" /> of the{" "}
                            <R n="WtpRequestEntries" />{" "}
                            this is in response to, or{" "}
                            <R n="wtp_send_entry_none" />{" "}
                            if this message is standalone. It is an error if
                            this is a <R n="WtpMessageId" />{" "}
                            but the corresponding message is not a{" "}
                            <R n="WtpRequestEntries" /> message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "responds_to",
                            "WtpSendEntryRespondsTo",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpMessageId" />,
                              <DefVariant
                                n="wtp_send_entry_none"
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
                            The <R n="LengthyAuthorisedEntry" />{" "}
                            to transmit, with the{" "}
                            <R n="lengthy_entry_available" />{" "}
                            field giving the length of the available prefix in
                            Bab chunks, not in bytes.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "entry",
                            "WtpSendEntryEntry",
                            "entries",
                          ],
                          <R n="LengthyAuthorisedEntry" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>
            </Hsection>

            <Hsection
              n="wtp_send_payload_slice"
              title={<Code>SendPayloadSlice</Code>}
            >
              <P>
                The <R n="WtpSendPayloadSlice" />{" "}
                messages let peers transmit (parts of){" "}
                <Rs n="Payload" />. They may specifically indicate a{" "}
                <R n="WtpRequestPayloadSlice" /> or <R n="WtpRequestEntries" />
                {" "}
                message they are responding to, or they can be sent as
                standalone messages.
              </P>

              <Pseudocode n="wtp_defs_SendPayloadSlice">
                <StructDef
                  comment={
                    <>
                      Transmit a (subslice of a){"  "}
                      <R n="Payload" />, optionally in response to a specific
                      {" "}
                      <R n="WtpRequestPayloadSlice" /> or{" "}
                      <R n="WtpRequestEntries" /> message.
                    </>
                  }
                  id={[
                    "SendPayloadSlice",
                    "WtpSendPayloadSlice",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="WtpMessageId" /> of the{" "}
                            <R n="WtpRequestPayloadSlice" /> or{" "}
                            <R n="WtpRequestEntries" />{" "}
                            this is in response to, or{" "}
                            <R n="wtp_send_entry_none" />{" "}
                            if this message is standalone. It is an error if
                            this is a <R n="WtpMessageId" />{" "}
                            but the corresponding message is not a{" "}
                            <R n="WtpRequestPayloadSlice" /> or{" "}
                            <R n="WtpRequestEntries" /> message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "responds_to",
                            "WtpSendPayloadSliceRespondsTo",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpMessageId" />,
                              <DefVariant
                                n="wtp_send_payload_slice_none"
                                r="none"
                              />,
                            ]}
                          />,
                        ],
                      },
                    },
                    // {
                    //   commented: {
                    //     comment: (
                    //       <>
                    //         The <R n="LengthyAuthorisedEntry" />{" "}
                    //         to transmit, with the{" "}
                    //         <R n="lengthy_entry_available" />{" "}
                    //         field giving the length of the available prefix in
                    //         Bab chunks, not in bytes.
                    //       </>
                    //     ),
                    //     dedicatedLine: true,
                    //     segment: [
                    //       [
                    //         "entry",
                    //         "WtpSendEntryEntry",
                    //         "entries",
                    //       ],
                    //       <R n="LengthyAuthorisedEntry" />,
                    //     ],
                    //   },
                    // },
                  ]}
                />
              </Pseudocode>

              <P>
                When sent as a response, many of the fields can be derived from
                context and are thus omitted from the actual message encoding.
                TODO
              </P>
            </Hsection>
          </Hsection>

          <Hsection
            n="wtp_requests_and_responses"
            title="Requests and Responses"
          >
            <Hsection
              n="wtp_request_get"
              title={<Code>RequestGet</Code>}
            >
              <P>
                The first kind of request allows to request a specific
                contiguous slice of the <R n="Payload" /> of a specific{" "}
                <R n="AuthorisedEntry" />. The requested slice might be empty,
                which amounts to requesting only the <R n="AuthorisedEntry" />
                {" "}
                itself.
              </P>

              {
                /* <Pseudocode n="wtp_defs_RequestGet">
                <StructDef
                  comment={
                    <>
                      Request a contiguous, possibly empty subslice of the{" "}
                      <R n="Payload" /> of a specific <R n="AuthorisedEntry" />.
                    </>
                  }
                  id={[
                    "RequestGet",
                    "WtpRequestGet",
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
                            "WtpRequestGetNamespaceId",
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
                            "WtpRequestGetSubspaceId",
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
                            "WtpRequestGetPath",
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
                            <R n="access_receiver" /> must be the{" "}
                            <R n="WtpClientSetupMessageReadCapabilityReceiver" />
                            {" "}
                            of the <R n="WtpClientSetupMessage" />, whose{" "}
                            <R n="granted_namespace" /> must be the requested
                            {" "}
                            <R n="WtpRequestGetNamespaceId" />, and whose{" "}
                            <R n="granted_area" /> must be able to{" "}
                            <R n="area_include" /> <Rs n="Entry" />{" "}
                            of the requested <R n="WtpRequestGetSubspaceId" />
                            {" "}
                            and <R n="WtpRequestGetPath" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "read_capability",
                            "WtpRequestGetReadCapability",
                            "read_capabilities",
                          ],
                          <R n="WtpReadCapability" />,
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
                            <R n="wtp_request_get_payload_digest_none" />{" "}
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
                            "WtpRequestGetPayloadDigest",
                            "payload_digests",
                          ],
                          <ChoiceType
                            types={[
                              <R n="PayloadDigest" />,
                              <DefVariant
                                n="wtp_request_get_payload_digest_none"
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
                            <R n="WtpRequestGetPayloadDigest" />, to ensure that
                            the <R n="wtp_client" />{" "}
                            does not accidentally receive a <R n="Payload" />
                            {" "}
                            slice from an unexpected <R n="Entry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "skip_entry",
                            "WtpRequestGetSkipEntry",
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
                              <R n="wtp_request_get_minimum_timestamp_none" />
                              {" "}
                              and the <R n="wtp_server" /> stores a matching
                              {" "}
                              <R n="AuthorisedEntry" />, but its{" "}
                              <R n="entry_timestamp" /> is less than this{" "}
                              <R n="WtpRequestGetMinimumTimestamp" />, the{" "}
                              <R n="wtp_server" /> responds with the{" "}
                              <R n="WtpResponseGetStatusCodeTooOld" />{" "}
                              status code instead of supplying the{" "}
                              <R n="AuthorisedEntry" /> (and/or a part of its
                              {" "}
                              <R n="Payload" />).
                            </P>

                            <P>
                              If this is not{" "}
                              <R n="wtp_request_get_minimum_timestamp_none" />,
                              and the <R n="WtpRequestGetPayloadDigest" />{" "}
                              is also not{" "}
                              <R n="wtp_request_get_payload_digest_none" />, the
                              semantics of the{" "}
                              <R n="WtpRequestGetPayloadDigest" />{" "}
                              change: it does not need to match exactly any
                              more, instead it factors into the{" "}
                              <R n="entry_newer" />-than relation: if the{" "}
                              <R n="wtp_server" /> has an appropriate{" "}
                              <R n="AuthorisedEntry" /> of{" "}
                              <R n="entry_timestamp" /> exactly{" "}
                              <R n="WtpRequestGetMinimumTimestamp" />, it
                              responds with the{" "}
                              <R n="WtpResponseGetStatusCodeTooOld" />{" "}
                              status code only if the{" "}
                              <R n="entry_payload_digest" /> of the candidate
                              {" "}
                              <R n="AuthorisedEntry" />{" "}
                              is strictly less than the{" "}
                              <R n="WtpRequestGetPayloadDigest" />.
                            </P>

                            <P>
                              Finally, this field must be{" "}
                              <R n="wtp_request_get_minimum_timestamp_none" />
                              {" "}
                              if <R n="WtpRequestGetSkipEntry" /> is{" "}
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
                            "WtpRequestGetMinimumTimestamp",
                            "minimum_timestamp",
                          ],
                          <ChoiceType
                            types={[
                              <R n="Timestamp" />,
                              <DefVariant
                                n="wtp_request_get_minimum_timestamp_none"
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
                            "WtpRequestGetSliceFrom",
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
                            "WtpRequestGetSliceLength",
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
                            <R n="wtp_request_get_partial_verification_options_none" />,
                            then the <R n="WtpRequestGetSliceFrom" /> and{" "}
                            <R n="WtpRequestGetSliceLength" />{" "}
                            fields are number of bytes, and the response simply
                            contains (a prefix of) the <R n="Payload" />{" "}
                            slice as raw bytes. If{" "}
                            <R n="WtpPartialVerification" /> is given, however,
                            {" "}
                            <R n="WtpRequestGetSliceFrom" /> and{" "}
                            <R n="WtpRequestGetSliceLength" /> are numbers of
                            {" "}
                            <AE href="https://bab-hash.org/spec#chunk">
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
                            "WtpRequestGetPartialVerification",
                            "partial_verification",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpPartialVerification" />,
                              <DefVariant
                                n="wtp_request_get_partial_verification_options_none"
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
                      transmission of a <R n="Payload" /> slice. Bab-based{" "}
                      <R n="Payload" /> slice transmission uses Bab’s{" "}
                      <AE href="https://bab-hash.org/spec#kgrouped">
                        k-grouped light
                      </AE>{" "}
                      <AE href="https://bab-hash.org/spec#slice_streaming">
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
                            <AE href="https://bab-hash.org/spec#k">
                              <Code>k</Code>
                            </AE>{" "}
                            in{" "}
                            <AE href="https://bab-hash.org/spec#kgrouped">
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
                            <AE href="https://bab-hash.org/spec#left_skip">
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
                            <AE href="https://bab-hash.org/spec#right_skip">
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
              </Pseudocode> */
              }
            </Hsection>

            <Hsection
              n="wtp_response_get"
              title={<Code>ResponseGet</Code>}
            >
              <P>
                The response to a <R n="WtpRequestGet" />{" "}
                message starts with the <R n="wtp_request_id" /> of the{" "}
                <R n="WtpRequestGet" />{" "}
                message, followed by one of the following status codes:
              </P>

              <Pseudocode n="wtp_response_get_status_code_def">
                <Enum
                  comment={
                    <>
                      The different status codes in a response to a{" "}
                      <R n="WtpRequestGet" />{" "}
                      message. If multiple codes would apply, the one listed
                      earliest takes precedence.
                    </>
                  }
                  id={[
                    "ResponseGetStatusCode",
                    "WtpResponseGetStatusCode",
                    "ResponseGetStatusCodes",
                  ]}
                  variants={[
                    {
                      tuple: true,
                      id: [
                        "nope",
                        "WtpResponseGetStatusCodeNope",
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
                        "too_annoying",
                        "WtpResponseGetStatusCodeTooAnnoying",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{" "}
                          chose to not meaningfully answer this request, because
                          it does not want to spend its resources on this{" "}
                          <R n="wtp_client" />{" "}
                          right now. Intended for rate-limiting.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "yay",
                        "WtpResponseGetStatusCodeYay",
                      ],
                      comment: (
                        <>
                          The request could be processed, and the{" "}
                          <R n="wtp_server" /> stored an appropriate{" "}
                          <R n="AuthorisedEntry" />. The response contains it,
                          unless <R n="WtpRequestGetSkipEntry" /> was{" "}
                          <Code>true</Code>.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "not_processed",
                        "WtpResponseGetStatusCodeNotProcessed",
                      ],
                      comment: (
                        <>
                          The request was not processed. The{" "}
                          <R n="wtp_feature_get" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "unauthorised",
                        "WtpResponseGetStatusCodeUnauthorised",
                      ],
                      comment: (
                        <>
                          <P>
                            The <R n="access_receiver" /> of the{" "}
                            <R n="WtpRequestGetReadCapability" /> was not the
                            {" "}
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
                        "WtpResponseGetStatusCodeNotFound",
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
                        "WtpResponseGetStatusCodeTooOld",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{"  "}
                          processed the reqest, did have an{" "}
                          <R n="AuthorisedEntry" /> of matching{" "}
                          <R n="entry_namespace_id" />,{" "}
                          <R n="entry_subspace_id" /> and{" "}
                          <R n="entry_path" />, but the request had a
                          non-<R n="wtp_request_get_minimum_timestamp_none" />
                          {" "}
                          <R n="WtpRequestGetMinimumTimestamp" />, and the{" "}
                          <R n="entry_timestamp" /> of the matching{" "}
                          <R n="AuthorisedEntry" /> was strictly less than the
                          {" "}
                          <R n="WtpRequestGetMinimumTimestamp" />{" "}
                          (or, if the request’s{" "}
                          <R n="WtpRequestGetPayloadDigest" /> is not{" "}
                          <R n="wtp_request_get_payload_digest_none" />, this
                          status code is also sent if the{" "}
                          <R n="entry_timestamp" /> of the matching{" "}
                          <R n="AuthorisedEntry" /> is equal to the{" "}
                          <R n="WtpRequestGetMinimumTimestamp" /> but its{" "}
                          <R n="entry_payload_digest" />{" "}
                          is strictly less than the request’s{" "}
                          <R n="WtpRequestGetPayloadDigest" />).
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "too_old_please_help",
                        "WtpResponseGetStatusCodeTooOldPleaseHelp",
                      ],
                      comment: (
                        <>
                          Exactly the same as{" "}
                          <R n="WtpResponseGetStatusCodeTooOld" />, but the{" "}
                          <R n="wtp_server" /> is also kindly asking the{" "}
                          <R n="wtp_client" /> to bring it up to speed with some
                          {" "}
                          <R n="WtpRequestPut" /> messages.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "unexpected_payload_digest",
                        "WtpResponseGetStatusCodeUnexpectedPayloadDigest",
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
                          <R n="WtpRequestGetPayloadDigest" />{" "}
                          specified in the request.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "unexpected_timestamp",
                        "WtpResponseGetStatusCodeUnexpectedTimestamp",
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
                            of the <R n="WtpRequestGetReadCapability" />.
                          </P>
                        </>
                      ),
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                Every <R n="WtpResponseGetStatusCode" /> but{" "}
                <R n="WtpResponseGetStatusCodeYay" />{" "}
                marks the end of the response. If the{" "}
                <R n="WtpResponseGetStatusCode" /> <Em>is</Em>{" "}
                <R n="WtpResponseGetStatusCodeYay" />, the response continues
                with the requested <R n="AuthorisedEntry" />{" "}
                (skipped if the request had set <R n="WtpRequestGetSkipEntry" />
                {" "}
                to{" "}
                <Code>true</Code>), followed by a secondary status code to
                indicate whether the requested <R n="Payload" />{" "}
                slice can be served:
              </P>

              <Pseudocode n="wtp_response_get_status_code_payload_def">
                <Enum
                  comment={
                    <>
                      The different status codes indicating whether a{" "}
                      <R n="Payload" /> slice could be served in response to a
                      {" "}
                      <R n="WtpRequestGet" />{" "}
                      message. If multiple codes would apply, the one listed
                      earliest takes precedence.
                    </>
                  }
                  id={[
                    "ResponseGetPayloadStatusCode",
                    "WtpResponseGetPayloadStatusCode",
                    "ResponseGetSPayloadtatusCodes",
                  ]}
                  variants={[
                    {
                      tuple: true,
                      id: [
                        "nope",
                        "WtpResponseGetPayloadStatusCodeNope",
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
                        "WtpResponseGetPayloadStatusCodeYay",
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
                        "WtpResponseGetPayloadStatusCodeNotProcessed",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed. The{" "}
                          <R n="wtp_feature_get_payload" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "no_raw_slices",
                        "WtpResponseGetPayloadStatusCodeNoRawSlices",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed, because the{" "}
                          <R n="WtpRequestGetPartialVerification" /> was{" "}
                          <R n="wtp_request_get_partial_verification_options_none" />.
                          The <R n="wtp_feature_get_raw_slices" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "no_authenticated_slices",
                        "WtpResponseGetPayloadStatusCodeNoAuthenticatedSlices",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed, because the{" "}
                          <R n="WtpRequestGetPartialVerification" /> was not
                          {" "}
                          <R n="wtp_request_get_partial_verification_options_none" />.
                          The <R n="wtp_feature_get_authenticated_slices" />
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
                        "WtpResponseGetPayloadStatusCodeNoFancyK",
                      ],
                      comment: (
                        <>
                          The request for a <R n="Payload" />{" "}
                          slice was not processed, because the{" "}
                          <R n="WtpRequestGetPartialVerification" /> set{" "}
                          <R n="WtpPartialVerificationK" />{" "}
                          to a value other than <Code>1</Code>. The{" "}
                          <R n="wtp_feature_get_fancy_k" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                Every <R n="WtpResponseGetPayloadStatusCode" /> but{" "}
                <R n="WtpResponseGetPayloadStatusCodeYay" />{" "}
                marks the end of the response. If the{" "}
                <R n="WtpResponseGetPayloadStatusCode" /> <Em>is</Em>{" "}
                <R n="WtpResponseGetPayloadStatusCodeYay" />, the response
                continues with the requested <R n="Payload" />{" "}
                slice, and some accompanying metadata.
              </P>

              <P>
                More specifically, the response does not have to contain the
                complete requested slice, but merely a prefix of it. The
                response first indicates how much of the requested slice is
                actually part of the response. If the{" "}
                <R n="WtpRequestGetPartialVerification" /> of the request was
                {" "}
                <R n="wtp_request_get_partial_verification_options_none" />, the
                response simply states the number of <R n="Payload" />{" "}
                bytes it contains, starting at the requested{" "}
                <R n="WtpRequestGetSliceFrom" />. If the{" "}
                <R n="WtpRequestGetPartialVerification" /> of the request was
                {" "}
                <Em>not</Em>{" "}
                <R n="wtp_request_get_partial_verification_options_none" />,
                then the response indicates the length of the response slice,
                measured in{" "}
                <AE href="https://bab-hash.org/spec#chunk">
                  Bab chunks
                </AE>. In both cases, the indicated slice length must not exceed
                the originally requested <R n="WtpRequestGetSliceLength" />.
              </P>

              <P>
                The slice data itself consists of raw <R n="Payload" />{" "}
                bytes if the <R n="WtpRequestGetPartialVerification" />{" "}
                of the request was{" "}
                <R n="wtp_request_get_partial_verification_options_none" />, and
                of the{" "}
                <AE href="https://bab-hash.org/spec#slice_streaming">
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
                If the <R n="WtpRequestGetSliceFrom" /> exceeds{" "}
                <R n="entry_payload_length" /> of the addressed{" "}
                <R n="AuthorisedEntry" />, the message must be treated as if
                {" "}
                <R n="WtpRequestGetSliceLength" /> was zero.
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

              <Pseudocode n="wtp_defs_ResponseGet">
                <StructDef
                  comment={
                    <>
                      Responds to a <R n="WtpRequestGet" /> message.
                    </>
                  }
                  id={[
                    "ResponseGet",
                    "WtpResponseGet",
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
                            "WtpResponseGetRequestId",
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
                            "WtpResponseGetStatusCodeField",
                            "status_codes",
                          ],
                          <R n="WtpResponseGetStatusCode" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="AuthorisedEntry" />{" "}
                            the the request requested. If the{" "}
                            <R n="WtpResponseGetStatusCodeField" /> is not{" "}
                            <R n="WtpResponseGetStatusCodeYay" />, or if the
                            request set <R n="WtpRequestGetSkipEntry" /> to{" "}
                            <Code>true</Code>, then and only then must this be
                            {" "}
                            <R n="wtp_request_get_requested_entry_none" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "requested_entry",
                            "WtpResponseGetRequestedEntry",
                            "requested_entries",
                          ],
                          <ChoiceType
                            types={[
                              <R n="AuthorisedEntry" />,
                              <DefVariant
                                n="wtp_request_get_requested_entry_none"
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
                            <R n="wtp_request_get_payload_status_code_none" />
                            {" "}
                            if and only if the{" "}
                            <R n="WtpResponseGetStatusCodeField" /> field is not
                            {" "}
                            <R n="WtpResponseGetStatusCodeYay" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_status_code",
                            "WtpResponseGetPayloadStatusCodeField",
                            "payload_status_codes",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpResponseGetPayloadStatusCode" />,
                              <DefVariant
                                n="wtp_request_get_payload_status_code_none"
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
                            <R n="wtp_request_get_payload_response_none" />{" "}
                            if and only if{"  "}
                            <R n="WtpResponseGetStatusCodeField" /> field is not
                            {" "}
                            <R n="WtpResponseGetStatusCodeYay" /> or{" "}
                            <R n="WtpResponseGetPayloadStatusCodeField" />{" "}
                            field is not{" "}
                            <R n="WtpResponseGetPayloadStatusCodeYay" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_response",
                            "WtpResponseGetPayloadResponse",
                            "payload_response",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpPayloadResponse" />,
                              <DefVariant
                                n="wtp_request_get_payload_response_none"
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
                              If the <R n="WtpRequestGetPartialVerification" />
                              {" "}
                              of the request was{" "}
                              <R n="wtp_request_get_partial_verification_options_none" />,
                              this is simply the number of bytes in the response
                              slice.
                            </P>

                            <P>
                              Otherwise, this is the number of{" "}
                              <AE href="https://bab-hash.org/spec#chunk">
                                Bab chunks
                              </AE>{" "}
                              this response provides. Note that the actual data
                              it transmits consists of more than just those
                              chunks; it also includes the verification data of
                              the requested{" "}
                              <AE href="https://bab-hash.org/spec#kgrouped">
                                k-grouped light
                              </AE>{" "}
                              <AE href="https://bab-hash.org/spec#slice_streaming">
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
                            <R n="WtpRequestGetSliceLength" />.
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
                  ]}
                />
              </Pseudocode>
            </Hsection>

            <Hsection
              n="wtp_request_get_many"
              title={<Code>RequestGetMany</Code>}
            >
              <P>
                The second kind of request allows to request many{" "}
                <Rs n="LengthyAuthorisedEntry" /> in the same{" "}
                <R n="WtpRequestGetManyNamespaceId" /> simultaneously, either by
                {" "}
                <R n="AreaOfInterest" /> or by <R n="D3Range" />.
              </P>

              <P>
                Crucially, there are two optimisations. First, the request may
                carry a <R n="WtpFingerprint" />. If the set of requested{" "}
                <Rs n="LengthyAuthorisedEntry" /> hashes to exactly that{" "}
                <R n="WtpFingerprint" />, the <R n="wtp_server" />{" "}
                does not need to respond with its{" "}
                <Rs n="LengthyAuthorisedEntry" />{" "}
                at all. And second, if the number of{" "}
                <Rs n="LengthyAuthorisedEntry" />{" "}
                matching the query would exceed a threshold specified in the
                request, then the server replies with some summary data
                (<R n="WtpFingerprint" />, number of matching{" "}
                <Rs n="LengthyAuthorisedEntry" />, and/or their summed{" "}
                <R n="Payload" />{" "}
                lengths) instead of transmitting all the matching{" "}
                <Rs n="LengthyAuthorisedEntry" />.
              </P>

              <P>
                Taken together, these optimisations allow for an entirely
                optional, <R n="wtp_client" />-request-driven{" "}
                <R n="d3_range_based_set_reconciliation">
                  range-based set reconciliation
                </R>. And, less ambitiously, for pagination.
              </P>

              <Pseudocode n="wtp_defs_RequestGetMany">
                <StructDef
                  comment={
                    <>
                      Request multiple <Rs n="LengthyAuthorisedEntry" />{" "}
                      at once, while optionally giving some optimisation
                      conditions for omitting the{" "}
                      <Rs n="LengthyAuthorisedEntry" />{" "}
                      in favour of compact metadata.
                    </>
                  }
                  id={[
                    "RequestGetMany",
                    "WtpRequestGetMany",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="NamespaceId" /> of the <R n="namespace" />
                            {" "}
                            in which to request{" "}
                            <Rs n="LengthyAuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "namespace_id",
                            "WtpRequestGetManyNamespaceId",
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
                            The requested <Rs n="LengthyAuthorisedEntry" />{" "}
                            within the <R n="WtpRequestGetManyNamespaceId" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "query",
                            "WtpRequestGetManyQuery",
                            "query",
                          ],
                          <ChoiceType
                            types={[
                              <R n="AreaOfInterest" />,
                              <R n="D3Range" />,
                            ]}
                          />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            A <R n="WtpReadCapability" /> whose{" "}
                            <R n="access_receiver" /> must be the{" "}
                            <R n="WtpClientSetupMessageReadCapabilityReceiver" />
                            {" "}
                            of the{" "}
                            <R n="WtpClientSetupMessage" />, and which must
                            include all potential <Rs n="Entry" />{" "}
                            which could possibly be included in the{" "}
                            <R n="WtpRequestGetManyQuery" /> in the{" "}
                            <R n="WtpRequestGetManyNamespaceId" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "read_capability",
                            "WtpRequestGetManyReadCapability",
                            "read_capabilities",
                          ],
                          <R n="WtpReadCapability" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Under some circumstances, the <R n="wtp_server" />
                            {" "}
                            might reply to this request with compact metadata
                            instead of actual{" "}
                            <Rs n="LengthyAuthorisedEntry" />. When this flag is
                            {" "}
                            <Code>true</Code>, the <R n="wtp_client" />{" "}
                            wants this metadata to include the{" "}
                            <R n="WtpFingerprint" /> over all matched{" "}
                            <Rs n="LengthyAuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "metadata_request_fingerprint",
                            "WtpRequestGetManyMetadataRequestFingerprint",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Under some circumstances, the <R n="wtp_server" />
                            {" "}
                            might reply to this request with compact metadata
                            instead of actual{" "}
                            <Rs n="LengthyAuthorisedEntry" />. When this flag is
                            {" "}
                            <Code>true</Code>, the <R n="wtp_client" />{" "}
                            wants this metadata to include the{" "}
                            number of all matched{" "}
                            <Rs n="LengthyAuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "metadata_request_count",
                            "WtpRequestGetManyMetadataRequestCount",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Under some circumstances, the <R n="wtp_server" />
                            {" "}
                            might reply to this request with compact metadata
                            instead of actual{" "}
                            <Rs n="LengthyAuthorisedEntry" />. When this flag is
                            {" "}
                            <Code>true</Code>, the <R n="wtp_client" />{" "}
                            wants this metadata to include the sum of the{" "}
                            <Rs n="entry_payload_length" /> of all matched{" "}
                            <Rs n="LengthyAuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "metadata_request_size",
                            "WtpRequestGetManyMetadataRequestSize",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Optionally the expected <R n="WtpFingerprint" />
                            {" "}
                            of all <Rs n="LengthyAuthorisedEntry" /> the{" "}
                            <R n="wtp_server" /> has in the{" "}
                            <R n="WtpRequestGetManyQuery" /> in the{" "}
                            <R n="WtpRequestGetManyNamespaceId" />. If this is
                            not <R n="wtp_request_get_many_fingerprint_none" />
                            {" "}
                            and the matching <Rs n="LengthyAuthorisedEntry" />
                            {" "}
                            of the <R n="wtp_server" /> have exactly this{" "}
                            <R n="WtpFingerprint" />, the <R n="wtp_server" />
                            {" "}
                            can omit from its response all the{" "}
                            <Rs n="LengthyAuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "fingerprint",
                            "WtpRequestGetManyFingerprint",
                            "fingerprints",
                          ],
                          <ChoiceType
                            types={[
                              <R n="PayloadDigest" />,
                              <DefVariant
                                n="wtp_request_get_many_fingerprint_none"
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
                            <P>
                              If this is <Code>true</Code>,{" "}
                              <R n="WtpRequestGetManyFingerprint" /> is not{" "}
                              <R n="wtp_request_get_many_fingerprint_none" />,
                              but the <R n="wtp_server" /> opts out of{" "}
                              <R n="WtpFingerprint" />{" "}
                              computation, then the server <Em>must</Em>{" "}
                              respond with metadata instead of the actual
                              matching <Rs n="LengthyAuthorisedEntry" />.
                            </P>

                            <P>
                              Must be <Code>false</Code> if{" "}
                              <R n="WtpRequestGetManyFingerprint" /> is{" "}
                              <R n="wtp_request_get_many_fingerprint_none" />
                              {" "}
                              (the encoding ensures this).
                            </P>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "fingerprint_is_mandatory",
                            "WtpRequestGetManyFingerprintIsMandatory",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            If this is nonzero, and the number of matching{" "}
                            <Rs n="LengthyAuthorisedEntry" />{" "}
                            is greater than or equal to this value, the{" "}
                            <R n="wtp_server" />{" "}
                            should respond with metadata instead of the actual
                            matching <Rs n="LengthyAuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "threshold_count",
                            "WtpRequestGetManyThresholdCount",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            <P>
                              If this is{" "}
                              <Code>true</Code>, and the number of matching{" "}
                              <Rs n="LengthyAuthorisedEntry" />{" "}
                              is greater than or equal to the{" "}
                              <R n="WtpRequestGetManyThresholdCount" /> or the
                              {" "}
                              <R n="wtp_server" />{" "}
                              does not want to compute the number of matches,
                              then the <R n="wtp_server" /> <Em>must</Em>{" "}
                              respond with metadata instead of the actual
                              matching <Rs n="LengthyAuthorisedEntry" />.
                            </P>

                            <P>
                              Must be <Code>false</Code> if{" "}
                              <R n="WtpRequestGetManyThresholdCount" /> is zero
                              {" "}
                              (the encoding ensures this).
                            </P>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "threshold_count_is_mandatory",
                            "WtpRequestGetManyThresholdCountIsMandatory",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            If this is nonzero, and the sum of the{" "}
                            <Rs n="entry_payload_length" /> of the matching{" "}
                            <Rs n="LengthyAuthorisedEntry" />{" "}
                            is greater than or equal to this value, the{" "}
                            <R n="wtp_server" />{" "}
                            should respond with metadata instead of the actual
                            matching <Rs n="LengthyAuthorisedEntry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "threshold_size",
                            "WtpRequestGetManyThresholdSize",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            <P>
                              If this is <Code>true</Code>, and the sum of the
                              {" "}
                              <Rs n="entry_payload_length" /> of the matching
                              {" "}
                              <Rs n="LengthyAuthorisedEntry" />{" "}
                              is greater than or equal to the{" "}
                              <R n="WtpRequestGetManyThresholdSize" /> or the
                              {" "}
                              <R n="wtp_server" />{" "}
                              does not want to compute the number of matches,
                              then the <R n="wtp_server" /> <Em>must</Em>{" "}
                              respond with metadata instead of the actual
                              matching <Rs n="LengthyAuthorisedEntry" />.
                            </P>

                            <P>
                              Must be <Code>false</Code> if{" "}
                              <R n="WtpRequestGetManyThresholdSize" /> is zero
                              {" "}
                              (the encoding ensures this).
                            </P>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "threshold_size_is_mandatory",
                            "WtpRequestGetManyThresholdSizeIsMandatory",
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
                              The order in which the <R n="wtp_client" />{" "}
                              would like to receive the{" "}
                              <Rs n="LengthyAuthorisedEntry" />.
                            </P>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "ordering",
                            "WtpRequestGetManyOrdering",
                          ],
                          <ChoiceType
                            multiline
                            types={[
                              {
                                commented: {
                                  comment: (
                                    <>
                                      The response{" "}
                                      <Rs n="LengthyAuthorisedEntry" />{" "}
                                      must be sorted ascendingly by{"  "}
                                      <R n="entry_newer">novelty</R>{" "}
                                      first, using the{" "}
                                      <R n="entry_subspace_id" />{" "}
                                      as tiebreaker, and <R n="entry_path" />
                                      {" "}
                                      as secondary tiebreaker.
                                    </>
                                  ),
                                  dedicatedLine: true,
                                  segment: (
                                    <DefVariant
                                      n="wtp_request_get_bulk_newest_then_subspace_then_path"
                                      r="newest_then_subspace_then_path"
                                    />
                                  ),
                                },
                              },
                              {
                                commented: {
                                  comment: (
                                    <>
                                      The response{" "}
                                      <Rs n="LengthyAuthorisedEntry" />{" "}
                                      must be sorted ascendingly by{"  "}
                                      <R n="entry_subspace_id" />{" "}
                                      first, using the <R n="entry_path" />{" "}
                                      as tiebreaker, and{" "}
                                      <R n="entry_timestamp" />{" "}
                                      as secondary tiebreaker.
                                    </>
                                  ),
                                  dedicatedLine: true,
                                  segment: (
                                    <DefVariant
                                      n="wtp_request_get_bulk_subspace_then_path_then_newest"
                                      r="subspace_then_path_then_newest"
                                    />
                                  ),
                                },
                              },
                              {
                                commented: {
                                  comment: (
                                    <>
                                      The response{" "}
                                      <Rs n="LengthyAuthorisedEntry" />{" "}
                                      must be sorted either ascendingly by{"  "}
                                      <R n="entry_newer">novelty</R>{" "}
                                      first, using the{" "}
                                      <R n="entry_subspace_id" />{" "}
                                      as tiebreaker, and <R n="entry_path" />
                                      {" "}
                                      as secondary tiebreaker, or ascendingly by
                                      {"  "}<R n="entry_subspace_id" />{" "}
                                      first, using the <R n="entry_path" />{" "}
                                      as tiebreaker, and{" "}
                                      <R n="entry_timestamp" />{" "}
                                      as secondary tiebreaker.
                                    </>
                                  ),
                                  dedicatedLine: true,
                                  segment: (
                                    <DefVariant
                                      n="wtp_request_get_bulk_either_works"
                                      r="either_works"
                                    />
                                  ),
                                },
                              },
                              {
                                commented: {
                                  comment: (
                                    <>
                                      The response{" "}
                                      <Rs n="LengthyAuthorisedEntry" />{" "}
                                      need not be sorted.
                                    </>
                                  ),
                                  dedicatedLine: true,
                                  segment: (
                                    <DefVariant
                                      n="wtp_request_get_bulk_sorted_whatever"
                                      r="whatever"
                                    />
                                  ),
                                },
                              },
                            ]}
                          />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>
            </Hsection>

            <Hsection
              n="wtp_response_get_many"
              title={<Code>ResponseGetMany</Code>}
            >
              <P>
                <Alj inline>TODO</Alj>
              </P>
            </Hsection>

            <Hsection n="wtp_request_put" title={<Code>RequestPut</Code>}>
              <P>
                The third and final kind of request lets the{" "}
                <R n="wtp_client" /> push a contiguous slice of the{" "}
                <R n="Payload" /> of an <R n="AuthorisedEntry" /> to the{" "}
                <R n="wtp_server" />. The <R n="Payload" />{" "}
                slice might be empty, which amounts to pushing only the{" "}
                <R n="AuthorisedEntry" /> itself.
              </P>

              <Pseudocode n="wtp_defs_RequestPut">
                <StructDef
                  comment={
                    <>
                      Push a contiguous, possibly empty subslice of the{" "}
                      <R n="Payload" /> of an <R n="AuthorisedEntry" /> to the
                      {" "}
                      <R n="wtp_server" />.
                    </>
                  }
                  id={[
                    "RequestPut",
                    "WtpRequestPut",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="AuthorisedEntry" /> to push to the{" "}
                            <R n="wtp_server" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "entry",
                            "WtpRequestPutEntry",
                            "entries",
                          ],
                          <R n="AuthorisedEntry" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The start offset (zero-indexed, inclusive) of the
                            transmitted <R n="Payload" /> slice.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "slice_from",
                            "WtpRequestPutSliceFrom",
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
                            The length of the transmitted <R n="Payload" />{" "}
                            slice.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "slice_length",
                            "WtpRequestPutSliceLength",
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
                            <R n="wtp_request_put_partial_verification_options_none" />,
                            then the <R n="WtpRequestPutSliceFrom" /> and{" "}
                            <R n="WtpRequestPutSliceLength" />{" "}
                            fields are number of bytes, and transmitted{" "}
                            <R n="Payload" />{" "}
                            slice is simply a sequence of raw bytes. If{" "}
                            <R n="WtpPartialVerification" /> is given, however,
                            {" "}
                            <R n="WtpRequestPutSliceFrom" /> and{" "}
                            <R n="WtpRequestPutSliceLength" /> are numbers of
                            {" "}
                            <AE href="https://bab-hash.org/spec#chunk">
                              Bab chunks
                            </AE>. Then, the transmitted <R n="Payload" />{" "}
                            slice is not a raw subslice of the{" "}
                            <R n="Payload" />, but part of a Bab verifiable
                            stream. The details are described on the{" "}
                            <R n="WtpPartialVerification" /> struct.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "partial_verification",
                            "WtpRequestPutPartialVerification",
                            "partial_verification",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpPartialVerification" />,
                              <DefVariant
                                n="wtp_request_put_partial_verification_options_none"
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
                            The slice data, either as raw bytes or as a Bab
                            stream. The length of this is given by (or can be
                            derived from) <R n="WtpRequestPutSliceLength" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "slice_data",
                            "WtpRequestPutSliceData",
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

            <Hsection n="wtp_response_put" title={<Code>ResponsePut</Code>}>
              <P>
                The response to a <R n="WtpRequestPut" />{" "}
                message starts with the <R n="wtp_request_id" /> of the{" "}
                <R n="WtpRequestPut" />{" "}
                message, followed by one of the following status codes:
              </P>

              <Pseudocode n="wtp_response_put_status_code_def">
                <Enum
                  comment={
                    <>
                      The different status codes in a response to a{" "}
                      <R n="WtpRequestPut" />{" "}
                      message. If multiple codes would apply, the one listed
                      earliest takes precedence.
                    </>
                  }
                  id={[
                    "ResponsePutStatusCode",
                    "WtpResponsePutStatusCode",
                    "ResponsePutStatusCodes",
                  ]}
                  variants={[
                    {
                      tuple: true,
                      id: [
                        "nope",
                        "WtpResponsePutStatusCodeNope",
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
                        "too_annoying",
                        "WtpResponsePutStatusCodeTooAnnoying",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{" "}
                          chose to not meaningfully answer this request, because
                          it does not want to spend its resources on this{" "}
                          <R n="wtp_client" />{" "}
                          right now. Intended for rate-limiting.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "yay",
                        "WtpResponsePutStatusCodeYay",
                      ],
                      comment: (
                        <>
                          The request could be processed, and the{" "}
                          <R n="wtp_server" /> was interested in the{" "}
                          <R n="AuthorisedEntry" /> it received.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "not_processed",
                        "WtpResponsePutStatusCodeNotProcessed",
                      ],
                      comment: (
                        <>
                          The request was not processed. The{" "}
                          <R n="wtp_feature_put" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "disinterested",
                        "WtpResponsePutStatusCodeDisinterested",
                      ],
                      comment: (
                        <>
                          The request could be processed, but the{" "}
                          <R n="wtp_server" /> was not interested in the{" "}
                          <R n="AuthorisedEntry" /> it received.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "old_news",
                        "WtpResponsePutStatusCodeOldNews",
                      ],
                      comment: (
                        <>
                          The request could be processed, and{" "}
                          <R n="wtp_server" /> would have been interested in the
                          {" "}
                          <R n="AuthorisedEntry" />{" "}
                          it received — if it had not stored that data already.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "very_old_news",
                        "WtpResponsePutStatusCodeVeryOldNews",
                      ],
                      comment: (
                        <>
                          The request could be processed, but the received{" "}
                          <R n="AuthorisedEntry" />{" "}
                          had to be deleted immediately due to{" "}
                          <R n="prefix_pruning" />.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "unauthorised",
                        "WtpResponsePutStatusCodeUnauthorised",
                      ],
                      comment: (
                        <>
                          <P>
                            The <R n="AuthorisationToken" /> of the{" "}
                            <R n="WtpRequestPutEntry" /> was invalid.
                          </P>
                        </>
                      ),
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                Every <R n="WtpResponsePutStatusCode" /> but{" "}
                <R n="WtpResponsePutStatusCodeYay" />{" "}
                marks the end of the response. If the{" "}
                <R n="WtpResponsePutStatusCode" /> <Em>is</Em>{" "}
                <R n="WtpResponsePutStatusCodeYay" />, the response continues
                with a secondary status code to indicate whether the requested
                {" "}
                <R n="Payload" /> slice can be served:
              </P>

              <Pseudocode n="wtp_response_put_payload_status_code_def">
                <Enum
                  comment={
                    <>
                      The different status codes indicating whether a{" "}
                      <R n="Payload" /> slice was ingested in response to a{" "}
                      <R n="WtpRequestPut" />{" "}
                      message. If multiple codes would apply, the one listed
                      earliest takes precedence.
                    </>
                  }
                  id={[
                    "ResponsePutPayloadStatusCode",
                    "WtpResponsePutPayloadStatusCode",
                    "ResponsePutPayloadStatusCodes",
                  ]}
                  variants={[
                    {
                      tuple: true,
                      id: [
                        "nope",
                        "WtpResponsePutPayloadStatusCodeNope",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" /> chose to not ingest the{" "}
                          <R n="Payload" /> slice. It also chose to not tell the
                          {" "}
                          <R n="wtp_client" /> why.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "too_annoying",
                        "WtpResponsePutPayloadStatusCodeTooAnnoying",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" /> chose to not ingest the{" "}
                          <R n="Payload" />{" "}
                          slice, because it does not want to spend its resources
                          on this <R n="wtp_client" />{" "}
                          right now. Intended for rate-limiting.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "yay",
                        "WtpResponsePutPayloadStatusCodeYay",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" /> ingested the{" "}
                          <R n="Payload" /> slice, and it contained data the
                          {" "}
                          <R n="wtp_server" /> did not have before.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "not_processed",
                        "WtpResponsePutPayloadStatusCodeNotProcessed",
                      ],
                      comment: (
                        <>
                          The <R n="Payload" /> slice was discarded. The{" "}
                          <R n="wtp_feature_put_payload" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "disinterested",
                        "WtpResponsePutPayloadStatusCodeDisinterested",
                      ],
                      comment: (
                        <>
                          The <R n="wtp_server" />{" "}
                          was not interested in storing the <R n="Payload" />
                          {" "}
                          of this <R n="AuthorisedEntry" />.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "old_news",
                        "WtpResponsePutPayloadStatusCodeOldNews",
                      ],
                      comment: (
                        <>
                          The request could be processed, and{" "}
                          <R n="wtp_server" /> would have been interested in the
                          {" "}
                          <R n="Payload" />{" "}
                          slice it received — if it had not stored that data
                          already.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "no_raw_slices",
                        "WtpResponsePutPayloadStatusCodeNoRawSlices",
                      ],
                      comment: (
                        <>
                          The <R n="Payload" /> slice was discarded, because the
                          {" "}
                          <R n="WtpRequestPutPartialVerification" /> was{" "}
                          <R n="wtp_request_put_partial_verification_options_none" />.
                          The <R n="wtp_feature_put_payload_raw_slices" />{" "}
                          of the <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "no_authenticated_slices",
                        "WtpResponsePutPayloadStatusCodeNoAuthenticatedSlices",
                      ],
                      comment: (
                        <>
                          The <R n="Payload" /> slice was discarded, because the
                          {" "}
                          <R n="WtpRequestPutPartialVerification" /> was not
                          {" "}
                          <R n="wtp_request_put_partial_verification_options_none" />.
                          The{" "}
                          <R n="wtp_feature_put_payload_authenticated_slices" />
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
                        "WtpResponsePutPayloadStatusCodeNoFancyK",
                      ],
                      comment: (
                        <>
                          The <R n="Payload" /> slice was discarded, because the
                          {" "}
                          <R n="WtpRequestPutPartialVerification" /> set{" "}
                          <R n="WtpPartialVerificationK" />{" "}
                          to a value other than <Code>1</Code>. The{" "}
                          <R n="wtp_feature_put_payload_fancy_k" /> of the{" "}
                          <R n="WtpServerSetupMessage" />{" "}
                          gives more information.
                        </>
                      ),
                    },
                    {
                      tuple: true,
                      id: [
                        "want_earlier_slice",
                        "WtpResponsePutPayloadStatusCodeWantEarlierSlice",
                      ],
                      comment: (
                        <>
                          The <R n="Payload" /> slice was discarded, because the
                          {" "}
                          <R n="wtp_server" />{" "}
                          wishes to store only a single, contiguous prefix of
                          the{" "}
                          <R n="Payload" />, but the transmitted slice starts
                          outsidethe prefix the <R n="wtp_server" />{" "}
                          has so far. The response contains the offset starting
                          from which the <R n="wtp_server" />{" "}
                          would like to receive a new <R n="WtpRequestPut" />
                          {" "}
                          message.
                        </>
                      ),
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                Every <R n="WtpResponsePutPayloadStatusCode" /> but{" "}
                <R n="WtpResponsePutPayloadStatusCodeWantEarlierSlice" />{" "}
                marks the end of the response. If the{" "}
                <R n="WtpResponsePutStatusCode" /> <Em>is</Em>{" "}
                <R n="WtpResponsePutPayloadStatusCodeWantEarlierSlice" />, the
                response continues with a <R n="U64" />{" "}
                indicating the slice start (in a unit of raw bytes or Bab
                chunks, depending on the{" "}
                <R n="WtpRequestPutPartialVerification" />{" "}
                of the request) starting from which the <R n="wtp_server" />
                {" "}
                would like to receive the <R n="Payload" />.
              </P>

              <P>
                Bringing it all together:
              </P>

              <Pseudocode n="wtp_defs_ResponsePut">
                <StructDef
                  comment={
                    <>
                      Responds to a <R n="WtpRequestPut" /> message.
                    </>
                  }
                  id={[
                    "ResponsePut",
                    "WtpResponsePut",
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
                            "WtpResponsePutRequestId",
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
                            "WtpResponsePutStatusCodeField",
                            "status_codes",
                          ],
                          <R n="WtpResponsePutStatusCode" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The status code regarding whether the{" "}
                            <R n="Payload" /> slice was stored. Must be{" "}
                            <R n="wtp_request_put_payload_status_code_none" />
                            {" "}
                            if and only if the{" "}
                            <R n="WtpResponsePutStatusCodeField" /> field is not
                            {" "}
                            <R n="WtpResponsePutStatusCodeYay" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_status_code",
                            "WtpResponsePutPayloadStatusCodeField",
                            "payload_status_codes",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpResponsePutPayloadStatusCode" />,
                              <DefVariant
                                n="wtp_request_put_payload_status_code_none"
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
                            The slice start (in a unit of raw bytes or Bab
                            chunks, depending on the{" "}
                            <R n="WtpRequestPutPartialVerification" />{" "}
                            of the request) starting from which the{" "}
                            <R n="wtp_server" /> would like to receive the{" "}
                            <R n="Payload" /> again. Must be{" "}
                            <R n="wtp_response_put_retry_at_offset_none" />{" "}
                            if and only if{"  "}
                            <R n="WtpResponsePutPayloadStatusCodeField" />{" "}
                            field is not{" "}
                            <R n="WtpResponsePutPayloadStatusCodeWantEarlierSlice" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "retry_at_offset",
                            "WtpResponsePutRetryAtOffset",
                            "retry_at_offset",
                          ],
                          <ChoiceType
                            types={[
                              <R n="U64" />,
                              <DefVariant
                                n="wtp_response_put_retry_at_offset_none"
                                r="none"
                              />,
                            ]}
                          />,
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
          </Hsection>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
