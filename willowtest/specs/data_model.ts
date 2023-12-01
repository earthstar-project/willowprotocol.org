import { Rs, def, preview_scope, r, rs } from "../../defref.ts";
import { code, em, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale } from "../../marginalia.ts";
import { Expression } from "../../tsgen.ts";
import { def_parameter, link, lis, pinformative, site_template } from "../main.ts";

export const data_model: Expression = site_template(
    {
        title: "Willow Data Model",
        name: "data_model",
    },
    [
        pinformative("At its essence, Willow is a system for naming pieces of data. Names are ", em("hierarchical"), " to allow for meaningful grouping of data. Name management is decentralized and local-first, ideally suited for ", em("peer-to-peer"), " applications. The naming process includes a flexible ", em("authentication"), " process, to prevent unwanted interference with your data."),

        hsection("willow_parameters", "Preliminaries", [
            pinformative("An instantiation of Willow must define concrete choices of the following parameters:"),

            preview_scope(
                lis(
                    ["a natural number ", def_parameter("max_path_length"), " that denotes the maximum length of ", rs("path"), " (defined later),"],
                    ["sets ", def_parameter("NamespaceId"), ", ", def_parameter("SubspaceId"), ", ", def_parameter("AuthorizationToken"), ","],
                    ["a function ", def_parameter("hash_payload"), " from bytestrings to some fixed, ", link("totally ordered", "https://en.wikipedia.org/wiki/Total_order"), " domain ", def_parameter("Digest"), ", and"],
                    ["a function ", def_parameter("is_authorized_write"), " from pairs of an ", r("entry"), " (defined later) and an ", r("AuthorizationToken"), " to booleans."],
                ),
            ),            
        ]),

        hsection("data_model_concepts", "Concepts", [
            pinformative("A ", def("namespace"), " is a collaboratively maintained, mutable key-value mapping. Every ", r("namespace"), " is identified by a ", def({ id: "namespace_id", singular: "namespace id" }), " of type ", r("NamespaceId"), ". ", Rs("namespace"), " can be modified concurrently by different authors, hence they only exist as an abstraction, not as actual data structures at particular locations."),

            pinformative("A ", def("store"), " is a snapshot of a ", r("namespace"), " at a particular moment in (distributed) time, usually backed by a persistent database. More precisely, a ", r("store"), " is a collection of ", rs("authorized_entry"), ". An ", def({ id: "authorized_entry", singular: "authorized entry", plural: "authorized entries" }), " consists of an ", r("entry"), " (to be defined later), and an ", def({ id: "authorization_token", singular: "authorization token" }), " of type ", r("AuthorizationToken"), " such that ", r("is_authorized_write"), " returns ", code("true"), " when given the ", r("entry"), " and the ", r("authorization_token"), "."),

            pinformative("An ", def({ id: "entry", singular: "entry", plural: "entries" }), " is a pair of a ", r("record_identifier"), " and a ", r("record"), "."),

            pinformative("A ", def({ id: "record_identifier", singular: "record identifier" }), " is a triplet of"),

            preview_scope(
                lis(
                    ["the ", r("namespace_id"), " of the namespace to which the ", r("entry"), " belongs,"],
                    ["the ", def({id: "subspace_id", singular: "subspace id"}), ", which is of type ", r("SubspaceId"), ", and"],
                    ["the ", def("path"), ", a bytestring of at most ", r("max_path_length"), " bytes."],
                ),
            ),

            pinformative("A ", def("record"), " is a triplet of"),

            preview_scope(
                lis(
                    ["the ", def("timestamp"), ", which is a 64 bit integer (interpreted as microseconds since the Unix epoch),", marginale(["Willow's use of wall-clock timestamps may come as a surprise. We are cognisant of their limitations, and use them anyway. To learn why, please see ", link_name("timestamps_really", "Timestamps, really?")])],
                    ["the ", def({id: "payload_length", singular: "payload length"}), ", a 64 bit unsigned integer, and"],
                    ["the ", def({ id: "payload_hash", singular: "payload hash", plural: "payload hashes" }), ", of type ", r("Digest"), "."],
                ),
            ),

            pinformative("The ", r("payload_length"), " and ", r("payload_hash"), " of a ", r("record"), " are intended to be the length of some bytestring and its digest using the ", r("hash_payload"), " function. We call this bytestring the ", def("payload"), " of the ", r("record"), "."),
        ]),

        hsection("data_model_sync", "Store Synchronization", [
            pinformative("Willow is designed for local-first peer-to-peer systems. Each peer maintains a local ", r("store"), " for each ", r("namespace"), " they are interested in. When two peers communicate, they exchange information until the both arrive at the same new, more up-to-date ", r("store"), ". This resulting ", r("store"), " is called the ", def({id: "store_join", singular: "join"}), " of their two starting ", rs("store"), " and is defined next."),

            pinformative("Stores form a ", link("join semi-lattice", "https://en.wikipedia.org/wiki/Semilattice"), " (also known as a ", link("state-based CRDT", "https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#State-based_CRDTs"), ") using the ", r("store_join"), " operation described below. Conceptually, the state of a ", r("namespace"), " at any one point in time is the ", r("store_join"), " of all its ", rs("store"), " at that point in time."),

            pinformative("A ", def("join"), " takes ", rs("store"), " ", code("r1"), " and ", code("r2"), ", all of whose ", rs("entry"), " have the same ", r("namespace_id"), ", and deterministically maps these inputs to a new ", r("store"), " ", code("r"), " as follows:"),

            lis(
                [code("r"), " starts as the union of the ", rs("authorized_entry"), " of ", code("r1"), " and ", code("r"), "."],
                ["Then, remove all ", rs("entry"), " with a ", r("path"), " ", code("p"), " whose ", r("timestamp"), " is strictly less than the ", r("timestamp"), " of any other ", r("entry"), " of the same ", r("subspace_id"), " whose ", r("path"), " is a prefix of ", code("p"), "."],
                ["Then, for each set of ", rs("entry"), " with equal ", rs("subspace_id"), ", equal ", rs("path"), ", and equal ", rs("timestamp"), ", remove all but those whose ", r("record"), " has the greatest ", r("payload_hash"), " component (according to the total order on ", r("Digest"), ")."],
                ["Then, for each set of ", rs("entry"), " with equal ", rs("subspace_id"), ", equal ", rs("path"), ", equal ", rs("timestamp"), ", and equal ", rs("payload_hash"), ", remove all but those whose ", r("record"), " has the greatest ", r("payload_length"), " component."],
            ),
        ]),

        hsection("3d_space", "Entries in 3d Space", [
            pinformative("WIP"),

            def({ id: "3d_product", singular: "3d-product" }),
            def({ id: "product_contain", singular: "contain" }),
        ]),
    ],
);

