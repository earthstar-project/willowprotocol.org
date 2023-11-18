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
            def({ id: "aoi", singular: "area of interest", plural: "areas of interest"}),
            def({ id: "aoi_empty", singular: "empty"}),
            def({ id: "aoi_intersection", singular: "intersection"}),
            def({ id: "aoi_count_limit", singular: "count limit"}),
            def({ id: "aoi_size_limit", singular: "size limit"}),
            def({ id: "encoding_function", singular: "encoding function" }),
        ]),
    ],
);

// Peers need not synchronize full namespaces, they can specify parts of namespaces to synchronize instead. Essentially, both peers announce which data regions they are interested in, and then they perform data reconciliation on the intersection of these regions. This section describes which kinds of regions can be expressed.

// We call such a region an **area of interest**. The basis of every *area of interest* is a *3d product* (the same as those defined in the [meadowcap spec](./meadowcap)). This 3d product can be supplemented with additional constraints based on resource limits. For example, a peer can express that it only cares about the 100 newest (by timestamp) entries in some 3d product. We allow this additional expressivity so that resource-constrained peers that can only keep a fixed-size sliding window of entries can make meaningful requests that don't require them to throw away most of the response.

// More precisely, for each of the three dimensions (timestamp, path, subspace ID), an *area of interest* has an optional **count limit** and an optional **size limit**. A *count limit* of `cl` in dimension `d` restricts the *area of interest* to the `cl` many entries in the *3d product* that are greatest with respect to the dimension `d`. A *size limit* of `sl` in dimension `d` restricts the *area of interest* to the greatest (with respect to `d`) entries in the *3d product* whose accumulated *payload length* does not exceed `sl`. 

// <hidden>drawing</hidden>

// The various *count limits* and *size limits* of an *area of interest* are conjunctive. For example, if there is both a *timestamp count limit* `tcl` and a *timestamp size limit* `tsl`, the sizes of the payloads of the matched entries will add up to at most `tsl` *and* there can be at most `tcl` many entries. Similarly, if there is both a *timestamp count limit* `tcl` and a *path count limit* `pcl`, and entry needs to be among the `tcl` many entries with the greatest timestamps *and* among the `pcl` many entries with the greatest paths.

// <hidden>drawing</hidden>

// The **intersection** of two *areas of interest* consists of the *intersection* of their *3d products*, and the combined limits of both. If the same kind of limit occurs in both, the *intersection* uses the stricter (numerically lesser) limit.

// <hidden>drawing</hidden>

// Peers need only abide limits on a best-effort basis. Strict enforcement would not make any sense: imagine Betty has just transmitted her 100 newest entries to Alfie, only to then receive an even newer entry from Gemma. Betty should forward that entry to Alfie of course, despite that putting her total number of transmissions above the limit of 100.