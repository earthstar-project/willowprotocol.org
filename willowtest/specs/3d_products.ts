import { aside_block, link, lis, pinformative, quotes, site_template } from "../main.ts";
import { hsection } from "../../hsection.ts";
import { code, em, figcaption, figure, img } from "../../h.ts";
import { asset } from "../../out.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";
import { Expression } from "../../tsgen.ts";
import { Rs, def, preview_scope, r, rs } from "../../defref.ts";
import { link_name } from "../../linkname.ts";
import { $, $dot } from "../../katex.ts";
import { Struct, hl_builtin, pseudocode } from "../../pseudocode.ts";

const apo = "’";

export const threedProducts: Expression = site_template({
  name: "grouping_entries",
  title: "Grouping Entries",
}, [
  pinformative("Willow lets authors place ", rs("entry"), " in ", rs("namespace"), ", and within each ", r("namespace"), ", ", rs("entry"), " are arranged according to three orthogonal dimensions: ", r("path"), ", ", r("subspace"), ", and ", r("timestamp"), ". This suggests a powerful way of thinking about willow: a ", r("namespace"), " is a collection of points (", rs("entry"), ") in a three-dimensional space. Or more accurately, a ", r("namespace"), " is a ", em("mapping"), " from points in this three-dimensional space to hashes and sizes of payloads."),

  marginale_inlineable(img(asset("meadowcap/3d_range.png"))),

  pinformative("This viewpoint enables us to meaningfully group ", rs("entry"), " together. An application might want to access all chess games that a certain author played in the past week. This kind of query corresponds to a box (a ", link("rectangular cuboid", "https://en.wikipedia.org/wiki/Rectangular_cuboid"), " to be more precise) in the three-dimensional willow space."),

  pinformative("In this document, we develop and define some precise terminology for grouping ", rs("entry"), " based on their ", rs("path"), ", ", rs("subspace"), ", and ", rs("timestamp"), ". These definitions are not necessary for defining and understanding the core data model, but we make heavy use of them in our ", link_name("meadowcap", "recommended capability system"), " and our ", link_name("sync", "recommended synchronization protocol"), "."),

  hsection("ranges", "Ranges", [
    pinformative("Ranges are the simplemost way of grouping ", rs("entry"), ", they can express groupings such as ", quotes("last week", apo, "s ", rs("entry"),), ". A ", def("range"), " is either a ", r("closed_range"), " or an ", r("open_range"), ". A ", def({id: "closed_range", singular: "closed range"}), " consists of a ", def({id: "start_value", singular: "start value"}), " and an ", def({id: "end_value", singular: "end value"}), ", an ", def({id: "open_range", singular: "open range"}), " consists only of a ", r("start_value"), ". A ", r("range"), " ", def("range_include", "includes"), " all values greater than or equal to its ", r("start_value"), " and strictly less than its ", r("end_value"), " (if it is ", r("closed_range", "closed"), ")."),

    pinformative("Ranges can only be defined for types of values that can be sorted according to some ", link("total order", "https://en.wikipedia.org/wiki/Total_order"), ". For willow, we only use three types of ", rs("range"), ": a ", def({id: "time_range", singular: "time range"}), " is a ", r("range"), " of ", rs("timestamp"), " (ordered numerically), a ", def({id: "path_range", singular: "path range"}), " is a ", r("range"), " of ", rs("path"), " (ordered ", link("lexicographically", "https://en.wikipedia.org/wiki/Lexicographic_order"), "), and a ", def({id: "subspace_range", singular: "subspace range"}), " is a ", r("range"), " of ", rs("subspace_id"), " (whose ordering has to be supplied as a protocol parameter)."),

    pinformative("Let ", code("r1"), " and ", code("r2"), " be ", rs("range"), " (over the same types of values). The ", def({id: "range_intersection", singular: "intersection"}), " of ", code("r1"), " is the range whose ", r("start_value"), " is the greater of the ", rs("start_value"), " of ", code("r1"), " and ", code("r2"), ", and whose ", r("end_value"), " is the lesser of the ", rs("end_value"), " of ", code("r1"), " and ", code("r2"), " (if both are ", rs("closed_range"), "), the one ", rs("end_value"), " among ", code("r1"), " and ", code("r2"), " (if exactly one of them is a ", r("closed_range"), "), or no ", r("end_value"), " (if both ", code("r1"), " and ", code("r2"), " are ", rs("open_range"), ")."),

    pinformative("When we combine ", rs("range"), " all three dimensions, we can delimit boxes in willow space. A ", def({id: "3d_range", singular: "3d-range"}), " consists of a ", r("time_range"), ", a ", r("path_range"), ", and a ", r("subspace_range"), ". It ", def({id: "3d_range_include", singular: "include"}, "includes"), " all ", rs("entry"), " ", r("range_include", "included"), " by all of its three ", rs("range"), "."),
  ]),

  hsection("areas", "Areas", [
    pinformative(Rs("3d_range"), " are a natural way of grouping ", rs("entry"), ", but they have certain drawbacks around encrypted data in willow: when encrypting ", rs("paths"), ", for example, the lexicographic ordering of the encrypted ", rs("path"), " would not be consistent with the ordering of the unencrypted ", rs("path"), ". If users specified groupings of ", rs("entry"), " of ", rs("3d_range"), ", encryption ", rs("path"), " would be impossible. Similarly, ", rs("subspace_range"), " would not preserve their meaning under encryption either."),

    pinformative("Fortunately, they do exist encryption techniques that preserve properties some weaker than arbitrary orderings. Without going into the cryptographic details, we now define an alternative to ", rs("3d_range"), " that can be used even when encrypting ", rs("path"), " and ", rs("subspace_id"), ". These ", rs("area"), " can be used, for example, to let peers express which parts of a namespace another peer should be able to read from or to write to."),

    pinformative("An ", def("area"), " consists of a ", r("time_range"), ", a ", r("path"), ", and an optional ", r("subspace_id"), ". It ", def({id: "area_include", singular: "include"}, "includes"), " all ", rs("entry"), " whose ", r("timestamp"), " is ", r("area_include", "included"), " in the ", r("time_range"), ", whose ", r("path"), " starts with the ", r("area"), apo, "s ", r("path"), ", and whose ", r("subspace_id"), " is the ", r("area"), apo, "s ", r("subspace_id"), " — if the ", r("area"), " has no ", r("subspace_id"), ", then the ", r("entry"), apo, "s ", r("subspace_id"), " has no bearing on whether it is ", r("area_include", "included"), " or not."),

    pinformative("Let ", code("a1"), " and ", code("a2"), " be ", rs("area"), " consisting of ", rs("time_range"), " ", code("t1"), " and ", code("t2"), ", ", rs("path"), " ", code("p1"), " and ", code("p2"), ", and optional ", rs("subspace_id"), " ", code("s1"), " and ", code("s2"), " respectively. If there exist ", rs("entry"), " ", r("area_include", "included"), " in both of them, then we define the ", def({id: "area_intersection", singular: "intersection"}, "(nonempty) intersection"), " of ", code("a1"), " and ", code("a2"), " as the ", r("range_intersection"), " of ", code("t1"), " and ", code("t2"), ", the longer of ", code("p1"), " and ", code("p2"), " (one is a prefix of the other, otherwise the intersection would be empty), and either no ", r("subspace_id"), " (if neither ", code("s1"), " nor ", code("s2"), " are given), or any of the given ", rs("subspace_id"), " otherwise (if both are given, then they are equal, as otherwise the intersection would be empty)."),
  ]),

  hsection("grouping_entries_aois", "Areas of Interest", [
    pinformative(Rs("3d_range"), ", ", rs("area"), ", ", rs("3d_range_product"), ", and ", rs("area_product"), " all group ", rs("entry"), " independently of any outside state. But sometimes it is useful to request, for example, the newest 100 ", rs("entry"), " available in some ", r("store"), ". For this and similar purposes, we define the ", r("aoi"), "."),

    pinformative("An ", def({id: "aoi", singular: "area of interest", plural: "areas of interest"}), " consists of an ", r("area"), ", an optional 64 bit unsigned integer ", def({id: "time_count", singular: "timestamp count limit"}), ", an optional 64 bit unsigned integer ", def({id: "time_size", singular: "timestamp size limit"}), ", an optional 64 bit unsigned integer ", def({id: "path_count", singular: "path count limit"}), ", and an optional 64 bit unsigned integer ", def({id: "path_size", singular: "path size limit"}), ". The set of ", rs("entry"), " ", def({id: "aoi_include", singular: "include"}, "included"), " in an ", r("aoi"), " depends on some set ", code("S"), " of ", rs("entry"), " that are ", r("aoi_include", "included"), " by the ", r("area"), ", to which the ", r("aoi"), " is being applied, and is defined as the largest subset ", code("T"), " of ", code("S"), " such that"),

    lis(
      ["if there is a ", r("time_count"), ", then every ", r("entry"), " in ", code("T"), " is amongst the ", r("time_count"), " many ", rs("entry"), " in ", code("S"), " with the greatest ", rs("timestamp"), ","],
      ["if there is a ", r("time_size"), ", then no ", r("entry"), " that is in ", code("S"), " but not in ", code("T"), " has a greater ", r("timestamp"), " than any ", r("entry"), " in ", code("T"), ","],
      ["if there is a ", r("time_size"), ", then the sum of the ", r("payload_length"), " of the ", r("entry"), " in ", code("T"), " is at most the ", r("time_size"), " many ", rs("entry"), " in ", code("S"), ","],
      ["if there is a ", r("path_count"), ", then every ", r("entry"), " in ", code("T"), " is amongst the ", r("path_count"), " many ", rs("entry"), " in ", code("S"), " with the (lexicographically) greatest ", rs("path"), ","],
      ["if there is a ", r("path_size"), ", then no ", r("entry"), " that is in ", code("S"), " but not in ", code("T"), " has a greater ", r("path"), " than any ", r("entry"), " in ", code("T"), ","],
      ["if there is a ", r("path_size"), ", then the sum of the ", r("payload_length"), " of the ", r("entry"), " in ", code("T"), " is at most the ", r("path_size"), " many ", rs("entry"), " in ", code("S"), "."],
    ),

    pinformative("The ", def({id: "aoi_intersection", singular: "intersection"}), " of two ", rs("aoi"), " consists of the ", r("area_intersection"), " of their ", rs("area"), ", the lesser (if any) of their ", rs("time_count"), ", the lesser (if any) of their ", rs("time_size"), ", the lesser (if any) of their ", rs("path_count"), ", and the lesser (if any) of their ", rs("path_size"), "."),
  ]),

  hsection("entries_relativity", "Relativity", [
    pinformative("When encoding multiple ", rs("entry"), ", ", rs("3d_range"), ", or ", rs("area"), ", we can increase efficiency by letting the encodings reference each other. If, for example, we encode several ", rs("entry"), " with equal ", rs("subspace_id"), ", there is little point in repeating the same ", r("subspace_id"), " over and over. In this section we define several concepts for expressing ", rs("entry"), " and their groupings relative to another ", r("entry"), " or grouping. If the entity and its reference entity are similar enough, the resulting relative entities are much smaller than their absolute counterparts."),

    pinformative("In the following, we write ", hl_builtin(def("ub")), " for the type of unsigned ", $("b", "-bit"), " integers, where ", $("b"), " is the least number such that ", $dot("256^{b} > \\href{/specs/data-model/index.html#max_path_length}{\\htmlClass{ref param}{\\htmlData{preview=/previews/max_path_length.html}{\\mathrm{max\\_path\\_length}}}}")),
  ]),

  pseudocode(
    new Struct({
        id: "EntryRelativeEntry",
        comment: ["Describes a target ", r("entry"), " ", code("t"), " relative to a reference ", r("entry"), " ", code("r"), "."],
        fields: [
            {
              id: "EntryRelativeEntryNamespace",
              name: "namespace_id",
              comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from that of ", code("r"), ", otherwise nothing."],
              rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
            },
            {
              id: "EntryRelativeEntrySubspace",
              name: "subspace_id",
              comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("r"), ", otherwise nothing."],
              rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
            },
            {
              id: "EntryRelativeEntryPathPrefix",
              name: "prefix_length",
              comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("r"), "."],
              rhs: [hl_builtin(r("ub"))],
            },
            {
              id: "EntryRelativeEntryPathSuffix",
              name: "suffix",
              comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
              rhs: ["[", hl_builtin("u8"), "]"],
            },
            {
                id: "EntryRelativeEntryTimeDifference",
                name: "time_difference",
                comment: ["The (numeric) difference between the ", rs("timestamp"), " of ", code("t"), " and ", code("r"), " as an absolute (i.e., non-negative) value."],
                rhs: hl_builtin("u64"),
            },
            {
              id: "EntryRelativeEntryTimeFlag",
              name: "time_sign",
              comment: ["Whether the ", r("EntryRelativeEntryTimeDifference"), " needs to be added (", code("true"), ") or subtracted (", code("false"), ") to the ", r("timestamp"), " of ", code("r"), " to obtain the ", r("timestamp"), " of ", code("t"), "."],
              rhs: hl_builtin("bool"),
            },
            {
              id: "EntryRelativeEntryPayloadLength",
              name: "payload_length",
              comment: ["The ", r("payload_length"), " of ", code("t"), "."],
              rhs: hl_builtin("u64"),
            },
            {
              id: "EntryRelativeEntryPayloadHash",
              name: "payload_hash",
              comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
              rhs: r("Digest"),
            },
        ],
    }),

    new Struct({
      id: "EntryInRange",
      comment: ["Describes a target ", r("entry"), " ", code("t"), " relative to a reference ", r("namespace"), " ", code("n"), " and a reference ", r("3d_range"), " ", code("r"), " that ", rs("3d_range_include"), " ", code("t"), "."],
      fields: [
          {
            id: "EntryInRangeNamespace",
            name: "namespace_id",
            comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from ", code("n"), ", otherwise nothing."],
            rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
          },
          {
            id: "EntryInRangeSubspace",
            name: "subspace_id",
            comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", otherwise nothing."],
            rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
          },
          {
            id: "EntryInRangePathPrefix",
            name: "prefix_length",
            comment: ["The length of the longest common prefix of the ", r("path"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("path_range"), " of ", code("r"), "."],
            rhs: [hl_builtin(r("ub"))],
          },
          {
            id: "EntryInRangePathSuffix",
            name: "suffix",
            comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
            rhs: ["[", hl_builtin("u8"), "]"],
          },
          {
            id: "EntryInRangeTimeDifference",
            name: "time_difference",
            comment: ["The (numeric) difference between the ", r("timestamp"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), "."],
            rhs: hl_builtin("u64"),
          },
          {
            id: "EntryInRangePayloadLength",
            name: "payload_length",
            comment: ["The ", r("payload_length"), " of ", code("t"), "."],
            rhs: hl_builtin("u64"),
          },
          {
            id: "EntryInRangePayloadHash",
            name: "payload_hash",
            comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
            rhs: r("Digest"),
          },
      ],
    }),

    new Struct({
      id: "EntryInArea",
      comment: ["Describes a target ", r("entry"), " ", code("t"), " relative to a reference ", r("namespace"), " ", code("n"), " and a reference ", r("area"), " ", code("a"), " that ", rs("area_include"), " ", code("t"), "."],
      fields: [
          {
            id: "EntryInAreaNamespace",
            name: "namespace_id",
            comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from ", code("n"), ", otherwise nothing."],
            rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
          },
          {
            id: "EntryInAreaSubspace",
            name: "subspace_id",
            comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("a"), " (or if ", code("a"), " does not have one), otherwise nothing."],
            rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
          },
          {
            id: "EntryInAreaPathPrefix",
            name: "prefix_length",
            comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("a"), "."],
            rhs: [hl_builtin(r("ub"))],
          },
          {
            id: "EntryInAreaPathSuffix",
            name: "suffix",
            comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
            rhs: ["[", hl_builtin("u8"), "]"],
          },
          {
            id: "EntryInAreaTimeDifference",
            name: "time_difference",
            comment: ["The (numeric) difference between the ", r("timestamp"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("a"), "."],
            rhs: hl_builtin("u64"),
          },
          {
            id: "EntryInAreaPayloadLength",
            name: "payload_length",
            comment: ["The ", r("payload_length"), " of ", code("t"), "."],
            rhs: hl_builtin("u64"),
          },
          {
            id: "EntryInAreaPayloadHash",
            name: "payload_hash",
            comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
            rhs: r("Digest"),
          },
      ],
    }),

    new Struct({
      id: "RangeRelativeRange",
      comment: ["Describes a target ", r("3d_range"), " ", code("t"), " relative to a reference ", r("3d_range"), " ", code("r"), "."],
      fields: [
          {
            id: "RangeRelativeRangeSubspaceStart",
            name: "subspace_id_start",
            comment: [hl_builtin("start"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("end"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("r"), ", otherwise the ", r("subspace_id"), " of ", code("t"), "."],
            rhs: [r("SubspaceId"), " | ", hl_builtin("start"), " | ", hl_builtin("end")],
          },
          {
            id: "RangeRelativeRangeSubspaceEnd",
            name: "subspace_id_end",
            comment: [hl_builtin("start"), " if the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("end"), " if the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("open"), ", if the ", r("subspace_range"), " of ", code("t"), " is ", r("range_open", "open"), ", otherwise the ", r("subspace_id"), " of ", code("t"), "."],
            rhs: [r("SubspaceId"), " | ", hl_builtin("start"), " | ", hl_builtin("end"), " | ", hl_builtin("open")],
          },
          {
            id: "RangeRelativeRangePathStartRelativeTo",
            name: "path_start_relative_to",
            comment: ["Whether the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " is encoded relative to the ", r("start_value"), " (", hl_builtin("start"), ") or ", r("end_value"), " (", hl_builtin("end"), ") of the ", r("path_range"), " of ", code("r"), "."],
            rhs: [hl_builtin("start"), " | ", hl_builtin("end")],
          },
          {
            id: "RangeRelativeRangePathPrefixStart",
            name: "start_prefix_length",
            comment: ["The length of the longest common prefix of the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " and the value indicated by ", r("RangeRelativeRangePathStartRelativeTo"), "."],
            rhs: [hl_builtin(r("ub"))],
          },
          {
            id: "RangeRelativeRangePathSuffixStart",
            name: "start_suffix",
            comment: ["The ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeRelativeRangePathPrefixStart"), " bytes."],
            rhs: ["[", hl_builtin("u8"), "]"],
          },
          {
            id: "RangeRelativeRangePathEndRelativeTo",
            name: "path_end_relative_to",
            comment: ["Whether the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " is encoded relative to the ", r("start_value"), " (", hl_builtin("start"), ") or to the ", r("end_value"), " (", hl_builtin("end"), ") of the ", r("path_range"), " of ", code("r"), ", or relative to the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " (", hl_builtin("self"), "), or whether the ", r("path_range"), " of ", code("t"), " is ", r("range_open", "open"), " (", hl_builtin("open"), ")."],
            rhs: [hl_builtin("start"), " | ", hl_builtin("end"), " | ", hl_builtin("self"), " | ", hl_builtin("open")],
          },
          {
            id: "RangeRelativeRangePathPrefixEnd",
            name: "end_prefix_length",
            comment: ["The length of the longest common prefix of the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " and the value indicated by ", r("RangeRelativeRangePathEndRelativeTo"), "."],
            rhs: [hl_builtin(r("ub"))],
          },
          {
            id: "RangeRelativeRangePathSuffixEnd",
            name: "end_suffix",
            comment: ["The ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeRelativeRangePathPrefixEnd"), " bytes."],
            rhs: ["[", hl_builtin("u8"), "]"],
          },
          {
            id: "RangeRelativeRangeTimeStartRelativeTo",
            name: "time_start_relative_to",
            comment: ["Whether the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), by subtracting a value from the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_minus"), "), by adding a value to the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
            rhs: [hl_builtin("start_plus"), " | ", hl_builtin("start_minus"), " | ", hl_builtin("end_plus"), " | ", hl_builtin("end_minus")],
          },
          {
              id: "RangeRelativeRangeTimeStart",
              name: "time_start_difference",
              comment: ["The value to use according to ", r("RangeRelativeRangeTimeStartRelativeTo"), " to compute the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), "."],
              rhs: hl_builtin("u64"),
          },
          {
            id: "RangeRelativeRangeTimeEndRelativeTo",
            name: "time_end_relative_to",
            comment: ["Whether the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), " (", hl_builtin("none"), "), or whether ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), by subtracting a value from the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_minus"), "), by adding a value to the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
            rhs: [hl_builtin("start_plus"), " | ", hl_builtin("start_minus"), " | ", hl_builtin("end_plus"), " | ", hl_builtin("end_minus"), " | ", hl_builtin("none")],
          },
          {
              id: "RangeRelativeRangeTimeEnd",
              name: "time_end_difference",
              comment: ["The value to use according to ", r("RangeRelativeRangeTimeEndRelativeTo"), " to compute the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or ", hl_builtin("none"), " if the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), "."],
              rhs: [hl_builtin("u64"), " | ", hl_builtin("none")],
          },
      ],
    }),

    new Struct({
      id: "RangeInArea",
      comment: ["Describes a target ", r("3d_range"), " ", code("t"), " relative to a reference ", r("area"), " ", code("r"), " which fully contains ", code("t"), "."],
      fields: [
          {
            id: "RangeInAreaSubspaceStart",
            name: "subspace_id_start",
            comment: [hl_builtin("none"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("subspace_id"), " of ", code("r"), ", ", hl_builtin("end"), ", otherwise the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), "."],
            rhs: [r("SubspaceId"), " | ", hl_builtin("none"),],
          },
          {
            id: "RangeInAreaSubspaceEnd",
            name: "subspace_id_end",
            comment: [hl_builtin("none"), " if the ", r("subspace_range"), " of ", code("t"), " is ", r("open_range", "open"), ", otherwise the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), "."],
            rhs: [r("SubspaceId"), " | ", hl_builtin("none"),],
          },
          {
            id: "RangeInAreaPathPrefixStart",
            name: "start_prefix_length",
            comment: ["The length of the longest common prefix of the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " and the ", r("path"), " of ", code("r"), "."],
            rhs: [hl_builtin(r("ub"))],
          },
          {
            id: "RangeInAreaPathSuffixStart",
            name: "start_suffix",
            comment: ["The ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeInAreaPathPrefixStart"), " bytes."],
            rhs: ["[", hl_builtin("u8"), "]"],
          },
          {
            id: "RangeInAreaPathPrefixEnd",
            name: "end_prefix_length",
            comment: ["The length of the longest common prefix of the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), "."],
            rhs: [hl_builtin(r("ub"))],
          },
          {
            id: "RangeInAreaPathSuffixEnd",
            name: "end_suffix",
            comment: ["The ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeInAreaPathPrefixEnd"), " bytes."],
            rhs: ["[", hl_builtin("u8"), "]"],
          },
          {
            id: "RangeInAreaTimeStartRelativeTo",
            name: "time_start_relative_to",
            comment: ["Whether the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
            rhs: [hl_builtin("start_plus"), " | ", hl_builtin("end_minus")],
          },
          {
              id: "RangeInAreaTimeStart",
              name: "time_start_difference",
              comment: ["The value to use according to ", r("RangeInAreaTimeStartRelativeTo"), " to compute the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), "."],
              rhs: hl_builtin("u64"),
          },
          {
            id: "RangeInAreaTimeEndRelativeTo",
            name: "time_end_relative_to",
            comment: ["Whether the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), " (", hl_builtin("none"), "), or whether ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "),  or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
            rhs: [hl_builtin("start_plus"), hl_builtin("end_minus"), " | ", hl_builtin("none")],
          },
          {
              id: "RangeInAreaTimeEnd",
              name: "time_end_difference",
              comment: ["The value to use according to ", r("RangeInAreaTimeEndRelativeTo"), " to compute the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or ", hl_builtin("none"), " if the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), "."],
              rhs: [hl_builtin("u64"), " | ", hl_builtin("none")],
          },
      ],
    }),

    new Struct({
      id: "AreaInArea",
      comment: ["Describes a target ", r("area"), " ", code("t"), " relative to a reference ", r("area"), " ", code("r"), " which fully contains ", code("t"), "."],
      fields: [
          {
            id: "AreaInAreaSubspace",
            name: "subspace_id",
            comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("r"), ", otherwise nothing."],
            rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
          },
          {
            id: "AreaInAreaPathPrefix",
            name: "prefix_length",
            comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("r"), "."],
            rhs: [hl_builtin(r("ub"))],
          },
          {
            id: "AreaInAreaPathSuffix",
            name: "suffix",
            comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
            rhs: ["[", hl_builtin("u8"), "]"],
          },
          {
            id: "AreaInAreaTimeStartDifference",
            name: "time_start_difference",
            comment: ["The (numeric) difference between the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), "."],
            rhs: hl_builtin("u64"),
          },
          {
            id: "AreaInAreaTimeEndDifference",
            name: "time_end_difference",
            comment: ["If ", code("r"), " has a ", r("closed_range", "closed"), " ", r("time_range"), ", this is the (numeric) difference between the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " and the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ". If ", code("r"), " has an ", r("open_range", "open"), " ", r("time_range"), ", this is the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or nothing if ", code("t"), " has an ", r("open_range", "open"), " ", r("time_range"), " as well."],
            rhs: [hl_builtin("Option"), "<", hl_builtin("u64"), ">"],
          },
      ],
    }),
  ),
]);
