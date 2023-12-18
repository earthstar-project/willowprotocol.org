import { def, def_fake, R, r, rs } from "../../../defref.ts";
import {
  code,
  em,
  figcaption,
  figure,
  img,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { marginale_inlineable } from "../../../marginalia.ts";
import { asset } from "../../../out.ts";
import { Expression } from "macro";
import {
  def_parameter_type,
  def_parameter_value,
  def_value,
  link,
  lis,
  pinformative,
  site_template,
} from "../../main.ts";
import { small_img } from "../encodings.ts";

export const range3d_based_set_reconciliation: Expression = site_template(
  {
    title: "3d-Range-Based Set Reconciliation",
    name: "3d_range_based_set_reconciliation",
  },
  [
    pinformative("Given a ", r("3dRange"), " that both peers in a sync session (Alfie and Betty) know, how can they efficiently update each other about their ", rs("Entry"), " in that ", r("3dRange"), "? In this document we describe ", def({ id: "3drbsr", singular: "3d-range-based set reconciliation" }), " — a three dimensional extension of ", link( "range-based set reconciliation", "https://arxiv.org/pdf/2212.13567.pdf"), " — for solving this problem."),

    marginale_inlineable(img(asset("3d_rbsr/pbsr.png"))),

    pinformative("The general idea of ", r("3drbsr"), " is to have Alfie send a small ", def({ id: "entry_fingerprint", singular: "fingerprint" }), " over all his ", rs("Entry"), " in the ", r("3dRange"), ". Upon receiving this ", r("entry_fingerprint"), ", Betty computes the ", r("entry_fingerprint"), " over all of ", em("her"), " ", rs("Entry"), " in the same ", r("3dRange"), ". If the ", rs("entry_fingerprint"), " match, she can conclude that no further data exchange is necessary."),

    pinformative( "If they do not match, then Betty splits the ", r("3dRange"), " into two smaller ", rs("3dRange"), " (call them ", def_value("sub1"), " and ", def_value("sub2"), ") that contain roughly half of her ", rs("Entry"), " (from the original ", r("3dRange"), ") each and whose union gives the original ", r("3dRange"), " again. Then she computes the ", rs("entry_fingerprint"), " of all ", rs("Entry"), " in ", r("sub1"), " and sends both ", r("sub1"), "and its ", r("entry_fingerprint"), " to Alfie. We call such a pair of a ", r("3dRange"), " and a ", r("entry_fingerprint"), " a ", def({ id: "range_fingerprint", singular: "range fingerprint" }), ". Betty also sends the ", r("range_fingerprint"), " for ", r("sub2"), ". Notice that the initial mesage where Alfie sent his ", r("entry_fingerprint"), " for the initial ", r("3dRange"), " has been a ", r("range_fingerprint"), " as well."),

    pinformative("When Alfie receives these ", rs("range_fingerprint"), ", he can handle them in exactly the same way: he computes his local ", r("entry_fingerprint"), " over the same ", rs("3dRange"), ", compares the ", rs("entry_fingerprint"), ", knows that no further work is necessary if they are equal, and proccesses any mismatching ", rs("3dRange"), " by splitting them."),

    pinformative("At any point, a peer can opt to send a ", r("range_entry_set"), " instead of a ", r("range_fingerprint"), ". A ", def({ id: "range_entry_set", singular: "range_entry_set" }), " consists of a ", r("3dRange"), ", the set of all ", rs("Entry"), " that the peer has within that ", r("3dRange"), ", and a boolean flag to indicate whether the other peer should reply with its ", r("range_entry_set"), " for the same ", r("3dRange"), " as well. Such a reply should ", em("not"), " set that flag, and it should not contain any of the ", rs("Entry"), " that were part of the ", r("range_entry_set"), " that it is replying to."),

    figure(img(asset("3d_rbsr/drilling_down.png"))),

    pinformative("By recursively splitting ", rs("3dRange"), " with non-equal ", rs("entry_fingerprint"), ", the peers can drill down to the subareas where actual reconciliation (by exchanging ", r("range_entry_set"), ") is required. Note that the peers need not agree on when to switch from ", rs("range_fingerprint"), " to ", rs("range_entry_set"), ", or even on into how many ", rs("3dRange"), " to subdivide in each recursion step. As long as they both make progress on every ", r("range_fingerprint"), " they receive, they will successfully reconcile their ", rs("Entry"), "."),

    pinformative("In Willow, it is possible for a peer to store an ", r("Entry"), " but to not hold its full ", r("Payload"), ". We can easily modify ", r("3drbsr"), " to let peers detect partial ", r("Payload"), " on which they could make progress, by incorporating the length of the locally available ", r("Payload"), " bytes into each ", r("entry_fingerprint"), ". More precisely, let ", code("e"), " be an ", r("Entry"), ", and let ", code("l"), " be the number of consecutive bytes from the start of the ", r("Payload"), " of ", code("e"), " that is locally available. Then we call the pair of ", code("e"), " and ", code("l"), " a ", def({id: "lengthy_entry", singular: "lengthy entry", plural: "lengthy entries"}, "lengthy entry", ["A ", def_fake("lengthy_entry", "lengthy entry"), " is a pair of an ", r("Entry")," and a 64 bit unsigned integer that denotes the number of consecutive bytes from the start of the ", r("Entry"), "’s payload that is available to the peer."]), "."),

    hsection("3drbsr_parameters", "Parameters", [
      pinformative(R("3drbsr"), " requires the ability to hash arbitrary sets of ", rs("lengthy_entry"), " into values of a type ", def_parameter_type({id: "3drbsr_fingerprint", singular: "Fingerprint"}), " via a function ", def_parameter_value({ id: "3drbsr_fp", singular: "fingerprint" }), ". In order to allow for certain efficient implementation techniques, ", r("3drbsr_fp"), " is not an arbitrary protocol parameter but is constructed from some other protocol parameters."),

      pinformative("First, we require a function ", def_parameter_value({id: "3drbsr_fp_singleton", singular: "fingerprint_singleton"}), " that hashes individual ", rs("lengthy_entry"), " into the set ", r("3drbsr_fingerprint"), ". This hash function should take into account all aspects of the ",  r("lengthy_entry"), ": modifying its ", r("entry_namespace_id"), ", ", r("entry_subspace_id"), ", ", r("entry_path"), ", ", r("entry_timestamp"), ", ", r("entry_payload_digest"), ", ", r("entry_payload_length"), ", or the number of available bytes, should result in a completely different ", r("entry_fingerprint"), "."),

      pinformative("Second, we require an ", link("associative", "https://en.wikipedia.org/wiki/Associative_property"), " and ", link("commutative", "https://en.wikipedia.org/wiki/Commutative_property"), " function ", def_parameter_value({id: "3drbsr_fp_combine", singular: "fingerprint_combine"}), " that maps two ", rs("3drbsr_fingerprint"), " to a single new ", r("3drbsr_fingerprint"), ", with a ", link("neutral element", "https://en.wikipedia.org/wiki/Identity_element"), " ", def({ id: "3drbsr_neutral", singular: "fingerprint_neutral"}), "."),

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
          figcaption("A metaphorical juicing fingerprint. Although the number of ingredients in the set may change, the size of the bottle does not. Each bottle's juice inherits its unique flavour from its ingredients.")
        ),
      ),

      pinformative("Given these protocol parameters, the function ", r("3drbsr_fp"), " is defined as follows:"),

      lis(
        ["applying ", r("3drbsr_fp"), " to the empty set yields ", r("3drbsr_neutral"), ","],
        ["applying ", r("3drbsr_fp"), " to a set containing exactly one ", r("lengthy_entry"), " yields the same result as applying ", r("3drbsr_fp_singleton"), " to that entry, and"],
        ["applying ", r("3drbsr_fp"), " to any other set of ", rs("lengthy_entry"), " yields the result of applying ", r("3drbsr_fp_singleton"), " to all members of the set individually and then combining the resulting ", rs("entry_fingerprint"), " with ", r("3drbsr_fp_combine"), " (grouping and ordering do not matter because of associativity and commutativity respectively)."],
      ),
    ]),
  ],
);
