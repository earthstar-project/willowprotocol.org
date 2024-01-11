import { R, Rs, def, def_fake, r, rs } from "../../defref.ts";
import { aside, code, em, img, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale, marginale_inlineable, sidenote } from "../../marginalia.ts";
import { Expression } from "../../tsgen.ts";
import { site_template, pinformative, lis, pnormative, link, def_parameter_type, def_parameter_value, def_value, def_fake_value, aside_block, ols, quotes, def_parameter_fn } from "../main.ts";
import { $, $comma, $dot } from "../../katex.ts";
import { SimpleEnum, pseudocode, hl_builtin, Struct, def_type, pseudo_tuple, pseudo_array } from "../../pseudocode.ts";
import { asset } from "../../out.ts";

const apo = "’";

export const sync: Expression = site_template(
    {
        title: "Willow General Purpose Sync Protocol",
        name: "sync",
    },
    [
        pinformative("The ", link_name("data_model", "Willow data model"), " specifies how to arrange data, but it does not prescribe how peers should synchronise data. In this document, we specify one possible way for performing synchronisation: the ", def("WGPS", "Willow General Purpose Sync (WGPS) protocol"), ". This document assumes familiarity with the ", link_name("data_model", "Willow data model"), "."),

        hsection("sync_intro", "Introduction", [
            marginale_inlineable(
              img(asset("sync/syncing.png"))  
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

            hsection("sync_access", "Access Control", [
                pinformative("Peers only transfer data to peers that can prove that they are allowed to access that data. We describe how peers authenticate their requests ", link_name("access_control", "here"), "."),
            ]),

            hsection("sync_pai", "Private Area Intersection", [
                pinformative("The WGPS lets two peers determine which ", rs("namespace"), " and ", rs("Area"), " therein they share an interest in, without leaking any data that only one of them wishes to synchronize. We explain the underlying ", link_name("private_area_intersection", "private area intersection protocol here"), "."),
            ]),

            hsection("sync_partial", "Partial Synchronisation", [
                pinformative("To synchronise data, peers specify any number of ", rs("AreaOfInterest"), marginale([
                    "Note that peers need abide to the ", r("aoi_count"), " and ", r("aoi_size"), " limits of the ", rs("AreaOfInterest"), " only on a best-effort basis. Imagine Betty has just transmitted her 100 newest ", rs("Entry"), " to Alfie, only to then receive an even newer ", r("Entry"), " from Gemma. Betty should forward that ", r("Entry"), " to Alfie, despite that putting her total number of transmissions above the limit of 100."
                ]), " per ", r("namespace"), ". The ", r("area_empty", "non-empty"), " ", rs("aoi_intersection"), " of ", rs("AreaOfInterest"), " from both peers contain the ", rs("Entry"), " to synchronise."),

                pinformative("The WGPS synchronises these ", rs("area_intersection"), " via ", r("3drbsr"), ", a technique we ", link_name("3d_range_based_set_reconciliation", "explain in detail here"), "."),
            ]),

            hsection("sync_post_sync_forwarding", "Post-Reconciliation Forwarding", [
                pinformative("After performing ", r("3drbsr", "set reconciliation"), ", peers might receive new ", rs("Entry"), " that fall into their shared ", rs("AreaOfInterest"), ". Hence, the WGPS allows peers to transmit ", rs("Entry"), " unsolicitedly."),
            ]),

            hsection("sync_payloads", "Payload transmissions", [
                pinformative("When a peer sends an ", r("Entry"), ", it can choose whether to immediately transmit the corresponding ", r("Payload"), " as well. Peers exchange ", sidenote("preferences", ["These preferences are not binding. The number of ", rs("aoi_intersection"), " between the peers’ ", rs("AreaOfInterest"), " can be quadratic in the number of ", rs("AreaOfInterest"), ", and we do not want to mandate keeping a quadratic amount of state."]), " for eager or lazy ", r("Payload"), " transmission based on ", rs("entry_payload_length"), " for each ", r("aoi_intersection"), ". These preferences are expressive enough to implement the ", link("plumtree", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), " algorithm."),

                pinformative("Peers can further explicitly request the ", rs("Payload"), " of arbitrary ", rs("Entry"), " (that they are allowed to access)."),
            ]),

            hsection("sync_resources", "Resource Limits", [
                pinformative("Multiplexing and management of shared state require peers to inform each other of their resource limits, lest one peer overloads the other. We use a protocol-agnostic solution based on ", rs("logical_channel"), " and ", rs("resource_handle"), " that we describe ", link_name("resource_control", "here"), "."),
            ]),
        ]),
        
        hsection("sync_parameters", "Parameters", [
            pinformative("The WGPS is generic over specific cryptographic primitives. In order to use it, one must first specify a full suite of instantiations of the ", link_name("willow_parameters", "parameters of the core Willow data model"), ". The WGPS further requires parameters for ", link_name("access_control", "access control"), ", ", link_name("private_area_intersection", "private area intersection"), ", and ", link_name("3d_range_based_set_reconciliation", "3d range-based set reconciliation"), "."),

            pinformative(link_name("access_control", "Access control"), " requires a type ", def_parameter_type({id: "ReadCapability", plural: "ReadCapabilities"}), " of ", rs("read_capability"), ", a type ", def_parameter_type({id: "sync_receiver", singular: "Receiver"}), " of ", rs("access_receiver"), ", and a type ", def_parameter_type({ id: "sync_signature", singular: "SyncSignature"}), " of signatures issued by the ", rs("sync_receiver"), ". The ", rs("access_challenge"), " have length ", def_parameter_value("challenge_length"), ", and the hash function used for the ", r("commitment_scheme"), " is a parameter ", def_parameter_fn("challenge_hash"), "."),

            pinformative(link_name("private_area_intersection", "Private area intersection"), " requires a type ", def_parameter_type("PsiGroup"), " whose values are the members of a ", link("finite cyclic groups suitable for key exchanges", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalisation_to_finite_cyclic_groups"), ", a type ", def_parameter_type("PsiScalar", "PsiScalar"), " of scalars, and a function ", def_parameter_fn("psi_scalar_multiplication", "psi_scalar_multiplication"), " that computes scalar multiplication in the group. We require a function ", def_parameter_fn("hash_into_group"), " that hashes ", rs("fragment"), " into ", r("PsiGroup"), ". And finally, we require a type ", def_parameter_type({id: "SubspaceCapability", plural: "SubspaceCapabilities"}), " of ", rs("subspace_capability"), ", with a type ", def_parameter_type({id: "sync_subspace_receiver", singular: "SubspaceReceiver"}), " of ", rs("subspace_receiver"), ", and a type ", def_parameter_type({ id: "sync_subspace_signature", singular: "SyncSubspaceSignature"}), " of signatures issued by the ", rs("sync_subspace_receiver"), "."),

            pinformative(link_name("3d_range_based_set_reconciliation", "3d range-based set reconciliation"), " requires a type ", def_parameter_type("Fingerprint"), " of hashes of ", rs("LengthyEntry"), ", a hash function ", def_parameter_fn("fingerprint_singleton"), " from ", rs("LengthyEntry"), " into ", r("Fingerprint"), " for computing the ", rs("Fingerprint"), " of singleton ", r("LengthyEntry"), " sets, an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), ", ", link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), " ", link("binary operation", "https://en.wikipedia.org/wiki/Binary_operation"), " ", def_parameter_fn("fingerprint_combine"), " on ", r("Fingerprint"), " for computing the ", rs("Fingerprint"), " of larger ", r("LengthyEntry"), " sets, and a value ", def_parameter_value("fingerprint_neutral"), " of type ", r("Fingerprint"), " that is a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " for ", r("fingerprint_combine"), " for serving as the ", r("Fingerprint"), " of the empty set."),

            pinformative("To efficiently transmit ", rs("AuthorisationToken"), ", we decompose them into two parts: the ", def_parameter_type({id: "StaticToken", singular: "StaticToken"}), " (which might be shared between many ", rs("AuthorisationToken"), "), and the ", def_parameter_type({id: "DynamicToken", singular: "DynamicToken"}), marginale([
                "In Meadowcap, for example, ", r("StaticToken"), " is the type ", r("Capability"), " and ", r("DynamicToken"), " is the type ", r("UserSignature"), ", which together yield a ", r("MeadowcapAuthorisationToken"), ".",
            ]), " (which differs between any two ", rs("Entry"), "). Formally, we require that there is an ", link("isomorphism", "https://en.wikipedia.org/wiki/Isomorphism"), " between ", r("AuthorisationToken"), " and pairs of a ", r("StaticToken"), " and a ", r("DynamicToken"), " with respect to the ", r("is_authorised_write"), " function."),
        ]),

        hsection("sync_protocol", "Protocol", [
            pinformative("The protocol is mostly message-based, with the exception of the first few bytes of communication. To break symmetry, we refer to the peer that initiated the synchronisation session as ", def({id: "alfie", singular: "Alfie"}, "Alfie", [def_fake("alfie", "Alfie"), " refers to the peer that initiated a WGPS synchronisation session. We use this terminology to break symmetry in the protocol."]), ", and the other peer as ", def({id: "betty", singular: "Betty"}, "Betty", [def_fake("betty", "Betty"), " refers to the peer that accepted a WGPS synchronisation session. We use this terminology to break symmetry in the protocol."]), "."),

            pinformative("Peers might receive invalid messages, both syntactically (i.e., invalid encodings) and semantically (i.e., logically inconsistent messages). In both cases, the peer to detect this behaviour must abort the sync session. We indicate such situations by writing that something ", quotes("is an error"), ". Any message that refers to a fully freed resource handle is an error. More generally, whenever we state that a message must fulfil some criteria, but a peer receives a message that does not fulfil these criteria, that is an error."),

            pinformative("Before any communication, each peer locally and independently generates some random data: a ", r("challenge_length"), " byte number ", def_value("nonce"), ", and a random value ", def_value("scalar"), " of type ", r("PsiScalar"), ". Both are used for cryptographic purposes and must thus use high-quality sources of randomness."),

            pinformative("The first byte each peer sends must be a natural number ", $dot("x \\leq 64"), " This sets the ", def_value({id: "peer_max_payload_size", singular: "maximum payload size"}), " of that peer to", $dot("2^x"), "The ", r("peer_max_payload_size"), " limits when the other peer may include ", rs("Payload"), " directly when transmitting ", rs("Entry"), ": when an ", r("Entry"), "’s ", r("entry_payload_length"), " is strictly greater than the ", r("peer_max_payload_size"), ", its ", r("Payload"), " may only be transmitted when explicitly requested."),

            pinformative("The next ", r("challenge_length"), " bytes a peer sends are the ", r("challenge_hash"), " of ", r("nonce"), "; we call the bytes that a peer received this way its ", def_value("received_commitment"), "."),

            pinformative("After those initial transmissions, the protocol becomes a purely message-based protocol. There are several kinds of messages, which the peers create, encode as byte strings, and transmit mostly independently from each other."),

            pinformative("The messages make use of the following ", rs("resource_handle"), ":"),

            pseudocode(
                new SimpleEnum({
                    id: "HandleKind",
                    comment: ["The different ", rs("resource_handle"), " employed by the ", r("WGPS"), "."],
                    variants: [
                        {
                            id: "IntersectionHandle",
                            comment: [R("resource_handle"), " for the private set intersection part of ", link_name("private_area_intersection", "private area intersection"), ". More precisely, an ", r("IntersectionHandle"), " stores a ", r("PsiGroup"), " member together with one of two possible states", ": ", lis(
                                [def_value({id: "psi_state_pending", singular: "pending"}, "pending", ["The ", def_fake_value("psi_state_pending", "pending"), " state indicates that the stored ", r("PsiGroup"), " member has been submitted for ", link_name("private_area_intersection", "private area intersection"), ", but the other peer has yet to reply with the result of multiplying its ", r("scalar"), "."]), " (waiting for the other peer to perform scalar multiplication),"],
                                [def_value({id: "psi_state_completed", singular: "private_completed"}, "completed", ["The ", def_fake_value("psi_state_completed", "completed"), " state indicates that the stored ", r("PsiGroup"), " member is the result of both peers multiplying their ", r("scalar"), " with the initial ", r("PsiGroup"), " member."]), " (both peers performed scalar multiplication)."],
                            )],
                        },
                        {
                            id: "CapabilityHandle",
                            comment: [R("resource_handle"), " for ", rs("ReadCapability"), " that certify access to some ", rs("Entry"), "."],
                        },
                        {
                            id: "AreaOfInterestHandle",
                            comment: [R("resource_handle"), " for ", rs("AreaOfInterest"), " that peers wish to sync."],
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
                            comment: [R("logical_channel"), " for performing ", r("3drbsr"), "."],
                        },
                        {
                            id: "DataChannel",
                            comment: [R("logical_channel"), " for transmitting ", rs("Entry"), " and ", rs("Payload"), " outside of ", r("3drbsr"), "."],
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
                                    comment: ["The ", r("IntersectionHandle"), " ", r("handle_bind", "bound"), " by the sender for the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), " for whose ", r("NamespaceId"), " to request the ", r("SubspaceCapability"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
    
                    pinformative("The ", r("PaiRequestSubspaceCapability"), " messages let peers request ", rs("SubspaceCapability"), ", by sending the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), ". This item must be in the intersection of the two peers’ ", rs("fragment"), ". The receiver of the message can thus look up the ", r("subspace"), " in question."),

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
                    pinformative("To transmit ", rs("Entry"), ", a peer first has to register ", rs("ReadCapability"), ", ", rs("AreaOfInterest"), ", and ", rs("StaticToken"), " with the other peer."),

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
                                    comment: ["The ", r("IntersectionHandle"), ", ", r("handle_bind", "bound"), " by the sender, of the ", r("SetupBindReadCapabilityCapability"), "’s ", r("fragment"), " with the longest ", r("Path"), " in the intersection of the ", rs("fragment"), ". If both a ", r("fragment_primary"), " and ", r("fragment_secondary"), " such ", r("fragment"), " exist, choose the ", r("fragment_primary"), " one."],
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
                        "The ", r("SetupBindReadCapabilityHandle"), " must be ", r("handle_bind", "bound"), " to the ", r("fragment"), " (", r("fragment_primary"), ", if possible) of the ", r("SetupBindReadCapabilityCapability"), " with the longest ", r("Path"), " ", r("path_prefix"), " that is in the intersection of the two peers’ ", rs("fragment"), ".",
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
                                {
                                    id: "SetupBindAreaOfInterestKnown",
                                    name: "known_intersections",
                                    comment: ["How many intersections with other ", rs("AreaOfInterest"), " the sender knows about already."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["Development note: if we go for private 3d-range intersection, this message would become a ", code("SetupBindAreaOfInterestPublic"), " message, and we would add ", code("SetupBindAreaOfInterestPrivate"), " and ", code("AreaOfInterestReply"), " messages, completely analogous to the namespace PSI setup. Surprisingly little conceptual complexity involved."]),
                        "The ", r("SetupBindAreaOfInterest"), " messages let peers ", r("handle_bind"), " an ", r("AreaOfInterest"), " for later reference. They show that they may indeed receive ", rs("Entry"), " from the ", r("AreaOfInterest"), " by providing a ", r("CapabilityHandle"), " ", r("handle_bind", "bound"), " by the sender that grants access to all entries in the message’s ", r("SetupBindAreaOfInterestAOI"), ".",
                    ]),

                    aside_block([
                        p("The ", r("SetupBindAreaOfInterestKnown"), " field serves to allow immediately following up on ", rs("SetupBindAreaOfInterest"), " with reconciliation messages concerning the ", r("handle_bind", "bound"), " ", r("AreaOfInterest"), " without the risk of duplicate reconciliation. To elaborate, imagine that both peers concurrently send ", rs("SetupBindAreaOfInterest"), " messages for overlapping ", rs("AreaOfInterest"), ". If both peers, upon receiving the other’s message, initiated reconciliation for the intersection, there would be two concurrent reconciliation sessions for the same data."),

                        p("A simple workaround is to let ", r("alfie"), " be the only peer to initiate reconciliation. But this can introduce unnecessary delay when ", r("betty"), " sends a ", r("SetupBindAreaOfInterest"), " message for which she already knows there are intersections with ", rs("AreaOfInterest"), " that ", r("alfie"), " had previously ", r("handle_bind", "bound"), "."),

                        p("In this situation, ", r("betty"), " sets the ", r("SetupBindAreaOfInterestKnown"), " field of her ", r("SetupBindAreaOfInterest"), " message to the number of reconciliation messages that she will send pertaining to her newly ", r("handle_bind", "bound"), " ", r("AreaOfInterest"), ". ", R("alfie"), " should not initiate reconciliation based on the received message until he has also received ", r("SetupBindAreaOfInterestKnown"), " many reconciliation messages pertaining to this ", r("AreaOfInterest"), " from ", r("betty"), "."),

                        p(R("betty"), " should never initiate reconciliation based on messages she receives, and when she initiates reconciliation pertaining to ", rs("AreaOfInterest"), " she ", r("handle_bind", "binds"), " herself, she should meaningfully set the ", r("SetupBindAreaOfInterestKnown"), "field. ", R("alfie"), " should set the ", r("SetupBindAreaOfInterestKnown"), " field of all his ", r("SetupBindAreaOfInterest"), " messages to zero, and eagerly initiate reconciliation sessions as long as he respects ", r("betty"), "’s ", r("SetupBindAreaOfInterestKnown"), " fields."),
                    ]),
                
                    pinformative(R("SetupBindAreaOfInterest"), " messages use the ", r("AreaOfInterestChannel"), "."),
                    
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
                    pinformative("We use ", link_name("3d_range_based_set_reconciliation", "3d range-based set reconciliation"), " to synchronize the data of the peers."),
                    
                    pseudocode(
                        new Struct({
                            id: "ReconciliationSendFingerprint",
                            comment: ["Send a ", r("Fingerprint"), " as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "ReconciliationSendFingerprintRange",
                                    name: "range",
                                    comment: ["The ", r("3dRange"), " whose ", r("Fingerprint"), " is transmitted."],
                                    rhs: r("3dRange"),
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
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("ReconciliationSendFingerprint"), " messages let peers initiate and progress ", r("3drbsr"), ". Each ", r("ReconciliationSendFingerprint"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers; this upholds read access control."),

                    pinformative(R("ReconciliationSendFingerprint"), " messages use the ", r("ReconciliationChannel"), "."),
                    
                    pseudocode(
                        new Struct({
                            id: "ReconciliationAnnounceEntries",
                            comment: ["Prepare transmission of the ", rs("LengthyEntry"), " a peer has in a ", r("3dRange"), " as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "ReconciliationAnnounceEntriesRange",
                                    name: "range",
                                    comment: ["The ", r("3dRange"), " whose ", rs("LengthyEntry"), " to transmit."],
                                    rhs: r("3dRange"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesCount",
                                    name: "count",
                                    comment: ["The number of ", rs("Entry"), " the sender has in the ", r("ReconciliationAnnounceEntriesRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesFlag",
                                    name: "want_response",
                                    comment: ["A boolean flag to indicate whether the sender wishes to receive a ", r("ReconciliationAnnounceEntries"), " message for the same ", r("3dRange"), " in return."],
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "ReconciliationAnnounceEntriesWillSort",
                                    name: "will_sort",
                                    comment: ["Whether the sender promises to send the ", rs("Entry"), " in the ", r("ReconciliationAnnounceEntriesRange"), " sorted from ", r("entry_newer", "oldest to newest"), "."],
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
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("ReconciliationAnnounceEntries"), " messages let peers announce how many ", rs("Entry"), " they have in a ", r("3dRange"), " by transmitting their ", rs("LengthyEntry"), " in the ", r("3dRange"), ". Each ", r("ReconciliationAnnounceEntries"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers that contain the ", r("ReconciliationAnnounceEntriesRange"), "; this upholds read access control."),

                    pinformative("Actual transmission of the ", rs("LengthyEntry"), " in the ", r("ReconciliationAnnounceEntriesRange"), " happens via ", r("ReconciliationSendEntry"), " messages. The ", r("ReconciliationAnnounceEntriesWillSort"), " flag should be set to ", code("1"), " if the sender will transmit the ", rs("LengthyEntry"), marginale([
                        "Sorting the ", rs("Entry"), " allows the receiver to determine which of its own ", rs("Entry"), " it can omit from a reply in constant space. For unsorted ", rs("Entry"), ", peers that cannot allocate a linear amount of memory have to resort to possibly redundant ", r("Entry"), " transmissions to uphold the correctness of ", r("3drbsr"), "."
                    ]), "sorted from ", r("entry_newer", "oldest to newest"), ", if the sender will not guarantee this order, the flag must be set to ", code("0"), "."),

                    pinformative("No ", r("ReconciliationAnnounceEntries"), " message may be sent until all ", rs("Entry"), " announced by a prior ", r("ReconciliationAnnounceEntries"), " massage have been sent."),

                    pinformative("When a peer receives a ", r("ReconciliationSendFingerprint"), " message that matches its local ", r("Fingerprint"), ", it should reply with a ", r("ReconciliationAnnounceEntries"), " message of ", r("ReconciliationAnnounceEntriesCount"), " zero and ", r("ReconciliationAnnounceEntriesFlag"), " ", code("false"), ", to indicate to the other peer that reconciliation of the ", r("3dRange"), " has concluded successfully."),

                    pinformative(R("ReconciliationAnnounceEntries"), " messages use the ", r("ReconciliationChannel"), "."),
                    
                    pseudocode(
                        new Struct({
                            id: "ReconciliationSendEntry",
                            comment: ["Transmit a ", r("LengthyEntry"), " as part of ", r("3drbsr"), "."],
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
                
                    pinformative("The ", r("ReconciliationSendEntry"), " messages let peers transmit ", rs("Entry"), " as part of ", r("3drbsr"), ". These messages may only be sent after a ", r("ReconciliationAnnounceEntries"), " message has announced the containing ", r("3dRange"), ", and the number of messages must not exceed the announced number of ", rs("Entry"), ". The transmitted ", rs("Entry"), " must be ", r("3d_range_include", "included"), " in the announced ", r("3dRange"), "."),

                    pinformative(R("ReconciliationSendEntry"), " messages use the ", r("ReconciliationChannel"), "."),
                ]),

                hsection("sync_data", "Data", [
                    pinformative("Outside of ", link_name("3d_range_based_set_reconciliation", "3d range-based set reconciliation"), " peers can unsolicitedly push ", rs("Entry"), " and ", rs("Payload"), " to each other, and they can request specific ", rs("Payload"), "."),
                    
                    pseudocode(
                        new Struct({
                            id: "DataSendEntry",
                            comment: ["Transmit an ", r("AuthorisedEntry"), " to the other peer, and optionally prepare transmission of its ", r("Payload"), "."],
                            fields: [
                                {
                                    id: "DataSendEntryEntry",
                                    name: "entry",
                                    comment: ["The ", r("Entry"), " to transmit."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "DataSendEntryStatic",
                                    name: "static_token_handle",
                                    comment: ["A ", r("StaticTokenHandle"), " ", r("handle_bind", "bound"), " to the ", r("StaticToken"), " of the ", r("Entry"), " to transmit."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "DataSendEntryDynamic",
                                    name: "dynamic_token",
                                    comment: ["The ", r("DynamicToken"), " of the ", r("Entry"), " to transmit."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "DataSendEntryOffset",
                                    name: "offset",
                                    comment: ["The offset in the ", r("Payload"), " in bytes at which ", r("Payload"), " transmission will begin. If this is equal to the ", r("Entry"), "’s ", r("entry_payload_length"), ", the ", r("Payload"), " will not be transmitted."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("DataSendEntry"), " messages let peers transmit ", rs("LengthyEntry"), " outside of ", r("3drbsr"), ". They further set up later ", r("Payload"), " transmissions (via ", r("DataSendPayload"), " messages)."),

                    pinformative("To map ", r("Payload"), " transmissions to ", rs("Entry"), ", each peer maintains two pieces of state: an ", r("Entry"), " ", def_value("currently_received_entry"), ", and a ", r("U64"), " ", def_value("currently_received_offset"), marginale(["These are used by ", r("DataSendPayload"), " messages."]), ". When receiving an ", r("DataSendEntry"), " message whose ", r("DataSendEntryOffset"), " is strictly less than the ", r("DataSendEntryEntry"), apo, "s ", r("entry_payload_length"), ", a peers sets its ", r("currently_received_entry"), " to the received ", r("DataSendEntryEntry"), " and its ", r("currently_received_offset"), " to the received ", r("DataSendEntryOffset"), "."),
                
                    pinformative(R("DataSendEntry"), " messages use the ", r("DataChannel"), "."),
                    
                    pseudocode(
                        new Struct({
                            id: "DataSendPayload",
                            comment: ["Transmit some ", r("Payload"), " bytes."],
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
                                    comment: [r("DataSendPayloadAmount"), " many bytes, to be added to the ", r("Payload"), " of the receiver", apo, "s ", r("currently_received_entry"), " at offset ", r("currently_received_offset"), "."],
                                    rhs: ["[", hl_builtin("u8"), "]"],
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("DataSendPayload"), " messages let peers transmit ", rs("Payload"), "."),

                    pinformative("A ", r("DataSendPayload"), " message may only be sent if its ", r("DataSendPayloadAmount"), " of ", r("DataSendPayloadBytes"), " plus the receiver", apo, "s ", r("currently_received_offset"), " is less than or equal to the ", r("entry_payload_length"), " of the receiver", apo, "s ", r("currently_received_entry"), ". The receiver then increases its ", r("currently_received_offset"), " by ", r("DataSendPayloadAmount"), ". If the ", r("currently_received_entry"), " was set via a ", r("DataReplyPayload"), " message, the receiver also increases the offset to which the ", r("PayloadRequestHandle"), " is ", r("handle_bind", "bound"), "."),

                    pinformative("A ", r("DataSendPayload"), " message may only be sent if the receiver has a well-defined ", r("currently_received_entry"), "."),
                
                    pinformative(R("DataSendPayload"), " messages use the ", r("DataChannel"), "."),
                    
                    pseudocode(
                        new Struct({
                            id: "DataSetEagerness",
                            comment: ["Express a preference whether the other peer should eagerly forward ", rs("Payload"), " in the intersection of two ", rs("AreaOfInterest"), "."],
                            fields: [
                                {
                                    id: "DataSetEagernessEagerness",
                                    name: "is_eager",
                                    comment: ["Whether ", rs("Payload"), " should be pushed."],
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "DataSetEagernessSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "DataSetEagernessReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("DataSetEagerness"), " messages let peers express whether the other peer should eagerly push ", rs("Payload"), " from the intersection of two ", rs("AreaOfInterest"), ", or whether they should send only ", r("DataSendEntry"), " messages for that intersection."),

                    pinformative(R("DataSetEagerness"), " messages are not binding, they merely present an optimisation opportunity. In particular, they allow expressing the ", code("Prune"), " and ", code("Graft"), " messages of the ", link("epidemic broadcast tree protocol", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), "."),
                    
                    pseudocode(
                        new Struct({
                            id: "DataBindPayloadRequest",
                            comment: [R("handle_bind"), " an ", r("Entry"), " to a ", r("PayloadRequestHandle"), " and request transmission of its ", r("Payload"), " from an offset."],
                            fields: [
                                {
                                    id: "DataBindPayloadRequestEntry",
                                    name: "entry",
                                    comment: ["The ", r("Entry"), " to request."],
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
                                    comment: ["A ", r("resource_handle"), " for a ", r("ReadCapability"), " ", r("handle_bind", "bound"), " by the sender that grants them read access to the ", r("handle_bind", "bound"), " ", r("Entry"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["If the receiver of a ", r("DataBindPayloadRequest"), " does not have the requested ", r("Payload"), " and does not plan to obtain it in the future, it should signal so by ", r("handle_free", "freeing"), " the ", r("PayloadRequestHandle"), "."]),
                        "The ", r("DataBindPayloadRequest"), " messages let peers explicitly request ", rs("Payload"), ", by binding a ", r("PayloadRequestHandle"), " to the specified ", r("DataBindPayloadRequestEntry"), " and ", r("DataBindPayloadRequestOffset"), ". The other peer is expected to then transmit the ", r("Payload"), ", starting at the specified ", r("DataBindPayloadRequestOffset"), ". The request contains a ", r("CapabilityHandle"), " to a ", r("ReadCapability"), " whose ", r("granted_area"), " must ", r("area_include"), " the requested ", r("Entry"), ".",
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
                
                    pinformative("The ", r("DataReplyPayload"), " messages let peers reply to ", r("DataBindPayloadRequest"), " messages, by indicating that future ", r("DataSendPayload"), " messages will pertain to the requested ", r("Payload"), ". More precisely, upon receiving a ", r("DataReplyPayload"), " message, a peer sets its ", r("currently_received_entry"), " and ", r("currently_received_offset"), " values to those to which the message", apo, "s ", r("DataReplyPayloadHandle"), " is ", r("handle_bind", "bound"), "."),
                ]),
                hsection("sync_control", "Resource control", [
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
                            comment: ["Ask the other peer to send an ", r("ControlAbsolve"), " message such that the remaining buffer capacity will be ", r("ControlPleadTarget"), "."],
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
                            name: "Free",
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
                                    rhs: r("HandleKind"),
                                },
                            ],
                        }),
                    ),
                ]),
            ]),

            hsection("sync_encodings", "Encodings", [

                pinformative("Work in progress."),


                // We require an ", r("encoding_function"), " for ", r("sync_signature"), ", and an ", r("encoding_function"), " for ", r("ReadCapability"), ". The ", r("encoding_function"), " for ", r("ReadCapability"), " need not encode the ", r("granted_namespace"), ", it can be inferred from context.

                // Further, we require ", rs("encoding_function"), " for ", r("PsiGroup"), " and ", r("PsiScalar"), ".

                // , and an ", r("encoding_function"), " for ", r("SubspaceCapability"), ". This ", r("encoding_function"), " need not encode the ", r("subspace_granted_namespace"), ", it can be inferred from context.", Rs("SubspaceCapability"), " must use the same signature scheme as the ", rs("ReadCapability"), "."





                // marginale("The precise encoding details are still a work in progress that can only be resolved once we have integrated the planned changes to our core data model and have decided on private area intersection in the wgps."),
                // pinformative("We now define how to encode messages as sequences of bytes. The least significant five bit of the first byte of each encoding sufficed to determine the message type."),

                // hsection("encoding_reveal_commitment", code("CommitmentReveal"), [
                //     pinformative("When encoding a ", r("CommitmentReveal"), " message, the five least significant bits of the first byte are ", code("00000"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("CommitmentRevealNonce"), "."),
                // ]),

                // hsection("encoding_bind_psi", code("PaiBindFragment"), [
                //     pinformative("When encoding a ", r("PaiBindFragment"), " message, the five least significant bits of the first byte are ", code("00001"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("PaiBindFragmentGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                // ]),

                // hsection("encoding_psi_reply", code("PaiReplyFragment"), [
                //     pinformative("When encoding a ", r("PaiReplyFragment"), " message, the five least significant bits of the first byte are ", code("00010"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("PaiReplyFragmentHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("PaiReplyFragmentHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                //     pinformative("This is followed by the ", r("PaiReplyFragmentGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                // ]),

                // hsection("encoding_bind_namespace_public", code("BindNamespacePublic"), [
                //     pinformative("When encoding a ", r("BindNamespacePublic"), " message, the five least significant bits of the first byte are ", code("00011"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("BindNamespacePublicGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                // ]),

                // hsection("encoding_bind_capability", code("SetupBindReadCapability"), [
                //     pinformative("When encoding a ", r("SetupBindReadCapability"), " message, the five least significant bits of the first byte are ", code("00100"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("SetupBindReadCapabilityHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("SetupBindReadCapabilityHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                //     pinformative("This is followed by the ", r("SetupBindReadCapabilitySignature"), ", encoded with the ", r("encoding_function"), " for ", r("PsiSignature"), "."),

                //     pinformative("This is followed by the ", r("SetupBindReadCapabilityCapability"), ", encoded with the ", r("encoding_function"), " for ", r("ReadCapability"), " (which need not encode the ", r("granted_namespace"), ")."),
                // ]),

                // hsection("encoding_entry_push", code("DataSendEntry"), [
                //     pinformative("When encoding a ", r("SetupBindReadCapability"), " message, the five least significant bits of the first byte are ", code("00101"), "."),

                //     pinformative("The remaining encoding employs a couple of optimisations: an ", r("DataSendEntryAvailable"), " of zero or equal to the ", r("payload_length"), " of the ", r("DataSendEntryEntry"), " can be encoded efficiently, as can such an ", r("DataSendEntryOffset"), ". The ", r("DataSendEntryEntry"), " itself can be either encoded relative to the ", r("currently_received_entry"), " of the receiver as an ", r("EntryRelativeEntry"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of two ", rs("AreaOfInterestHandle"), " as an ", r("EntryInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_payload_push", code("DataSendPayload"), [
                //     pinformative("When encoding a ", r("DataSendPayload"), " message, the five least significant bits of the first byte are ", code("00110"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("DataSendPayloadAmount"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("DataSendPayloadAmount"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                //     pinformative("This is followed by ", r("DataSendPayloadAmount"), " bytes of ", r("Payload"), "."),
                // ]),

                // hsection("encoding_bind_payload_request", code("DataBindPayloadRequest"), [
                //     pinformative("When encoding a ", r("DataBindPayloadRequest"), " message, the five least significant bits of the first byte are ", code("00111"), "."),

                //     pinformative("The remaining encoding employs a couple of optimisations: an ", r("DataBindPayloadRequestCapability"), " of zero can be encoded efficiently. The ", r("DataBindPayloadRequestEntry"), " itself can be either encoded relative to the ", r("currently_received_entry"), " of the receiver as an ", r("EntryRelativeEntry"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of two ", rs("AreaOfInterestHandle"), " as an ", r("EntryInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_payload_response", code("DataReplyPayload"), [
                //     pinformative("When encoding a ", r("DataReplyPayload"), " message, the five least significant bits of the first byte are ", code("01000"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("DataReplyPayloadHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("DataReplyPayloadHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),
                // ]),

                // hsection("encoding_bind_aoi", code("SetupBindAreaOfInterest"), [
                //     pinformative("When encoding a ", r("SetupBindAreaOfInterest"), " message, the five least significant bits of the first byte are ", code("01001"), "."),

                //     pinformative("The remaining encoding employs a couple of optimisations: an ", r("SetupBindAreaOfInterestKnown"), " of zero can be encoded efficiently. The ", r("SetupBindAreaOfInterestAOI"), " itself is encoded relative to the containing ", r("granted_area"), " of the ", r("SetupBindAreaOfInterestCapability"), " as an ", r("AreaInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_range_fp", code("ReconciliationSendFingerprint"), [
                //     pinformative("When encoding a ", r("ReconciliationSendFingerprint"), " message, the five least significant bits of the first byte are ", code("01010"), "."),

                //     pinformative("The ", r("ReconciliationSendFingerprintRange"), " can be either encoded relative to the precedingly transmitted ", r("3dRange"), " as a ", r("RangeRelativeRange"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of the ", r("ReconciliationSendFingerprintSenderHandle"), " and the ", r("ReconciliationSendFingerprintReceiverHandle"), " as a ", r("RangeInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_range_entries", code("ReconciliationAnnounceEntries"), [
                //     pinformative("When encoding a ", r("ReconciliationAnnounceEntries"), " message, the five least significant bits of the first byte are ", code("01011"), "."),

                //     pinformative("The ", r("ReconciliationAnnounceEntriesRange"), " can be either encoded relative to the precedingly transmitted ", r("3dRange"), " as a ", r("RangeRelativeRange"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of the ", r("ReconciliationAnnounceEntriesSenderHandle"), " and the ", r("ReconciliationAnnounceEntriesReceiverHandle"), " as a ", r("RangeInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_range_confirmation", code("RangeConfirmation"), [
                //     pinformative("When encoding a ", r("RangeConfirmation"), " message, the five least significant bits of the first byte are ", code("01100"), "."),

                //     pinformative("The ", r("RangeConfirmationRange"), " can be either encoded relative to the precedingly transmitted ", r("3dRange"), " as a ", r("RangeRelativeRange"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of the ", r("RangeConfirmationSenderHandle"), " and the ", r("RangeConfirmationReceiverHandle"), " as a ", r("RangeInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_eagerness", code("DataSetEagerness"), [
                //     pinformative("When encoding a ", r("DataSetEagerness"), " message, the five least significant bits of the first byte are ", code("01101"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_guarantee", code("Guarantee"), [
                //     pinformative("When encoding a ", r("ControlIssueGuarantee"), " message, the five least significant bits of the first byte are ", code("01110"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_absolve", code("Absolve"), [
                //     pinformative("When encoding a ", r("ControlAbsolve"), " message, the five least significant bits of the first byte are ", code("01111"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_oops", code("Oops"), [
                //     pinformative("When encoding a ", r("ControlPlead"), " message, the five least significant bits of the first byte are ", code("10000"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_started_dropping", code("ChannelStartedDropping"), [
                //     pinformative("When encoding a ", r("ControlAnnounceDropping"), " message, the five least significant bits of the first byte are ", code("10001"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_apology", code("ChannelApology"), [
                //     pinformative("When encoding a ", r("ControlApologise"), " message, the five least significant bits of the first byte are ", code("10010"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_handle_free", code("Free"), [
                //     pinformative("When encoding a ", r("ControlFreeHandle"), " message, the five least significant bits of the first byte are ", code("10011"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_handle_confirm", code("Confirm"), [
                //     pinformative("When encoding a ", r("SyncHandleConfirm"), " message, the five least significant bits of the first byte are ", code("10100"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_handle_started_dropping", code("HandleStartedDropping"), [
                //     pinformative("When encoding a ", r("SyncHandleStartedDropping"), " message, the five least significant bits of the first byte are ", code("10101"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_handle_apology", code("HandleApology"), [
                //     pinformative("When encoding a ", r("SyncHandleApology"), " message, the five least significant bits of the first byte are ", code("10110"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                pinformative("Entry 5: entry encoded relative to two AreadOfInterestHandles, or relative to the ", r("currently_received_entry"), " of the receiver, or absolutely"),

                ols(
                    [r("CommitmentReveal"), " 0"],
                    [r("PaiBindFragment"), " 1"],
                    [r("PaiReplyFragment"), " 2"],
                    [r("PaiRequestSubspaceCapability"), " 2"],
                    [r("PaiReplySubspaceCapability"), " 2"],
                    [r("SetupBindReadCapability"), " 2 + 1 (whether the encoding of the ReadCapability includes a SubspaceId or if it can be inferred from the handle)"],
                    [r("SetupBindAreaOfInterest"), " 2 + 3 (known_intersections with special case zero)"],
                    [r("SetupBindStaticToken"), " 3 (absolute, or relative to another StaticToken)"],
                    [r("ReconciliationSendFingerprint"), " 2 + 2 + 1 + 1 (3dRange relative to previous range or contaniing Area), (special case empty fingerprint)"],
                    [r("ReconciliationAnnounceEntries"), " 2 + 2 + 2 + 1 + 1 + 1 (3dRange relative to previous range or contaniing Area)"],
                    [r("ReconciliationSendEntry"), " 2 + 2 + 1 (entry in 3dRange or relative to previous entry)"],
                    [r("DataSendEntry"), " 2 + 3 + 5 (offset-width with special cases for zero and the payload length), (Entry)"],
                    [r("DataSendPayload"), " 2"],
                    [r("DataSetEagerness"), " 1 + 2 + 2"],
                    [r("DataBindPayloadRequest"), " 2 + 3 + 5 (offset with special case for zero), (Entry)"],
                    [r("DataReplyPayload"), " 2"],
                    [r("ControlIssueGuarantee"), " 2 + 3"],
                    [r("ControlAbsolve"), " 2 + 3"],
                    [r("ControlPlead"), " 2 + 3"],
                    [r("ControlAnnounceDropping"), " 3"],
                    [r("ControlApologise"), " 3"],
                    [r("ControlFreeHandle"), " 2 + 1 + 3"],
                ),

            ]),
        ]),

    ],
);
