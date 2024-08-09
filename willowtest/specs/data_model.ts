import { def, preview_scope, r, Rs, rs } from "../../defref.ts";
import { code, em, figcaption, figure, img, p } from "../../h.ts";
import { hsection, table_of_contents } from "../../hsection.ts";
import { $ } from "../../katex.ts";
import { link_name } from "../../linkname.ts";
import { marginale, sidenote } from "../../marginalia.ts";
import { asset } from "../../out.ts";
import {
  def_fake_type,
  def_type,
  field_access,
  pseudocode,
  Struct,
} from "../../pseudocode.ts";
import { Expression } from "macro";
import {
def_parameter_fn,
  def_parameter_type,
  def_parameter_value,
  def_value,
  link,
  lis,
  path,
  pinformative,
  site_template,
} from "../main.ts";

export const data_model: Expression = site_template(
  {
    title: "Willow Data Model",
    name: "data_model",
    status: "final",
  },
  [    
    pinformative("In this document, we define the core data model of Willow."),

    table_of_contents(7),

    pinformative("Willow is a system for giving meaningful, hierarchical names to arbitrary sequences of bytes (called ", em("payloads"), "), not unlike a filesystem. For example, you might give the name ", path("blog", "idea", "1"), " to the bytestring ", code("Dear reader, I've got a great idea"), "."),

    pinformative("You also give the name ", path("blog", "idea", "2"), " to the bytestring ", code("(watch this space)"), "."),

    figure(img(asset("data_model/paths.png"), `A (one-dimensional) list containing the two paths "blog/idea/1" and "blog/idea/2", with a stylised file next to each path. Idea 1 shows a lightbulb, idea 2 shows a deeply smug expression.`)),

    pinformative("A little later you overwrite the existing entry at path ", path("blog", "idea", "2"), " with ", code("I've made a mistake"), ". Willow tracks the timestamp of each assignment, and the new entry overwrites the old one."),

    figure(img(asset("data_model/timestamps.png"), "The same visualization of paths as before, but now with second dimension, a time axis. The smug-faced file disappears in the first time step, being replaced by a sweating face at a second timestep.")),

    pinformative("That night you decide it would be best if everyone forgot about the whole thing. By writing a new entry at ", path("blog", "idea"), ", our previous entries are deleted. Think of it as overwriting a directory in a file system with an empty file. We call this mechanism ", def({id: "prefix_pruning", singular: "prefix pruning"}), "."),

    figure(
      img(asset("data_model/prefix_pruning.png"), `The same visualization as before, but both paths and files got deleted by adding the third path "blog/idea" with a stylised file whistling in a totally inconspicuous way.`),
      figcaption("The entries ", em("prefixed"), " by ", path('blog', 'idea'), " are deleted by a newer entry at that prefix.")
    ),

    pinformative("Things would be rather chaotic if everyone wrote to the same blog. Instead, entries live in separate ", em("subspaces"), " — intuitively, each user writes to their own, separate universe of data. Willow allows for various ways of controlling who gets to write to which subspace, from simple per-user access control to sophisticated capability systems."),

    figure(
      img(asset("data_model/subspaces.png"), `Stylised files with friendly icons arranged in a now three-dimensional space. Adding to the path and time dimensions of the preceeding drawings, a depth dimension shows three different people to signify different subspaces. They look happy, one waves to the viewer, good vibes all around.`),
      figcaption("The three dimensions of Willow’s data model: paths, timestamps, and subspaces.")
    ),

    pinformative("Willow further allows the aggregation of subspaces into completely independent ", em("namespaces"), ". Data from a public wiki should live in a separate namespace than data from a photo-sharing application for my family. Some namespaces should allow anyone to set up subspaces within them, others might require authorisation from a trusted manager. Willow offers a flexible mechanism for using different policies on a per-namespace basis."),

    figure(
      img(asset("data_model/namespaces.png"), `Three simplified three-dimensional visualisations of namespaces, each shaded in a different color. One is labeled "family", one "wiki", and one "project".`),
      figcaption("Three completely independent namespaces.")
    ),

    pinformative("This constitutes a full overview of the data model of Willow. Applications read and write payloads from and to subspaces, addressing via hierarchical paths. Willow tracks timestamps of write operations, newer writes replace older writes in the manner of a traditional file system. These data collections live in namespaces; read and write access to both namespaces and subspaces can be controlled through a variety of policies."),

    pinformative( "Now we can ", em("almost"), " delve into the precise definition of these concepts."),

    hsection("willow_parameters", "Parameters", [
      pinformative("Some questions in protocol design have no clear-cut answer. Should namespaces be identified via human-readable strings, or via the public keys of some digital signature scheme? That depends entirely on the use-case. To sidestep such questions, the Willow data model is ", em("generic"), " over certain choices of parameters. You can instantiate Willow to use strings as the identifiers of namespaces, or you could have it use 256 bit integers, or urls, or iris scans, etc."),

      pinformative("This makes Willow a higher-order protocol: you supply a set of specific choices for its parameters, and in return you get a concrete protocol that you can then use. If different systems instantiate Willow with non-equal parameters, the results will not be interoperable, even though both systems use Willow."),

      pinformative(
        marginale([
          "We give precise semantics to these parameters in the spec proper, the list need not fully make sense on the first read-through.",
        ]),
        "An instantiation of Willow must define concrete choices of the following parameters:",
      ),

      lis(
        [
          "A type ", def_parameter_type("NamespaceId", "NamespaceId", ["A protocol parameter of Willow, the type of ", rs("entry_namespace_id"), ".", ]), " for identifying namespaces.",
        ],
        [ "A type ", def_parameter_type("SubspaceId", "SubspaceId", ["A protocol parameter of Willow, the type of ", rs("entry_subspace_id"), "."]), " for identifying subspaces.",
        ],
        [
          "A natural number ", def_parameter_value({id: "max_component_length", math: "max\\_component\\_length"}, "max_component_length", ["A protocol parameter of Willow, the maximal length of individual ", rs("Component"), "."]), " for limiting the length of path components.",
        ],
        [
          "A natural number ", def_parameter_value({id: "max_component_count", math: "max\\_component\\_count"}, "max_component_count", ["A protocol parameter of Willow, the maximal number of ", rs("Component"), " in a single ", r("Path"), ".", ]), " for limiting the number of path components.",
        ],
        [
          "A natural number ", def_parameter_value({id: "max_path_length", math: "max\\_path\\_length"}, "max_path_length", ["A protocol parameter of Willow, the maximal sum of the lengths of the ", rs("Component"), "  of a single ", r("Path"), " in bytes."]), " for limiting the overall size of paths.",
        ],
        [
          "A ", link("totally ordered", "https://en.wikipedia.org/wiki/Total_order"), " type ", def_parameter_type("PayloadDigest", "PayloadDigest", ["A protocol parameter of Willow, the totally ordered type of ", rs("entry_payload_digest"), "."]), " for ", link("content-addressing", "https://en.wikipedia.org/wiki/Content_addressing"), " the data that Willow stores.",
        ],
        [
          marginale([
            "Since this function provides the only way in which Willow tracks payloads, you probably want to use a ", link("secure hash function", "https://en.wikipedia.org/wiki/Secure_hash_function"), ".",
          ]),
          "A function ", def_parameter_fn("hash_payload", "hash_payload", ["A protocol parameter of Willow, a function for computing ", rs("PayloadDigest"), " from ", rs("Payload"), ".", ]), " that maps bytestrings (of length at most ", $("2^{64} - 1", ")"), " into ", r("PayloadDigest"), ".",
        ],
        [
          "A type ", def_parameter_type("AuthorisationToken", "AuthorisationToken", ["A protocol parameter of Willow, required to define ", rs("PossiblyAuthorisedEntry"), "."]), " for proving write permission.",
        ],
        [
          marginale([
            link_name("meadowcap", "Meadowcap"), " is our bespoke capability system for handling authorisation. But any system works, as long as it defines a type of ", rs("AuthorisationToken"), " and an ", r("is_authorised_write"), " function.",
          ]),
          "A function ", def_parameter_fn("is_authorised_write", "is_authorised_write", ["A protocol parameter of Willow, required to define ", rs("AuthorisedEntry"), "."]), " that maps an ", r("Entry"), " (defined later) and an ", r("AuthorisationToken"), " to a ", r("Bool"), ", indicating whether the ", r("AuthorisationToken"), " does prove write permission for the ", r("Entry"), ".",
        ],
      ),
    ]),

    hsection("data_model_concepts", "Concepts", [
      pinformative("Willow can store arbitrary bytestrings of at most ", $("2^{64} - 1"), " bytes. We call such a bytestring a ", def_type("Payload", "Payload", ["A ", def_fake_type("Payload"), " is a bytestring of at most ", $("2^{64} - 1"), " bytes."]), "."),

      pinformative("A ", def_type("Path"), " is a sequence of at most ", r("max_component_count"), " many bytestrings, each of at most ", r("max_component_length"), " bytes, and whose total number of bytes is at most ", r("max_path_length"), ". The bytestrings that make up a ", r("Path"), " are called its ", def_type("Component", "Components"), "."),

      pinformative("A ", def_type("Timestamp"), " is a 64-bit unsigned integer, that is, a natural number between zero (inclusive) and ", code("2^64"), " (exclusive). ", Rs("Timestamp"), " are to be interpreted as a time in microseconds since the ", link("Unix epoch", "https://en.wikipedia.org/wiki/Unix_epoch"), "."),

      preview_scope(
        p("The metadata associated with each ", r("Payload"), " is called an ", r("Entry"), ":"),
        pseudocode(
          new Struct({
            id: "Entry",
            plural: "Entries",
            comment: ["The metadata for storing a ", r("Payload"), "."],
            fields: [
              {
                id: "entry_namespace_id",
                name: "namespace_id",
                comment: ["The identifier of the ", r("namespace"), " to which the ", r("Entry"), " belongs."],
                rhs: r("NamespaceId"),
              },
              {
                id: "entry_subspace_id",
                name: "subspace_id",
                comment: ["The identifier of the ", r("subspace"), " to which the ", r("Entry"), " belongs."],
                rhs: r("SubspaceId"),
              },
              {
                id: "entry_path",
                name: "path",
                comment: ["The ", r("Path"), " to which the ", r("Entry"), " was written."],
                rhs: r("Path"),
              },
              {
                id: "entry_timestamp",
                name: "timestamp",
                comment: ["The claimed creation time of the ", r("Entry"), "."],
                marginale: [
                  "Wall-clock timestamps may come as a surprise. We are cognisant of their limitations, and use them anyway. To learn why, please see ", link_name("timestamps_really", "Timestamps, really?"),
                ],
                rhs: r("Timestamp"),
              },
              {
                id: "entry_payload_length",
                name: "payload_length",
                comment: ["The length of the ", r("Payload"), " in bytes."],
                rhs: r("U64"),
              },
              {
                id: "entry_payload_digest",
                name: "payload_digest",
                comment: ["The result of applying ", r("hash_payload"), " to the ", r("Payload"), "."],
                rhs: r("PayloadDigest"),
              },
            ],
          }),
        ),
      ),

      pinformative( "A ", def_type({id: "PossiblyAuthorisedEntry", plural: "PossiblyAuthorisedEntries"}), " is a pair of an ", r("Entry"), " and an ", r("AuthorisationToken"), ". An ", def_type({ id: "AuthorisedEntry", plural: "AuthorisedEntries" }), " is a ", r("PossiblyAuthorisedEntry"), " for which ", r("is_authorised_write"), " returns ", code("true"), "."),

      pinformative(
        marginale([path("a"), " is a ", r("path_prefix"), " of ", path("a"), " and of ", path("a", "b"), ", but not of ", path("ab"), "."]),
        "A ", r("Path"), " ", def_value({ id: "prefix_s", singular: "s" }), " is a ", def({ id: "path_prefix", singular: "prefix", plural: "prefixes" }), " of a ", r("Path"), " ", def_value({ id: "prefix_t", singular: "t" }), " if the first ", rs("Component"), " of ", r("prefix_t"), " are exactly the ", rs("Component"), " of ", r("prefix_s"), ".",
      ),

      pinformative("We can now formally define which ", rs("Entry"), " overwrite each other and which can coexist. ", preview_scope(
        "An ", r("Entry"), " ", def_value({id: "new_e1", singular: "e1"}), " is ", def({id: "entry_newer", singular: "newer"}), " than another ", r("Entry"), " ", def_value({id: "new_e2", singular: "e2"}), " if ", lis(
          [
            code(field_access(r("new_e2"), "entry_timestamp"), " < ", field_access(r("new_e1"), "entry_timestamp")), ", or",
          ],
          [
            code(field_access(r("new_e2"), "entry_timestamp"), " == ", field_access(r("new_e1"), "entry_timestamp")), " and ", code(field_access(r("new_e2"), "entry_payload_digest"), " < ", marginale([
                "We require ", r("PayloadDigest"), " to be ", link("totally ordered", "https://en.wikipedia.org/wiki/Total_order"), " because of this comparison.",
              ]), field_access(r("new_e1"), "entry_payload_digest")), ", or",
          ],
          [
            code(field_access(r("new_e2"), "entry_timestamp"), " == ", field_access(r("new_e1"), "entry_timestamp")), " and ", code(field_access(r("new_e2"), "entry_payload_digest"), " == ", field_access(r("new_e1"), "entry_payload_digest")), " and ", code(field_access(r("new_e2"), "entry_payload_length"), " < ", field_access(r("new_e1"), "entry_payload_length")), ".",
          ],
        ),
      ), preview_scope(
        "A ", def("store"), " is a set of ", rs("AuthorisedEntry"), " such that",
          lis(
            ["all its ", rs("Entry"), " have the same ", r("entry_namespace_id"), ", and"],
            ["there are no two of its ", rs("Entry"), " ", def_value({ id: "store_old", singular: "old" }), " and ", def_value({ id: "store_new", singular: "new" }), " such that",
              lis(
                [
                  code(field_access(r("store_old"), "entry_subspace_id"), " == ", field_access(r("store_new"), "entry_subspace_id")), ", and",
                ],
                [
                  field_access(r("store_new"), "entry_path"), " is a ", r("path_prefix"), marginale([
                    "This is where we formally define ", r("prefix_pruning"), "."
                  ]), " of ", field_access(r("store_old"), "entry_path"), ", and",                  
                ],
                [
                  r("store_new"), " is ", r("entry_newer"), " than ", r("store_old"), "."
                ],
              ),
            ],
          ),
        ),
      ),

      pinformative(
        marginale(["When two peers connect and wish to update each other, they compute the ", rs("store_join"), " of all their ", rs("store"), " with equal ", rs("NamespaceId"), ". Doing so efficiently can be quite challenging, we recommend our ", link_name("sync", "Willow General Purpose Sync"), " protocol."]),
        marginale(["Formally, adding a new ", r("Entry"), " to a ", r("store"), " consists of computing the ", r("store_join"), " of the original ", r("store"), " and a singleton ", r("store"), " containing only the new ", r("Entry"), "."]),
        "The ", def({ id: "store_join", singular: "join" }), " of two ", rs("store"), " that store ", rs("Entry"), " of the same ", r("entry_namespace_id"), " is the ", r("store"), " obtained as follows:", lis(
          [
            "Starts with the union of the two ", rs("store"), ".",
          ],
          [
            "Then, remove all ", rs("Entry"), " with a ", r("entry_path"), " ", def_value({ id: "join_def_p", singular: "p" }), " whose ", r("entry_timestamp"), " is strictly less than the ", r("entry_timestamp"), " of any other ", r("Entry"), " of the same ", r("entry_subspace_id"), " whose ", r("entry_path"), " is a prefix of ", r("join_def_p"), ".",
          ],
          [
            "Then, for each subset of ", rs("Entry"), " with equal ", rs("entry_subspace_id"), ", equal ", rs("entry_path"), ", and equal ", rs("entry_timestamp"), ", remove all but those with the greatest ", r("entry_payload_digest"), ".",
          ],
          [
            "Then, for each subset of ", rs("Entry"), " with equal ", rs("entry_subspace_id"), ", equal ", rs("entry_path"), ", equal ", rs("entry_timestamp"), ", and equal ", rs("entry_payload_digest"), ", remove all but those with the greatest ", r("entry_payload_length"), ".",
          ],
        ),
      ),

      pinformative(
        preview_scope(
          "A ", def("namespace"), " is the ", r("store_join"), " over ", sidenote("all", [
            "No matter in which order and groupings the ", rs("store"), " are ", r("store_join", "joined"), " the result is always the same. ", Rs("store"), " form a ", link("join semi-lattice", "https://en.wikipedia.org/wiki/Semilattice"), " (also known as a ", link( "state-based CRDT", "https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#State-based_CRDTs"), ") under the ", r("store_join"), " operation.",
          ]),
          " ", rs("store"), " with ", rs("Entry"), " of a given ", r("NamespaceId"), ". Note that this concept only makes sense as an abstract notion, since no participant in a distributed system can ever be certain that it has (up-to-date) information about all existing ", rs("store"), ".",
        ),
        " ",
        preview_scope(
          "A ", def("subspace"), " is the set of all ", rs("Entry"), " of a given ", r("SubspaceId"), " in a given ", r("namespace"), ".",
        ),
      ),
    ]),

    hsection("data_further", "Further Reading", [
      pinformative("The Willow data model stays fairly compact by deliberately sidestepping some rather important questions. In this section, we point to our answers for the most important ones."),

      pinformative("How can we precisely delimit meaningful groups of ", rs("Entry"), ", for example, all recipes that Alex posted on their blog in the past three months? Grouping ", rs("Entry"), " always incurs a tradeoff between ", em("expressivity"), " (which sets of ", rs("Entry"), " can be characterised) and ", em("efficiency"), " (how quickly a database can retrieve all its ", rs("Entry"), " of an arbitrary grouping). We present a carefully crafted selection of ways of grouping ", rs("Entry"), " ", link_name("grouping_entries", "here"), "."),

      pinformative("How should we encode the concepts of Willow for storage or network transmission? Due to the parameterised nature of Willow, there can be no overarching answer, but we cover some recurring aspects of the question ", link_name("encodings", "here"), "."),

      pinformative("How should we select the ", r("AuthorisationToken"), " and ", r("is_authorised_write"), " parameters? Different deployments of Willow will have different needs. We provide ", link_name("meadowcap", "Meadowcap"), ", a capability-based solution that should be suitable for most use-cases."),

      pinformative("How do we efficiently and securely compute ", rs("store_join"), " over a network to synchronise data between peers? Again, different settings require different answers, but we provide the ", link_name("sync", "Willow General Purpose Sync"), " protocol as a well-engineered, privacy-preserving solution that should be applicable to a wide range of scenarios."),

      pinformative("How can we encrypt ", rs("Entry"), " while retaining the semantics of the original, unencrypted data? This question lies at the heart of end-to-end encryption for Willow, and we discuss our findings ", link_name("e2e", "here"), "."),

      pinformative("How can a database provide efficient access to ", rs("Entry"), "? We give an introduction to the types of queries that a data store for Willow should support, and present some data structures for supporting them efficiently ", link_name("d3storage", "here"), "."),

      pinformative("How can I contribute to Willow and support it? So glad you asked — we have prepared a collection of pointers ", link_name("projects_and_communities", "here"), "."),
    ]),

    img("/emblem.png", "A Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word \"Willow\"."),
  ],
);
