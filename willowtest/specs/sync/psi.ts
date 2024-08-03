import { def, preview_scope, r, rs, r$, R, def_fake } from "../../../defref.ts";
import { code, div, em, img, p, table } from "../../../h.ts";
import { hsection, table_of_contents } from "../../../hsection.ts";
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
  path,
  pinformative,
  site_template,
} from "../../main.ts";
import { Struct, def_type, field_access, function_call, pseudo_array, pseudo_tuple, pseudocode } from "../../../pseudocode.ts";
import { link_name } from "../../../linkname.ts";
import { range3d_based_set_reconciliation } from "./product_based_set_reconciliation.ts";

const apo = "’";

const Items = "\\mathrm{Items}";
const item_to_group = "\\mathrm{item\\_to\\_group}";

export const psi: Expression = site_template(
  {
    title: "Private Area Intersection",
    name: "private_area_intersection",
  },
  [
    pinformative("In order to synchronise data, peers must inform each other about which data they are interested in. If done openly, this would let peers learn about details such as ", rs("NamespaceId"), ", ", rs("SubspaceId"), ", or ", rs("Path"), " that they have no business knowing about. In this document, we describe a technique that does not leak this information."),
    
    table_of_contents(7),

    hsection("pai_goals", "Setting and Goals", [
      pinformative("We consider the setting where two peers wish to synchronise some data that is subject to ", link_name("access_control", "read access control via capabilities"), ". More precisely, they want to specify pairs of ", rs("namespace"), " and ", rs("AreaOfInterest"), ", and then synchronise the ", rs("aoi_intersection"), "."),

      pinformative("The simplemost solution consists in the peers openly exchanging ", rs("read_capability"), " and then specifying their ", rs("AreaOfInterest"), ", which must be fully ", r("area_include_area", "included"), " in the ", rs("granted_area"), " of the ", rs("read_capability"), ". This works well for managing read access control and determining which ", rs("Entry"), " to synchronise, but it leaks some potentially sensitive information. Two examples:"),

      pinformative("First, suppose that Alfie creates an ", r("Entry"), " at ", r("Path"), " ", path("gemma_stinks"), ", and gives a ", r("read_capability"), " for this ", r("Path"), " to Betty. Later, Betty connects to Gemma's machine for syncing, and asks for ", path("gemma_stinks"), " in Alfie’s ", r("subspace"), ". In sending her ", r("read_capability"), ", she hands a signed proof to Gemma that Alfie ", sidenote("thinks", ["Gemma does not, in fact, stink."], ["Also, Alfie is really very nice and would never say such a thing outside of thought experiments for demonstrating the dangers of leaking ", rs("Path"), "."]), " she stinks. Not good."),

      pinformative("Second, suppose a scenario where everyone ", link_name("e2e_paths", "uses encrypted paths"), ", with individual encryption keys per ", r("subspace"), ". Alfie synchronises with Betty, asking her for random-looking ", rs("Path"), " of the same structure in ten different ", rs("subspace"), ". Betty has the decryption keys for all but one of the ", rs("subspace"), ". All the paths she can decrypt happen to decrypt to ", path("gemma_stinks"), ". This gives Betty a strong idea about what the tenth person thinks of Gemma, despite the fact that Betty cannot decrypt the ", r("Path"), ". Not good."),

      pinformative("Ideally, we would like to employ a mechanism where peers cannot learn any information beyond the ", rs("granted_area"), " of the ", rs("read_capability"), " which they hold at the start of the process. Unfortunately, such a mechanism would have to involve privacy-preserving verification of cryptographic signatures, and we are not aware of any suitable cryptographic primitives."),

      pinformative("We can, however, design solutions which do not allow peers to learn about the existence of any ", r("NamespaceId"), ", ", r("SubspaceId"), ", or ", r("Path"), " which they did not know about already. If, for example, both peers knew about a certain ", r("namespace"), ", they should both get to know that the other peer also knows about that ", r("namespace"), ". But for a ", r("namespace"), " which only one of the peers knows about, the other peer should not learn its ", r("NamespaceId"), "."),

      pinformative("Such solutions cannot prevent peers from confirming guesses about data they shouldn't know about. Hence, it is important that ", rs("NamespaceId"), " and ", rs("SubspaceId"), " are sufficiently long and random-looking. Similarly, encrypting ", rs("Component"), " with different encryption keys for different ", rs("subspace"), " can ensure that ", rs("Path"), " are unguessable. Because valid ", rs("Timestamp"), marginale(["Finding efficient encryption schemes and privacy-preserving synchronisation techniques that work for ", rs("Timestamp"), " is an interesting research endeavour, but out of scope for us."]), " can easily be guessed, we do not try to hide information about them."),

      pinformative("We present our solution in three stages. First, we show how to privately test two items for equality, then we generalise to privately intersecting two sets, and then we reduce our problem of intersecting ", rs("namespace"), " and ", rs("AreaOfInterest"), " to that of intersecting sets."),
    ]),

    hsection("private_equality_testing", "Private Equality Testing", [
      pinformative(
        "We start by considering ", def({id: "private_equality_testing_def", singular: "private equality testing"}), ": two peers — Alfie and Betty — who hold a single item each wish to determine whether they hold the same item, without revealing any information about their item in case of inequality. Before giving the precise mathematical formulation, we describe the solution by way of analogy.",
      ),

      marginale_inlineable(img(asset("psi/psi_paint.png"), `A comic visualising private equality testing with one column for each peer. The peers start with two buckets of colour each, a data colour (same for both) and a secret colour (unique for each) per peer. Each peer mixes their two colours, yielding a completely new, unique colour per peer. The peers exchange these new colours, and then each mix their secret colour into what they received. This yields the same colour for both peers! They verify so by exchanging the resulting colours, and then happily toast with their buckets of equally coloured content.`)),

      pinformative(
        "Imagine the items were ", em("colours"), ". Assume colours can easily be mixed with other colours, but unmixing a given colour into its components is impossible. The following procedure then solves the problem:",
      ),

      lis(
        [preview_scope(
          "Alfie and Betty each start with a data colour ", def_value("data_A"), " and ", def_value("data_B"), " respectively.",
        )],
        [preview_scope(
          "Alfie and Betty each randomly select a secret colour ", def_value("secret_A"), " and ", def_value("secret_B"), " respectively.",
        )],
        [
          "They each mix their data colour with their secret colour and send the result to the other person (", code(function_call("mix", r("data_A"), r("secret_A"))), " and ", code(function_call("mix", r("data_B"), r("secret_B"))), ").",
        ],
        [
          "Upon receiving a mixture, they mix their own secret into it, remember the result and also send it to the other person (", code(function_call("mix", function_call("mix", r("data_B"), r("secret_B")), r("secret_A"))), " and ", code(function_call("mix", function_call("mix", r("data_A"), r("secret_A")), r("secret_B"))), ").",
        ],
      ),

      pinformative(
        "If both peers receive the same colour they remembered, then they started with the same data colour, and otherwise they did not. Because unmixing colours is impossible and mixing with a randomly chosen secret colour essentially yields a new random-looking colour, the peers cannot learn anything about each other’s colours in case of ", sidenote("inequality", [
          "Neither can any eavesdropper learn about the data colours. The procedure is highly related to a ", link("Diffie–Hellman key exchange", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange"), " for that reason, and we have borrowed the colour metaphor from its wikipedia page.",
        ]),
        ".",
      ),

      div({style: "clear: right;"}), // this is only temporary, or is it?

      pinformative(
        marginale([
          "Note that the colour analogy is not fully accurate: data colours correspond to group members but secret colours correspond to scalars, which are of a different type than group members.",
        ]),
        "Leaving the world of analogy, the actual cryptographic primitives we use are ", link("finite cyclic groups", "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Generalisation_to_finite_cyclic_groups"), " — such as the ", link("X25519 elliptic curve", "https://en.wikipedia.org/wiki/Curve25519"), " — equipped with a way of serialising group members for transport and with a way of generating pseudo-random group members from the items to test for equality.",
      ),

      pinformative(
        marginale([
          "Do not worry if the mathy description here does not fully make sense to you. We give it for completeness’ sake, but you can grasp the underlying concepts without being familiar with groups and cryptography.",
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
        $dot([r$("psi_dalpha"), "^{", r$("psi_salpha"), " \\cdot ", r$("psi_sbeta"), "}"]),
      ),

      pinformative(
        "If ", r("psi_G"), " was chosen so that accidental (or maliciously crafted) collisions are unlikely (or infeasible), then ",
        $([r$("psi_ialpha"), " = ", r$("psi_ibeta")]),
        " if and only if ",
        $dot([
          r$("psi_dalpha"), "^{", r$("psi_salpha"), " \\cdot ", r$("psi_sbeta"), "}",
          "=",
          r$("psi_dbeta"), "^{", r$("psi_sbeta"), " \\cdot ", r$("psi_salpha"), "}",
        ]),
        marginale(["Because ", $dot("x^{n \\cdot m} = x^{m \\cdot n}")]),
      ),
    ]),

    hsection("psi_actual", "Private Set Intersection", [
      pinformative(
        "We can generalise the equality test to computing set intersection by essentially sending the same information but for multiple items at once.", marginale(["This technique for private set intersection is due to ", link("Huberman, Franklin, and Hogg", "https://dl.acm.org/doi/pdf/10.1145/336992.337012"), "."]), " We return to the analogy of colours again, before giving the mathematically precise formulation.",
      ),

      pinformative(
        "Suppose Alfie and Betty start with ", em("sets"), " of data colours. They independently (and arbitrarily) number their data colours as ", code(def_value("data_A_0"), ", ", def_value("data_A_1"), ", ..."), " and ", code(def_value("data_B_0"), ", ", def_value("data_B_1"), ", ..."), " respectively.",
      ),

      pinformative(
        "Alfie and Betty still choose only a single random secret (", r("secret_A"), " and ", r("secret_B"), " respectively), and they send the results of mixing each of their data colours with their secret colour individually (",
        code("{0: ", function_call("mix", r("data_A_0"), r("secret_A")), ", ", function_call("mix", r("data_A_1"), r("secret_A")), ", ...", "}"),
        " and ",
        code("{0: ", function_call("mix", r("data_B_0"), r("secret_B")), ", ", function_call("mix", r("data_B_1"), r("secret_B")), ", ...", "}"),
        ").",
      ),

      pinformative(
        "For each numbered colour mix they receive, they reply by adding their own secret, keeping the numbering identical.",
      ),

      pinformative(
        "Any colour that occurs both in the final set of colours they sent and in the final set of colours they received corresponds to a shared data colour, and the numbering tells each of them which of the original colours are shared. But for any other colour, they cannot reconstruct the corresponding original data colour of the other peer.",
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

    hsection("pai_approach", "Private Syncing", [
      pinformative("We now have the necessary tools to describe how two peers can exchange ", rs("read_capability"), " for their sync interests in a privacy-preserving manner. To recapitulate, we consider two peers — Alfie and Betty — who each hold a set of ", rs("read_capability"), ". They wish to determine the ", rs("area_intersection"), " of their ", rs("granted_area"), " without leaking any ", rs("NamespaceId"), ", ", rs("SubspaceId"), " or ", rs("Path"), " that are not covered by the other peer’s ", rs("read_capability"), ". We now reduce this problem to that of private set intersection."),

      pinformative(
        marginale("We have to introduce a bit of terminology first. Trust us that it will be useful, and also trust us that all attempts to avoid these definitions resulted in unreadable messes."),
        "A ", r("read_capability"), " is called ", def({id: "capability_complete", singular: "complete"}), " if the ", r("AreaSubspace"), " of its ", r("granted_area"), " is ", r("area_any"), ", and it is called ", def({id: "capability_selective", singular: "selective"}), " otherwise."   , 
      ),

      preview_scope(
        p("The ", def({id: "fragment", singular: "fragment"}, "fragments"), " of a ", r("capability_complete"), " ", r("read_capability"), " of ", r("granted_area"), " ", def_value({id: "complete_fragment_area", singular: "area"}), " and ", r("granted_namespace"), " ", def_value({id: "complete_fragment_namespace", singular: "namespace"}), " are the pairs ", code("(", r("complete_fragment_namespace"), ", ", r("complete_fragment_prefix"), ")"), ", such that ", def_value({id: "complete_fragment_prefix", singular: "pre"}), " is a ", r("path_prefix"), marginale([
          "The ", rs("path_prefix"), " of ", path("foo", "bar"), " are the empty ", r("Path"), ", ", path("foo"), ", and ", path("foo", "bar"), " itself.",
        ]), " of ", field_access(r("complete_fragment_area"), "AreaPath"), "."),

        p("The ", rs("fragment"), " of a ", r("capability_selective"), " ", r("read_capability"), " of ", r("granted_area"), " ", def_value({id: "selective_fragment_area", singular: "area"}), " and ", r("granted_namespace"), " ", def_value({id: "selective_fragment_namespace", singular: "namespace"}), " are the pairs ", code("(", r("selective_fragment_namespace"), ", ", r("selective_fragment_prefix"), ")"), " and the triplets ",  code("(", r("selective_fragment_namespace"), ", ", field_access(r("selective_fragment_area"), "AreaSubspace"), ", ", r("selective_fragment_prefix"), ")"), ", such that ", def_value({id: "selective_fragment_prefix", singular: "pre"}), " is a ", r("path_prefix"), " of ", field_access(r("selective_fragment_area"), "AreaPath"), ". The pairs are called ", def({id: "fragment_secondary", singular: "secondary"}), " ", rs("fragment"), ", all other ", rs("fragment"), " (including those of ", r("capability_complete"), " ", rs("read_capability"), ") are called ", def({id: "fragment_primary", singular: "primary"}), " ", rs("fragment"), "."),

        p("A ", r("fragment"), " whose ", r("Path"), " is the empty ", r("Path"), " is called a ", def({id: "fragment_least_specific", singular: "least-specific"}), " ", r("fragment"), ". A ", r("fragment"), " whose ", r("Path"), " is the ", r("AreaPath"), " of the ", r("granted_area"), " of its originating ", r("read_capability"), " is called a ", def({id: "fragment_most_specific", singular: "most-specific"}), " ", r("fragment"), "."),
      ),

      pinformative("To privately exchange ", rs("read_capability"), ", Alfie and Betty perform private set intersection with the sets of ", rs("fragment"), " of all their ", rs("read_capability"), ". Additionally, they transmit for each group member they send whether it corresponds to a ", r("fragment_primary"), " or ", r("fragment_secondary"), " ", r("fragment"), ". The peers can then detect nonempty intersections between their ", rs("read_capability"), " by checking whether their ", r("fragment_most_specific"), " ", rs("fragment"), " are in the intersection. More precisely, we need to consider three cases:"),

      pinformative("If the ", r("fragment_most_specific"), " ", r("fragment"), " of a peer’s ", r("capability_complete"), " ", r("read_capability"), " is in the intersection, then the peer can safely send (and authenticate) the ", r("read_capability"), " without leaking any information. Together with the ", r("read_capability"), ", the peer should also transmit the ", r("fragment"), ". The other peer can then safely reply with all its ", rs("read_capability"), " whose ", rs("fragment"), " include the transmitted ", r("fragment"), "."),

      pinformative("The same holds when the ", r("fragment_primary"), " ", r("fragment_most_specific"), " ", r("fragment"), " of a peer’s ", r("capability_selective"), " ", r("read_capability"), " is in the intersection."),

      pinformative("Things are more complicated, however, when the ", r("fragment_secondary"), " ", r("fragment_most_specific"), " ", r("fragment"), " of a peer’s ", r("capability_selective"), " ", r("read_capability"), " is in the intersection, but the corresponding ", r("fragment"), " of the other peer is a ", r("fragment_primary"), " ", sidenote(r("fragment"), [
        "If ", em("both"), " peers’ ", rs("fragment"), " were ", r("fragment_secondary"), ", but their corresponding ", r("fragment_primary"), " ", rs("fragment"), " were not in the intersection, then the ", rs("read_capability"), " simply would not overlap — the peers would request equal ", rs("Path"), " in distinct ", rs("subspace"), ".",
      ]), ". To better understand this case, consider an example:"),

      pinformative("Suppose, in some ", r("namespace"), ", Alfie is interested in the ", rs("Entry"), " at arbitrary ", rs("entry_path"), " with ", r("entry_subspace_id"), " ", code("@gemmas_stuff"), ". Betty, in the same ", r("namespace"), ", is interested in the ", rs("Entry"), " whose ", r("entry_path"), " is prefixed by ", path("chess"), ", regardless of their ", r("entry_subspace_id"), ". Then Alfie’s ", r("fragment_secondary"), " ", r("fragment_most_specific"), " ", r("fragment"), " is in the intersection, but his ", r("fragment_primary"), " ", r("fragment_most_specific"), " ", r("fragment"), " is not (and neither is Betty’s ", r("fragment_most_specific"), " ", r("fragment"), ")."),

      pinformative("It might be tempting for Alfie to transmit his ", r("read_capability"), ", but unfortunately, Betty might have fabricated her ", rs("fragment"), ". In this case, Betty would learn about the existance of ", code("@gemmas_stuff"), ", violating our privacy objectives. Alfie could prompt Betty to present ", em("her"), " ", r("read_capability"), " first, instead. But Betty then faces the same problem: Alfie could have fabricated his ", rs("fragment"), ", and he would illegitimately learn about the ", path("chess"), " ", r("Path"), " in that case."),

      pinformative("To solve this standoff, we employ a second type of unforgeable token, that lets Betty prove that she has access to the full ", r("subspace"), " at ", em("some"), " ", r("Path"), ", without specifying that ", r("Path"), " explicitly. Alfie can request this token (by transmitting the ", r("fragment_least_specific"), " ", r("fragment_secondary"), " ", r("fragment"), " of his ", r("read_capability"), "), Betty can then prove that she is indeed authorised to know about arbitrary ", rs("SubspaceId"), " in this ", r("namespace"), ", and Alfie can then send (and authenticate) his ", r("read_capability"), ", to which Betty replies with her own, proper ", r("read_capability"), "."),

      pinformative("We call these unforgeable tokens ", def({id: "subspace_capability", singular: "subspace capability", plural: "subspace capabilities"}, "subspace capabilities"), ". Whenever a peer is granted a ", r("capability_complete"), " ", r("read_capability"), " of non-empty ", r("AreaPath"), ", it should also be granted a corresponding ", r("subspace_capability"), ". Each ", r("subspace_capability"), " must have a single ", def({ id: "subspace_receiver", singular: "receiver" }), " (a ", r("dss_pk"), " of some ", r("signature_scheme"), "), and a single ", def({ id: "subspace_granted_namespace", singular: "granted namespace" }), " (a ", r("NamespaceId"), "). The ", r("subspace_receiver"), " can authenticate itself by signing a collaboratively selected nonce."),

    ]),

    hsection("subspace_capabilities_meadowcap", "Subspace Capabilities and Meadowcap", [
      pinformative("We conclude by presenting a datatype that implements ", rs("subspace_capability"), ", nicely complementing ", link_name("meadowcap", "Meadowcap"), ". Note that in Meadowcap, ", rs("read_capability"), " for all ", rs("subspace"), " of a ", r("namespace"), " can only exist in ", rs("owned_namespace"), "."),

      pseudocode(
        new Struct({
            id: "McSubspaceCapability",
            name: "McSubspaceCapability",
            plural: "McSubspaceCapabilities",
            comment: ["A capability that certifies read access to arbitrary ", rs("SubspaceId"), " at some unspecified ", r("Path"), "."],
            fields: [
                {
                    id: "subspace_cap_namespace",
                    name: "namespace_key",
                    comment: ["The ", r("namespace"), " for which this grants access."],
                    rhs: r("NamespacePublicKey"),
                },
                {
                    id: "subspace_cap_user",
                    name: "user_key",
                    comment: [
                      pinformative("The user ", em("to whom"), " this grants access."),
                    ],
                    rhs: r("UserPublicKey"),
                },
                {
                    id: "subspace_cap_initial_authorisation",
                    name: "initial_authorisation",
                    comment: [
                      pinformative("Authorisation of the ", r("subspace_cap_user"), " by the ", r("subspace_cap_namespace"), "."),
                    ],
                    rhs: r("NamespaceSignature"),
                },
                {
                    id: "subspace_cap_delegations",
                    name: "delegations",
                    comment: ["Successive authorisations of new ", rs("UserPublicKey"), "."],
                    rhs: pseudo_array(pseudo_tuple(r("UserPublicKey"), r("UserSignature"))),
                },
            ],
        }),
      ),

      pinformative("The ", r("subspace_cap_receiver"), " of a ", r("McSubspaceCapability"), " is the user to whom it grants access. Formally, the ", def({id: "subspace_cap_receiver", singular: "receiver"}), " is the final ", r("UserPublicKey"), " in the ", r("subspace_cap_delegations"), ", or the ", r("subspace_cap_user"), " if the ", r("subspace_cap_delegations"), " are empty."),

      pinformative("The ", r("subspace_cap_granted_namespace"), " of a ", r("McSubspaceCapability"), " is the ", r("namespace"), " for which it certifies access to all ", rs("subspace"), ". Formally, the ", def({id: "subspace_cap_granted_namespace", singular: "granted namespace"}), " of a ", r("McSubspaceCapability"), " is its ", r("subspace_cap_namespace"), "."),

      pinformative(R("subspace_cap_valid", "Validity"), " governs how ", rs("McSubspaceCapability"), " can be delegated. We define ", def({id: "subspace_cap_valid", singular: "valid"}, "validity", [pinformative("A ", r("McSubspaceCapability"), " is ", def_fake("subspace_cap_valid", "valid"), " if its ", r("subspace_cap_delegations"), " form a correct chain of ", rs("dss_signature"), " over ", rs("UserPublicKey"), "."), pinformative("For the formal definition, click the reference, the proper definition does not fit into a tooltip.")]), " based on the number of ", r("subspace_cap_delegations"), "."),

      pinformative("A ", r("McSubspaceCapability"), " with zero ", r("subspace_cap_delegations"), " is ", r("subspace_cap_valid"), " if ", r("subspace_cap_initial_authorisation"), " is a ", r("NamespaceSignature"), " issued by the ", r("subspace_cap_namespace"), " over the byte ", code("0x02"), ", followed by the ", r("subspace_cap_user"), " (encoded via ", r("encode_user_pk"), ")."),

      pinformative("For a ", rs("McSubspaceCapability"), " ", def_value({id: "subspace_cap_defvalid", singular: "cap"}), " with more than zero ", r("subspace_cap_delegations"), ", let ", code("(", def_value({id: "subspace_new_user", singular: "new_user"}), ", ", def_value({id: "subspace_new_signature", singular: "new_signature"}), ")"), " be the final pair of ", field_access(r("subspace_cap_defvalid"), "subspace_cap_delegations"), ", and let ", def_value({id: "subspace_prev_cap", singular: "prev_cap"}), " be the ", r("McSubspaceCapability"), " obtained by removing the last pair from ", field_access(r("subspace_cap_defvalid"), "subspace_cap_delegations"), ". Denote the  ", r("subspace_cap_receiver"), " of ", r("subspace_prev_cap"), " as ", def_value({id: "subspace_prev_receiver", singular: "prev_receiver"}), "."),

      pinformative("Then ", r("subspace_cap_defvalid"), " is ", r("subspace_cap_valid"), " if ", r("subspace_prev_cap"), " is ", r("subspace_cap_valid"), ", and ", r("subspace_new_signature"), " is a ", r("UserSignature"), " issued by the ", r("subspace_prev_receiver"), " over the bytestring ", def_value({id: "subspace_handover", singular: "handover"}), ", which is defined as follows:"),

      lis(
        [
          "If ", field_access(r("subspace_prev_cap"), "subspace_cap_delegations"), " is empty, then ", r("subspace_handover"), " is the concatenation of the following bytestrings:",
          lis(
            [code(function_call(r("encode_namespace_sig"), field_access(r("subspace_prev_cap"), "subspace_cap_initial_authorisation"))), "."],
            [code(function_call(r("encode_user_pk"), r("subspace_new_user"))), "."],
          ),
        ],
        [
          preview_scope("Otherwise, let ", def_value({id: "subspace_prev_signature", singular: "prev_signature"}), " be the ", r("UserSignature"), " in the last pair of ", field_access(r("subspace_prev_cap"), "subspace_cap_delegations"), "."), " Then ", r("subspace_handover"), " is the concatenation of the following bytestrings:",
          lis(
            [code(function_call(r("encode_user_sig"), r("subspace_prev_signature"))), "."],
            [code(function_call(r("encode_user_pk"), r("subspace_new_user"))), "."],
          ),
        ],
      ),
    ]),

  ],
);
