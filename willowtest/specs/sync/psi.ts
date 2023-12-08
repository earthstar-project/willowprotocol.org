import { def, preview_scope, r, rs } from "../../../defref.ts";
import { code, em, img } from "../../../h.ts";
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
  def_value,
  link,
  lis,
  pinformative,
  site_template,
} from "../../main.ts";

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
      link(
        "Private set intersection",
        "https://en.wikipedia.org/wiki/Private_set_intersection",
      ),
      " (",
      def({ id: "psi", singular: "PSI" }),
      ") protocols allow two peers to establish which items they have in common without revealing any non-common items to the other party. The ",
      r("wgps"),
      " employs a classic ",
      link(
        "technique by Huberman, Franklin, and Hogg",
        "https://dl.acm.org/doi/pdf/10.1145/336992.337012",
      ),
      ", which we explain in this document.",
    ),

    hsection("private_equality_testing", "Private Equality Testing", [
      pinformative(
        "We start by considering a related but simpler problem: two peers — Alfie and Betty — who hold a single item each wish to determine whether they hold the same item, without revealing any information about their item in case of ",
        sidenote("inequality", [
          "If the peers simply exchanged hashes of their items, peers could learn which other peers have equal items, so this is not a sufficiently private solution.",
        ]),
        ". Before giving the precise mathematical formulation, we describe the solution by way of analogy.",
      ),

      marginale_inlineable(img(asset("psi/psi_paint.png"))),

      pinformative(
        "Imagine the items were ",
        em("colors"),
        ". Assume colors can easily be mixed with other colors, but unmixing a given color into its components is impossible. The following procedure then solves the problem:",
      ),

      lis(
        [preview_scope(
          "Alfie and Betty each start with a data color ",
          def_value("data_A"),
          " and ",
          def_value("data_B"),
          " respectively.",
        )],
        [preview_scope(
          "Alfie and Betty each randomly select a secret color ",
          def_value("secret_A"),
          " and ",
          def_value("secret_B"),
          " respectively.",
        )],
        [
          "They each mix their data color with their secret color and send the result to the other person (",
          code("combine(", r("data_A"), ", ", r("secret_A"), ")"),
          " and ",
          code("combine(", r("data_B"), ", ", r("secret_B"), ")"),
          ").",
        ],
        [
          "Upon receiving a mixture, they mix their own secret into it, remember the result and also send it to the other person (",
          code(
            "combine(combine(",
            r("data_B"),
            ", ",
            r("secret_B"),
            "), ",
            r("secret_A"),
            ")",
          ),
          " and ",
          code(
            "combine(combine(",
            r("data_A"),
            ", ",
            r("secret_A"),
            "), ",
            r("secret_B"),
            ")",
          ),
          ").",
        ],
      ),

      pinformative(
        "If they receive the same color they remembered, then they started with the same data color, and otherwise they did not. Because unmixing colors is impossible and mixing with a randomly chosen secret color essentially yields a new random-looking color, the peers cannot learn anything about each other",
        apo,
        "s colors in case of ",
        sidenote("inequality", [
          "Neither can any eavesdropper learn about the data colors. The procedure is highly related to a ",
          link(
            "Diffie–Hellman key exchange",
            "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange",
          ),
          " for that reason, and we have borrowed the color metaphor from its wikipedia page.",
        ]),
        ".",
      ),

      pinformative(
        marginale([
          "Note that the color analogy is not fully accurate: data colors correspond to group members but secret colors correspond to scalars, which are of a different type than group members.",
        ]),
        "Leaving the world of analogy, the actual cryptographic primitives we use are ",
        link(
          "finite cyclic groups",
          "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalization_to_finite_cyclic_groups",
        ),
        " — such as the ",
        link(
          "X25519 elliptic curve",
          "https://en.wikipedia.org/wiki/Curve25519",
        ),
        " — equipped with a way of serializing group members for transport and with a way of generating pseudo-random group members from the items to test for equality.",
      ),

      pinformative(
        marginale([
          "Do not worry if the mathy description here does not fully make sense to you. We merely give it for completeness sake, it is not required to fully understand it.",
        ]),
        "Let ",
        $(Items),
        " be the set of items for which we want to be able to privately test for equality. Let ",
        $("G"),
        " be a ",
        link(
          "finite cyclic group",
          "https://en.wikipedia.org/wiki/Cyclic_group",
        ),
        " with a well-known ",
        link(
          "generator",
          "https://en.wikipedia.org/wiki/Generating_set_of_a_group",
        ),
        " ",
        $("g"),
        " and group operation ",
        $("*"),
        ", and let ",
        $(item_to_group),
        " be a hash function from ",
        $(Items),
        " into ",
        $dot("G"),
      ),

      pinformative(
        "Now let Alfie be a peer that holds some item ",
        $(`i_{\\alpha} \\in ${Items}`),
        " and Betty be a peer that holds some item ",
        $dot(`i_{\\beta} \\in ${Items}`),
        " Define ",
        $(`d_{\\alpha} := ${item_to_group}(i_{\\alpha})`),
        " and ",
        $dot(`d_{\\beta} := ${item_to_group}(i_{\\beta})`),
      ),

      pinformative(
        "To privately test for equality of ",
        $("i_{\\alpha}"),
        " and ",
        $comma("i_{\\beta}"),
        " Alfie and Betty each randomly select scalars (natural numbers) ",
        $("s_{\\alpha}"),
        " and ",
        $("s_{\\beta}"),
        " respectively. Alfie then transmits ",
        $("d_{\\alpha}^{s_{\\alpha}}"),
        marginale([$("x^n := x * x * \\ldots * x"), " (", $("n"), " times)"]),
        " and Betty transmits ",
        $dot("d_{\\beta}^{s_{\\beta}}"),
      ),

      pinformative(
        "After receiving these messages, Alfie answers with ",
        $("d_{\\beta}^{s_{\\beta} \\cdot s_{\\alpha}}"),
        marginale([
          "They can compute these because ",
          $dot("x^{n \\cdot m} = {(x^n)}^m"),
        ]),
        " and Betty answers with ",
        $dot("d_{\\alpha}^{s_{\\alpha} \\cdot s_{\\beta}}"),
      ),

      pinformative(
        "If ",
        $("G"),
        " was chosen so that accidental (or maliciously crafted) collisions are unlikely (or infeasible), then ",
        $("i_{\\alpha} = i_{\\beta}"),
        " if and only if ",
        $dot(
          "d_{\\beta}^{s_{\\beta} \\cdot s_{\\alpha}} = d_{\\alpha}^{s_{\\alpha} \\cdot s_{\\beta}}",
        ),
        marginale(["Because ", $dot("x^{n \\cdot m} = x^{m \\cdot n}")]),
      ),
    ]),

    hsection("psi_actual", "From Equality Testing to Set Intersection", [
      pinformative(
        "We can generalize the equality test to computing set intersection by essentially sending the same information but for multiple items at once. We return to the analogy of colors again, before giving the mathematically precise formulation.",
      ),

      pinformative(
        "Suppose Alfie and Betty start with ",
        em("sets"),
        " of data colors. They independently (and arbitrarily) number their data colors as ",
        def_value("data_A_0"),
        ", ",
        def_value("data_A_1"),
        ", ... and ",
        def_value("data_B_0"),
        ", ",
        def_value("data_B_1"),
        ", ...` respectively.",
      ),

      pinformative(
        "Alfie and Betty still choose only a single random secret (",
        r("secret_A"),
        " and ",
        r("secret_B"),
        " respectively), and they send the results of mixing each of their data colors with their secret color individually (",
        code(
          "{0: combine(",
          r("data_A_0"),
          ", ",
          r("secret_A"),
          "), 1: combine(",
          r("data_A_1"),
          ", ",
          r("secret_A"),
          "), ...}",
        ),
        " and ",
        code(
          "{0: combine(",
          r("data_B_0"),
          ", ",
          r("secret_B"),
          "), 1: combine(",
          r("data_B_1"),
          ", ",
          r("secret_B"),
          "), ...}",
        ),
        ").",
      ),

      pinformative(
        "For each numbered color mix they receive, they reply by adding their own secret, keeping the numbering identical.",
      ),

      pinformative(
        "Any color that occurs both in the final set of colors they sent and in the final set of colors they received corresponds to a shared data color, and the numbering tells each of them which of the original colors are shared. But for any other color, they cannot reconstruct the corresponding original data color of the other peer.",
      ),

      pinformative(
        "In the formal setting, let Alfie and Betty hold item sequences ",
        $("(i\\alpha_0, i\\alpha_1, \\ldots)"),
        " and ",
        $("(i\\beta_0, i\\beta_1, \\ldots)"),
        " that hash to sequences of group members ",
        $("(d\\alpha_0, d\\alpha_1, \\ldots)"),
        " and ",
        $("(d\\beta_0, d\\beta_1, \\ldots)"),
        " respectively, and let them choose random scalars ",
        $("s_{\\alpha}"),
        " and ",
        $("s_{\\beta}"),
        " again.",
      ),

      pinformative(
        "Alfie then transmits ",
        $("({d\\alpha_0}^{s_\\alpha}, {d\\alpha_1}^{s_\\alpha}, \\ldots)"),
        "  and Betty transmits ",
        $dot("({d\\beta_0}^{s_\\beta}, {d\\beta_1}^{s_\\beta}, \\ldots)"),
      ),

      pinformative(
        "After receiving these messages, Alfie answers with ",
        $("({d\\beta_0}^{s_\\beta * s_\\alpha}, {d\\beta_1}^{s_\\beta * s_\\alpha}, \\ldots)"),
        " and Betty answers with ",
        $dot(
          "({d\\alpha_0}^{s_\\alpha * s_\\beta}, {d\\alpha_1}^{s_\\alpha * s_\\beta}, \\ldots)",
        ),
      ),

      pinformative(
        "For all ",
        $("i, j \\in \\N"),
        " such that ",
        $comma(
          "{d\\alpha_i}^{s_\\alpha * s_\\beta} = {d\\beta_j}^{s_\\beta * s_\\alpha}",
        ),
        " Alfie learns that ",
        $("i\\alpha_i"),
        " is in the intersection, and Betty learns that item ",
        $("i\\beta_j"),
        " is in the intersection.",
      ),
    ]),

    hsection("psi_dynamic", "Dynamic Sets", [
      pinformative(
        "The algorithm as described so far requires Alfie and Betty to fully know their sets in advance. For the ",
        r("wgps"),
        ", we want to allow for dynamically changing sets — both because peers might learn about new ",
        rs("namespace"),
        " dynamically, and because they might not have enough resources to store group members for the full sets in memory at the same time.",
      ),

      pinformative(
        "We can overcome this limitation with a small change: rather than sending monolithic messages containing lists of group members, we send individual group members together with small numeric identifiers. These identifiers can be used to map responses to the original group members. In particular, we use ",
        rs("resource_handle"),
        " for this purpose.",
      ),
    ]),
  ],
);
