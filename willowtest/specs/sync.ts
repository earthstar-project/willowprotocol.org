import { R, def, r, rs } from "../../defref.ts";
import { code, em, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale, sidenote } from "../../marginalia.ts";
import { Expression } from "../../tsgen.ts";
import { site_template, pinformative, lis, pnormative, link } from "../main.ts";
import { $ } from "../../katex.ts";
import { Struct, pseudocode, hl_builtin } from "../../pseudocode.ts";

export const sync: Expression = site_template(
    {
        title: "Willow General Purpose Sync Protocol",
        name: "sync",
    },
    [
        pinformative("The ", link_name("data_model", "willow data model"), " specifies how to arrange data, but it does not prescribe how peers should synchronize data. In this document, we specify one possible way for performing synchronization: the ", def("WGPS", "Willow General Purpose Sync (WGPS) protocol"), ". This document assumes familiarity with the ", link_name("data_model", "willow data model"), " and ", link_name("meadowcap", "meadowcap"), "."),

        hsection("sync_intro", "Introduction", [
            pinformative("The WGPS aims to be appropriate for a variety of networking settings, particularly those of peer-to-peer systems where the replicating parties might not necessarily trust each other. Quite a bit of engineering went into the WGPS to satisfy the following requirements:"),

            lis(
                "Incremental sync: peers can detect regions of shared data with relatively sparse communication to avoid redundant data transfer.",
                "Partial sync: peers synchronize only those regions of data they both care about, at sub-namespace granularity.",
                ["Access control: conformant peers only hand out data if the request ", link_name("meadowcap", "authorizes its access"), "."],
                "Private set intersection: peers can discover which namespaces they have in common without disclosing any non-common namespaces to each other.",
                "Resource control: peers communicate (and enforce) their computational resource limits so as not to overload each other.",
                "Transport independence: peers can communicate over arbitrary reliable, ordered, byte-oriented channels, whether tcp, quic, or unix pipe.",
                "General efficiency: peers can make use of efficient implementation techniques, and the overall bandwidth consumption stays low.",
            ),

            pinformative("The WGPS provides a shared vocabulary for peers to communicate with, but nothing more. It cannot and does not force peers to use it efficiently or to use the most efficient data structures internally. That's a feature! Implementations can start off with inefficient but simple implementation choices and later replace those with better-scaling ones. Throughout that evolution, the implementations stay compatible with any other implementation, regardless of its degree of sophistication."),

            // pnormative("Throughout this specification, paragraphs styled like this one are normative. Implementations ", link("MUST", "https://datatracker.ietf.org/doc/html/rfc2119"), " adhere to all normative content. The other (informative) content is for human eyes only, don't show it to your computer."),
        ]),

        hsection("sync_concepts", "Concepts", [
            pinformative("Data synchronization for willow needs to solve a number of sub-problems, which we summarize in this section."),

            hsection("sync_psi", "Private Set Intersection", [
                pinformative("The WGPS allows two peers to determine which ", rs("namespace"), " they share an interest in without leaking any information about the ", rs("namespace"), " which they do not both know about. We explain the underlying ", link_name("psi", "private set intersection protocol here"), "."),
            ]),

            hsection("sync_access", "Access Control", [
                pinformative("The WGPS employs the access control mechanism outlined in the ", link_name("meadowcap_read_control", "meadowcap spec"), "."),
            ]),

            hsection("sync_partial", "Partial Synchronization", [
                pinformative("To synchronize data, peers specify any number of ", rs("aoi"), ". All ", r("aoi_empty", "non-empty"), " ", rs("aoi_intersection"), " of ", rs("aoi"), " from both peers contain the ", rs("entry"), " that need to be synchronized."),

                pinformative("The WGPS synchronizes these ", rs("aoi_intersection"), " via ", r("pbsr"), ", a technique we ", link_name("product_based_set_reconciliation", "explain in detail here"), "."),

                pinformative("Note that peers need abide to the ", rs("aoi_count_limit"), " and ", rs("aoi_size_limit"), " of the ", rs("aoi"), " only on a best-effort basis. Imagine Betty has just transmitted her 100 newest ", rs("entry"), " to Alfie, only to then receive an even newer ", r("entry"), " from Gemma. Betty should forward that ", r("entry"), " to Alfie, despite that putting her total number of transmissions above the limit of 100."),
            ]),

            hsection("sync_post_sync_forwarding", "Post-Reconciliation Forwarding", [
                pinformative("After performing ", r("pbsr", "set reconciliation"), ", peers might receive new ", rs("entry"), " that fall into their shared ", rs("aoi"), ". Hence, the WGPS allows peers to transmit ", rs("entry"), " unsolicitedly."),
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
            pinformative("The WGPS is generic over specific cryptographic primitives. In order to use it, one must first specify a full suite of instantiations of the ", link_name("willow_parameters","parameters of the core willow data model"), ". The WGPS also introduces some additional parameters for private set intersection, access control, and product-based set reconciliation."),

            pinformative(""),


// ## Parameters

// The WGPS is generic over specific cryptographic primitives. In order to use it, one must first specify a full suite of instantiations of the parameters of both the core willow data model and of meadowcap. The WGPS also introduces some additional parameters for private set intersection<!-- and for product-based set reconciliation-->.

// Private set intersection requires a type `PsiGroup` whose values are the members of a [finite cyclic groups suitable for key exchanges](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalization_to_finite_cyclic_groups), a type `PsiScalar` of scalars, and a function `psi_scalar_mutiplication(PsiGroup, PsiScalar) -> PsiGroup`. Further, we need *encoding functions* for `PsiGroup` and `PsiScalar`. Finally, we need a function `psi_id_to_group(NamespaceId) -> PsiGroup` that hashes arbitrary *namespace IDs* into `PsiGroup`.

// As of writing (October 2023), the [X25519](https://en.wikipedia.org/wiki/Curve25519) elliptic curve is a suitable and secure cryptographic primitive. In terms of its implementation in the popular [libsodium](https://doc.libsodium.org/) library, `PsiGroup` is the type of integers of width `crypto_scalarmult_BYTES`, `PsiScalar` is the type of integers of width `crypto_scalarmult_SCALARBYTES`, and `psi_scalar_mutiplication` is libsodium's `crypto_scalarmult`.

// <!-- Product-based set reconciliation requires the ability to hash arbitrary sets of entries into values of a type `Fingerprint` via a function `fingerprint(Set<Entry>) -> Fingerprint`. In order to allow for certain efficient implementation techniques, `fingerprint` is not an arbitrary protocol parameter but is constructed from some other protocol parameters.

// First, we require a function `fingerprint_singleton(Entry) -> Fingerprint` that hashes an individual entry into the set `Fingerprint`. This hash function should take into account all aspects of the entry: modifying its *namespace ID*, *subspace ID*, *path*, *timestamp*, *length*, or *hash* should result in a completely different fingerprint.

// <aside>The original paper on range-based set reconciliation does not require commutativity, because it only deals with one-dimensional data. In a multidimensional setting, there is no natural total ordering on the data space, so we cannot constrain the order in which the fingerprints of individual items are combined to a non-arbitrary order.</aside>

// Second, we require an [associative](https://en.wikipedia.org/wiki/Associative_property), [commutative](https://en.wikipedia.org/wiki/Commutative_property) function `fingerprint_combine(Fingerprint, Fingerprint) -> Fingerprint` with a [neutral element](https://en.wikipedia.org/wiki/Identity_element) `fingerprint_neutral`.

// Given these protocol parameters, the function `fingerprint` is defined as follows:

// - applying `fingerprint` to the empty set yields `fingerprint_neutral`,
// - applying `fingerprint` to a set containing exactly one entry `e` yields `fingerprint_singleton(e)`, and
// - applying `fingerprint` to any other set yields the result of applying `fingerprint_singleton` to all members of the set individually and then combining the resulting fingerprints with `fingerprint_combine` (grouping and ordering do not matter because of associativity and commutativity respectively). -->

// The final protocol parameters are used by the two peers to collaboratively agree on a random challenge to authenticate their read requests. This requires a natural number `commitment_length`, and a secure hash function `commitment_hash` that produces digests of `commitment_length` many bytes.

            
        ]),

        // pseudocode(
        //     new Struct({
        //         id: "PsiReply",
        //         comment: ["Look, a birb! ", r("logical_channel")],
        //         fields: [
        //             {
        //                 id: "PsiReplyHandle",
        //                 name: "handle",
        //                 comment: "One birb, two birbs, three birbss, ... Many more birbs than would fit in a single line, so this comment will break to multiple lines. There's always space for more birbs.",
        //                 rhs: hl_builtin("u64"),
        //             },
        //             {
        //                 id: "PsiReplyGroupMember",
        //                 name: "group_member",
        //                 comment: "So many birbssssss!",
        //                 rhs: r("PsiReply"),
        //             }
        //         ],
        //     }),
        // ),

        // p("Referencing the ", r("PsiReply"), " struct and its ", r("PsiReplyHandle"), " field."),

        // pinformative("The WGPS uses the following ", rs("handle_type"), ":"),
    
        // lis(
        //     [def({ id: "namespace_handle", singular: "namespace handle"}), ": Peers inform each other about ", rs("namespace"), "they care about, or more precisely, they inform each other about members of the ", ],
        // ),
    ],
);

/*

## Parameters

The WGPS is generic over specific cryptographic primitives. In order to use it, one must first specify a full suite of instantiations of the parameters of both the core willow data model and of meadowcap. The WGPS also introduces some additional parameters for private set intersection<!-- and for product-based set reconciliation-->.

Private set intersection requires a type `PsiGroup` whose values are the members of a [finite cyclic groups suitable for key exchanges](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalization_to_finite_cyclic_groups), a type `PsiScalar` of scalars, and a function `psi_scalar_mutiplication(PsiGroup, PsiScalar) -> PsiGroup`. Further, we need *encoding functions* for `PsiGroup` and `PsiScalar`. Finally, we need a function `psi_id_to_group(NamespaceId) -> PsiGroup` that hashes arbitrary *namespace IDs* into `PsiGroup`.

As of writing (October 2023), the [X25519](https://en.wikipedia.org/wiki/Curve25519) elliptic curve is a suitable and secure cryptographic primitive. In terms of its implementation in the popular [libsodium](https://doc.libsodium.org/) library, `PsiGroup` is the type of integers of width `crypto_scalarmult_BYTES`, `PsiScalar` is the type of integers of width `crypto_scalarmult_SCALARBYTES`, and `psi_scalar_mutiplication` is libsodium's `crypto_scalarmult`.

<!-- Product-based set reconciliation requires the ability to hash arbitrary sets of entries into values of a type `Fingerprint` via a function `fingerprint(Set<Entry>) -> Fingerprint`. In order to allow for certain efficient implementation techniques, `fingerprint` is not an arbitrary protocol parameter but is constructed from some other protocol parameters.

First, we require a function `fingerprint_singleton(Entry) -> Fingerprint` that hashes an individual entry into the set `Fingerprint`. This hash function should take into account all aspects of the entry: modifying its *namespace ID*, *subspace ID*, *path*, *timestamp*, *length*, or *hash* should result in a completely different fingerprint.

<aside>The original paper on range-based set reconciliation does not require commutativity, because it only deals with one-dimensional data. In a multidimensional setting, there is no natural total ordering on the data space, so we cannot constrain the order in which the fingerprints of individual items are combined to a non-arbitrary order.</aside>

Second, we require an [associative](https://en.wikipedia.org/wiki/Associative_property), [commutative](https://en.wikipedia.org/wiki/Commutative_property) function `fingerprint_combine(Fingerprint, Fingerprint) -> Fingerprint` with a [neutral element](https://en.wikipedia.org/wiki/Identity_element) `fingerprint_neutral`.

Given these protocol parameters, the function `fingerprint` is defined as follows:

- applying `fingerprint` to the empty set yields `fingerprint_neutral`,
- applying `fingerprint` to a set containing exactly one entry `e` yields `fingerprint_singleton(e)`, and
- applying `fingerprint` to any other set yields the result of applying `fingerprint_singleton` to all members of the set individually and then combining the resulting fingerprints with `fingerprint_combine` (grouping and ordering do not matter because of associativity and commutativity respectively). -->

The final protocol parameters are used by the two peers to collaboratively agree on a random challenge to authenticate their read requests. This requires a natural number `commitment_length`, and a secure hash function `commitment_hash` that produces digests of `commitment_length` many bytes.





The WGPS uses the following types of data handles:

- **namespace handles**: Peers need to inform each other about namespaces they care about, or more precisely, they inform each other about elements of the group used for private set intersection that correspond to the namespaces they care about.
- Other handles will be added to the list as we expand to a feature-complete sync spec.
<!-- - **capability handles**: Peers can notify each other of read capabilities they have. This way, each capability needs to be verified only once, and peers can accompany request of theirs with the handle of a capability that authorizes that request.
- **area of interest handles**: Peers register their *areas of interest* with each other. Registering an *area of interest handle* involves presenting a *capability handle* for a capability that covers the *area of interest*. Reconciliation messages specify their *aaoi* by giving the pair of *area of interest handles* whose intersection is the *aaoi*.
- **payload request handles**: Peers can issue several requests for payloads concurrently. The degree of concurrency and the matching of payload transmissions to payload requests are controlled via handles. -->

The WGPS uses the following logical channels:

- *namespace channel*: Used for controlling the inding of new *namespace handles*.
- Other channels will be added to the list as we expand to a feature-complete sync spec.

<!-- The WGPS uses the following *resources*:

- **reconciliation memory**: Memory for buffering reconciliation messages. When this resource is limited, peers should make progress on reconciliation in a narrow sub-product rather than to keep multiplying the number of concurrent *product fingerprints*. If the peers do not do this, reconciliation can deadlock.
- **entry memory**: Memory for buffering entry-transmission-related messages that arrive outside of set reconciliation. Persisting entries (and their payloads) as they arrive might take longer than reading the bytes from the network. Introducing a resource for receiving entry bytes makes it so that this cannot stall the other protocol functions.
- **namespace count**: Tracks the number of namespace handles.
- **capability count**: Tracks the number of capability handles.
- **capability size**: Tracks the total size of all capabilities for which there are handles.
- **area of interest count**: Tracks the number of area of interest handles.
- **area of interest size**: Tracks the total size of all areas of interest for which there are handles.
- **payload request count**: Tracks the number of payload request handles.
- **payload request size**: Tracks the total size of all payload requests for which there are handles.

It is worth pointing out that these resources are fairly course-grained. Peers cannot, for example, fine-tune which of several products will be reconciled first, or which of several payloads will be transmitted first. This is in the interest of overall simplicity and efficiency: using separate resources for separate payment requests, for example, would introduce some overhead. Willow appliations that require different priorities for different kinds of payloads, for example, if real-time constraints are involved, should use a more specialized communication protocol than the WGPS. -->

## Protocol

The protocol is mostly message-based, with the exception of the first few bytes of communication. To break symmetry, we refer to the peer that initiated the synchronization session as *Alfie*, and the other peer as *Betty*.

Peers might receive invalid messages, both syntactically (i.e., invalid encodings) and semantically (i.e., logically inconsistent messages). In both cases, the peer to detect this behavior must abort the sync session. We indicate such situations by writing that something "is an error". Any message that refers to a fully freed resource handle is an error. More generally, whenever we state that a message must fulfill some criteria, but a peer receives a mesage that does not fulfill these criteria, that is an error.

Before any communication, each peer locally and independently generates a random value `scalar` of type `PsiScalar`. It is used for cryptographic purposes and must thus use a high-quality source of randomness.

<!-- Before any communication, each peer locally and independently generates some random data: a `commitment_length` byte number `nonce`, and a random value `scalar` of type `PsiScalar`. Both are used for cryptographic purposes and must thus use high-quality sources of randomness.

The first eight bytes each peer sends are a big-endian unsigned integer that indicates the maximum payload size for which the other peer may include the payload directly when transmitting an entry. All larger payloads can only be transmitted when explicitly requested.

The next `commitment_length` bytes are `commitment_hash(nonce)`; we call the bytes that a peer received this way its `received_commitment`.

After those initial `8 + commitment_length` bytes per peer, the protocol becomes a purely message-based protocol. There are several kinds of messages, which the peers create, encode as byte strings (the encodings are defined later), and transmit mostly independently from each other. -->

### Message Kinds

We now define the different kinds of messages. When we do not mention the logical channel that messages of a particular kind use, then these messages are control messages that do not belong to any logical channel.

#### BindNamespace

The **BindNamespace** messages let peers bind handles for namespaces. To register the namespace `n`, a peer can either send `psi_scalar_mutiplication(psi_id_to_group(n), scalar)` to submit it into the private set intersection process, or it can simply send `psi_id_to_group(n)` in the open if it does not mind leaking its interest in `n`.

```rust
// This supersedes the `Bind` message of the [resource control document](./resource-control) for namespace handles.
struct BindNamespace {
  // If true, the namespace will be leaked to the other peer even if it does not yet have it.
  is_public: bool,
  // If `is_public`, this should be `psi_id_to_group(n)`, else `psi_scalar_mutiplication(psi_id_to_group(n), scalar)`.
  group_member: PsiGroup,
}
```

The data bound to the *namespace handle* that this message registers consists of the `group_member` and a value of type `PsiState` (an enum of three variants `Public`, `PrivateIncomplete`, and `PrivateComplete`): `Public` if `is_public` and `PrivateIncomplete` otherwise.

Each *BindNamespace* message uses the *namespace channel*.

#### PsiReply

The **PsiReply** messages let peers complete the private set intersection process for a single namespace. The message references a prior non-public namespace handle and replies with the scalar product of that handle's `group_member` and the sender's *scalar*. The receiver then updates the `group_member` of the handle in question to the `group_member` from the `PsiReply` message, and updates the *psi state* of the handle to `PrivateComplete`.

```rust
// This supersedes the `Bind` message of the [resource control document](./resource-control) for namespace handles.
struct PsiReply {
  // The handle refers to a namespace binding that was bound by the receiver of this message.
  // It must be a handle whose `BindNamespace` message had set `is_public` to `false`.
  // At most one `PsiReply` message may be sent for any one handle.
  handle: u64,
  // `psi_scalar_mutiplication(previous, scalar)`, where `previous` is the `group_member` of the handle, and `scalar` is the scalar value that the sending peer chose during session initialization.
  group_member: PsiGroup,
}
```

Intuitively, this message corresponds to mixing in the third color in our color mixing metaphor.

Taken together, `BindNamespace` and `PsiReply` implement private set intersection (and a way to bypass it via the `is_public` flag). Future messages that wish to reference a namespace id, do so by either specifying a single namespace handle of *psi state* `Public`, or by a specifying a pair of namespace handles (one bound by each peer), both of *psi state* `PrivateComplete` and of the same `group_member`.

*PsiReply* messages do not use any logical channel.

<!-- #### RevealCommitment

The **RevealCommitment** messages let peers determine the challenge they will use to validate read capabilities. This message must be sent at most once by each peer, and it *should* be sent immediately after receiving the `received_commitment` but not before.

A *RevealCommitment* message consists of `commitment_length` bytes. If these do not hash to the `received_commitment`, this is an error. Otherwise, set `challenge` to the xor of the received bytes and `nonce`. If the peer is Betty, flip every bit of `challenge`.

A peer may not send any of the subsequent message kinds before having sent its *RevealCommitment* message, unless explicitly stated otherwise.

#### RegisterCapability

The **RegisterCapability** messages let peers register handles for read capabilities.

A *RegisterCapability* message consists of a read *capability*, and a `signature` of type `AuthorSignature` over the `challenge`, issued by the *receiver* of the capability. Crucially, the encoding of the capability omits the *namespace IDs* of source capabilities. Instead, the *RegisterCapability* message contains *namespace handles* to identify the namespace: either a single handle of the sending peer to a namespace whose state is `Public`, or a pair of handles (one of the sending peer, one of the receiving peer) to two namespaces with identical group values and both of state `PrivateComplete`.

A *BindNamespace* message costs one *capability count* resource, and `n` *capability size* resources, where `n` is the size of the encoded capability (TODO make more precise).

#### RegisterAreaOfInterest

The **RegisterAreaOfInterest** messages let peers register handles for areas of interest.

A *RegisterAreaOfInterest* message consists of an *area of interest*, and a *capability handle* of the sending peer to a capability whose *granted product* fully contains the area of interest.

A *RegisterAreaOfInterest* message costs one *area of interest count* resource, and `n` *area of interest size* resources, where `n` is the size of the encoded area of interest (TODO make more precise).

#### Eagerness

The **Eagerness** messages let peers implement the [plumtree algorithm](https://repositorium.sdum.uminho.pt/bitstream/1822/38894/1/647.pdf).

An *Eagerness* message consists of a pair of *area of interest handles* (one of the sending peer, one of the receiving peer) with a non-empty intersection, and a boolean `is_eager`. If `is_eager`, the receiving peer should prefer to immediately transmit the payloads of any entries (below the maximum payload size threshold) in the intersection of the two areas of interest, otherwise it should prefer to transmit only the hash of the payloads. For intersections for which no *Eagerness* messages have been sent, peers should always prefer to transmit only the hash of the payloads.

#### ProductItemSet

The **ProductItemSet** messages let peers exchange entries in the context of product-based set reconciliation.

A *ProductItemSet* message consists of a single *product item set*. Peers may only send *ProductItemSet* messages whose 3d product is fully contained in a read capability of the receiver. The encoding layer enforces this by specifying the *3d product* of the *product items set* relative to the intersection of a pair of *area of interest handles* (one of the sending peer, one of the receiving peer).

A *ProductItemSet* message costs `n` *reconciliation memory* resources, where `n` is the size of the encoded message (TODO make more precise).

#### ProductFingerprint

The **ProductFingerprint** messages let peers detect fully reconciled products in the context of product-based set reconciliation.

A *ProductFingerprint* message consists of a single *product fingerprint*. Peers may only send *ProductFingerprint* messages whose 3d product is fully contained in a read capability of the receiver. The encoding layer enforces this by specifying the *3d product* of the *product fingerprint* relative to the intersection of a pair of *area of interest handles* (one of the sending peer, one of the receiving peer).

A *ProductFingerprint* message costs `n` *reconciliation memory* resources, where `n` is the size of the encoded message (TODO make more precise).

#### ProductAcknowledgment

The **ProductAcknowledgment** messages let peers explicitly acknowledge that no further work needs to be done to reconcile some 3d product.

A *ProductAcknowledgment* message consists of a single *3d product*. Peers may only send *ProductAcknowledgment* messages whose 3d product is fully contained in a read capability of the receiver. The encoding layer enforces this by specifying the *3d product* of the *3d product* relative to the intersection of a pair of *area of interest handles* (one of the sending peer, one of the receiving peer).

A *ProductAcknowledgment* message costs `n` *reconciliation memory* resources, where `n` is the size of the encoded message (TODO make more precise).

#### EntryPush

The **EntryPush** messages let peers transmit entries without prior product-based set reconciliation.

An *EntryPush* message consists of a single *entry*. Peers may only send *EntryPush* messages whose entry is contained in a read capability of the receiver.

An *EntryPush* message costs `n` *entry memory* resources, where `n` is the size of the encoded message (TODO make more precise).

#### RequestPayload

The **RequestPayload** messages let peers register *payload request handles*.

A *RequestPayload* message consists of an entry, an offset `o` starting from which the payload should be transmitted, and an expected hash for the first `o` bytes of type `Digest`. Peers may only request entries that are contained in a read capability of the receiver.

A *RequestPayload* message costs one *payload request count* resource, and `n` *payload request size* resources, where `n` is the length in bytes of the path of the entry.

#### ReplyPayload

The **ReplyPayload** messages let peers answer payload requests.

<aside>If a peer does not have a requested payload and will not obtain it in the future either, it simply frees the handle of the request in question.</aside>

A *ReplyPayload* message consists of a payload request handle, and either of some payload bytes for that request, or the information that the prefix specified with the request does not match.

A *ReplyPayload* message costs `n` *entry memory* resources, where `n` is the size of the encoded message (TODO make more precise). -->

### Resource Control Messages

The remaining messages implement the logical channel management and handle management outlined in the [resource control document](./resource-control). All of these are control messages, that is, they do not belong to any logical channel themselves. The `Bind` message from the resource control document does not appear here, as we have defined explicit messages for binding specific handle types that supersede the generic formulation of the `Bind` message.

We define the following types to explicitly select logical channels and binding types:

```rust
enum LogicalChannel {
  Namespace,
  // More channel types will be defined as we expand to a feature-complete sync spec.
}

enum BindingType {
  Namespace,
  // More binding types will be defined as we expand to a feature-complete sync spec.
}
```

The remaining message kinds are taken one-to-one from the [resource control document](./resource-control), we list them here for completeness.

```rust
// Backpressure for logical channels

// The server makes a binding promise of available buffer capacity to the client.
Guarantee {
    amount: u64,
    channel: LogicalChannel,
},
// The client allows the server to reduce its total buffer capacity by `amount`.
Absolve {
    amount: u64,
    channel: LogicalChannel,
},
// The server asks the client to send an `Absolve` message such that the remaining buffer capacity will be `target`.
Oops {
    target: u64,
    channel: LogicalChannel,
},
// The server notifies the client that it has started dropping messages and will continue to do so until it receives an `Apology` message. Note that the server must send any outstanding guarantees of the channel before sending a `StartedDropping` message.
StartedDropping {
    channel: LogicalChannel,
},
// The client notifies the server that it can stop dropping messages of this channel.
Apology {
    channel: LogicalChannel,
},

// Handle handling

// A peer asks the other peer to free a handle.
Free {
    handle: u64,
    mine: bool, // true if the peer sending this message is the one who created the binding, false otherwise. This is needed for symmetric protocols where both peers act as both client and server and issue handles to the same types of resources.
    handle_type: BindingType,
},
// The server confirms that it has successfully processed the `number` oldest `Bind` messages.
Confirmation {
    number: u64,
    handle_type: BindingType,
},
// The server notifies the client that it has started dropping messages that refer to handles greater than or equal to `at` and will continue to do so until it receives an `Apology` message.
StartedDropping {
    at: u64,
    handle_type: BindingType,
},
// The client notifies the server that it can stop dropping messages that refer to handles greater than or equal to `at`. Note that the server will only accept apologies for the least handle (of the hadle type in question) for which it has sent a `StartedDropping` request.
Apology {
    at: u64,
    handle_type: BindingType,
},
```

*/