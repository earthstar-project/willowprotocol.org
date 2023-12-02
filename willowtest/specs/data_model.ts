import { Rs, def, def_fake, preview_scope, r, rs } from "../../defref.ts";
import { code, em, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { $, $dot } from "../../katex.ts";
import { link_name } from "../../linkname.ts";
import { marginale, marginale_inlineable, sidenote } from "../../marginalia.ts";
import { Struct, hl_builtin, pseudocode } from "../../pseudocode.ts";
import { Expression } from "../../tsgen.ts";
import { def_parameter, link, lis, path, pinformative, site_template } from "../main.ts";

export const data_model: Expression = site_template(
    {
        title: "Willow Data Model",
        name: "data_model",
    },
    [
        pinformative("In this document, we define the core data model of Willow."),

        pinformative("Willow is a system for giving meaningful, hierarchical names to arbitrary sequences of bytes (called ", em("payloads"), "), not unlike a filesystem. For example, you might give the name ", path("blog", "recipes", "mustard_pasta"), " to the bytestring ", code("Sounds delicious"), ". Unlike a typical file system, entries of this kind can be efficiently shared with other users."),

        pinformative("At a later point you might change your mind about mustard pasta, overwriting the old entry at path ", path("blog", "recipes", "mustard_pasta"), " with ", code("Tried it, not good"), ". Willow tracks the timestamp of each assignment, the new entry overwrites the old one."),

        pinformative("If you wanted to hide that you ever considered mustard pasta in the first place, you could overwrite the path ", path("blog", "recipes"), " to remove ", em("all"), " entries below it. Think of it as overwriting a directory in a file system with an empty file. We call this mechanism ", em("prefix-based deletion"), "."),

        pinformative("Things would be rather chaotic if everyone wrote to the same blog. Instead, entries live in separate ", em("subspaces"), " — intuitively, each user writes to their own, separate universe of data. Willow allows for various ways of controlling who gets to write to which subspace, from simple per-user access control to sophisticated capability systems."),

        pinformative("Willow further allows the aggregation of subspaces into completely independent ", em("namespaces"), ". Data from a public wiki should live in a separate namespace than data from a photo-sharing application for my family. Some namespaces should allow anyone to set up subspaces within them, others might require authorization from a trusted manager. Willow offers a flexible mechanism for using different policies on a per-namespace basis."),

        pinformative("This constitutes a full overview of the data model of Willow. Applications read and write payloads from and to subspaces, addressing via hierarchical paths. Willow tracks timestamps of write operations, newer writes replace older writes in the manner of a traditional file system. These data collections live in namespaces; read and write access to both namespaces and subspaces can be controlled through a variety of policies."),

        pinformative("Now we can ", em("almost"), " delve into the precise definition of these concepts."),

        hsection("willow_parameters", "Parameters", [
            pinformative("Some questions in protocol design have no clear-cut answer. Should namespaces be identified via human-readable strings, or via the public keys of some digital signature scheme? That depends entirely on the use-case. To sidestep such questions, the Willow data model is ", em("generic"), " over certain choices of parameters. You can instantiate Willow to use strings as the identifiers of namespaces, or you could have it use 256 bit integers, or urls, or iris scans, etc."),

            pinformative("This makes Willow a higher-order protocol: you supply a set of specific choices for its parameters, and in return you get a concrete protocol that you can then use. If different systems instantiate Willow with non-equal parameters, the results will not be interoperable, even though both systems use Willow."),

            pinformative(marginale(["We give precise semantics to these parameters in the spec proper, the list need not fully make sense on the first read-through."]), "An instantiation of Willow must define concrete choices of the following parameters:"),

            lis(
                [
                    "A type ", def_parameter("NamespaceId", "NamespaceId", ["A protocol parameter, the type of ", rs("namespace_id"), "."]), " for identifying namespaces."
                ],
                [
                    "A type ", def_parameter("SubspaceId", "SubspaceId", ["A protocol parameter, the type of ", rs("subspace_id"), "."]), " for identifying subspaces."
                ],

                [
                    "A natural number ", def_parameter("max_component_length", "max_component_length", ["A protocol parameter, the maximal length of individual ", r("path"), " components."]), " for limiting the length of path components.",
                ],
                [
                    "A natural number ", def_parameter("max_component_count", "max_component_count", ["A protocol parameter, the maximal number of components (bytestrings) in a single ", r("path"), "."]), " for limiting the number of path components.",
                ],
                [
                    "A natural number ", def_parameter("max_path_length", "max_path_length", ["A protocol parameter, the maximal sum of the lengths of the components (bytestrings) of a single ", r("path"), " in bytes."]), " for limiting the overall size of paths.",
                ],

                [
                    "A ", link("totally ordered", "https://en.wikipedia.org/wiki/Total_order"), " set ", def_parameter("PayloadDigest", "PayloadDigest", ["A protocol parameter, the totally ordered type of ", rs("payload_digest"), "."]), " for ", link("content-addressing", "https://en.wikipedia.org/wiki/Content_addressing"), " the data that Willow stores."
                ],
                [
                    marginale(["Since this function provides the only way in which willow tracks payloads, you probably want to use a ", link("secure hash function", "https://en.wikipedia.org/wiki/Secure_hash_function"), "."]),
                    "A function ", def_parameter("hash_payload", "hash_payload", ["A protocol parameter, a function for computing ", rs("payload_digest"), " from ", rs("payload"), "."]), " that maps bytestrings (of length at most ", $("2^{64} - 1", ")"), " into ", r("PayloadDigest"), "."
                ],

                [
                    "A type ", def_parameter("AuthorizationToken", "AuthorizationToken", ["A protocol parameter, required to define ", rs("possibly_authorized_entry"), "."]), " for proving write permission."
                ],
                [
                    marginale([link_name("meadowcap", "Meadowcap"), " is our bespoke capability system for handling authorization. But any system works, as long as it defines a type of ", rs("AuthorizationToken"), " and an ", r("is_authorized_write"), " function."]), "A function ", def_parameter("is_authorized_write", "is_authorized_write", ["A protocol parameter, required to define ", rs("authorized_entry"), "."]), " that maps an ", r("entry"), " (defined later) and an ", r("AuthorizationToken"), " to a boolean, indicating whether the ", r("AuthorizationToken"), " does prove write permission for the ", r("entry"), "."
                ],
            ),
        ]),

        hsection("data_model_concepts", "Concepts", [
            pinformative("Willow can store arbitrary bytestrings of at most ", $("2^{64} - 1"), " bytes. We call such a bytestring a ", def("payload", "payload", ["A ", def_fake("payload"), " is a bytestring of at most ", $("2^{64} - 1"), " bytes."]), "."),

            pinformative("A ", def("path"), " is a sequence of at most ", r("max_component_count"), " many bytestrings, each of at most ", r("max_component_length"), " bytes, and whose total number of bytes is at most ", r("max_path_length"), "."),

            preview_scope(
                p("The metadata associated with each ", r("payload"), " is called an ", def({id: "entry", plural: "entries"}), ":"),

                pseudocode(
                    new Struct({
                        id: "Entry",
                        comment: ["The metadata for storing a ", r("payload"), "."],
                        fields: [
                            {
                                id: "namespace_id",
                                comment: ["The identifier of the ", r("namespace"), " to which the ", r("entry"), " belongs."],
                                rhs: r("NamespaceId"),
                            },
                            {
                                id: "subspace_id",
                                comment: ["The identifier of the ", r("subspace"), " to which the ", r("entry"), " belongs."],
                                rhs: r("SubspaceId"),
                            },
                            {
                                id: "entry_path",
                                comment: ["The ", r("path"), " to which the ", r("entry"), " was written."],
                                rhs: r("path"),
                            },
                            {
                                id: "timestamp",
                                comment: ["The time in microseconds since the ", link("Unix epoch", "https://en.wikipedia.org/wiki/Unix_epoch"), " at which the ", r("entry"), " is claimed to have been created."],
                                marginale: ["Willow's use of wall-clock timestamps may come as a surprise. We are cognisant of their limitations, and use them anyway. To learn why, please see ", link_name("timestamps_really", "Timestamps, really?")],
                                rhs: hl_builtin("u64"),
                            },
                            {
                                id: "payload_digest",
                                comment: ["The result of applying ", r("hash_payload"), " to the ", r("payload"), "."],
                                rhs: r("PayloadDigest"),
                            },
                            {
                                id: "payload_length",
                                comment: ["The length of the ", r("payload"), " in bytes."],
                                rhs: hl_builtin("u64"),
                            },
                        ],
                    }),
                ),
            ),

            pinformative("A ", def({id: "possibly_authorized_entry", singular: "possibly authorized entry", plural: "possibly authorized entries"}), " is a pair of an ", r("entry"), " and an ", r("AuthorizationToken"), ". An ", def({id: "authorized_entry", singular: "authorized entry", plural: "authorized entries"}), " is a ", r("possibly_authorized_entry"), " for which ", r("is_authorized_write"), " returns ", code("true"), "."),

            pinformative(marginale([path("a"), " is a ", r("path_prefix"), " of ", path("a"), " and of ", path("a", "b"), ", but not of ", path("ab"), "."]), "A ", r("path"), " ", code("s"), " is a ", def({id: "path_prefix", singular: "prefix", plural: "prefixes"}), " of a ", r("path"), " ", code("t"), " if the first items (that is, bytestrings) of ", code("t"), " are exactly the items of ", code("s"), "."),

            pinformative("We can now formally define which ", rs("entry"), " overwrite each other and which can coexist. ", preview_scope("A ", def("store"), " is a set of ", rs("authorized_entry"), " such that", lis(
                ["all its ", rs("entry"), " have the same ", r("namespace_id"), ", and"],
                ["there are no two of its ", rs("entry"), " ", code("old"), " and ", code("new"), " such that", lis(
                    [code("old"), " and ", code("new"), " have equal ", rs("subspace_id"), ", and"],
                    ["the ", r("path"), " of ", code("new"), " is a ", r("path_prefix"), " of ", code("old"), ", and", lis(
                        ["the ", r("timestamp"), " of ", code("old"), " is strictly less than that of ", code("new"), ", or"],
                        ["the ", r("timestamp"), " of ", code("old"), " is equal to that of ", code("new"), " and the ", r("payload_digest"), " of ", code("old"), " is strictly ", sidenote("less", ["We require ", r("PayloadDigest"), " to be ", link("totally ordered", "https://en.wikipedia.org/wiki/Total_order"), " because of this comparison."]), " than that of ", code("new"), ", or"],
                        ["the ", r("timestamp"), " of ", code("old"), " is equal to that of ", code("new"), " and the ", r("payload_digest"), " of ", code("old"), " is equal to that of ", code("new"), " and the ", r("payload_length"), " of ", code("old"), " is strictly less than that of ", code("new"), "."],
                    )],
                )],
            ))),

            pinformative(
                marginale(["When two peers connect and wish to update each other, they compute the ", rs("store_join"), " of all their ", rs("store"), " with equal ", r("namespace_id"), ". Doing so efficiently can be quite challenging, we recommend our ", link_name("sync", "Willow General Purpose Sync"), " protocol."]),
                marginale(["Formally, adding a new ", r("entry"), " to a ", r("store"), " consists of computing the ", r("store_join"), " of the original ", r("store"), " and a singleton ", r("store"), " containing only the new ", r("entry"), "."]),
                
                "The ", def({id: "store_join", singular: "join"}), " of two ", rs("store"), " ", code("r1"), " and ", code("r2"), " that store ", rs("entry"), " of the same ", r("namespace_id"), " is the ", r("store"), " obtained as follows:", lis(
                ["Starts with the union of ", code("r1"), " and ", code("r2"), "."],
                ["Then, remove all ", rs("entry"), " with a ", r("path"), " ", code("p"), " whose ", r("timestamp"), " is strictly less than the ", r("timestamp"), " of any other ", r("entry"), " of the same ", r("subspace_id"), " whose ", r("path"), " is a prefix of ", code("p"), "."],
                ["Then, for each subset of ", rs("entry"), " with equal ", rs("subspace_id"), ", equal ", rs("path"), ", and equal ", rs("timestamp"), ", remove all but those with the greatest ", r("payload_digest"), "."],
                ["Then, for each subset of ", rs("entry"), " with equal ", rs("subspace_id"), ", equal ", rs("path"), ", equal ", rs("timestamp"), ", and equal ", rs("payload_digest"), ", remove all but those with the greatest ", r("payload_length"), "."],
                ),
            ),

            pinformative(preview_scope("A ", def("namespace"), " is the ", r("store_join"), " over ", sidenote("all", ["No matter in which order and groupings the ", rs("store"), " are ", r("store_join", "joined"), " the result is always the same. ", Rs("store"), " form a ", link("join semi-lattice", "https://en.wikipedia.org/wiki/Semilattice"), " (also known as a ", link("state-based CRDT", "https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#State-based_CRDTs"), ") under the ", r("store_join"), " operation."]), " ", rs("store"), " with ", rs("entry"), " of a given ", r("namespace_id"), ". Note that this concept only makes sense as an abstract notion, since no participant in a distributed system can ever be certain that it has (up-to-date) information about all existing ", rs("store"), "."), " ", preview_scope("A ", def("subspace"), " is the set of all ", rs("entry"), " of a given ", r("subspace_id"), " in a given ", r("namespace"), ".")),
        ]),

        hsection("data_further", "Further Reading", [
            pinformative("The Willow data model stays fairly compact by deliberately sidestepping some rather important questions. In this section, we point to our answers for the most important ones."),

            pinformative("How can we precisely delimit meaningful groups of ", rs("entry"), ", for example, all recipes that Alex posted on their blog in the past three months? Grouping ", rs("entry"), " always incurs a tradeoff between ", em("expressivity"), " (which sets of ", rs("entry"), " can be characterized) and ", em("efficiency"), " (how quickly a database can retrieve all its ", rs("entry"), " of an arbitrary grouping). We present a carefully crafted selection of ways of grouping ", rs("entry"), " ", link_name("grouping_entries", "here"), "."),

            pinformative("How should we encode the concepts of Willow for storage or network transmission? Due to the parameterized nature of Willow, there can be no overarching answer, but we cover some recurring aspects of the question ", link_name("encodings", "here"), "."),

            pinformative("How should we select the ", r("AuthorizationToken"), " and ", r("is_authorized_write"), " parameters? Different deployments of Willow will have different needs. We provide ", link_name("meadowcap", "Meadowcap"), ", a capability-based solution that should be suitable for most use-cases."),

            pinformative("How do we efficiently and securely compute ", rs("store_join"), " over a network to synchronize data between peers? Again, different settings require different answers, but we provide the ", link_name("sync", "Willow General Purpose Sync"), " protocol as a well-engineered, privacy-preserving solution that should be applicable to a wide range of scenarios."),

            pinformative("How can we encrypt ", rs("entry"), " while retaining the semantics of the original, unencrypted data? This question lies at the heart of end-to-end encryption for Willow, and we discuss our findings ", link_name("e2e", "here"), "."),
        ]),
    ],
);
