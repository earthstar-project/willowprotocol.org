import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";

export const sync = (
  <Dir name="sync">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow General Purpose Sync Protocol"
        headingId="sync"
        heading={"Willow General Purpose Sync Protocol"}
        toc
        status="proposal"
        statusDate="19.06.2024"
      >
        <P>
          <Alj inline>TODO</Alj>
        </P>

        {
          /*

pinformative("The ", link_name("data_model", "Willow data model"), " specifies how to arrange data, but it does not prescribe how peers should synchronise data. In this document, we specify one possible way for performing synchronisation: the ", def("WGPS", "Willow General Purpose Sync (WGPS) protocol"), ". This document assumes familiarity with the ", link_name("data_model", "Willow data model"), "."),

        table_of_contents(7),

        hsection("sync_intro", "Introduction", [
            marginale_inlineable(
              img(asset("sync/syncing.png"), "An ornamental drawing of two Willow data stores. Each store is a three-dimensional space, alluding to the path/time/subspace visualisations in the data model specification. Within each data store, a box-shaped area is highlighted. Between these highlighted areas flows a bidirectional stream of documents. Alfie, Betty, and Dalton lounge around the drawing.")
            ),

            pinformative("The WGPS aims to be appropriate for a variety of networking settings, particularly those of peer-to-peer systems where the replicating parties might not necessarily trust each other. Quite a bit of engineering went into the WGPS to satisfy the following requirements:"),

            lis(
                "Incremental sync: peers can detect regions of shared data with relatively sparse communication to avoid redundant data transfer.",
                "Partial sync: peers synchronise only those regions of data they both care about, at sub-namespace granularity.",
                "Access control: conformant peers only hand out data if the request authorises its access.",
                "Private area intersection: peers can discover common interests without disclosing any non-shared information to each other.",
                "Resource control: peers communicate (and enforce) their computational resource limits so as not to overload each other.",
                "Transport independence: peers can communicate over arbitrary reliable, ordered, byte-oriented channels, whether tcp, quic, or unix pipe.",
                "General efficiency: peers can make use of efficient implementation techniques, and the overall bandwidth consumption stays low.",
            ),

            pinformative("The WGPS provides a shared vocabulary for peers to communicate with, but nothing more. It cannot and does not force peers to use it efficiently or to use the most efficient data structures internally. That is a feature! Implementations can start out with inefficient but simple implementation choices and later replace those with better-scaling ones. Throughout that evolution, the implementations stay compatible with any other implementation, regardless of its degree of sophistication."),
        ]),

        hsection("sync_concepts", "Concepts", [
            pinformative("Data synchronisation for Willow needs to solve a number of sub-problems, which we summarise in this section."),

            hsection("sync_access", {no_toc: true}, "Access Control", [
                pinformative("Peers only transfer data to peers that can prove that they are allowed to access that data. We describe how peers authenticate their requests ", link_name("access_control", "here"), "."),
            ]),

            hsection("sync_pai", {no_toc: true}, "Private Area Intersection", [
                pinformative("The WGPS lets two peers determine which <Rs n="namespace"/> and ", rs("Area"), " therein they share an interest in, without leaking any data that only one of them wishes to synchronise. We explain the underlying ", link_name("private_area_intersection", "private area intersection protocol here"), "."),
            ]),

            hsection("sync_partial", {no_toc: true}, "Partial Synchronisation", [
                pinformative("To synchronise data, peers specify any number of ", rs("AreaOfInterest"), marginale([
                    "Note that peers need abide to the ", r("aoi_count"), " and ", r("aoi_size"), " limits of the <Rs n="AreaOfInterest"/> only on a best-effort basis. Imagine Betty has just transmitted her 100 newest <Rs n="Entry"/> to Alfie, only to then receive an even newer <R n="Entry"/> from Gemma. Betty should forward that <R n="Entry"/> to Alfie, despite that putting her total number of transmissions above the limit of 100."
                ]), " per <R n="namespace"/>. The ", r("area_empty", "non-empty"), " <Rs n="aoi_intersection"/> of <Rs n="AreaOfInterest"/> from both peers contain the <Rs n="Entry"/> to synchronise."),

                pinformative("The WGPS synchronises these ", rs("area_intersection"), " via ", r("d3rbsr"), ", a technique we ", link_name("d3_range_based_set_reconciliation", "explain in detail here"), "."),
            ]),

            hsection("sync_post_sync_forwarding", {no_toc: true}, "Post-Reconciliation Forwarding", [
                pinformative("After performing ", r("d3rbsr", "set reconciliation"), ", peers might receive new <Rs n="Entry"/> that fall into their shared <Rs n="AreaOfInterest"/>. Hence, the WGPS allows peers to transmit <Rs n="Entry"/> unsolicitedly."),
            ]),

            hsection("sync_payloads", {no_toc: true}, "Payload Transmission", [
                pinformative("When a peer sends an <R n="Entry"/>, it can choose whether to immediately transmit the corresponding ", r("Payload"), " as well. Peers exchange ", sidenote("preferences", ["These preferences are not binding. The number of <Rs n="aoi_intersection"/> between the peers’ <Rs n="AreaOfInterest"/> can be quadratic in the number of <Rs n="AreaOfInterest"/>, and we do not want to mandate keeping a quadratic amount of state."]), " for eager or lazy ", r("Payload"), " transmission based on ", rs("entry_payload_length"), " for each ", r("aoi_intersection"), ". These preferences are expressive enough to implement the ", link("plumtree", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), " algorithm."),

                pinformative("Peers can further explicitly request the ", rs("Payload"), " of arbitrary <Rs n="Entry"/> (that they are allowed to access)."),
            ]),

            hsection("sync_payloads_transform", {no_toc: true}, "Payload Transformation", [
                pinformative("Peers are not restricted to exchanging ", rs("Payload"), " verbatim, they may transform the payloads first. This can enable, for example, streaming verification or just-in-time compression."),
            ]),

            hsection("sync_resources", {no_toc: true}, "Resource Limits", [
                pinformative("Multiplexing and management of shared state require peers to inform each other of their resource limits, lest one peer overload the other. We use a protocol-agnostic solution based on ", rs("logical_channel"), " and ", rs("resource_handle"), " that we describe ", link_name("resource_control", "here"), "."),
            ]),
        ]),

        hsection("sync_parameters", "Parameters", [
            pinformative("The WGPS is generic over specific cryptographic primitives. In order to use it, one must first specify a full suite of instantiations of the ", link_name("willow_parameters", "parameters of the core Willow data model"), ". The WGPS further requires parameters for ", link_name("access_control", "access control"), ", ", link_name("private_area_intersection", "private area intersection"), ", and ", link_name("d3_range_based_set_reconciliation", "3d range-based set reconciliation"), "."),

            pinformative(link_name("access_control", "Access control"), " requires a type ", def_parameter_type({id: "ReadCapability", plural: "ReadCapabilities"}), " of <Rs n="read_capability"/>, a type ", def_parameter_type({id: "sync_receiver", singular: "Receiver"}), " of ", rs("access_receiver"), ", and a type ", def_parameter_type({ id: "sync_signature", singular: "SyncSignature"}), " of signatures issued by the ", rs("sync_receiver"), ". The ", rs("access_challenge"), " have a length of ", def_parameter_value("challenge_length"), " bytes, and the hash function used for the ", r("commitment_scheme"), " is a parameter ", def_parameter_fn("challenge_hash"), " whose outputs have a length of ", def_parameter_value("challenge_hash_length"), " bytes."),

            pinformative(link_name("private_area_intersection", "Private area intersection"), " requires a type ", def_parameter_type("PsiGroup"), " whose values are the members of a ", link("finite cyclic group suitable for key exchanges", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalisation_to_finite_cyclic_groups"), ", a type ", def_parameter_type("PsiScalar", "PsiScalar"), " of scalars, and a function ", def_parameter_fn("psi_scalar_multiplication", "psi_scalar_multiplication"), " that computes scalar multiplication in the group. We require a function ", def_parameter_fn("hash_into_group"), " that hashes ", rs("fragment"), " into ", r("PsiGroup"), ". And finally, we require a type ", def_parameter_type({id: "SubspaceCapability", plural: "SubspaceCapabilities"}), " of ", rs("subspace_capability"), ", with a type ", def_parameter_type({id: "sync_subspace_receiver", singular: "SubspaceReceiver"}), " of ", rs("subspace_receiver"), ", and a type ", def_parameter_type({ id: "sync_subspace_signature", singular: "SyncSubspaceSignature"}), " of signatures issued by the ", rs("sync_subspace_receiver"), "."),

            pinformative(link_name("d3_range_based_set_reconciliation", "3d range-based set reconciliation"), " requires a type ", def_parameter_type("Fingerprint"), " of hashes of ", rs("LengthyEntry"), ", a type ", def_parameter_type("PreFingerprint"), " and a (probabilistically) injective function ", def_parameter_fn("fingerprint_finalise"), " from ", r("PreFingerprint"), " into ", r("Fingerprint"), ", a hash function ", def_parameter_fn("fingerprint_singleton"), " from ", rs("LengthyEntry"), " into ", r("PreFingerprint"), " for computing the ", rs("PreFingerprint"), " of singleton ", r("LengthyEntry"), " sets, an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), ", ", link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), " ", link("binary operation", "https://en.wikipedia.org/wiki/Binary_operation"), " ", def_parameter_fn("fingerprint_combine"), " on ", r("PreFingerprint"), " for computing the ", rs("PreFingerprint"), " of larger ", r("LengthyEntry"), " sets, and a value ", def_parameter_value("fingerprint_neutral"), " of type ", r("PreFingerprint"), " that is a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " for ", r("fingerprint_combine"), " for serving as the ", r("PreFingerprint"), " of the empty set."),

            pinformative("To efficiently transmit ", rs("AuthorisationToken"), ", we decompose them into two parts: the ", def_parameter_type({id: "StaticToken", singular: "StaticToken"}), " (which might be shared between many ", rs("AuthorisationToken"), "), and the ", def_parameter_type({id: "DynamicToken", singular: "DynamicToken"}), marginale([
                "In Meadowcap, for example, ", r("StaticToken"), " is the type ", r("Capability"), " and ", r("DynamicToken"), " is the type ", r("UserSignature"), ", which together yield a ", r("MeadowcapAuthorisationToken"), ".",
            ]), " (which differs between any two <Rs n="Entry"/>). Formally, we require that there is an ", link("isomorphism", "https://en.wikipedia.org/wiki/Isomorphism"), " between ", r("AuthorisationToken"), " and pairs of a ", r("StaticToken"), " and a ", r("DynamicToken"), " with respect to the ", r("is_authorised_write"), " function."),

            pinformative(link_name("sync_payloads_transform", "Payload transformation"), " requires a (not necessarily deterministic) algorithm ", def_parameter_fn("transform_payload"), " that converts a ", r("Payload"), " into another bytestring."),

            pinformative("Finally, we require a <R n="NamespaceId"/> ", def_parameter_value({id: "sync_default_namespace_id", singular: "default_namespace_id"}), ", a <R n="SubspaceId"/> ", def_parameter_value({id: "sync_default_subspace_id", singular: "default_subspace_id"}), ", and a ", r("PayloadDigest"), " ", def_parameter_value({id: "sync_default_payload_digest", singular: "default_payload_digest"}), "."),
        ]),

        hsection("sync_protocol", "Protocol", [
            pinformative("The protocol is mostly message-based, with the exception of the first few bytes of communication. To break symmetry, we refer to the peer that initiated the synchronisation session as ", def({id: "alfie", singular: "Alfie"}, "Alfie", [def_fake("alfie", "Alfie"), " refers to the peer that initiated a WGPS synchronisation session. We use this terminology to break symmetry in the protocol."]), ", and the other peer as ", def({id: "betty", singular: "Betty"}, "Betty", [def_fake("betty", "Betty"), " refers to the peer that accepted a WGPS synchronisation session. We use this terminology to break symmetry in the protocol."]), "."),

            pinformative("Peers might receive invalid messages, both syntactically (i.e., invalid encodings) and semantically (i.e., logically inconsistent messages). In both cases, the peer to detect this behaviour must abort the sync session. We indicate such situations by writing that something ", quotes("is an error"), ". Any message that refers to a fully freed resource handle is an error. More generally, whenever we state that a message must fulfil some criteria, but a peer receives a message that does not fulfil these criteria, that is an error."),

            pinformative("Before any communication, each peer locally and independently generates some random data: a ", r("challenge_length"), "-byte integer ", def_value("nonce"), ", and a random value ", def_value("scalar"), " of type ", r("PsiScalar"), ". Both are used for cryptographic purposes and must thus use high-quality sources of randomness — they must both be unique across all protocol runs, and unpredictable."),

            pinformative("The first byte each peer sends must be a natural number ", $dot("x \\leq 64"), " This sets the ", def_value({id: "peer_max_payload_size", singular: "maximum payload size"}), " of that peer to", $dot("2^x"), "The ", r("peer_max_payload_size"), " limits when the other peer may include ", rs("Payload"), " directly when transmitting <Rs n="Entry"/>: when an <R n="Entry"/>’s ", r("entry_payload_length"), " is strictly greater than the ", r("peer_max_payload_size"), ", its ", r("Payload"), " may only be transmitted when explicitly requested."),

            pinformative("The next ", r("challenge_hash_length"), " bytes a peer sends are the ", r("challenge_hash"), " of ", r("nonce"), "; we call the bytes that a peer received this way its ", def_value("received_commitment"), "."),

            pinformative("After those initial transmissions, the protocol becomes a purely message-based protocol. There are several kinds of messages, which the peers create, encode as byte strings, and transmit mostly independently from each other."),

            pinformative("The messages make use of the following ", rs("resource_handle"), ":"),

            pseudocode(
                new SimpleEnum({
                    id: "HandleType",
                    comment: ["The different ", rs("resource_handle"), " employed by the ", r("WGPS"), "."],
                    variants: [
                        {
                            id: "IntersectionHandle",
                            comment: [R("resource_handle"), " for the private set intersection part of ", link_name("private_area_intersection", "private area intersection"), ". More precisely, an ", r("IntersectionHandle"), " stores a ", r("PsiGroup"), " member together with one of two possible states", ": ", lis(
                                [def_value({id: "psi_state_pending", singular: "pending"}, "pending", ["The ", def_fake_value("psi_state_pending", "pending"), " state indicates that the stored ", r("PsiGroup"), " member has been submitted for ", link_name("private_area_intersection", "private area intersection"), ", but the other peer has yet to reply with the result of multiplying its ", r("scalar"), "."]), " (waiting for the other peer to perform scalar multiplication),"],
                                [def_value({id: "psi_state_completed", singular: "completed"}, "completed", ["The ", def_fake_value("psi_state_completed", "completed"), " state indicates that the stored ", r("PsiGroup"), " member is the result of both peers multiplying their ", r("scalar"), " with the initial ", r("PsiGroup"), " member."]), " (both peers performed scalar multiplication)."],
                            )],
                        },
                        {
                            id: "CapabilityHandle",
                            comment: [R("resource_handle"), " for ", rs("ReadCapability"), " that certify access to some <Rs n="Entry"/>."],
                        },
                        {
                            id: "AreaOfInterestHandle",
                            comment: [R("resource_handle"), " for <Rs n="AreaOfInterest"/> that peers wish to sync."],
                        },
                        {
                            id: "PayloadRequestHandle",
                            comment: [R("resource_handle"), " that controls the matching from ", r("Payload"), " transmissions to ", r("Payload"), " requests."],
                        },
                        {
                            id: "StaticTokenHandle",
                            comment: [R("resource_handle"), " for ", rs("StaticToken"), " that peers need to transmit."],
                        },
                    ],
                }),
            ),

            pinformative("The messages are divided across the following ", rs("logical_channel"), ":"),

            pseudocode(
                new SimpleEnum({
                    id: "LogicalChannel",
                    comment: ["The different ", rs("logical_channel"), " employed by the ", r("WGPS"), "."],
                    variants: [
                        {
                            id: "ReconciliationChannel",
                            comment: [R("logical_channel"), " for performing ", r("d3rbsr"), "."],
                        },
                        {
                            id: "DataChannel",
                            comment: [R("logical_channel"), " for transmitting <Rs n="Entry"/> and ", rs("Payload"), " outside of ", r("d3rbsr"), "."],
                        },
                        {
                            id: "IntersectionChannel",
                            comment: [R("logical_channel"), " for controlling the ", r("handle_bind", "binding"), " of new ", rs("IntersectionHandle"), "."],
                        },
                        {
                            id: "CapabilityChannel",
                            comment: [R("logical_channel"), " for controlling the ", r("handle_bind", "binding"), " of new ", rs("CapabilityHandle"), "."],
                        },
                        {
                            id: "AreaOfInterestChannel",
                            comment: [R("logical_channel"), " for controlling the ", r("handle_bind", "binding"), " of new ", rs("AreaOfInterestHandle"), "."],
                        },
                        {
                            id: "PayloadRequestChannel",
                            comment: [R("logical_channel"), " for controlling the ", r("handle_bind", "binding"), " of new ", rs("PayloadRequestHandle"), "."],
                        },
                        {
                            id: "StaticTokenChannel",
                            comment: [R("logical_channel"), " for controlling the ", r("handle_bind", "binding"), " of new ", rs("StaticTokenHandle"), "."],
                        },
                    ],
                }),
            ),

            pinformative(
                "These ", rs("logical_channel"), " are not fully logically independent: messages on some channels refer to ", rs("resource_handle"), " ", r("handle_bind", "bound"), " on other channels. Whenever a message references a handle from another channel, but that handle has not yet been bound, processing of that message must be halted until all buffered messages in the channel for that kind of handle have been processed, or until the handle has been bound, whichever comes first.",
            ),

            hsection("sync_messages", "Messages", [
                pinformative("We now define the different kinds of messages. When we do not mention the ", r("logical_channel"), " that messages of a particular kind use, then these messages are ", rs("control_message"), " that do not belong to any ", r("logical_channel"), "."),

                hsection("sync_commitment", "Commitment Scheme", [
                    pinformative("The WGPS enforces ", link_name("access_control", "access control"), " by making peers prove ownership of ", rs("dss_sk"), " by signing a nonce determined via a ", r("commitment_scheme"), ". Peers transmit the ", r("challenge_hash"), " of their committed data in the first few bytes of the protocol, the ", r("CommitmentReveal"), " message then allows them to conclude the ", r("commitment_scheme"), ":"),

                    pseudocode(
                        new Struct({
                            id: "CommitmentReveal",
                            comment: ["Complete the ", link_name("commitment_scheme", "commitment scheme"), " to determine the ", r("value_challenge"), " for ", r("read_authentication"), "."],
                            fields: [
                                {
                                    id: "CommitmentRevealNonce",
                                    name: "nonce",
                                    comment: ["The ", r("nonce"), " of the sender, encoded as a ", link("big-endian", "https://en.wikipedia.org/wiki/Endianness"), " ", link("unsigned integer", "https://en.wikipedia.org/w/index.php?title=Unsigned_integer"), "."],
                                    rhs: ["[", r("U8"), "; ", r("challenge_length"), "]"],
                                },
                            ],
                        }),
                    ),

                    pinformative("Upon receiving a ", r("CommitmentReveal"), " message, a peer can determine its ", def_value({id: "value_challenge", singular: "challenge"}), ": for ", r("alfie"), ", ", r("value_challenge"), " is the ", link("bitwise exclusive or", "https://en.wikipedia.org/wiki/Bitwise_operation#XOR"), " of his ", r("nonce"), " and the received ", r("CommitmentRevealNonce"), ". For ", r("betty"), ", ", r("value_challenge"), " is the ", link("bitwise complement", "https://en.wikipedia.org/wiki/Bitwise_operation#NOT"), " of the ", link("bitwise exclusive or", "https://en.wikipedia.org/wiki/Bitwise_operation#XOR"), " of her ", r("nonce"), " and the received ", r("CommitmentRevealNonce"), "."),

                    pinformative("Each peer must send this message at most once, and a peer should not send this message before having fully received a ", r("received_commitment"), "."),
                ]),

                hsection("sync_pai_messages", "Private Area Intersection", [
                    pinformative(link_name("private_area_intersection", "Private area intersection"), " operates by performing ", link_name("psi_actual", "private set intersection"), " and requesting and supplying ", rs("SubspaceCapability"), "."),

                    pseudocode(
                        new Struct({
                            id: "PaiBindFragment",
                            comment: [R("handle_bind"), " data to an ", r("IntersectionHandle"), " for performing ", link_name("private_area_intersection", "private area intersection"), "."],
                            fields: [
                                {
                                    id: "PaiBindFragmentGroupMember",
                                    name: "group_member",
                                    comment: ["The result of first applying ", r("hash_into_group"), " to some ", r("fragment"), " for ", link_name("private_area_intersection", "private area intersection"), " and then performing scalar multiplication with ", r("scalar"), "."],
                                    rhs: r("PsiGroup"),
                                },
                                {
                                    id: "PaiBindFragmentIsSecondary",
                                    name: "is_secondary",
                                    comment: ["Set to ", code("true"), " if the private set intersection item is a ", r("fragment_secondary"), " ", r("fragment"), "."],
                                    rhs: r("Bool"),
                                },
                            ],
                        }),
                    ),

                    pinformative([
                        marginale(["In the ", link_name("private_equality_testing", "colour mixing metaphor"), ", a ", r("PaiBindFragment"), " message corresponds to mixing a data colour with one’s secret colour, and sending the mixture to the other peer."]),
                        "The ", r("PaiBindFragment"), " messages let peers submit ", rs("fragment"), " to the private set intersection part of ", link_name("private_area_intersection", "private area intersection"), ". The freshly created ", r("IntersectionHandle"), " ", r("handle_bind", "binds"), " the ", r("PaiBindFragmentGroupMember"), " in the ", r("psi_state_pending"), " state.",
                    ]),

                    pinformative(R("PaiBindFragment"), " messages use the ", r("IntersectionChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "PaiReplyFragment",
                            comment: ["Finalise private set intersection for a single item."],
                            fields: [
                                {
                                    id: "PaiReplyFragmentHandle",
                                    name: "handle",
                                    comment: ["The ", r("IntersectionHandle"), " of the ", r("PaiBindFragment"), " message which this finalises."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "PaiReplyFragmentGroupMember",
                                    name: "group_member",
                                    comment: ["The result of performing scalar multiplication between the ", r("PaiBindFragmentGroupMember"), " of the message that this is replying to and ", r("scalar"), "."],
                                    rhs: r("PsiGroup"),
                                },
                            ],
                        }),
                    ),

                    pinformative([
                        marginale(["In the ", link_name("private_equality_testing", "colour mixing metaphor"), ", a ", r("PaiReplyFragment"), " message corresponds to mixing one’s secret colour with a colour mixture received from the other peer, and sending the resulting colour back."]),
                        "The ", r("PaiReplyFragment"), " messages let peers complete the information exchange regarding a single ", r("fragment"), " submitted to private set intersection in the ", link_name("private_area_intersection", "private area intersection"), " process.",
                    ]),

                    pinformative("The ", r("PaiReplyFragmentHandle"), " must refer to an ", r("IntersectionHandle"), " ", r("handle_bind", "bound"), " by the other peer via a ", r("PaiBindFragment"), " message. A peer may send at most one ", r("PaiReplyFragment"), " message per ", r("IntersectionHandle"), ". Upon sending or receiving a ", r("PaiReplyFragment"), " message, a peer updates the ", r("resource_handle"), " binding to now ", r("handle_bind"), " the ", r("PaiReplyFragmentGroupMember"), " of the ", r("PaiReplyFragment"), " message, in the state ", r("psi_state_completed"), "."),

                    pseudocode(
                        new Struct({
                            id: "PaiRequestSubspaceCapability",
                            plural: "PaiRequestSubspaceCapabilities",
                            comment: ["Ask the receiver to send a ", r("SubspaceCapability"), "."],
                            fields: [
                                {
                                    id: "PaiRequestSubspaceCapabilityHandle",
                                    name: "handle",
                                    comment: ["The ", r("IntersectionHandle"), " ", r("handle_bind", "bound"), " by the sender for the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), " for whose <R n="NamespaceId"/> to request the ", r("SubspaceCapability"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("PaiRequestSubspaceCapability"), " messages let peers request ", rs("SubspaceCapability"), ", by sending the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), ". This item must be in the intersection of the two peers’ ", rs("fragment"), ". The receiver of the message can thus look up the <R n="subspace"/> in question."),

                    pinformative("A peer may send at most one ", r("PaiRequestSubspaceCapability"), " message per ", r("IntersectionHandle"), "."),

                    pseudocode(
                        new Struct({
                            id: "PaiReplySubspaceCapability",
                            plural: "PaiReplySubspaceCapabilities",
                            comment: ["Send a previously requested ", r("SubspaceCapability"), "."],
                            fields: [
                                {
                                    id: "PaiReplySubspaceCapabilityHandle",
                                    name: "handle",
                                    comment: ["The ", r("PaiRequestSubspaceCapabilityHandle"), " of the ", r("PaiRequestSubspaceCapability"), " message that this answers (hence, an ", r("IntersectionHandle"), " ", r("handle_bind", "bound"), " by the ", em("receiver"), " of this message)."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "PaiReplySubspaceCapabilityCapability",
                                    name: "capability",
                                    comment: ["A ", r("SubspaceCapability"), " whose ", r("subspace_granted_namespace"), " corresponds to the request this answers."],
                                    rhs: r("SubspaceCapability"),
                                },
                                {
                                    id: "PaiReplySubspaceCapabilitySignature",
                                    name: "signature",
                                    comment: ["The ", r("sync_subspace_signature"), " issued by the ", r("subspace_receiver"), " of the ", r("PaiReplySubspaceCapabilityCapability"), " over the sender’s ", r("value_challenge"), "."],
                                    rhs: r("sync_subspace_signature"),
                                },
                            ],
                        }),
                    ),

                    pinformative(
                        marginale(["Note that ", r("PaiReplySubspaceCapability"), " messages do not use any logical channel. Hence, peers must be able to verify them in a constant amount of memory. Whether this is possible, depends on the capability system."]),
                        "The ", r("PaiReplySubspaceCapability"), " messages let peers answer requests for ", rs("SubspaceCapability"), ". To do so, they must present a valid ", r("sync_subspace_signature"), " over their ", r("value_challenge"), ", thus demonstrating they hold the secret key corresponding to the ", r("subspace_receiver"), " of the ", r("SubspaceCapability"), ".",
                    ),

                    pinformative("A peer may send at most one ", r("PaiReplySubspaceCapability"), " message per ", r("PaiRequestSubspaceCapability"), " it received."),
                ]),

                hsection("sync_setup", "Setup", [
                    pinformative("To transmit <Rs n="Entry"/>, a peer first has to register ", rs("ReadCapability"), ", <Rs n="AreaOfInterest"/>, and ", rs("StaticToken"), " with the other peer."),

                    pseudocode(
                        new Struct({
                            id: "SetupBindReadCapability",
                            plural: "SetupBindReadCapabilities",
                            comment: [R("handle_bind"), " a ", r("ReadCapability"), " to a ", r("CapabilityHandle"), "."],
                            fields: [
                                {
                                    id: "SetupBindReadCapabilityCapability",
                                    name: "capability",
                                    comment: ["A ", r("ReadCapability"), " that the peer wishes to reference in future messages."],
                                    rhs: r("ReadCapability"),
                                },
                                {
                                    id: "SetupBindReadCapabilityHandle",
                                    name: "handle",
                                    comment: ["The ", r("IntersectionHandle"), ", ", r("handle_bind", "bound"), " by the sender, of the ", r("SetupBindReadCapabilityCapability"), "’s ", r("fragment"), " with the longest <R n="Path"/> in the intersection of the ", rs("fragment"), ". If both a ", r("fragment_primary"), " and ", r("fragment_secondary"), " such ", r("fragment"), " exist, choose the ", r("fragment_primary"), " one."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "SetupBindReadCapabilitySignature",
                                    name: "signature",
                                    comment: ["The ", r("sync_signature"), " issued by the ", r("sync_receiver"), " of the ", r("SetupBindReadCapabilityCapability"), " over the sender’s ", r("value_challenge"), "."],
                                    rhs: r("sync_signature"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("SetupBindReadCapability"), " messages let peers ", r("handle_bind"), " a ", r("ReadCapability"), " for later reference. To do so, they must present a valid ", r("sync_signature"), " over their ", r("value_challenge"), ", thus demonstrating they hold the secret key corresponding to ", r("access_receiver"), " of the ", r("ReadCapability"), "."),

                    pinformative(
                        marginale(["These requirements allow us to encode ", r("SetupBindReadCapability"), " messages more efficiently."]),
                        "The ", r("SetupBindReadCapabilityHandle"), " must be ", r("handle_bind", "bound"), " to the ", r("fragment"), " (", r("fragment_primary"), ", if possible) of the ", r("SetupBindReadCapabilityCapability"), " with the longest <R n="Path"/> ", r("path_prefix"), " that is in the intersection of the two peers’ ", rs("fragment"), ".",
                    ),

                    pinformative(R("SetupBindReadCapability"), " messages use the ", r("CapabilityChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "SetupBindAreaOfInterest",
                            comment: [R("handle_bind"), " an ", r("AreaOfInterest"), " to an ", r("AreaOfInterestHandle"), "."],
                            fields: [
                                {
                                    id: "SetupBindAreaOfInterestAOI",
                                    name: "area_of_interest",
                                    comment: ["An ", r("AreaOfInterest"), " that the peer wishes to reference in future messages."],
                                    rhs: r("AreaOfInterest"),
                                },
                                {
                                    id: "SetupBindAreaOfInterestCapability",
                                    name: "authorisation",
                                    comment: ["A ", r("CapabilityHandle"), " ", r("handle_bind", "bound"), " by the sender that grants access to all entries in the message", apo, "s ", r("SetupBindAreaOfInterestAOI"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),

                    pinformative(
                        "The ", r("SetupBindAreaOfInterest"), " messages let peers ", r("handle_bind"), " an ", r("AreaOfInterest"), " for later reference. They show that they may indeed receive <Rs n="Entry"/> from the ", r("AreaOfInterest"), " by providing a ", r("CapabilityHandle"), " ", r("handle_bind", "bound"), " by the sender that grants access to all entries in the message’s ", r("SetupBindAreaOfInterestAOI"), ".",
                    ),

                    aside_block(
                        pinformative("To avoid duplicate ", r("d3rbsr"), " sessions for the same ", rs("Area"), ", only ", r("alfie"), " should react to sending or receiving ", rs("SetupBindAreaOfInterest"), " messages by initiating set reconciliation. ", R("betty"), " should never initiate reconciliation — unless she considers the redundant bandwidth consumption of duplicate reconciliation less of an issue than having to wait for ", r("alfie"), " to initiate reconciliation."),
                    ),

                    pinformative(R("SetupBindAreaOfInterest"), " messages use the ", r("AreaOfInterestChannel"), "."),

                    pinformative(
                        "Let ", def_value({id: "handle2ns_handle", singular: "handle"}), " be an ", r("AreaOfInterestHandle"), ". We then define ", code(function_call(def_fn({id: "handle_to_namespace_id"}), r("handle2ns_handle"))), " to denote the ", r("granted_namespace"), " of the ", r("ReadCapability"), " whose ", r("CapabilityHandle"), " is the ", r("SetupBindAreaOfInterestCapability"), " of the ", r("SetupBindAreaOfInterest"), " that ", r("handle_bind", "bound"), " ", r("handle2ns_handle"), ".",
                    ),

                    pseudocode(
                        new Struct({
                            id: "SetupBindStaticToken",
                            comment: [R("handle_bind"), " a ", r("StaticToken"), " to a ", r("StaticTokenHandle"), "."],
                            fields: [
                                {
                                    id: "SetupBindStaticTokenToken",
                                    name: "static_token",
                                    comment: ["The ", r("StaticToken"), " to bind."],
                                    rhs: r("StaticToken"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("SetupBindStaticToken"), " messages let peers ", r("handle_bind"), " ", rs("StaticToken"), ". Transmission of ", rs("AuthorisedEntry"), " in other messages refers to ", rs("StaticTokenHandle"), " rather than transmitting ", rs("StaticToken"), " verbatim."),

                    pinformative(R("SetupBindStaticToken"), " messages use the ", r("StaticTokenChannel"), "."),
                ]),

                hsection("sync_reconciliation", "Reconciliation", [
                    pinformative("We use ", link_name("d3_range_based_set_reconciliation", "3d range-based set reconciliation"), " to synchronise the data of the peers."),

                    surpress_output(def_symbol({id: "covers_none", singular: "none"}, "none", ["A value that signals that a message does not complete a ", r("D3Range"), " cover."])),

                    pseudocode(
                        new Struct({
                            id: "ReconciliationSendFingerprint",
                            comment: ["Send a ", r("Fingerprint"), " as part of ", r("d3rbsr"), "."],
                            fields: [
                                {
                                    id: "ReconciliationSendFingerprintRange",
                                    name: "range",
                                    comment: ["The ", r("D3Range"), " whose ", r("Fingerprint"), " is transmitted."],
                                    rhs: r("D3Range"),
                                },
                                {
                                    id: "ReconciliationSendFingerprintFingerprint",
                                    name: "fingerprint",
                                    comment: ["The ", r("Fingerprint"), " of the ", r("ReconciliationSendFingerprintRange"), ", that is, of all ", rs("LengthyEntry"), " the peer has in the ", r("ReconciliationSendFingerprintRange"), "."],
                                    rhs: r("Fingerprint"),
                                },
                                {
                                    id: "ReconciliationSendFingerprintSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("ReconciliationSendFingerprintRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ReconciliationSendFingerprintReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("ReconciliationSendFingerprintRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ReconciliationSendFingerprintCovers",
                                    name: "covers",
                                    comment: ["If this message is the last of a set of messages that together cover the ", r("ReconciliationSendFingerprintRange"), " of some prior ", r("ReconciliationSendFingerprint"), " message, then this field contains the ", r("range_count"), " of that ", r("ReconciliationSendFingerprint"), " message. Otherwise, ", r("covers_none"), "."],
                                    rhs: pseudo_choices(r("U64"), r("covers_none")),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("ReconciliationSendFingerprint"), " messages let peers initiate and progress ", r("d3rbsr"), ". Each ", r("ReconciliationSendFingerprint"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers; this upholds read access control."),

                    pinformative("In order to inform each other whenever they fully cover a ", r("D3Range"), " during reconciliation, each peer tracks two numbers: ", def_value("my_range_counter"), " and ", def_value("your_range_counter"), ". Both are initialised to zero. Whenever a peer ", em("sends"), " either a ", r("ReconciliationAnnounceEntries"), " message with ", r("ReconciliationAnnounceEntriesFlag"), " set to ", code("true"), " or a ", r("ReconciliationSendFingerprint"), " message, it increments its ", r("my_range_counter"), ". Whenever it ", em("receives"), " either a ", r("ReconciliationAnnounceEntries"), " message with ", r("ReconciliationAnnounceEntriesFlag"), " set to ", code("true"), " or a ", r("ReconciliationSendFingerprint"), " message, it increments its ", r("your_range_counter"), ". When a messages causes one of these values to be incremented, we call ", sidenote("the", ["Both peers assign the same values to the same messages."]), " value ", em("before"), " incrementation the message's ", def("range_count"), "."),

                    pinformative("When a peer receives a ", r("ReconciliationSendFingerprint"), " message of ", r("range_count"), " ", def_value({id: "recon_send_fp_count", singular: "count"}), ", it may recurse by producing a cover of smaller ", rs("D3Range"), ". For each subrange of that cover, it sends either a ", r("ReconciliationSendFingerprint"), " message or a ", r("ReconciliationAnnounceEntries"), " message. If the last of these messages that it sends for the cover is a ", r("ReconciliationSendFingerprint"), " message, its ", r("ReconciliationSendFingerprintCovers"), " field should be set to ", r("recon_send_fp_count"), ". The ", r("ReconciliationSendFingerprintCovers"), " field of all other ", r("ReconciliationSendFingerprint"), " messages should be set to ", r("covers_none"), "."),

                    pinformative(R("ReconciliationSendFingerprint"), " messages use the ", r("ReconciliationChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "ReconciliationAnnounceEntries",
                            plural: "ReconciliationAnnounceEntries",
                            comment: ["Prepare transmission of the ", rs("LengthyEntry"), " a peer has in a ", r("D3Range"), " as part of ", r("d3rbsr"), "."],
                            fields: [
                                {
                                    id: "ReconciliationAnnounceEntriesRange",
                                    name: "range",
                                    comment: ["The ", r("D3Range"), " whose ", rs("LengthyEntry"), " to transmit."],
                                    rhs: r("D3Range"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesEmpty",
                                    name: "is_empty",
                                    comment: ["True if and only if the the sender has zero ", rs("Entry") ," in the ", r("ReconciliationAnnounceEntriesRange"), "."],
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesFlag",
                                    name: "want_response",
                                    comment: ["A boolean flag to indicate whether the sender wishes to receive a ", r("ReconciliationAnnounceEntries"), " message for the same ", r("D3Range"), " in return."],
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesWillSort",
                                    name: "will_sort",
                                    comment: ["Whether the sender promises to send the <Rs n="Entry"/> in the ", r("ReconciliationAnnounceEntriesRange"), " sorted ascendingly by ", r("entry_subspace_id"), " first, ", r("entry_path"), " second."],
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("ReconciliationAnnounceEntriesRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("ReconciliationAnnounceEntriesRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesCovers",
                                    name: "covers",
                                    comment: ["If this message is the last of a set of messages that together cover the ", r("ReconciliationSendFingerprintRange"), " of some prior ", r("ReconciliationSendFingerprint"), " message, then this field contains the ", r("range_count"), " of that ", r("ReconciliationSendFingerprint"), " message. Otherwise, ", r("covers_none"), "."],
                                    rhs: pseudo_choices(r("U64"), r("covers_none")),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("ReconciliationAnnounceEntries"), " messages let peers begin transmission of their ", rs("LengthyEntry"), " in a ", r("D3Range"), ". Each ", r("ReconciliationAnnounceEntries"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers that contain the ", r("ReconciliationAnnounceEntriesRange"), "; this upholds read access control."),

                    pinformative("Actual transmission of the ", rs("LengthyEntry"), " in the ", r("ReconciliationAnnounceEntriesRange"), " happens via ", r("ReconciliationSendEntry"), " messages. The ", r("ReconciliationAnnounceEntriesWillSort"), " flag should be set to ", code("1"), " if the sender will transmit the ", rs("LengthyEntry"), marginale([
                        "Sorting the <Rs n="Entry"/> allows the receiver to determine which of its own <Rs n="Entry"/> it can omit from a reply in constant space. For unsorted <Rs n="Entry"/>, peers that cannot allocate a linear amount of memory have to resort to possibly redundant <R n="Entry"/> transmissions to uphold the correctness of ", r("d3rbsr"), "."
                    ]), " sorted in ascending order by ", r("entry_subspace_id"), " first, using the ", r("entry_path"), " as a tiebreaker. If the sender will not guarantee this order, the flag must be set to ", code("0"), "."),

                    pinformative("No ", r("ReconciliationAnnounceEntries"), " message may be sent until all <Rs n="Entry"/> announced by a prior ", r("ReconciliationAnnounceEntries"), " message have been sent. The <Rs n="Entry"/> are known to all have been sent if the ", r("ReconciliationAnnounceEntriesEmpty"), " has been set to ", code("true"), ", or once a ", r("ReconciliationTerminatePayload"), " message with the ", r("ReconciliationTerminatePayloadFinal"), " flag set to ", code("true"), " has been sent."),

                    pinformative("When a peer receives a ", r("ReconciliationSendFingerprint"), " message that matches its local ", r("Fingerprint"), ", it should reply with a ", r("ReconciliationAnnounceEntries"), " message with ", r("ReconciliationAnnounceEntriesEmpty"), " set to ", code("true"), " and ", r("ReconciliationAnnounceEntriesFlag"), " ", code("false"), ", to indicate to the other peer that reconciliation of the ", r("D3Range"), " has concluded successfully."),

                    pinformative("When a peer receives a ", r("ReconciliationSendFingerprint"), " message of some ", r("range_count"), " ", def_value({id: "recon_announce_count", singular: "count"}), ", it may recurse by producing a cover of smaller ", rs("D3Range"), ". For each subrange of that cover, it sends either a ", r("ReconciliationSendFingerprint"), " message or a ", r("ReconciliationAnnounceEntries"), " message. If the last of these messages that it sends for the cover is a ", r("ReconciliationAnnounceEntries"), " message, its ", r("ReconciliationAnnounceEntriesCovers"), " field should be set to ", r("recon_announce_count"), ". The ", r("ReconciliationAnnounceEntriesCovers"), " field of all other ", r("ReconciliationAnnounceEntries"), " messages should be set to ", r("covers_none"), "."),

                    pinformative(R("ReconciliationAnnounceEntries"), " messages use the ", r("ReconciliationChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "ReconciliationSendEntry",
                            plural: "ReconciliationSendEntries",
                            comment: ["Transmit a ", r("LengthyEntry"), " as part of ", r("d3rbsr"), "."],
                            fields: [
                                {
                                    id: "ReconciliationSendEntryEntry",
                                    name: "entry",
                                    comment: ["The ", r("LengthyEntry"), " itself."],
                                    rhs: r("LengthyEntry"),
                                },
                                {
                                    id: "ReconciliationSendEntryStaticTokenHandle",
                                    name: "static_token_handle",
                                    comment: ["A ", r("StaticTokenHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that is ", r("handle_bind", "bound"), " to the static part of the ", r("ReconciliationSendEntryEntry"), "’s ", r("AuthorisationToken"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ReconciliationSendEntryDynamicToken",
                                    name: "dynamic_token",
                                    comment: ["The dynamic part of the ", r("ReconciliationSendEntryEntry"), "’s ", r("AuthorisationToken"), "."],
                                    rhs: r("DynamicToken"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("ReconciliationSendEntry"), " messages let peers transmit <Rs n="Entry"/> as part of ", r("d3rbsr"), ". These messages may only be sent after a ", r("ReconciliationAnnounceEntries"), " with its ", r("ReconciliationAnnounceEntriesEmpty"), " flag set to ", code("false"), ", or a ", r("ReconciliationTerminatePayload"), " with its ", r("ReconciliationTerminatePayloadFinal"), " flag set to ", code("false"), ". The transmitted <Rs n="Entry"/> must be ", r("d3_range_include", "included"), " in the ", r("D3Range"), " of the corresponding ", r("ReconciliationAnnounceEntries"), " message."),

                    pinformative("No ", r("ReconciliationAnnounceEntries"), " or ", r("ReconciliationSendEntry"), " message may be sent after a ", r("ReconciliationSendEntry"), " message, until a sequence of zero or more ", r("ReconciliationSendPayload"), " messages followed by exactly one ", r("ReconciliationTerminatePayload"), " message has been sent. If the ", r("ReconciliationTerminatePayloadFinal"), " flag of the ", r("ReconciliationTerminatePayload"), " message is set to ", code("false"), ", then another ", r("ReconciliationSendEntry"), " message may be sent. Otherwise, another ", r("ReconciliationAnnounceEntries"), " message may be sent."),

                    pinformative(R("ReconciliationSendEntry"), " messages use the ", r("ReconciliationChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "ReconciliationSendPayload",
                            comment: ["Transmit some ", link_name("sync_payloads_transform", "transformed"), " ", r("Payload"), " bytes."],
                            fields: [
                                {
                                    id: "ReconciliationSendPayloadAmount",
                                    name: "amount",
                                    comment: ["The number of transmitted bytes."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ReconciliationSendPayloadBytes",
                                    name: "bytes",
                                    comment: [r("ReconciliationSendPayloadAmount"), " many bytes, a substring of the bytes obtained by applying ", r("transform_payload"), " to the ", r("Payload"), " to be transmitted."],
                                    rhs: ["[", hl_builtin("u8"), "]"],
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("ReconciliationSendPayload"), " messages let peers transmit (parts of) ", link_name("sync_payloads_transform", "transformed"), " ", rs("Payload"), "."),

                    pinformative("Each ", r("ReconciliationSendPayload"), " message transmits a successive (starting at byte zero) part of the result of applying ", r("transform_payload"), " to the ", r("Payload"), " of the <R n="Entry"/> with the most recent ", r("ReconciliationSendEntry"), " message by the sender. The WGPS does not concern itself with how (or whether) the receiver can reconstruct the original ", r("Payload"), " from these chunks of transformed bytes, that is a detail of choosing a suitable transformation function."),

                    pinformative("After sending a ", r("ReconciliationSendPayload"), " message, a peer may not send ", r("ReconciliationAnnounceEntries"), " or ", r("ReconciliationSendEntry"), " messages until it has sent a ", r("ReconciliationTerminatePayload"), " message. ", r("ReconciliationSendPayload"), " messages must only be sent when there was a corresponding ", r("ReconciliationSendEntry"), " message that indicates which <R n="Entry"/> the payload chunk belongs to."),

                    pinformative(R("ReconciliationSendEntry"), " messages use the ", r("ReconciliationChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "ReconciliationTerminatePayload",
                            comment: ["Indicate that no more bytes will be transmitted for the currently transmitted ", r("Payload"), " as part of set reconciliation."],
                            fields: [
                                {
                                    id: "ReconciliationTerminatePayloadFinal",
                                    name: "is_final",
                                    comment: ["True if and only if no further ", r("ReconciliationSendEntry"), " message will be sent as part of reconciling the current ", r("D3Range"), "."],
                                    rhs: r("Bool"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("ReconciliationTerminatePayload"), " messages let peers indicate that they will not send more payload bytes for the current <R n="Entry"/> as part of set reconciliation. This may be because the end of the ", r("Payload"), " has been reached, or simply because the peer chooses to not send any further bytes."),

                    pinformative("The ", r("ReconciliationTerminatePayloadFinal"), " flag announces whether more <Rs n="Entry"/> will be sent as part of the current ", r("D3Range"), "."),

                    pinformative(R("ReconciliationTerminatePayload"), " messages use the ", r("ReconciliationChannel"), "."),
                ]),

                hsection("sync_data", "Data", [
                    pinformative("Outside of ", link_name("d3_range_based_set_reconciliation", "3d range-based set reconciliation"), " peers can unsolicitedly push <Rs n="Entry"/> and ", rs("Payload"), " to each other, and they can request specific ", rs("Payload"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataSendEntry",
                            comment: ["Transmit an ", r("AuthorisedEntry"), " to the other peer, and optionally prepare transmission of its ", r("Payload"), "."],
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
                                    comment: ["A ", r("StaticTokenHandle"), " ", r("handle_bind", "bound"), " to the ", r("StaticToken"), " of the <R n="Entry"/> to transmit."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSendEntryDynamic",
                                    name: "dynamic_token",
                                    comment: ["The ", r("DynamicToken"), " of the <R n="Entry"/> to transmit."],
                                    rhs: r("DynamicToken"),
                                },
                                {
                                    id: "DataSendEntryOffset",
                                    name: "offset",
                                    comment: ["The offset in the ", r("Payload"), " in bytes at which ", r("Payload"), " transmission will begin. If this is equal to the <R n="Entry"/>’s ", r("entry_payload_length"), ", the ", r("Payload"), " will not be transmitted."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("DataSendEntry"), " messages let peers transmit ", rs("LengthyEntry"), " outside of ", r("d3rbsr"), ". They further set up later ", r("Payload"), " transmissions (via ", r("DataSendPayload"), " messages)."),

                    pinformative("To map ", r("Payload"), " transmissions to <Rs n="Entry"/>, each peer maintains a piece of state: an <R n="Entry"/> ", def_value("currently_received_entry"), marginale(["These are used by ", r("DataSendPayload"), " messages."]), ". When receiving a ", r("DataSendEntry"), " message, a peer sets its ", r("currently_received_entry"), " to the received ", r("DataSendEntryEntry"), "."),

                    pinformative("Initially, ", r("currently_received_entry"), " is ", code(function_call(r("default_entry"), r("sync_default_namespace_id"), r("sync_default_subspace_id"), r("sync_default_payload_digest"))), "."),

                    pinformative(R("DataSendEntry"), " messages use the ", r("DataChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataSendPayload",
                            comment: ["Transmit some ", link_name("sync_payloads_transform", "transformed"), " ", r("Payload"), " bytes."],
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
                                    comment: [r("DataSendPayloadAmount"), " many bytes, a substring of the bytes obtained by applying ", r("transform_payload"), " to the ", r("Payload"), " to be transmitted."],
                                    rhs: ["[", hl_builtin("u8"), "]"],
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("DataSendPayload"), " messages let peers transmit (parts of) ", link_name("sync_payloads_transform", "transformed"), " ", rs("Payload"), "."),

                    pinformative("Each ", r("DataSendPayload"), " message transmits a successive part of the result of applying ", r("transform_payload"), " to the ", r("Payload"), " of the ", r("currently_received_entry"), " of the receiver. The WGPS does not concern itself with how (or whether) the receiver can reconstruct the original ", r("Payload"), " from these chunks of transformed bytes, that is a detail of choosing a suitable transformation function."),

                    pinformative(R("DataSendPayload"), " messages use the ", r("DataChannel"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataSetMetadata",
                            comment: ["Express preferences for ", r("Payload"), " transfer in the intersection of two <Rs n="AreaOfInterest"/>."],
                            fields: [
                                {
                                    id: "DataSetMetadataSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSetMetadataReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSetMetadataEagerness",
                                    name: "is_eager",
                                    comment: ["Whether the other peer should eagerly forward ", rs("Payload"), " in this intersection."],
                                    rhs: r("Bool"),
                                },
                            ],
                        }),
                    ),

                    pinformative("The ", r("DataSetMetadata"), " messages let peers express whether the other peer should eagerly push ", rs("Payload"), " from the intersection of two <Rs n="AreaOfInterest"/>, or whether they should send only ", r("DataSendEntry"), " messages for that intersection."),

                    pinformative(R("DataSetMetadata"), " messages are not binding, they merely present an optimisation opportunity. In particular, they allow expressing the ", code("Prune"), " and ", code("Graft"), " messages of the ", link("epidemic broadcast tree protocol", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), "."),

                    pseudocode(
                        new Struct({
                            id: "DataBindPayloadRequest",
                            comment: [R("handle_bind"), " an <R n="Entry"/> to a ", r("PayloadRequestHandle"), " and request transmission of its ", r("Payload"), " from an offset."],
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
                                    comment: ["The offset in the ", r("Payload"), " starting from which the sender would like to receive the ", r("Payload"), " bytes."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataBindPayloadRequestCapability",
                                    name: "capability",
                                    comment: ["A ", r("resource_handle"), " for a ", r("ReadCapability"), " ", r("handle_bind", "bound"), " by the sender that grants them read access to the ", r("handle_bind", "bound"), " <R n="Entry"/>."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),

                    pinformative([
                        marginale(["If the receiver of a ", r("DataBindPayloadRequest"), " does not have the requested ", r("Payload"), " and does not plan to obtain it in the future, it should signal so by ", r("handle_free", "freeing"), " the ", r("PayloadRequestHandle"), "."]),
                        "The ", r("DataBindPayloadRequest"), " messages let peers explicitly request ", rs("Payload"), ", by binding a ", r("PayloadRequestHandle"), " to the specified ", r("DataBindPayloadRequestEntry"), " and ", r("DataBindPayloadRequestOffset"), ". The other peer is expected to then transmit the ", r("Payload"), ", starting at the specified ", r("DataBindPayloadRequestOffset"), ". The request contains a ", r("CapabilityHandle"), " to a ", r("ReadCapability"), " whose ", r("granted_area"), " must ", r("area_include"), " the requested <R n="Entry"/>.",
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

                    pinformative("The ", r("DataReplyPayload"), " messages let peers reply to ", r("DataBindPayloadRequest"), " messages, by indicating that future ", r("DataSendPayload"), " messages will pertain to the requested ", r("Payload"), ". More precisely, upon receiving a ", r("DataReplyPayload"), " message, a peer sets its ", r("currently_received_entry"), " value to that to which the message", apo, "s ", r("DataReplyPayloadHandle"), " is ", r("handle_bind", "bound"), "."),

                    pinformative(R("DataReplyPayload"), " messages use the ", r("DataChannel"), "."),
                ]),
                hsection("sync_control", "Resource Control", [
                    pinformative("Finally, we maintain ", rs("logical_channel"), " and ", r("handle_free"), " ", rs("resource_handle"), ", as explained in the ", link_name("resources_message_types", "resource control document"), "."),

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
                              "Promise to the other peer an upper bound on the number of bytes of messages that you will send on some ", r("logical_channel"), ".",
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
                              "Promise to the other peer an upper bound on the number of bytes of messages that you will still receive on some ", r("logical_channel"), ".",
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
                            comment: ["Notify the other peer that you have started dropping messages and will continue to do so until you receives a ", r("ControlApologise"), " message. Note that you must send any outstanding ", rs("guarantee"), " of the ", r("logical_channel"), " before sending a ", r("ControlAnnounceDropping"), " message."],
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
                            comment: ["Notify the other peer that it can stop dropping messages of this ", r("logical_channel"), "."],
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
                                    comment: ["Indicates whether the peer sending this message is the one who created the ", r("ControlFreeHandleHandle"), " (", code("true"), ") or not (", code("false"), ")."],
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
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_group_member"}), " for ", r("PsiGroup"), ".",
                        ),
                        preview_scope(
                            marginale(["When using the ", r("McSubspaceCapability"), " type, you can use ", r("encode_mc_subspace_capability"), ", but omitting the encoding of the ", r("subspace_cap_namespace"), "."]),
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_subspace_capability"}), " for ", rs("SubspaceCapability"), " of known ", r("subspace_granted_namespace"), ".",
                        ),
                        preview_scope(
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_sync_subspace_signature"}), " for ", r("sync_subspace_signature"), ".",
                        ),
                        preview_scope(
                            marginale(["When using the ", r("Capability"), " type, you can use ", r("encode_mc_capability"), ", but omitting the encoding of the ", r("communal_cap_namespace"), "."]),
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_read_capability"}), " for ", rs("ReadCapability"), " of known ", r("granted_namespace"), " and whose ", r("granted_area"), " is <R n="area_include_area">included</R> in some known ", r("Area"), ".",
                        ),
                        preview_scope(
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_sync_signature"}), " for ", r("sync_signature"), ".",
                        ),
                        preview_scope(
                            marginale(["Used indirectly when encoding <Rs n="Entry"/>, ", rs("Area"), ", and ", rs("D3Range"), "."]),
                            "An ", r("encoding_function"), " for <R n="SubspaceId"/>.",
                        ),
                        preview_scope(
                            marginale(["The total order makes ", rs("D3Range"), " meaningful, the least element and successors ensure that every ", r("Area"), " can be expressed as an equivalent ", r("D3Range"), "."]),
                            "A ", link("total order", "https://en.wikipedia.org/wiki/Total_order"), " on <R n="SubspaceId"/> with least element ", r("sync_default_subspace_id"), ", in which for every non-maximal <R n="SubspaceId"/> ", def_value({id: "subspace_successor_s", singular: "s"}), " there exists a successor ", def_value({id: "subspace_successor_t", singular: "t"}), " such that ", r("subspace_successor_s"), " is less than ", r("subspace_successor_t"), " and no other <R n="SubspaceId"/> is greater than ", r("subspace_successor_s"), " and less than ", r("subspace_successor_t"), ".",
                        ),
                        preview_scope(
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_static_token"}), " for ", r("StaticToken"), ".",
                        ),
                        preview_scope(
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_dynamic_token"}), " for ", r("DynamicToken"), ".",
                        ),
                        preview_scope(
                            "An ", r("encoding_function"), " ", def_parameter_fn({id: "encode_fingerprint"}), " for ", r("Fingerprint"), ".",
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
                                code(function_call(r("encode_subspace_capability"), field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilityCapability"))), " — the known ", r("granted_namespace"), " is the <R n="NamespaceId"/> of the ", r("fragment"), " corresponding to ", field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilityHandle"),
                            ]],
                            [[
                                code(function_call(r("encode_sync_subspace_signature"), field_access(r("enc_pai_reply_cap"), "PaiReplySubspaceCapabilitySignature"))),
                            ]],
                        ),
                    ),

                ]),

                hsection("sync_encode_setup", "Setup", [
                    pinformative(
                        "Let ", def_value({id: "enc_setup_read", singular: "m"}), " be a ", r("SetupBindReadCapability"), " message, let ", def_value({id: "enc_setup_read_granted_area", singular: "granted_area"}), " be the ", r("granted_area"), " of ", field_access(r("enc_setup_read"), "SetupBindReadCapabilityCapability"), ", let ", def_value({id: "enc_setup_read_frag", singular: "frag"}), " be the ", r("fragment"), " corresponding to ", field_access(r("enc_setup_read"), "SetupBindReadCapabilityHandle"), ", and let ", def_value({id: "enc_setup_read_pre", singular: "pre"}), " be the <R n="Path"/> of ", r("enc_setup_read_frag"), ".",
                    ),

                    pinformative("Define ", def_value({id: "enc_setup_read_outer", singular: "out"}), " as the ", r("Area"), " with", lis(
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
                                code(function_call(r("encode_read_capability"), field_access(r("enc_setup_read"), "SetupBindReadCapabilityCapability"))), " — the known ", r("granted_namespace"), " is the <R n="NamespaceId"/> of ", r("enc_setup_read_frag"), ", and the known ", r("area_include_area", "including"), " ", r("Area"), " is ", r("enc_setup_read_outer"),
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
                                ), ", where ", def_value({id: "enc_setup_aoi_outer", singular: "out"}), " is the ", r("granted_area"), " of the <R n="read_capability"/> to which ", field_access(r("enc_setup_aoi"), "SetupBindAreaOfInterestCapability"), " is ", r("handle_bind", "bound"),
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
                        "Successive reconciliation messages often concern related ", rs("D3Range"), " and <Rs n="Entry"/>. We exploit this for more efficient encodings by allowing to specify ", rs("D3Range"), " and <Rs n="Entry"/> in relation to the previously sent one. To allow for this optimization, peers need to track the following pieces of state:",

                        lis(
                            [
                                "A ", r("D3Range"), " ", def_value({id: "sync_enc_prev_range", singular: "prev_range"}), ", which is updated every time after proccessing a ", r("ReconciliationSendFingerprint"), " or ", r("ReconciliationAnnounceEntries"), " message to the message’s ", r("ReconciliationSendFingerprintRange"), ". The initial value is ", code(function_call(r("default_3d_range"), r("sync_default_subspace_id"))), "."
                            ],
                            [
                                "An ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_prev_sender", singular: "prev_sender_handle"}), ", which is updated every time after proccessing a ", r("ReconciliationSendFingerprint"), " or ", r("ReconciliationAnnounceEntries"), " message to the message’s ", r("ReconciliationSendFingerprintSenderHandle"), ". The initial value is ", code("0"), "."
                            ],
                            [
                                "An ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_prev_receiver", singular: "prev_receiver_handle"}), ", which is updated every time after proccessing a ", r("ReconciliationSendFingerprint"), " or ", r("ReconciliationAnnounceEntries"), " message to the message’s ", r("ReconciliationSendFingerprintReceiverHandle"), ". The initial value is ", code("0"), "."
                            ],
                            [
                                "An <R n="Entry"/> ", def_value({id: "sync_enc_prev_entry", singular: "prev_entry"}), ", which is updated every time after proccessing a ", r("ReconciliationSendEntry"), " message to the ", r("lengthy_entry_entry"), " of the message’s ", r("ReconciliationSendEntryEntry"), ". The initial value is ", code(function_call(r("default_entry"), r("sync_default_namespace_id"), r("sync_default_subspace_id"), r("sync_default_payload_digest"))), "."
                            ],
                            [
                                "A ", r("StaticTokenHandle"), " ", def_value({id: "sync_enc_prev_token", singular: "prev_token"}), ", which is updated every time after proccessing a ", r("ReconciliationSendEntry"), " message to the message’s ", r("ReconciliationSendEntryStaticTokenHandle"), ". The initial value is ", code("0"), "."
                            ],
                        ),
                    ),

                    pinformative(
                        "Given two ", rs("AreaOfInterestHandle"), " ", def_value({id: "aoi2range1", singular: "aoi1"}), " and ", def_value({id: "aoi2range2", singular: "aoi2"}), ", we define ", code(function_call(def_fn({id: "aoi_handles_to_3drange"}), r("aoi2range1"), r("aoi2range2"))), " as the ", r("D3Range"), " that ", rs("d3_range_include"), " the same <Rs n="Entry"/> as the ", r("area_intersection"), " of the ", rs("aoi_area"), " of the <Rs n="AreaOfInterest"/> to which ", r("aoi2range1"), " and ", r("aoi2range2"), " are ", r("handle_bind", "bound"), "."
                    ),

                    hr(),

                    pinformative(
                        "The encoding of a ", r("ReconciliationSendFingerprint"), " message ", def_value({id: "enc_recon_fp", singular: "m"}), " starts with a bitfield:",
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
                        "The encoding of a ", r("ReconciliationAnnounceEntries"), " message ", def_value({id: "enc_recon_announce", singular: "m"}), " is the concatenation of:",
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
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesFlag"), " == ", code("true")),
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
                                    code("1"), " ", r("iff"), " ", code(field_access(r("enc_recon_announce"), "ReconciliationAnnounceEntriesEmpty"), " == ", code("true")),
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
                        "The WGPS mandates a strict cadence of ", r("ReconciliationAnnounceEntries"), " messages followed by ", r("ReconciliationSendEntry"), " messages, there are no points in time where it would be valid to send both. Hence, their encodings need not be distinguishable."
                    ),

                    pinformative(
                        "When it is possible to receive a ", r("ReconciliationSendEntry"), " message, denote the preceeding ", r("ReconciliationAnnounceEntries"), " message by ", def_value({id: "sync_enc_rec_announced", singular: "announced"}), ".",
                    ),

                    pinformative(
                        "The encoding of a ", r("ReconciliationSendEntry"), " message ", def_value({id: "enc_recon_entry", singular: "m"}), " starts with a bitfield:",
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
                        r("ReconciliationSendPayload"), " and ", r("ReconciliationTerminatePayload"), " messages need to be distinguishable from each other, but not from ", r("ReconciliationAnnounceEntries"), " or ", r("ReconciliationSendEntry"), " messages."
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
                        "When encoding <Rs n="Entry"/> for ", r("DataSendEntry"), " and ", r("DataBindPayloadRequest"), " messages, the <R n="Entry"/> can be encoded either relative to the ", r("currently_received_entry"), ", or as part of an ", r("Area"), ". Such an ", r("Area"), " ", def_value({id: "sync_enc_data_outer", singular: "out"}), " is always specified as the ", r("area_intersection"), " of the ", rs("Area"), " ", r("handle_bind", "bound"), " by an ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_data_sender", singular: "sender_handle"}), " ", r("handle_bind", "bound"), " by the sender of the encoded message, and an ", r("AreaOfInterestHandle"), " ", def_value({id: "sync_enc_data_receiver", singular: "receiver_handle"}), " ", r("handle_bind", "bound"), " by the receiver of the encoded message.",
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
                            [r("IntersectionChannel"), " to ", code("010"), ","],
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
                            [r("IntersectionHandle"), " to ", code("000"), ","],
                            [r("CapabilityHandle"), " to ", code("001"), ","],
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
