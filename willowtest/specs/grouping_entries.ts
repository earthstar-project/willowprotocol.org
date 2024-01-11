import { blue, def_value, green, link, lis, orange, pinformative, purple, quotes, site_template, vermillion } from "../main.ts";
import { hsection } from "../../hsection.ts";
import { code, em, figcaption, figure, img, span } from "../../h.ts";
import { asset } from "../../out.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";
import { Expression, surpress_output } from "macro";
import { Rs, def, preview_scope, r, rs } from "../../defref.ts";
import { link_name } from "../../linkname.ts";
import { $comma, $dot } from "../../katex.ts";
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
  
  pinformative("Willow lets authors place ", rs("Entry"), " in ", rs("namespace"), ", and within each ", r("namespace"), ", ", rs("Entry"), " are arranged according to three orthogonal dimensions: ", r("entry_subspace_id"), ", ", r("entry_path"), ", and ", r("entry_timestamp"), ". This suggests a powerful way of thinking about Willow: a ", r("namespace"), " is a collection of points (", rs("Entry"), ") in a three-dimensional space. Or more accurately, a ", r("namespace"), " is a ", em("mapping"), " from points in this three-dimensional space to hashes and sizes of ", rs("Payload"), "."),

  pinformative("This viewpoint enables us to meaningfully group ", rs("Entry"), " together. An application might want to access all chess games that a certain author played in the past week. This kind of query corresponds to a box (a ", link("rectangular cuboid", "https://en.wikipedia.org/wiki/Rectangular_cuboid"), " to use precise terminology) in the three-dimensional willow space."),

  pinformative("In this document, we develop and define a vocabulary for grouping ", rs("Entry"), " based on their ", rs("entry_subspace_id"), ", ", rs("entry_path"), ", and ", rs("entry_timestamp"), ". These definitions are not necessary for defining and understanding the core data model, but we make heavy use of them in our ", link_name("meadowcap", "recommended capability system"), " and our ", link_name("sync", "recommended synchronisation protocol"), "."),

  hsection("ranges", "Ranges", [
    pinformative("Ranges are simple, one-dimensional ways of grouping ", rs("Entry"), ", they can express groupings such as ", quotes("last week", apo, "s ", rs("Entry"),), ". ", preview_scope("A ", def("range"), " is either a ", r("closed_range"), " or an ", r("open_range"), ". A ", def({id: "closed_range", singular: "closed range"}), " consists of a ", def({id: "start_value", singular: "start value"}), " and an ", def({id: "end_value", singular: "end value"}), ", an ", def({id: "open_range", singular: "open range"}), " consists only of a ", r("start_value"), ". A ", r("range"), " ", def({id: "range_include", singular: "include"}, "includes"), " all values greater than or equal to its ", r("start_value"), " and strictly less than its ", r("end_value"), " (if it is has one). A ", r("range"), " is ", def({id: "range_empty", singular: "empty"}), " if it ", rs("range_include"), " no values.")),
    
    figure(
      img(asset("grouping_entries/ranges.png")),
      figcaption("A ", vermillion(r('closed_range')), " and an ", green(r('open_range')), ".")
    ),

    pinformative("The Willow protocols use three types of ", rs("range"), ":"),
    surpress_output(def_symbol({id: "range_open", singular: "open"}, "open", ["A value that signals that a ", r("range"), " is ", r("open_range", "open"), "."])),

    pseudocode(
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
    ),

    pinformative("Let ", def_value({id: "rangeisectr1", singular: "r1"}), " and ", def_value({id: "rangeisectr2", singular: "r2"}), " be ", rs("range"), " (over the same types of values). The ", def({id: "range_intersection", singular: "intersection"}), " of ", r("rangeisectr1"), " and ", r("rangeisectr2"), " is the range whose ", r("start_value"), " is the greater of the ", rs("start_value"), " of ", r("rangeisectr1"), " and ", r("rangeisectr2"), ", and whose ", r("end_value"), " is the lesser of the ", rs("end_value"), " of ", r("rangeisectr1"), " and ", r("rangeisectr2"), " (if both are ", rs("closed_range"), "), the one ", r("end_value"), " among ", r("rangeisectr1"), " and ", r("rangeisectr2"), " (if exactly one of them is a ", r("closed_range"), "), or no ", r("end_value"), " (if both ", r("rangeisectr1"), " and ", r("rangeisectr2"), " are ", rs("open_range"), ")."),
    
    marginale_inlineable(
      [
        img(asset("grouping_entries/3d_range.png")),
        figcaption("A ", orange(r("3dRange")), " composed of a ", purple( r("SubspaceRange")), ", ", blue(r("PathRange")), ", and ", green(r("TimeRange")), ".")
      ]
    ),

    pinformative("When we combine ", rs("range"), " of all three dimensions, we can delimit boxes in Willow space."),

    pseudocode(
      new Struct({
        id: "3dRange",
        comment: ["A three-dimensional range that ", rs("3d_range_include"), " every ", r("Entry"), " ", r("range_include", "included"), " in all three of its ", rs("range"), "."],
        fields: [
          {
            id: "3dRangeSubspace",
            name: "subspaces",
            rhs: r("SubspaceRange"),
          },
          {
            id: "3dRangePath",
            name: "paths",
            rhs: r("PathRange"),
          },
          {
            id: "3dRangeTime",
            name: "times",
            rhs: r("TimeRange"),
          },
        ],
      }),
    ),

    pinformative("A ", r("3dRange"), " ", def({id: "3d_range_include", singular: "include"}, "includes"), " every ", r("Entry"), " whose ", r("entry_subspace_id"), ", ", r("entry_path"), ", and ", r("entry_timestamp"), " are all ", r("range_include", "included"), " their respective ", r("range"), "."),
  ]),

  hsection("areas", "Areas", [
    pinformative(Rs("3dRange"), " are a natural way of grouping ", rs("Entry"), ", but they have certain drawbacks around encrypted data in willow: when encrypting ", rs("Path"), ", for example, the lexicographic ordering of the encrypted ", rs("Path"), " is inconsistent with the ordering of the unencrypted ", rs("Path"), ". Similarly, ", rs("SubspaceRange"), " do not preserve their meaning under encryption either. Hence, user-specified ", rs("3dRange"), " are close to useless when dealing with encrypted data."),

    pinformative("Fortunately, there do exist encryption techniques that preserve some weaker properties than arbitrary orderings.", marginale(["See ", link_name("e2e", "here"), " for information on encrypting Willow."]), " Without going into the cryptographic details, we now define an alternative to ", rs("3dRange"), " that can be used even when encrypting ", rs("Path"), " and ", rs("SubspaceId"), "."),

    marginale(["Every ", r("Area"), " can be expressed as a ", r("3dRange"), ", but not the other way around. ", Rs("Area"), " always denote boxes in Willow space, but some boxes do not correspond to any ", r("Area"), "."]),
    
    marginale(
      [
        img(asset("grouping_entries/area.png")),
        figcaption("This diagram attempts to show the key difference between a ", r('3dRange'), ' and an ', r('Area'), ', namely that its dimensions are ', em('derived'), ' from its ', span({class: "purple"}, r('AreaSubspace')), ' and its ', span({class: "blue"}, r('AreaPath')), '.') 
      ]
    ),

    surpress_output(def_symbol({id: "area_any", singular: "any"}, "any", ["A value that signals that an ", r("Area"), " ", rs("area_include"), " ", rs("Entry"), " with arbitrary ", rs("entry_subspace_id"), "."])),

    pseudocode(
      new Struct({
        id: "Area",
        comment: ["A grouping of ", rs("Entry"), "."],
        fields: [
          {
            id: "AreaSubspace",
            name: "subspace_id",
            comment: ["To be ", r("area_include", "included"), " in this ", r("Area"), ", an ", r("Entry"), "’s ", r("entry_subspace_id"), " must be equal to the ", r("AreaSubspace"), ", unless it is ", r("area_any"), "."],
            rhs: pseudo_choices(r("SubspaceId"), r("area_any")),
          },
          {
            id: "AreaPath",
            name: "path",
            comment: ["To be ", r("area_include", "included"), " in this ", r("Area"), ", an ", r("Entry"), "’s ", r("entry_path"), " must be ", r("path_prefix", "prefixed"), " by the ", r("AreaPath"), "."],
            rhs: r("Path"),
          },
          {
            id: "AreaTime",
            name: "times",
            comment: ["To be ", r("area_include", "included"), " in this ", r("Area"), ", an ", r("Entry"), "’s ", r("entry_timestamp"), " must be ", r("range_include", "included"), " in the ", r("AreaTime"), "."],
            rhs: r("TimeRange"),
          },
        ],
      }),
    ),

    pinformative("An ", r("Area"), " ", def_value({id: "area_include_a", singular: "a"}), " ", def({id: "area_include", singular: "include"}, "includes"), " an ", r("Entry"), " ", def_value({id: "area_include_e", singular: "e"}), " if ", lis(
      [code(field_access(r("area_include_a"), "AreaSubspace"), " == ", r("area_any")), " or ", code(field_access(r("area_include_a"), "AreaSubspace"), " == ", field_access(r("area_include_e"), "entry_subspace_id")), ","],
      [field_access(r("area_include_a"), "AreaPath"), " id a ", rs("path_prefix"), " ", field_access(r("area_include_e"), "entry_path"), ", and"],
      [field_access(r("area_include_a"), "AreaTime"), " ", rs("range_include"), " ", field_access(r("area_include_e"), "entry_timestamp"), "."],
    )),

    pinformative("An ", r("Area"), " is ", def({id: "area_empty", singular: "empty"}), " if it ", rs("area_include"), " no ", rs("Entry"), ". This is the case if and only if its ", r("AreaTime"), " is ", r("range_empty"), "."),

    pinformative("An ", r("Area"), " ", def({id: "area_include_area", singular: "include"}, "includes"), " another ", r("Area"), " if the first ", r("Area"), " ", rs("area_include"), " all ", rs("Entry"), " that the second ", r("Area"), " ", rs("area_include"), ". In particular, every ", r("Area"), " ", rs("area_include_area"), " itself."),
    
    pinformative("The ", def({id: "full_area", singular: "full area"}), " is the ", r("Area"), " whose ", r("AreaSubspace"), " is ", r("area_any"), ", whose ", r("AreaPath"), " is the empty ", r("Path"), ", and whose ", r("AreaTime"), " is the ", r("open_range", "open"), " ", r("TimeRange"), " with ", r("TimeRangeStart"), " ", $dot("0"), " It ", rs("area_include"), " all ", rs("Entry"), "."),
    
    pinformative("The ", def({id: "subspace_area", singular: "subspace area"}), " of the ", r("SubspaceId"), " ", def_value({id: "subspacearea_sub", singular: "sub"}), " is the ", r("Area"), " whose ", r("AreaSubspace"), " is ", r("subspacearea_sub"), ", whose ", r("AreaPath"), " is the empty ", r("Path"), ", and whose ", r("AreaTime"), " is the ", r("open_range", "open"), " ", r("TimeRange"), " with ", r("TimeRangeStart"), " ", $dot("0"), " It ", rs("area_include"), " exactly the ", rs("Entry"), " with ", r("entry_subspace_id"), " ", r("subspacearea_sub"), "."),

    pinformative("If two ", rs("Area"), " overlap, the overlap is again an ", r("Area"), ". ", preview_scope(
      "Let ", def_value({id: "area_inter_a1", singular: "a1"}), " and ", def_value({id: "area_inter_a2", singular: "a2"}), " be ", rs("Area"), ". If there exists at least one ", r("Entry"), " ", r("area_include", "included"), " in both ", r("area_inter_a1"), ", and ", r("area_inter_a2"), ", then we define the ", def({id: "area_intersection", singular: "intersection"}, "(nonempty) intersection"), " of ", r("area_inter_a1"), ", and ", r("area_inter_a2"), " as the ", r("Area"), " whose", lis(
        [
          r("AreaSubspace"), " is ", r("area_any"), ", if ", field_access(r("area_inter_a2"), "AreaSubspace"), " is ", r("area_any"), ", or ", field_access(r("area_inter_a1"), "AreaSubspace"), ", otherwise, whose"
        ],
        [
          r("AreaPath"), " is the longer of ", field_access(r("area_inter_a1"), "AreaPath"), " and ", marginale([
            "One is a prefix of the other, otherwise the intersection would be empty."
          ]), field_access(r("area_inter_a2"), "AreaPath"), ", and whose",
        ],
        [
          r("AreaTime"), " is the ", r("range_intersection"), " of ", field_access(r("area_inter_a1"), "AreaTime"), " and ", field_access(r("area_inter_a2"), "AreaTime"), ".",
        ],
      )),
    ),    
  ]),

  hsection("aois", "Areas of Interest", [
    pinformative("Occasionally, we wish to group ", rs("Entry"), " based on the contents of some ", r("store"), ". For example, a space-constrained peer might ask for the 100 newest ", rs("Entry"), " when synchronising data."),

    pinformative("We serve these use cases by combining an ", r("Area"), " with limits to restrict the contents to the ", rs("Entry"), " with the greatest ", rs("entry_timestamp"), "."),

    pseudocode(
      new Struct({
        id: "AreaOfInterest",
        comment: ["A grouping of ", rs("Entry"), " that are among the newest in some ", r("store"), "."],
        fields: [
          {
            id: "aoi_area",
            name: "area",
            comment: ["To be ", r("aoi_include", "included"), " in this ", r("AreaOfInterest"), ", an ", r("Entry"), " must be ", r("area_include", "included"), " in the ", r("aoi_area"), "."],
            rhs: r("Area"),
          },
          {
            id: "aoi_count",
            name: "max_count",
            comment: ["To be ", r("aoi_include", "included"), " in this ", r("AreaOfInterest"), ", an ", r("Entry"), "’s ", r("entry_timestamp"), " must be among the ", r("aoi_count"), " greatest ", rs("Timestamp"), ", unless ", r("aoi_count"), " is zero."],
            rhs: r("U64"),
          },
          {
            id: "aoi_size",
            name: "max_size",
            comment: ["The total ", rs("entry_payload_length"), " of all ", r("aoi_include", "included"), " ", rs("Entry"), " is at most ", r("aoi_size"), ", unless ", r("aoi_size"), " is zero."],
            rhs: r("U64"),
          },
        ],
      }),
    ),

    pinformative("An ", r("AreaOfInterest"), " ", def_value({id: "aoi_include_a", singular: "aoi"}), " ", def({id: "aoi_include", singular: "include"}, "includes"), " an ", r("Entry"), " ", def_value({id: "aoi_include_e", singular: "e"}), " from a ", r("store"), " ", def_value({id: "aoi_include_s", singular: "store"}), " if ", lis(
      [
        field_access(r("aoi_include_a"), "aoi_area"), " ", rs("area_include"), " ", r("aoi_include_e"), ","
      ],
      [
        field_access(r("aoi_include_a"), "aoi_count"), " is zero, or ", r("aoi_include_e"), " is among the ", field_access(r("aoi_include_a"), "aoi_count"), " ", r("entry_newer", "newest"), " ", rs("Entry"), " of ", r("aoi_include_s"), ", and"
      ],
      [
        field_access(r("aoi_include_a"), "aoi_size"), " is zero, or the sum of the ", rs("entry_payload_length"), " of  ", r("aoi_include_e"), " and all ", r("entry_newer"), " ", rs("Entry"), " in ", r("aoi_include_s"), " is less than or equal to ", field_access(r("aoi_include_a"), "aoi_size"), ".",
      ],
    )),

    pinformative("Let ", def_value({id: "aoi_inter_a1", singular: "aoi1"}), " and ", def_value({id: "aoi_inter_a2", singular: "aoi2"}), " be ", rs("AreaOfInterest"), ". If there exists at least one ", r("Entry"), " ", r("area_include", "included"), " in both ", field_access(r("aoi_inter_a1"), "aoi_area"), ", and ", field_access(r("aoi_inter_a2"), "aoi_area"), ", then we define the ", def({id: "aoi_intersection", singular: "intersection"}, "(nonempty) intersection"), " of ", r("aoi_inter_a1"), ", and ", r("aoi_inter_a2"), " as the ", r("AreaOfInterest"), " whose ", lis(
      [
        r("aoi_area"), " is the ", r("area_intersection"), " of ", field_access(r("aoi_inter_a1"), "aoi_area"), " and ", field_access(r("aoi_inter_a2"), "aoi_area"), ", whose ",
      ],
      [
        r("aoi_count"), " is zero if any of ", field_access(r("aoi_inter_a1"), "aoi_count"), " or ", field_access(r("aoi_inter_a2"), "aoi_count"), " is zero, or the minimum of ", field_access(r("aoi_inter_a1"), "aoi_count"), " and ", field_access(r("aoi_inter_a2"), "aoi_count"), " otherwise, and whose ",
      ],
      [
        r("aoi_size"), " is zero if any of ", field_access(r("aoi_inter_a1"), "aoi_size"), " or ", field_access(r("aoi_inter_a2"), "aoi_size"), " is zero, or the minimum of ", field_access(r("aoi_inter_a1"), "aoi_size"), " and ", field_access(r("aoi_inter_a2"), "aoi_size"), " otherwise.",
      ],
    )),

  ]),
]);