/*

In this document, we define the core data model of willow.

Willow is a system for giving meaningful, hierarchical names to arbitrary sequences of bytes, not unlike a filesystem. For example, you might give the name `["blog", "recipes", "mustard_pasta"]` to the bytestring `"This must be delicious."`. Unlike a typical file system, entries of this kind can be efficiently shared with other users.

At a later point you might change your mind about mustard pasta, overwriting the old entry at `["blog", "recipes", "mustard_pasta"]` with `"Tried it, not good."`. Willow keeps the timestamp of each assignment, the new entry overwrites the old one.

If you wanted to hide that you ever considered mustard pasta in the first place, you can overwrite `["blog", "recipes"]` to remove *all* entries below it. Think of it as overwriting a directory in a file system with an empty file. We call this mechanism prefix-based deletion.

Things would be rather chaotic if everyone wrote to the same blog. Instead, entries live in separate *subspaces* — intuitively, each user writes to their own, separate universe of data. Willow allows for a multitude of ways of controlling who gets to write to which subspace, from simple per-user access control to sophisticated capability systems.

Willow further allows the grouping of subspaces into completely independent *namespaces*. Data from a public wiki should live in a separate namespace than data from a photo-sharing application for my family. Some namespaces should allow anyone to set up subspaces within them, others might require authorization from a trusted manager. Willow offers a flexible mechanism for pluggin in different such policies on a per-namespace basis.

This is a full overview of willow: applications read and write data in and to subspaces, using hierarchical paths. Willow tracks timestamps of write operations, allow newer writes to replace older writes in the manner of a traditioal file system. These data collctions live in namespaces; read and write access to both namespaces and subspaces can be controlled through a variety of policies.

Now we can delve into the precise definition of these concepts.

*/