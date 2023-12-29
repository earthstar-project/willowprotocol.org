import { def, preview_scope, r, rs, r$, R, def_fake } from "../../../defref.ts";
import { code, div, em, img, table } from "../../../h.ts";
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
    pinformative("In order to synchronize data, peers must inform each other about which data they are interested in. If done openly, this would let peers learn about details such as ", rs("NamespaceId"), ", ", rs("SubspaceId"), ", or ", rs("Path"), " that they have no business knowing about. In this document, we describe a technique that does not leak this information."),

    hsection("pai_goals", "Setting and Goals", [
      pinformative("We consider the setting where two peers wish to synchronize some data that is subject to ", link_name("access_control", "read access control via capabilities"), ". More precisely, they want to specify pairs of ", rs("namespace"), " and ", rs("AreaOfInterest"), ", and then synchronize the ", rs("aoi_intersection"), "."),

      pinformative("The simplemost solution consists in the peers openly exchanging ", rs("read_capability"), " and then specifying their ", rs("AreaOfInterest"), ", which must be fully ", r("area_include_area", "included"), " in the ", rs("granted_area"), " of the ", rs("read_capability"), ". This works well for managing read access control and determining which ", rs("Entry"), " to synchronize, but it leaks some potentially sensitive information. Two examples:"),

      pinformative("First, suppose that Alfie creates an ", r("Entry"), " at ", r("Path"), " ", path("gemma_stinks"), ", and gives a ", r("read_capability"), " for this ", r("Path"), " to Betty. Later, Betty connects to Gemma's machine for syncing, and asks for ", path("gemma_stinks"), " in Alfie’s ", r("subspace"), ". In sending her ", r("read_capability"), ", she hands a signed proof to Gemma that Alfie ", sidenote("thinks", ["Gemma does not, in fact, stink."]), " she stinks. Not good."),

      pinformative("Second, suppose a scenario where everyone ", link_name("e2e_paths", "uses encrypted paths"), ", with individual encryption keys per ", r("namespace"), ". Alfie synchronizes with Betty, asking her for random-looking ", rs("Path"), " of the same structure in ten different ", rs("subspace"), ". Betty has the decryption keys for all but one of the ", rs("subspace"), ". All the paths she can decrypt happen to decrypt to ", path("gemma_stinks"), ". This gives Betty a strong idea about what the tenth person thinks of Gemma, despite the fact that Betty cannot decrypt the ", r("Path"), ". Not good."),

      pinformative("Ideally, we would like to employ a mechanism where peers cannot learn any information beyond the ", rs("granted_area"), " of the ", rs("read_capability"), " which they hold at the start of the process. Unfortunately, such a mechanism would have to involve privacy-preserving verification of cryptographic signatures, and we are not aware of any suitable cryptographic primitives."),

      pinformative("We can, however, design solutions which do not allow peers to learn about the existence of any ", r("NamespaceId"), ", ", r("SubspaceId"), ", or ", r("Path"), " which they did not know about already. If, for example, both peers knew about a certain ", r("namespace"), ", they should both get to know that the other peer also knows about that ", r("namespace"), ". But for a ", r("namespace"), " which only one of the peers knows about, the other peer should not learn its ", r("NamespaceId"), "."),

      pinformative("Such solutions cannot prevent peers from confirming guesses about data they shouldn't know about. Hence, it is important that ", rs("NamespaceId"), " and ", rs("SubspaceId"), " are sufficiently long and random-looking. Similarly, encrypting ", rs("Component"), " with different encryption keys for different ", rs("subspace"), " can ensure that ", rs("Path"), " are unguessable. Because valid ", rs("Timestamp"), marginale(["Finding efficient encryption schemes and privacy-preserving synchronization techniques that work for ", rs("Timestamp"), " is an interesting research endeavour, but out of scope for us."]), " can easily be guessed, we do not try to hide information about them."),

      pinformative("We present our solution in three stages. First, we show how to privately test two items for equality, then we generalize to privately intersecting two sets, and then we reduce our problem of intersecting ", rs("namespace"), " and ", rs("AreaOfInterest"), " to that of intersecting sets."),

      // - main challenge: disallow learning more specific information. example: any subspace, empty path
    ]),

    // pinformative(
    //   link("Private set intersection", "https://en.wikipedia.org/wiki/Private_set_intersection", ),
    //   " (", def({ id: "psi", singular: "PSI" }), ") protocols allow two peers to establish which items they have in common without revealing any non-common items to the other party. The ", r("WGPS"), " employs a classic ", link("technique by Huberman, Franklin, and Hogg", "https://dl.acm.org/doi/pdf/10.1145/336992.337012"), ", which we explain in this document.",
    // ),

    hsection("private_equality_testing", "Private Equality Testing", [
      pinformative(
        "We start by considering ", def({id: "private_equality_testing_def", singular: "private equality testing"}), ": two peers — Alfie and Betty — who hold a single item each wish to determine whether they hold the same item, without revealing any information about their item in case of ", sidenote("inequality", [
          "If Alfie and Betty simply exchanged hashes of their items, and Alfie later also performed a private equality test with Gemma, then Alfie would learn whether Betty and Gemma held the same item. Hence, exchanging hashes is not sufficiently private for our purposes.",
        ]), ". Before giving the precise mathematical formulation, we describe the solution by way of analogy.",
      ),

      marginale_inlineable(img(asset("psi/psi_paint.png"))),

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
          "They each mix their data colour with their secret colour and send the result to the other person (", function_call("mix", r("data_A"), r("secret_A")), " and ", function_call("mix", r("data_B"), r("secret_B")), ").",
        ],
        [
          "Upon receiving a mixture, they mix their own secret into it, remember the result and also send it to the other person (", function_call("mix", function_call("mix", r("data_B"), r("secret_B")), r("secret_A")), " and ", function_call("mix", function_call("mix", r("data_A"), r("secret_A")), r("secret_B")), ").",
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

    hsection("psi_actual", "Private Set Intersection", [
      pinformative(
        "We can generalise the equality test to computing set intersection by essentially sending the same information but for multiple items at once.", marginale(["This technique for private set intersection is due to ", link("Huberman, Franklin, and Hogg", "https://dl.acm.org/doi/pdf/10.1145/336992.337012"), "."]), " We return to the analogy of colours again, before giving the mathematically precise formulation.",
      ),

      pinformative(
        "Suppose Alfie and Betty start with ", em("sets"), " of data colours. They independently (and arbitrarily) number their data colours as ", def_value("data_A_0"), ", ", def_value("data_A_1"), ", ... and ", def_value("data_B_0"), ", ", def_value("data_B_1"), ", ...` respectively.",
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
      pinformative("We now have the necessary tools to describe how two peers can exchange ", rs("read_capability"), " for their sync interests in a privacy-preserving manner. The process involves two phases: first, the peers make claims about which combinations of ", rs("namespace"), ", ", rs("subspace"), ", and ", rs("Path"), " they have access to, and then they exchange the ", rs("read_capability"), " that prove their access rights, taking care to not leak any information in case of fraudulent claims."),

      pinformative("This separation is crucial. Any peer can claim to have access to all ", rs("Path"), " in all ", rs("subspace"), " in some ", r("namespace"), ", such a claim requires no knowledge of any specific ", rs("SubspaceId"), " or ", rs("Path"), ". Hence, a peer that has access to only a specific ", r("subspace"), " must not reveal the ", r("SubspaceId"), " until the other peer has proven that it is actually allowed to learn about arbitrary ", rs("SubspaceId"), " in that ", r("namespace"), " by producing a valid ", r("read_capability"), " whose ", r("granted_area"), " has an ", r("AreaSubspace"), " of ", r("area_any"), "."),

      pinformative("To claim access rights, peers enter certain items into a private set intersection computation. To claim access to the ", rs("Entry"), " of ", r("entry_namespace_id"), " ", def_value({id: "pai_ns1", singular: "n"}), ", a ", r("entry_path"), " starting with ", def_value({id: "pai_path1", singular: "p"}), ", and an arbitrary ", r("SubspaceId"), ", a peer submits pairs ", code("(", r("pai_ns1"), ", ", r("pai_prefix1"), ")"), " for each ", r("path_prefix"), " ", def_value({id: "pai_prefix1", singular: "prefix"}), " of ", r("pai_path1"), ". To claim access to the ", rs("Entry"), " of ", r("entry_namespace_id"), " ", def_value({id: "pai_ns2", singular: "n"}), ", ", r("entry_subspace_id"), " ", def_value({id: "pai_ss2", singular: "s"}), ", and a ", r("entry_path"), " starting with ", def_value({id: "pai_path2", singular: "p"}), ", a peer submits triplets ", code("(", r("pai_ns2"), ", ", r("pai_ss2"), ", ", r("pai_prefix2"), ")"), " for each ", r("path_prefix"), " ", def_value({id: "pai_prefix2", singular: "prefix"}), " of ", r("pai_path2"), ", as well as pairs ", code("(", r("pai_ns2"), ", ", r("pai_prefix2"), ")"), "."),

      pinformative("Assume Alfie submits the pairs for a combination of ", r("NamespaceId"), " and ", r("Path"), " (expressing interest in matching ", rs("Entry"), " of ", em("all"), " ", rs("SubspaceId"), "), and all these pairs lie in the intersection with the items submitted by Betty. Alfie can then conclude that Betty knows about the same ", r("NamespaceId"), " and ", r("Path"), ". Hence, Alfie can safely transmit a ", r("read_capability"), " for this combination, regardless of whether Betty cares about only a particular ", r("SubspaceId"), " or about all of them."),

      pinformative("Similarly, assume Alfies submits the triplets for a combination of  ", r("NamespaceId"), ", ", r("SubspaceId"), " and ", r("Path"), ", and all these triplets lie in the intersection with the items submitted by Betty. Alfie can then conclude that Betty knows about the same ", r("NamespaceId"), ", ", r("SubspaceId"), " and ", r("Path"), ". Hence, Alfie can safely transmit a ", r("read_capability"), " for this combination."),

      pinformative("These two cases cover all but one case in which the interests of the peers overlap. The final case is less straightforward, however."),

      pinformative("Assume Alfies submits the triplets for a combination of  ", r("NamespaceId"), ", ", r("SubspaceId"), " and ", r("Path"), ", but these triplets do not all lie in the intersection with the items submitted by Betty. As per the protocol, Alfie has also submitted the pairs that omit the ", r("SubspaceId"), ". Assume that all of these pairs ", em("are"), " in the intersection. It is possible for this to occur without triggering any of the other cases on Betty’s side either; this happens when Betty has submitted interest in the same ", r("namespace"), ", for a ", r("Path"), " ", r("path_prefix", "prefixed"), " by Alfie’s ", r("Path"), ", but for arbitrary ", rs("SubspaceId"), "."),

      pinformative("In this specific constellation, Betty cannot deduce that the interests overlap. Alfie can deduce so, but must not send his ", r("read_capability"), " directly: if he did, but Betty was lying, then she would obtain knowledge about a ", r("SubspaceId"), " she did not necessarily know before. Similarly, Betty cannot directly send her ", r("read_capability"), " either, because a lying Alfie would learn about her ", r("Path"), "."),

      pinformative("To solve this standoff, we employ a second type of unforgeable token, that lets Betty prove that she has access to the full ", r("subspace"), " at ", em("some"), " ", r("Path"), ", without specifying the ", r("Path"), " explicitly. Alfie detects the situation and requests this token, Betty proves that she is indeed authorized to know about arbitrary ", rs("SubspaceId"), " in this ", r("namespace"), ", and Alfie can then send his ", r("read_capability"), ", to which Betty replies with her own, proper ", r("read_capability"), "."),

      pinformative("We call these unforgeable tokens ", def({id: "subspace_capability", singular: "subspace capability", plural: "subspace capabilities"}, "subspace capabilities"), "; whenever a peer receives a ", r("read_capability"), " whose ", r("granted_area"), " has a ", r("AreaSubspace"), " of ", r("area_any"), " and a non-empty ", r("AreaPath"), ", it should also receive a corresponding ", r("subspace_capability"), ". Each ", r("subspace_capability"), " must have a single ", def({ id: "subspace_receiver", singular: "receiver" }), " (a ", r("dss_pk"), " of some ", r("signature_scheme"), "), a single ", def({ id: "subspace_granted_namespace", singular: "granted namespace" }), " (a ", r("NamespaceId"), "), and a single ", def({ id: "granted_subspace", singular: "granted subspace" }), " (a ", r("SubspaceId"), ")."),
    ]),

    hsection("subspace_capabilities_meadowcap", "Subspace Capabilities and Meadowcap", [
      pinformative("We conclude by presenting a datatype that implements ", rs("subspace_capability"), ", nicely complementing ", link_name("meadowcap", "Meadowcap"), ". Note that in Meadowcap, ", rs("read_capability"), " for all ", rs("subspace"), " of a ", r("namespace"), "can only exist in ", rs("owned_namespace"), "."),

      pseudocode(
        new Struct({
            id: "SubspaceCapability",
            plural: "SubspaceCapabilities",
            comment: ["A capability that certifies read access to arbitrary ", rs("SubspaceId"), " at some unspecified ", r("Path"), "."],
            fields: [
                {
                    id: "subspace_cap_namespace",
                    name: "namespace_key",
                    comment: ["The ", r("namespace"), " for which this grants access."],
                    rhs: r("NamespacePublicKey"),
                },
                {
                    id: "subspace_cap_subspace",
                    name: "subspace_key",
                    comment: ["The ", r("subspace"), " for which this grants access."],
                    rhs: r("UserPublicKey"),
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

      pinformative("The ", r("subspace_cap_receiver"), " of a ", r("SubspaceCapability"), " is the user to whom it grants access. Formally, the ", def({id: "subspace_cap_receiver", singular: "receiver"}), " is the final ", r("UserPublicKey"), " in the ", r("subspace_cap_delegations"), ", or the ", r("subspace_cap_user"), " if the ", r("subspace_cap_delegations"), " are empty."),

      pinformative("The ", r("subspace_cap_granted_namespace"), " of a ", r("SubspaceCapability"), " is the ", r("namespace"), " for which it grants access. Formally, the ", def({id: "subspace_cap_granted_namespace", singular: "granted namespace"}), " of a ", r("SubspaceCapability"), " is its ", r("subspace_cap_namespace"), "."),

      pinformative("The ", r("subspace_cap_granted_subspace"), " of a ", r("SubspaceCapability"), " is the ", r("subspace"), " for which it grants access. Formally, the ", def({id: "subspace_cap_granted_subspace", singular: "granted subspace"}), " of a ", r("SubspaceCapability"), " is its ", r("subspace_cap_subspace"), "."),

      pinformative(R("subspace_cap_valid", "Validity"), " governs how ", rs("SubspaceCapability"), " can be delegated. We define ", def({id: "subspace_cap_valid", singular: "valid"}, "validity", [pinformative("A ", r("SubspaceCapability"), " is ", def_fake("subspace_cap_valid", "valid"), " if its ", r("subspace_cap_delegations"), " form a correct chain of ", rs("dss_signature"), " over ", rs("UserPublicKey"), "."), pinformative("For the formal definition, click the reference, the proper definition does not fit into a tooltip.")]), " inductively based on the number of ", r("subspace_cap_delegations"), "."),

      pinformative("A ", r("SubspaceCapability"), " with zero ", r("subspace_cap_delegations"), " is ", r("subspace_cap_valid"), " if ", r("subspace_cap_initial_authorisation"), " is a ", r("NamespaceSignature"), " issued by the ", r("subspace_cap_namespace"), " over the byte ", code("0x02"), ", followed by the ", r("subspace_cap_user"), " (encoded via ", r("encode_user_pk"), ")."),

      pinformative("For the inductive case, let ", def_value({id: "subspace_prev_cap", singular: "prev_cap"}), " be a ", r("subspace_cap_valid"), " ", r("SubspaceCapability"), " with ", r("subspace_cap_receiver"), " ", def_value({id: "subspace_prev_receiver", singular: "prev_receiver"}), ", and ", r("subspace_cap_granted_subspace"), " ", def_value({id: "subspace_prev_subspace", singular: "prev_subspace"}), ". Now let ", def_value({id: "subspace_cap_defvalid", singular: "cap"}), " be a ", r("SubspaceCapability"), " obtained from ", r("subspace_prev_cap"), " by appending a pair ", code("(", def_value({id: "subspace_new_user", singular: "new_user"}), ", ", def_value({id: "subspace_new_signature", singular: "new_signature"}), ")"), " to ", field_access(r("subspace_prev_cap"), "subspace_cap_delegations"), "."),

      pinformative("Then ", r("subspace_cap_defvalid"), " is ", r("subspace_cap_valid"), " if ", r("subspace_new_signature"), " is a ", r("UserSignature"), " issued by the ", r("subspace_prev_receiver"), " over the bytestring ", def_value({id: "subspace_handover", singular: "handover"}), ", which is defined as follows:"),

      lis(
        [
          "If ", field_access(r("subspace_prev_cap"), "subspace_cap_delegations"), " is empty, then ", r("subspace_handover"), " is the concatenation of the following bytestrings:",
          lis(
            [function_call(r("encode_user_sig"), field_access(r("subspace_prev_cap"), "subspace_cap_initial_authorisation")), "."],
            [function_call(r("encode_user_pk"), r("subspace_new_user")), "."],
          ),
        ],
        [
          preview_scope("Otherwise, let ", def_value({id: "subspace_prev_signature", singular: "prev_signature"}), " be the ", r("UserSignature"), " in the last pair of ", field_access(r("subspace_prev_cap"), "subspace_cap_delegations"), "."), " Then ", r("subspace_handover"), " is the concatenation of the following bytestrings:",
          lis(
            [function_call(r("encode_user_sig"), r("subspace_prev_signature")), "."],
            [function_call(r("encode_user_pk"), r("subspace_new_user")), "."],
          ),
        ],
      ),
    ]),

  ],
);
