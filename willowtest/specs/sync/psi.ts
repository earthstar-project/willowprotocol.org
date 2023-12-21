import { def, preview_scope, r, rs, r$, R } from "../../../defref.ts";
import { code, div, em, img } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { $, $comma, $dot } from "../../../katex.ts";
import {
  marginale,
  marginale_inlineable,
  sidenote,
} from "../../../marginalia.ts";
import { asset } from "../../../out.ts";
import { Expression } from "macro";
import {
def_fn,
  def_value,
  def_value$,
  link,
  lis,
  pinformative,
  site_template,
} from "../../main.ts";
import { def_type, function_call } from "../../../pseudocode.ts";

const apo = "’";

const Items = "\\mathrm{Items}";
const item_to_group = "\\mathrm{item\\_to\\_group}";

export const psi: Expression = site_template(
  {
    title: "Private Set Intersection",
    name: "private_set_intersection",
  },
  [
    pinformative(
      link("Private set intersection", "https://en.wikipedia.org/wiki/Private_set_intersection", ),
      " (", def({ id: "psi", singular: "PSI" }), ") protocols allow two peers to establish which items they have in common without revealing any non-common items to the other party. The ", r("WGPS"), " employs a classic ", link("technique by Huberman, Franklin, and Hogg", "https://dl.acm.org/doi/pdf/10.1145/336992.337012"), ", which we explain in this document.",
    ),

    hsection("private_equality_testing", "Private Equality Testing", [
      pinformative(
        "We start by considering a related but simpler problem: two peers — Alfie and Betty — who hold a single item each wish to determine whether they hold the same item, without revealing any information about their item in case of ", sidenote("inequality", [
          "If the peers simply exchanged hashes of their items, peers could learn which other peers have equal items, so this is not a sufficiently private solution.",
        ]), ". Before giving the precise mathematical formulation, we describe the solution by way of analogy.",
      ),

      marginale_inlineable(img(asset("psi/psi_paint.png"))),

      pinformative(
        "Imagine the items were ", em("colors"), ". Assume colors can easily be mixed with other colors, but unmixing a given color into its components is impossible. The following procedure then solves the problem:",
      ),

      lis(
        [preview_scope(
          "Alfie and Betty each start with a data color ", def_value("data_A"), " and ", def_value("data_B"), " respectively.",
        )],
        [preview_scope(
          "Alfie and Betty each randomly select a secret color ", def_value("secret_A"), " and ", def_value("secret_B"), " respectively.",
        )],
        [
          "They each mix their data color with their secret color and send the result to the other person (", function_call("mix", r("data_A"), r("secret_A")), " and ", function_call("mix", r("data_B"), r("secret_B")), ").",
        ],
        [
          "Upon receiving a mixture, they mix their own secret into it, remember the result and also send it to the other person (", function_call("mix", function_call("mix", r("data_B"), r("secret_B")), r("secret_A")), " and ", function_call("mix", function_call("mix", r("data_A"), r("secret_A")), r("secret_B")), ").",
        ],
      ),

      pinformative(
        "If both peers receive the same color they remembered, then they started with the same data color, and otherwise they did not. Because unmixing colors is impossible and mixing with a randomly chosen secret color essentially yields a new random-looking color, the peers cannot learn anything about each other’s colors in case of ", sidenote("inequality", [
          "Neither can any eavesdropper learn about the data colors. The procedure is highly related to a ", link("Diffie–Hellman key exchange", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange"), " for that reason, and we have borrowed the color metaphor from its wikipedia page.",
        ]),
        ".",
      ),

      div({style: "clear: right;"}), // this is only temporary

      pinformative(
        marginale([
          "Note that the color analogy is not fully accurate: data colors correspond to group members but secret colors correspond to scalars, which are of a different type than group members.",
        ]),
        "Leaving the world of analogy, the actual cryptographic primitives we use are ", link("finite cyclic groups", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalization_to_finite_cyclic_groups"), " — such as the ", link("X25519 elliptic curve", "https://en.wikipedia.org/wiki/Curve25519"), " — equipped with a way of serializing group members for transport and with a way of generating pseudo-random group members from the items to test for equality.",
      ),

      pinformative(
        marginale([
          "Do not worry if the mathy description here does not fully make sense to you. We merely give it for completeness sake, it is not required to fully understand it.",
        ]),
        "Let ", def_type({id: "psi_Items", singular: "Items", plural: "Items"}), " be the set of items for which we want to be able to privately test for equality. Let ", def_type({id: "psi_G", singular: "G"}), " be a ", link("finite cyclic group", "https://en.wikipedia.org/wiki/Cyclic_group"), " with a well-known ", link("generator", "https://en.wikipedia.org/wiki/Generating_set_of_a_group"), " ", def_value({id: "psi_g", singular: "g"}), " and group operation ", def_fn({id: "psi_times", singular: "*"}), ", and let ", def_fn({id: "psi_item_to_group", singular: "item_to_group", math: "item\\_to\\_group"}), " be a hash function from ", r("psi_Items"), " into ", r("psi_G"), ".",
      ),

      pinformative(
        "Now, let ", def({id: "psi_Alfie", singular: "Alfie"}), " be a peer that holds some item ",
        $([def_value$({id: "psi_ialpha", math: "i_{\\alpha}"}), ` \\in `, r$("psi_Items")]),
        " and let ", def({id: "psi_Betty", singular: "Betty"}), " be a peer that holds some item ",
        $([def_value$({id: "psi_ibeta", math: "i_{\\beta}"}), ` \\in `, r$("psi_Items")], "."),
        " Define ",
        $([def_value$({id: "psi_dalpha", math: "d_{\\alpha}"}), " := ", r$("psi_item_to_group"), "(", r$("psi_ialpha"), ")"]),
        " and ",
        $([def_value$({id: "psi_dbeta", math: "d_{\\beta}"}), " := ", r$("psi_item_to_group"), "(", r$("psi_ibeta"), ")"]),
      ),

      pinformative(
        "To privately test for equality of ", $(r$("psi_ialpha")), " and ", $comma(r$("psi_ibeta")),
        " ", r("psi_Alfie"), " and ", r("psi_Betty"), " each randomly select scalars (natural numbers) ",
        $(def_value$({id: "psi_salpha", math: "s_{\\alpha}"})),
        " and ",
        $(def_value$({id: "psi_sbeta", math: "s_{\\beta}"})),
        " respectively. ", R("psi_Alfie"), " then transmits ",
        $([r$("psi_dalpha"), "^{", r$("psi_salpha"), "}"]),
        marginale([$(["x^n := x * x * \\ldots * x"]), " (", $("n"), " times)"]),
        " and ", r("psi_Betty"), " transmits ",
        $dot([r$("psi_dbeta"), "^{", r$("psi_sbeta"), "}"]),
      ),

      pinformative(
        "After receiving these messages, ", r("psi_Alfie"), " answers with ",
        $comma([r$("psi_dbeta"), "^{", r$("psi_sbeta"), " \\cdot ", r$("psi_salpha"), "}"]),
        marginale([
          "They can compute these because ",
          $dot("x^{n \\cdot m} = {(x^n)}^m"),
        ]),
        " and ", r("psi_Betty"), " answers with ",
        $dot([r$("psi_dbeta"), "^{", r$("psi_sbeta"), " \\cdot ", r$("psi_sbeta"), "}"]),
      ),

      pinformative(
        "If ", r("psi_G"), " was chosen so that accidental (or maliciously crafted) collisions are unlikely (or infeasible), then ",
        $([r$("psi_ialpha"), " = ", r$("psi_ibeta")]),
        " if and only if ",
        $dot([
          r$("psi_dbeta"), "^{", r$("psi_sbeta"), " \\cdot ", r$("psi_salpha"), "}",
          "=",
          r$("psi_dbeta"), "^{", r$("psi_sbeta"), " \\cdot ", r$("psi_sbeta"), "}",
        ]),
        marginale(["Because ", $dot("x^{n \\cdot m} = x^{m \\cdot n}")]),
      ),
    ]),

    hsection("psi_actual", "From Equality Testing to Set Intersection", [
      pinformative(
        "We can generalize the equality test to computing set intersection by essentially sending the same information but for multiple items at once. We return to the analogy of colors again, before giving the mathematically precise formulation.",
      ),

      pinformative(
        "Suppose Alfie and Betty start with ", em("sets"), " of data colors. They independently (and arbitrarily) number their data colors as ", def_value("data_A_0"), ", ", def_value("data_A_1"), ", ... and ", def_value("data_B_0"), ", ", def_value("data_B_1"), ", ...` respectively.",
      ),

      pinformative(
        "Alfie and Betty still choose only a single random secret (", r("secret_A"), " and ", r("secret_B"), " respectively), and they send the results of mixing each of their data colors with their secret color individually (",
        code("{0: ", function_call("mix", r("data_A_0"), r("secret_A")), ", ", function_call("mix", r("data_A_1"), r("secret_A")), ", ...", "}"),
        " and ",
        code("{0: ", function_call("mix", r("data_B_0"), r("secret_B")), ", ", function_call("mix", r("data_B_1"), r("secret_B")), ", ...", "}"),
        ").",
      ),

      pinformative(
        "For each numbered color mix they receive, they reply by adding their own secret, keeping the numbering identical.",
      ),

      pinformative(
        "Any color that occurs both in the final set of colors they sent and in the final set of colors they received corresponds to a shared data color, and the numbering tells each of them which of the original colors are shared. But for any other color, they cannot reconstruct the corresponding original data color of the other peer.",
      ),

      pinformative(
        "In the formal setting, let ", def({id: "psi_Alfie2", singular: "Alfie"}), " and ", def({id: "psi_Betty2", singular: "Betty"}), " hold sequences of ", rs("psi_Items"), " ",
        $(["(", def_value$({id: "psi_ia0", math: "i\\alpha_0"}), ", ", def_value$({id: "psi_ia1", math: "i\\alpha_1"}), ", \\ldots)"]),
        " and ",
        $(["(", def_value$({id: "psi_ib0", math: "i\\beta_0"}), ", ", def_value$({id: "psi_ib1", math: "i\\beta_1"}), ", \\ldots)"]),
        " that hash to sequences of group members ",
        $(["(", def_value$({id: "psi_da0", math: "d\\alpha_0"}), ", ", def_value$({id: "psi_da1", math: "d\\alpha_1"}), ", \\ldots)"]),
        " and ",
        $(["(", def_value$({id: "psi_db0", math: "d\\beta_0"}), ", ", def_value$({id: "psi_db1", math: "d\\beta_1"}), ", \\ldots)"]),
        " respectively, and let them choose random scalars ",
        $(def_value$({id: "psi_sa", math: "s_{\\alpha}"})),
        " and ",
        $(def_value$({id: "psi_sb", math: "s_{\\beta}"})),
        " again.",
      ),

      pinformative(
        R("psi_Alfie2"), " then transmits ",
        $comma(["({", r$("psi_da0"), "}^{", r$("psi_sa"), "}, {", r$("psi_da1"), "}^{", r$("psi_sa"), "}, \\ldots)"]),
        " and ", r("psi_Betty2"), " transmits ",
        $dot(["({", r$("psi_db0"), "}^{", r$("psi_sb"), "}, {", r$("psi_db1"), "}^{", r$("psi_sb"), "}, \\ldots)"]),
      ),

      pinformative(
        "After receiving these messages, ", r("psi_Alfie2"), " answers with ",
        $comma(["({", r$("psi_db0"), "}^{", r$("psi_sb"), " \\cdot ", r$("psi_sa"), "}, {", r$("psi_db1"), "}^{", r$("psi_sb"), " \\cdot ", r$("psi_sa"), "}, \\ldots)"]),
        " and ", r("psi_Betty2"), " answers with ",
        $dot(["({", r$("psi_da0"), "}^{", r$("psi_sa"), " \\cdot ", r$("psi_sb"), "}, {", r$("psi_da1"), "}^{", r$("psi_sa"), " \\cdot ", r$("psi_sb"), "}, \\ldots)"]),
      ),

      pinformative(
        "For all ", $("i, j \\in \\N"), " such that ",
        $comma("{d\\alpha_i}^{s_\\alpha \\cdot s_\\beta} = {d\\beta_j}^{s_\\beta \\cdot s_\\alpha}"),
        " ", r("psi_Alfie2"), " learns that item ", $("i\\alpha_i"), " is in the intersection, and ", r("psi_Betty2"), " learns that item ", $("i\\beta_j"), " is in the intersection.",
      ),
    ]),

    hsection("psi_dynamic", "Dynamic Sets", [
      pinformative(
        "The algorithm as described so far requires Alfie and Betty to fully know their sets in advance. For the ", r("WGPS"), ", we want to allow for dynamically changing sets — both because peers might learn about new ", rs("namespace"), " dynamically, and because they might not have enough resources to store group members for the full sets in memory at the same time.",
      ),

      pinformative(
        "We can overcome this limitation with a small change: rather than sending monolithic messages containing lists of group members, we send individual group members together with small numeric identifiers. These identifiers can be used to map responses to the original group members. In particular, we use ", rs("resource_handle"), " for this purpose.",
      ),
    ]),
  ],
);
