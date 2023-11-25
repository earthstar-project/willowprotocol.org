import { aside_block, link, lis, pinformative, site_template } from "../main.ts";
import { hsection } from "../../hsection.ts";
import { em, figcaption, figure, img } from "../../h.ts";
import { asset } from "../../out.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";
import { Expression } from "../../tsgen.ts";
import { Rs, def, r, rs } from "../../defref.ts";
import { link_name } from "../../linkname.ts";

export const threedProducts: Expression = site_template({
  name: "grouping_entries",
  title: "Grouping Entries",
}, [
  pinformative("Willow lets authors place ", rs("entry"), " in ", rs("namespace"), ", and within each ", r("namespace"), ", ", rs("entry"), " are arranged according to three orthogonal dimensions: ", r("path"), ", ", r("subspace"), ", and ", r("timestamp"), ". This suggests a powerful way of thinking about willow: a ", r("namespace"), " is a collection of points (", rs("entry"), ") in a three-dimensional space. Or more accurately, a ", r("namespace"), " is a ", em("mapping"), " from points in this three-dimensional space to hashes and sizes of payloads."),

  marginale_inlineable(img(asset("meadowcap/3d_range.png"))),

  pinformative("This viewpoint enables us to meaningfully group ", rs("entry"), " together. An application might want to access all chess games that a certain author played in the past week. This kind of query corresponds to a box (a ", link("rectangular cuboid", "https://en.wikipedia.org/wiki/Rectangular_cuboid"), " to be more precise) in the three-dimensional willow space."),

  pinformative("In this document, we develop and define some precise terminology for grouping ", rs("entry"), " based on their ", rs("path"), ", ", rs("subspace"), ", and ", rs("timestamp"), ". These definitions are not necessary for defining and understanding the core data model, but we make heavy use of them in our ", link_name("meadowcap", "recommended capability system"), " and our ", link_name("sync", "recommended synchronization protocol"), "."),

  hsection("ranges", "Ranges", [
    pinformative("Ranges are the simplemost way of grouping ", rs("entry"), ", they can express groupings such as \"last week's ", rs("entry"), "\". A ", def("range"), " is either a ", r("closed_range"), " or an ", r("open_range"), ". A ", def({id: "closed_range", singular: "closed range"}), " consists of a ", def({id: "start_value", singular: "start value"}), " and an ", def({id: "end_value", singular: "end value"}), ", an ", def({id: "open_range", singular: "open range"}), " consists only of a ", r("start_value"), ". A ", r("range"), " ", def("range_include", "includes"), " all values greater than or equal to its ", r("start_value"), " and strictly less than its ", r("end_value"), " (if it is ", r("closed_range", "closed"), ")."),

    pinformative("Ranges can only be defined for types of values that can be sorted according to some ", link("total order", "https://en.wikipedia.org/wiki/Total_order"), ". For willow, we only use three types of ", rs("range"), ": a ", def({id: "time_range", singular: "time range"}), " is a ", r("range"), " of ", rs("timestamp"), " (ordered numerically), a ", def({id: "path_range", singular: "path range"}), " is a ", r("range"), " of ", rs("path"), " (ordered ", link("lexicographically", "https://en.wikipedia.org/wiki/Lexicographic_order"), "), and a ", def({id: "subspace_range", singular: "subspace range"}), " is a ", r("range"), " of ", rs("subspace_id"), " (whose ordering has to be supplied as a protocol parameter)."),

    pinformative("When we combine ", rs("range"), " all three dimensions, we can delimit boxes in willow space. A ", def({id: "3d_range", singular: "3d-range"}), " consists of a ", r("time_range"), ", a ", r("path_range"), ", and a ", r("subspace_range"), ". It ", def("3d_range_include", "includes"), " all ", rs("entry"), " ", r("range_include", "included"), " by all of its three ", rs("range"), "."),
  ]),

  hsection("areas", "Areas", [
    pinformative(Rs("3d_range"), " are a natural way of grouping ", rs("entry"), ", but they have certain drawbacks around encrypted data in willow: when encrypting ", rs("paths"), ", for example, the lexicographic ordering of the encrypted ", rs("path"), " would not be consistent with the ordering of the unencrypted ", rs("path"), ". If users specified groupings of ", rs("entry"), " of ", rs("3d_range"), ", encryption ", rs("path"), " would be impossible. Similarly, ", rs("subspace_range"), " would not preserve their meaning under encryption either."),

    pinformative("Fortunately, they do exist encryption techniques that preserve properties some weaker than arbitrary orderings. Without going into the cryptographic details, we now define an alternative to ", rs("3d_range"), " that can be used even when encrypting ", rs("path"), " and ", rs("subspace_id"), ". These ", rs("area"), " can be used, for example, to let peers express which parts of a namespace another peer should be able to read from or to write to."),

    pinformative("An ", def("area"), " consists of a ", r("time_range"), ", a ", r("path"), ", and an optional ", r("subspace_id"), ". It ", def("area_include", "includes"), " all ", rs("entry"), " whose ", r("timestamp"), " is ", r("area_include", "included"), " in the ", r("time_range"), ", whose ", r("path"), " starts with the ", r("area"), "'s ", r("path"), ", and whose ", r("subspace_id"), " is the ", r("area"), "'s ", r("subspace_id"), " — if the ", r("area"), " has no ", r("subspace_id"), ", then the ", r("entry"), "'s ", r("subspace_id"), " has no bearing on whether it is ", r("area_include", "included"), " or not."),
  ]),


  hsection(
    "rangeszzzzzzzzz",
    "Ranges",
    hsection(
      "chessboard",
      "Intermission: Talking About Squares on a Chessboard",
      pinformative(
        marginale_inlineable(img(asset("meadowcap/chessboard.png"))),
        'On a chessboard, each point (square) is identified by a number between one and eight (inclusive) and a letter between "a" and "h" (inclusive). We can consider **2d ranges** that consist of a range of numbers and a range of letters.',
      ),
      pinformative(
        'Suppose we wanted to describe the set of squares with an odd number (1, 3, 5, or 7) and an "odd" letter ("a", "c", "e", or "g"). While this textual description listed only `4 + 4 = 8` objects, we need `4 x 4 = 16` ranges to *include* exactly these squares.',
      ),
      pinformative(
        "We wish to use the more efficient way of describing (certain) sets of squares that is employed by the textual description in a formal context. To this end, we define:",
      ),
      lis(
        "An **interval** is a set of values that can be exactly captured by a single *range*. For our notation, we write an interval as the range that captures it.",
        lis(
          "In other words, an *interval* is a set with a least element such that for any `x, z` from the set and for any `y` such that `x < y < z` we have that `y` is in the interval.",
        ),
        "A **2d product** consists of a set of numbers of a chess board, and a set of letters of a chessboard, both of which are a union of finitely many intervals.",
      ),
      pinformative(
        marginale_inlineable(img(asset("meadowcap/chessboard_product.png"))),
        "A *2d product* **includes** all squares whose number lies in the product's set of numbers and whose letter lies in the product's set of letters. For example, the 2d product `{[1, 1], [3, 3], [5, 5], [7, 7]}, {[a, a], [c, c], [e, e], [g, g]}` corresponds to the textual description above and *includes* the same square as the more verbose list of 16 *2d ranges*.",
      ),
      aside_block(
        "Notice that we define *2d products* in terms of *intervals*. not in terms of *ranges* that can be used to represent those *intervals*. The sets that make up single *2d product* can be represented by several different concrete ranges. But that only becomes an issue for encoding *2d products* — whether in memory as a datatype or for serialization — our definitions need not concern themselves with encoding details. The restriction to finite unions ensures that encodings are possible.",
      ),
      pinformative(
        "While *2d products* allow us to succinctly represent some sets of squares, observe that not every combination of squares admits a single 2d product that describes it *but no additional squares*.",
      ),
      pinformative(
        marginale_inlineable([
          img(asset("meadowcap/2d_intersection.png")),
          "An **intersection** of two 2d products.",
        ]),
        "Given two *2d products*, the squares *included* in one *and* the other of them can again be described by a 2d product; we call this *2d product* the **intersection** of the two initial *2d products*.",
      ),
      pinformative(
        marginale_inlineable([
          img(asset("meadowcap/2d_union.png")),
          "A **union** of two **mergeable** 2d products.",
          img(asset("meadowcap/2d_bad_union.png")),
          "Two 2d products which are _not_ **mergeable**.",
        ]),
        "Given two *2d products*, the squares *included* by one *or* the other cannot always be described by another *2d product*. But when such a *2d product* exists, we call it their **union**, and we say that the two initial *2d products* are **mergeable**.",
      ),
      pinformative(
        "It turns out that two non-equal, 2d products are *mergeable* if and only if their sets of intervals differ in at most one dimension.",
      ),
      pinformative(
        "Determining whether the union of a *set* of 2d products yields another 2d product is more difficult however, even a set of pairwise non-mergeable 2d products (i.e., no two products in the set are mergeable) can include a set of squares in total that can be represented by a 2d product:",
      ),
      pinformative(
        "On the bright side, the union of a set of *pairwise mergeable 2d products* can always be represented by a single 2d product, which we again call the **union** of the set of 2d products.",
      ),
      pinformative(
        "A set of pairwise non-equal 2d products is pairwise mergeable if and only if there is at most one dimension in which their sets of intervals differ. This characterization allows us to verify whether a set of 2d products is pairwise mergeable in linear time and constant space.",
      ),
    ),
    hsection(
      "end_of_intermission",
      "End of Intermission",
      pinformative(
        "We now define completely analogous concepts for the three-dimensional Willow space, and describe where these concepts occur in Meadowcap.",
      ),
      pinformative(
        marginale_inlineable(img(asset("meadowcap/3d_product.png"))),
        "A **3d product** consists of a set of timestamps, a set of paths, and a set of subspace IDs, all three of which of which are a union of finitely many intervals. A *3d product* **includes** all Willow entries whose timestamp lies in the product's set of timetamps, whose path lies in the product's set of paths, and whose subspace ID lies in the product's set of subspace IDs.",
      ),
      pinformative(
        "Each capability in Meadowcap grants access to some 3d product of entries in some namespace. Restricting capabilities works by supplying a 3d product, the resulting capability grants access to the *intersection* of that 3d product and the 3d product to which the parent capability grants access.",
      ),
      pinformative(
        marginale_inlineable([
          img(asset("meadowcap/3d_intersection.png")),
          "An **intersection** of two 3d products.",
        ]),
        "Given two 3d products, the entries *included* by both of them can again be described by a 3d product; we call this 3d product the **intersection** of the two initial 3d products.",
      ),
      pinformative(
        marginale_inlineable([
          img(asset("meadowcap/3d_union.png")),
          "A **union** of two **mergeable** 3d products.",
        ]),
        marginale_inlineable([
          img(asset("meadowcap/3d_bad_union.png")),
          "Two 3d products which are _not_ **mergeable**.",
        ]),
        "Meadowcap allows to merge several capabilities into a single new one. But we also require each capability to correspond to a single 3d product, hence we only allow the merging of sets of capabilities whose 3d products are *pairwise mergeable* according to the following definition:",
      ),
      pinformative(
        "Two 3d products are **mergeable** if and only if the union of the entries they *contain* can be exactly captured by a single 3d product. A set of 3d products is **pairwise mergeable** if any two 3d products in the set are *mergeable*. This is the case if and only if there is at most one dimension in which the values *included* by the ranges for that dimension differ between the 3d products.",
      ),
    ),
  ),
]);
