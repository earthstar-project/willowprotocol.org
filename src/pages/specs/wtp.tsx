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
import {
  Code,
  Em,
  Figcaption,
  Figure,
  I,
  Img,
  Li,
  P,
  Ul,
} from "macromania-html";
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
                <R n="WtpSendEntry" />: for sending <Rs n="AuthorisedEntry" />.
              </Li>
              <Li>
                <R n="WtpSendPayloadSlice" />: for sending (parts of){" "}
                <Rs n="Payload" />.
              </Li>
              <Li>
                <R n="WtpCancelOwnRequest" />: for indicating that a peer is not
                interested anymore in the response(s) to a{" "}
                <R n="WtpRequestEntries" /> or <R n="WtpRequestPayloadSlice" />
                {" "}
                message it had sent earlier.
              </Li>
              <Li>
                <R n="WtpRegulateAppetite" />: for dynamically changing the{" "}
                <R n="entry_payload_length" />{" "}
                up to which responses to a long-lived{" "}
                <R n="WtpRequestEntries" /> request should eagerly include the
                {" "}
                <R n="Payload" />.
              </Li>
            </Ul>

            <Hsection
              n="wtp_request_entries"
              title={<Code>RequestEntries</Code>}
            >
              <P>
                The <R n="WtpRequestEntries" /> messages let peers request{" "}
                <Rs n="Entry" /> in a{" "}
                <Sidenote
                  note={
                    <>
                      This message type can also be used for requesting
                      individual <Rs n="Entry" />: for each <R n="Entry" />{" "}
                      there exists a <R n="D3Range" />{" "}
                      that does not contain any other <Rs n="Entry" />.
                    </>
                  }
                >
                  grouping
                </Sidenote>{" "}
                (<R n="AreaOfInterest" /> or{" "}
                <R n="D3Range" />). The basic information consists of the
                grouping, a <R n="NamespaceId" />, and a{" "}
                <R n="WtpReadCapability" />{" "}
                authenticating the request. The message carries various further
                options to make it more expressive.
              </P>

              <P>
                First, additional options for requesting the payloads of the
                {" "}
                <Rs n="Entry" />{" "}
                in the grouping: a payload length threshold up to which the
                receiver should automatically send the payloads without further
                requests, and the value <Code>k</Code> for the Bab{" "}
                <AE href="https://bab-hash.org/spec#kgrouped">
                  k-grouping
                </AE>{" "}
                used when sending these payloads.
              </P>

              <P>
                Second, options regarding streaming responses. The responses
                always concern the entries the receiver has at the point of
                responding, but an additional flag can indicate that the request
                is long-running, asking the the receiver to keep forwarding new
                {" "}
                <Rs n="Entry" />{" "}
                it obtains in the future. For the immediate response, the
                requester can also ask for the <Rs n="Entry" />{" "}
                to be sent in sorted<Marginale>
                  In set reconciliation, the part where a peer sends everything
                  they had in a range except for the items they just received
                  can be implemented more efficiently if the received items
                  arrive in sorted order.
                </Marginale>{" "}
                order.
              </P>

              <P>
                Third, and finally, options pertaining to{" "}
                <Marginale>
                  This specification assumes familiarity with our{" "}
                  <R n="d3_range_based_set_reconciliation">
                    page on 3d range-based set reconciliation
                  </R>.
                </Marginale>
                <R n="d3_range_based_set_reconciliation">
                  3d range-based set reconciliation
                </R>:
              </P>

              <Ul>
                <Li>
                  The sender can attach the <R n="WtpFingerprint" />{" "}
                  over their own <Rs n="LengthyAuthorisedEntry" />{" "}
                  in the requested grouping — the receiver can then compute the
                  fingerprint over <Em>their</Em>{" "}
                  <Rs n="LengthyAuthorisedEntry" />{" "}
                  and skip sending anything in case of a match.
                </Li>
                <Li>
                  The sender can specify a maximum <R n="Entry" />{" "}
                  count and a maximum total <R n="Payload" /> size. If the{" "}
                  <Rs n="Entry" />{" "}
                  of the receiver exceeds those thresholds, the receiver should
                  answer with a summary (<R n="WtpFingerprint" />, number of
                  {" "}
                  <Rs n="Entry" />, and their total <R n="Payload" />{" "}
                  size) instead of the data itself.
                </Li>
                <Li>
                  The sender can allow the receiver to respond (if the count or
                  size thresholds are exceeded) not with metadata but to instead
                  partition the requested grouping into smaller{" "}
                  <Rs n="D3Range" /> and respond with{" "}
                  <Rs n="WtpRequestEntries" />{" "}
                  messages of its own; this implements the symmetric,
                  collaborative drilling-down to differences of RBSR. Such
                  responses state which message they are responding to, as well
                  as the original non-response message that kicked things off —
                  this lets peers efficiently track progress on their original
                  requests.
                </Li>
              </Ul>

              <Pseudocode n="wtp_defs_RequestEntries">
                <StructDef
                  comment={
                    <>
                      Request{" "}
                      <Rs n="LengthyAuthorisedEntry" />, optionally as part of
                      {" "}
                      <R n="d3_range_based_set_reconciliation">
                        3d range-based set reconciliation
                      </R>.
                    </>
                  }
                  id={[
                    "RequestEntries",
                    "WtpRequestEntries",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            Whether this message is assigned a{" "}
                            <R n="WtpMessageId" /> or not.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "has_id",
                            "WtpRequestEntriesHasId",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            A valid <R n="WtpReadCapability" /> whose{" "}
                            <R n="access_receiver" /> is the{" "}
                            <R n="wtp_receiver" />{" "}
                            authenticated in the opening handshake
                            (<R n="ini_spk" /> for the <R n="pio_initiator" />,
                            {" "}
                            <R n="res_spk" /> for the{" "}
                            <R n="pio_responder" />), whose{" "}
                            <R n="granted_area" /> includes the{" "}
                            <R n="WtpRequestEntriesGrouping" />{" "}
                            of the request, and whose{" "}
                            <R n="granted_namespace" /> is the{" "}
                            <R n="WtpRequestEntriesNamespaceId" />{" "}
                            of the request.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "read_capability",
                            "WtpRequestEntriesReadCapability",
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
                            The <R n="namespace" /> in which to request entries.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "namespace_id",
                            "WtpRequestEntriesNamespaceId",
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
                            The grouping in which to request entries.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "grouping",
                            "WtpRequestEntriesGrouping",
                            "groupings",
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
                            The receiver should include <Rs n="Payload" />{" "}
                            of this length or less in the responses, whereas
                            larger <Rs n="Payload" /> should be excluded.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_lazyness_threshold",
                            "WtpRequestEntriesPayloadLazynessThreshold",
                            "payload_lazyness_thresholds",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The value <Code>k</Code> for Bab{" "}
                            <AE href="https://bab-hash.org/spec#kgrouped">
                              k-grouping
                            </AE>{" "}
                            when sending <Rs n="Payload" />{" "}
                            in response to this request.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "k",
                            "WtpRequestEntriesK",
                          ],
                          <R n="U8" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            <P>
                              If true, the receiver should send all matching
                              entries it has and then signal the end of the
                              response. If false, the receiver should keep
                              sending new matching entries as it obtains them.
                            </P>
                            <P>
                              If the response consists of metadata (or a set of
                              {" "}
                              <Rs n="WtpRequestEntries" /> messages as{" "}
                              <Quotes>counter-requests</Quotes>{" "}
                              for set reconciliation), this flag is ignored;
                              such responses are always fire-and-forget.
                            </P>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "is_oneshot",
                            "WtpRequestEntriesIsOneshot",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The fingerprint over all{" "}
                            <Rs n="LengthyAuthorisedEntry" /> the{" "}
                            <Em>sender</Em>{" "}
                            of the message has in the grouping. Or simply{" "}
                            <R n="wtp_request_entries_fingerprint_none" />{" "}
                            if the sender does not want to compute this.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "own_fingerprint",
                            "WtpRequestEntriesOwnFingerprint",
                            "own_fingerprints",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpFingerprint" />,
                              <DefVariant
                                n="wtp_request_entries_fingerprint_none"
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
                            If the receiver has this many or more entries in the
                            requested grouping, they should reply with metadata
                            (or partition the grouping and send{" "}
                            <Rs n="WtpRequestEntries" />{" "}
                            message of their own, depending on{" "}
                            <R n="WtpRequestEntriesAllowSymmetricRbsr" />)
                            instead of sending the entries.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "threshold_count",
                            "WtpRequestEntriesThresholdCount",
                            "threshold_counts",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            If the receiver has entries in the requested
                            grouping whose total <R n="entry_payload_length" />
                            {" "}
                            (the actual field of the{" "}
                            <R n="Entry" />, not the length of the{" "}
                            <R n="Payload" /> prefix that is actually available)
                            {" "}
                            is equal to or greater than this, they should reply
                            with metadata (or partition the grouping and send
                            {" "}
                            <Rs n="WtpRequestEntries" />{" "}
                            message of their own, depending on{" "}
                            <R n="WtpRequestEntriesAllowSymmetricRbsr" />)
                            instead of sending the entries.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "threshold_size",
                            "WtpRequestEntriesThresholdSize",
                            "threshold_sizes",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            If true, when the{" "}
                            <R n="WtpRequestEntriesThresholdCount" /> or{" "}
                            <R n="WtpRequestEntriesThresholdSize" />{" "}
                            are exceeded by the receiver, they should partition
                            the grouping into smaller subgroupings and send
                            their own <R n="WtpRequestEntries" />{" "}
                            messages instead of responding with metadata.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "allow_symmetric_rbsr",
                            "WtpRequestEntriesAllowSymmetricRbsr",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            If this message is sent as a response to another
                            {" "}
                            <R n="WtpRequestEntries" /> as per that message’s
                            {" "}
                            <R n="WtpRequestEntriesAllowSymmetricRbsr" />{" "}
                            flag, and that prior message has a{" "}
                            <R n="WtpMessageId" />, then this field conveys
                            further information about what is being responded
                            to. Otherwise, it must be{" "}
                            <R n="wtp_request_entries_provenance_none" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "provenance",
                            "WtpRequestEntriesProvenanceField",
                          ],
                          <ChoiceType
                            types={[
                              <R n="WtpRequestEntriesProvenance" />,
                              <DefVariant
                                n="wtp_request_entries_provenance_none"
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
                      Provenance metadata when sending a{" "}
                      <R n="WtpRequestEntries" /> message in response to another
                      {" "}
                      <R n="WtpRequestEntries" />{" "}
                      message. This information is not required for the
                      correctness of set reconciliation, but it allows peers to
                      efficiently track progress. It is also important for the
                      encoding of long-running (i.e.,
                      non-<R n="WtpRequestEntriesIsOneshot">oneshot</R>)
                      responses.
                    </>
                  }
                  id={[
                    "RequestEntriesProvenance",
                    "WtpRequestEntriesProvenance",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="WtpMessageId" /> of the{" "}
                            <R n="WtpRequestEntries" />{" "}
                            this is in response to. It is an error if this{" "}
                            <R n="WtpMessageId" /> is not the id of a{" "}
                            <R n="WtpRequestEntries" /> message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "parent",
                            "WtpRequestEntriesProvenanceParent",
                            "parents",
                          ],
                          <R n="WtpMessageId" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Whether this message is the final{" "}
                            <R n="WtpRequestEntries" />{" "}
                            message among those sent in response to the same
                            {" "}
                            <R n="WtpRequestEntriesProvenanceParent" /> message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "is_final_response",
                            "WtpRequestEntriesProvenanceIsFinalResponse",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="WtpMessageId" />{" "}
                            of the root message of the tree of responses, i.e.,
                            the id you arrive at by transitively following the
                            {" "}
                            <R n="WtpRequestEntriesProvenanceParent" />{" "}
                            ids until you reach a <R n="WtpRequestEntries" />
                            {" "}
                            message that was not in response to any other{" "}
                            <R n="WtpRequestEntries" /> message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "root",
                            "WtpRequestEntriesProvenanceRoot",
                            "roots",
                          ],
                          <R n="WtpMessageId" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                <Alj inline>
                  (Design note: there's also the <Code>preferred_ordering</Code>
                  {" "}
                  enum from the Rust code sketch, but that is likely to be
                  obsoleted by the future canonical AreaSlice ordering, turning
                  this into a boolean.)
                </Alj>
              </P>
            </Hsection>

            <Hsection
              n="wtp_respond_to_request_entries"
              title={<Code>RespondToRequestEntries</Code>}
            >
              <P>
                The <R n="WtpRespondToRequestEntries" />{" "}
                messages let peers respond to <R n="WtpRequestEntries" />{" "}
                messages. Somewhat unconventionally, a single{" "}
                <R n="WtpRequestEntries" /> is not responded to by a single{" "}
                <R n="WtpRespondToRequestEntries" />. Instead, the process of
                fully responding to a <R n="WtpRequestEntries" />{" "}
                is a sequence of steps, forming a (simple and small) state
                machine. <R n="WtpRequestEntries" />{" "}
                messages indicate transitions in that state machine. When we
                write that a particular kind of{" "}
                <R n="WtpRespondToRequestEntries" />{" "}
                <Quotes>terminates the response</Quotes>, that means that a
                final state has been reached, the request has been completely
                responded to and will not be interacted with again. Both peers
                can then clear up any state associated with that request.
              </P>

              <Pseudocode n="wtp_defs_RespondToRequestEntries">
                <StructDef
                  comment={
                    <>
                      Indicate progress through the process of responding to a
                      {" "}
                      <R n="WtpRequestEntries" /> message.
                    </>
                  }
                  id={[
                    "RespondToRequestEntries",
                    "WtpRespondToRequestEntries",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="WtpMessageId" /> of the{" "}
                            <R n="WtpRequestEntries" />{" "}
                            message this is a response to.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "request_id",
                            "WtpRespondToRequestEntriesRequestId",
                            "request_id",
                          ],
                          <R n="WtpMessageId" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The transition in the reponse state machine.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "response",
                            "WtpRespondToRequestEntriesResponse",
                            "responses",
                          ],
                          <R n="WtpResponseForRequestEntries" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                The state transitions are straightforward. After receiving a
                {" "}
                <R n="WtpRequestEntries" /> message, there are four options:
              </P>

              <Ul>
                <Li>
                  The first option does not involve{" "}
                  <R n="WtpRespondToRequestEntries" />{" "}
                  messages at all: if you reply with other{" "}
                  <R n="WtpRespondToRequestEntries" />{" "}
                  messages instead, the response is terminated once the final
                  such message (with the{" "}
                  <R n="WtpRequestEntriesProvenanceIsFinalResponse" />{" "}
                  flag set to <Code>true</Code>) has been sent.
                </Li>
                <Li>
                  The second option is the{" "}
                  <R n="WtpResponseForRequestEntriesNope" />{" "}
                  transition, which indicates that the request will not be
                  processed (any further) and immediately terminates the
                  response. This transition can be taken at any time, not only
                  as the very first transition.
                </Li>
                <Li>
                  The third option is the{" "}
                  <R n="WtpResponseForRequestEntriesMetadata" />{" "}
                  transition, which carries metadata summarising the grouping
                  and then terminates the response.
                </Li>
                <Li>
                  The final option is the{" "}
                  <R n="WtpResponseForRequestEntriesImmediateEntries" />{" "}
                  transition which moves to a new state. In this state, you can
                  send <R n="WtpSendEntry" /> and <R n="WtpSendPayloadSlice" />
                  {" "}
                  messages pertaiing to the request.
                </Li>
              </Ul>

              <P>
                After sending a{" "}
                <R n="WtpResponseForRequestEntriesImmediateEntries" />{" "}
                response, there are two further transitions. One is the{" "}
                <R n="WtpResponseForRequestEntriesDone" />{" "}
                transition, indicating that all entries and payloads have been
                sent and terminating the response. The other option is the{" "}
                <R n="WtpResponseForRequestEntriesLiveEntries" />{" "}
                transition. It must only be taken if the request did not set the
                {" "}
                <R n="WtpRequestEntriesIsOneshot" /> flag.
              </P>

              <P>
                After a <R n="WtpResponseForRequestEntriesLiveEntries" />{" "}
                transition, you can continue sending <R n="WtpSendEntry" /> and
                {" "}
                <R n="WtpSendPayloadSlice" />{" "}
                messages, with the difference that these are now encoded
                relative to the <R n="WtpRequestEntriesProvenanceRoot" />{" "}
                request and need not adhere to any promises of a particular
                order of entry transmissions any longer. The intuition is that
                the switch from{" "}
                <R n="WtpResponseForRequestEntriesImmediateEntries" /> to{" "}
                <R n="WtpResponseForRequestEntriesLiveEntries" />{" "}
                marks going from sending the collection of stored entries to
                forwarding live updates. Finally, the{" "}
                <R n="WtpResponseForRequestEntriesDone" />{" "}
                transition can be used to terminate the response.
              </P>

              <P>
                <Alj inline>diagram of the state machine goes here</Alj>
              </P>

              <Pseudocode n="wtp_defs_WtpResponseForRequestEntries">
                <Enum
                  comment={
                    <>
                      The different transitions in the state machine that
                      describes the process of responding to a{" "}
                      <R n="WtpRequestEntries" /> message.
                    </>
                  }
                  id={[
                    "ResponseForRequestEntries",
                    "WtpResponseForRequestEntries",
                  ]}
                  variants={[
                    {
                      comment: (
                        <>
                          Indicates that the <R n="WtpRequestEntries" />{" "}
                          message will not be processed (any further).
                          Terminates the response.
                        </>
                      ),
                      id: [
                        "Nope",
                        "WtpResponseForRequestEntriesNope",
                      ],
                      fields: [
                        {
                          commented: {
                            comment: (
                              <>
                                If{" "}
                                <Code>true</Code>, indicates that the other peer
                                might have better luck if they tried the same
                                request at a later time, preferrably with
                                exponential backoff between tries. If{" "}
                                <Code>false</Code>, the other peer need not
                                bother trying again.
                              </>
                            ),
                            dedicatedLine: true,
                            segment: [
                              [
                                "retry",
                                "WtpResponseForRequestEntriesNopeRetry",
                              ],
                              <R n="Bool" />,
                            ],
                          },
                        },
                      ],
                    },
                    {
                      comment: (
                        <>
                          Responds to the <R n="WtpRequestEntries" />{" "}
                          message by supplying metadata about the grouping.
                          Terminates the response.
                        </>
                      ),
                      id: [
                        "Metadata",
                        "WtpResponseForRequestEntriesMetadata",
                      ],
                      fields: [
                        {
                          commented: {
                            comment: (
                              <>
                                The <R n="WtpFingerprint" /> over the{" "}
                                <Rs n="LengthyAuthorisedEntry" />{" "}
                                the sender has in the grouping.
                              </>
                            ),
                            dedicatedLine: true,
                            segment: [
                              [
                                "fingerprint",
                                "WtpResponseForRequestEntriesMetadataFingerprint",
                              ],
                              <R n="WtpFingerprint" />,
                            ],
                          },
                        },
                        {
                          commented: {
                            comment: (
                              <>
                                The number of entries the sender has in the
                                grouping.
                              </>
                            ),
                            dedicatedLine: true,
                            segment: [
                              [
                                "count",
                                "WtpResponseForRequestEntriesMetadataCount",
                              ],
                              <R n="U64" />,
                            ],
                          },
                        },
                        {
                          commented: {
                            comment: (
                              <>
                                The sum of the <Rs n="entry_payload_length" />
                                {" "}
                                of the entries the sender has in the grouping
                                (the length as given by the <Rs n="Entry" />
                                {" "}
                                themselves, <Em>not</Em> how many{" "}
                                <R n="Payload" />{" "}
                                bytes are actually locally available).
                              </>
                            ),
                            dedicatedLine: true,
                            segment: [
                              [
                                "size",
                                "WtpResponseForRequestEntriesMetadataSize",
                              ],
                              <R n="U64" />,
                            ],
                          },
                        },
                      ],
                    },
                    {
                      comment: (
                        <>
                          Indicates that the responder will reply with{" "}
                          <R n="WtpSendEntry" /> and{" "}
                          <R n="WtpSendPayloadSlice" /> messages.
                        </>
                      ),
                      id: [
                        "ImmediateEntries",
                        "WtpResponseForRequestEntriesImmediateEntries",
                      ],
                      fields: [
                        {
                          commented: {
                            comment: (
                              <>
                                <Alj inline>
                                  TODO, the mechanics here depend on the
                                  supported orderings, which in turn depend on
                                  changes brought on by AreaSlices.
                                </Alj>
                              </>
                            ),
                            dedicatedLine: true,
                            segment: [
                              [
                                "will_sort",
                                "WtpResponseForRequestEntriesImmediateEntriesWillSort",
                              ],
                              <R n="Bool" />,
                            ],
                          },
                        },
                      ],
                    },
                    {
                      comment: (
                        <>
                          Indicates that further entries and payloads will be
                          transmitted without ordering guarantees and encoded
                          relative to the{" "}
                          <R n="WtpRequestEntriesProvenanceRoot" />{" "}
                          request rather than the actual request being responded
                          to.
                        </>
                      ),
                      tuple: true,
                      id: [
                        "LiveEntries",
                        "WtpResponseForRequestEntriesLiveEntries",
                      ],
                    },
                    {
                      comment: (
                        <>
                          Indicates that no more entries or payloads will be
                          transmitted. Terminates the response.
                        </>
                      ),
                      tuple: true,
                      id: [
                        "Done",
                        "WtpResponseForRequestEntriesDone",
                      ],
                    },
                  ]}
                />
              </Pseudocode>
            </Hsection>

            <Hsection
              n="wtp_request_payload_slice"
              title={<Code>RequestPayloadSlice</Code>}
            >
              <P>
                The <R n="WtpRequestPayloadSlice" />{" "}
                messages let peers request a slice of the <R n="Payload" />{" "}
                of a specific <R n="Entry" />. <I>Specific</I> here{" "}
                means that not only its <R n="entry_namespace_id" />,{" "}
                <R n="entry_subspace_id" />, and <R n="entry_path" />{" "}
                are used to address it, but also its{" "}
                <R n="entry_payload_digest" />.
              </P>

              <Pseudocode n="wtp_defs_RequestPayloadSlice">
                <StructDef
                  comment={
                    <>
                      Request a verifiable Bab stream for a slice of the{" "}
                      <R n="Payload" /> of a specific <R n="Entry" />.
                    </>
                  }
                  id={[
                    "RequestPayloadSlice",
                    "WtpRequestPayloadSlice",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            Whether this message is assigned a{" "}
                            <R n="WtpMessageId" /> or not.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "has_id",
                            "WtpRequestPayloadSliceHasId",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            A valid <R n="WtpReadCapability" /> whose{" "}
                            <R n="access_receiver" /> is the{" "}
                            <R n="wtp_receiver" />{" "}
                            authenticated in the opening handshake
                            (<R n="ini_spk" /> for the <R n="pio_initiator" />,
                            {" "}
                            <R n="res_spk" /> for the{" "}
                            <R n="pio_responder" />), whose{" "}
                            <R n="granted_area" />{" "}
                            <R n="area_include">includes</R> the <R n="Entry" />
                            {" "}
                            whose <R n="Payload" /> (slice) is requested.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "read_capability",
                            "WtpRequestPayloadSliceReadCapability",
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
                            The <R n="entry_namespace_id" /> of the{" "}
                            <R n="Entry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "namespace_id",
                            "WtpRequestPayloadSliceNamespaceId",
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
                            The <R n="entry_subspace_id" /> of the{" "}
                            <R n="Entry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "subspace_id",
                            "WtpRequestPayloadSliceSubspaceId",
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
                            The <R n="entry_path" /> of the <R n="Entry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "path",
                            "WtpRequestPayloadSlicePath",
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
                            The <R n="entry_payload_digest" /> of the{" "}
                            <R n="Entry" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "payload_digest",
                            "WtpRequestPayloadSlicePayloadDigest",
                            "payload_digests",
                          ],
                          <R n="PayloadDigest" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The start index (in Bab chunks) of the slice to
                            request.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "start",
                            "WtpRequestPayloadSliceStart",
                            "starts",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The length (in Bab chunks) of the slice to request.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "length",
                            "WtpRequestPayloadSliceLength",
                            "lengths",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The value <Code>k</Code> for the Bab{" "}
                            <AE href="https://bab-hash.org/spec#kgrouped">
                              k-grouping
                            </AE>{" "}
                            to request for the verifiable slice stream.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "k",
                            "WtpRequestPayloadSliceK",
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
                            for the verifiable slice stream requested by this
                            message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "left_skip",
                            "WtpRequestPayloadSliceLeftSkip",
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
                            for the verifiable slice stream requested by this
                            message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "right_skip",
                            "WtpRequestPayloadSliceRightSkip",
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
              n="wtp_respond_to_request_payload_slice"
              title={<Code>RespondToRequestPayloadSlice</Code>}
            >
              <P>
                <Alj inline>TODO</Alj>
              </P>
            </Hsection>

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
                The <R n="WtpSendPayloadSlice" /> messages let peers transmit
                {" "}
                <AE href="https://bab-hash.org/spec#slice_streaming">
                  verifiable slice streams
                </AE>{" "}
                for (parts of){" "}
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
                      Transmit a Bab{" "}
                      <AE href="https://bab-hash.org/spec#slice_streaming">
                        verifiable
                      </AE>{" "}
                      (subslice of a){"  "}
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
                    {
                      commented: {
                        comment: (
                          <>
                            The start (in Bab chunks) of the slice to transmit.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "start",
                            "WtpSendPayloadSliceStart",
                            "starts",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The length (in Bab chunks) of the slice to transmit.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "length",
                            "WtpSendPayloadSliceLength",
                            "lengths",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The value <Code>k</Code> for the Bab{" "}
                            <AE href="https://bab-hash.org/spec#kgrouped">
                              k-grouping
                            </AE>{" "}
                            used in the verifiable slice stream transmitted in
                            this message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "k",
                            "WtpSendPayloadSliceK",
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
                            for the verifiable slice stream transmitted in this
                            message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "left_skip",
                            "WtpSendPayloadSliceLeftSkip",
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
                            for the verifiable slice stream transmitted in this
                            message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "right_skip",
                            "WtpSendPayloadSliceRightSkip",
                          ],
                          <R n="U8" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                When sent as a response, many of the fields can be derived from
                context and are thus omitted from the actual message encoding.
                <Alj inline>TODO</Alj>
              </P>
            </Hsection>

            <Hsection
              n="wtp_cancel_own_request"
              title={<Code>CancelOwnRequest</Code>}
            >
              <P>
                <Alj inline>TODO</Alj>
              </P>
            </Hsection>

            <Hsection
              n="wtp_regulate_appetite"
              title={<Code>RegulateAppetite</Code>}
            >
              <P>
                <Alj inline>TODO</Alj>
              </P>
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
