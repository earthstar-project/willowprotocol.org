import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path, Quotes } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, Img, Li, P, Ul } from "macromania-html";
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
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { Bib } from "macromania-bib/mod.tsx";

export const sync = (
  <Dir name="sync">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow General Purpose Sync Protocol"
        headingId="sync"
        heading={"Willow General Purpose Sync Protocol"}
        toc
        bibliography
        status="candidate"
        statusDate="10.04.2025"
      >
        <PreviewScope>
          <P>
            The <R n="data_model">Willow data model</R>{" "}
            specifies how to arrange data, but it does not prescribe how peers
            should synchronise data. In this document, we specify one possible
            way for performing synchronisation: the{" "}
            <Def n="wgps" r="WGPS">
              Willow General Purpose Sync (WGPS) protocol
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
            The WGPS aims to be appropriate for a variety of networking
            settings, particularly those of peer-to-peer systems where the
            replicating parties might not necessarily trust each other. Quite a
            bit of engineering went into the WGPS to satisfy the following
            requirements:
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
            The WGPS provides a shared vocabulary for peers to communicate with,
            but nothing more. It cannot and does not force peers to use it
            efficiently or to use the most efficient data structures internally.
            That is a feature! Implementations can start out with inefficient
            but simple implementation choices and later replace those with
            better-scaling ones. Throughout that evolution, the implementations
            stay compatible with any other implementation, regardless of its
            degree of sophistication.
          </P>
        </Hsection>

        <Hsection n="sync_concepts" title="Concepts">
          <P>
            Data synchronisation for Willow needs to solve a number of
            sub-problems, which we summarise in this section.
            <Alj>
              On the old page, the subsections did not show up in the toc. TODO:
              add such a flag to macromania tocs as well.
            </Alj>
          </P>

          <Hsection n="sync_pii" title="Private Interest Overlap Detection">
            <P>
              The WGPS lets two peers determine which <Rs n="namespace" /> and
              {" "}
              <Rs n="Area" />{" "}
              therein they share an interest in, without leaking any data that
              only one of them wishes to synchronise. We explain the underlying
              {" "}
              <R n="private_interest_overlap">
                private interest overlap detection protocol here
              </R>. That protocol also covers read access control.
            </P>
          </Hsection>

          <Hsection n="sync_partial" title="Partial Synchronisation">
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
              per <R n="namespace" />. The <R n="area_empty">non-empty</R>{" "}
              <Rs n="aoi_intersection" /> of <Rs n="AreaOfInterest" />{" "}
              from both peers contain the <Rs n="Entry" /> to synchronise.
            </P>

            <P>
              The WGPS synchronises these <Rs n="area_intersection" /> via{" "}
              <R n="d3rbsr" />, a technique we{" "}
              <R n="d3_range_based_set_reconciliation">
                explain in detail here
              </R>.
            </P>
          </Hsection>

          <Hsection
            n="sync_post_sync_forwarding"
            title="Post-Reconciliation Forwarding"
          >
            <P>
              After performing{" "}
              <R n="d3rbsr">set reconciliation</R>, peers might receive new{" "}
              <Rs n="Entry" /> that fall into their shared{" "}
              <Rs n="AreaOfInterest" />. Hence, the WGPS allows peers to
              transmit <Rs n="Entry" /> unsolicitedly.
            </P>
          </Hsection>

          <Hsection n="sync_payloads" title="Payload Transmission">
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
                    keeping a quadratic amount of state
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
          >
            <P>
              If transmission of a <R n="Payload" />{" "}
              is cut short (say, because the internet connection drops), peers
              should be able to work with the data they had received so far. But
              this can only be done safely if they can verify that the data is
              indeed a prefix of the expected{" "}
              <R n="Payload" />. To enable this, the WGPS expects{" "}
              <R n="PayloadDigest" /> to be the digest of a{" "}
              <AE href="https://worm-blossom.github.io/bab/">
                Merkle-tree-based hash function
              </AE>.
            </P>
          </Hsection>

          <Hsection
            n="sync_resources"
            title="Resource Limits"
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
            The WGPS is generic over specific cryptographic primitives. In order
            to use it, one must first specify a full suite of instantiations of
            the{" "}
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
              <Rs n="read_capability" />, a type{" "}
              <DefType n="sync_receiver" r="Receiver" rs="Receivers" /> of{" "}
              <Rs n="access_receiver" />, and a type{" "}
              <DefType n="EnumerationCapability" rs="EnumerationCapabilities" />
              {" "}
              of <Rs n="enumeration_capability" /> whose{" "}
              <Rs n="enumeration_receiver" /> are of type{" "}
              <R n="sync_receiver" />. We require a hash function{" "}
              <DefFunction n="sync_h" r="hash_interests" /> to hash salted{" "}
              <Rs n="PrivateInterest" /> to bytestrings of the fixed width{" "}
              <DefValue n="interest_hash_length" /> (the <R n="pio_h" />{" "}
              function from the{" "}
              <R n="private_interest_overlap">
                privat area overlap detection sub-spec
              </R>). The handshake and encryption of the communication channel
              are out of scope of the WGPS, but the <R n="ini_pk" /> and{" "}
              <R n="res_pk" /> must be of type <R n="sync_receiver" />.<Alj>
                TODO: link to our recommended handshake and encryption document
                here.
              </Alj>
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <R n="d3_range_based_set_reconciliation">
                3d range-based set reconciliation
              </R>{" "}
              requires a type <DefType n="Fingerprint" rs="Fingerprints" />{" "}
              of hashes of <Rs n="LengthyEntry" /> (i.e., of{" "}
              <Rs n="d3rbsr_fp" />).
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              To efficiently transmit{" "}
              <Rs n="AuthorisationToken" />, we decompose them into two parts:
              the <DefType n="StaticToken" rs="StaticTokens" />{" "}
              (which might be shared between many{" "}
              <Rs n="AuthorisationToken" />), and the{" "}
              <DefType n="DynamicToken" rs="DynamicTokens" />
              <Marginale>
                In Meadowcap, for example, <R n="StaticToken" /> is the type
                {" "}
                <R n="Capability" /> and <R n="DynamicToken" /> is the type{" "}
                <R n="UserSignature" />, which together yield a{" "}
                <R n="MeadowcapAuthorisationToken" />.
              </Marginale>{" "}
              (which differs between any two{" "}
              <Rs n="Entry" />). Formally, we require that there is an{" "}
              <AE href="https://en.wikipedia.org/wiki/Isomorphism">
                isomorphism
              </AE>{" "}
              between <R n="AuthorisationToken" /> and pairs of a{" "}
              <R n="StaticToken" /> and a <R n="DynamicToken" />{" "}
              with respect to the <R n="is_authorised_write" /> function.
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
              bytestrings.<Marginale>
                To give an example of how this construction maps to verifiable
                streaming: <R n="transform_payload" /> could map a{" "}
                <R n="Payload" /> to a{" "}
                <AE href="https://worm-blossom.github.io/bab/#baseline">
                  Bab baseline verifiable stream
                </AE>.
              </Marginale>{" "}
              Peers exchange concatenations of those transformed payloads
              instead of actual payloads, and can request each payload
              transmission to start at any of the transformed bytestrings.
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
              and a <R n="PayloadDigest" />{" "}
              <DefValue
                n="sync_default_payload_digest"
                r="default_payload_digest"
              />.
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection n="sync_protocol" title="Protocol">
          <P>
            The protocol is mostly message-based, with the exception of the
            first few bytes of communication. To break symmetry, we refer to the
            peer that initiated the synchronisation session as{" "}
            <Def
              n="alfie"
              r="Alfie"
              preview={
                <>
                  <P>
                    <Def fake n="alfie">Alfie</Def>{" "}
                    refers to the peer that initiated a WGPS synchronisation
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
                    refers to the peer that accepted a WGPS synchronisation
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

          <PreviewScope>
            <P>
              The first byte each peer sends must be a natural number{" "}
              <M post=".">x {`\\`}leq 64</M> This sets the{" "}
              <DefValue n="peer_max_payload_size" r="maximum payload size" />
              {" "}
              of that peer to <M post=".">2^x</M> The{" "}
              <R n="peer_max_payload_size" />{" "}
              limits when the other peer may include <Rs n="Payload" />{" "}
              directly when transmitting <Rs n="Entry" />: when an{" "}
              <R n="Entry" />’s <R n="entry_payload_length" />{" "}
              is strictly greater than the <R n="peer_max_payload_size" />, its
              {" "}
              <R n="Payload" />{" "}
              may only be transmitted when explicitly requested.
            </P>
          </PreviewScope>

          <P>
            After this initial transmissions, the protocol becomes a purely
            message-based protocol. There are several kinds of messages, which
            the peers create, encode as byte strings, and transmit mostly
            independently from each other.
          </P>

          <P>
            The messages make use of the following <Rs n="resource_handle" />:
          </P>

          <Pseudocode n="sync_handle_defs">
            <Enum
              comment={
                <>
                  The different <Rs n="resource_handle" /> employed by the{" "}
                  <R n="wgps" />.
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
                      <Rb n="resource_handle" /> that controls the matching from
                      {" "}
                      <R n="Payload" /> transmissions to <R n="Payload" />{" "}
                      requests.
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "StaticTokenHandle",
                    "StaticTokenHandle",
                    "StaticTokenHandles",
                  ],
                  comment: (
                    <>
                      <Rb n="resource_handle" />{" "}
                      for ", rs("StaticToken"), " that peers need to transmit.
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
                  <R n="wgps" />.
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
                      <R n="d3rbsr" />.
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
                      <R n="d3rbsr" />.
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
                      <Rs n="OverlapHandle" />.
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
                      <Rs n="ReadCapabilityHandle" />.
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
                      <Rs n="PayloadRequestHandle" />.
                    </>
                  ),
                },
                {
                  tuple: true,
                  id: [
                    "StaticTokenChannel",
                    "StaticTokenChannel",
                    "StaticTokenChannels",
                  ],
                  comment: (
                    <>
                      <Rb n="logical_channel" /> for controlling the{" "}
                      <R n="handle_bind">binding</R> of new{" "}
                      <Rs n="StaticTokenHandle" />.
                    </>
                  ),
                },
              ]}
            />
          </Pseudocode>

          <Hsection n="sync_messages" title="Messages">
            <P>
              We now define the different kinds of messages. When we do not
              mention the <R n="logical_channel" />{" "}
              that messages of a particular kind use, then these messages are
              {" "}
              <Rs n="global_message" /> that do not belong to any{" "}
              <R n="logical_channel" />.
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
                they share, and provae read access for those interests.
                <Alj>TODO omit all message headings from the toc</Alj>
              </P>

              <Hsection
                n="sync_msg_PioBindHash"
                title={<Code>PioBindHash</Code>}
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
                  which are explicitly specified in the message.
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
                              "max_count",
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
                              "max_size",
                            ],
                            <R n="U64" />,
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

              <Hsection
                n="sync_msg_PioBindStaticToken"
                title={<Code>PioBindStaticToken</Code>}
              >
                <P>
                  The <R n="PioBindStaticToken" /> messages let peers{" "}
                  <R n="handle_bind" /> <Rs n="StaticToken" />{" "}
                  for later reference when transmitting <Rs n="Entry" />.
                </P>

                <Pseudocode n="sync_defs_PioBindStaticToken">
                  <StructDef
                    comment={
                      <>
                        <Rb n="handle_bind" /> a <R n="StaticToken" /> to a{" "}
                        <R n="StaticTokenHandle" />.
                      </>
                    }
                    id={["PioBindStaticToken", "PioBindStaticToken"]}
                    fields={[
                      {
                        commented: {
                          comment: (
                            <>
                              The <R n="StaticToken" /> to{" "}
                              <R n="handle_bind" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "static_token",
                              "PioBindStaticTokenStaticToken",
                              "static_tokens",
                            ],
                            <R n="StaticToken" />,
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
                              <R n="granted_namespace" /> of the corresponding
                              {" "}
                              <R n="read_capability" /> must match the{" "}
                              <R n="entry_namespace_id" /> of the{" "}
                              <R n="Entry" /> which the{" "}
                              <R n="PioBindStaticTokenStaticToken" />{" "}
                              authorises. The <R n="granted_area" />{" "}
                              of the corresponding <R n="read_capability" />
                              {" "}
                              must <R n="area_include" /> the <R n="Entry" />
                              {" "}
                              which the <R n="PioBindStaticTokenStaticToken" />
                              {" "}
                              authorises.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "clearance",
                              "PioBindStaticTokenClearance",
                              "clearances",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="PioBindStaticToken" /> messages use the{" "}
                  <R n="StaticTokenChannel" />.
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
                messages serve to transmit <Rs n="D3RangeFingerprint" />.
              </P>

              <P>
                For <Rs n="D3RangeEntrySet" />{" "}
                we need four different message type, in order to keep things
                streaming, interleavable, and adaptable to store mutation that
                happens concurrently to syncing:{" "}
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
                <R n="ReconciliationTerminatePayload" />{" "}
                message. Peers neither preannounce how many <Rs n="Entry" />
                {" "}
                they will send in each <R n="D3Range" />, nor how many{" "}
                <R n="Payload" /> bytes they will transmit in total per{" "}
                <R n="Entry" />.
              </P>

              <P>
                Peers <Em>must</Em>{" "}
                follow this cadence strictly, sending reconciliation-related
                {" "}
                <Sidenote
                  note={
                    <>
                      <R n="ReconciliationSendFingerprint" />,{" "}
                      <R n="ReconciliationAnnounceEntries" />,{" "}
                      <R n="ReconciliationSendEntry" />,{" "}
                      <R n="ReconciliationSendPayload" />, and
                      <R n="ReconciliationTerminatePayload" />.
                    </>
                  }
                >
                  messages
                </Sidenote>{" "}
                places strict constrains on the next reconciliation-related
                messages<Marginale>
                  All other kinds of messages remain unaffected and can be
                  freely interleaved, only the ordering of
                  reconciliation-related messages relative to each other is
                  restricted
                </Marginale>{" "}
                that may be sent:
              </P>

              <Ul>
                <Li>
                  every <R n="ReconciliationAnnounceEntries" />{" "}
                  must be followed by an <R n="ReconciliationSendEntry" />{" "}
                  message if and only if its{" "}
                  <R n="ReconciliationAnnounceEntriesIsEmpty" /> flag is{" "}
                  <Code>true</Code>,
                </Li>
                <Li>
                  every <R n="ReconciliationSendEntry" />{" "}
                  message must be followed by zero or more{" "}
                  <R n="ReconciliationSendPayload" />{" "}
                  messages, followed by exactly one{" "}
                  <R n="ReconciliationTerminatePayload" /> message, and
                </Li>
                <Li>
                  <R n="ReconciliationSendEntry" /> must only follow a{" "}
                  <R n="ReconciliationSendEntry" /> message whose{" "}
                  <R n="ReconciliationAnnounceEntriesIsEmpty" /> flag is{" "}
                  <Code>true</Code>, or a{" "}
                  <R n="ReconciliationTerminatePayload" />.
                </Li>
              </Ul>

              <P>
                There is a second concern that spans multiple of the
                reconciliation messages: peers should know when to proceed from
                {" "}
                <R n="d3_range_based_set_reconciliation" /> to{" "}
                <R n="sync_post_sync_forwarding">eager forwarding</R> of new
                {" "}
                <Rs n="Entry" />. Continuously tracking whether the responses
                you received to a <R n="D3RangeFingerprint" />{" "}
                have fully covered its <R n="D3RangeFingerprintRange" />{" "}
                is computationally inconvenient, so we allow for a cooperative
                approach instead: peers tell each other once they have fully
                covered a <R n="D3RangeFingerprintRange" /> they reply to.
              </P>

              <PreviewScope>
                <P>
                  To this end, we (implicitly) assign an id to certain messages
                  through the following mechanism: each peer tracks two numbers,
                  {" "}
                  <DefValue n="my_range_counter" /> and{" "}
                  <DefValue n="your_range_counter" />. Both are initialised to
                  {" "}
                  <M post=".">1</M> Whenever a peer <Em>sends</Em> either a{" "}
                  <R n="ReconciliationAnnounceEntries" /> message with{" "}
                  <R n="ReconciliationAnnounceEntriesWantResponse" /> set to
                  {" "}
                  <Code>true</Code> or a <R n="ReconciliationSendFingerprint" />
                  {" "}
                  message, it increments its{" "}
                  <R n="my_range_counter" />. Whenever it <Em>receives</Em>{" "}
                  such a message, it increments its{" "}
                  <R n="your_range_counter" />. When a messages causes one of
                  these values to be incremented, we call{" "}
                  <Sidenote
                    note={
                      <>
                        Both peers assign the same values to the same messages.
                      </>
                    }
                  >
                    the
                  </Sidenote>{" "}
                  value <Em>before</Em> incrementation the message's{" "}
                  <DefValue n="range_count" />.
                </P>

                <P>
                  Whenever a peer receives a message of some{" "}
                  <R n="range_count" />{" "}
                  <DefValue n="recon_send_fp_count" r="count" />, it may recurse
                  by producing a cover of smaller{" "}
                  <Rs n="D3Range" />. For each subrange of that cover, it sends
                  either a <R n="ReconciliationSendFingerprint" /> message or a
                  {" "}
                  <R n="ReconciliationAnnounceEntries" />{" "}
                  message. Each of these response messages contains the{" "}
                  <R n="recon_send_fp_count" />{" "}
                  as a field. They also contain a flag which is set to{" "}
                  <Code>true</Code>{" "}
                  only on the final of these covering messages. With this
                  information, peers can track relatively easily whether any
                  given range has been fully reconciled yet or not.
                </P>
              </PreviewScope>

              <P>
                For ease of presentation, we bundle these and other fields that
                are shared between <R n="ReconciliationSendFingerprint" /> and
                {" "}
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
                            The <R n="recon_send_fp_count" />{" "}
                            of the message this message is responding to. If
                            this message was not created in response to any
                            other message, this field is <M post=".">0</M>
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "covers",
                            "RangeInfoCovers",
                            "covers",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                    {
                      commented: {
                        comment: (
                          <>
                            Whether this message is the final message sent in
                            response to some other message. If this message is
                            not sent as a response at all, this field is{" "}
                            <Code>true</Code>.
                          </>
                        ),
                        dedicatedLine: true,
                        segment: [
                          [
                            "is_final",
                            "RangeInfoIsFinal",
                            "is_final",
                          ],
                          <R n="Bool" />,
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
                            "RangeInfoRangeSenderHandle",
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
                            "RangeInfoRangeReceiverHandle",
                            "receiver_handles",
                          ],
                          <R n="U64" />,
                        ],
                      },
                    },
                  ]}
                />
              </Pseudocode>

              <Hsection
                n="sync_msg_ReconciliationSendFingerprint"
                title={<Code>ReconciliationSendFingerprint</Code>}
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
                              <Rs n="LengthyEntry" /> the peer has in{"  "}
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
              >
                <P>
                  The <R n="ReconciliationAnnounceEntries" />{" "}
                  messages let peers begin transmission of their{" "}
                  <Rs n="LengthyEntry" /> in a <R n="D3Range" />{" "}
                  for range-based set reconciliation.
                </P>

                <Pseudocode n="sync_defs_ReconciliationAnnounceEntries">
                  <StructDef
                    comment={
                      <>
                        Prepare transmission of the <Rs n="LengthyEntry" />{" "}
                        a peer has in a <R n="D3Range" /> as part of{" "}
                        <R n="d3rbsr" />.
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
                  Actual transmission of the announced <Rs n="LengthyEntry" />
                  {" "}
                  in{" "}
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
                  <R n="ReconciliationChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_ReconciliationSendEntry"
                title={<Code>ReconciliationSendEntry</Code>}
              >
                <P>
                  The <R n="ReconciliationSendEntry" />{" "}
                  messages let peers transmit <Rs n="LengthyEntry" />{" "}
                  for range-based set reconciliation.
                </P>

                <Pseudocode n="sync_defs_ReconciliationSendEntry">
                  <StructDef
                    comment={
                      <>
                        Send a <R n="LengthyEntry" /> as part of{" "}
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
                              The <R n="LengthyEntry" /> itself.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "entry",
                              "ReconciliationSendEntryEntry",
                              "entry",
                            ],
                            <R n="LengthyEntry" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              A <R n="StaticTokenHandle" />,{" "}
                              <R n="handle_bind">bound</R>{" "}
                              by the sender of this message, which is{" "}
                              <R n="handle_bind">bound</R>{" "}
                              to the static part of the{" "}
                              <R n="ReconciliationSendEntryEntry" />’s{" "}
                              <R n="AuthorisationToken" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "static_token_handle",
                              "ReconciliationSendEntryStaticTokenHandle",
                              "static_token_handles",
                            ],
                            <R n="U64" />,
                          ],
                        },
                      },
                      {
                        commented: {
                          comment: (
                            <>
                              The dynamic part of the{" "}
                              <R n="ReconciliationSendEntryEntry" />’s{" "}
                              <R n="AuthorisationToken" />.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "ReconciliationSendEntryDynamicToken",
                              "ReconciliationSendEntryDynamicToken",
                              "ReconciliationSendEntryDynamicTokens",
                            ],
                            <R n="DynamicToken" />,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="ReconciliationSendEntry" /> messages use the{" "}
                  <R n="ReconciliationChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_ReconciliationSendPayload"
                title={<Code>ReconciliationSendPayload</Code>}
              >
                <P>
                  The <R n="ReconciliationSendPayload" />{" "}
                  messages let peers transmit (successive parts of) the
                  concatenation of the <R n="transform_payload">transformed</R>
                  {" "}
                  <Rs n="Payload" /> of <Rs n="Entry" />{" "}
                  immediately during range-based set reconciliation. The sender
                  can freely decide how many (including zero) bytes to eargerly
                  transmit, and it must respect the receiver’s{" "}
                  <R n="peer_max_payload_size" />.
                </P>

                <Pseudocode n="sync_defs_ReconciliationSendPayload">
                  <StructDef
                    comment={
                      <>
                        Send some <R n="transform_payload">transformed</R>{" "}
                        <R n="Payload" /> bytes as part of <R n="d3rbsr" />.
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
                              The number of transmitted bytes.
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
                              The bytes to transmit, a contiguous substring of
                              the result of applying <R n="transform_payload" />
                              {" "}
                              to the <R n="Payload" /> of the{" "}
                              <R n="ReconciliationSendEntry">previously sent</R>
                              {" "}
                              <R n="Entry" />{" "}
                              and concatenating the result into a single
                              bytestring.
                            </>
                          ),
                          dedicatedLine: true,
                          segment: [
                            [
                              "bytes",
                              "ReconciliationSendPayloadBytes",
                              "bytes",
                            ],
                            <ArrayType
                              count={<R n="ReconciliationSendPayloadAmount" />}
                            >
                              <R n="U8" />
                            </ArrayType>,
                          ],
                        },
                      },
                    ]}
                  />
                </Pseudocode>

                <P>
                  <Rb n="ReconciliationSendEntry" /> messages use the{" "}
                  <R n="ReconciliationChannel" />.
                </P>
              </Hsection>

              <Hsection
                n="sync_msg_ReconciliationTerminatePayload"
                title={<Code>ReconciliationTerminatePayload</Code>}
              >
                <P>
                  The <R n="ReconciliationTerminatePayload" />{" "}
                  messages let peers indicate that they will not send more
                  payload bytes for the current <R n="Entry" />{" "}
                  as part of set reconciliation. The messages further indicate
                  whether more <Rs n="LengthyEntry" />{" "}
                  will follow for the current <R n="D3Range" />.
                </P>

                <Pseudocode n="sync_defs_ReconciliationTerminatePayload">
                  <StructDef
                    comment={
                      <>
                        Signal the end of the current
                        <R n="Payload" /> transmission as part of{" "}
                        <R n="d3rbsr" />, and indicate whether another{" "}
                        <R n="LengthyEntry" />{" "}
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
                              Set to <Code>true</Code> if and only if no further
                              {" "}
                              <R n="ReconciliationSendEntry" />{" "}
                              message will be sent as part of reconciling the
                              current <R n="D3Range" />.
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
                  <R n="ReconciliationChannel" />.
                </P>
              </Hsection>
            </Hsection>
          </Hsection>
        </Hsection>

        {
          /*

                hsection("sync_data", "Data", [
                    pinformative("Outside of ", link_name("d3_range_based_set_reconciliation", "3d range-based set reconciliation"), " peers can unsolicitedly push <Rs n="Entry"/> and <Rs n="Payload"/> to each other, and they can request specific <Rs n="Payload"/>."),

                    pseudocode(
                        new Struct({
                            id: "DataSendEntry",
                            comment: ["Transmit an ", r("AuthorisedEntry"), " to the other peer, and optionally prepare transmission of its <R n="Payload"/>."],
                            fields: [
                                {
                                    id: "DataSendEntryEntry",
                                    name: "entry",
                                    comment: ["The <R n="Entry"/> to transmit."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "DataSendEntryStatic",
                                    name: "static_token_handle",
                                    comment: ["A <R n="StaticTokenHandle"/> <R n="handle_bind">bound</R> to the <R n="StaticToken"/> of the <R n="Entry"/> to transmit."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSendEntryDynamic",
                                    name: "dynamic_token",
                                    comment: ["The <R n="DynamicToken"/> of the <R n="Entry"/> to transmit."],
                                    rhs: r("DynamicToken"),
                                },
                                {
                                    id: "DataSendEntryOffset",
                                    name: "offset",
                                    comment: ["The offset in the <R n="Payload"/> in bytes at which <R n="Payload"/> transmission will begin. If this is equal to the <R n="Entry"/>’s <R n="entry_payload_length"/>, the <R n="Payload"/> will not be transmitted."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("DataSendEntry"), " messages let peers transmit <Rs n="LengthyEntry"/> outside of <R n="d3rbsr"/>. They further set up later <R n="Payload"/> transmissions (via ", r("DataSendPayload"), " messages)."),

                    pinformative("To map <R n="Payload"/> transmissions to <Rs n="Entry"/>, each peer maintains a piece of state: an <R n="Entry"/> ", def_value("currently_received_entry"), marginale(["These are used by ", r("DataSendPayload"), " messages."]), ". When receiving a ", r("DataSendEntry"), " message, a peer sets its ", r("currently_received_entry"), " to the received ", r("DataSendEntryEntry"), "."),

                    pinformative("Initially, ", r("currently_received_entry"), " is ", code(function_call(r("default_entry"), r("sync_default_namespace_id"), r("sync_default_subspace_id"), r("sync_default_payload_digest"))), "."),

                    pinformative(R("DataSendEntry"), " messages use the ", r("DataChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataSendPayload",
                            comment: ["Transmit some ", link_name("sync_payloads_transform", "transformed"), " <R n="Payload"/> bytes."],
                            fields: [
                                {
                                    id: "DataSendPayloadAmount",
                                    name: "amount",
                                    comment: ["The number of transmitted bytes."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSendPayloadBytes",
                                    name: "bytes",
                                    comment: [r("DataSendPayloadAmount"), " many bytes, a substring of the bytes obtained by applying ", r("transform_payload"), " to the <R n="Payload"/> to be transmitted."],
                                    rhs: ["[", hl_builtin("u8"), "]"],
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("DataSendPayload"), " messages let peers transmit (parts of) ", link_name("sync_payloads_transform", "transformed"), " <Rs n="Payload"/>."),

                    pinformative("Each ", r("DataSendPayload"), " message transmits a successive part of the result of applying ", r("transform_payload"), " to the <R n="Payload"/> of the ", r("currently_received_entry"), " of the receiver. The WGPS does not concern itself with how (or whether) the receiver can reconstruct the original <R n="Payload"/> from these chunks of transformed bytes, that is a detail of choosing a suitable transformation function."),

                    pinformative(R("DataSendPayload"), " messages use the ", r("DataChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataSetMetadata",
                            comment: ["Express preferences for <R n="Payload"/> transfer in the intersection of two <Rs n="AreaOfInterest"/>."],
                            fields: [
                                {
                                    id: "DataSetMetadataSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", <R n="handle_bind">bound</R> by the sender of this message."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSetMetadataReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", <R n="handle_bind">bound</R> by the receiver of this message."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSetMetadataEagerness",
                                    name: "is_eager",
                                    comment: ["Whether the other peer should eagerly forward <Rs n="Payload"/> in this intersection."],
                                    rhs: r("Bool"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("DataSetMetadata"), " messages let peers express whether the other peer should eagerly push <Rs n="Payload"/> from the intersection of two <Rs n="AreaOfInterest"/>, or whether they should send only ", r("DataSendEntry"), " messages for that intersection."),

                    pinformative(R("DataSetMetadata"), " messages are not binding, they merely present an optimisation opportunity. In particular, they allow expressing the ", code("Prune"), " and ", code("Graft"), " messages of the ", link("epidemic broadcast tree protocol", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataBindPayloadRequest",
                            comment: [<Rb n="handle_bind"/> an <R n="Entry"/> to a ", r("PayloadRequestHandle"), " and request transmission of its <R n="Payload"/> from an offset."],
                            fields: [
                                {
                                    id: "DataBindPayloadRequestEntry",
                                    name: "entry",
                                    comment: ["The <R n="Entry"/> to request."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "DataBindPayloadRequestOffset",
                                    name: "offset",
                                    comment: ["The offset in the <R n="Payload"/> starting from which the sender would like to receive the <R n="Payload"/> bytes."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataBindPayloadRequestCapability",
                                    name: "capability",
                                    comment: ["A ", r("resource_handle"), " for a ", r("ReadCapability"), " <R n="handle_bind">bound</R> by the sender that grants them read access to the <R n="handle_bind">bound</R> <R n="Entry"/>."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),

                    pinformative([
                        marginale(["If the receiver of a ", r("DataBindPayloadRequest"), " does not have the requested <R n="Payload"/> and does not plan to obtain it in the future, it should signal so by ", r("handle_free", "freeing"), " the ", r("PayloadRequestHandle"), "."]),
                        "The ", r("DataBindPayloadRequest"), " messages let peers explicitly request <Rs n="Payload"/>, by binding a ", r("PayloadRequestHandle"), " to the specified ", r("DataBindPayloadRequestEntry"), " and ", r("DataBindPayloadRequestOffset"), ". The other peer is expected to then transmit the <R n="Payload"/>, starting at the specified ", r("DataBindPayloadRequestOffset"), ". The request contains a ", r("ReadCapabilityHandle"), " to a ", r("ReadCapability"), " whose <R n="granted_area"/> must ", r("area_include"), " the requested <R n="Entry"/>.",
                    ]),

                    pinformative(R("DataBindPayloadRequest"), " messages use the ", r("PayloadRequestChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataReplyPayload",
                            comment: ["Set up the state for replying to a ", r("DataBindPayloadRequest"), " message."],
                            fields: [
                                {
                                    id: "DataReplyPayloadHandle",
                                    name: "handle",
                                    comment: ["The ", r("PayloadRequestHandle"), " to which to reply."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("DataReplyPayload"), " messages let peers reply to ", r("DataBindPayloadRequest"), " messages, by indicating that future ", r("DataSendPayload"), " messages will pertain to the requested <R n="Payload"/>. More precisely, upon receiving a ", r("DataReplyPayload"), " message, a peer sets its ", r("currently_received_entry"), " value to that to which the message", apo, "s ", r("DataReplyPayloadHandle"), " is <R n="handle_bind">bound</R>."),

                    pinformative(R("DataReplyPayload"), " messages use the ", r("DataChannel"), "."),
                ]),
                hsection("sync_control", "Resource Control", [
                    pinformative("Finally, we maintain <Rs n="logical_channel"/> and ", r("handle_free"), " <Rs n="resource_handle"/>, as explained in the ", link_name("resources_message_types", "resource control document"), "."),

                    pseudocode(
                        new Struct({
                            id: "ControlIssueGuarantee",
                            comment: ["Make a binding promise of available buffer capacity to the other peer."],
                            fields: [
                                {
                                    id: "ControlIssueGuaranteeAmount",
                                    name: "amount",
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ControlIssueGuaranteeChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),

                        new Struct({
                            id: "ControlAbsolve",
                            comment: ["Allow the other peer to reduce its total buffer capacity by ", r("ControlAbsolveAmount"), "."],
                            fields: [
                                {
                                    id: "ControlAbsolveAmount",
                                    name: "amount",
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ControlAbsolveChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),

                        new Struct({
                            id: "ControlPlead",
                            comment: ["Ask the other peer to send an ", r("ControlAbsolve"), " message such that the receiver remaining ", rs("guarantee"), " will be ", r("ControlPleadTarget"), "."],
                            fields: [
                                {
                                    id: "ControlPleadTarget",
                                    name: "target",
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ControlPleadChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),

                        new Struct({
                            id: "ControlLimitSending",
                            comment: [
                              "Promise to the other peer an upper bound on the number of bytes of messages that you will send on some <R n="logical_channel"/>.",
                            ],
                            fields: [
                              {
                                id: "ControlLimitSendingBound",
                                name: "bound",
                                rhs: r("U64"),
                              },
                              {
                                id: "ControlLimitSendingChannel",
                                name: "channel",
                                rhs: r("LogicalChannel"),
                              },
                            ],
                          }),

                          new Struct({
                            id: "ControlLimitReceiving",
                            comment: [
                              "Promise to the other peer an upper bound on the number of bytes of messages that you will still receive on some <R n="logical_channel"/>.",
                            ],
                            fields: [
                              {
                                id: "ControlLimitReceivingBound",
                                name: "bound",
                                rhs: r("U64"),
                              },
                              {
                                id: "ControlLimitReceivingChannel",
                                name: "channel",
                                rhs: r("LogicalChannel"),
                              },
                            ],
                          }),

                        new Struct({
                            id: "ControlAnnounceDropping",
                            comment: ["Notify the other peer that you have started dropping messages and will continue to do so until you receives a ", r("ControlApologise"), " message. Note that you must send any outstanding ", rs("guarantee"), " of the <R n="logical_channel"/> before sending a ", r("ControlAnnounceDropping"), " message."],
                            fields: [
                                {
                                    id: "ControlAnnounceDroppingChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),

                        new Struct({
                            id: "ControlApologise",
                            comment: ["Notify the other peer that it can stop dropping messages of this <R n="logical_channel"/>."],
                            fields: [
                                {
                                    id: "ControlApologiseChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),

                        new Struct({
                            id: "ControlFreeHandle",
                            name: "ControlFree",
                            comment: ["Ask the other peer to ", r("handle_free"), " a ", r("resource_handle"), "."],
                            fields: [
                                {
                                    id: "ControlFreeHandleHandle",
                                    name: "handle",
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ControlFreeHandleMine",
                                    comment: ["Indicates whether the peer sending this message is the one who created the ", r("ControlFreeHandleHandle"), " (<Code>true</Code>) or not (<Code>false</Code>)."],
                                    name: "mine",
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "ControlFreeHandleType",
                                    name: "handle_type",
                                    rhs: r("HandleType"),
                                },
                            ],
                        }),
                    ),
                ]),
            ]),

            hsection("sync_encodings", "Encodings", [
                pinformative("We now describe how to encode the various messages of the WGPS. When a peer receives bytes it cannot decode, this is an error."),

                hsection("sync_encoding_params", "Parameters", [
                    pinformative("To be able to encode messages, we require certain properties from the ", link_name("sync_parameters", "protocol parameters"), ":"),

                    lis(
                        preview_scope(
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_group_member"}), " for ", r("PsiGroup"), ".",
                        ),
                        preview_scope(
                            marginale(["When using the <R n="McEnumerationCapability"/> type, you can use ", r("encode_mc_subspace_capability"), ", but omitting the encoding of the <R n="enumcap_namespace"/>."]),
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_subspace_capability"}), " for ", rs("SubspaceCapability"), " of known ", r("subspace_granted_namespace"), ".",
                        ),
                        preview_scope(
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_sync_subspace_signature"}), " for ", r("sync_subspace_signature"), ".",
                        ),
                        preview_scope(
                            marginale(["When using the <R n="Capability"/> type, you can use ", r("encode_mc_capability"), ", but omitting the encoding of the ", r("communal_cap_namespace"), "."]),
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_read_capability"}), " for <Rs n="ReadCapability"/> of known <R n="granted_namespace"/> and whose <R n="granted_area"/> is <R n="area_include_area">included</R> in some known <R n="Area"/>.",
                        ),
                        preview_scope(
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_sync_signature"}), " for ", r("sync_signature"), ".",
                        ),
                        preview_scope(
                            marginale(["Used indirectly when encoding <Rs n="Entry"/>, <Rs n="Area"/>, and <Rs n="D3Range"/>."]),
                            "An <R n="encoding_function"/> for <R n="SubspaceId"/>.",
                        ),
                        preview_scope(
                            marginale(["The total order makes <Rs n="D3Range"/> meaningful, the least element and successors ensure that every <R n="Area"/> can be expressed as an equivalent <R n="D3Range"/>."]),
                            "A ", link("total order", "https://en.wikipedia.org/wiki/Total_order"), " on <R n="SubspaceId"/> with least element ", r("sync_default_subspace_id"), ", in which for every non-maximal <R n="SubspaceId"/> ", def_value({id: "subspace_successor_s", singular: "s"}), " there exists a successor ", def_value({id: "subspace_successor_t", singular: "t"}), " such that ", r("subspace_successor_s"), " is less than ", r("subspace_successor_t"), " and no other <R n="SubspaceId"/> is greater than ", r("subspace_successor_s"), " and less than ", r("subspace_successor_t"), ".",
                        ),
                        preview_scope(
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_static_token"}), " for <R n="StaticToken"/>.",
                        ),
                        preview_scope(
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_dynamic_token"}), " for <R n="DynamicToken"/>.",
                        ),
                        preview_scope(
                            "An <R n="encoding_function"/> ", def_parameter_fn({id: "encode_fingerprint"}), " for <R n="Fingerprint"/>.",
                        ),
                    ),

                    pinformative("We can now define the encodings for all messages."),
                ]),

                hsection("sync_encode_commitment", "Commitment Scheme and Private Area Intersection", [
                    pinformative(
                        "The encoding of a ", r("CommitmentReveal"), " message ", def_value({id: "enc_commitment_reveal", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("000")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("000")],
                                    ["message kind"],
                                ),
                                bitfieldrow_unused(2),
                            ),
                            [[
                                field_access(r("enc_commitment_reveal"), "CommitmentRevealNonce"), " as a big-endian, unsigned, ", r("challenge_length"), "-byte integer"
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("PaiBindFragment"), " message ", def_value({id: "enc_pai_bind_fragment", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("000")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("001")],
                                    ["message kind"],
                                ),
                                new BitfieldRow(
                                    1,
                                    [
                                        code("1"), " ", r("iff"), " ", field_access(r("enc_pai_bind_fragment"), "PaiBindFragmentIsSecondary"),
                                    ]
                                ),
                                bitfieldrow_unused(1),
                            ),
                            [[
                                code(function_call(r("encode_group_member"), field_access(r("enc_pai_bind_fragment"), "PaiBindFragmentGroupMember"))),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("PaiReplyFragment"), " message ", def_value({id: "enc_pai_reply_fragment", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("000")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("010")],
                                    ["message kind"],
                                ),
                                two_bit_int(6, field_access(r("enc_pai_reply_fragment"), "PaiReplyFragmentHandle")),
                            ),
                            [[
                                field_access(r("enc_pai_reply_fragment"), "PaiReplyFragmentHandle"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("enc_pai_reply_fragment"), "PaiReplyFragmentHandle"))), "-byte integer",
                            ]],
                            [[
                                code(function_call(r("encode_group_member"), field_access(r("enc_pai_reply_fragment"), "PaiReplyFragmentGroupMember"))),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("PaiRequestSubspaceCapability"), " message ", def_value({id: "enc_pai_request_cap", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("000")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("011")],
                                    ["message kind"],
                                ),
                                two_bit_int(6, field_access(r("enc_pai_request_cap"), "PaiRequestSubspaceCapabilityHandle")),
                            ),
                            [[
                                field_access(r("enc_pai_request_cap"), "PaiRequestSubspaceCapabilityHandle"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("enc_pai_request_cap"), "PaiRequestSubspaceCapabilityHandle"))), "-byte integer",
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("PaiReplySubspaceCapability"), " message ", def_value({id: "enc_pai_reply_cap", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("000")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message kind"],
                                ),
                                two_bit_int(6, field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilityHandle")),
                            ),
                            [[
                                field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilityHandle"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilityHandle"))), "-byte integer",
                            ]],
                            [[
                                code(function_call(r("encode_subspace_capability"), field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilityCapability"))), " — the known <R n="granted_namespace"/> is the <R n="NamespaceId"/> of the ", r("fragment"), " corresponding to ", field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilityHandle"),
                            ]],
                            [[
                                code(function_call(r("encode_sync_subspace_signature"), field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilitySignature"))),
                            ]],
                        ),
                    ),

                ]),

                hsection("sync_encode_setup", "Setup", [
                    pinformative(
                        "Let ", def_value({id: "enc_setup_read", singular: "m"}), " be a ", r("SetupBindReadCapability"), " message, let ", def_value({id: "enc_setup_read_granted_area", singular: "granted_area"}), " be the <R n="granted_area"/> of ", field_access(r("enc_setup_read"), "SetupBindReadCapabilityCapability"), ", let ", def_value({id: "enc_setup_read_frag", singular: "frag"}), " be the ", r("fragment"), " corresponding to ", field_access(r("enc_setup_read"), "SetupBindReadCapabilityHandle"), ", and let ", def_value({id: "enc_setup_read_pre", singular: "pre"}), " be the <R n="Path"/> of ", r("enc_setup_read_frag"), ".",
                    ),

                    pinformative("Define ", def_value({id: "enc_setup_read_outer", singular: "out"}), " as the <R n="Area"/> with", lis(
                        [
                            field_access(r("enc_setup_read_outer"), "AreaSubspace"), " is ", field_access(r("enc_setup_read_granted_area"), "AreaSubspace"), " if ", r("enc_setup_read_frag"), " is a ", r("fragment_primary"), " ", r("fragment"), ", and ", r("area_any"), ", otherwise,"
                        ],
                        [
                            field_access(r("enc_setup_read_outer"), "AreaPath"), " is ", r("enc_setup_read_pre"), ", and"
                        ],
                        [
                            field_access(r("enc_setup_read_outer"), "AreaTime"), " is an ", r("open_range", "open"), " ", r("TimeRange"), " of ", r("TimeRangeStart"), " zero."
                        ],
                    )),

                    pinformative(
                        "Then, the encoding of ", r("enc_setup_read"), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("001")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    2,
                                    [code("00")],
                                    ["message kind"],
                                ),
                                bitfieldrow_unused(1),
                                two_bit_int(6, field_access(r("enc_setup_read"), "SetupBindReadCapabilityHandle")),
                            ),
                            [[
                                field_access(r("enc_setup_read"), "SetupBindReadCapabilityHandle"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("enc_setup_read"), "SetupBindReadCapabilityHandle"))), "-byte integer",
                            ]],
                            [[
                                code(function_call(r("encode_read_capability"), field_access(r("enc_setup_read"), "SetupBindReadCapabilityCapability"))), " — the known <R n="granted_namespace"/> is the <R n="NamespaceId"/> of ", r("enc_setup_read_frag"), ", and the known ", r("area_include_area", "including"), " <R n="Area"/> is ", r("enc_setup_read_outer"),
                            ]],
                            [[
                                code(function_call(r("encode_sync_signature"), field_access(r("enc_setup_read"), "SetupBindReadCapabilitySignature"))),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("SetupBindAreaOfInterest"), " message ", def_value({id: "enc_setup_aoi", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("001")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    2,
                                    [code("01")],
                                    ["message kind"],
                                ),
                                new BitfieldRow(
                                    1,
                                    [
                                        code("1"), " ", r("iff"), " ", code(field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_count"), " != 0"), " or ", code(field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_size"), " != 0"),
                                    ],
                                    [
                                        inclusion_flag_remark([field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_count"), " and ", field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_size")]),
                                    ],
                                ),
                                two_bit_int(6, field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestCapability")),
                            ),
                            [[
                                field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestCapability"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestCapability"))), "-byte integer",
                            ]],
                            [[
                                function_call(
                                    r("encode_area_in_area"),
                                    field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_area"),
                                    r("enc_setup_aoi_outer"),
                                ), ", where ", def_value({id: "enc_setup_aoi_outer", singular: "out"}), " is the <R n="granted_area"/> of the <R n="read_capability"/> to which ", field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestCapability"), " is ", r("handle_bind", "bound"),
                            ]],
                        ),
                        "If ", code(field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_count"), " != 0"), " or ", code(field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_size"), " != 0"), ", this is followed by the concatenation of:",

                        encodingdef(
                            new Bitfields(
                                two_bit_int(0, field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_count")),
                                two_bit_int(2, field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_size")),
                                bitfieldrow_unused(4),
                            ),
                            [[
                                field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_count"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_count"))), "-byte integer",
                            ]],
                            [[
                                field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_size"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestAOI"), "aoi_size"))), "-byte integer",
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("SetupBindStaticToken"), " message ", def_value({id: "enc_setup_static", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("001")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    2,
                                    [code("10")],
                                    ["message kind"],
                                ),
                               bitfieldrow_unused(3),
                            ),
                            [[
                                function_call(r("encode_static_token"), field_access(r("enc_setup_static"), "SetupBindStaticTokenToken")),
                            ]],
                        ),
                    ),

                ]),

                hsection("sync_encode_recon", "Reconciliation", [
                    pinformative(
                        "Successive reconciliation messages often concern related <Rs n="D3Range"/> and <Rs n="Entry"/>. We exploit this for more efficient encodings by allowing to specify <Rs n="D3Range"/> and <Rs n="Entry"/> in relation to the previously sent one. To allow for this optimization, peers need to track the following pieces of state:",

                        lis(
                            [
                                "A <R n="D3Range"/> ", def_value({id: "sync_enc_prev_range", singular: "prev_range"}), ", which is updated every time after proccessing a <R n="ReconciliationSendFingerprint"/> or <R n="ReconciliationAnnounceEntries"/> message to the message’s <R n="ReconciliationSendFingerprintRange"/>. The initial value is ", code(function_call(r("default_3d_range"), r("sync_default_subspace_id"))), "."
                            ],
                            [
                                "An ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_prev_sender", singular: "prev_sender_handle"}), ", which is updated every time after proccessing a <R n="ReconciliationSendFingerprint"/> or <R n="ReconciliationAnnounceEntries"/> message to the message’s ", r("ReconciliationSendFingerprintSenderHandle"), ". The initial value is ", code("0"), "."
                            ],
                            [
                                "An ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_prev_receiver", singular: "prev_receiver_handle"}), ", which is updated every time after proccessing a <R n="ReconciliationSendFingerprint"/> or <R n="ReconciliationAnnounceEntries"/> message to the message’s ", r("ReconciliationSendFingerprintReceiverHandle"), ". The initial value is ", code("0"), "."
                            ],
                            [
                                "An <R n="Entry"/> ", def_value({id: "sync_enc_prev_entry", singular: "prev_entry"}), ", which is updated every time after proccessing a <R n="ReconciliationSendEntry"/> message to the <R n="LengthyEntry"/> of the message’s <R n="ReconciliationSendEntryEntry"/>. The initial value is ", code(function_call(r("default_entry"), r("sync_default_namespace_id"), r("sync_default_subspace_id"), r("sync_default_payload_digest"))), "."
                            ],
                            [
                                "A <R n="StaticTokenHandle"/> ", def_value({id: "sync_enc_prev_token", singular: "prev_token"}), ", which is updated every time after proccessing a <R n="ReconciliationSendEntry"/> message to the message’s ", r("ReconciliationSendEntryStaticTokenHandle"), ". The initial value is ", code("0"), "."
                            ],
                        ),
                    ),

                    pinformative(
                        "Given two <Rs n="AreaOfInterestHandle"/> ", def_value({id: "aoi2range1", singular: "aoi1"}), " and ", def_value({id: "aoi2range2", singular: "aoi2"}), ", we define ", code(function_call(def_fn({id: "aoi_handles_to_3drange"}), r("aoi2range1"), r("aoi2range2"))), " as the <R n="D3Range"/> that ", rs("d3_range_include"), " the same <Rs n="Entry"/> as the ", r("area_intersection"), " of the ", rs("aoi_area"), " of the <Rs n="AreaOfInterest"/> to which ", r("aoi2range1"), " and ", r("aoi2range2"), " are <R n="handle_bind">bound</R>."
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a <R n="ReconciliationSendFingerprint"/> message ", def_value({id: "enc_recon_fp", singular: "m"}), " starts with a bitfield:",
                    ),

                    encodingdef(
                        new Bitfields(
                            new BitfieldRow(
                                3,
                                [code("010")],
                                ["message category"],
                            ),
                            new BitfieldRow(
                                1,
                                [code("0")],
                                ["message kind"],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintFingerprint"), " == ", function_call(r("fingerprint_finalise"), r("fingerprint_neutral"))),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintRange"), " will be encoded relative to ", r("sync_enc_prev_range"),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintSenderHandle"), " == ", r("sync_enc_prev_sender")),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintReceiverHandle"), " == ", r("sync_enc_prev_receiver")),
                                ],
                            ),
                            two_bit_int(8, field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintSenderHandle"), [
                                code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintSenderHandle"), " == ", r("sync_enc_prev_sender")),
                            ]),
                            two_bit_int(10, field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintReceiverHandle"), [
                                code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintReceiverHandle"), " == ", r("sync_enc_prev_receiver")),
                            ]),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintCovers"), " != ", r("covers_none")),
                                ],
                            ),
                            bitfieldrow_unused(1),
                            two_bit_int(14, field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintCovers"), [
                                code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintCovers"), " != ", r("covers_none")),
                            ]),
                        ),
                    ),

                    pinformative("This is followed by the concatenation of:"),

                    encodingdef(
                        [[
                            encode_two_bit_int(
                                field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintCovers"),
                                [code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintCovers"), " == ", r("covers_none"))],
                            ),
                        ]],
                        [[
                            encode_two_bit_int(
                                field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintSenderHandle"),
                                [code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintSenderHandle"), " == ", r("sync_enc_prev_sender"))],
                            ),
                        ]],
                        [[
                            encode_two_bit_int(
                                field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintReceiverHandle"),
                                [code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintReceiverHandle"), " == ", r("sync_enc_prev_receiver"))],
                            ),
                        ]],
                        [[
                            code(function_call(r("encode_fingerprint"), field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintFingerprint"))), ", or the empty string, if ", code(field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintFingerprint"), " == ", function_call(r("fingerprint_finalise"), r("fingerprint_neutral"))),
                        ]],
                        [
                            [
                                "either ", code(function_call(r("encode_3drange_relative_3drange"), field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintRange"), r("sync_enc_prev_range"))), ", or ", code(function_call(r("encode_3drange_relative_3drange"), field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintRange"), function_call(r("aoi_handles_to_3drange"), field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintSenderHandle"), field_access(r("enc_recon_fp"), "ReconciliationSendFingerprintReceiverHandle")))),
                            ],
                            [
                                "Must match bit 5 of the first bitfield."
                            ],
                        ],
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a <R n="ReconciliationAnnounceEntries"/> message ", def_value({id: "enc_recon_announce", singular: "m"}), " is the concatenation of:",
                    ),

                    encodingdef(
                        new Bitfields(
                            new BitfieldRow(
                                3,
                                [code("010")],
                                ["message category"],
                            ),
                            new BitfieldRow(
                                1,
                                [code("1")],
                                ["message kind"],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesWantResponse"), " == ", code("true")),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesRange"), " will be encoded relative to ", r("sync_enc_prev_range"),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesSenderHandle"), " == ", r("sync_enc_prev_sender")),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesReceiverHandle"), " == ", r("sync_enc_prev_receiver")),
                                ],
                            ),
                            two_bit_int(8, field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesSenderHandle"), [
                                code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesSenderHandle"), " == ", r("sync_enc_prev_sender")),
                            ]),
                            two_bit_int(10, field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesReceiverHandle"), [
                                code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesReceiverHandle"), " == ", r("sync_enc_prev_receiver")),
                            ]),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesIsEmpty"), " == ", code("true")),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesWillSort"), " == ", code("true")),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " != ", r("covers_none")),
                                ],
                            ),
                            bitfieldrow_unused(1),
                        ),
                    ),

                    pinformative("If ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " != ", r("covers_none")), ", this is followed by:"),

                    encodingdef(
                        new Bitfields(
                            new BitfieldRow(
                                8,
                                [
                                    div(
                                        code("11111111"), " if the length of ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " is greater or equal to 2^32,"
                                    ),
                                    div(
                                        code("11111110"), " if the length of ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " is greater or equal to 2^16,"
                                    ),
                                    div(
                                        code("11111101"), " if the length of ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " is greater or equal to 256,"
                                    ),
                                    div(
                                        code("11111100"), " if the length of ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " is greater or equal to 252, or"
                                    ),
                                    div(
                                        "the length of ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " otherwise."
                                    ),
                                ],
                            ),
                        ),
                    ),

                    pinformative("This is followed by:"),

                    encodingdef(
                        [[
                            encode_two_bit_int(["the length of ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers")], ["the length of ", field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesCovers"), " is less than or equal to 251"]),
                        ]],
                        [[
                            encode_two_bit_int(
                                field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesSenderHandle"),
                                [code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesSenderHandle"), " == ", r("sync_enc_prev_sender"))],
                            ),
                        ]],
                        [[
                            encode_two_bit_int(
                                field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesReceiverHandle"),
                                [code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesReceiverHandle"), " == ", r("sync_enc_prev_receiver"))],
                            ),
                        ]],
                        [
                            [
                                "either ", code(function_call(r("encode_3drange_relative_3drange"), field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesRange"), r("sync_enc_prev_range"))), ", or ", code(function_call(r("encode_3drange_relative_3drange"), field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesRange"), function_call(r("aoi_handles_to_3drange"), field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesSenderHandle"), field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesReceiverHandle")))),
                            ],
                            [
                                "Must match bit 5 of the bitfield."
                            ],
                        ],
                    ),

                    hr(),

                    pinformative(
                        "The WGPS mandates a strict cadence of <R n="ReconciliationAnnounceEntries"/> messages followed by <R n="ReconciliationSendEntry"/> messages, there are no points in time where it would be valid to send both. Hence, their encodings need not be distinguishable."
                    ),

                    pinformative(
                        "When it is possible to receive a <R n="ReconciliationSendEntry"/> message, denote the preceeding <R n="ReconciliationAnnounceEntries"/> message by ", def_value({id: "sync_enc_rec_announced", singular: "announced"}), ".",
                    ),

                    pinformative(
                        "The encoding of a <R n="ReconciliationSendEntry"/> message ", def_value({id: "enc_recon_entry", singular: "m"}), " starts with a bitfield:",
                    ),

                    encodingdef(
                        new Bitfields(
                            new BitfieldRow(
                                3,
                                [code("010")],
                                ["message category"],
                            ),
                            new BitfieldRow(
                                1,
                                [code("1")],
                                ["message kind"],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle"), " == ", code("sync_enc_prev_token")),
                                ],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", field_access(r("enc_recon_entry"), "ReconciliationSendEntryEntry"), " will be encoded relative to ", r("sync_enc_prev_entry"),
                                ],
                            ),
                            two_bit_int(6, field_access(field_access(r("enc_recon_entry"), "ReconciliationSendEntryEntry"), "lengthy_entry_available")),
                        ),
                    ),

                    pinformative(
                        "If bit 4 of this initial bitfield is ", code("0"), ", this is followed by the following byte:", lis(
                            [
                                "If ", code(field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle"), " < 63"), ", then ", field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle"), " encoded as a single byte,"
                            ],
                            [
                                "else, if ", code(function_call(r("compact_width"), field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle")), " == 1"), ", then the byte ", code("0x3f"), ","
                            ],
                            [
                                "else, if ", code(function_call(r("compact_width"), field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle")), " == 2"), ", then the byte ", code("0x7f"), ","
                            ],
                            [
                                "else, if ", code(function_call(r("compact_width"), field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle")), " == 4"), ", then the byte ", code("0xbf"), ","
                            ],
                            [
                                "else, the byte ", code("0xff"), ","
                            ],
                        ),
                    ),

                    pinformative("If bit 4 of the initial bitfield is ", code("0"), " and ", code(field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle"), " >= 63"), ", this is followed by ", field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("enc_recon_entry"), "ReconciliationSendEntryStaticTokenHandle"))), "-byte integer."),

                    pinformative("This is followed by the concatenation of:"),

                    encodingdef(
                        [[
                            encode_two_bit_int(field_access(field_access(r("enc_recon_entry"), "ReconciliationSendEntryEntry"), "lengthy_entry_available")),
                        ]],
                        [[
                            code(function_call(r("encode_dynamic_token"), field_access(r("enc_recon_entry"), "ReconciliationSendEntryDynamicToken"))),
                        ]],
                        [
                            [
                                "either ", code(function_call(
                                    r("encode_entry_relative_entry"),
                                    field_access(field_access(r("enc_recon_entry"), "ReconciliationSendEntryEntry"), "lengthy_entry_entry"),
                                    r("sync_enc_prev_entry"),
                                    )), ", or ", code(function_call(
                                        r("encode_entry_in_namespace_3drange"),
                                        field_access(field_access(r("enc_recon_entry"), "ReconciliationSendEntryEntry"), "lengthy_entry_entry"),
                                        field_access(r("sync_enc_rec_announced"), "ReconciliationAnnounceEntriesRange"),
                                        function_call(r("handle_to_namespace_id"), field_access(r("sync_enc_rec_announced"), "ReconciliationAnnounceEntriesReceiverHandle")),
                                    )),
                            ],
                            [
                                "Must match bit 5 of the initial bitfield."
                            ],
                        ],
                    ),

                    hr(),

                    pinformative(
                        r("ReconciliationSendPayload"), " and ", r("ReconciliationTerminatePayload"), " messages need to be distinguishable from each other, but not from <R n="ReconciliationAnnounceEntries"/> or <R n="ReconciliationSendEntry"/> messages."
                    ),

                    pinformative(
                        "The encoding of a ", r("ReconciliationSendPayload"), " message ", def_value({id: "enc_recon_send_payload", singular: "m"}), " is the concatenation of:",
                    ),

                    encodingdef(
                        new Bitfields(
                            new BitfieldRow(
                                3,
                                [code("010")],
                                ["message category"],
                            ),
                            new BitfieldRow(
                                2,
                                [code("10")],
                                ["message kind"],
                            ),
                            bitfieldrow_unused(1),
                            two_bit_int(6, field_access(r("enc_recon_send_payload"), "ReconciliationSendPayloadAmount")),
                        ),
                        [[
                            encode_two_bit_int(field_access(r("enc_recon_send_payload"), "ReconciliationSendPayloadAmount")),
                        ]],
                        [[
                            field_access(r("enc_recon_send_payload"), "ReconciliationSendPayloadBytes"),
                        ]],
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ReconciliationTerminatePayload"), " message is a single byte:",
                    ),

                    encodingdef(
                        new Bitfields(
                            new BitfieldRow(
                                3,
                                [code("010")],
                                ["message category"],
                            ),
                            new BitfieldRow(
                                2,
                                [code("11")],
                                ["message kind"],
                            ),
                            new BitfieldRow(
                                1,
                                [
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationTerminatePayloadFinal"), " == ", code("true")),
                                ],
                            ),
                            bitfieldrow_unused(2),
                        ),
                    ),
                ]),

                hsection("sync_encode_data", "Data", [
                    pinformative(
                        "When encoding <Rs n="Entry"/> for ", r("DataSendEntry"), " and ", r("DataBindPayloadRequest"), " messages, the <R n="Entry"/> can be encoded either relative to the ", r("currently_received_entry"), ", or as part of an <R n="Area"/>. Such an <R n="Area"/> ", def_value({id: "sync_enc_data_outer", singular: "out"}), " is always specified as the ", r("area_intersection"), " of the <Rs n="Area"/> <R n="handle_bind">bound</R> by an ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_data_sender", singular: "sender_handle"}), " <R n="handle_bind">bound</R> by the sender of the encoded message, and an ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_data_receiver", singular: "receiver_handle"}), " <R n="handle_bind">bound</R> by the receiver of the encoded message.",
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("DataSendEntry"), " message ", def_value({id: "enc_data_entry", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("011")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("000")],
                                    ["message kind"],
                                ),
                                two_bit_int(6, field_access(r("enc_data_entry"), "DataSendEntryStatic")),
                                new BitfieldRow(
                                    1,
                                    [
                                        "1", " ", r("iff"), code(field_access(r("enc_data_entry"), "DataSendEntryOffset"), " != 0"), ", and ", code(field_access(r("enc_data_entry"), "DataSendEntryOffset"), " != ", field_access(field_access(r("enc_data_entry"), "DataSendEntryEntry"), "entry_payload_length")),
                                    ],
                                    [
                                        inclusion_flag_remark(field_access(r("enc_data_entry"), "DataSendEntryOffset")),
                                    ]
                                ),
                                new BitfieldRow(
                                    2,
                                    [
                                        div(code("00"), ", if ", code(field_access(r("enc_data_entry"), "DataSendEntryOffset"), " == 0"), ", else"),
                                        div(code("01"), ", if ", code(field_access(r("enc_data_entry"), "DataSendEntryOffset"), " == ", field_access(field_access(r("enc_data_entry"), "DataSendEntryEntry"), "entry_payload_length")), ", else"),
                                        div(two_bit_int_def(9, field_access(r("enc_data_entry"), "DataSendEntryOffset"))),
                                    ]
                                ),
                                new BitfieldRow(
                                    1,
                                    [
                                        code("1"), " ", r("iff"), " ", field_access(r("enc_data_entry"), "DataSendEntryEntry"), " will be encoded relative to ", r("currently_received_entry"),
                                    ],
                                ),
                                two_bit_int(12, r("sync_enc_data_sender"), [
                                    field_access(r("enc_data_entry"), "DataSendEntryEntry"), " will be encoded relative to ", r("currently_received_entry"),
                                ]),
                                two_bit_int(14, r("sync_enc_data_receiver"), [
                                    field_access(r("enc_data_entry"), "DataSendEntryEntry"), " will be encoded relative to ", r("currently_received_entry"),
                                ]),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_data_entry"), "DataSendEntryStatic")),
                            ]],
                            [[
                                code(function_call(r("encode_dynamic_token"), field_access(r("enc_data_entry"), "DataSendEntryDynamic"))),
                            ]],
                            [[
                                encode_two_bit_int(field_access(r("enc_data_entry"), "DataSendEntryOffset")), ", or the empty string, if ", code(field_access(r("enc_data_entry"), "DataSendEntryOffset"), " == 0"), " or ", code(field_access(r("enc_data_entry"), "DataSendEntryOffset"), " == ", field_access(field_access(r("enc_data_entry"), "DataSendEntryEntry"), "entry_payload_length")),
                            ]],
                            [
                                [
                                    "the empty string if encoding relative to ", r("currently_received_entry"), "otherwise ", encode_two_bit_int(r("sync_enc_data_sender")),
                                ],
                                [
                                    "Must match bit 11 of the initial bitfield."
                                ],
                            ],
                            [
                                [
                                    "the empty string if encoding relative to ", r("currently_received_entry"), " otherwise ", encode_two_bit_int(r("sync_enc_data_receiver")),
                                ],
                                [
                                    "Must match bit 11 of the initial bitfield."
                                ],
                            ],
                            [
                                [
                                    "either ", code(function_call(
                                        r("encode_entry_relative_entry"),
                                        field_access(r("enc_data_entry"), "DataSendEntryEntry"),
                                        r("currently_received_entry"),
                                        )), ", or ", code(function_call(
                                            r("encode_entry_in_namespace_area"),
                                            field_access(r("enc_data_entry"), "DataSendEntryEntry"),
                                            r("sync_enc_data_outer"),
                                            function_call(r("handle_to_namespace_id"), r("sync_enc_data_receiver")),
                                        )),
                                ],
                                [
                                    "Must match bit 11 of the initial bitfield."
                                ],
                            ],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("DataSendPayload"), " message ", def_value({id: "enc_data_send_payload", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("011")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("001")],
                                    ["message kind"],
                                ),
                                two_bit_int(6, field_access(r("enc_data_send_payload"), "DataSendPayloadAmount")),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_data_send_payload"), "DataSendPayloadAmount")),
                            ]],
                            [[
                                field_access(r("enc_data_send_payload"), "DataSendPayloadBytes"),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("DataSetMetadata"), " message ", def_value({id: "enc_data_eager", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("011")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("010")],
                                    ["message kind"],
                                ),
                                new BitfieldRow(
                                    1,
                                    [
                                        code("1"), " ", r("iff"), " ", code(field_access(r("enc_data_eager"), "DataSetMetadataEagerness"), " == true"),
                                    ],
                                ),
                                bitfieldrow_unused(1),
                                two_bit_int(8, field_access(r("enc_data_eager"), "DataSetMetadataSenderHandle")),
                                two_bit_int(10, field_access(r("enc_data_eager"), "DataSetMetadataReceiverHandle")),
                                bitfieldrow_unused(4),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_data_eager"), "DataSetMetadataSenderHandle")),
                            ]],
                            [[
                                encode_two_bit_int(field_access(r("enc_data_eager"), "DataSetMetadataReceiverHandle")),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("DataBindPayloadRequest"), " message ", def_value({id: "enc_data_req_pay", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("011")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("011")],
                                    ["message kind"],
                                ),
                                two_bit_int(6, field_access(r("enc_data_req_pay"), "DataBindPayloadRequestCapability")),
                                new BitfieldRow(
                                    1,
                                    [
                                        "1", " ", r("iff"), code(field_access(r("enc_data_req_pay"), "DataBindPayloadRequestOffset"), " != 0"), ",",
                                    ],
                                    [
                                        inclusion_flag_remark(field_access(r("enc_data_req_pay"), "DataBindPayloadRequestOffset")),
                                    ]
                                ),
                                two_bit_int(6, field_access(r("enc_data_req_pay"), "DataBindPayloadRequestOffset"), [
                                    code(field_access(r("enc_data_req_pay"), "DataBindPayloadRequestOffset"), " == 0")
                                ]),
                                new BitfieldRow(
                                    1,
                                    [
                                        code("1"), " ", r("iff"), " ", field_access(r("enc_data_req_pay"), "DataBindPayloadRequestEntry"), " will be encoded relative to ", r("currently_received_entry"),
                                    ],
                                ),
                                two_bit_int(12, r("sync_enc_data_sender"), [
                                    field_access(r("enc_data_req_pay"), "DataBindPayloadRequestEntry"), " will be encoded relative to ", r("currently_received_entry"),
                                ]),
                                two_bit_int(14, r("sync_enc_data_receiver"), [
                                    field_access(r("enc_data_req_pay"), "DataBindPayloadRequestEntry"), " will be encoded relative to ", r("currently_received_entry"),
                                ]),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_data_req_pay"), "DataBindPayloadRequestCapability")),
                            ]],
                            [[
                                encode_two_bit_int(field_access(r("enc_data_req_pay"), "DataBindPayloadRequestOffset")), ", or the empty string, if ", code(field_access(r("enc_data_req_pay"), "DataBindPayloadRequestOffset"), " == 0"),
                            ]],
                            [
                                [
                                    "the empty string if encoding relative to ", r("currently_received_entry"), " otherwise ", encode_two_bit_int(r("sync_enc_data_sender")),
                                ],
                                [
                                    "Must match bit 11 of the initial bitfield."
                                ],
                            ],
                            [
                                [
                                    "the empty string if encoding relative to ", r("currently_received_entry"), " otherwise ", encode_two_bit_int(r("sync_enc_data_receiver")),
                                ],
                                [
                                    "Must match bit 11 of the initial bitfield."
                                ],
                            ],
                            [
                                [
                                    "either ", code(function_call(
                                        r("encode_entry_relative_entry"),
                                        field_access(r("enc_data_req_pay"), "DataBindPayloadRequestEntry"),
                                        r("currently_received_entry"),
                                        )), ", or ", code(function_call(
                                            r("encode_entry_in_namespace_area"),
                                            field_access(r("enc_data_req_pay"), "DataBindPayloadRequestEntry"),
                                            r("sync_enc_data_outer"),
                                            function_call(r("handle_to_namespace_id"), r("sync_enc_data_receiver")),
                                        )),
                                ],
                                [
                                    "Must match bit 11 of the initial bitfield."
                                ],
                            ],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("DataReplyPayload"), " message ", def_value({id: "enc_data_rep_pay", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("011")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message kind"],
                                ),
                                two_bit_int(6, field_access(r("enc_data_rep_pay"), "DataReplyPayloadHandle")),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_data_rep_pay"), "DataReplyPayloadHandle")),
                            ]],
                        ),
                    ),

                ]),

                hsection("sync_encode_control", "Control", [
                    pinformative(
                        "To denote ", rs("LogicalChannel"), ", we use sequences of three bits. The ", def_fn({id: "encode_channel"}), " function maps ", lis(
                            [r("ReconciliationChannel"), " to ", code("000"), ","],
                            [r("DataChannel"), " to ", code("001"), ","],
                            [r("OverlapChannel"), " to ", code("010"), ","],
                            [r("CapabilityChannel"), " to ", code("011"), ","],
                            [r("AreaOfInterestChannel"), " to ", code("100"), ","],
                            [r("PayloadRequestChannel"), " to ", code("101"), ", and"],
                            [r("StaticTokenChannel"), " to ", code("110"), "."],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlIssueGuarantee"), " message ", def_value({id: "enc_ctrl_issue", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    4,
                                    [code("0000")],
                                    ["message kind"],
                                ),
                                bitfieldrow_unused(1),
                                two_bit_int(8, field_access(r("enc_ctrl_issue"), "ControlIssueGuaranteeAmount")),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_channel"), field_access(r("enc_ctrl_issue"), "ControlIssueGuaranteeChannel"))]
                                ),
                                bitfieldrow_unused(3),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_ctrl_issue"), "ControlIssueGuaranteeAmount")),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlAbsolve"), " message ", def_value({id: "enc_ctrl_absolve", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    4,
                                    [code("0001")],
                                    ["message kind"],
                                ),
                                bitfieldrow_unused(1),
                                two_bit_int(8, field_access(r("enc_ctrl_absolve"), "ControlAbsolveAmount")),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_channel"), field_access(r("enc_ctrl_absolve"), "ControlAbsolveChannel"))]
                                ),
                                bitfieldrow_unused(3),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_ctrl_absolve"), "ControlAbsolveAmount")),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlPlead"), " message ", def_value({id: "enc_ctrl_plead", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    4,
                                    [code("0010")],
                                    ["message kind"],
                                ),
                                bitfieldrow_unused(1),
                                two_bit_int(8, field_access(r("enc_ctrl_plead"), "ControlPleadTarget")),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_channel"), field_access(r("enc_ctrl_plead"), "ControlPleadChannel"))]
                                ),
                                bitfieldrow_unused(3),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_ctrl_plead"), "ControlPleadTarget")),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlLimitSending"), " message ", def_value({id: "enc_ctrl_limit_sending", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    5,
                                    [code("00110")],
                                    ["message kind"],
                                ),
                                two_bit_int(8, field_access(r("enc_ctrl_limit_sending"), "ControlLimitSendingBound")),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_channel"), field_access(r("enc_ctrl_limit_sending"), "ControlLimitSendingChannel"))]
                                ),
                                bitfieldrow_unused(3),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_ctrl_limit_sending"), "ControlLimitSendingBound")),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlLimitReceiving"), " message ", def_value({id: "enc_ctrl_limit_receiving", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    5,
                                    [code("00111")],
                                    ["message kind"],
                                ),
                                two_bit_int(8, field_access(r("enc_ctrl_limit_receiving"), "ControlLimitReceivingBound")),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_channel"), field_access(r("enc_ctrl_limit_receiving"), "ControlLimitReceivingChannel"))]
                                ),
                                bitfieldrow_unused(3),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_ctrl_limit_receiving"), "ControlLimitReceivingBound")),
                            ]],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlAnnounceDropping"), " message ", def_value({id: "enc_ctrl_announce", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    2,
                                    [code("10")],
                                    ["message kind"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_channel"), field_access(r("enc_ctrl_announce"), "ControlAnnounceDroppingChannel"))]
                                ),
                            ),
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlApologise"), " message ", def_value({id: "enc_ctrl_apo", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    2,
                                    [code("11")],
                                    ["message kind"],
                                ),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_channel"), field_access(r("enc_ctrl_apo"), "ControlApologiseChannel"))]
                                ),
                            ),
                        ),
                    ),

                    hr(),

                    pinformative(
                        "To denote ", rs("HandleType"), ", we use sequences of three bits. ", def_fn({id: "encode_handle_type"}), " maps ", lis(
                            [r("OverlapHandle"), " to ", code("000"), ","],
                            [r("ReadCapabilityHandle"), " to ", code("001"), ","],
                            [r("AreaOfInterestHandle"), " to ", code("010"), ","],
                            [r("PayloadRequestHandle"), " to ", code("011"), ","],
                            [r("StaticTokenHandle"), " to ", code("100"), ","],
                        ),
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ControlFreeHandle"), " message ", def_value({id: "enc_ctrl_free", singular: "m"}), " is the concatenation of:",
                        encodingdef(
                            new Bitfields(
                                new BitfieldRow(
                                    3,
                                    [code("100")],
                                    ["message category"],
                                ),
                                new BitfieldRow(
                                    2,
                                    [code("01")],
                                    ["message kind"],
                                ),
                                bitfieldrow_unused(3),
                                two_bit_int(8, field_access(r("enc_ctrl_free"), "ControlFreeHandleHandle")),
                                new BitfieldRow(
                                    3,
                                    [function_call(r("encode_handle_type"), field_access(r("enc_ctrl_free"), "ControlFreeHandleType"))],
                                ),
                                new BitfieldRow(
                                    1,
                                    [
                                        code("1"), " ", r("iff"), " ", code(field_access(r("enc_ctrl_free"), "ControlFreeHandleMine"), " == true"),
                                    ],
                                ),
                                bitfieldrow_unused(2),
                            ),
                            [[
                                encode_two_bit_int(field_access(r("enc_ctrl_free"), "ControlFreeHandleHandle")),
                            ]],
                        ),
                    ),
                    pinformative(
                        "And with that, we have all the pieces we need for secure, efficient synchronisation of <Rs n="namespace"/>. Thanks for reading!"),
                    pinformative(
                        img(asset("sync/wgps_emblem.png"), `A WGPS emblem: A stylised drawing of satellite in the night sky, backlit by the full moon.`),
                    ),

                ]),

            ]),
        ]), */
        }
      </PageTemplate>
    </File>
  </Dir>
);
