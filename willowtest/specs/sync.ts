import { R, def, def_fake, r, rs } from "../../defref.ts";
import { aside, code, em, img, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale, sidenote } from "../../marginalia.ts";
import { Expression } from "../../tsgen.ts";
import { site_template, pinformative, lis, pnormative, link, def_parameter, def_value, def_fake_value, aside_block, ols } from "../main.ts";
import { $, $comma, $dot } from "../../katex.ts";
import { SimpleEnum, pseudocode, hl_builtin, Struct } from "../../pseudocode.ts";
import { asset } from "../../out.ts";

export const sync: Expression = site_template(
    {
        title: "Willow General Purpose Sync Protocol",
        name: "sync",
    },
    [
        pinformative("The ", link_name("data_model", "willow data model"), " specifies how to arrange data, but it does not prescribe how peers should synchronize data. In this document, we specify one possible way for performing synchronization: the ", def("WGPS", "Willow General Purpose Sync (WGPS) protocol"), ". This document assumes familiarity with the ", link_name("data_model", "willow data model"), "."),

        hsection("sync_intro", "Introduction", [
            pinformative("The WGPS aims to be appropriate for a variety of networking settings, particularly those of peer-to-peer systems where the replicating parties might not necessarily trust each other. Quite a bit of engineering went into the WGPS to satisfy the following requirements:"),

            lis(
                "Incremental sync: peers can detect regions of shared data with relatively sparse communication to avoid redundant data transfer.",
                "Partial sync: peers synchronize only those regions of data they both care about, at sub-namespace granularity.",
                "Access control: conformant peers only hand out data if the request authorizes its access.",
                "Private set intersection: peers can discover which namespaces they have in common without disclosing any non-common namespaces to each other.",
                "Resource control: peers communicate (and enforce) their computational resource limits so as not to overload each other.",
                "Transport independence: peers can communicate over arbitrary reliable, ordered, byte-oriented channels, whether tcp, quic, or unix pipe.",
                "General efficiency: peers can make use of efficient implementation techniques, and the overall bandwidth consumption stays low.",
            ),

            pinformative("The WGPS provides a shared vocabulary for peers to communicate with, but nothing more. It cannot and does not force peers to use it efficiently or to use the most efficient data structures internally. That is a feature! Implementations can start out with inefficient but simple implementation choices and later replace those with better-scaling ones. Throughout that evolution, the implementations stay compatible with any other implementation, regardless of its degree of sophistication."),

            // pnormative("Throughout this specification, paragraphs styled like this one are normative. Implementations ", link("MUST", "https://datatracker.ietf.org/doc/html/rfc2119"), " adhere to all normative content. The other (informative) content is for human eyes only, don't show it to your computer."),
        ]),

        hsection("sync_concepts", "Concepts", [
            pinformative("Data synchronization for willow needs to solve a number of sub-problems, which we summarize in this section."),

            hsection("sync_psi", "Private Set Intersection", [
                pinformative("The WGPS allows two peers to determine which ", rs("namespace"), " they share an interest in without leaking any information about the ", rs("namespace"), " which they do not both know about. We explain the underlying ", link_name("psi", "private set intersection protocol here"), "."),
            ]),

            hsection("sync_access", "Access Control", [
                pinformative("Peers only transfer data to peers that can prove that they are allowed to access that data. We describe how peers authenticate their requests ", link_name("access_control", "here"), "."),
            ]),

            hsection("sync_partial", "Partial Synchronization", [
                pinformative(marginale(["Note that peers need abide to the ", rs("aoi_count_limit"), " and ", rs("aoi_size_limit"), " of the ", rs("aoi"), " only on a best-effort basis. Imagine Betty has just transmitted her 100 newest ", rs("entry"), " to Alfie, only to then receive an even newer ", r("entry"), " from Gemma. Betty should forward that ", r("entry"), " to Alfie, despite that putting her total number of transmissions above the limit of 100."]), "To synchronize data, peers specify any number of ", rs("aoi"), ". The ", r("aoi_empty", "non-empty"), " ", rs("aoi_intersection"), " of ", rs("aoi"), " from both peers contain the ", rs("entry"), " that need to be synchronized."),

                pinformative("The WGPS synchronizes these ", rs("aoi_intersection"), " via ", r("3drbsr"), ", a technique we ", link_name("range3d_based_set_reconciliation", "explain in detail here"), "."),

                // pinformative("Note that peers need abide to the ", rs("aoi_count_limit"), " and ", rs("aoi_size_limit"), " of the ", rs("aoi"), " only on a best-effort basis. Imagine Betty has just transmitted her 100 newest ", rs("entry"), " to Alfie, only to then receive an even newer ", r("entry"), " from Gemma. Betty should forward that ", r("entry"), " to Alfie, despite that putting her total number of transmissions above the limit of 100."),
            ]),

            hsection("sync_post_sync_forwarding", "Post-Reconciliation Forwarding", [
                pinformative("After performing ", r("3drbsr", "set reconciliation"), ", peers might receive new ", rs("entry"), " that fall into their shared ", rs("aoi"), ". Hence, the WGPS allows peers to transmit ", rs("entry"), " unsolicitedly."),
            ]),

            hsection("sync_payloads", "Payload transmissions", [
                pinformative("When peers send an ", r("entry"), ", they can choose whether to include the full ", r("payload"), " or only its ", r("payload_hash", "hash"), ". Peers exchange ", sidenote("preferences", ["These preferences are not binding. The number of ", rs("aoi_intersection"), " between the peers' ", rs("aoi"), " can be quadratic in the number of ", rs("aoi"), ", and we do not want to mandate keeping a quadratic amount of state."]), " for eager or lazy ", r("payload"), " transmission based on ", rs("payload_length"), " and ", rs("aoi"), ". These preferences are expressive enough to implement the ", link("plumtree", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), " algorithm."),

                pinformative("Peers can further explicitly request the ", rs("payload"), " of arbitrary ", rs("entry"), "."),
            ]),

            hsection("sync_resources", "Resource Limits", [
                pinformative("Multiplexing and management of shared state require peers to inform each other of their resource limits, lest one peer overloads the other. We describe a protocol-agnostic solution based on ", rs("logical_channel"), " and ", rs("resource_handle"), " ", link_name("resource_control", "here"), "."),
            ]),
        ]),
        
        hsection("sync_parameters", "Parameters", [
            pinformative("The WGPS is generic over specific cryptographic primitives. In order to use it, one must first specify a full suite of instantiations of the ", link_name("willow_parameters","parameters of the core willow data model"), ". The WGPS also introduces some additional parameters for ", link_name("psi", "private set intersection"), ", ", link_name("access_control", "access control"), ", and ", link_name("range3d_based_set_reconciliation", "3d-range-based set reconciliation"), "."),

            pinformative(link_name("psi", "Private set intersection"), " requires a type ", def_parameter("PsiGroup"), " whose values are the members of a ", link("finite cyclic groups suitable for key exchanges", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalization_to_finite_cyclic_groups"), ", a type ", def_parameter("PsiScalar", "PsiScalar"), " of scalars, and a function ", def_parameter("psi_scalar_multiplication", "psi_scalar_multiplication"), " that computes scalar multiplication in the group. Further, we require ", rs("encoding_function"), " for ", r("PsiGroup"), " and ", r("PsiScalar"), ". Finally, we require a function ", def_parameter("psi_id_to_group", "psi_id_to_group"), " that hashes arbitrary ", rs("namespace_id"), " into ", r("PsiGroup"), "."),

            pinformative(link_name("3drbsr", "3d-range-based set reconciliation"), " requires a type ", def_parameter("Fingerprint"), " of ", rs("entry_fingerprint"), ", a hash function ", def_parameter("fingerprint_singleton"), " from ", rs("lengthy_entry"), " into ", r("Fingerprint"), " for computing ", rs("entry_fingerprint"), " of singleton ", r("lengthy_entry"), " sets, an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), ", ", link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), " ", link("binary operation", "https://en.wikipedia.org/wiki/Binary_operation"), " ", def_parameter("fingerprint_combine"), " on ", r("Fingerprint"), " for computing the ", rs("entry_fingerprint"), " of larger ", r("lengthy_entry"), " sets, and a value ", def_parameter("fingerprint_neutral"), " of type ", r("Fingerprint"), " that is a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " for ", r("fingerprint_combine"), " for serving as the ", r("entry_fingerprint"), " of the empty set."),

            pinformative(link_name("access_control", "Access control"), " requires a type ", def_parameter("ReadCapability"), " of ", rs("read_capability"), ", a type ", def_parameter({id: "sync_receiver", singular: "receiver"}), " of ", rs("access_receiver"), ", and a type ", def_parameter({ id: "sync_signature", singular: "SyncSignature"}), " of signatures issued by the ", rs("sync_receiver"), ". The ", rs("access_challenge"), " have length ", def_parameter("challenge_length"), ", and the hash function used for the ", r("commitment_scheme"), " is a parameter ", def_parameter("challenge_hash"), ". We require an ", r("encoding_function"), " for ", r("sync_signature"), ", and an ", r("encoding_function"), " for ", rs("ReadCapability"), " that does not encode their ", r("granted_namespace"), "."),
        ]),

        hsection("sync_protocol", "Protocol", [
            pinformative("The protocol is mostly message-based, with the exception of the first few bytes of communication. To break symmetry, we refer to the peer that initiated the synchronization session as ", def({id: "alfie", singular: "Alfie"}, "Alfie", [def_fake("alfie", "Alfie"), " refers to the peer that initiated a WGPS synchronization session. We occasionally use this terminology to break symmetry in the protocol."]), ", and the other peer as ", def({id: "betty", singular: "Betty"}, "Betty", [def_fake("betty", "Betty"), " refers to the peer that accepted a WGPS synchronization session. We occasionally use this terminology to break symmetry in the protocol."]), "."),

            pinformative(`Peers might receive invalid messages, both syntactically (i.e., invalid encodings) and semantically (i.e., logically inconsistent messages). In both cases, the peer to detect this behavior must abort the sync session. We indicate such situations by writing that something “is an error”. Any message that refers to a fully freed resource handle is an error. More generally, whenever we state that a message must fulfill some criteria, but a peer receives a message that does not fulfill these criteria, that is an error.`),

            pinformative("Before any communication, each peer locally and independently generates some random data: a ", r("challenge_length"), " byte number ", def_value("nonce"), ", and a random value ", def_value("scalar"), " of type ", r("PsiScalar"), ". Both are used for cryptographic purposes and must thus use high-quality sources of randomness."),

            pinformative("The first byte each peer sends must be a natural number ", $dot("x \\leq 64"), " This sets the ", def_value({id: "peer_max_payload_size", singular: "maximum payload size"}), " of that peer to", $dot("2^x"), "This sets a limit on when the other peer may include ", rs("payload"), " directly when transmitting ", rs("entry"), ": when a ", r("payload_length"), " is strictly greater than the ", r("peer_max_payload_size"), ", it may only be transmitted when explicitly requested."),

            pinformative("The next ", r("challenge_length"), " bytes a peer sends are the ", r("challenge_hash"), " of ", r("nonce"), "; we call the bytes that a peer received this way its ", def_value("received_commitment"), "."),

            pinformative("After those initial transmissions, the protocol becomes a purely message-based protocol. There are several kinds of messages, which the peers create, encode as byte strings, and transmit mostly independently from each other."),

            pinformative("The messages make use of the following ", rs("resource_handle"), ":"),

            pseudocode(
                new SimpleEnum({
                    id: "HandleKind",
                    comment: ["The different ", rs("resource_handle"), " employed by the ", r("WGPS"), "."],
                    variants: [
                        {
                            id: "NamespaceHandle",
                            comment: [R("resource_handle"), " for ", rs("namespace"), " that the peers wish to sync. More precisely, a ", r("NamespaceHandle"), " stores a ", r("PsiGroup"), " member together with one of three possible states", marginale(["When registering ", rs("aoi"), ", peers can only specify namespaces by giving ", rs("NamespaceHandle"), " of state ", r("psi_state_public"), " or ", r("psi_state_private_completed"), "."]), ": ", lis(
                                [def_value({id: "psi_state_private_pending", singular: "private_pending"}, "private_pending", ["The ", def_fake_value("psi_state_private_pending", "private_pending"), " state indicates that the stored ", r("PsiGroup"), " member has been submitted for ", r("psi"), ", but the other peer has yet to reply with the result of multiplying its ", r("scalar"), "."]), "(waiting for the other peer to perform scalar multiplication)"],
                                [def_value({id: "psi_state_private_completed", singular: "private_completed"}, "private_completed", ["The ", def_fake_value("psi_state_private_completed", "private_completed"), " state indicates that the stored ", r("PsiGroup"), " member is the result of both peers multiplying their ", r("scalar"), " with the initial ", r("PsiGroup"), " member."]), "(both peers performed scalar multiplication)"],
                                [def_value({id: "psi_state_public", singular: "public"}, "public", ["The ", def_fake_value("psi_state_public", "public"), " state indicates that the stored value is a raw ", r("PsiGroup"), " member and no scalar multiplication will be performed (leaking the peer's interest in the ", r("namespace"), ")."]), "(do not perform ", r("psi"), ")"],
                            )],
                        },
                        {
                            id: "CapabilityHandle",
                            comment: [R("resource_handle"), " for ", rs("ReadCapability"), " that certify access to some ", rs("entry"), "."],
                        },
                        {
                            id: "AreaOfInterestHandle",
                            comment: [R("resource_handle"), " for ", rs("aoi"), " that peers wish to sync."],
                        },
                        {
                            id: "PayloadRequestHandle",
                            comment: [R("resource_handle"), " that controls the matching from ", r("payload"), " transmissions to ", r("payload"), " requests."],
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
                            comment: [R("logical_channel"), " for performing ", r("3drbsr"), "."],
                        },
                        {
                            id: "DataChannel",
                            comment: [R("logical_channel"), " for transmitting ", rs("entry"), " and ", rs("payload"), " outside of ", r("3drbsr"), "."],
                        },
                        {
                            id: "NamespaceChannel",
                            comment: [R("logical_channel"), " for controlling the issuing of new ", rs("NamespaceHandle"), "."],
                        },
                        {
                            id: "CapabilityChannel",
                            comment: [R("logical_channel"), " for controlling the issuing of new ", rs("CapabilityHandle"), "."],
                        },
                        {
                            id: "AreaOfInterestChannel",
                            comment: [R("logical_channel"), " for controlling the issuing of new ", rs("AreaOfInterestHandle"), "."],
                        },
                        {
                            id: "PayloadRequestChannel",
                            comment: [R("logical_channel"), " for controlling the issuing of new ", rs("PayloadRequestHandle"), "."],
                        },
                    ],
                }),
            ),

            hsection("sync_messages", "Messages", [
                pinformative("We now define the different kinds of messages. When we do not mention the ", r("logical_channel"), " that messages of a particular kind use, then these messages are ", rs("control_message"), " that do not belong to any ", r("logical_channel"), "."),

                hsection("reveal_commitment", code("RevealCommitment"), [
                    pseudocode(
                        new Struct({
                            id: "RevealCommitment",
                            comment: ["Complete the ", link_name("commitment_scheme", "commitment scheme"), " for determining the ", r("value_challenge"), " for ", r("read_authentication"), "."],
                            fields: [
                                {
                                    id: "RevealCommitmentNonce",
                                    name: "nonce",
                                    comment: ["The ", r("nonce"), " of the sender, encoded as a ", link("big-endian", "https://en.wikipedia.org/wiki/Endianness"), " ", link("unsigned integer", "https://en.wikipedia.org/w/index.php?title=Unsigned_integer"), "."],
                                    rhs: ["[", hl_builtin("u8"), "; ", r("challenge_length"), "]"],
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("RevealCommitment"), " messages let peers settle on a ", r("value_challenge"), " for proving read access to any data. Each peer must send this message at most once, and a peer should not send this message before having fully received a ", r("received_commitment"), "."),

                    pinformative("Upon receiving a ", r("RevealCommitment"), " message, a peer can determine its ", def_value({id: "value_challenge", singular: "challenge"}), ": for ", r("alfie"), ", ", r("value_challenge"), " is the ", link("bitwise exclusive or", "https://en.wikipedia.org/wiki/Bitwise_operation#XOR"), " of his ", r("nonce"), " and the received ", r("RevealCommitmentNonce"), ". For ", r("betty"), ", ", r("value_challenge"), " is the ", link("bitwise complement", "https://en.wikipedia.org/wiki/Bitwise_operation#NOT"), " of the ", link("bitwise exclusive or", "https://en.wikipedia.org/wiki/Bitwise_operation#XOR"), " of her ", r("nonce"), " and the received ", r("RevealCommitmentNonce"), "."),
                ]),
                
                hsection("bind_namespace_private", code("BindNamespacePrivate"), [
                    pseudocode(
                        new Struct({
                            id: "BindNamespacePrivate",
                            comment: [R("handle_bind"), " a ", r("namespace"), " to a ", r("NamespaceHandle"), " for performing ", r("psi"), "."],
                            fields: [
                                {
                                    id: "BindNamespacePrivateGroupMember",
                                    name: "group_member",
                                    comment: ["The result of first applying ", r("psi_id_to_group"), " to the ", r("namespace"), " to ", r("handle_bind"), " and then performing scalar multiplication with ", r("scalar"), "."],
                                    rhs: r("PsiGroup"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["In the color mixing metaphor, a ", r("BindNamespacePrivate"), " message corresponds to mixing a data color with one's secret color and sending the mixture to the other peer."]),
                        "The ", r("BindNamespacePrivate"), " messages let peers submit a ", r("namespace"), " for ", r("psi"), " by transmitting the result of first applying ", r("psi_id_to_group"), " to the ", r("namespace"), " and then applying ", r("psi_scalar_multiplication"), " to the result and ", r("scalar"), ". The freshly created ", r("NamespaceHandle"), " ", r("handle_bind", "binds"), " the ", r("BindNamespacePrivateGroupMember"), " in the ", r("psi_state_private_pending"), " state.",
                    ]),
                
                    pinformative(R("BindNamespacePrivate"), " messages use the ", r("NamespaceChannel"), "."),
                ]),

                hsection("psi_reply", code("PsiReply"), [
                    pseudocode(
                        new Struct({
                            id: "PsiReply",
                            comment: ["Finalize ", r("psi"), " for a single ", r("namespace"), "."],
                            fields: [
                                {
                                    id: "PsiReplyHandle",
                                    name: "handle",
                                    comment: ["The ", r("resource_handle"), " of the ", r("BindNamespacePrivate"), " message which this finalizes."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "PsiReplyGroupMember",
                                    name: "group_member",
                                    comment: ["The result of performing scalar multiplication between the ", r("BindNamespacePrivateGroupMember"), " of the message that this is replying to and ", r("scalar"), "."],
                                    rhs: r("PsiGroup"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["In the color mixing metaphor, a ", r("PsiReply"), " message corresponds to mixing one's secret color with a color mixture received from the other peer and sending the resulting color back."]),
                        "The ", r("PsiReply"), " messages let peers complete the information exchange regarding a single ", r("namespace"), " in the ", r("psi"), " process by performing scalar multiplication of a ", r("PsiGroup"), " member that the other peer sent and their own ", r("scalar"), ".",
                    ]),

                    pinformative("The ", r("PsiReplyHandle"), " must refer to a ", r("NamespaceHandle"), " ", r("handle_bind", "bound"), " by the other peer via a ", r("BindNamespacePrivate"), " message. A peer may send at most one ", r("PsiReply"), " message per ", r("NamespaceHandle"), ". Upon sending or receiving a ", r("PsiReply"), " message, a peer updates the ", r("resource_handle"), " binding to the ", r("PsiReplyGroupMember"), " of the message, and its state to ", r("psi_state_private_completed"), "."),
                ]),

                hsection("bind_namespace_public", code("BindNamespacePublic"), [
                    pseudocode(
                        new Struct({
                            id: "BindNamespacePublic",
                            comment: [R("handle_bind"), " a ", r("namespace"), " to a ", r("NamespaceHandle"), ", skipping the hassle of ", r("psi"), "."],
                            fields: [
                                {
                                    id: "BindNamespacePublicGroupMember",
                                    name: "group_member",
                                    comment: ["The result of applying ", r("psi_id_to_group"), " to the ", r("namespace"), " to ", r("handle_bind"), "."],
                                    rhs: r("PsiGroup"),
                                },
                            ],
                        }),
                    ),
    
                    pinformative([
                        marginale(["In the color mixing metaphor, a ", r("BindNamespacePublic"), " message corresponds to sending a data color in the clear, with a small note attached that says “I trust you, here's a data color of mine.”"]),
                        "The ", r("BindNamespacePublic"), " messages let peers ", r("handle_bind"), " ", rs("NamespaceHandle"), " without keeping the interest in the ", r("namespace"), " secret, by directly transmitting the result of applying ", r("psi_id_to_group"), " to the ", r("namespace"), ". The freshly created ", r("NamespaceHandle"), " ", r("handle_bind", "binds"), " the ", r("BindNamespacePublicGroupMember"), " in the ", r("psi_state_public"), " state.",
                    ]),

                    pinformative(R("BindNamespacePublic"), " messages use the ", r("NamespaceChannel"), "."),
                ]),

                hsection("bind_capability", code("BindCapability"), [
                    pseudocode(
                        new Struct({
                            id: "BindCapability",
                            comment: [R("handle_bind"), " a ", r("ReadCapability"), " to a ", r("CapabilityHandle"), "."],
                            fields: [
                                {
                                    id: "BindCapabilityCapability",
                                    name: "capability",
                                    comment: ["A ", r("ReadCapability"), " that the peer wishes to reference in future messages."],
                                    rhs: r("ReadCapability"),
                                },
                                {
                                    id: "BindCapabilityHandle",
                                    name: "handle",
                                    comment: ["The ", r("resource_handle"), " of the ", r("granted_namespace"), " of the ", r("BindCapabilityCapability"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "BindCapabilitySignature",
                                    name: "signature",
                                    comment: ["The ", r("sync_signature"), " issued by the ", r("sync_receiver"), " of the ", r("BindCapabilityCapability"), " over the sender's ", r("value_challenge"), "."],
                                    rhs: r("sync_signature"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative(
                        "The ", r("BindCapability"), " messages let peers ", r("handle_bind"), " a ", r("ReadCapability"), " for later reference. To do so, they must present a valid ", r("sync_signature"), " over their ", r("value_challenge"), ", thus demonstrating they hold the secret key corresponding to the public key for which the ", r("ReadCapability"), " was issued.",
                    ),

                    pinformative("The ", r("BindCapabilityHandle"), " must be ", r("handle_bind", "bound"), " to the ", r("granted_namespace"), " of the ", r("BindCapabilityCapability"), ". We enforce this on the encoding layer: the encoding used for the ", r("BindCapabilityCapability"), " simply does not contain the ", r("granted_namespace"), ", instead the ", r("namespace"), " to which the ", r("BindCapabilityHandle"), " is ", r("handle_bind", "bound"), " is used as the ", r("granted_namespace"), "."),
                
                    pinformative(R("BindCapability"), " messages use the ", r("CapabilityChannel"), "."),
                ]),

                hsection("entry_push", code("EntryPush"), [
                    pseudocode(
                        new Struct({
                            id: "EntryPush",
                            comment: ["Unsolicitedly transmit a ", r("lengthy_entry"), " to the other peer, and optionally prepare transmission of its ", r("payload"), "."],
                            fields: [
                                {
                                    id: "EntryPushEntry",
                                    name: "entry",
                                    comment: ["The ", r("entry"), " to transmit."],
                                    rhs: r("entry"),
                                },
                                {
                                    id: "EntryPushAvailable",
                                    name: "available_length",
                                    comment: ["The number of consecutive bytes from the start of the ", r("entry"), "'s ", r("payload"), " that the sender has."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "EntryPushOffset",
                                    name: "offset",
                                    comment: ["The offset in the ", r("payload"), " in bytes at which ", r("payload"), " transmission will begin. If this is equal to the ", r("entry"), "'s ", r("payload_length"), ", the ", r("payload"), " will not be transmitted."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["The message's ", r("EntryPushAvailable"), " is informative metadata that peers may use to inform their communication, or they may simply ignore it."]),
                        "The ", r("EntryPush"), " messages let peers transmit ", rs("lengthy_entry"), " outside of ", r("3drbsr"), ". It further sets up later ", r("payload"), " transmissions (via ", r("PayloadPush"), " messages).",
                    ]),

                    pinformative("To map ", r("payload"), " transmissions to ", rs("entry"), ", each peer maintains two pieces of state: an ", r("entry"), " ", def_value("currently_received_entry"), ", and a 64-bit unsigned integer ", def_value("currently_received_offset"), marginale(["These are used by ", r("PayloadPush"), " messages."]), ". When receiving an ", r("EntryPush"), " message whose ", r("EntryPushOffset"), " is strictly less than the ", r("EntryPushEntry"), "'s ", r("payload_length"), ", a peers sets its ", r("currently_received_entry"), " to the received ", r("EntryPushEntry"), " and its ", r("currently_received_offset"), " to the received ", r("EntryPushOffset"), "."),
                
                    pinformative(R("EntryPush"), " messages use the ", r("DataChannel"), "."),
                ]),

                hsection("payload_push", code("PayloadPush"), [
                    pseudocode(
                        new Struct({
                            id: "PayloadPush",
                            comment: ["Unsolicitedly transmit some ", r("payload"), " bytes."],
                            fields: [
                                {
                                    id: "PayloadPushAmount",
                                    name: "amount",
                                    comment: ["The number of transmitted bytes."],
                                    rhs: hl_builtin("u16"),
                                },
                                {
                                    id: "PayloadPushBytes",
                                    name: "bytes",
                                    comment: [r("PayloadPushAmount"), " many bytes, to be added to the ", r("payload"), " of the receiver's ", r("currently_received_entry"), " at offset ", r("currently_received_offset"), "."],
                                    rhs: ["[", hl_builtin("u8"), "]"],
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("PayloadPush"), " messages let peers transmit ", rs("payload"), "."),

                    pinformative("A ", r("PayloadPush"), " message may only be sent if its ", r("PayloadPushAmount"), " of ", r("PayloadPushBytes"), " plus the receiver's ", r("currently_received_offset"), " is less than or equal to the ", r("payload_length"), " of the receiver's ", r("currently_received_entry"), ". The receiver then increases its ", r("currently_received_offset"), " by ", r("PayloadPushAmount"), ". If the ", r("currently_received_entry"), " was set via a ", r("PayloadResponse"), " message, the receiver also increases the offset to which the ", r("PayloadRequestHandle"), " is ", r("handle_bind", "bound"), "."),

                    pinformative("A ", r("PayloadPush"), " message may only be sent if the receiver has a well-defined ", r("currently_received_entry"), "."),
                
                    pinformative(R("PayloadPush"), " messages use the ", r("DataChannel"), "."),
                ]),

                hsection("bind_payload_request", code("BindPayloadRequest"), [
                    pseudocode(
                        new Struct({
                            id: "BindPayloadRequest",
                            comment: [R("handle_bind"), " an ", r("entry"), " to a ", r("PayloadRequestHandle"), " and request transmission of its ", r("payload"), " from an offset."],
                            fields: [
                                {
                                    id: "BindPayloadRequestEntry",
                                    name: "entry",
                                    comment: ["The ", r("entry"), " to request."],
                                    rhs: r("entry"),
                                },
                                {
                                    id: "BindPayloadRequestOffset",
                                    name: "offset",
                                    comment: ["The offset in the ", r("payload"), " starting from which the sender would like to receive the ", r("payload"), " bytes."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "BindPayloadCapability",
                                    name: "capability",
                                    comment: ["A ", r("resource_handle"), " for a ", r("ReadCapability"), " ", r("handle_bind", "bound"), " by the sender that grants them read access to the ", r("handle_bind", "bound"), " ", r("entry"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["If the receiver of a ", r("BindPayloadRequest"), " does not have the requested ", r("payload"), " and does not plan to obtain it in the future, it should signal so by ", r("handle_free", "freeing"), " the ", r("PayloadRequestHandle"), "."]),
                        "The ", r("BindPayloadRequest"), " messages let peers explicitly request ", rs("payload"), ", by binding a ", r("PayloadRequestHandle"), " to the specified ", r("BindPayloadRequestEntry"), " and ", r("BindPayloadRequestOffset"), ". The other peer is expected to then transmit the ", r("payload"), ", starting at the specified ", r("BindPayloadRequestOffset"), ". The request contains a ", r("CapabilityHandle"), " to a ", r("ReadCapability"), " whose ", r("granted_area"), " must ", r("3d_range_contain"), " the requested ", r("entry"), ".",
                    ]),
                
                    pinformative(R("BindPayloadRequest"), " messages use the ", r("PayloadRequestChannel"), "."),
                ]),

                hsection("payload_response", code("PayloadResponse"), [
                    pseudocode(
                        new Struct({
                            id: "PayloadResponse",
                            comment: ["Set up the state for replying to a ", r("BindPayloadRequest"), " message."],
                            fields: [
                                {
                                    id: "PayloadResponseHandle",
                                    name: "handle",
                                    comment: ["The ", r("PayloadRequestHandle"), " to which to reply."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("PayloadResponse"), " messages let peers reply to ", r("BindPayloadRequest"), " messages, by indicating that future ", r("PayloadPush"), " messages will pertain to the requested ", r("payload"), ". More precisely, upon receiving a ", r("PayloadResponse"), " message, a peer sets its ", r("currently_received_entry"), " and ", r("currently_received_offset"), " values to those to which the message's ", r("PayloadResponseHandle"), " is ", r("handle_bind", "bound"), "."),
                ]),

                hsection("bind_aoi", code("BindAreaOfInterest"), [
                    pseudocode(
                        new Struct({
                            id: "BindAreaOfInterest",
                            comment: [R("handle_bind"), " an ", r("aoi"), " to a ", r("AreaOfInterestHandle"), "."],
                            fields: [
                                {
                                    id: "BindAreaOfInterestAOI",
                                    name: "area_of_interest",
                                    comment: ["An ", r("aoi"), " that the peer wishes to reference in future messages."],
                                    rhs: r("aoi"),
                                },
                                {
                                    id: "BindAreaOfInterestCapability",
                                    name: "authorization",
                                    comment: ["A ", r("CapabilityHandle"), " ", r("handle_bind", "bound"), " by the sender that grants access to all entries in the message's ", r("BindAreaOfInterestAOI"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "BindAreaOfInterestKnown",
                                    name: "known_intersections",
                                    comment: ["How many intersections with other ", rs("aoi"), " the sender knows about already."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["Development note: if we go for private 3d-range intersection, this message would become a ", code("BindAreaOfInterestPublic"), " message, and we would add ", code("BindAreaOfInterestPrivate"), " and ", code("AreaOfInterestReply"), " messages, completely analogous to the namespace PSI setup. Surprisingly little conceptual complexity involved."]),
                        "The ", r("BindAreaOfInterest"), " messages let peers ", r("handle_bind"), " an ", r("aoi"), " for later reference. They show that they may indeed receive ", rs("entry"), " from the ", r("aoi"), " by providing a ", r("CapabilityHandle"), " ", r("handle_bind", "bound"), " by the sender that grants access to all entries in the message's ", r("BindAreaOfInterestAOI"), ".",
                    ]),

                    aside_block([
                        p("The ", r("BindAreaOfInterestKnown"), " field serves to allow immediately following up on ", rs("BindAreaOfInterest"), " with reconciliation messages concerning the ", r("handle_bind", "bound"), " ", r("aoi"), " without the risk of duplicate reconciliation. To elaborate, imagine that both peers concurrently send ", rs("BindAreaOfInterest"), " messages for overlapping ", rs("aoi"), ". If both peers, upon receiving the other's message, initiated reconciliation for the intersection, there would be two concurrent reconciliation sessions for the same data."),

                        p("A simple workaround is to let ", r("alfie"), " be the only peer to initiate reconciliation. But this can introduce unnecessary delay when ", r("betty"), " sends a ", r("BindAreaOfInterest"), " message for which she already knows there are intersections with ", rs("aoi"), " that ", r("alfie"), " had previously ", r("handle_bind", "bound"), "."),

                        p("In this situation, ", r("betty"), " sets the ", r("BindAreaOfInterestKnown"), " field of her ", r("BindAreaOfInterest"), " message to the number of reconciliation messages that she will send pertaining to her newly ", r("handle_bind", "bound"), " ", r("aoi"), ". ", R("alfie"), " should not initiate reconciliation based on the received message until he has also received ", r("BindAreaOfInterestKnown"), " many reconciliation messages pertaining to this ", r("aoi"), " from ", r("betty"), "."),

                        p(R("betty"), " should never initiate reconciliation based on messages she receives, and when she initiates reconciliation pertaining to ", rs("aoi"), " she ", r("handle_bind", "binds"), " herself, she should meaningfully set the ", r("BindAreaOfInterestKnown"), "field. ", R("alfie"), " should set the ", r("BindAreaOfInterestKnown"), " field of all his ", r("BindAreaOfInterest"), " messages to zero, and eagerly initiate reconciliation sessions as long as he respects ", r("betty"), "'s ", r("BindAreaOfInterestKnown"), " fields."),
                    ]),
                
                    pinformative(R("BindAreaOfInterest"), " messages use the ", r("AreaOfInterestChannel"), "."),
                ]),

                hsection("range_fingerprint_message", code("RangeFingerprint"), [
                    pseudocode(
                        new Struct({
                            id: "RangeFingerprint",
                            comment: ["Send a fingerprint as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "RangeFingerprintRange",
                                    name: "range",
                                    comment: ["The ", r("3d_range"), " whose fingerprint is transmitted."],
                                    rhs: r("3d_range"),
                                },
                                {
                                    id: "RangeFingerprintFingerprint",
                                    name: "fingerprint",
                                    comment: ["The fingerprint of the ", r("RangeFingerprintRange"), ", that is, of all ", rs("lengthy_entry"), " the peer has in the ", r("RangeFingerprintRange"), "."],
                                    rhs: r("Fingerprint"),
                                },
                                {
                                    id: "RangeFingerprintSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("RangeFingerprintRange"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "RangeFingerprintReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("RangeFingerprintRange"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("RangeFingerprint"), " messages let peers initiate and progress ", r("3drbsr"), ". Each ", r("RangeFingerprint"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers; this upholds read access control."),

                    pinformative(R("RangeFingerprint"), " messages use the ", r("ReconciliationChannel"), "."),
                ]),

                hsection("range_entries", code("RangeEntries"), [
                    pseudocode(
                        new Struct({
                            id: "RangeEntries",
                            comment: ["Send the ", rs("lengthy_entry"), " a peer has in a ", r("3d_range"), " as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "RangeEntriesRange",
                                    name: "range",
                                    comment: ["The ", r("3d_range"), " whose ", rs("lengthy_entry"), " are transmitted."],
                                    rhs: r("3d_range"),
                                },
                                {
                                    id: "RangeEntriesEntries",
                                    name: "entries",
                                    comment: ["The ", rs("lengthy_entry"), " in the ", r("RangeEntriesRange"), "."],
                                    rhs: [code("["), r("lengthy_entry"), code("]")],
                                },
                                {
                                    id: "RangeEntriesFlag",
                                    name: "want_response",
                                    comment: ["A boolean flag to indicate whether the center wishes to receive a ", r("RangeEntries"), " message for the same ", r("3d_range"), " in return."],
                                    rhs: hl_builtin("bool"),
                                },
                                {
                                    id: "RangeEntriesSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("RangeEntriesRange"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "RangeEntriesReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("RangeEntriesRange"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("RangeEntries"), " messages let peers conclude ", r("3drbsr"), " for a ", r("3d_range"), " by transmitting their ", rs("lengthy_entry"), " in the ", r("3d_range"), ". Each ", r("RangeEntries"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers; this upholds read access control."),

                    pinformative(R("RangeEntries"), " messages use the ", r("ReconciliationChannel"), "."),
                ]),

                hsection("range_confirmation", code("RangeConfirmation"), [
                    pseudocode(
                        new Struct({
                            id: "RangeConfirmation",
                            comment: ["Signal fingerprint equality as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "RangeConfirmationRange",
                                    name: "range",
                                    comment: ["The ", r("3d_range"), " in question."],
                                    rhs: r("3d_range"),
                                },
                                {
                                    id: "RangeConfirmationSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("RangeConfirmationRange"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "RangeConfirmationReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("RangeConfirmationRange"), "."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("RangeConfirmation"), " messages let peers signal that they received a ", r("Fingerprint"), " as part of ", r("3drbsr"), " that equals their local ", r("Fingerprint"), " for that ", r("3d_range"), ".", marginale(["Upon sending or receiving a ", r("RangeConfirmation"), ", a peer should switch operation to forwarding any new entries inside the ", r("3d_range"), " to the other peer."]), " Each ", r("RangeConfirmation"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers; this upholds read access control."),

                    pinformative(R("RangeConfirmation"), " messages use the ", r("ReconciliationChannel"), "."),
                ]),

                hsection("sync_eagerness", code("Eagerness"), [
                    pseudocode(
                        new Struct({
                            id: "Eagerness",
                            comment: ["Express a preference whether the other peer should eagerly forward ", rs("payload"), " in the intersection of two ", rs("aoi"), "."],
                            fields: [
                                {
                                    id: "EagernessEagerness",
                                    name: "is_eager",
                                    comment: ["Whether ", rs("payload"), " should be pushed."],
                                    rhs: hl_builtin("bool"),
                                },
                                {
                                    id: "EagernessSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message."],
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "EagernessReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message."],
                                    rhs: hl_builtin("u64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("Eagerness"), " messages let peers express whether the other peer should eagerly push ", rs("payload"), " from the intersection of two ", rs("aoi"), ", or whether they should send only ", r("EntryPush"), " messages for that intersection."),

                    pinformative(R("Eagerness"), " messages are not binding, they merely present an optimization opportunity. In particular, they allow expressing the ", code("Prune"), " and ", code("Graft"), " messages of the ", link("epidemic broadcast tree protocol", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), "."),
                ]),

                hsection("sync_logical_channels", "Logical Channels", [
                    pinformative("The following messages implement the ", rs("logical_channel"), " used by the other messages, as explained in the ", link_name("resources_message_types", "resource control document"), "."),

                    pseudocode(
                        new Struct({
                            id: "SyncGuarantee",
                            name: "Guarantee",
                            comment: ["Make a binding promise of available buffer capacity to the other peer."],
                            fields: [
                                {
                                    id: "SyncGuaranteeAmount",
                                    name: "amount",
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "SyncGuaranteeChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),
        
                        new Struct({
                            id: "SyncAbsolve",
                            name: "Absolve",
                            comment: ["Allow the other peer to reduce its total buffer capacity by ", r("SyncAbsolveAmount"), "."],
                            fields: [
                                {
                                    id: "SyncAbsolveAmount",
                                    name: "amount",
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "SyncAbsolveChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),
        
                        new Struct({
                            id: "SyncOops",
                            name: "Oops",
                            comment: ["Ask the other peer to send an ", r("SyncAbsolve"), " message such that the remaining buffer capacity will be ", r("SyncOopsTarget"), "."],
                            fields: [
                                {
                                    id: "SyncOopsTarget",
                                    name: "target",
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "SyncOopsChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),
        
                        new Struct({
                            id: "SyncStartedDropping",
                            name: "ChannelStartedDropping",
                            comment: ["Notify the other peer that you have started dropping messages and will continue to do so until you receives an ", r("SyncApology"), " message. Note that you must send any outstanding ", rs("guarantee"), " of the ", r("logical_channel"), " before sending a ", r("SyncStartedDropping"), " message."],
                            fields: [
                                {
                                    id: "SyncStartedDroppingChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),
        
                        new Struct({
                            id: "SyncApology",
                            name: "ChannelApology",
                            comment: ["Notify the other peer that it can stop dropping messages of this ", r("logical_channel"), "."],
                            fields: [
                                {
                                    id: "SyncApologyChannel",
                                    name: "channel",
                                    rhs: r("LogicalChannel"),
                                },
                            ],
                        }),
                    ),
                ]),

                hsection("sync_handles", "Resource Handles", [
                    pinformative("The following messages manage the ", rs("resource_handle"), " used by the other messages, as explained in the ", link_name("handles_message_types", "resource control document"), "."),

                    pseudocode(
                        new Struct({
                            id: "SyncHandleFree",
                            name: "Free",
                            comment: ["Ask the other peer to ", r("handle_free"), " a ", r("resource_handle"), "."],
                            fields: [
                                {
                                    id: "SyncHandleFreeHandle",
                                    name: "handle",
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "SyncHandleFreeMine",
                                    comment: ["Indicates whether the peer sending this message is the one who created the ", r("SyncHandleFreeHandle"), "(", code("true"), ") or not (", code("false"), ")."],
                                    name: "mine",
                                    rhs: hl_builtin("bool"),
                                },
                                {
                                    id: "SyncHandleFreeType",
                                    name: "handle_type",
                                    rhs: r("H"),
                                },
                            ],
                        }),
    
                        new Struct({
                            id: "SyncHandleConfirm",
                            name: "Confirm",
                            comment: ["Confirm that you have successfully processed the ", r("SyncHandleConfirmNumber"), " oldest messages that ", r("handle_bind"), " a ", r("resource_handle"), " with ", r("handle_type"), " ", r("SyncHandleConfirmType"), " you received."],
                            fields: [
                                {
                                    id: "SyncHandleConfirmNumber",
                                    name: "number",
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "SyncHandleConfirmType",
                                    name: "handle_type",
                                    rhs: r("H"),
                                },
                            ],
                        }),
    
                        new Struct({
                            id: "SyncHandleStartedDropping",
                            name: "HandleStartedDropping",
                            comment: ["Notify the other peer that you have started dropping messages that refer to ", rs("resource_handle"), " greater than or equal to ", r("SyncHandleStartedDroppingAt"), " with ", r("handle_type"), " ", r("SyncHandleConfirmType"), " and will continue to do so until you receive an ", r("SyncHandleApology"), " message."],
                            fields: [
                                {
                                    id: "SyncHandleStartedDroppingAt",
                                    name: "at",
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "SyncHandleStartedDroppingType",
                                    name: "handle_type",
                                    rhs: r("H"),
                                },
                            ],
                        }),
    
                        new Struct({
                            id: "SyncHandleApology",
                            name: "HandleApology",
                            comment: ["Notify the other peer that it can stop dropping messages that refer to ", rs("resource_handle"), " greater than or equal to ", r("SyncHandleApologyAt"), " with ", r("handle_type"), " ", r("SyncHandleConfirmType"), "."],
                            fields: [
                                {
                                    id: "SyncHandleApologyAt",
                                    name: "at",
                                    rhs: hl_builtin("u64"),
                                },
                                {
                                    id: "SyncHandleApologyType",
                                    name: "handle_type",
                                    rhs: r("H"),
                                },
                            ],
                        }),
                    ),
                ]),
            ]),

            hsection("sync_encodings", "Encodings", [
                pinformative("We now define how to encode messages as sequences of bytes. The least significant five bit of the first byte of each encoding sufficed to determine the message type."),

                hsection("encoding_reveal_commitment", code("RevealCommitment"), [
                    pinformative("When encoding a ", r("RevealCommitment"), " message, the five least significant bits of the first byte are ", code("00000"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("RevealCommitmentNonce"), "."),
                ]),

                hsection("encoding_bind_namespace_private", code("BindNamespacePrivate"), [
                    pinformative("When encoding a ", r("BindNamespacePrivate"), " message, the five least significant bits of the first byte are ", code("00001"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("BindNamespacePrivateGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                ]),

                hsection("encoding_psi_reply", code("PsiReply"), [
                    pinformative("When encoding a ", r("PsiReply"), " message, the five least significant bits of the first byte are ", code("00010"), "."),

                    pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("PsiReplyHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("PsiReplyHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                    pinformative("This is followed by the ", r("PsiReplyGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                ]),

                hsection("encoding_bind_namespace_public", code("BindNamespacePublic"), [
                    pinformative("When encoding a ", r("BindNamespacePublic"), " message, the five least significant bits of the first byte are ", code("00011"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("BindNamespacePublicGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                ]),

                hsection("encoding_bind_capability", code("BindCapability"), [
                    pinformative("When encoding a ", r("BindCapability"), " message, the five least significant bits of the first byte are ", code("00100"), "."),

                    pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("BindCapabilityHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("BindCapabilityHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                    pinformative("This is followed by the ", r("BindCapabilitySignature"), ", encoded with the ", r("encoding_function"), " for ", r("PsiSignature"), "."),

                    pinformative("This is followed by the ", r("BindCapabilityCapability"), ", encoded with the ", r("encoding_function"), " for ", r("ReadCapability"), " (which need not encode the ", r("granted_namespace"), ")."),
                ]),

                pinformative("wip"),
                ols(
                    r("RevealCommitment"),
                    r("BindNamespacePrivate"),
                    r("PsiReply"),
                    r("BindNamespacePublic"),
                    r("BindCapability"),
                    [r("EntryPush"), ", special cases for ", lis("available_bytes 0", "available_bytes all")],
                    r("PayloadPush"),
                    r("BindPayloadRequest"),
                    [r("BindPayloadRequest"), ", special case for ", lis("offset 0")],
                    r("PayloadResponse"),
                    r("BindAreaOfInterest"),
                    r("RangeFingerprint"),
                    r("RangeEntries"),
                    r("RangeConfirmation"),
                    [r("Eagerness"), ", special cases for ", lis("is_eager false", "is_eager true")],
                    r("SyncGuarantee"),
                    r("SyncAbsolve"),
                    r("SyncOops"),
                    r("SyncStartedDropping"),
                    r("SyncApology"),
                    [r("SyncHandleFree"), ", special cases for ", lis("mine false", "mine true")],
                    r("SyncHandleConfirm"),
                    r("SyncHandleStartedDropping"),
                    r("SyncHandleApology"),
                ),
                pinformative("Possibly BindAreaOfInterestPrivate and PaoiiReply"),
                pinformative("6 logical channels, 4 handle kinds"),
                pinformative("Group messages whose header byte contains no information beyond the message type together."),
            ]),
        ]),

    ],
);
