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
def_parameter_fn,
  def_parameter_value,
  link,
  lis,
  pinformative,
  site_template,
} from "../../main.ts";
import { small_img } from "../encodings.ts";

export const range3d_based_set_reconciliation: Expression = site_template(
  {
    title: "3d Range-Based Set Reconciliation",
    name: "3d_range_based_set_reconciliation",
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
      img(asset("3d_rbsr/fp_match.png")),
      figcaption(span({ class: 'purple'}, r('alfie')), " and ", span({ class: "orange" }, r("betty")), " produce matching ",   rs("3drbsr_fp"), " for all their entries within a given range.")
    ),
    
    pinformative("If they do not match, there are two options. First, the peer can split its set in half and then initiate set reconciliation for each half concurrently (by transmitting its hashes for both halves). Second, if the set is sufficiently small, the peer can instead simply transmit its items in the set. The other peer responds to this with all other items that it held in the set, completing the process of reconciliation."),

    figure(
      img(asset("3d_rbsr/fp_nonmatching.png")),
      figcaption("sam: I think this image could do with a caption, and I think you would be really good at writing it.")
    ),
   
    pinformative("Overall, the peers collaboratively drill down to the differences between their two sets in a logarithmic number of communication rounds, spending only little bandwidth on those regions of the original sets where they hold the same items. Note that peers can actually split sets into arbitrarily many subsets in each step. Splitting into more subsets per step decreases the total number of communication rounds."),
    
    figure(
      img(asset("3d_rbsr/drilling_down.png")),
      figcaption("Split apart ", span({class: 'vermillion'},"non-equal ranges"),  " to hone in on the locations of any differences, while disregarding ", span({class: 'blue'}, "equal ranges"), ".")
    ),

    pinformative(def({id: "3drbsr", singular: "3d range-based set reconciliation"}, "3d range-based set reconciliation", [
      def_fake({id: "3drbsr", singular: "3d range-based set reconciliation"}), " is an algorithm for letting two peers compute the union of their ", rs("LengthyEntry"), " in some ", r("3dRange"), " by exchanging ", rs("3dRangeFingerprint"), ", ", rs("3dRangeEntrySet"), ", and ", rs("3dRangeConfirmation"), ".",
    ]), " takes these ideas and applies them to Willow. The core design decision is to delimit sets of ", rs("LengthyEntry"), " via ", rs("3dRange"), ". When a peer splits its ", rs("3dRange"), ", it is crucial for overall efficiency to not split based on volume (for example by splitting the ", rs("3dRangeTime"), " in half)", ", but to split into subranges in which the peer holds roughly the same number of ", rs("Entry"), "."),

    pinformative("Let ", def_type({id: "3drbsr_fp", singular: "Fingerprint", plural: "Fingerprints"}), " denote the type of hashes of ", rs("LengthyEntry"), " that the peers exchange. Then the precise pieces of information that peers exchange are the following:"),

    pseudocode(
      new Struct({
        id: "3dRangeFingerprint",
        comment: ["The ", r("3drbsr_fp"), " over all ", rs("LengthyEntry"), " a peer holds in some ", r("3dRange"), "."],
        fields: [
          {
            id: "3dRangeFingerprintRange",
            name: "3d_range",
            comment: ["The ", r("3dRange"), " in question."],
            rhs: r("3dRange"),
          },
          {
            id: "3dRangeFingerprintFingerprint",
            name: "fingerprint",
            comment: ["The ", r("3drbsr_fp"), " over the ", rs("LengthyEntry"), " that the sender holds in the ", r("3dRangeFingerprintRange"), "."],
            rhs: r("3drbsr_fp"),
          },
        ],
      }),

      new Struct({
        id: "3dRangeEntrySet",
        comment: ["The set of ", rs("LengthyEntry"), " a peer holds in some ", r("3dRange"), "."],
        fields: [
          {
            id: "3dRangeEntrySetRange",
            name: "3d_range",
            comment: ["The ", r("3dRange"), " in question."],
            rhs: r("3dRange"),
          },
          {
            id: "3dRangeEntrySetEntries",
            name: "entries",
            comment: ["The ", rs("LengthyEntry"), " that the sender holds in the ", r("3dRangeEntrySetRange"), "."],
            rhs: pseudo_array(r("LengthyEntry")),
          },
          {
            id: "3dRangeEntrySetWantResponse",
            name: "want_response",
            comment: ["A boolean flag to indicate whether the sender wishes to receive the other peer’s ", r("3dRangeEntrySet"), " for the same ", r("3dRangeEntrySetRange"), " in return."],
            rhs: r("Bool"),
          },
        ],
      }),

      new Struct({
        id: "3dRangeConfirmation",
        comment: ["Lets a peer confirm to the other peer that no further work needs to be performed in some ", r("3dRange"), " (because of matching ", rs("3drbsr_fp"), ")."],
        fields: [
          {
            id: "3dRangeConfirmationRange",
            name: "3d_range",
            comment: ["The ", r("3dRange"), " in question."],
            rhs: r("3dRange"),
          },
        ],
      }),
    ),

    pinformative("To initiate reconciliation of a ", r("3dRange"), ", a peer sends its ", r("3dRangeFingerprint"), ". Upon receiving a ", r("3dRangeFingerprint"), ", a peer computes the ", r("3drbsr_fp"), " over its local ", rs("LengthyEntry"), " in the same range. If it matches, the peer sends a ", r("3dRangeConfirmation"), " for that range. Otherwise, it either sends a number of ", rs("3dRangeFingerprint"), " whose ", rs("3dRange"), " cover the ", r("3dRange"), " for which it received the mismatching ", r("3drbsr_fp"), ". Or it replies with its ", r("3dRangeEntrySet"), " for that ", r("3dRange"), ", with the ", r("3dRangeEntrySetWantResponse"), " flag set to ", code("true"), ". To any such ", r("3dRangeEntrySet"), ", a peer replies with its own ", r("3dRangeEntrySet"), ", setting the ", r("3dRangeEntrySetWantResponse"), " flag to ", code("false"), ", and omitting all ", rs("LengthyEntry"), " it had just received in the other peer’s ", r("3dRangeEntrySet"), "."),

    hsection("3drbsr_parameters", "Fingerprinting", [
      pinformative(R("3drbsr"), " requires the ability to hash arbitrary sets of ", rs("LengthyEntry"), " into values of some type ", r("3drbsr_fp"), ". To quickly compute ", rs("3drbsr_fp"), ", it helps if the ", r("3drbsr_fp"), " for a ", r("3dRange"), " can be assembled from precomputed ", rs("3drbsr_fp"), " of other, smaller ", r("3dRange"), ". For this reason, we define the fingerprinting function in terms of some building blocks:"),

      pinformative("First, we require a function ", def_parameter_fn({id: "3drbsr_fp_singleton", singular: "fingerprint_singleton"}), " that hashes individual ", rs("LengthyEntry"), " into the set ", r("3drbsr_fp"), ". This hash function should take into account all aspects of the ",  r("LengthyEntry"), ": modifying its ", r("entry_namespace_id"), ", ", r("entry_subspace_id"), ", ", r("entry_path"), ", ", r("entry_timestamp"), ", ", r("entry_payload_digest"), ", ", r("entry_payload_length"), ", or its number of ", r("lengthy_entry_available"), " bytes, should result in a completely different ", r("3drbsr_fp"), "."),

      pinformative("Second, we require an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), " and ", sidenote(link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), ["Classic range-based set reconciliation does not require commutativity. We require it because we do not wish to prescribe how to linearise three-dimensional data into a single order."]), " function ", def_parameter_fn({id: "3drbsr_fp_combine", singular: "fingerprint_combine"}), " that maps two ", rs("3drbsr_fp"), " to a single new ", r("3drbsr_fp"), ". The ", r("3drbsr_fp_combine"), " function must further have a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " ", def_parameter_value({ id: "3drbsr_neutral", singular: "fingerprint_neutral"}), "."),

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
                td(small_img(asset("3d_rbsr/fp_bottle_empty.png"))),
              ),
            ),
            tbody(
              td([
                "{ ",
                small_img(asset("3d_rbsr/fp_apple.png"), {
                  style: "vertical-align:middle",
                }),
                " }",
              ]),
              td(small_img(asset("3d_rbsr/fp_bottle_yellow.png"))),
            ),
            tbody(
              td([
                "{ ",
                small_img(asset("3d_rbsr/fp_apple.png"), {
                  style: "vertical-align:middle",
                }),
                small_img(asset("3d_rbsr/fp_celery.png"), {
                  style: "vertical-align:middle",
                }),
                small_img(asset("3d_rbsr/fp_lemon.png"), {
                  style: "vertical-align:middle",
                }),
                " }",
              ]),
              td(small_img(asset("3d_rbsr/fp_bottle_green.png"))),
            ),
          ),
          figcaption("A metaphorical juicing fingerprint. Although the number of ingredients in the set may change, the size of the bottle does not. Each bottle’s juice inherits its unique flavour from its ingredients.")
        ),
      ),

      pinformative("Given these building blocks, we define the function ", def({id: "3drbsr_fingerprint", singular: "fingerprint"}), " from sets of ", rs("LengthyEntry"), " to ", r("3drbsr_fp"), ":", lis(
        ["applying ", r("3drbsr_fingerprint"), " to the empty set yields ", r("3drbsr_neutral"), ","],
        ["applying ", r("3drbsr_fingerprint"), " to a set containing exactly one ", r("LengthyEntry"), " yields the same result as applying ", r("3drbsr_fp_singleton"), " to that ", r("LengthyEntry"), ", and"],
        ["applying ", r("3drbsr_fingerprint"), " to any other set of ", rs("LengthyEntry"), " yields the result of applying ", r("3drbsr_fp_singleton"), " to all members of the set individually and then combining the resulting ", rs("3drbsr_fp"), " with ", r("3drbsr_fp_combine"), " (grouping and ordering do not matter because of associativity and commutativity)."],
      )),

      pinformative("For ", r("3drbsr"), " to work correctly, ", r("3drbsr_fingerprint"), " must map distinct sets of ", rs("LengthyEntry"), " to distinct ", rs("3drbsr_fp"), " with high probability, even when facing maliciously crafted input sets. The ", link("range-based set reconciliation paper", "https://github.com/AljoschaMeyer/rbsr_short/blob/main/main.pdf"), " surveys suitable, cryptographically secure hash functions in section 5B. All but the Cayley hashes use commutative ", r("3drbsr_fp_combine"), " functions, and are thus suitable for ", r("3drbsr"), "."),
    ]),
  ],
);
