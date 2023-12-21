import { def_value, link, lis, pinformative, quotes, site_template } from "../main.ts";
import { hsection } from "../../hsection.ts";
import { code, em, figcaption, figure, img, span } from "../../h.ts";
import { asset } from "../../out.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";
import { Expression, surpress_output } from "macro";
import { Rs, def, preview_scope, r, rs } from "../../defref.ts";
import { link_name } from "../../linkname.ts";
import { $comma } from "../../katex.ts";
import { Struct, def_symbol, field_access, pseudo_choices, pseudocode } from "../../pseudocode.ts";

const apo = "’";

export const grouping_entries: Expression = site_template({
  name: "grouping_entries",
  title: "Grouping Entries",
}, [
  marginale_inlineable(
    [
      img(asset("grouping_entries/axes.png")),
      figcaption("The three dimensions of a ", r("namespace"), ".")
    ]
  ),
  
  pinformative("Willow lets authors place ", rs("Entry"), " in ", rs("namespace"), ", and within each ", r("namespace"), ", ", rs("Entry"), " are arranged according to three orthogonal dimensions: ", r("entry_path"), ", ", r("entry_subspace_id"), ", and ", r("entry_timestamp"), ". This suggests a powerful way of thinking about Willow: a ", r("namespace"), " is a collection of points (", rs("Entry"), ") in a three-dimensional space. Or more accurately, a ", r("namespace"), " is a ", em("mapping"), " from points in this three-dimensional space to hashes and sizes of ", rs("Payload"), "."),

  pinformative("This viewpoint enables us to meaningfully group ", rs("Entry"), " together. An application might want to access all chess games that a certain author played in the past week. This kind of query corresponds to a box (a ", link("rectangular cuboid", "https://en.wikipedia.org/wiki/Rectangular_cuboid"), " to be more precise) in the three-dimensional willow space."),

  pinformative("In this document, we develop and define some precise terminology for grouping ", rs("Entry"), " based on their ", rs("entry_path"), ", ", rs("entry_subspace_id"), ", and ", rs("entry_timestamp"), ". These definitions are not necessary for defining and understanding the core data model, but we make heavy use of them in our ", link_name("meadowcap", "recommended capability system"), " and our ", link_name("sync", "recommended synchronization protocol"), "."),

  hsection("ranges", "Ranges", [
    pinformative("Ranges are simple, one-dimensional ways of grouping ", rs("Entry"), ", they can express groupings such as ", quotes("last week", apo, "s ", rs("Entry"),), ". ", preview_scope("A ", def("range"), " is either a ", r("closed_range"), " or an ", r("open_range"), ". A ", def({id: "closed_range", singular: "closed range"}), " consists of a ", def({id: "start_value", singular: "start value"}), " and an ", def({id: "end_value", singular: "end value"}), ", an ", def({id: "open_range", singular: "open range"}), " consists only of a ", r("start_value"), ". A ", r("range"), " ", def({id: "range_include", singular: "include"}, "includes"), " all values greater than or equal to its ", r("start_value"), " and strictly less than its ", r("end_value"), " (if it is has one).")),
    
    figure(
      img(asset("grouping_entries/ranges.png")),
      figcaption("A ", span({class: "vermillion"}, r('closed_range')), " and an ", span({class: "green"}, r('open_range')), ".")
    ),

    pinformative("The Willow protocols use three types of ", rs("range"), ":"),
    surpress_output(def_symbol({id: "range_open", singular: "open"}, "open", ["A value that signals that a ", r("range"), " is ", r("open_range", "open"), "."])),

    pseudocode(
      new Struct({
        id: "TimeRange",
        comment: ["A ", r("range"), " of ", rs("Timestamp"), "."],
        fields: [
          {
            id: "TimeRangeStart",
            name: "start",
            comment: ["A ", r("Timestamp"), " must be numerically greater than or equal to this to be ", r("range_include", "included"), " in the ", r("range"), "."],
            rhs: r("Timestamp"),
          },
          {
            id: "TimeRangeEnd",
            name: "end",
            comment: ["If ", r("range_open"), ", the ", r("range"), " is an ", r("open_range"), ". Otherwise, a ", r("Timestamp"), " must be numerically strictly less than this to be ", r("range_include", "included"), " in the ", r("range"), "."],
            rhs: pseudo_choices(r("Timestamp"), r("range_open")),
          },
        ],
      }),

      new Struct({
        id: "PathRange",
        comment: ["A ", r("range"), " of ", rs("Path"), "."],
        fields: [
          {
            id: "PathRangeStart",
            name: "start",
            comment: ["A ", r("Path"), " must be ", link("lexicographically", "https://en.wikipedia.org/wiki/Lexicographic_order"), " greater than or equal to this to be ", r("range_include", "included"), " in the ", r("range"), "."],
            rhs: r("Path"),
          },
          {
            id: "PathRangeEnd",
            name: "end",
            comment: ["If ", r("range_open"), ", the ", r("range"), " is an ", r("open_range"), ". Otherwise, a ", r("Path"), " must be ", link("lexicographically", "https://en.wikipedia.org/wiki/Lexicographic_order"), " strictly less than this to be ", r("range_include", "included"), " in the ", r("range"), "."],
            rhs: pseudo_choices(r("Path"), r("range_open")),
          },
        ],
      }),

      new Struct({
        id: "SubspaceRange",
        comment: ["A ", r("range"), " of ", rs("SubspaceId"), "."],
        fields: [
          {
            id: "SubspaceRangeStart",
            name: "start",
            comment: ["A ", r("SubspaceId"), " must be greater than or equal to this to be ", r("range_include", "included"), " in the ", r("range"), ". The ordering must be given by a protocol parameter."],
            rhs: r("SubspaceId"),
          },
          {
            id: "SubspaceRangeEnd",
            name: "end",
            comment: ["If ", r("range_open"), ", the ", r("range"), " is an ", r("open_range"), ". Otherwise, a ", r("SubspaceId"), " must be numerically strictly less than this to be ", r("range_include", "included"), " in the ", r("range"), ". The ordering must be given by a protocol parameter."],
            rhs: pseudo_choices(r("SubspaceId"), r("range_open")),
          },
        ],
      }),
    ),

    pinformative("Let ", def_value({id: "rangeisectr1", singular: "r1"}), " and ", def_value({id: "rangeisectr2", singular: "r2"}), " be ", rs("range"), " (over the same types of values). The ", def({id: "range_intersection", singular: "intersection"}), " of ", r("rangeisectr1"), " and ", r("rangeisectr2"), " is the range whose ", r("start_value"), " is the greater of the ", rs("start_value"), " of ", r("rangeisectr1"), " and ", r("rangeisectr2"), ", and whose ", r("end_value"), " is the lesser of the ", rs("end_value"), " of ", r("rangeisectr1"), " and ", r("rangeisectr2"), " (if both are ", rs("closed_range"), "), the one ", r("end_value"), " among ", r("rangeisectr1"), " and ", r("rangeisectr2"), " (if exactly one of them is a ", r("closed_range"), "), or no ", r("end_value"), " (if both ", r("rangeisectr1"), " and ", r("rangeisectr2"), " are ", rs("open_range"), ")."),
    
    marginale_inlineable(
      [
        img(asset("grouping_entries/3d_range.png")),
        figcaption("A ", span({class: "orange"}, r("3dRange")), " composed of a ", span({class: "green"}, r("TimeRange")), ", ", span({class: "blue"}, r("PathRange")), ", and ", span({class: "purple"}, r("SubspaceRange")), ".")
      ]
    ),

    pinformative("When we combine ", rs("range"), " of all three dimensions, we can delimit boxes in Willow space."),

    pseudocode(
      new Struct({
        id: "3dRange",
        comment: ["A three-dimensional range that ", rs("3d_range_include"), " every ", r("Entry"), " ", r("range_include", "included"), " in all three of its ", rs("range"), "."],
        fields: [
          {
            id: "3dRangeTime",
            name: "time_range",
            rhs: r("TimeRange"),
          },
          {
            id: "3dRangePath",
            name: "path_range",
            rhs: r("PathRange"),
          },
          {
            id: "3dRangeSubspace",
            name: "subspace_range",
            rhs: r("SubspaceRange"),
          },
        ],
      }),
    ),

    pinformative("A ", r("3dRange"), " ", def({id: "3d_range_include", singular: "include"}, "includes"), " every ", r("Entry"), " whose ", r("entry_timestamp"), ", ", r("entry_path"), ", and ", r("entry_subspace_id"), " are all ", r("range_include", "included"), " their respective ", r("range"), "."),
  ]),

  hsection("areas", "Areas", [
    pinformative(Rs("3dRange"), " are a natural way of grouping ", rs("Entry"), ", but they have certain drawbacks around encrypted data in willow: when encrypting ", rs("Path"), ", for example, the lexicographic ordering of the encrypted ", rs("Path"), " is inconsistent with the ordering of the unencrypted ", rs("Path"), ". Similarly, ", rs("SubspaceRange"), " do not preserve their meaning under encryption either. Hence, user-specified ", rs("3dRange"), " are close to useless when dealing with encrypted data."),

    pinformative("Fortunately, there do exist encryption techniques that preserve some weaker properties than arbitrary orderings.", marginale(["See ", link_name("e2e", "here"), " for information on encrypting Willow."]), " Without going into the cryptographic details, we now define an alternative to ", rs("3dRange"), " that can be used even when encrypting ", rs("Path"), " and ", rs("SubspaceId"), "."),

    marginale(["Every ", r("Area"), " can be expressed as a ", r("3dRange"), ", but not the other way around. ", Rs("Area"), " always denote boxes in Willow space, but some boxes do not correspond to any ", r("Area"), "."]),
    
    marginale(
      [
        img(asset("grouping_entries/area.png")),
        figcaption("This diagram attempts to show the key difference between a ", r('3dRange'), ' and an ', r('Area'), ', namely that its dimensions are ', em('derived'), ' from its ', span({class: "blue"}, r('AreaPath')), ' and its ', span({class: "purple"}, r('AreaSubspace')), '.') 
      ]
    ),

    pseudocode(
      new Struct({
        id: "Area",
        comment: ["A grouping of ", rs("Entry"), "."],
        fields: [
          {
            id: "AreaTime",
            name: "time_range",
            comment: ["To be ", r("area_include", "included"), " in this ", r("Area"), ", an ", r("Entry"), "’s ", r("entry_timestamp"), " must be ", r("range_include", "included"), " in the ", r("AreaTime"), "."],
            rhs: r("TimeRange"),
          },
          {
            id: "AreaPath",
            name: "path_prefix",
            comment: ["To be ", r("area_include", "included"), " in this ", r("Area"), ", an ", r("Entry"), "’s ", r("entry_path"), " must be ", r("path_prefix", "prefixed"), " by the ", r("AreaPath"), "."],
            rhs: r("Path"),
          },
          {
            id: "AreaSubspace",
            name: "included_subspace_id",
            comment: ["To be ", r("area_include", "included"), " in this ", r("Area"), ", an ", r("Entry"), "’s ", r("entry_subspace_id"), " must be equal to the ", r("AreaSubspace"), ", unless it is ", r("area_any"), "."],
            rhs: pseudo_choices(r("SubspaceId"), def_symbol({id: "area_any", singular: "any"}, "any", ["A value that signals that an ", r("Area"), " ", rs("area_include"), " ", rs("Entry"), " with arbitrary ", rs("entry_subspace_id"), "."])),
          },
        ],
      }),
    ),

    pinformative("An ", r("Area"), " ", def_value({id: "area_include_a", singular: "a"}), " ", def({id: "area_include", singular: "include"}, "includes"), " an ", r("Entry"), " ", def_value({id: "area_include_e", singular: "e"}), " if ", lis(
      [field_access(r("area_include_a"), "AreaTime"), " ", rs("range_include"), " ", field_access(r("area_include_e"), "entry_timestamp"), ","],
      [field_access(r("area_include_a"), "AreaPath"), " id a ", rs("path_prefix"), " ", field_access(r("area_include_e"), "entry_path"), ", and"],
      [code(field_access(r("area_include_a"), "AreaSubspace"), " == ", r("area_any")), " or ", code(field_access(r("area_include_a"), "AreaSubspace"), " == ", field_access(r("area_include_e"), "entry_subspace_id")), "."],
    )),

    pinformative("An ", r("Area"), " ", def({id: "area_include_area", singular: "include"}, "includes"), " another ", r("Area"), " if the first ", r("Area"), " ", rs("area_include"), " all ", rs("Entry"), " that the second ", r("Area"), " ", rs("area_include"), ". In particular, every ", r("Area"), " ", rs("area_include_area"), " itself."),

    // pinformative("Let ", code("a1"), " and ", code("a2"), " be ", rs("area"), " consisting of ", rs("time_range"), " ", code("t1"), " and ", code("t2"), ", ", rs("path"), " ", code("p1"), " and ", code("p2"), ", and optional ", rs("subspace_id"), " ", code("s1"), " and ", code("s2"), " respectively. If there exist ", rs("Entry"), " ", r("area_include", "included"), " in both of them, then we define the ", def({id: "area_intersection", singular: "intersection"}, "(nonempty) intersection"), " of ", code("a1"), " and ", code("a2"), " as the ", r("range_intersection"), " of ", code("t1"), " and ", code("t2"), ", the longer of ", code("p1"), " and ", code("p2"), " (one is a prefix of the other, otherwise the intersection would be empty), and either no ", r("subspace_id"), " (if neither ", code("s1"), " nor ", code("s2"), " are given), or any of the given ", rs("subspace_id"), " otherwise (if both are given, then they are equal, as otherwise the intersection would be empty)."),

    pinformative("The ", def({id: "full_area", singular: "full area"}), " is the ", r("Area"), " whose ", r("AreaTime"), " is the ", r("open_range", "open"), " ", r("TimeRange"), " with ", r("TimeRangeStart"), " ", $comma("0"), " whose ", r("AreaPath"), " is the empty ", r("Path"), ", and whose ", r("AreaSubspace"), " is ", r("area_any"), ". It ", rs("area_include"), " all ", rs("Entry"), "."),

    pinformative("The ", def({id: "subspace_area", singular: "subspace area"}), " of the ", r("SubspaceId"), " ", def_value({id: "subspacearea_sub", singular: "sub"}), " is the ", r("Area"), " whose ", r("AreaTime"), " is the ", r("open_range", "open"), " ", r("TimeRange"), " with ", r("TimeRangeStart"), " ", $comma("0"), " whose ", r("AreaPath"), " is the empty ", r("Path"), ", and whose ", r("AreaSubspace"), " is ", r("subspacearea_sub"), ". It ", rs("area_include"), " exactly the ", rs("Entry"), " with ", r("entry_subspace_id"), " ", r("subspacearea_sub"), "."),
  ]),

  // hsection("aois", "Areas of Interest", [
  //   pinformative("Occasionally, we wish to group ", rs("Entry"), " based on the contents of some ", r("store"), ". For example, a space-constrained peer might ask for the 100 newest ", rs("Entry"), " when synchronizing data."),

  //   pinformative("We serve these use cases by combining an ", r("Area"), " with limits to restrict the contents to the greatest ", rs("Entry"), " in some ", r("store"), " with respect to any of the three dimensions."),

  //   pseudocode(
  //     new Struct({
  //       id: "AreaOfInterest",
  //       comment: ["A grouping of ", rs("Entry"), " that are amongst the greatest in some ", r("store"), "."],
  //       fields: [
  //         {
  //           id: "aoi_area",
  //           name: "area",
  //           comment: ["To be ", r("aoi_include", "included"), " in this ", r("AreaOfInterest"), ", an ", r("Entry"), " must be ", r("area_include", "included"), " in the ", r("aoi_area"), "."],
  //           rhs: r("Area"),
  //         },
  //         {
  //           id: "aoi_tc",
  //           name: "time_count",
  //           comment: ["To be ", r("aoi_include", "included"), " in this ", r("AreaOfInterest"), ", an ", r("Entry"), "’s ", r("entry_timestamp"), " must be amongst the ", r("aoi_tc"), " greatest ", rs("Timestamp"), "."],
  //           rhs: r("U64"),
  //         },
  //         {
  //           id: "aoi_ts",
  //           name: "time_size",
  //           comment: ["The total ", rs("entry_payload_length"), " of all ", r("aoi_include", "included"), " ", rs("Entry"), " is at most the", r("aoi_ts"), "."],
  //           rhs: r("U64"),
  //         },
  //         {
  //           id: "aoi_pc",
  //           name: "path_count",
  //           comment: ["To be ", r("aoi_include", "included"), " in this ", r("AreaOfInterest"), ", an ", r("Entry"), "’s ", r("entry_path"), " must be amongst the ", r("aoi_pc"), " greatest ", rs("Path"), "."],
  //           rhs: r("U64"),
  //         },
  //         {
  //           id: "aoi_ps",
  //           name: "path_size",
  //           comment: ["The total ", rs("entry_payload_length"), " of all ", r("aoi_include", "included"), " ", rs("Entry"), " is at most the", r("aoi_ps"), "."],
  //           rhs: r("U64"),
  //         },
  //       ],
  //     }),
  //   ),

    // pinformative("An ", r("Area"), " ", def_value({id: "area_include_a", singular: "a"}), " ", def({id: "area_include", singular: "include"}, "includes"), " an ", r("Entry"), " ", def_value({id: "area_include_e", singular: "e"}), " if ", lis(
    //   [field_access(r("area_include_a"), "AreaTime"), " ", rs("range_include"), " ", field_access(r("area_include_e"), "entry_timestamp"), ","],
    //   [field_access(r("area_include_a"), "AreaPath"), " id a ", rs("path_prefix"), " ", field_access(r("area_include_e"), "entry_path"), ", and"],
    //   [code(field_access(r("area_include_a"), "AreaSubspace"), " == ", r("area_any")), " or ", code(field_access(r("area_include_a"), "AreaSubspace"), " == ", field_access(r("area_include_e"), "entry_subspace_id")), "."],
    // )),
  // ]),

  // hsection("grouping_entries_aois", "Areas of Interest", [
  //   pinformative(Rs("3d_range"), ", ", rs("area"), ", ", rs("3d_range_product"), ", and ", rs("area_product"), " all group ", rs("Entry"), " independently of any outside state. But sometimes it is useful to request, for example, the newest 100 ", rs("Entry"), " available in some ", r("store"), ". For this and similar purposes, we define the ", r("aoi"), "."),

  //   pinformative("An ", def({id: "aoi", singular: "area of interest", plural: "areas of interest"}), " consists of an ", r("area"), ", an optional 64 bit unsigned integer ", def({id: "time_count", singular: "timestamp count limit"}), ", an optional 64 bit unsigned integer ", def({id: "time_size", singular: "timestamp size limit"}), ", an optional 64 bit unsigned integer ", def({id: "path_count", singular: "path count limit"}), ", and an optional 64 bit unsigned integer ", def({id: "path_size", singular: "path size limit"}), ". The set of ", rs("Entry"), " ", def({id: "aoi_include", singular: "include"}, "included"), " in an ", r("aoi"), " depends on some set ", code("S"), " of ", rs("Entry"), " that are ", r("aoi_include", "included"), " by the ", r("area"), ", to which the ", r("aoi"), " is being applied, and is defined as the largest subset ", code("T"), " of ", code("S"), " such that"),

  //   lis(
  //     ["if there is a ", r("time_count"), ", then every ", r("Entry"), " in ", code("T"), " is amongst the ", r("time_count"), " many ", rs("Entry"), " in ", code("S"), " with the greatest ", rs("timestamp"), ","],
  //     ["if there is a ", r("time_size"), ", then no ", r("Entry"), " that is in ", code("S"), " but not in ", code("T"), " has a greater ", r("timestamp"), " than any ", r("Entry"), " in ", code("T"), ","],
  //     ["if there is a ", r("time_size"), ", then the sum of the ", r("payload_length"), " of the ", r("Entry"), " in ", code("T"), " is at most the ", r("time_size"), " many ", rs("Entry"), " in ", code("S"), ","],
  //     ["if there is a ", r("path_count"), ", then every ", r("Entry"), " in ", code("T"), " is amongst the ", r("path_count"), " many ", rs("Entry"), " in ", code("S"), " with the (lexicographically) greatest ", rs("path"), ","],
  //     ["if there is a ", r("path_size"), ", then no ", r("Entry"), " that is in ", code("S"), " but not in ", code("T"), " has a greater ", r("path"), " than any ", r("Entry"), " in ", code("T"), ","],
  //     ["if there is a ", r("path_size"), ", then the sum of the ", r("payload_length"), " of the ", r("Entry"), " in ", code("T"), " is at most the ", r("path_size"), " many ", rs("Entry"), " in ", code("S"), "."],
  //   ),

  //   pinformative("The ", def({id: "aoi_intersection", singular: "intersection"}), " of two ", rs("aoi"), " consists of the ", r("area_intersection"), " of their ", rs("area"), ", the lesser (if any) of their ", rs("time_count"), ", the lesser (if any) of their ", rs("time_size"), ", the lesser (if any) of their ", rs("path_count"), ", and the lesser (if any) of their ", rs("path_size"), "."),
  // ]),

  // hsection("entries_relativity", "Relativity", [
  //   pinformative("When encoding multiple ", rs("Entry"), ", ", rs("3d_range"), ", or ", rs("area"), ", we can increase efficiency by letting the encodings reference each other. If, for example, we encode several ", rs("Entry"), " with equal ", rs("subspace_id"), ", there is little point in repeating the same ", r("subspace_id"), " over and over. In this section we define several concepts for expressing ", rs("Entry"), " and their groupings relative to another ", r("Entry"), " or grouping. If the entity and its reference entity are similar enough, the resulting relative entities are much smaller than their absolute counterparts."),

  //   pinformative("In the following, we write ", hl_builtin(def("ub")), " for the type of unsigned ", $("b", "-bit"), " integers, where ", $("b"), " is the least number such that ", $dot("256^{b} > \\href{/specs/data-model/index.html#max_path_length}{\\htmlClass{ref param}{\\htmlData{preview=/previews/max_path_length.html}{\\mathrm{max\\_path\\_length}}}}")),
  // ]),

  // pseudocode(
  //   new Struct({
  //       id: "EntryRelativeEntry",
  //       comment: ["Describes a target ", r("Entry"), " ", code("t"), " relative to a reference ", r("Entry"), " ", code("r"), "."],
  //       fields: [
  //           {
  //             id: "EntryRelativeEntryNamespace",
  //             name: "namespace_id",
  //             comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from that of ", code("r"), ", otherwise nothing."],
  //             rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
  //           },
  //           {
  //             id: "EntryRelativeEntrySubspace",
  //             name: "subspace_id",
  //             comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("r"), ", otherwise nothing."],
  //             rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
  //           },
  //           {
  //             id: "EntryRelativeEntryPathPrefix",
  //             name: "prefix_length",
  //             comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("r"), "."],
  //             rhs: [hl_builtin(r("ub"))],
  //           },
  //           {
  //             id: "EntryRelativeEntryPathSuffix",
  //             name: "suffix",
  //             comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
  //             rhs: ["[", hl_builtin("u8"), "]"],
  //           },
  //           {
  //               id: "EntryRelativeEntryTimeDifference",
  //               name: "time_difference",
  //               comment: ["The (numeric) difference between the ", rs("timestamp"), " of ", code("t"), " and ", code("r"), " as an absolute (i.e., non-negative) value."],
  //               rhs: hl_builtin("u64"),
  //           },
  //           {
  //             id: "EntryRelativeEntryTimeFlag",
  //             name: "time_sign",
  //             comment: ["Whether the ", r("EntryRelativeEntryTimeDifference"), " needs to be added (", code("true"), ") or subtracted (", code("false"), ") to the ", r("timestamp"), " of ", code("r"), " to obtain the ", r("timestamp"), " of ", code("t"), "."],
  //             rhs: hl_builtin("bool"),
  //           },
  //           {
  //             id: "EntryRelativeEntryPayloadLength",
  //             name: "payload_length",
  //             comment: ["The ", r("payload_length"), " of ", code("t"), "."],
  //             rhs: hl_builtin("u64"),
  //           },
  //           {
  //             id: "EntryRelativeEntryPayloadHash",
  //             name: "payload_hash",
  //             comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
  //             rhs: r("Digest"),
  //           },
  //       ],
  //   }),

  //   new Struct({
  //     id: "EntryInRange",
  //     comment: ["Describes a target ", r("Entry"), " ", code("t"), " in a reference ", r("namespace"), " ", code("n"), " and a reference ", r("3d_range"), " ", code("r"), " that ", rs("3d_range_include"), " ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "EntryInRangeNamespace",
  //           name: "namespace_id",
  //           comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from ", code("n"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInRangeSubspace",
  //           name: "subspace_id",
  //           comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInRangePathPrefix",
  //           name: "prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("path"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("path_range"), " of ", code("r"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "EntryInRangePathSuffix",
  //           name: "suffix",
  //           comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "EntryInRangeTimeDifference",
  //           name: "time_difference",
  //           comment: ["The (numeric) difference between the ", r("timestamp"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInRangePayloadLength",
  //           name: "payload_length",
  //           comment: ["The ", r("payload_length"), " of ", code("t"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInRangePayloadHash",
  //           name: "payload_hash",
  //           comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
  //           rhs: r("Digest"),
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "EntryInArea",
  //     comment: ["Describes a target ", r("Entry"), " ", code("t"), " in a reference ", r("namespace"), " ", code("n"), " and a reference ", r("area"), " ", code("a"), " that ", rs("area_include"), " ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "EntryInAreaNamespace",
  //           name: "namespace_id",
  //           comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from ", code("n"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInAreaSubspace",
  //           name: "subspace_id",
  //           comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("a"), " (or if ", code("a"), " does not have one), otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInAreaPathPrefix",
  //           name: "prefix_length",
  //           comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("a"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "EntryInAreaPathSuffix",
  //           name: "suffix",
  //           comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "EntryInAreaTimeDifference",
  //           name: "time_difference",
  //           comment: ["The (numeric) difference between the ", r("timestamp"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("a"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInAreaPayloadLength",
  //           name: "payload_length",
  //           comment: ["The ", r("payload_length"), " of ", code("t"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInAreaPayloadHash",
  //           name: "payload_hash",
  //           comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
  //           rhs: r("Digest"),
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "RangeRelativeRange",
  //     comment: ["Describes a target ", r("3d_range"), " ", code("t"), " relative to a reference ", r("3d_range"), " ", code("r"), "."],
  //     fields: [
  //         {
  //           id: "RangeRelativeRangeSubspaceStart",
  //           name: "subspace_id_start",
  //           comment: [hl_builtin("start"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("end"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("r"), ", otherwise the ", r("subspace_id"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("start"), " | ", hl_builtin("end")],
  //         },
  //         {
  //           id: "RangeRelativeRangeSubspaceEnd",
  //           name: "subspace_id_end",
  //           comment: [hl_builtin("start"), " if the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("end"), " if the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("open"), ", if the ", r("subspace_range"), " of ", code("t"), " is ", r("range_open", "open"), ", otherwise the ", r("subspace_id"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("start"), " | ", hl_builtin("end"), " | ", hl_builtin("open")],
  //         },
  //         {
  //           id: "RangeRelativeRangePathStartRelativeTo",
  //           name: "path_start_relative_to",
  //           comment: ["Whether the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " is encoded relative to the ", r("start_value"), " (", hl_builtin("start"), ") or ", r("end_value"), " (", hl_builtin("end"), ") of the ", r("path_range"), " of ", code("r"), "."],
  //           rhs: [hl_builtin("start"), " | ", hl_builtin("end")],
  //         },
  //         {
  //           id: "RangeRelativeRangePathPrefixStart",
  //           name: "start_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " and the value indicated by ", r("RangeRelativeRangePathStartRelativeTo"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeRelativeRangePathSuffixStart",
  //           name: "start_suffix",
  //           comment: ["The ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeRelativeRangePathPrefixStart"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeRelativeRangePathEndRelativeTo",
  //           name: "path_end_relative_to",
  //           comment: ["Whether the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " is encoded relative to the ", r("start_value"), " (", hl_builtin("start"), ") or to the ", r("end_value"), " (", hl_builtin("end"), ") of the ", r("path_range"), " of ", code("r"), ", or relative to the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " (", hl_builtin("self"), "), or whether the ", r("path_range"), " of ", code("t"), " is ", r("range_open", "open"), " (", hl_builtin("open"), ")."],
  //           rhs: [hl_builtin("start"), " | ", hl_builtin("end"), " | ", hl_builtin("self"), " | ", hl_builtin("open")],
  //         },
  //         {
  //           id: "RangeRelativeRangePathPrefixEnd",
  //           name: "end_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " and the value indicated by ", r("RangeRelativeRangePathEndRelativeTo"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeRelativeRangePathSuffixEnd",
  //           name: "end_suffix",
  //           comment: ["The ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeRelativeRangePathPrefixEnd"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeRelativeRangeTimeStartRelativeTo",
  //           name: "time_start_relative_to",
  //           comment: ["Whether the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), by subtracting a value from the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_minus"), "), by adding a value to the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), " | ", hl_builtin("start_minus"), " | ", hl_builtin("end_plus"), " | ", hl_builtin("end_minus")],
  //         },
  //         {
  //             id: "RangeRelativeRangeTimeStart",
  //             name: "time_start_difference",
  //             comment: ["The value to use according to ", r("RangeRelativeRangeTimeStartRelativeTo"), " to compute the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), "."],
  //             rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "RangeRelativeRangeTimeEndRelativeTo",
  //           name: "time_end_relative_to",
  //           comment: ["Whether the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), " (", hl_builtin("none"), "), or whether ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), by subtracting a value from the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_minus"), "), by adding a value to the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), " | ", hl_builtin("start_minus"), " | ", hl_builtin("end_plus"), " | ", hl_builtin("end_minus"), " | ", hl_builtin("none")],
  //         },
  //         {
  //             id: "RangeRelativeRangeTimeEnd",
  //             name: "time_end_difference",
  //             comment: ["The value to use according to ", r("RangeRelativeRangeTimeEndRelativeTo"), " to compute the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or ", hl_builtin("none"), " if the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), "."],
  //             rhs: [hl_builtin("u64"), " | ", hl_builtin("none")],
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "RangeInArea",
  //     comment: ["Describes a target ", r("3d_range"), " ", code("t"), " in a reference ", r("area"), " ", code("r"), " which fully contains ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "RangeInAreaSubspaceStart",
  //           name: "subspace_id_start",
  //           comment: [hl_builtin("none"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("subspace_id"), " of ", code("r"), ", ", hl_builtin("end"), ", otherwise the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("none"),],
  //         },
  //         {
  //           id: "RangeInAreaSubspaceEnd",
  //           name: "subspace_id_end",
  //           comment: [hl_builtin("none"), " if the ", r("subspace_range"), " of ", code("t"), " is ", r("open_range", "open"), ", otherwise the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("none"),],
  //         },
  //         {
  //           id: "RangeInAreaPathPrefixStart",
  //           name: "start_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " and the ", r("path"), " of ", code("r"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeInAreaPathSuffixStart",
  //           name: "start_suffix",
  //           comment: ["The ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeInAreaPathPrefixStart"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeInAreaPathPrefixEnd",
  //           name: "end_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeInAreaPathSuffixEnd",
  //           name: "end_suffix",
  //           comment: ["The ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeInAreaPathPrefixEnd"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeInAreaTimeStartRelativeTo",
  //           name: "time_start_relative_to",
  //           comment: ["Whether the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), " | ", hl_builtin("end_minus")],
  //         },
  //         {
  //             id: "RangeInAreaTimeStart",
  //             name: "time_start_difference",
  //             comment: ["The value to use according to ", r("RangeInAreaTimeStartRelativeTo"), " to compute the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), "."],
  //             rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "RangeInAreaTimeEndRelativeTo",
  //           name: "time_end_relative_to",
  //           comment: ["Whether the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), " (", hl_builtin("none"), "), or whether ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "),  or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), hl_builtin("end_minus"), " | ", hl_builtin("none")],
  //         },
  //         {
  //             id: "RangeInAreaTimeEnd",
  //             name: "time_end_difference",
  //             comment: ["The value to use according to ", r("RangeInAreaTimeEndRelativeTo"), " to compute the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or ", hl_builtin("none"), " if the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), "."],
  //             rhs: [hl_builtin("u64"), " | ", hl_builtin("none")],
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "AreaInArea",
  //     comment: ["Describes a target ", r("area"), " ", code("t"), " in a reference ", r("area"), " ", code("r"), " which fully ", rs("area_include_area"), " ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "AreaInAreaSubspace",
  //           name: "subspace_id",
  //           comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("r"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
  //         },
  //         {
  //           id: "AreaInAreaPathPrefix",
  //           name: "prefix_length",
  //           comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("r"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "AreaInAreaPathSuffix",
  //           name: "suffix",
  //           comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "AreaInAreaTimeStartDifference",
  //           name: "time_start_difference",
  //           comment: ["The (numeric) difference between the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "AreaInAreaTimeEndDifference",
  //           name: "time_end_difference",
  //           comment: ["If ", code("r"), " has a ", r("closed_range", "closed"), " ", r("time_range"), ", this is the (numeric) difference between the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " and the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ". If ", code("r"), " has an ", r("open_range", "open"), " ", r("time_range"), ", this is the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or nothing if ", code("t"), " has an ", r("open_range", "open"), " ", r("time_range"), " as well."],
  //           rhs: [hl_builtin("Option"), "<", hl_builtin("u64"), ">"],
  //         },
  //     ],
  //   }),
  // ),
]);
