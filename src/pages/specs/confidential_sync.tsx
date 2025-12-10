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
import { Wip } from "macromania-wip";

export const confidential_sync = (
  <Dir name="confidential-sync">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow Confidential Sync"
        headingId="willow_confidential_sync"
        heading="Willow Confidential Sync"
        toc
        bibliography
        status="proposal"
        statusDate="21.11.2025"
        parentId="specifications"
      >
        <PreviewScope>
          <P>
            The <R n="data_model">Willow data model</R>{" "}
            specifies how to arrange data, but it does not prescribe how peers
            should synchronise data. In this document, we specify one possible
            way for performing synchronisation: the{" "}
            <Def n="confidential_sync" r="Confidential Sync">
              Willow Confidential Sync protocol
            </Def>. This document assumes familiarity with the{" "}
            <R n="data_model">Willow data model</R>.
          </P>
        </PreviewScope>

        <Hsection n="sync_intro" title="Introduction">
          <P>
            <Marginale inlineable>
              <Img
                src={<ResolveAsset asset={["sync", "syncing.png"]} />}
                alt={`An ornamental drawing of two Willow data stores. Each store is a three-dimensional space, alluding to the path/time/subspace visualisations in the data model specification. Within each data store, a box-shaped area is highlighted. Between these highlighted areas flows a bidirectional stream of documents. Alfie, Betty, and Dalton lounge around the drawing.`}
              />
            </Marginale>
            Confidential Sync aims to be appropriate for a variety of networking
            settings, particularly those of peer-to-peer systems where the
            replicating parties might not necessarily trust each other. Quite a
            bit of engineering went into the Confidential Sync protocol to
            satisfy the following requirements:
          </P>

          <Ul>
            <Li>
              Incremental sync: peers avoid redundant data transfer by detecting
              regions of common data with relatively sparse communication.
            </Li>
            <Li>
              Partial sync: peers synchronise only those regions of data they
              both care about, at sub-namespace granularity.
            </Li>
            <Li>
              Access control: conformant peers only hand out data if the request
              authorises its access.
            </Li>
            <Li>
              Private area overlap detection: peers can discover common
              interests without disclosing any non-shared information to each
              other.
            </Li>
            <Li>
              Resource control: peers communicate (and enforce) their
              computational resource limits so as not to overload each other.
            </Li>
            <Li>
              Transport independence: peers can communicate over arbitrary
              reliable, ordered, byte-oriented channels, whether tcp, quic, or
              unix pipe.
            </Li>
            <Li>
              General efficiency: peers can make use of efficient implementation
              techniques, and the overall bandwidth consumption stays low.
            </Li>
          </Ul>

          <P>
            Confidential Sync provides a shared vocabulary for peers to
            communicate with, but nothing more. It cannot and does not force
            peers to use it efficiently or to use the most efficient data
            structures internally. That is a feature! Implementations can start
            out with inefficient but simple implementation choices and later
            replace those with better-scaling ones. Throughout that evolution,
            the implementations stay compatible with any other implementation,
            regardless of its degree of sophistication.
          </P>
        </Hsection>

        <Hsection n="sync_concepts" title="Concepts">
          <P>
            Data synchronisation for Willow needs to solve a number of
            sub-problems, which we summarise in this section.
          </P>

          <Hsection
            n="sync_pii"
            title="Private Interest Overlap Detection"
            noToc
          >
            <P>
              Confidential Sync lets two peers determine which{" "}
              <Rs n="namespace" /> and <Rs n="Area" />{" "}
              therein they share an interest in, without leaking any data that
              only one of them wishes to synchronise. We explain the underlying
              {" "}
              <R n="private_interest_overlap">
                private interest overlap detection protocol here
              </R>. That protocol also covers read access control.
            </P>
          </Hsection>

          <Hsection n="sync_partial" title="Partial Synchronisation" noToc>
            <P>
              To synchronise data, peers specify any number of{" "}
              <Rs n="AreaOfInterest" />
              <Marginale>
                Note that peers need abide to the <R n="aoi_count" /> and{" "}
                <R n="aoi_size" /> limits of the <Rs n="AreaOfInterest" />{" "}
                only on a best-effort basis. Imagine Betty has just transmitted
                her 100 newest <Rs n="Entry" />{" "}
                to Alfie, only to then receive an even newer <R n="Entry" />
                {" "}
                from Gemma. Betty should forward that <R n="Entry" />{" "}
                to Alfie, despite that putting her total number of transmissions
                above the limit of 100.
              </Marginale>{" "}
              per <R n="namespace" />. The non-empty <Rs n="aoi_intersection" />
              {" "}
              of <Rs n="AreaOfInterest" /> from both peers contain the{" "}
              <Rs n="Entry" /> to synchronise.
            </P>

            <P>
              Confidential Sync synchronises these <Rs n="area_intersection" />
              {" "}
              via <R n="d3rbsr" />, a technique we{" "}
              <R n="d3_range_based_set_reconciliation">
                explain in detail here
              </R>.
            </P>
          </Hsection>

          <Hsection
            n="sync_post_sync_forwarding"
            title="Post-Reconciliation Forwarding"
            noToc
          >
            <P>
              After performing{" "}
              <R n="d3rbsr">set reconciliation</R>, peers might receive new{" "}
              <Rs n="Entry" /> that fall into their shared{" "}
              <Rs n="AreaOfInterest" />. Hence, Confidential Sync allows peers
              to transmit <Rs n="Entry" /> unsolicitedly.
            </P>
          </Hsection>

          <Hsection n="sync_payloads" title="Payload Transmission" noToc>
            <P>
              When a peer sends an{" "}
              <R n="Entry" />, it can choose whether to immediately transmit the
              corresponding <R n="Payload" /> as well. Peers exchange{" "}
              <Sidenote
                note={
                  <>
                    These preferences are not binding. The number of{" "}
                    <Rs n="aoi_intersection" /> between the peers’{" "}
                    <Rs n="AreaOfInterest" /> can be quadratic in the number of
                    {" "}
                    <Rs n="AreaOfInterest" />, and we do not want to mandate
                    keeping a quadratic amount of state.
                  </>
                }
              >
                preferences
              </Sidenote>{" "}
              for eager or lazy <R n="Payload" /> transmission based on{" "}
              <Rs n="entry_payload_length" /> for each{" "}
              <R n="aoi_intersection" />. These preferences are expressive
              enough to implement the plumtree
              algorithm<Bib item="leitao2007epidemic" />.
            </P>

            <P>
              Peers can further explicitly request the <Rs n="Payload" />{" "}
              of arbitrary <Rs n="Entry" /> (that they are allowed to access).
            </P>
          </Hsection>

          <Hsection
            n="sync_verified_streaming"
            title="Verified Payload Streaming"
            noToc
          >
            <P>
              If transmission of a <R n="Payload" />{" "}
              is cut short (say, because the internet connection drops), peers
              should be able to work with the data they had received so far. But
              this can only be done safely if they can verify that the data is
              indeed a prefix of the expected{" "}
              <R n="Payload" />. To enable this, Confidential Sync expects{" "}
              <R n="PayloadDigest" /> to be the digest of a{" "}
              <AE href="https://worm-blossom.github.io/bab/">
                Merkle-tree-based hash function
              </AE>.
            </P>
          </Hsection>

          <Hsection
            n="sync_resources"
            title="Resource Limits"
            noToc
          >
            <P>
              Multiplexing and management of shared state require peers to
              inform each other of their resource limits, lest one peer overload
              the other. We use a protocol-agnostic solution based on{" "}
              <Rs n="logical_channel" /> and <Rs n="resource_handle" />{" "}
              that we describe <R n="lcmux">here</R>.
            </P>
          </Hsection>
        </Hsection>

        <Hsection n="sync_parameters" title="Parameters">
          <P>
            <Marginale>
              See <R n="willow25" /> for a default recommendation of parameters.
            </Marginale>
            Confidential Sync is generic over specific cryptographic primitives.
            In order to use it, one must first specify a full suite of
            instantiations of the{" "}
            <R n="willow_parameters">
              parameters of the core Willow data model
            </R>, as well as the following parameters:
          </P>

          <PreviewScope>
            <P>
              <R n="private_interest_overlap">
                Access control and private interest overlap detection
              </R>{" "}
              require a type{" "}
              <DefType n="ReadCapability" rs="ReadCapabilities" /> of{" "}
              <Rs n="read_capability" />,<Marginale>
                We recommend the <R n="meadowcap" /> <Rs n="Capability" />{" "}
                with an <R n="cap_mode" /> of <R n="access_read" />{" "}
                as the type of <Rs n="ReadCapability" />.
              </Marginale>{" "}
              a type <DefType n="sync_receiver" r="Receiver" rs="Receivers" />
              {" "}
              of <Rs n="access_receiver" />, and a type{" "}
              <DefType n="EnumerationCapability" rs="EnumerationCapabilities" />
              {" "}
              of <Rs n="enumeration_capability" />
              <Marginale>
                We recommend the{" "}
                <R n="mc_enumeration_cap">meadowcap-compatible</R>{" "}
                <Rs n="McEnumerationCapability" /> as the type of{" "}
                <Rs n="EnumerationCapability" />.
              </Marginale>{" "}
              whose <Rs n="enumeration_receiver" /> are of type{" "}
              <R n="sync_receiver" />. We require a hash function{" "}
              <DefFunction n="sync_h" r="hash_interests" /> to hash salted{" "}
              <Rs n="PrivateInterest" /> to bytestrings of the fixed width{" "}
              <DefValue n="interest_hash_length" /> (the <R n="pio_h" />{" "}
              function from the{" "}
              <R n="private_interest_overlap">
                private area overlap detection sub-spec
              </R>). The handshake and encryption of the communication channel
              are out of scope of Confidential Sync,<Marginale>
                We recommend a handshake and subsequent encryption scheme{" "}
                <R n="handshake_and_encryption">here</R>.
              </Marginale>{" "}
              but the <R n="ini_pk" /> and <R n="res_pk" /> must be of type{" "}
              <R n="sync_receiver" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <R n="d3_range_based_set_reconciliation">
                3d range-based set reconciliation
              </R>{" "}
              requires a type <DefType n="Fingerprint" rs="Fingerprints" /> of
              {" "}
              <Rs n="d3rbsr_fp" /> (i.e., of hashes of{" "}
              <Rs n="LengthyAuthorisedEntry" />), and a hash function{" "}
              <DefFunction n="hash_lengthy_authorised_entries" />{" "}
              from finite sets of <Rs n="LengthyAuthorisedEntry" /> to{" "}
              <R n="Fingerprint" />.
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
              <DefFunction n="transform_payload" /> that maps a{" "}
              <R n="Payload" /> into a sequence of up to{" "}
              <M>
                2^<Curly>64</Curly> - 1
              </M>{" "}
              bytestrings, called the transformed{" "}
              <DefType n="Chunk" rs="Chunks">Chunks</DefType>. The number and
              lengths of the <Rs n="Chunk" />{" "}
              must be fully determined by the length of the{" "}
              <R n="Payload" />, the actual values of the bytes of the{" "}
              <R n="Payload" /> must not affect the number and length of the
              {" "}
              <R n="Chunk" />.<Marginale>
                To give an example of how this construction maps to verifiable
                streaming: <R n="transform_payload" /> could map a{" "}
                <R n="Payload" /> to a{" "}
                <AE href="https://worm-blossom.github.io/bab/#baseline">
                  Bab baseline verifiable stream
                </AE>.
              </Marginale>{" "}
              Peers exchange concatenations of <Rs n="Chunk" />{" "}
              instead of actual payloads, and communicate offsets in that data
              in terms of <R n="Chunk" /> offsets.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Finally, we require a <R n="NamespaceId" />{" "}
              <DefValue
                n="sync_default_namespace_id"
                r="default_namespace_id"
              />, a <R n="SubspaceId" />{" "}
              <DefValue n="sync_default_subspace_id" r="default_subspace_id" />,
              a <R n="PayloadDigest" />{" "}
              <DefValue
                n="sync_default_payload_digest"
                r="default_payload_digest"
              />, and an <R n="AuthorisationToken" />{" "}
              <DefValue
                n="sync_default_authorisation_token"
                r="default_authorisation_token"
              />{" "}
              which <R n="is_authorised_write">authorises</R>{" "}
              <Code>
                <R n="default_entry" />(<R n="sync_default_namespace_id" />,
                {" "}
                <R n="sync_default_subspace_id" />,{" "}
                <R n="sync_default_payload_digest" />)
              </Code>.
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection n="sync_protocol" title="Protocol">
          <P>
            The protocol is message-based. To break symmetry, we refer to the
            peer that initiated the synchronisation session as{" "}
            <Def
              n="alfie"
              r="Alfie"
              preview={
                <>
                  <P>
                    <Def fake n="alfie">Alfie</Def>{" "}
                    refers to the peer that initiated a Confidential Sync
                    session. We use this terminology to break symmetry in the
                    protocol.
                  </P>
                </>
              }
            />, and the other peer as{" "}
            <Def
              n="betty"
              r="Betty"
              preview={
                <>
                  <P>
                    <Def fake n="betty">Betty</Def>{" "}
                    refers to the peer that accepted a Confidential Sync
                    session. We use this terminology to break symmetry in the
                    protocol.
                  </P>
                </>
              }
            />.
          </P>

          <P>
            Peers might receive invalid messages, both syntactically (i.e.,
            invalid encodings) and semantically (i.e., logically inconsistent
            messages). In both cases, the peer to detect this behaviour must
            abort the sync session. We indicate such situations by writing that
            something{" "}
            <Quotes>is an error</Quotes>. Any message that refers to a fully
            freed resource handle is an error. More generally, whenever we state
            that a message must fulfil some criteria, but a peer receives a
            message that does not fulfil these criteria, that is an error.
          </P>

          <P>
            Confidential Sync is a purely message-based protocol, built on top
            of <R n="lcmux" />. Both peers act as an{" "}
            <R n="lcmux_c">LCMUX client</R> and an{" "}
            <R n="lcmux_s">LCMUX server</R>{" "}
            simultaneously. There are several kinds of messages, which the peers
            create, encode as byte strings, and then transmit via LCMUX{" "}
            <Rs n="SendChannelFrame" /> and <Rs n="SendGlobalFrame" />.
          </P>

          <P>
            The messages make use of the following <Rs n="resource_handle" />:
          </P>

          <Pseudocode n="sync_handle_defs">
            <Enum
              comment={
                <>
                  The different <Rs n="resource_handle" /> employed by the{" "}
                  <R n="confidential_sync" />.
                </>
              }
              id={[
                "HandleType",
                "HandleType",
                "HandleTypes",
              ]}
              variants={[
                {
                  tuple: true,
                  id: [
                    "OverlapHandle",
                    "OverlapHandle",
                    "OverlapHandles",
                  ],
                  comment: (
                    <>
                      <Rb n="resource_handle" />{" "}
                      for the hash-boolean pairs transmitted during{" "}
                      <R n="pio_pio">private interest overlap detection</R>.
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "ReadCapabilityHandle",
                    "ReadCapabilityHandle",
                    "CapabilityHandles",
                  ],
                  comment: (
                    <>
                      <Rb n="resource_handle" /> for <Rs n="ReadCapability" />
                      {" "}
                      that certify access to some <Rs n="Entry" />.
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "PayloadRequestHandle",
                    "PayloadRequestHandle",
                    "PayloadRequestHandles",
                  ],
                  comment: (
                    <>
                      <Rb n="resource_handle" />{" "}
                      for explicitly requesting (parts of) <Rs n="Payload" />
                      {" "}
                      beyond what is exchanged automatically.
                    </>
                  ),
                },
              ]}
            />
          </Pseudocode>

          <P>
            The messages are divided across the following{" "}
            <Rs n="logical_channel" />:
          </P>

          <Pseudocode n="sync_channel_defs">
            <Enum
              comment={
                <>
                  The different <Rs n="logical_channel" /> employed by the{" "}
                  <R n="confidential_sync" />.
                </>
              }
              id={[
                "LogicalChannel",
                "LogicalChannel",
                "LogicalChannels",
              ]}
              variants={[
                {
                  tuple: true,
                  id: [
                    "ReconciliationChannel",
                    "ReconciliationChannel",
                    "ReconciliationChannels",
                  ],
                  comment: (
                    <>
                      <Rb n="logical_channel" /> for performing{" "}
                      <R n="d3rbsr" />.{" "}
                      <R n="SendChannelFrameChannel">Channel id</R>:{" "}
                      <M post=".">0</M>
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "DataChannel",
                    "DataChannel",
                    "DataChannels",
                  ],
                  comment: (
                    <>
                      <Rb n="logical_channel" /> for transmitting{" "}
                      <Rs n="Entry" /> and <Rs n="Payload" /> outside of{" "}
                      <R n="d3rbsr" />.{" "}
                      <R n="SendChannelFrameChannel">Channel id</R>:{" "}
                      <M post=".">1</M>
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "OverlapChannel",
                    "OverlapChannel",
                    "OverlapChannels",
                  ],
                  comment: (
                    <>
                      <Rb n="logical_channel" /> for controlling the{" "}
                      <R n="handle_bind">binding</R> of new{" "}
                      <Rs n="OverlapHandle" />.{" "}
                      <R n="SendChannelFrameChannel">Channel id</R>:{" "}
                      <M post=".">2</M>
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "CapabilityChannel",
                    "CapabilityChannel",
                    "CapabilityChannels",
                  ],
                  comment: (
                    <>
                      <Rb n="logical_channel" /> for controlling the{" "}
                      <R n="handle_bind">binding</R> of new{" "}
                      <Rs n="ReadCapabilityHandle" />.{" "}
                      <R n="SendChannelFrameChannel">Channel id</R>:{" "}
                      <M post=".">3</M>
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "PayloadRequestChannel",
                    "PayloadRequestChannel",
                    "PayloadRequestChannels",
                  ],
                  comment: (
                    <>
                      <Rb n="logical_channel" /> for controlling the{" "}
                      <R n="handle_bind">binding</R> of new{" "}
                      <Rs n="PayloadRequestHandle" />.{" "}
                      <R n="SendChannelFrameChannel">Channel id</R>:{" "}
                      <M post=".">4</M>
                    </>
                  ),
                },
              ]}
            />
          </Pseudocode>

          <Hsection n="sync_messages" title="Messages">
            <P>
              We now define the different kinds of messages.
            </P>

            <Hsection
              n="sync_pio_messages"
              title="Private Interest Overlap"
            >
              <P>
                In{" "}
                <R n="private_interest_overlap">
                  private interest overlap detection
                </R>, the two peers privately determine which{" "}
                <Rs n="PrivateInterest" />{" "}
                they share, and prove read access for those interests.
              </P>

              <Hsection
                n="sync_msg_PioBindHash"
                title={<Code>PioBindHash</Code>}
                noToc
              >
                <P>
                  The <R n="PioBindHash" /> messages let peers bind hashes of
                  {" "}
                  <Rs n="PrivateInterest" /> for later reference during{" "}
                  <R n="private_interest_overlap">
                    private interest overlap detection
                  </R>, as explained <R n="pio_pio">here</R>.
                </P>

                <Pseudocode n="sync_defs_PioBindHash">
                  <StructDef
                    comment={
                      <>
                        <Rb n="handle_bind" /> data to an{" "}
                        <R n="OverlapHandle" /> for performing{" "}
                        <R n="private_interest_overlap">
                          private interest overlap detection
                        </R>.
                      </>
                    }
                    id={["PioBindHash", "PioBindHash"]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The result of applying <R n="sync_h" /> to a{" "}
                              <R n="PrivateInterest" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            ["hash", "PioBindHashHash", "hashes"],
                            <ArrayType
                              count={<R n="interest_hash_length" />}
                            >
                              <R n="U8" />
                            </ArrayType>,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              Whether the peer is directly interested in the
                              hashed{" "}
                              <R n="PrivateInterest" />, or whether it is merely
                              a <R n="pi_relaxation" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "actually_interested",
                              "PioBindHashActuallyInterested",
                            ],
                            <R n="Bool" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="PioBindHash" /> messages use the{" "}
                  <R n="OverlapChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_PioAnnounceOverlap"
                title={<Code>PioAnnounceOverlap</Code>}
                noToc
              >
                <P>
                  The <R n="PioAnnounceOverlap" /> messages let peers send{" "}
                  <Rs n="overlap_announcement" />.
                </P>

                <Pseudocode n="sync_defs_PioAnnounceOverlap">
                  <StructDef
                    comment={
                      <>
                        Send an <R n="overlap_announcement" />, including its
                        {" "}
                        <R n="announcement_authentication" /> and an optional
                        {" "}
                        <R n="enumeration_capability" />.
                      </>
                    }
                    id={["PioAnnounceOverlap", "PioAnnounceOverlap"]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="OverlapHandle" />{" "}
                              (<R n="handle_bind">bound</R> by the{" "}
                              <Em>sender</Em>{" "}
                              of this message) which is part of the overlap. If
                              there are two handles available, use the one that
                              was bound with{" "}
                              <Code>
                                <R n="PioBindHashActuallyInterested" /> == true
                              </Code>.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "sender_handle",
                              "PioAnnounceOverlapSenderHandle",
                              "sender_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="OverlapHandle" />{" "}
                              (<R n="handle_bind">bound</R> by the{" "}
                              <Em>receiver</Em>{" "}
                              of this message) which is part of the overlap. If
                              there are two handles available, use the one that
                              was bound with{" "}
                              <Code>
                                <R n="PioBindHashActuallyInterested" /> == true
                              </Code>.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "receiver_handle",
                              "PioAnnounceOverlapReceiverHandle",
                              "receiver_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="announcement_authentication" /> for this
                              {" "}
                              <R n="overlap_announcement" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "authentication",
                              "PioAnnounceOverlapAuthentication",
                              "authentications",
                            ],
                            <ArrayType
                              count={<R n="interest_hash_length" />}
                            >
                              <R n="U8" />
                            </ArrayType>,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="enumeration_capability" /> if this{" "}
                              <R n="overlap_announcement" /> is for an{" "}
                              <R n="pi_awkward" /> pair, or{" "}
                              <DefVariant n="enum_cap_none" r="none" />{" "}
                              otherwise.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "enumeration_capability",
                              "PioAnnounceOverlapEnumerationCapability",
                              "enumeration_capabilitys",
                            ],
                            <ChoiceType
                              types={[
                                <R n="EnumerationCapability" />,
                                <R n="enum_cap_none" />,
                              ]}
                            />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="PioAnnounceOverlap" /> messages are{" "}
                  <Rs n="global_message" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_PioBindReadCapability"
                title={<Code>PioBindReadCapability</Code>}
                noToc
              >
                <P>
                  The <R n="PioBindReadCapability" />{" "}
                  messages let peers transmit <Rs n="read_capability" />{" "}
                  for overlaps between{" "}
                  <Rs n="PrivateInterest" />. These messages simultaneously
                  declare <Rs n="AreaOfInterest" />{" "}
                  for reconciliation, using the <R n="granted_namespace" /> and
                  {" "}
                  <R n="granted_area" /> of the bound <R n="read_capability" />
                  {" "}
                  and a <R n="aoi_count" /> and <R n="aoi_size" />{" "}
                  which are explicitly specified in the message. Further, these
                  messages declare a maximum size for eager payload
                  transmissions within the <R n="AreaOfInterest" />: when an
                  {" "}
                  <R n="aoi_include">included</R> <R n="Entry" />’s{" "}
                  <R n="entry_payload_length" /> is strictly greater than the
                  {" "}
                  indicated size, its <R n="Payload" />{" "}
                  may only be transmitted when explicitly requested.
                </P>

                <Pseudocode n="sync_defs_PioBindReadCapability">
                  <StructDef
                    comment={
                      <>
                        <Rb n="handle_bind" /> a <R n="read_capability" />{" "}
                        for an overlap between two{" "}
                        <Rs n="PrivateInterest" />. Additionally, this message
                        specifies an <R n="AreaOfInterest" />{" "}
                        which the sender wants to sync.
                      </>
                    }
                    id={["PioBindReadCapability", "PioBindReadCapability"]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="OverlapHandle" />{" "}
                              (<R n="handle_bind">bound</R> by the{" "}
                              <Em>sender</Em>{" "}
                              of this message) which is part of the overlap. If
                              there are two handles available, use the one that
                              was bound with{" "}
                              <Code>
                                <R n="PioBindHashActuallyInterested" /> == true
                              </Code>.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "sender_handle",
                              "PioBindReadCapabilitySenderHandle",
                              "sender_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="OverlapHandle" />{" "}
                              (<R n="handle_bind">bound</R> by the{" "}
                              <Em>receiver</Em>{" "}
                              of this message) which is part of the overlap. If
                              there are two handles available, use the one that
                              was bound with{" "}
                              <Code>
                                <R n="PioBindHashActuallyInterested" /> == true
                              </Code>.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "receiver_handle",
                              "PioBindReadCapabilityReceiverHandle",
                              "receiver_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="ReadCapability" /> to{" "}
                              <R n="handle_bind" />. Its{" "}
                              <R n="granted_namespace" /> must be the (shared)
                              {" "}
                              <R n="pi_ns" /> of the two{" "}
                              <Rs n="PrivateInterest" />. Its{" "}
                              <R n="granted_area" /> must be{" "}
                              <R n="pi_include_area">included in</R> the{" "}
                              <R n="pi_more_specific">less specific</R>{" "}
                              of the two <Rs n="PrivateInterest" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "capability",
                              "PioBindReadCapabilityCapability",
                              "capabilities",
                            ],
                            <R n="ReadCapability" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="aoi_count" /> of the{" "}
                              <R n="AreaOfInterest" />{" "}
                              that the sender wants to sync.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "max_count",
                              "PioBindReadCapabilityMaxCount",
                              "max_counts",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="aoi_size" /> of the{" "}
                              <R n="AreaOfInterest" />{" "}
                              that the sender wants to sync.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "max_size",
                              "PioBindReadCapabilityMaxSize",
                              "max_sizes",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <PreviewScope>
                              When the receiver of this message eagerly
                              transmits <Rs n="Entry" /> for the{" "}
                              <R n="AreaOfInterest" />{" "}
                              defined by this message, it must not include the
                              {" "}
                              <R n="Payload" /> of <Rs n="Entry" /> whose{" "}
                              <R n="entry_payload_length" />{" "}
                              is strictly greater than two to the power of the
                              {" "}
                              <R n="PioBindReadCapabilityMaxPayloadPower" />. We
                              call the resulting number the sender’s{" "}
                              <DefValue
                                n="peer_max_payload_size"
                                r="maximum payload size"
                              />{" "}
                              for this <R n="AreaOfInterest" />.
                            </PreviewScope>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "max_payload_power",
                              "PioBindReadCapabilityMaxPayloadPower",
                              "max_payload_powers",
                            ],
                            <R n="U8" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  It is an error when <R n="alfie" /> sends a{" "}
                  <R n="PioBindReadCapabilityCapability" /> whose{" "}
                  <R n="access_receiver" /> is not{" "}
                  <R n="ini_pk" />. Likewise, it is an error when{" "}
                  <R n="betty" /> sends a{" "}
                  <R n="PioBindReadCapabilityCapability" /> whose{" "}
                  <R n="access_receiver" /> is not <R n="res_pk" />.
                </P>

                <P>
                  To avoid duplicate <R n="d3rbsr" /> sessions for the same{" "}
                  <Rs n="Area" />, only <R n="alfie" />{" "}
                  should react to sending or receiving{" "}
                  <R n="PioBindReadCapability" />{" "}
                  messages by initiating set reconciliation. <Rb n="betty" />
                  {" "}
                  should never initiate reconciliation — unless she considers
                  the redundant bandwidth consumption of duplicate
                  reconciliation less of an issue than having to wait for{" "}
                  <R n="alfie" /> to initiate reconciliation.
                </P>

                <P>
                  <Rb n="PioBindReadCapability" /> messages use the{" "}
                  <R n="CapabilityChannel" />.
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_reconciliation" title="Reconciliation">
              <P>
                We employ{" "}
                <R n="d3_range_based_set_reconciliation">
                  3d range-based set reconciliation
                </R>{" "}
                to synchronise the data of the peers. Our{" "}
                <R n="ReconciliationSendFingerprint" />{" "}
                messages serve to transmit{" "}
                <Rs n="D3RangeFingerprint" />; they run on the dedicated{" "}
                <R n="ReconciliationChannel" />{" "}
                to help bounded-memory implementations of{" "}
                <R n="d3_range_based_set_reconciliation">
                  range-based set reconciliation
                </R>{" "}
                gauge how much buffer space is still available.
              </P>

              <P>
                For <Rs n="D3RangeEntrySet" /> transmission{" "}
                we need four different message type, in order to keep things
                streaming, interleavable, and adaptable to store mutation that
                happens concurrently to syncing.{" "}
                <R n="ReconciliationAnnounceEntries" /> messages announce a{" "}
                <R n="D3Range" /> whose <Rs n="Entry" />{" "}
                will be transmitted. For each <R n="Entry" /> in the{" "}
                <R n="D3Range" />, the peer must then transmit its data. This
                begins with a <R n="ReconciliationSendEntry" />{" "}
                message to transmit the <R n="Entry" />{" "}
                without its payload, followed by many (possibly zero){" "}
                <R n="ReconciliationSendPayload" />{" "}
                messages to transmit consecutive chunks of the payload, and
                terminated by exactly one{" "}
                <R n="ReconciliationTerminatePayload" /> message for the{" "}
                <R n="Entry" />. Peers neither preannounce<Marginale>
                  This is a feature; otherwise syncing concurrently to data
                  insertion (possibly from other sync sessions) would be a
                  nightmare to implement.
                </Marginale>{" "}
                how many <Rs n="Entry" /> they will send in each{" "}
                <R n="D3Range" />, nor how many <R n="Payload" />{" "}
                bytes they will transmit in total per <R n="Entry" />.
              </P>

              <P>
                There is a second concern spanning multiple of the
                reconciliation messages: peers should know when to proceed from
                {" "}
                <R n="d3_range_based_set_reconciliation" /> to{" "}
                <R n="sync_post_sync_forwarding">eager forwarding</R> of new
                {" "}
                <Rs n="Entry" />. Roughly speaking, Confidential Sync supports
                this by annotating <R n="ReconciliationSendFingerprint" /> and
                {" "}
                <R n="ReconciliationAnnounceEntries" />{" "}
                messages which an id for the original <Quotes>root</Quotes>{" "}
                <R n="D3Range" />{" "}
                which the two peers are actually syching. Peers can track a
                counter per root <R n="D3Range" />, incrementing for{" "}
                <R n="ReconciliationSendFingerprint" />{" "}
                messages and decrementing for{" "}
                <R n="ReconciliationAnnounceEntries" />. Once the counter
                reaches zero, a peer knows that all <Rs n="Entry" /> in the root
                {" "}
                <R n="D3Range" /> have been synchronised.
              </P>

              <PreviewScope>
                <P>
                  To this end, we (implicitly) assign an id to certain messages
                  through the following mechanism: each peer tracks two numbers,
                  {" "}
                  <DefValue n="alfies_range_counter" /> and{" "}
                  <DefValue n="betties_range_counter" />, initialised to{" "}
                  <M>1</M> and <M>2</M> respectively.{" "}
                  <R n="ReconciliationAnnounceEntries" /> and{" "}
                  <R n="ReconciliationSendFingerprint" />{" "}
                  messages include an optional{" "}
                  <R n="RangeInfoRootId" />. Setting that value to{" "}
                  <R n="root_id_none" /> indicates that the message is a{" "}
                  <Def n="root_message" r="root message" rs="root messages" />
                  {" "}
                  — this should be done when peers initiate reconciliation for a
                  {" "}
                  <R n="D3Range" />{" "}
                  because they detected an overlap of interests, but not when
                  they send a message in response to another reconciliation
                  message.{" "}
                  <Sidenote
                    note={
                      <>
                        Both peers assign the same values to the same messages.
                      </>
                    }
                  >
                    The
                  </Sidenote>{" "}
                  <Def
                    n="root_message_id"
                    r="root message id"
                    rs="root message ids"
                  />{" "}
                  of that message is the current value of{" "}
                  <R n="alfies_range_counter" /> (if <R n="alfie" />{" "}
                  sent the message) or of <R n="betties_range_counter" /> (if
                  {" "}
                  <R n="betty" />{" "}
                  sent the message). After sending or receiving such a message
                  and assigning the{" "}
                  <R n="root_message_id" />, the corresponding range counter is
                  increased by two.
                </P>

                <P>
                  When a peer responds to a reconciliation message with one or
                  more reciprocal reconciliation messages, these responses
                  should set their <R n="RangeInfoRootId" /> to the{" "}
                  <R n="root_message_id" />{" "}
                  they pertain to. With this information, peers can track easily
                  whether any root range has been fully reconciled yet or
                  not.<Marginale>
                    A malicious peer might set <R n="RangeInfoRootId" />{" "}
                    fields to incorrect values. Implementations should ensure
                    that the only impact of such malicious behavior is
                    incomplete syncing with that particular peer.
                  </Marginale>
                </P>
              </PreviewScope>

              <P>
                For ease of presentation, we bundle the{" "}
                <R n="RangeInfoRootId" /> and other fields shared between{" "}
                <R n="ReconciliationSendFingerprint" /> and{" "}
                <R n="ReconciliationAnnounceEntries" /> messages into a struct:
              </P>

              <Pseudocode n="sync_defs_RangeInfo">
                <StructDef
                  comment={
                    <>
                      The data shared between{" "}
                      <R n="ReconciliationSendFingerprint" /> and{" "}
                      <R n="ReconciliationAnnounceEntries" /> messages.
                    </>
                  }
                  id={[
                    "RangeInfo",
                    "RangeInfo",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            Indicates the <R n="root_message_id" /> of the prior
                            {" "}
                            <R n="root_message" />{" "}
                            this message refers to (when set to a non-zero{" "}
                            <R n="U64" />), or indicates that this message{" "}
                            <Em>is</Em> a fresh <R n="root_message" />{" "}
                            itself (when set to{" "}
                            <DefVariant n="root_id_none" r="none" />).
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "root_id",
                            "RangeInfoRootId",
                            "root_ids",
                          ],
                          <ChoiceType
                            types={[<R n="U64" />, <R n="root_id_none" />]}
                          />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The <R n="D3Range" /> the message pertains to.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "range",
                            "RangeInfoRange",
                            "ranges",
                          ],
                          <R n="D3Range" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            A <R n="ReadCapabilityHandle" />{" "}
                            <R n="handle_bind">bound</R> by the <Em>sender</Em>
                            {" "}
                            of this message. The <R n="granted_area" />{" "}
                            of the corresponding <R n="read_capability" />{" "}
                            must fully contain the <R n="RangeInfoRange" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "sender_handle",
                            "RangeInfoSenderHandle",
                            "sender_handles",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            A <R n="ReadCapabilityHandle" />{" "}
                            <R n="handle_bind">bound</R> by the{" "}
                            <Em>receiver</Em> of this message. The{" "}
                            <R n="granted_area" /> of the corresponding{" "}
                            <R n="read_capability" /> must fully contain the
                            {" "}
                            <R n="RangeInfoRange" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "receiver_handle",
                            "RangeInfoReceiverHandle",
                            "receiver_handles",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>

              <PreviewScope>
                <P>
                  Finally, to map transmitted <Rs n="Chunk" /> of{" "}
                  <Rs n="Payload" /> to their{" "}
                  <Rs n="Entry" />, each peer maintains a piece of state, an
                  {" "}
                  <R n="AuthorisedEntry" /> called its{" "}
                  <DefValue n="reconciliation_current_entry" />. It is
                  initialised to the pair of{"  "}
                  <Code>
                    <R n="default_entry" />(<R n="sync_default_namespace_id" />,
                    {" "}
                    <R n="sync_default_subspace_id" />,{" "}
                    <R n="sync_default_payload_digest" />)
                  </Code>{" "}
                  and the{" "}
                  <R n="sync_default_authorisation_token" />. Upon receiving a
                  {" "}
                  <R n="ReconciliationSendEntry" /> message, a peer sets its
                  {" "}
                  <R n="reconciliation_current_entry" /> to the received{" "}
                  <R n="ReconciliationSendEntryEntry" />.
                </P>
              </PreviewScope>

              <Hsection
                n="sync_msg_ReconciliationSendFingerprint"
                title={<Code>ReconciliationSendFingerprint</Code>}
                noToc
              >
                <P>
                  The <R n="ReconciliationSendFingerprint" />{" "}
                  messages let peers transmit <Rs n="D3RangeFingerprint" />{" "}
                  for range-based set reconciliation.
                </P>

                <Pseudocode n="sync_defs_ReconciliationSendFingerprint">
                  <StructDef
                    comment={
                      <>
                        Send a <R n="Fingerprint" /> as part of{" "}
                        <R n="d3rbsr" />.
                      </>
                    }
                    id={[
                      "ReconciliationSendFingerprint",
                      "ReconciliationSendFingerprint",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="RangeInfo" /> for this message.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "info",
                              "ReconciliationSendFingerprintInfo",
                              "info",
                            ],
                            <R n="RangeInfo" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="Fingerprint" /> of all{" "}
                              <Rs n="LengthyAuthorisedEntry" /> the peer has in
                              {"  "}
                              <AccessStruct field="RangeInfoRange">
                                <R n="ReconciliationSendFingerprintInfo" />
                              </AccessStruct>.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "fingerprint",
                              "ReconciliationSendFingerprintFingerprint",
                              "fingerprint",
                            ],
                            <R n="Fingerprint" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="ReconciliationSendFingerprint" /> messages use the{" "}
                  <R n="ReconciliationChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_ReconciliationAnnounceEntries"
                title={<Code>ReconciliationAnnounceEntries</Code>}
                noToc
              >
                <P>
                  The <R n="ReconciliationAnnounceEntries" />{" "}
                  messages let peers begin transmission of their{" "}
                  <Rs n="LengthyAuthorisedEntry" /> in a <R n="D3Range" />{" "}
                  for range-based set reconciliation.
                </P>

                <Pseudocode n="sync_defs_ReconciliationAnnounceEntries">
                  <StructDef
                    comment={
                      <>
                        Prepare transmission of the{" "}
                        <Rs n="LengthyAuthorisedEntry" /> a peer has in a{" "}
                        <R n="D3Range" /> as part of <R n="d3rbsr" />.
                      </>
                    }
                    id={[
                      "ReconciliationAnnounceEntries",
                      "ReconciliationAnnounceEntries",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="RangeInfo" /> for this message.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "info",
                              "ReconciliationAnnounceEntriesInfo",
                              "info",
                            ],
                            <R n="RangeInfo" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              Must be <Code>true</Code>{" "}
                              if and only if the the sender has zero{" "}
                              <Rs n="Entry" /> in{"  "}
                              <AccessStruct field="RangeInfoRange">
                                <R n="ReconciliationAnnounceEntriesInfo" />
                              </AccessStruct>.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "is_empty",
                              "ReconciliationAnnounceEntriesIsEmpty",
                            ],
                            <R n="Bool" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              A boolean flag to indicate whether the sender
                              wishes to receive a{" "}
                              <R n="ReconciliationAnnounceEntries" />{" "}
                              message for the same <R n="D3Range" /> in return.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "want_response",
                              "ReconciliationAnnounceEntriesWantResponse",
                            ],
                            <R n="Bool" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              Whether the sender promises to send the{" "}
                              <Rs n="Entry" /> in{"  "}
                              <AccessStruct field="RangeInfoRange">
                                <R n="ReconciliationAnnounceEntriesInfo" />
                              </AccessStruct>{" "}
                              sorted ascendingly by <R n="entry_subspace_id" />
                              {" "}
                              , using <Rs n="entry_path" />{" "}
                              (sorted lexicographically) as the tiebreaker.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "will_sort",
                              "ReconciliationAnnounceEntriesWillSort",
                            ],
                            <R n="Bool" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  Actual transmission of the announced{" "}
                  <Rs n="LengthyAuthorisedEntry" /> in{" "}
                  <AccessStruct field="RangeInfoRange">
                    <R n="ReconciliationAnnounceEntriesInfo" />
                  </AccessStruct>{" "}
                  happens via <R n="ReconciliationSendEntry" /> messages.
                </P>

                <P>
                  Promising (and then fulfilling) sorted transmission via the
                  {" "}
                  <R n="ReconciliationAnnounceEntriesWillSort" />{" "}
                  enables the receiver to determine which of its own{" "}
                  <Rs n="Entry" />{" "}
                  it can omit from a reply in constant space. For unsorted{" "}
                  <Rs n="Entry" />, receivers that cannot allocate a linear
                  amount of memory have to resort to possibly redundant{" "}
                  <R n="Entry" /> transmissions to uphold the correctness of
                  {" "}
                  <R n="d3rbsr" />.
                </P>

                <P>
                  <Rb n="ReconciliationAnnounceEntries" /> messages use the{" "}
                  <R n="DataChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_ReconciliationSendEntry"
                title={<Code>ReconciliationSendEntry</Code>}
                noToc
              >
                <P>
                  The <R n="ReconciliationSendEntry" />{" "}
                  messages let peers transmit <Rs n="LengthyAuthorisedEntry" />
                  {" "}
                  for range-based set reconciliation. Receiving a{" "}
                  <R n="ReconciliationSendEntry" /> sets the receiver’s{" "}
                  <R n="reconciliation_current_entry" />.
                </P>

                <Pseudocode n="sync_defs_ReconciliationSendEntry">
                  <StructDef
                    comment={
                      <>
                        Send a <R n="LengthyAuthorisedEntry" /> as part of{" "}
                        <R n="d3rbsr" />.
                      </>
                    }
                    id={[
                      "ReconciliationSendEntry",
                      "ReconciliationSendEntry",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="LengthyAuthorisedEntry" /> itself.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "entry",
                              "ReconciliationSendEntryEntry",
                              "entry",
                            ],
                            <R n="LengthyAuthorisedEntry" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The index of the first (<R n="transform_payload">
                                transformed
                              </R>) <R n="Payload" /> <R n="Chunk" />{" "}
                              that will be transmitted for{" "}
                              <R n="ReconciliationSendEntryEntry" />. If you
                              will not transmit any{" "}
                              <Rs n="Chunk" />, this can be set arbitrarily
                              (zero is a good choice).
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "offset",
                              "ReconciliationSendEntryOffset",
                              "offsets",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="ReconciliationSendEntry" /> messages use the{" "}
                  <R n="DataChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_ReconciliationSendPayload"
                title={<Code>ReconciliationSendPayload</Code>}
                noToc
              >
                <P>
                  The <R n="ReconciliationSendPayload" />{" "}
                  messages let peers transmit (successive parts of) the
                  concatenation of the <R n="transform_payload">transformed</R>
                  {" "}
                  <Rs n="Payload" /> of the receiver’s{" "}
                  <R n="reconciliation_current_entry" />{" "}
                  immediately during range-based set reconciliation. The sender
                  can freely decide how many (including zero) <Rs n="Chunk" />
                  {" "}
                  to eargerly transmit.
                </P>

                <Pseudocode n="sync_defs_ReconciliationSendPayload">
                  <StructDef
                    comment={
                      <>
                        Send some <Rs n="Chunk" /> as part of <R n="d3rbsr" />.
                      </>
                    }
                    id={[
                      "ReconciliationSendPayload",
                      "ReconciliationSendPayload",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The number of transmitted <Rs n="Chunk" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "amount",
                              "ReconciliationSendPayloadAmount",
                              "amounts",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The bytes to transmit, the concatenation of the
                              {" "}
                              <Rs n="Chunk" /> obtained by applying{" "}
                              <R n="transform_payload" /> to the{" "}
                              <R n="Payload" /> of the receiver’s{" "}
                              <R n="reconciliation_current_entry" />, starting
                              at the <R n="ReconciliationSendEntryOffset" />
                              {" "}
                              of the corresponding{" "}
                              <R n="ReconciliationSendEntry" />{" "}
                              message plus the number of <Rs n="Chunk" />{" "}
                              for the current <R n="Entry" />{" "}
                              that were already transmitted by prior{" "}
                              <R n="ReconciliationSendPayload" /> messages.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "bytes",
                              "ReconciliationSendPayloadBytes",
                              "bytes",
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

                <P>
                  <Rb n="ReconciliationSendPayload" /> messages use the{" "}
                  <R n="DataChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_ReconciliationTerminatePayload"
                title={<Code>ReconciliationTerminatePayload</Code>}
                noToc
              >
                <P>
                  The <R n="ReconciliationTerminatePayload" />{" "}
                  messages let peers indicate that they will not send more
                  payload bytes for the current <R n="Entry" />{" "}
                  as part of set reconciliation. The messages further indicate
                  whether more <Rs n="LengthyAuthorisedEntry" />{" "}
                  will follow for the current <R n="D3Range" />.
                </P>

                <Pseudocode n="sync_defs_ReconciliationTerminatePayload">
                  <StructDef
                    comment={
                      <>
                        Signal the end of the current
                        <R n="Payload" /> transmission as part of{" "}
                        <R n="d3rbsr" />, and indicate whether another{" "}
                        <R n="LengthyAuthorisedEntry" />{" "}
                        transmission will follow for the current{" "}
                        <R n="D3Range" />.
                      </>
                    }
                    id={[
                      "ReconciliationTerminatePayload",
                      "ReconciliationTerminatePayload",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              Setting this to <Code>true</Code>{" "}
                              indicates that no further{" "}
                              <R n="ReconciliationSendEntry" />{" "}
                              message will be sent as part of reconciling the
                              current <R n="D3Range" />. This
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "is_final",
                              "ReconciliationTerminatePayloadFinal",
                              "is_final",
                            ],
                            <R n="Bool" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="ReconciliationTerminatePayload" /> messages use the
                  {" "}
                  <R n="DataChannel" />.
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_data" title="Data">
              <P>
                After{" "}
                <R n="d3_range_based_set_reconciliation" />, peers can forward
                new <Rs n="Entry" />{" "}
                and their (<R n="transform_payload">transformed</R>){" "}
                <Rs n="Payload" /> to each other.
              </P>

              <PreviewScope>
                <P>
                  To map transmitted <Rs n="Chunk" /> of <Rs n="Payload" />{" "}
                  to their{" "}
                  <Rs n="Entry" />, each peer maintains a piece of state, an
                  {" "}
                  <R n="AuthorisedEntry" /> called its{" "}
                  <DefValue n="data_current_entry" />. It is initialised to the
                  pair of{"  "}
                  <Code>
                    <R n="default_entry" />(<R n="sync_default_namespace_id" />,
                    {" "}
                    <R n="sync_default_subspace_id" />,{" "}
                    <R n="sync_default_payload_digest" />)
                  </Code>{" "}
                  and the{" "}
                  <R n="sync_default_authorisation_token" />. Upon receiving a
                  {" "}
                  <R n="DataSendEntry" /> message, a peer sets its{" "}
                  <R n="data_current_entry" /> to the received{" "}
                  <R n="DataSendEntryEntry" />.
                </P>
              </PreviewScope>

              <Hsection
                n="sync_msg_DataSendEntry"
                title={<Code>DataSendEntry</Code>}
                noToc
              >
                <P>
                  The <R n="DataSendEntry" /> messages let peers send{" "}
                  <Rs n="AuthorisedEntry" />{" "}
                  outside of set reconciliation. Receiving a{" "}
                  <R n="DataSendEntry" /> sets the receiver’s{" "}
                  <R n="data_current_entry" />.
                </P>

                <Pseudocode n="sync_defs_DataSendEntry">
                  <StructDef
                    comment={
                      <>
                        Transmit an <R n="AuthorisedEntry" />{" "}
                        and set the receiver’s <R n="data_current_entry" />.
                      </>
                    }
                    id={[
                      "DataSendEntry",
                      "DataSendEntry",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="AuthorisedEntry" /> to transmit.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "entry",
                              "DataSendEntryEntry",
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
                              The index of the first (<R n="transform_payload">
                                transformed
                              </R>) <R n="Payload" /> <R n="Chunk" />{" "}
                              that will be transmitted for{" "}
                              <R n="DataSendEntryEntry" />. Can be set
                              arbitrarily if no <Rs n="Chunk" />{" "}
                              will be transmitted, <Em>should</Em> be set to
                              {" "}
                              <M>0</M> in that case.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "offset",
                              "DataSendEntryOffset",
                              "offset",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="DataSendEntry" /> messages use the{" "}
                  <R n="DataChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_DataSendPayload"
                title={<Code>DataSendPayload</Code>}
                noToc
              >
                <P>
                  The <R n="DataSendPayload" />{" "}
                  messages let peers transmit (successive parts of) the
                  concatenation of the <R n="transform_payload">transformed</R>
                  {" "}
                  <Rs n="Payload" /> of the receiver’s{" "}
                  <R n="data_current_entry" />.
                </P>

                <Pseudocode n="sync_defs_DataSendPayload">
                  <StructDef
                    comment={
                      <>
                        Send some <Rs n="Chunk" /> of the receiver’s{" "}
                        <R n="data_current_entry" />.
                      </>
                    }
                    id={[
                      "DataSendPayload",
                      "DataSendPayload",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The number of transmitted <Rs n="Chunk" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "amount",
                              "DataSendPayloadAmount",
                              "amounts",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The bytes to transmit, the concatenation of the
                              {" "}
                              <Rs n="Chunk" /> obtained by applying{" "}
                              <R n="transform_payload" /> to the{" "}
                              <R n="Payload" /> of the receiver’s{" "}
                              <R n="data_current_entry" />
                              <R n="Entry" />, starting at the{" "}
                              <R n="DataSendEntryOffset" /> of the corresponding
                              {" "}
                              <R n="DataSendEntry" /> message plus the number of
                              {" "}
                              <Rs n="Chunk" /> for the current <R n="Entry" />
                              {" "}
                              that were already transmitted by prior{" "}
                              <R n="DataSendPayload" /> messages.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "bytes",
                              "DataSendPayloadBytes",
                              "bytes",
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

                <P>
                  <Rb n="DataSendPayload" /> messages use the{" "}
                  <R n="DataChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_DataSetEagerness"
                title={<Code>DataSetEagerness</Code>}
                noToc
              >
                <P>
                  The <R n="DataSetEagerness" /> messages let peers politely
                  {" "}
                  <Sidenote
                    note={
                      <>
                        <Rb n="DataSetEagerness" />{" "}
                        messages are not binding, they merely present an
                        optimisation opportunity.
                      </>
                    }
                  >
                    ask
                  </Sidenote>{" "}
                  the other peer whether to eagerly include the{" "}
                  <Rs n="Payload" /> of <Rs n="Entry" /> which it{" "}
                  <R n="DataSendEntry">pushes</R> in some overlap of two{" "}
                  <Rs n="read_capability" />, or whether to omit the{" "}
                  <Rs n="Payload" />. This allows peers to implement the
                  Plumtree algorithm<Bib item="leitao2007epidemic" />.
                </P>

                <Pseudocode n="sync_defs_DataSetEagerness">
                  <StructDef
                    comment={
                      <>
                        Express eagerness preferences for the <R n="Payload" />
                        {" "}
                        transmissions in the overlaps of the{" "}
                        <Rs n="granted_area" /> of two{" "}
                        <Rs n="ReadCapability" />.
                      </>
                    }
                    id={[
                      "DataSetEagerness",
                      "DataSetEagerness",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              A <R n="ReadCapabilityHandle" />{" "}
                              <R n="handle_bind">bound</R> by the{" "}
                              <Em>sender</Em>{" "}
                              of this message. This message pertains to the{" "}
                              <R n="granted_area" /> of the corresponding{" "}
                              <R n="read_capability" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "sender_handle",
                              "DataSetEagernessSenderHandle",
                              "sender_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              A <R n="ReadCapabilityHandle" />{" "}
                              <R n="handle_bind">bound</R> by the{" "}
                              <Em>receiver</Em>{" "}
                              of this message. This message pertains to the{" "}
                              <R n="granted_area" /> of the corresponding{" "}
                              <R n="read_capability" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "receiver_handle",
                              "DataSetEagernessReceiverHandle",
                              "receiver_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              Whether the receiver should eagerly include{" "}
                              <Rs n="Payload" /> when it pushes <Rs n="Entry" />
                              {" "}
                              from the overlap of the <Rs n="granted_area" />
                              {" "}
                              of the <R n="ReadCapability" /> corresponding to
                              {" "}
                              <R n="DataSetEagernessSenderHandle" /> and{" "}
                              <R n="DataSetEagernessReceiverHandle" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "set_eager",
                              "DataSetEagernessSetEager",
                              "set_eager",
                            ],
                            <R n="Bool" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="DataSetEagerness" /> messages are{" "}
                  <Rs n="global_message" />.
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_payload_request" title="PayloadRequest">
              <P>
                The following messages allow peers to explicitly request{" "}
                <Rs n="Payload" />, and to reply to such requests.
              </P>

              <Hsection
                n="sync_msg_PayloadRequestBindRequest"
                title={<Code>PayloadRequestBindRequest</Code>}
                noToc
              >
                <P>
                  The <R n="PayloadRequestBindRequest" />{" "}
                  messages let peers issue requests for specific (parts of){" "}
                  <Rs n="Payload" />, binding a <R n="PayloadRequestHandle" />
                  {" "}
                  in the process (which is used to map responses to requests).
                </P>

                <Pseudocode n="sync_defs_PayloadRequestBindRequest">
                  <StructDef
                    comment={
                      <>
                        <Rb n="handle_bind" /> a request for (parts of) a{" "}
                        <R n="Payload" />.
                      </>
                    }
                    id={[
                      "PayloadRequestBindRequest",
                      "PayloadRequestBindRequest",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="entry_namespace_id" /> of the{" "}
                              <R n="Entry" /> whose <R n="Payload" />{" "}
                              to request.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "namespace_id",
                              "PayloadRequestBindRequestNamespaceId",
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
                              <R n="Entry" /> whose <R n="Payload" />{" "}
                              to request.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "subspace_id",
                              "PayloadRequestBindRequestSubspaceId",
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
                              The <R n="entry_path" /> of the <R n="Entry" />
                              {" "}
                              whose <R n="Payload" /> to request.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "path",
                              "PayloadRequestBindRequestPath",
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
                              <R n="Entry" /> whose <R n="Payload" />{" "}
                              to request.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "payload_digest",
                              "PayloadRequestBindRequestPayloadDigest",
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
                              A <R n="ReadCapabilityHandle" />{" "}
                              <R n="handle_bind">bound</R> by the{" "}
                              <Em>sender</Em> of this message. The{" "}
                              <R n="granted_area" /> of the corresponding{" "}
                              <R n="read_capability" /> must contain the{" "}
                              <R n="PayloadRequestBindRequestNamespaceId" />,
                              {" "}
                              <R n="PayloadRequestBindRequestSubspaceId" />, and
                              {" "}
                              <R n="PayloadRequestBindRequestPath" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "sender_handle",
                              "PayloadRequestBindRequestSenderHandle",
                              "sender_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              A <R n="ReadCapabilityHandle" />{" "}
                              <R n="handle_bind">bound</R> by the{" "}
                              <Em>receiver</Em> of this message. The{" "}
                              <R n="granted_area" /> of the corresponding{" "}
                              <R n="read_capability" /> must contain the{" "}
                              <R n="PayloadRequestBindRequestNamespaceId" />,
                              {" "}
                              <R n="PayloadRequestBindRequestSubspaceId" />, and
                              {" "}
                              <R n="PayloadRequestBindRequestPath" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "receiver_handle",
                              "PayloadRequestBindRequestReceiverHandle",
                              "receiver_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  When receiving a <R n="PayloadRequestBindRequest" />{" "}
                  message, a peer must not reply with the corresponding{" "}
                  <R n="Payload" /> if the <R n="Entry" />’s{" "}
                  <R n="entry_timestamp" /> does not fall within both the{" "}
                  <R n="read_capability" /> corresponding to{" "}
                  <R n="PayloadRequestBindRequestSenderHandle" />{" "}
                  and that corresponding to{" "}
                  <R n="PayloadRequestBindRequestReceiverHandle" />.
                </P>

                <P>
                  <Wip fg="#000000" bg="#f7e4a5ff">
                    We will add the ability to query for arbitrary slices
                    (indexed in transformed chunks, not bytes) in the future;
                    this will be part of ongoing grant work.
                  </Wip>
                  <Rb n="PayloadRequestBindRequest" /> messages use the{" "}
                  <R n="PayloadRequestChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_PayloadRequestSendResponse"
                title={<Code>PayloadRequestSendResponse</Code>}
                noToc
              >
                <P>
                  The <R n="PayloadRequestSendResponse" />{" "}
                  messages let peers transmit (successive parts of) the
                  concatenation of the <R n="transform_payload">transformed</R>
                  {" "}
                  <Rs n="Payload" /> of{" "}
                  <R n="PayloadRequestBindRequest">requested</R>{" "}
                  <Rs n="Entry" />.
                </P>

                <Pseudocode n="sync_defs_PayloadRequestSendResponse">
                  <StructDef
                    comment={
                      <>
                        Send some <Rs n="Chunk" /> of a{" "}
                        <R n="PayloadRequestBindRequest">requested</R>{" "}
                        <R n="Entry" />.
                      </>
                    }
                    id={[
                      "PayloadRequestSendResponse",
                      "PayloadRequestSendResponse",
                    ]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="PayloadRequestHandle" />{" "}
                              of the request this is responding to.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "handle",
                              "PayloadRequestSendResponseHandle",
                              "handle",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The number of transmitted <Rs n="Chunk" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "amount",
                              "PayloadRequestSendResponseAmount",
                              "amounts",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The bytes to transmit, the concatenation of the
                              {" "}
                              <Rs n="Chunk" /> obtained by applying{" "}
                              <R n="transform_payload" /> to the{" "}
                              <R n="Payload" /> of the requested
                              <R n="Entry" />, starting at the requested offset
                              plus the number of <Rs n="Chunk" />{" "}
                              for the same request{" "}
                              that were already transmitted by prior{" "}
                              <R n="PayloadRequestSendResponse" /> messages.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "bytes",
                              "PayloadRequestSendResponseBytes",
                              "bytes",
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

                <P>
                  <Rb n="PayloadRequestSendResponse" /> messages use the{" "}
                  <R n="DataChannel" />.
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_resource_handle" title="ResourceHandle">
              <P>
                The <R n="ResourceHandleFree" />{" "}
                messages let peers indicate they wish to <R n="handle_free" /> a
                {" "}
                <R n="resource_handle" />.
              </P>

              <Pseudocode n="sync_defs_ResourceHandleFree">
                <StructDef
                  comment={
                    <>
                      Indicate that the sender wants to <R n="handle_free" /> a
                      {" "}
                      <R n="resource_handle" />.
                    </>
                  }
                  id={[
                    "ResourceHandleFree",
                    "ResourceHandleFree",
                  ]}
                  fields={[
                    {
                      commented: {
                        comment: (
                          <>
                            The type of <R n="resource_handle" /> to{" "}
                            <R n="handle_free" />.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "handle_type",
                            "ResourceHandleFreeHandleType",
                            "handle_types",
                          ],
                          <R n="HandleType" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Whether the <R n="resource_handle" /> to{" "}
                            <R n="handle_free" />{" "}
                            was bound by the sender (<Code>true</Code>) or the
                            receiver (<Code>false</Code>) of this message.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "mine",
                            "ResourceHandleFreeMine",
                            "mine",
                          ],
                          <R n="Bool" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The numeric id of the <R n="resource_handle" />{" "}
                            to free.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "handle_id",
                            "ResourceHandleFreeHandleId",
                            "handle_ids",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            The sender’s <R n="handle_refcount" /> for the{" "}
                            <R n="resource_handle" /> to free.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "reference_count",
                            "ResourceHandleFreeReferenceCount",
                            "reference_counts",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>

              <P>
                <Rb n="ResourceHandleFree" /> messages are{" "}
                <Rs n="global_message" />.
              </P>
            </Hsection>
          </Hsection>

          <Hsection n="sync_encodings" title="Encodings">
            <P>
              We now describe how to encode the various messages of Confidential
              Sync. When a peer receives bytes it cannot decode, this is an
              error.
            </P>

            <Hsection n="sync_encoding_params" title="Parameters">
              <P>
                To be able to encode messages, we require certain properties
                from the <R n="sync_parameters">protocol parameters</R>:
              </P>

              <Ul>
                <Li>
                  <Marginale>
                    When using <R n="Capability" /> as the type of{" "}
                    <Rs n="ReadCapability" />, you can use{" "}
                    <R n="EncodeMcCapabilityRelativePrivateInterest" />.
                  </Marginale>
                  A <R n="relative_encoding_relation" />{" "}
                  <DefType
                    n="EncodeReadCapability"
                    preview={
                      <P>
                        A protocol parameter of <R n="confidential_sync" />, the
                        {" "}
                        <R n="relative_encoding_relation" /> for encoding{" "}
                        <Rs n="ReadCapability" />.
                      </P>
                    }
                  />{" "}
                  encoding <Rs n="ReadCapability" /> relative to{" "}
                  <Rs n="PersonalPrivateInterest" />. Note that the information
                  in the <R n="PersonalPrivateInterest" />{" "}
                  must not appear in the <Rs n="rel_code" />,{" "}
                  <R n="pio_caps">to protect against active eavesdroppers</R>.
                </Li>

                <Li>
                  <Marginale>
                    When using <R n="McEnumerationCapability" /> as the type of
                    {" "}
                    <Rs n="EnumerationCapability" />, you can use{" "}
                    <R n="EncodeMcEnumerationCapabilityRelativePrivateInterest" />.
                  </Marginale>
                  A <R n="relative_encoding_relation" />{" "}
                  <DefType
                    n="EncodeEnumerationCapability"
                    preview={
                      <P>
                        A protocol parameter of <R n="confidential_sync" />, the
                        {" "}
                        <R n="relative_encoding_relation" /> for encoding{" "}
                        <Rs n="EnumerationCapability" />.
                      </P>
                    }
                  />{" "}
                  encoding <Rs n="EnumerationCapability" />{" "}
                  <DefValue noPreview n="sync_enc_enum_cap" r="val" />{" "}
                  relative to the pair of the{" "}
                  <R n="enumeration_granted_namespace" /> and the{" "}
                  <R n="enumeration_receiver" /> of{" "}
                  <AccessStruct field="PioAnnounceOverlapEnumerationCapability">
                    <R n="sync_enc_enum_cap" />
                  </AccessStruct>. Note that
                  the<R n="enumeration_granted_namespace" />{" "}
                  must not appear in the <Rs n="rel_code" />,{" "}
                  <R n="pio_caps">to protect against active eavesdroppers</R>.
                </Li>

                <Li>
                  <Marginale>
                    Used indirectly when encoding <Rs n="Entry" />,{" "}
                    <Rs n="Area" />, and <Rs n="D3Range" />.
                  </Marginale>
                  An <R n="encoding_function" /> for <R n="SubspaceId" />.
                </Li>

                <Li>
                  <Marginale>
                    The total order makes <Rs n="D3Range" />{" "}
                    meaningful, the least element and successors ensure that
                    every <R n="Area" /> can be expressed as an equivalent{" "}
                    <R n="D3Range" />.
                  </Marginale>
                  A{" "}
                  <AE href="https://en.wikipedia.org/wiki/Total_order">
                    total order
                  </AE>{" "}
                  on <R n="SubspaceId" /> with least element{" "}
                  <DefValue
                    n="sync_least_subspace_id"
                    r="least_subspace_id"
                    preview={
                      <P>
                        A protocol parameter of <R n="confidential_sync" />, the
                        {" "}
                        unique least <R n="SubspaceId" />.
                      </P>
                    }
                  />, in which for every non-maximal <R n="SubspaceId" />{" "}
                  <DefValue noPreview n="subspace_successor_s" r="s" />{" "}
                  there exists a successor{" "}
                  <DefValue noPreview n="subspace_successor_t" r="t" />{" "}
                  such that <R n="subspace_successor_s" /> is less than{" "}
                  <R n="subspace_successor_t" /> and no other{" "}
                  <R n="SubspaceId" /> is greater than{" "}
                  <R n="subspace_successor_s" /> and less than{" "}
                  <R n="subspace_successor_t" />.
                </Li>

                <Li>
                  <Marginale>
                    When using <R n="MeadowcapAuthorisationToken" />{" "}
                    as the type of <Rs n="AuthorisationToken" />, you can use
                    {" "}
                    <R n="EncodeMeadowcapAuthorisationTokenRelative" />.
                  </Marginale>
                  A <R n="relative_encoding_relation" />{" "}
                  <DefType
                    n="EncodeAuthorisationToken"
                    preview={
                      <P>
                        A protocol parameter of <R n="confidential_sync" />, the
                        {" "}
                        <R n="relative_encoding_relation" /> for encoding{" "}
                        <Rs n="AuthorisationToken" />.
                      </P>
                    }
                  />{" "}
                  encoding <Rs n="AuthorisationToken" /> relative to pairs of an
                  {" "}
                  <R n="AuthorisedEntry" /> (the previously transmitted{" "}
                  <R n="AuthorisedEntry" />) and an <R n="Entry" /> (the{" "}
                  <R n="Entry" /> currently being transmitted).
                </Li>

                <Li>
                  An <R n="encoding_relation" />{" "}
                  <DefFunction
                    n="EncodeFingerprint"
                    preview={
                      <P>
                        A protocol parameter of <R n="confidential_sync" />, the
                        {" "}
                        <R n="encoding_relation" /> for encoding{" "}
                        <Rs n="Fingerprint" />.
                      </P>
                    }
                  />{" "}
                  for <R n="Fingerprint" />.
                </Li>
              </Ul>

              <P>
                We can now define the encodings for all messages, to the be
                transmitted via LCMUX <Rs n="SendChannelFrame" /> and{" "}
                <Rs n="SendGlobalFrame" />.
              </P>
            </Hsection>

            <Hsection n="sync_encode_pio" title="Private Interest Overlap">
              <Hsection n="sync_msg_enc_PioBindHash" title="PioBindHash" noToc>
                <EncodingRelationTemplate
                  n="EncodePioBindHash"
                  valType={<R n="PioBindHash" />}
                  bitfields={[
                    bitfieldIff(
                      <ValAccess field="PioBindHashActuallyInterested" />,
                    ),
                    bitfieldArbitrary(7),
                  ]}
                  contents={[
                    <RawBytes>
                      <ValAccess field="PioBindHashHash" />
                    </RawBytes>,
                  ]}
                />

                <P>
                  <R n="PioBindHash" /> messages use the{" "}
                  <R n="OverlapChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">2</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_PioAnnounceOverlap"
                title="PioAnnounceOverlap"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodePioAnnounceOverlap"
                  valType={<R n="PioAnnounceOverlap" />}
                  preDefs={
                    <>
                      <P>
                        If{" "}
                        <ValAccess field="PioAnnounceOverlapEnumerationCapability" />
                        {" "}
                        is not <R n="enum_cap_none" />, let{" "}
                        <DefValue n="epao_pair" r="pair" /> denote the{" "}
                        pair of the <R n="enumeration_granted_namespace" />{" "}
                        and the <R n="enumeration_receiver" /> of{" "}
                        <ValAccess field="PioAnnounceOverlapEnumerationCapability" />.
                      </P>
                    </>
                  }
                  bitfields={[
                    bitfieldConstant([0, 0]),
                    bitfieldIff(
                      <>
                        <ValAccess field="PioAnnounceOverlapEnumerationCapability" />
                        {" "}
                        is not <R n="enum_cap_none" />
                      </>,
                    ),
                    c64Tag(
                      "sender_handle",
                      2,
                      <>
                        <ValAccess field="PioAnnounceOverlapSenderHandle" />
                      </>,
                    ),
                    c64Tag(
                      "receiver_handle",
                      3,
                      <>
                        <ValAccess field="PioAnnounceOverlapReceiverHandle" />
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="sender_handle" />,
                    <C64Encoding id="receiver_handle" />,
                    <RawBytes>
                      <ValAccess field="PioAnnounceOverlapAuthentication" />
                    </RawBytes>,
                    <EncConditional
                      condition={
                        <>
                          <ValAccess field="PioAnnounceOverlapEnumerationCapability" />
                          {" "}
                          is not <R n="enum_cap_none" />
                        </>
                      }
                    >
                      <CodeFor
                        notStandalone
                        enc="EncodeEnumerationCapability"
                        relativeTo={<R n="epao_pair" />}
                      >
                        <ValAccess field="PioAnnounceOverlapEnumerationCapability" />
                      </CodeFor>
                    </EncConditional>,
                  ]}
                />

                <P>
                  <R n="PioAnnounceOverlap" /> messages are{" "}
                  <Rs n="global_message" />, so they are transmitted via{" "}
                  <Rs n="SendGlobalFrame" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_PioBindReadCapability"
                title="PioBindReadCapability"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodePioBindReadCapability"
                  valType={<R n="PioBindReadCapability" />}
                  preDefs={
                    <>
                      <P>
                        Let <DefValue n="epbrc_ppi" r="ppi" /> denote the{" "}
                        <R n="PersonalPrivateInterest" /> whose
                      </P>

                      <Ul>
                        <Li>
                          <R n="ppi_user" /> is<Ul>
                            <Li>
                              <R n="ini_pk" /> if the sender of <ValName /> is
                              {" "}
                              <R n="alfie" />,
                            </Li>
                            <Li>
                              or <R n="res_pk" /> if the sender of <ValName />
                              {" "}
                              is <R n="betty" />, and whose
                            </Li>
                          </Ul>
                        </Li>

                        <Li>
                          <R n="ppi_pi" /> is the <R n="PrivateInterest" />{" "}
                          whose hash is bound to{" "}
                          <ValAccess field="PioBindReadCapabilitySenderHandle" />.
                        </Li>
                      </Ul>
                    </>
                  }
                  bitfields={[
                    c64Tag(
                      "sender_handle",
                      2,
                      <>
                        <ValAccess field="PioBindReadCapabilitySenderHandle" />
                      </>,
                    ),
                    c64Tag(
                      "receiver_handle",
                      2,
                      <>
                        <ValAccess field="PioBindReadCapabilityReceiverHandle" />
                      </>,
                    ),
                    c64Tag(
                      "max_count",
                      2,
                      <>
                        <ValAccess field="PioBindReadCapabilityMaxCount" />
                      </>,
                    ),
                    c64Tag(
                      "max_size",
                      2,
                      <>
                        <ValAccess field="PioBindReadCapabilityMaxSize" />{" "}
                        + 1 modulo{" "}
                        <M>
                          2^<Curly>64</Curly>
                        </M>
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="sender_handle" />,
                    <C64Encoding id="receiver_handle" />,
                    <C64Encoding id="max_count" />,
                    <C64Encoding id="max_size" />,
                    <>
                      <ValAccess field="PioBindReadCapabilityMaxPayloadPower" />.
                    </>,
                    <CodeFor
                      enc="EncodeReadCapability"
                      relativeTo={<R n="epbrc_ppi" />}
                    >
                      <ValAccess field="PioBindReadCapabilityCapability" />
                    </CodeFor>,
                  ]}
                />

                <P>
                  <R n="PioBindReadCapability" /> messages use the{" "}
                  <R n="CapabilityChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">3</M>
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_encode_rec" title="Reconciliation">
              <PreviewScope>
                <P>
                  To efficiently encode{" "}
                  <Rs n="D3Range" />, each peer maintains two pieces of state, a
                  {" "}
                  <R n="D3Range" /> called its{" "}
                  <DefValue n="previously_received_fingerprint_3drange" />, and
                  a <R n="D3Range" /> called its{" "}
                  <DefValue n="previously_received_itemset_3drange" />. Both are
                  initialised to{"   "}
                  <Code>
                    <R n="full_3d_range" />(<R n="sync_least_subspace_id" />)
                  </Code>. Upon receiving a{" "}
                  <R n="ReconciliationSendFingerprint" /> or{" "}
                  <R n="ReconciliationAnnounceEntries" />{" "}
                  message, a peer sets its{" "}
                  <R n="previously_received_fingerprint_3drange" /> or{" "}
                  <R n="previously_received_itemset_3drange" /> respectively
                  {" "}
                  to the message’s <R n="D3Range" />.
                </P>
              </PreviewScope>

              <Hsection
                n="sync_msg_enc_ReconciliationSendFingerprint"
                title="ReconciliationSendFingerprint"
                noToc
              >
                <P>
                  In the following, a <R n="RangeInfoRootId" /> of{" "}
                  <R n="root_id_none" /> is encoded as if it was the{" "}
                  <R n="U64" /> <Code>0</Code>.
                </P>

                <EncodingRelationTemplate
                  n="EncodeReconciliationSendFingerprint"
                  valType={<R n="ReconciliationSendFingerprint" />}
                  bitfields={[
                    c64Tag(
                      "root",
                      4,
                      <>
                        <AccessStruct field="RangeInfoRootId">
                          <ValAccess field="ReconciliationSendFingerprintInfo" />
                        </AccessStruct>
                      </>,
                    ),
                    c64Tag(
                      "sender_handle",
                      2,
                      <>
                        <AccessStruct field="RangeInfoSenderHandle">
                          <ValAccess field="ReconciliationSendFingerprintInfo" />
                        </AccessStruct>
                      </>,
                    ),
                    c64Tag(
                      "receiver_handle",
                      2,
                      <>
                        <AccessStruct field="RangeInfoReceiverHandle">
                          <ValAccess field="ReconciliationSendFingerprintInfo" />
                        </AccessStruct>
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="root" />,
                    <C64Encoding id="sender_handle" />,
                    <C64Encoding id="receiver_handle" />,
                    <CodeFor
                      enc="Encode3dRangeRelative3dRange"
                      relativeTo={
                        <R n="previously_received_fingerprint_3drange" />
                      }
                    >
                      <AccessStruct field="RangeInfoRange">
                        <ValAccess field="ReconciliationSendFingerprintInfo" />
                      </AccessStruct>
                    </CodeFor>,
                    <CodeFor enc="EncodeFingerprint">
                      <ValAccess field="ReconciliationSendFingerprintFingerprint" />
                    </CodeFor>,
                  ]}
                />

                <P>
                  <R n="ReconciliationSendFingerprint" /> messages use the{" "}
                  <R n="ReconciliationChannel" />, so they are transmitted via
                  {" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">0</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_ReconciliationAnnounceEntries"
                title="ReconciliationAnnounceEntries"
                noToc
              >
                <P>
                  In the following, a <R n="RangeInfoRootId" /> of{" "}
                  <R n="root_id_none" /> is encoded as if it was the{" "}
                  <R n="U64" /> <Code>0</Code>.
                </P>

                <EncodingRelationTemplate
                  n="EncodeReconciliationReconciliationAnnounceEntries"
                  valType={<R n="ReconciliationAnnounceEntries" />}
                  bitfields={[
                    bitfieldConstant([0, 0, 0]),
                    bitfieldIff(
                      <>
                        <ValAccess field="ReconciliationAnnounceEntriesIsEmpty" />
                      </>,
                    ),
                    bitfieldIff(
                      <>
                        <ValAccess field="ReconciliationAnnounceEntriesWantResponse" />
                      </>,
                    ),
                    bitfieldIff(
                      <>
                        <ValAccess field="ReconciliationAnnounceEntriesWillSort" />
                      </>,
                    ),
                    c64Tag(
                      "root",
                      2,
                      <>
                        <AccessStruct field="RangeInfoRootId">
                          <ValAccess field="ReconciliationAnnounceEntriesInfo" />
                        </AccessStruct>
                      </>,
                    ),
                    c64Tag(
                      "sender_handle",
                      4,
                      <>
                        <AccessStruct field="RangeInfoSenderHandle">
                          <ValAccess field="ReconciliationAnnounceEntriesInfo" />
                        </AccessStruct>
                      </>,
                    ),
                    c64Tag(
                      "receiver_handle",
                      4,
                      <>
                        <AccessStruct field="RangeInfoReceiverHandle">
                          <ValAccess field="ReconciliationAnnounceEntriesInfo" />
                        </AccessStruct>
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="root" />,
                    <C64Encoding id="sender_handle" />,
                    <C64Encoding id="receiver_handle" />,
                    <CodeFor
                      enc="Encode3dRangeRelative3dRange"
                      relativeTo={<R n="previously_received_itemset_3drange" />}
                    >
                      <AccessStruct field="RangeInfoRange">
                        <ValAccess field="ReconciliationSendFingerprintInfo" />
                      </AccessStruct>
                    </CodeFor>,
                    <CodeFor enc="EncodeFingerprint">
                      <ValAccess field="ReconciliationSendFingerprintFingerprint" />
                    </CodeFor>,
                  ]}
                />

                <P>
                  <R n="ReconciliationAnnounceEntries" /> messages use the{" "}
                  <R n="DataChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">1</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_ReconciliationSendEntry"
                title="ReconciliationSendEntry"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodeReconciliationSendEntry"
                  valType={<R n="ReconciliationSendEntry" />}
                  preDefs={
                    <>
                      <P>
                        Let{" "}
                        <DefValue
                          n="erse_mode"
                          r="relative_to_entry"
                        />{" "}
                        be an arbitrary <R n="Bool" />.
                      </P>
                    </>
                  }
                  bitfields={[
                    bitfieldConstant([0, 0, 1]),
                    bitfieldIff(<R n="erse_mode" />),
                    c64Tag(
                      "offset",
                      2,
                      <>
                        <ValAccess field="ReconciliationSendEntryOffset" />
                      </>,
                    ),
                    c64Tag(
                      "available",
                      2,
                      <>
                        <AccessStruct field="lengthy_entry_available">
                          <ValAccess field="ReconciliationSendEntryEntry" />
                        </AccessStruct>
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="offset" />,
                    <C64Encoding id="available" />,
                    <EncConditional
                      condition={
                        <Code>
                          <R n="erse_mode" />
                        </Code>
                      }
                      otherwise={
                        <>
                          <CodeFor
                            notStandalone
                            enc="EncodeEntryInNamespace3dRange"
                            relativeTo={
                              <>
                                the pair of{" "}
                                <R n="previously_received_itemset_3drange" />
                                {" "}
                                and the <R n="granted_namespace" /> of the{" "}
                                <R n="ReconciliationAnnounceEntriesInfo" />{" "}
                                of the preceding{" "}
                                <R n="ReconciliationAnnounceEntries" /> message
                              </>
                            }
                          >
                            the <R n="Entry" /> of{" "}
                            <ValAccess field="ReconciliationSendEntryEntry" />
                          </CodeFor>
                        </>
                      }
                    >
                      <CodeFor
                        notStandalone
                        enc="EncodeEntryRelativeEntry"
                        relativeTo={<R n="reconciliation_current_entry" />}
                      >
                        the <R n="Entry" /> of{" "}
                        <ValAccess field="ReconciliationSendEntryEntry" />
                      </CodeFor>
                    </EncConditional>,
                    <CodeFor
                      enc="EncodeAuthorisationToken"
                      relativeTo={
                        <>
                          <R n="reconciliation_current_entry" /> and{" "}
                          <ValAccess field="ReconciliationSendEntryEntry" />
                        </>
                      }
                    >
                      the <R n="AuthorisationToken" /> of{" "}
                      <ValAccess field="ReconciliationSendEntryEntry" />
                    </CodeFor>,
                  ]}
                />

                <P>
                  <R n="ReconciliationSendEntry" /> messages use the{" "}
                  <R n="DataChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">1</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_ReconciliationSendPayload"
                title="ReconciliationSendPayload"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodeReconciliationSendPayload"
                  valType={<R n="ReconciliationSendPayload" />}
                  bitfields={[
                    bitfieldConstant([0, 1, 0]),
                    c64Tag(
                      "amount",
                      5,
                      <>
                        <ValAccess field="ReconciliationSendPayloadAmount" />
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="amount" />,
                    <RawBytes>
                      <ValAccess field="ReconciliationSendPayloadBytes" />
                    </RawBytes>,
                  ]}
                />

                <P>
                  <R n="ReconciliationSendPayload" /> messages use the{" "}
                  <R n="DataChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">1</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_ReconciliationTerminatePayload"
                title="ReconciliationTerminatePayload"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodeReconciliationTerminatePayload"
                  valType={<R n="ReconciliationTerminatePayload" />}
                  bitfields={[
                    bitfieldConstant([0, 1, 1]),
                    bitfieldIff(
                      <ValAccess field="ReconciliationTerminatePayloadFinal" />,
                    ),
                    bitfieldArbitrary(4),
                  ]}
                  contents={[]}
                />

                <P>
                  <R n="ReconciliationTerminatePayload" /> messages use the{" "}
                  <R n="DataChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">1</M>
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_encode_data" title="Data">
              <Hsection
                n="sync_msg_enc_DataSendEntry"
                title="DataSendEntry"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodeDataSendEntry"
                  valType={<R n="DataSendEntry" />}
                  bitfields={[
                    bitfieldConstant([1, 0, 0]),
                    c64Tag(
                      "offset",
                      5,
                      <>
                        <ValAccess field="DataSendEntryOffset" />
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="offset" />,
                    <CodeFor
                      enc="EncodeEntryRelativeEntry"
                      relativeTo={<R n="data_current_entry" />}
                    >
                      the <R n="Entry" /> of{" "}
                      <ValAccess field="DataSendEntryEntry" />
                    </CodeFor>,
                    <CodeFor
                      enc="EncodeAuthorisationToken"
                      relativeTo={
                        <>
                          <R n="data_current_entry" /> and{" "}
                          <ValAccess field="DataSendEntryEntry" />
                        </>
                      }
                    >
                      the <R n="AuthorisationToken" /> of{" "}
                      <ValAccess field="DataSendEntryEntry" />
                    </CodeFor>,
                  ]}
                />

                <P>
                  <R n="DataSendEntry" /> messages use the{" "}
                  <R n="DataChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">1</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_DataSendPayload"
                title="DataSendPayload"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodeDataSendPayload"
                  valType={<R n="DataSendPayload" />}
                  bitfields={[
                    bitfieldConstant([1, 0, 1]),
                    c64Tag(
                      "amount",
                      5,
                      <>
                        <ValAccess field="DataSendPayloadAmount" />
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="amount" />,
                    <RawBytes>
                      <ValAccess field="DataSendPayloadBytes" />
                    </RawBytes>,
                  ]}
                />

                <P>
                  <R n="DataSendPayload" /> messages use the{" "}
                  <R n="DataChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">1</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_DataSetEagerness"
                title="DataSetEagerness"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodeDataSetEagerness"
                  valType={<R n="DataSetEagerness" />}
                  bitfields={[
                    bitfieldConstant([0, 1]),
                    bitfieldIff(
                      <>
                        <ValAccess field="DataSetEagernessSetEager" />
                      </>,
                    ),
                    c64Tag(
                      "sender_handle",
                      2,
                      <>
                        <ValAccess field="DataSetEagernessSenderHandle" />
                      </>,
                    ),
                    c64Tag(
                      "receiver_handle",
                      3,
                      <>
                        <ValAccess field="DataSetEagernessReceiverHandle" />
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="sender_handle" />,
                    <C64Encoding id="receiver_handle" />,
                  ]}
                />

                <P>
                  <R n="DataSetEagerness" /> messages are{" "}
                  <Rs n="global_message" />, so they are transmitted via{" "}
                  <Rs n="SendGlobalFrame" />.
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_encode_request_payload" title="PayloadRequest">
              <Hsection
                n="sync_msg_enc_PayloadRequestBindRequest"
                title="PayloadRequestBindRequest"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodePayloadRequestBindRequest"
                  valType={<R n="PayloadRequestBindRequest" />}
                  bitfields={[
                    c64Tag(
                      "sender_handle",
                      4,
                      <>
                        <ValAccess field="PayloadRequestBindRequestSenderHandle" />
                      </>,
                    ),
                    c64Tag(
                      "receiver_handle",
                      4,
                      <>
                        <ValAccess field="PayloadRequestBindRequestReceiverHandle" />
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="sender_handle" />,
                    <C64Encoding id="receiver_handle" />,
                    <CodeFor isFunction enc="encode_namespace_id">
                      <ValAccess field="PayloadRequestBindRequestNamespaceId" />
                    </CodeFor>,
                    <CodeFor isFunction enc="encode_subspace_id">
                      <ValAccess field="PayloadRequestBindRequestSubspaceId" />
                    </CodeFor>,
                    <CodeFor enc="EncodePath">
                      <ValAccess field="PayloadRequestBindRequestPath" />
                    </CodeFor>,
                    <CodeFor isFunction enc="encode_payload_digest">
                      <ValAccess field="PayloadRequestBindRequestPayloadDigest" />
                    </CodeFor>,
                  ]}
                />

                <P>
                  <R n="PayloadRequestBindRequest" /> messages use the{" "}
                  <R n="PayloadRequestChannel" />, so they are transmitted via
                  {" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">4</M>
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_enc_PayloadRequestSendResponse"
                title="PayloadRequestSendResponse"
                noToc
              >
                <EncodingRelationTemplate
                  n="EncodePayloadRequestSendResponse"
                  valType={<R n="DataSendPayload" />}
                  bitfields={[
                    bitfieldConstant([1, 1]),
                    c64Tag(
                      "handle",
                      2,
                      <ValAccess field="PayloadRequestSendResponseHandle" />,
                    ),
                    c64Tag(
                      "amount",
                      4,
                      <>
                        <ValAccess field="PayloadRequestSendResponseAmount" />
                      </>,
                    ),
                  ]}
                  contents={[
                    <C64Encoding id="handle" />,
                    <C64Encoding id="amount" />,
                    <RawBytes>
                      <ValAccess field="PayloadRequestSendResponseBytes" />
                    </RawBytes>,
                  ]}
                />
                <P>
                  <R n="PayloadRequestSendResponse" /> messages use the{" "}
                  <R n="DataChannel" />, so they are transmitted via{" "}
                  <Rs n="SendChannelFrame" /> with{" "}
                  <R n="SendChannelFrameChannel" /> set to <M post=".">1</M>
                </P>
              </Hsection>
            </Hsection>

            <Hsection n="sync_encode_handle" title="ResourceHandle">
              <EncodingRelationTemplate
                n="EncodeResourceHandleFree"
                valType={<R n="ResourceHandleFree" />}
                bitfields={[
                  bitfieldConstant([1]),
                  bitfieldConditionalString([
                    {
                      bits: [0, 0],
                      condition: (
                        <Code>
                          <ValAccess field="ResourceHandleFreeHandleType" /> ==
                          {" "}
                          <R n="OverlapHandle" />
                        </Code>
                      ),
                    },
                    {
                      bits: [0, 1],
                      condition: (
                        <Code>
                          <ValAccess field="ResourceHandleFreeHandleType" /> ==
                          {" "}
                          <R n="ReadCapabilityHandle" />
                        </Code>
                      ),
                    },
                    {
                      bits: [0, 0],
                      condition: (
                        <Code>
                          <ValAccess field="ResourceHandleFreeHandleType" /> ==
                          {" "}
                          <R n="PayloadRequestHandle" />
                        </Code>
                      ),
                    },
                  ]),
                  bitfieldIff(
                    <>
                      <Code>
                        <ValAccess field="ResourceHandleFreeMine" />
                      </Code>
                    </>,
                  ),
                  c64Tag(
                    "handle_id",
                    2,
                    <>
                      <ValAccess field="ResourceHandleFreeHandleId" />
                    </>,
                  ),
                  c64Tag(
                    "reference_count",
                    2,
                    <>
                      <ValAccess field="ResourceHandleFreeReferenceCount" />
                    </>,
                  ),
                ]}
                contents={[
                  <C64Encoding id="handle_id" />,
                  <C64Encoding id="reference_count" />,
                ]}
              />

              <P>
                <R n="ResourceHandleFree" /> messages are{" "}
                <Rs n="global_message" />, so they are transmitted via{" "}
                <Rs n="SendGlobalFrame" />.
              </P>
            </Hsection>
          </Hsection>
        </Hsection>
        <Img
          src={<ResolveAsset asset={["sync", "wgps_emblem.png"]} />}
          alt={`A Confidential Sync emblem: A stylised drawing of a grapevine next to hand-lettered typewriter style rendition of 'Confidential Sync'.`}
        />
      </PageTemplate>
    </File>
  </Dir>
);
