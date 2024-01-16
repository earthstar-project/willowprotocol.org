import { def, def_fake, R, r, rs } from "../../../defref.ts";
import {
  code,
  em,
  figcaption,
  figure,
  img,
  span,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { marginale, marginale_inlineable, sidenote } from "../../../marginalia.ts";
import { asset } from "../../../out.ts";
import { def_type, pseudo_array, pseudocode, Struct } from "../../../pseudocode.ts";
import { Expression } from "../../../tsgen.ts";
import {
blue,
def_parameter_fn,
  def_parameter_value,
  link,
  lis,
  orange,
  pinformative,
  purple,
  site_template,
  vermillion,
} from "../../main.ts";
import { small_img } from "../encodings.ts";

export const range3d_based_set_reconciliation: Expression = site_template(
  {
    title: "3d Range-Based Set Reconciliation",
    name: "d3_range_based_set_reconciliation",
  },
  [
    pinformative("When two peers wish to synchronise data, they typically first exchange which ", rs("Area"), " in which ", rs("namespace"), " they are interested in. Intersecting these ", rs("Area"), " yields the sets of ", rs("Entry"), " for which they then need to bring each other up to speed. In this document, we present a strategy for doing so efficiently."),

    pinformative("Given the ", rs("Entry"), " that the peers have available, there can be two cases that necessitate data exchange. First, one peer might have an ", r("Entry"), " that the other does not have, and second, the peers might hold nonequal parts of the ", r("Payload"), " of some common ", r("Entry"), "."),

    pinformative("As a first step to solving the problem, we simplify it. If ", rs("Entry"), " contained information about locally available ", r("Payload"), " bytes, then both cases would merge into a single case: one peer might have a datum that the other lacks. Hence, we do not synchronise ", rs("Entry"), " directly, but ", rs("LengthyEntry"), ":"),

    pseudocode(
      new Struct({
        id: "LengthyEntry",
        plural: "LengthyEntries",
        comment: ["An ", r("Entry"), " together with information about how much of its ", r("Payload"), " a peer holds."],
        fields: [
          {
            id: "lengthy_entry_entry",
            name: "entry",
            comment: ["The ", r("Entry"), " in question."],
            rhs: r("Entry"),
          },
          {
            id: "lengthy_entry_available",
            name: "available",
            comment: ["The number of consecutive bytes from the start of the ", r("lengthy_entry_entry"), "’s ", r("Payload"), " that the peer holds."],
            rhs: r("U64"),
          },
        ],
      }),
    ),

    pinformative("The task of the two peers then becomes conceptually simple: they each have a set of ", rs("LengthyEntry"), ", and they need to inform each other about all ", rs("LengthyEntry"), " the other party does not have, that is, they each need to compute the union of their two sets. In the scientific literature, this problem is known as ", em("set "), sidenote(em("reconciliation"), [link(`Minsky, Yaron, Ari Trachtenberg, and Richard Zippel. "Set reconciliation with nearly optimal communication complexity." IEEE Transactions on Information Theory 49.9 (2003): 2213-2218.`, "https://ecommons.cornell.edu/server/api/core/bitstreams/c3fff828-cfb8-416a-a28b-8afa59dd2d73/content")]), "."),

    pinformative("Once the two peers have reconciled their sets, they can filter out ", rs("Entry"), " that overwrite each other, and they can separately request any missing (suffixes of) ", rs("Payload"), ". Going forward, we thus concentrate on the set reconciliation part only."),

    pinformative("To perform set reconciliation, we adapt the approach of ", em("range-based set "), sidenote(em("reconciliation"), [link(`https://github.com/AljoschaMeyer/rbsr_short/blob/main/main.pdf`, "https://github.com/AljoschaMeyer/rbsr_short/blob/main/main.pdf"), " (this peer-reviewed paper was presented at ", link("SRDS2023", "https://srds-conference.org/"), ", the proceedings have not been published yet)"]), marginale(["For a more accessible introduction to the technique, see also ", link("this webpage", "https://logperiodic.com/rbsr.html"), "."]), "."),

    pinformative("Range-based set reconciliation solves the problem recursively. To reconcile two sets, one peer first computes a hash over all items in its set, and sends this fingerprint to the other peer. That peer then computes the fingerprint over its items as well. If the fingerprints match, they are done reconciling."),
    
    figure(
      img(asset("3d_rbsr/fp_match.png"), `A glorified visualisation of equality: hashing the same objects yields the same fingerprints.`),
      figcaption(purple("Alfie"), " and ", orange("Betty"), " produce equal fingerprints for all their ", rs("Entry"), " in a given ", r("D3Range"), ".")
    ),
    
    pinformative("If they do not match, there are two options. First, the peer can split its set in half and then initiate set reconciliation for each half concurrently (by transmitting its hashes for both halves). Second, if the set is sufficiently small, the peer can instead simply transmit its items in the set. The other peer responds to this with all other items that it held in the set, completing the process of reconciliation."),

    figure(
      img(asset("3d_rbsr/fp_nonmatching.png"), `A flow diagram that is already described in the caption.`),
      figcaption(purple("Alfie"), " and ", orange("Betty"), " produce non-equal fingerprints. ", purple("Alfie"), " splits the ", r("D3Range"), " in two, yielding a ", r("D3Range"), " ", r("d3_range_include", "including"), " ", rs("Entry"), " ", code("A"), " and ", code("B"), ", and another ", r("D3Range"), " ", r("d3_range_include", "including"), " ", code("C"), ", and sends these ", rs("D3Range"), " and their fingerprints to ", orange("Betty"), ". ", orange("Betty"), " produces a matching fingerprint for the first ", r("D3Range"), ". As the other, mismatched ", r("D3Range"), " includes so few ", rs("Entry"), ", ", orange("Betty"), " sends her ", rs("Entry"), " ", code("Q"), " and ", code("Y"), " to ", purple("Alfie"), ". In response, ", purple("Alfie"), " sends ", r("Entry"), " ", code("C"), " to ", orange("Betty"), ".")
    ),
   
    pinformative("Overall, the peers collaboratively drill down to the differences between their two sets in a logarithmic number of communication rounds, spending only little bandwidth on those regions of the original sets where they hold the same items. Note that peers can actually split sets into arbitrarily many subsets in each step. Splitting into more subsets per step decreases the total number of communication rounds."),
    
    figure(
      img(asset("3d_rbsr/drilling_down.png"), `A contiguous range gets recursively split into subranges. Some of them are coloured blue to indicate matching fingerprints; these are not split further. The total picture is that of a thinning tree growing toward the bottem, showing the few areas that require actual data exchange.`),
      figcaption("Split apart ", vermillion("non-equal ranges"), " to hone in on the locations of any differences, while disregarding ", blue("equal ranges"), ".")
    ),

    pinformative(def({id: "d3rbsr", singular: "3d range-based set reconciliation"}, "3d range-based set reconciliation", [
      def_fake({id: "d3rbsr", singular: "3d range-based set reconciliation"}), " is an algorithm for letting two peers compute the union of their ", rs("LengthyEntry"), " in some ", r("D3Range"), " by exchanging ", rs("D3RangeFingerprint"), " and ", rs("D3RangeEntrySet"), ".",
    ]), " takes these ideas and applies them to Willow. The core design decision is to delimit sets of ", rs("LengthyEntry"), " via ", rs("D3Range"), ". When a peer splits its ", rs("D3Range"), ", it is crucial for overall efficiency to not split based on volume (for example, by splitting the ", rs("D3RangeTime"), " in half numerically)", ", but to split into subranges in which the peer holds roughly the same number of ", rs("Entry"), "."),

    pinformative("Let ", def_type({id: "d3rbsr_fp", singular: "Fingerprint", plural: "Fingerprints"}), " denote the type of hashes of ", rs("LengthyEntry"), " that the peers exchange. Then the precise pieces of information that peers exchange are the following:"),

    pseudocode(
      new Struct({
        id: "D3RangeFingerprint",
        name: "3dRangeFingerprint",
        comment: ["The ", r("d3rbsr_fp"), " over all ", rs("LengthyEntry"), " a peer holds in some ", r("D3Range"), "."],
        fields: [
          {
            id: "D3RangeFingerprintRange",
            name: "3d_range",
            comment: ["The ", r("D3Range"), " in question."],
            rhs: r("D3Range"),
          },
          {
            id: "D3RangeFingerprintFingerprint",
            name: "fingerprint",
            comment: ["The ", r("d3rbsr_fp"), " over the ", rs("LengthyEntry"), " that the sender holds in the ", r("D3RangeFingerprintRange"), "."],
            rhs: r("d3rbsr_fp"),
          },
        ],
      }),

      new Struct({
        id: "D3RangeEntrySet",
        name: "3dRangeEntrySet",
        comment: ["The set of ", rs("LengthyEntry"), " a peer holds in some ", r("D3Range"), "."],
        fields: [
          {
            id: "D3RangeEntrySetRange",
            name: "3d_range",
            comment: ["The ", r("D3Range"), " in question."],
            rhs: r("D3Range"),
          },
          {
            id: "D3RangeEntrySetEntries",
            name: "entries",
            comment: ["The ", rs("LengthyEntry"), " that the sender holds in the ", r("D3RangeEntrySetRange"), "."],
            rhs: pseudo_array(r("LengthyEntry")),
          },
          {
            id: "D3RangeEntrySetWantResponse",
            name: "want_response",
            comment: ["A boolean flag to indicate whether the sender wishes to receive the other peer’s ", r("D3RangeEntrySet"), " for the same ", r("D3RangeEntrySetRange"), " in return."],
            rhs: r("Bool"),
          },
        ],
      }),
    ),

    pinformative("To initiate reconciliation of a ", r("D3Range"), ", a peer sends its ", r("D3RangeFingerprint"), ". Upon receiving a ", r("D3RangeFingerprint"), ", a peer computes the ", r("d3rbsr_fp"), " over its local ", rs("LengthyEntry"), " in the same range."),

    pinformative("If it does not match, the peer either sends a number of ", rs("D3RangeFingerprint"), " whose ", rs("D3Range"), " cover the ", r("D3Range"), " for which it received the mismatching ", r("d3rbsr_fp"), ". Or it replies with its ", r("D3RangeEntrySet"), " for that ", r("D3Range"), ", with the ", r("D3RangeEntrySetWantResponse"), " flag set to ", code("true"), "."),

    pinformative("To any such ", r("D3RangeEntrySet"), ", a peer replies with its own ", r("D3RangeEntrySet"), ", setting the ", r("D3RangeEntrySetWantResponse"), " flag to ", code("false"), ", and omitting all ", rs("LengthyEntry"), " it had just received in the other peer’s ", r("D3RangeEntrySet"), "."),

    pinformative("When a peer receives a ", r("D3RangeFingerprint"), " that matches the ", r("d3rbsr_fp"), " over its local ", rs("LengthyEntry"), " in the same ", r("D3Range"), ", the peer should reply with an empty ", r("D3RangeEntrySet"), " for that ", r("D3Range"), ", setting the ", r("D3RangeEntrySetWantResponse"), " flag to ", code("false"), ". This notifies the sender of the ", r("D3RangeFingerprint"), " that reconciliation has successfully concluded for the ", r("D3Range"), "."),

    hsection("d3rbsr_parameters", "Fingerprinting", [
      pinformative(R("d3rbsr"), " requires the ability to hash arbitrary sets of ", rs("LengthyEntry"), " into values of some type ", r("d3rbsr_fp"), ". To quickly compute ", rs("d3rbsr_fp"), ", it helps if the ", r("d3rbsr_fp"), " for a ", r("D3Range"), " can be assembled from precomputed ", rs("d3rbsr_fp"), " of other, smaller ", r("D3Range"), ". For this reason, we define the fingerprinting function in terms of some building blocks:"),

      pinformative("First, we require a function ", def_parameter_fn({id: "d3rbsr_fp_singleton", singular: "fingerprint_singleton"}), " that hashes individual ", rs("LengthyEntry"), " into the set ", r("d3rbsr_fp"), ". This hash function should take into account all aspects of the ",  r("LengthyEntry"), ": modifying its ", r("entry_namespace_id"), ", ", r("entry_subspace_id"), ", ", r("entry_path"), ", ", r("entry_timestamp"), ", ", r("entry_payload_digest"), ", ", r("entry_payload_length"), ", or its number of ", r("lengthy_entry_available"), " bytes, should result in a completely different ", r("d3rbsr_fp"), "."),

      pinformative("Second, we require an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), " and ", sidenote(link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), ["Classic range-based set reconciliation does not require commutativity. We require it because we do not wish to prescribe how to linearise three-dimensional data into a single order."]), " function ", def_parameter_fn({id: "d3rbsr_fp_combine", singular: "fingerprint_combine"}), " that maps two ", rs("d3rbsr_fp"), " to a single new ", r("d3rbsr_fp"), ". The ", r("d3rbsr_fp_combine"), " function must further have a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " ", def_parameter_value({ id: "d3rbsr_neutral", singular: "fingerprint_neutral"}), "."),

      marginale_inlineable(
        figure(
          table(
            thead(
              tr(
                th("Set"),
                th("Fingerprint"),
              ),
            ),
            tbody(
              tr(
                td("{ }"),
                td(small_img(asset("3d_rbsr/fp_bottle_empty.png"), `An empty bottle.`)),
              ),
            ),
            tbody(
              td([
                "{ ",
                small_img(asset("3d_rbsr/fp_apple.png"), `A red apple.`, {
                  style: "vertical-align:middle",
                }),
                " }",
              ]),
              td(small_img(asset("3d_rbsr/fp_bottle_yellow.png"), `A bottle of apple juice.`)),
            ),
            tbody(
              td([
                "{ ",
                small_img(asset("3d_rbsr/fp_apple.png"), `A red apple.`, {
                  style: "vertical-align:middle",
                }),
                " ",
                small_img(asset("3d_rbsr/fp_celery.png"), `A celery.`, {
                  style: "vertical-align:middle",
                }),
                " ",
                small_img(asset("3d_rbsr/fp_lemon.png"), `A lemon.`, {
                  style: "vertical-align:middle",
                }),
                " }",
              ]),
              td(small_img(asset("3d_rbsr/fp_bottle_green.png"), `A bottle of apple-celery-lemon smoothie. Yum?`)),
            ),
          ),
          figcaption("A metaphorical juicing fingerprint. Although the number of ingredients in the set may change, the size of the bottle does not. Each bottle’s juice inherits its unique flavour from its ingredients.")
        ),
      ),

      pinformative("Given these building blocks, we define the function ", def({id: "ddrbsr_fingerprint", singular: "fingerprint"}), " from sets of ", rs("LengthyEntry"), " to ", r("d3rbsr_fp"), ":", lis(
        ["applying ", r("ddrbsr_fingerprint"), " to the empty set yields ", r("d3rbsr_neutral"), ","],
        ["applying ", r("ddrbsr_fingerprint"), " to a set containing exactly one ", r("LengthyEntry"), " yields the same result as applying ", r("d3rbsr_fp_singleton"), " to that ", r("LengthyEntry"), ", and"],
        ["applying ", r("ddrbsr_fingerprint"), " to any other set of ", rs("LengthyEntry"), " yields the result of applying ", r("d3rbsr_fp_singleton"), " to all members of the set individually and then combining the resulting ", rs("d3rbsr_fp"), " with ", r("d3rbsr_fp_combine"), " (grouping and ordering do not matter because of associativity and commutativity)."],
      )),

      pinformative("For ", r("d3rbsr"), " to work correctly, ", r("ddrbsr_fingerprint"), " must map distinct sets of ", rs("LengthyEntry"), " to distinct ", rs("d3rbsr_fp"), " with high probability, even when facing maliciously crafted input sets. The ", link("range-based set reconciliation paper", "https://github.com/AljoschaMeyer/rbsr_short/blob/main/main.pdf"), " surveys suitable, cryptographically secure hash functions in section 5B. All but the Cayley hashes use commutative ", r("d3rbsr_fp_combine"), " functions, and are thus suitable for ", r("d3rbsr"), "."),
    ]),
  ],
);
