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

            hsection("sync_pai", "Private Area Intersection", [
                pinformative("The WGPS lets two peers determine which ", rs("namespace"), " and ", rs("Area"), " therein they share an interest in, without leaking any data that only one of them wishes to synchronize. We explain the underlying ", link_name("private_area_intersection", "private area intersection protocol here"), "."),
            ]),

            hsection("sync_access", "Access Control", [
                pinformative("Peers only transfer data to peers that can prove that they are allowed to access that data. We describe how peers authenticate their requests ", link_name("access_control", "here"), "."),
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
            pinformative("The protocol is mostly message-based, with the exception of the first few bytes of communication. To break symmetry, we refer to the peer that initiated the synchronisation session as ", def({id: "alfie", singular: "Alfie"}, "Alfie", [def_fake("alfie", "Alfie"), " refers to the peer that initiated a WGPS synchronisation session. We occasionally use this terminology to break symmetry in the protocol."]), ", and the other peer as ", def({id: "betty", singular: "Betty"}, "Betty", [def_fake("betty", "Betty"), " refers to the peer that accepted a WGPS synchronisation session. We occasionally use this terminology to break symmetry in the protocol."]), "."),

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
                
                hsection("bind_psi", code("BindPsi"), [
                    pseudocode(
                        new Struct({
                            id: "BindPsi",
                            comment: [R("handle_bind"), " data to an ", r("IntersectionHandle"), " for performing ", link_name("private_area_intersection", "private area intersection"), "."],
                            fields: [
                                {
                                    id: "BindPsiGroupMember",
                                    name: "group_member",
                                    comment: ["The result of first applying ", r("hash_into_group"), " to some ", r("fragment"), " for ", link_name("private_area_intersection", "private area intersection"), " and then performing scalar multiplication with ", r("scalar"), "."],
                                    rhs: r("PsiGroup"),
                                },
                                {
                                    id: "BindPsiIsSecondary",
                                    name: "is_secondary",
                                    comment: ["Set to ", code("true"), " if the private set intersection item is a ", r("fragment_secondary"), " ", r("fragment"), "."],
                                    rhs: r("Bool"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["In the ", link_name("private_equality_testing", "colour mixing metaphor"), ", a ", r("BindPsi"), " message corresponds to mixing a data colour with one’s secret colour, and sending the mixture to the other peer."]),
                        "The ", r("BindPsi"), " messages let peers submit ", rs("fragment"), " to the private set intersection part of ", link_name("private_area_intersection", "private area intersection"), ". The freshly created ", r("IntersectionHandle"), " ", r("handle_bind", "binds"), " the ", r("BindPsiGroupMember"), " in the ", r("psi_state_pending"), " state.",
                    ]),
                
                    pinformative(R("BindPsi"), " messages use the ", r("IntersectionChannel"), "."),
                ]),

                hsection("psi_reply", code("PsiReply"), [
                    pseudocode(
                        new Struct({
                            id: "PsiReply",
                            comment: ["Finalise private set intersection for a single item."],
                            fields: [
                                {
                                    id: "PsiReplyHandle",
                                    name: "handle",
                                    comment: ["The ", r("IntersectionHandle"), " of the ", r("BindPsi"), " message which this finalises."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "PsiReplyGroupMember",
                                    name: "group_member",
                                    comment: ["The result of performing scalar multiplication between the ", r("BindPsiGroupMember"), " of the message that this is replying to and ", r("scalar"), "."],
                                    rhs: r("PsiGroup"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["In the ", link_name("private_equality_testing", "colour mixing metaphor"), ", a ", r("PsiReply"), " message corresponds to mixing one’s secret colour with a colour mixture received from the other peer, and sending the resulting colour back."]),
                        "The ", r("PsiReply"), " messages let peers complete the information exchange regarding a single ", r("fragment"), " submitted to private set intersection in the ", link_name("private_area_intersection", "private area intersection"), " process.",
                    ]),

                    pinformative("The ", r("PsiReplyHandle"), " must refer to an ", r("IntersectionHandle"), " ", r("handle_bind", "bound"), " by the other peer via a ", r("BindPsi"), " message. A peer may send at most one ", r("PsiReply"), " message per ", r("IntersectionHandle"), ". Upon sending or receiving a ", r("PsiReply"), " message, a peer updates the ", r("resource_handle"), " binding to now ", r("handle_bind"), " the ", r("PsiReplyGroupMember"), " of the ", r("PsiReply"), " message, in the state ", r("psi_state_completed"), "."),
                ]),

                hsection("request_subspace_capability", code("RequestSubspaceCapability"), [
                    pseudocode(
                        new Struct({
                            id: "RequestSubspaceCapability",
                            comment: ["Ask the receiver to send a ", r("SubspaceCapability"), "."],
                            fields: [
                                {
                                    id: "RequestSubspaceCapabilityHandle",
                                    name: "handle",
                                    comment: ["The ", r("IntersectionHandle"), " ", r("handle_bind", "bound"), " by the sender for the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), " for whose ", r("NamespaceId"), " to request the ", r("SubspaceCapability"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
    
                    pinformative("The ", r("RequestSubspaceCapability"), " messages let peers request ", rs("SubspaceCapability"), ", by sending the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), ". This item must be in the intersection of the two peers’ ", rs("fragment"), ". The receiver of the message can thus look up the ", r("subspace"), " in question."),

                    pinformative("A peer may send at most one ", r("RequestSubspaceCapability"), " message per ", r("IntersectionHandle"), "."),
                ]),

                hsection("supply_subspace_capability", code("SupplySubspaceCapability"), [
                    pseudocode(
                        new Struct({
                            id: "SupplySubspaceCapability",
                            plural: "SupplySubspaceCapabilities",
                            comment: ["Send a previously requested ", r("SubspaceCapability"), "."],
                            fields: [
                                {
                                    id: "SupplySubspaceCapabilityHandle",
                                    name: "handle",
                                    comment: ["The ", r("RequestSubspaceCapabilityHandle"), " of the ", r("RequestSubspaceCapability"), " message that this answers (hence, an ", r("IntersectionHandle"), " ", r("handle_bind", "bound"), " by the ", em("receiver"), " of this message)."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "SupplySubspaceCapabilityCapability",
                                    name: "capability",
                                    comment: ["A ", r("SubspaceCapability"), " whose ", r("subspace_granted_namespace"), " corresponds to the request this answers."],
                                    rhs: r("SubspaceCapability"),
                                },
                                {
                                    id: "SupplySubspaceCapabilitySignature",
                                    name: "signature",
                                    comment: ["The ", r("sync_subspace_signature"), " issued by the ", r("subspace_receiver"), " of the ", r("SupplySubspaceCapabilityCapability"), " over the sender’s ", r("value_challenge"), "."],
                                    rhs: r("sync_subspace_signature"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative(
                        marginale(["Note that ", r("SupplySubspaceCapability"), " messages do not use any logical channel. Hence, peers must be able to verify them in a constant amount of memory. Whether this is possible, depends on the capability system."]),
                        "The ", r("SupplySubspaceCapability"), " messages let peers answer requests for ", rs("SubspaceCapability"), ". To do so, they must present a valid ", r("sync_subspace_signature"), " over their ", r("value_challenge"), ", thus demonstrating they hold the secret key corresponding to the ", r("subspace_receiver"), " of the ", r("SubspaceCapability"), ".",
                    ),

                    pinformative("A peer may send at most one ", r("SupplySubspaceCapability"), " message per ", r("RequestSubspaceCapability"), " it received."),
                ]),

                hsection("bind_capability", code("BindCapability"), [
                    pseudocode(
                        new Struct({
                            id: "BindCapability",
                            plural: "BindCapabilities",
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
                                    comment: ["The ", r("IntersectionHandle"), ", ", r("handle_bind", "bound"), " by the sender, for the ", r("fragment_primary"), " ", r("fragment_least_specific"), " ", r("fragment"), " of the ", r("BindCapabilityCapability"), ", or its ", r("fragment_secondary"), " ", r("fragment_least_specific"), " ", r("fragment"), " if the ", r("fragment_primary"), " ", r("fragment_least_specific"), " ", r("fragment"), " is not in the intersection of the ", rs("fragment"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "BindCapabilitySignature",
                                    name: "signature",
                                    comment: ["The ", r("sync_signature"), " issued by the ", r("sync_receiver"), " of the ", r("BindCapabilityCapability"), " over the sender’s ", r("value_challenge"), "."],
                                    rhs: r("sync_signature"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("BindCapability"), " messages let peers ", r("handle_bind"), " a ", r("ReadCapability"), " for later reference. To do so, they must present a valid ", r("sync_signature"), " over their ", r("value_challenge"), ", thus demonstrating they hold the secret key corresponding to ", r("access_receiver"), " of the ", r("ReadCapability"), "."),

                    pinformative(
                        marginale(["These requirements allow us to encode ", r("BindCapability"), " messages more efficiently."]),
                        "The ", r("BindCapabilityHandle"), " must of a ", r("fragment_least_specific"), " ", r("fragment"), " in the intersection of the two peers’ ", rs("fragment"), ", and it must be of a ", r("fragment_primary"), " ", r("fragment"), " if possible.",
                    ),
                
                    pinformative(R("BindCapability"), " messages use the ", r("CapabilityChannel"), "."),
                ]),

                hsection("bind_static_token", code("BindStaticToken"), [
                    pseudocode(
                        new Struct({
                            id: "BindStaticToken",
                            comment: [R("handle_bind"), " a ", r("StaticToken"), " to a ", r("StaticTokenHandle"), "."],
                            fields: [
                                {
                                    id: "BindStaticTokenToken",
                                    name: "static_token",
                                    comment: ["The ", r("StaticToken"), " to bind."],
                                    rhs: r("StaticToken"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("BindStaticToken"), " messages let peers ", r("handle_bind"), " ", rs("StaticToken"), ". Transmission of ", rs("AuthorisedEntry"), " in other messages refers to ", rs("StaticTokenHandle"), " rather than transmitting ", rs("StaticToken"), " verbatim."),

                    pinformative(R("BindStaticToken"), " messages use the ", r("StaticTokenChannel"), "."),
                ]),

                hsection("entry_push", code("EntryPush"), [
                    pseudocode(
                        new Struct({
                            id: "EntryPush",
                            comment: ["Transmit an ", r("AuthorisedEntry"), " to the other peer, and optionally prepare transmission of its ", r("Payload"), "."],
                            fields: [
                                {
                                    id: "EntryPushEntry",
                                    name: "entry",
                                    comment: ["The ", r("Entry"), " to transmit."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "EntryPushStatic",
                                    name: "static_token_handle",
                                    comment: ["A ", r("StaticTokenHandle"), " ", r("handle_bind", "bound"), " to the ", r("StaticToken"), " of the ", r("Entry"), " to transmit."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "EntryPushDynamic",
                                    name: "dynamic_token",
                                    comment: ["The ", r("DynamicToken"), " of the ", r("Entry"), " to transmit."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "EntryPushOffset",
                                    name: "offset",
                                    comment: ["The offset in the ", r("Payload"), " in bytes at which ", r("Payload"), " transmission will begin. If this is equal to the ", r("Entry"), "’s ", r("entry_payload_length"), ", the ", r("Payload"), " will not be transmitted."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("EntryPush"), " messages let peers transmit ", rs("LengthyEntry"), " outside of ", r("3drbsr"), ". They further set up later ", r("Payload"), " transmissions (via ", r("PayloadPush"), " messages)."),

                    pinformative("To map ", r("Payload"), " transmissions to ", rs("Entry"), ", each peer maintains two pieces of state: an ", r("Entry"), " ", def_value("currently_received_entry"), ", and a ", r("U64"), " ", def_value("currently_received_offset"), marginale(["These are used by ", r("PayloadPush"), " messages."]), ". When receiving an ", r("EntryPush"), " message whose ", r("EntryPushOffset"), " is strictly less than the ", r("EntryPushEntry"), apo, "s ", r("entry_payload_length"), ", a peers sets its ", r("currently_received_entry"), " to the received ", r("EntryPushEntry"), " and its ", r("currently_received_offset"), " to the received ", r("EntryPushOffset"), "."),
                
                    pinformative(R("EntryPush"), " messages use the ", r("DataChannel"), "."),
                ]),

                hsection("payload_push", code("PayloadPush"), [
                    pseudocode(
                        new Struct({
                            id: "PayloadPush",
                            comment: ["Transmit some ", r("Payload"), " bytes."],
                            fields: [
                                {
                                    id: "PayloadPushAmount",
                                    name: "amount",
                                    comment: ["The number of transmitted bytes."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "PayloadPushBytes",
                                    name: "bytes",
                                    comment: [r("PayloadPushAmount"), " many bytes, to be added to the ", r("Payload"), " of the receiver", apo, "s ", r("currently_received_entry"), " at offset ", r("currently_received_offset"), "."],
                                    rhs: ["[", hl_builtin("u8"), "]"],
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("PayloadPush"), " messages let peers transmit ", rs("Payload"), "."),

                    pinformative("A ", r("PayloadPush"), " message may only be sent if its ", r("PayloadPushAmount"), " of ", r("PayloadPushBytes"), " plus the receiver", apo, "s ", r("currently_received_offset"), " is less than or equal to the ", r("entry_payload_length"), " of the receiver", apo, "s ", r("currently_received_entry"), ". The receiver then increases its ", r("currently_received_offset"), " by ", r("PayloadPushAmount"), ". If the ", r("currently_received_entry"), " was set via a ", r("PayloadResponse"), " message, the receiver also increases the offset to which the ", r("PayloadRequestHandle"), " is ", r("handle_bind", "bound"), "."),

                    pinformative("A ", r("PayloadPush"), " message may only be sent if the receiver has a well-defined ", r("currently_received_entry"), "."),
                
                    pinformative(R("PayloadPush"), " messages use the ", r("DataChannel"), "."),
                ]),

                hsection("bind_payload_request", code("BindPayloadRequest"), [
                    pseudocode(
                        new Struct({
                            id: "BindPayloadRequest",
                            comment: [R("handle_bind"), " an ", r("Entry"), " to a ", r("PayloadRequestHandle"), " and request transmission of its ", r("Payload"), " from an offset."],
                            fields: [
                                {
                                    id: "BindPayloadRequestEntry",
                                    name: "entry",
                                    comment: ["The ", r("Entry"), " to request."],
                                    rhs: r("Entry"),
                                },
                                {
                                    id: "BindPayloadRequestOffset",
                                    name: "offset",
                                    comment: ["The offset in the ", r("Payload"), " starting from which the sender would like to receive the ", r("Payload"), " bytes."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "BindPayloadRequestCapability",
                                    name: "capability",
                                    comment: ["A ", r("resource_handle"), " for a ", r("ReadCapability"), " ", r("handle_bind", "bound"), " by the sender that grants them read access to the ", r("handle_bind", "bound"), " ", r("Entry"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["If the receiver of a ", r("BindPayloadRequest"), " does not have the requested ", r("Payload"), " and does not plan to obtain it in the future, it should signal so by ", r("handle_free", "freeing"), " the ", r("PayloadRequestHandle"), "."]),
                        "The ", r("BindPayloadRequest"), " messages let peers explicitly request ", rs("Payload"), ", by binding a ", r("PayloadRequestHandle"), " to the specified ", r("BindPayloadRequestEntry"), " and ", r("BindPayloadRequestOffset"), ". The other peer is expected to then transmit the ", r("Payload"), ", starting at the specified ", r("BindPayloadRequestOffset"), ". The request contains a ", r("CapabilityHandle"), " to a ", r("ReadCapability"), " whose ", r("granted_area"), " must ", r("area_include"), " the requested ", r("Entry"), ".",
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
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("PayloadResponse"), " messages let peers reply to ", r("BindPayloadRequest"), " messages, by indicating that future ", r("PayloadPush"), " messages will pertain to the requested ", r("Payload"), ". More precisely, upon receiving a ", r("PayloadResponse"), " message, a peer sets its ", r("currently_received_entry"), " and ", r("currently_received_offset"), " values to those to which the message", apo, "s ", r("PayloadResponseHandle"), " is ", r("handle_bind", "bound"), "."),
                ]),

                hsection("bind_aoi", code("BindAreaOfInterest"), [
                    pseudocode(
                        new Struct({
                            id: "BindAreaOfInterest",
                            comment: [R("handle_bind"), " an ", r("AreaOfInterest"), " to an ", r("AreaOfInterestHandle"), "."],
                            fields: [
                                {
                                    id: "BindAreaOfInterestAOI",
                                    name: "area_of_interest",
                                    comment: ["An ", r("AreaOfInterest"), " that the peer wishes to reference in future messages."],
                                    rhs: r("AreaOfInterest"),
                                },
                                {
                                    id: "BindAreaOfInterestCapability",
                                    name: "authorisation",
                                    comment: ["A ", r("CapabilityHandle"), " ", r("handle_bind", "bound"), " by the sender that grants access to all entries in the message", apo, "s ", r("BindAreaOfInterestAOI"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "BindAreaOfInterestKnown",
                                    name: "known_intersections",
                                    comment: ["How many intersections with other ", rs("AreaOfInterest"), " the sender knows about already."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative([
                        marginale(["Development note: if we go for private 3d-range intersection, this message would become a ", code("BindAreaOfInterestPublic"), " message, and we would add ", code("BindAreaOfInterestPrivate"), " and ", code("AreaOfInterestReply"), " messages, completely analogous to the namespace PSI setup. Surprisingly little conceptual complexity involved."]),
                        "The ", r("BindAreaOfInterest"), " messages let peers ", r("handle_bind"), " an ", r("AreaOfInterest"), " for later reference. They show that they may indeed receive ", rs("Entry"), " from the ", r("AreaOfInterest"), " by providing a ", r("CapabilityHandle"), " ", r("handle_bind", "bound"), " by the sender that grants access to all entries in the message", apo, "s ", r("BindAreaOfInterestAOI"), ".",
                    ]),

                    aside_block([
                        p("The ", r("BindAreaOfInterestKnown"), " field serves to allow immediately following up on ", rs("BindAreaOfInterest"), " with reconciliation messages concerning the ", r("handle_bind", "bound"), " ", r("AreaOfInterest"), " without the risk of duplicate reconciliation. To elaborate, imagine that both peers concurrently send ", rs("BindAreaOfInterest"), " messages for overlapping ", rs("AreaOfInterest"), ". If both peers, upon receiving the other", apo, "s message, initiated reconciliation for the intersection, there would be two concurrent reconciliation sessions for the same data."),

                        p("A simple workaround is to let ", r("alfie"), " be the only peer to initiate reconciliation. But this can introduce unnecessary delay when ", r("betty"), " sends a ", r("BindAreaOfInterest"), " message for which she already knows there are intersections with ", rs("AreaOfInterest"), " that ", r("alfie"), " had previously ", r("handle_bind", "bound"), "."),

                        p("In this situation, ", r("betty"), " sets the ", r("BindAreaOfInterestKnown"), " field of her ", r("BindAreaOfInterest"), " message to the number of reconciliation messages that she will send pertaining to her newly ", r("handle_bind", "bound"), " ", r("AreaOfInterest"), ". ", R("alfie"), " should not initiate reconciliation based on the received message until he has also received ", r("BindAreaOfInterestKnown"), " many reconciliation messages pertaining to this ", r("AreaOfInterest"), " from ", r("betty"), "."),

                        p(R("betty"), " should never initiate reconciliation based on messages she receives, and when she initiates reconciliation pertaining to ", rs("AreaOfInterest"), " she ", r("handle_bind", "binds"), " herself, she should meaningfully set the ", r("BindAreaOfInterestKnown"), "field. ", R("alfie"), " should set the ", r("BindAreaOfInterestKnown"), " field of all his ", r("BindAreaOfInterest"), " messages to zero, and eagerly initiate reconciliation sessions as long as he respects ", r("betty"), apo, "s ", r("BindAreaOfInterestKnown"), " fields."),
                    ]),
                
                    pinformative(R("BindAreaOfInterest"), " messages use the ", r("AreaOfInterestChannel"), "."),
                ]),

                hsection("range_fingerprint_message", code("RangeFingerprint"), [
                    pseudocode(
                        new Struct({
                            id: "RangeFingerprint",
                            comment: ["Send a ", r("Fingerprint"), " as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "RangeFingerprintRange",
                                    name: "range",
                                    comment: ["The ", r("3dRange"), " whose ", r("Fingerprint"), " is transmitted."],
                                    rhs: r("3dRange"),
                                },
                                {
                                    id: "RangeFingerprintFingerprint",
                                    name: "fingerprint",
                                    comment: ["The ", r("Fingerprint"), " of the ", r("RangeFingerprintRange"), ", that is, of all ", rs("LengthyEntry"), " the peer has in the ", r("RangeFingerprintRange"), "."],
                                    rhs: r("Fingerprint"),
                                },
                                {
                                    id: "RangeFingerprintSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("RangeFingerprintRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "RangeFingerprintReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("RangeFingerprintRange"), "."],
                                    rhs: r("U64"),
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
                            comment: ["Send the ", rs("LengthyEntry"), " a peer has in a ", r("3dRange"), " as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "RangeEntriesRange",
                                    name: "range",
                                    comment: ["The ", r("3dRange"), " whose ", rs("LengthyEntry"), " are transmitted."],
                                    rhs: r("3dRange"),
                                },
                                {
                                    id: "RangeEntriesEntries",
                                    name: "entries",
                                    comment: ["The ", rs("LengthyEntry"), " in the ", r("RangeEntriesRange"), ", together with authorisation in form of a ", r("StaticTokenHandle"), " and a ", r("DynamicToken"), "."],
                                    rhs: pseudo_array(pseudo_tuple(r("LengthyEntry"), r("U64"), r("DynamicToken"))),
                                },
                                {
                                    id: "RangeEntriesFlag",
                                    name: "want_response",
                                    comment: ["A boolean flag to indicate whether the sender wishes to receive a ", r("RangeEntries"), " message for the same ", r("3dRange"), " in return."],
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "RangeEntriesSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("RangeEntriesRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "RangeEntriesReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("RangeEntriesRange"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("RangeEntries"), " messages let peers conclude ", r("3drbsr"), " for a ", r("3dRange"), " by transmitting their ", rs("LengthyEntry"), " in the ", r("3dRange"), ". Each ", r("RangeEntries"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers; this upholds read access control."),

                    pinformative(R("RangeEntries"), " messages use the ", r("ReconciliationChannel"), "."),
                ]),

                hsection("range_confirmation", code("RangeConfirmation"), [
                    pseudocode(
                        new Struct({
                            id: "RangeConfirmation",
                            comment: ["Signal ", r("Fingerprint"), " equality as part of ", r("3drbsr"), "."],
                            fields: [
                                {
                                    id: "RangeConfirmationRange",
                                    name: "range",
                                    comment: ["The ", r("3dRange"), " in question."],
                                    rhs: r("3dRange"),
                                },
                                {
                                    id: "RangeConfirmationSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message, that fully contains the ", r("RangeConfirmationRange"), "."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "RangeConfirmationReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message, that fully contains the ", r("RangeConfirmationRange"), "."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("RangeConfirmation"), " messages let peers signal that they received a ", r("Fingerprint"), " as part of ", r("3drbsr"), " that equals their local ", r("Fingerprint"), " for that ", r("3dRange"), ".", marginale(["Upon sending or receiving a ", r("RangeConfirmation"), ", a peer should switch operation to forwarding any new ", rs("Entry"), " inside the ", r("3dRange"), " to the other peer."]), " Each ", r("RangeConfirmation"), " message must contain ", rs("AreaOfInterestHandle"), " issued by both peers; this upholds read access control."),

                    pinformative(R("RangeConfirmation"), " messages use the ", r("ReconciliationChannel"), "."),
                ]),

                hsection("sync_eagerness", code("Eagerness"), [
                    pseudocode(
                        new Struct({
                            id: "Eagerness",
                            comment: ["Express a preference whether the other peer should eagerly forward ", rs("Payload"), " in the intersection of two ", rs("AreaOfInterest"), "."],
                            fields: [
                                {
                                    id: "EagernessEagerness",
                                    name: "is_eager",
                                    comment: ["Whether ", rs("Payload"), " should be pushed."],
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "EagernessSenderHandle",
                                    name: "sender_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the sender of this message."],
                                    rhs: r("U64"),
                                },
                                {
                                    id: "EagernessReceiverHandle",
                                    name: "receiver_handle",
                                    comment: ["An ", r("AreaOfInterestHandle"), ", ", r("handle_bind", "bound"), " by the receiver of this message."],
                                    rhs: r("U64"),
                                },
                            ],
                        }),
                    ),
                
                    pinformative("The ", r("Eagerness"), " messages let peers express whether the other peer should eagerly push ", rs("Payload"), " from the intersection of two ", rs("AreaOfInterest"), ", or whether they should send only ", r("EntryPush"), " messages for that intersection."),

                    pinformative(R("Eagerness"), " messages are not binding, they merely present an optimisation opportunity. In particular, they allow expressing the ", code("Prune"), " and ", code("Graft"), " messages of the ", link("epidemic broadcast tree protocol", "https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf"), "."),
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
                                    rhs: r("U64"),
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
                                    rhs: r("U64"),
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
                                    rhs: r("U64"),
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
                                    rhs: r("U64"),
                                },
                                {
                                    id: "SyncHandleFreeMine",
                                    comment: ["Indicates whether the peer sending this message is the one who created the ", r("SyncHandleFreeHandle"), " (", code("true"), ") or not (", code("false"), ")."],
                                    name: "mine",
                                    rhs: r("Bool"),
                                },
                                {
                                    id: "SyncHandleFreeType",
                                    name: "handle_type",
                                    rhs: r("HandleKind"),
                                },
                            ],
                        }),
                    ),
                ]),
            ]),

            hsection("sync_encodings", "Encodings", [
                aside_block("Defining the precise message encodings has to wait until the repercussions of e2e encryption and private area intersection have settled into specific message types for this protocol."),



                // We require an ", r("encoding_function"), " for ", r("sync_signature"), ", and an ", r("encoding_function"), " for ", r("ReadCapability"), ". The ", r("encoding_function"), " for ", r("ReadCapability"), " need not encode the ", r("granted_namespace"), ", it can be inferred from context.

                // Further, we require ", rs("encoding_function"), " for ", r("PsiGroup"), " and ", r("PsiScalar"), ".

                // , and an ", r("encoding_function"), " for ", r("SubspaceCapability"), ". This ", r("encoding_function"), " need not encode the ", r("subspace_granted_namespace"), ", it can be inferred from context.", Rs("SubspaceCapability"), " must use the same signature scheme as the ", rs("ReadCapability"), "."





                // marginale("The precise encoding details are still a work in progress that can only be resolved once we have integrated the planned changes to our core data model and have decided on private area intersection in the wgps."),
                // pinformative("We now define how to encode messages as sequences of bytes. The least significant five bit of the first byte of each encoding sufficed to determine the message type."),

                // hsection("encoding_reveal_commitment", code("RevealCommitment"), [
                //     pinformative("When encoding a ", r("RevealCommitment"), " message, the five least significant bits of the first byte are ", code("00000"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("RevealCommitmentNonce"), "."),
                // ]),

                // hsection("encoding_bind_psi", code("BindPsi"), [
                //     pinformative("When encoding a ", r("BindPsi"), " message, the five least significant bits of the first byte are ", code("00001"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("BindPsiGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                // ]),

                // hsection("encoding_psi_reply", code("PsiReply"), [
                //     pinformative("When encoding a ", r("PsiReply"), " message, the five least significant bits of the first byte are ", code("00010"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("PsiReplyHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("PsiReplyHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                //     pinformative("This is followed by the ", r("PsiReplyGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                // ]),

                // hsection("encoding_bind_namespace_public", code("BindNamespacePublic"), [
                //     pinformative("When encoding a ", r("BindNamespacePublic"), " message, the five least significant bits of the first byte are ", code("00011"), ", the remaining three bits should be set to zero. The initial byte is followed by the ", r("BindNamespacePublicGroupMember"), ", encoded with the ", r("encoding_function"), " for ", r("PsiGroup"), "."),
                // ]),

                // hsection("encoding_bind_capability", code("BindCapability"), [
                //     pinformative("When encoding a ", r("BindCapability"), " message, the five least significant bits of the first byte are ", code("00100"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("BindCapabilityHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("BindCapabilityHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                //     pinformative("This is followed by the ", r("BindCapabilitySignature"), ", encoded with the ", r("encoding_function"), " for ", r("PsiSignature"), "."),

                //     pinformative("This is followed by the ", r("BindCapabilityCapability"), ", encoded with the ", r("encoding_function"), " for ", r("ReadCapability"), " (which need not encode the ", r("granted_namespace"), ")."),
                // ]),

                // hsection("encoding_entry_push", code("EntryPush"), [
                //     pinformative("When encoding a ", r("BindCapability"), " message, the five least significant bits of the first byte are ", code("00101"), "."),

                //     pinformative("The remaining encoding employs a couple of optimisations: an ", r("EntryPushAvailable"), " of zero or equal to the ", r("payload_length"), " of the ", r("EntryPushEntry"), " can be encoded efficiently, as can such an ", r("EntryPushOffset"), ". The ", r("EntryPushEntry"), " itself can be either encoded relative to the ", r("currently_received_entry"), " of the receiver as an ", r("EntryRelativeEntry"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of two ", rs("AreaOfInterestHandle"), " as an ", r("EntryInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_payload_push", code("PayloadPush"), [
                //     pinformative("When encoding a ", r("PayloadPush"), " message, the five least significant bits of the first byte are ", code("00110"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("PayloadPushAmount"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("PayloadPushAmount"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),

                //     pinformative("This is followed by ", r("PayloadPushAmount"), " bytes of ", r("Payload"), "."),
                // ]),

                // hsection("encoding_bind_payload_request", code("BindPayloadRequest"), [
                //     pinformative("When encoding a ", r("BindPayloadRequest"), " message, the five least significant bits of the first byte are ", code("00111"), "."),

                //     pinformative("The remaining encoding employs a couple of optimisations: an ", r("BindPayloadRequestCapability"), " of zero can be encoded efficiently. The ", r("BindPayloadRequestEntry"), " itself can be either encoded relative to the ", r("currently_received_entry"), " of the receiver as an ", r("EntryRelativeEntry"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of two ", rs("AreaOfInterestHandle"), " as an ", r("EntryInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_payload_response", code("PayloadResponse"), [
                //     pinformative("When encoding a ", r("PayloadResponse"), " message, the five least significant bits of the first byte are ", code("01000"), "."),

                //     pinformative("Let ", $("1 \\leq b \\leq 8"), " such that the ", r("delta_handle"), " of ", r("PayloadResponseHandle"), " can be encoded as an unsigned ", $("b"), "-bit integer. Then the three most significant bits of the first encoding byte encode ", $("b"), " as a three bit integer. The first encoding byte is followed by the ", r("delta_handle"), " of ", r("PayloadResponseHandle"), ", encoded as an unsigned big-endian ", $("b"), "-bit integer."),
                // ]),

                // hsection("encoding_bind_aoi", code("BindAreaOfInterest"), [
                //     pinformative("When encoding a ", r("BindAreaOfInterest"), " message, the five least significant bits of the first byte are ", code("01001"), "."),

                //     pinformative("The remaining encoding employs a couple of optimisations: an ", r("BindAreaOfInterestKnown"), " of zero can be encoded efficiently. The ", r("BindAreaOfInterestAOI"), " itself is encoded relative to the containing ", r("granted_area"), " of the ", r("BindAreaOfInterestCapability"), " as an ", r("AreaInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_range_fp", code("RangeFingerprint"), [
                //     pinformative("When encoding a ", r("RangeFingerprint"), " message, the five least significant bits of the first byte are ", code("01010"), "."),

                //     pinformative("The ", r("RangeFingerprintRange"), " can be either encoded relative to the precedingly transmitted ", r("3dRange"), " as a ", r("RangeRelativeRange"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of the ", r("RangeFingerprintSenderHandle"), " and the ", r("RangeFingerprintReceiverHandle"), " as a ", r("RangeInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_range_entries", code("RangeEntries"), [
                //     pinformative("When encoding a ", r("RangeEntries"), " message, the five least significant bits of the first byte are ", code("01011"), "."),

                //     pinformative("The ", r("RangeEntriesRange"), " can be either encoded relative to the precedingly transmitted ", r("3dRange"), " as a ", r("RangeRelativeRange"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of the ", r("RangeEntriesSenderHandle"), " and the ", r("RangeEntriesReceiverHandle"), " as a ", r("RangeInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_range_confirmation", code("RangeConfirmation"), [
                //     pinformative("When encoding a ", r("RangeConfirmation"), " message, the five least significant bits of the first byte are ", code("01100"), "."),

                //     pinformative("The ", r("RangeConfirmationRange"), " can be either encoded relative to the precedingly transmitted ", r("3dRange"), " as a ", r("RangeRelativeRange"), ", or relative to the ", r("area_intersection"), " of the ", rs("area"), " of the ", r("RangeConfirmationSenderHandle"), " and the ", r("RangeConfirmationReceiverHandle"), " as a ", r("RangeInArea"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_eagerness", code("Eagerness"), [
                //     pinformative("When encoding a ", r("Eagerness"), " message, the five least significant bits of the first byte are ", code("01101"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_guarantee", code("Guarantee"), [
                //     pinformative("When encoding a ", r("SyncGuarantee"), " message, the five least significant bits of the first byte are ", code("01110"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_absolve", code("Absolve"), [
                //     pinformative("When encoding a ", r("SyncAbsolve"), " message, the five least significant bits of the first byte are ", code("01111"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_oops", code("Oops"), [
                //     pinformative("When encoding a ", r("SyncOops"), " message, the five least significant bits of the first byte are ", code("10000"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_started_dropping", code("ChannelStartedDropping"), [
                //     pinformative("When encoding a ", r("SyncStartedDropping"), " message, the five least significant bits of the first byte are ", code("10001"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_apology", code("ChannelApology"), [
                //     pinformative("When encoding a ", r("SyncApology"), " message, the five least significant bits of the first byte are ", code("10010"), "."),

                //     pinformative("TODO define an encoding"),
                // ]),

                // hsection("encoding_handle_free", code("Free"), [
                //     pinformative("When encoding a ", r("SyncHandleFree"), " message, the five least significant bits of the first byte are ", code("10011"), "."),

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

                // pinformative("Possibly BindAreaOfInterestPrivate and PaoiiReply"),
                // pinformative("6 logical channels, 4 handle kinds"),
                // pinformative("Group messages whose header byte contains no information beyond the message type together."),

                // pinformative("Entry 5: entry encoded relative to two AreadOfInterestHandles, or relative to the ", r("currently_received_entry"), " of the receiver, or absolutely"),

                // pinformative("3dRange X: RangeInArea, RangeRelativeRange"),

                // ols(
                //     [r("RevealCommitment"), " 0"],
                //     [r("BindPsi"), " 1"],
                //     [r("PsiReply"), " 2"],
                //     [r("RequestSubspaceCapability"), " 2"],
                //     [r("SupplySubspaceCapability"), " 2"],
                //     [r("BindCapability"), " 2 + 1 (whether the encoding of the ReadCapability includes a SubspaceId or if it can be inferred from the handle)"],
                //     [r("BindStaticToken"), " 0"],
                //     [r("EntryPush"), " 2 + 3 + 5 (offset-width with special cases for zero and the payload length), (Entry)"],
                //     [r("PayloadPush"), " 2"],
                //     [r("BindPayloadRequest"), " 2 + 3 + 5 (offset with special case for zero), (Entry)"],
                //     [r("PayloadResponse"), " 2"],
                //     [r("BindAreaOfInterest"), " 2 + 3 (known_intersections with special case zero)"],
                //     [r("RangeFingerprint"), " 2 + 2 + 3dRange (+ special case empty fingerprint?)"],
                //     [r("RangeEntries"), " 2 + 2 + 1 + 3dRange"],
                //     [r("RangeConfirmation"), " 2 + 2 + 3dRange"],
                //     [r("Eagerness"), " 1 + 2 + 2"],
                //     [r("SyncGuarantee"), " 2 + 3"],
                //     [r("SyncAbsolve"), " 2 + 3"],
                //     [r("SyncOops"), " 2 + 3"],
                //     [r("SyncStartedDropping"), " 3"],
                //     [r("SyncApology"), " 3"],
                //     [r("SyncHandleFree"), " 2 + 1 + 3"],
                // ),
            ]),
        ]),

    ],
);
