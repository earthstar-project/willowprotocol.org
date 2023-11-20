import { Expression } from "macro";
import { aside_block, lis, pinformative, site_template } from "../main.ts";
import { hsection } from "../../hsection.ts";
import { figcaption, figure, img } from "../../h.ts";
import { asset } from "../../out.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";

export const threedProducts: Expression = site_template({
  name: "3d_products",
  title: "3d Products",
}, [
  hsection(
    "ranges",
    "Ranges",
    pinformative(
      "When restricting capabilities, we need to express which entries the restricted capability still has access to. We do so via ranges of timestamps, paths, and subspace IDs. A range is either **closed**, consisting of a **start** value and an **end** value, or it is **open**, consisting only of a **start** value. An **inclusive** *closed* range **includes** all values greater than or equal to the start value and strictly less than the end value. An **exclusive** *closed* range **includes** all values greater than or equal to the start value and less than or equal to the end value. An *open* range **includes** *all* values greater than or equal to the start value. Two ranges are **equivalent** so if they *include* exactly the same values.",
    ),
    figure(
      img(asset("meadowcap/range_types_inclusion.png")),
      figcaption(
        "An exclusive closed range, an inclusive closed range, and an open range.",
      ),
    ),
    pinformative(
      "A time range is a range of timestamps (64-bit unsigned integers), sorted numerically.",
    ),
    pinformative(
      "A **path range** is a range of Willow paths (bytestrings of up to `k` bytes), sorted [lexicographically](https://en.wikipedia.org/wiki/Lexicographic_order).",
    ),
    pinformative(
      "A **subspace range** is a range of Willow subspace IDs (a type supplied as a protocol parameter), sorted by some [total order](https://en.wikipedia.org/wiki/Total_order) (also supplied as a protocol parameter).",
    ),
    pinformative(
      marginale_inlineable(img(asset("meadowcap/3d_range.png"))),
      "A **3d range** (three-dimensional range) is a triplet of a *time range*, a *path range*, and a *subspace range*. It **includes** all *entries* whose timestamp is included in the *time range* *and* whose path is included in the *path range* *and* whose subspace is included in the *subspace range*.",
    ),
    pinformative(
      "In the preceeding drawing, entries with greater paths appear to the right of entries with lesser paths, entries with greater subspace IDs appear above entries with lesser subspace IDs, and entries with greater timestamps appear further back then entries with lesser timestamps. This drawing suggests a powerful way of thinking about Willow: a namespace is a collection of points (entries) in a three-dimensional space. Or more accurately, a namespace is a *mapping* from points in this three-dimensional space to hashes and sizes of payloads.",
    ),
    pinformative(
      "We need to define some concepts around this three-dimensional space. These definitions can be a bit abstract at times, so we first explain some analogous two-dimensional concepts in a much simpler space: a chessboard.",
    ),
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
