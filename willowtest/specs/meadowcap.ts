import { R, Rs, def, def_fake, preview_scope, r, rs } from "../../defref.ts";
import { code, em, figure, img } from "../../h.ts";
import { hsection, table_of_contents } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale } from "../../marginalia.ts";
import { asset } from "../../out.ts";
import { Struct, def_symbol, pseudocode, pseudo_choices, pseudo_array, pseudo_tuple, field_access, function_call } from "../../pseudocode.ts";
import { Expression, surpress_output } from "macro";
import {
aside_block,
def_parameter_fn,
def_parameter_type,
def_parameter_value,
  def_value,
  link,
  lis,
  path,
  pinformative,
  quotes,
  site_template,
} from "../main.ts";

export const meadowcap: Expression = site_template(
  {
    title: "Meadowcap",
    name: "meadowcap",
    status: "candidate",
    status_date: "17.01.2024",
  },
  [
    pinformative(
      "Meadowcap is a capability system for use with Willow. In this specification, we assume familiarity with the ",
      link_name("data_model", "Willow data model"),
      ".",
    ),
    
    table_of_contents(7),

    hsection("meadowcap_overview", "Overview", [
      pinformative("When interacting with a peer in Willow, there are two fundamental operations: ", em("writing"), " data — asking your peer to add ", rs("Entry"), " to their ", rs("store"), " — and ", em("reading"), " data — asking your peer to send ", rs("Entry")," to you. Both operations should be restricted; Willow would be close to useless if everyone in the world could (over-)write data everywhere, and it would be rather scary if everyone could request to read any piece of data."),

      pinformative("A capability system helps enforce boundaries on who gets to read and write which data. A ", em("capability"), " is an unforgeable token that bestows read or write access for some data to a particular person, issued by the owner of that data. When Alfie asks Betty for some entries owned by Gemma, then Betty will only answer when presented with a valid capability proving that Gemma gave read access to Alfie. Similarly, Betty will not integrate data created by Alfie in a ", r("subspace"), " owned by Gemma, unless the data is accompanied by a capability proving that Gemma gave write access to Alfie."),

      figure(
        img(asset("meadowcap/capability_attempts.png"), `A two-column comic. The left column first shows Alfie handing a neat slip of paper to Betty. The second panel shows Betty inspecting the paper with a magnifying glass. The magnified text clearly reads "signed: Gemma". In the final panel, a happy Betty hands a box over to a happy Alfie. The right column depicts a less fruitful interaction. A cartoonish troll approaches Betty with a crumpled paper sheet. When Betty inspects it in the second panel, it reads "i AM StiNKY GEMA", clearly not Gemma’s real signature. In the final panel, Betty tells the troll off, not handing over anything.`),
      ),

      pinformative("What makes somebody ", quotes("the owner"), " of ", quotes("some data"), "? Meadowcap offers two different models, which we call ", rs("owned_namespace"), " and ", rs("communal_namespace"), "."),

      marginale([
        img(asset("meadowcap/communal_namespace.png"), `A front view of a stylised house. The house has three separate entries, each with a differently-coloured keyhole. Above each entry is a window in a matching color, each with some happy denizens sticking their heads out. The outer windows contain a single person each, the middle window is shared by two people.`),
        "A ", r("communal_namespace"), ". Metaphorically, everyone has their own private space in the same building.",
      ]),

      pinformative(
        "In a ", def({
          id: "communal_namespace",
          singular: "communal namespace",
          plural: "communal namespaces",
        }), ", each ", r("subspace"), " is owned by a particular author. This is implemented by using public keys of a ", link("digital signature scheme", "https://en.wikipedia.org/wiki/Digital_signature_scheme"), " as ", rs("SubspaceId"), ", you then prove ownership by providing valid signatures (which requires the corresponding secret key).",
      ),

      marginale([
        img(asset("meadowcap/owned_namespace.png"), "A similar front view of a house, with windows showing the inhabitants. Unlike the preceding drawing, this house only a single door, with an orange keyhole. The three windows each show a combination of orange and an individual color per window. In front of the window stands the owner, dutifully (and cheerfully) maintaining the lawn with a broom."),
        "An ", r("owned_namespace"), ". Metaphorically, a single owner manages others’ access to their building.",
      ]),

      pinformative(
        "In an ", def({
          id: "owned_namespace",
          singular: "owned namespace",
          plural: "owned namespaces",
        }), ", the person who created the ", r("namespace"), " is the owner of all its data. To implement this, ", rs("NamespaceId"), " are public keys. In an ", r("owned_namespace"), ", peers reject all requests unless they involve a signature from the ", r("namespace"), " keypair; in a ", r("communal_namespace"), ", peers reject all requests unless they involve a signature from the ", r("subspace"), " keypair.",
      ),

      pinformative(rs("owned_namespace", "Owned namespaces"), " would be quite pointless were it not for the next feature: ", em("capability delegation"), ". A capability bestows not only access rights but also the ability to mint new capabilities for the same resources but to another peer. When you create an owned namespace, you can invite others to join the fun by delegating read and/or write access to them."),

      pinformative("The implementation relies on signature schemes again. Consider Alfie and Betty, each holding a key pair. Alfie can mint a new capability for Betty by signing his own capability together with her public key."),

      pinformative("Once Alfie has minted a capability for Betty, Betty can mint one (or several) for Gemma, and so on."),

      pinformative("Verifying whether a delegated capability bestows access rights is done recursively: check that the last delegation step is accompanied by a valid signature, then verify the capability that was being delegated."),

      pinformative("The next important feature of Meadowcap is that of ", em("restricting"), " capabilities. Suppose I maintain several code repositories inside my personal ", r("subspace"), ". I use different ", rs("Path"), " to organise the data pertaining to different repositories, say ", path("code", "seasonal-clock"), " and ", path("code", "earthstar"), ". If I wanted to give somebody write-access to the ", path("code", "seasonal-clock"), " repository, I should ", em("not"), " simply grant them write access to my complete ", r("subspace"), " — if I did, they could also write to ", path("code", "earthstar"), ". Or to ", path("blog", "embarrassing-facts"), " for that matter.", ),

      pinformative("Hence, Meadowcap allows to ", em("restrict"), " capabilities, turning them into less powerful ones. Restrictions can limit access by ", r("entry_subspace_id"), ", by ", r("entry_path"), ", and/or by ", r("entry_timestamp"), "."),

      aside_block(
        pinformative("Another typical example of using restrictions is an ", r("owned_namespace"), ", whose owner — Owen — gives write capabilities for distinct ", rs("subspace"), " to distinct people. Alfie might get the ", r("subspace"), " of ", r("SubspaceId"), " ", code("alfies-things"), ", Betty would get ", code("bettys-things"), ", and so on. This results in a system similar to a ", r("communal_namespace"), ", except that Owen has control over who gets to participate, and can also remove or change anything written by Alfie or Betty. It is however still clear which ", rs("Entry"), " were created by Owen and which were not — Owen cannot impersonate anyone."),
  
        pinformative("Going even further, Owen might only give out capabilities that are valid for one week at a time. If Alfie starts posting abusive comments, Owen can delete some or all of Alfie's ", rs("Entry"), " by writing ", rs("Entry"), " to ", code("alfies-things"), " whose ", r("entry_timestamp"), " lies two weeks in the future. Any ", rs("Entry"), " Alfie can create are immediately overwritten by Owen's ", rs("Entry"), " from the future. Owen probably will not give Alfie a new capability at the end of the week either, effectively removing Alfie from the space."),
  
        pinformative("Using these techniques, Willow can support moderated spaces similar to, for example, the fediverse. And Owen can create powerful capabilities that allow other, trusted people to help moderating the space. If the idea of a privileged group of users who can actively shape what happens in a ", r("namespace"), " makes you feel safe and unburdened, ", rs("owned_namespace"), " might be for you. If it sounds like an uncomfortable level of control and power, you might prefer ", rs("communal_namespace"), ". Meadowcap supports both, because we believe that both kinds of spaces fulfil important roles.",),
      ),
      
      marginale(["If it helps to have some code to look at, there's also a ", link("reference implementation", "https://github.com/earthstar-project/meadowcap-js"), " of Meadowcap."]),

      pinformative("This concludes the intuitive overview of Meadowcap. The remainder of this document is rather formal: capabilities are a security feature, so we have to be fully precise when defining them."),
    ]),

    hsection("meadowcap_parameters", "Parameters", [
      pinformative("Like Willow, Meadowcap is a generic protocol that needs to be instantiated with concrete choices for the parameters we describe in this section."),

      pinformative("Meadowcap makes heavy use of ", link("digital signature schemes", "https://en.wikipedia.org/wiki/Digital_signature"), "; it assumes that Willow uses public keys as ", rs("NamespaceId"), " and ", rs("SubspaceId"), ". ", preview_scope(
        "A ", def({id: "signature_scheme", singular: "signature scheme"}), " consists of three algorithms:", lis(
          [def_value({id: "dss_generate_keys", singular: "generate_keys"}), " maps a ", def_value({id: "dss_seed", singular: "seed"}), " to a ", def_value({id: "dss_pk", singular: "public key"}), " and a ", def({id: "correspond"}, "corresponding"), " ", def_value({id: "dss_sk", singular: "secret key"}), "."],

          [def_value({id: "dss_sign", singular: "sign"}), " maps a ", r("dss_sk"), " and a bytestring to a ", def_value({id: "dss_signature", singular: "signature"}), " of the bytestring."],

          [def_value({id: "dss_verify", singular: "verify"}), " takes a ", r("dss_pk"), ", a ", r("dss_signature"), ", and a bytestring, and returns whether the ", r("dss_signature"), " had been created with the ", r("dss_sk"), " that ", r("correspond", "corresponds"), " to the given ", r("dss_pk"), "."],
        ),
      )),

      pinformative("An instantiation of Meadowcap must define concrete choices of the following parameters:"),

      lis(
          [
              marginale(["In ", rs("owned_namespace"), ", all valid capabilities stem from knowing a particular ", r("dss_sk"), " of the ", r("namespace_signature_scheme"), "."]),
              "A ", r("signature_scheme"), " ", def_parameter_value("namespace_signature_scheme", "namespace_signature_scheme", ["A protocol parameter of Meadowcap, the ", r("signature_scheme"), " from which authority stems in ", rs("owned_namespace"), "."]), " consisting of algorithms ", def_parameter_fn("namespace_generate_keys", "namespace_generate_keys", ["A protocol parameter of Meadowcap, the ", r("dss_generate_keys"), " function of the ", r("namespace_signature_scheme"), "."]), ", ", def_parameter_fn("namespace_sign", "namespace_sign", ["A protocol parameter of Meadowcap, the ", r("dss_sign"), " function of the ", r("namespace_signature_scheme"), "."]), ", and ", def_parameter_fn("namespace_verify", "namespace_verify", ["A protocol parameter of Meadowcap, the ", r("dss_verify"), " function of the ", r("namespace_signature_scheme"), "."]), ". The ", rs("dss_pk"), " have type ", def_parameter_type("NamespacePublicKey", "NamespacePublicKey", ["A protocol parameter of Meadowcap, the type of ", rs("dss_pk"), " of the ", r("namespace_signature_scheme"), "."]), ", and the ", rs("dss_signature"), " have type ", def_parameter_type("NamespaceSignature", "NamespaceSignature", ["A protocol parameter of Meadowcap, the type of ", rs("dss_signature"), " of the ", r("namespace_signature_scheme"), "."]), "."
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter_fn("encode_namespace_pk", "encode_namespace_pk", ["A protocol parameter of Meadowcap, the ", r("encoding_function"), " of ", r("NamespacePublicKey"), "."]), " for ", r("NamespacePublicKey"), ".",
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter_fn("encode_namespace_sig", "encode_namespace_sig", ["A protocol parameter of Meadowcap, the ", r("encoding_function"), " of ", r("NamespaceSignature"), "."]), " for ", r("NamespaceSignature"), ".",
          ],

          [
              marginale(["Users identities are ", rs("dss_pk"), " of the ", r("user_signature_scheme"), ". Further, ", rs("SubspaceId"), " must be ", rs("dss_pk"), " of the ", r("user_signature_scheme"), " as well. In ", rs("communal_namespace"), ", all valid capabilities stem from knowing a particular ", r("dss_sk"), " of the ", r("user_signature_scheme"), "."]),
              "A ", r("signature_scheme"), " ", def_parameter_value("user_signature_scheme", "user_signature_scheme", ["A protocol parameter of Meadowcap, the ", r("signature_scheme"), " from which authority stems in ", rs("communal_namespace"), ", and which is used when delegating capabilities."]), " consisting of algorithms ", def_parameter_fn("user_generate_keys", "user_generate_keys", ["A protocol parameter of Meadowcap, the ", r("dss_generate_keys"), " function of the ", r("user_signature_scheme"), "."]), ", ", def_parameter_fn("user_sign", "user_sign", ["A protocol parameter of Meadowcap, the ", r("dss_sign"), " function of the ", r("user_signature_scheme"), "."]), ", and ", def_parameter_fn("user_verify", "user_verify", ["A protocol parameter of Meadowcap, the ", r("dss_verify"), " function of the ", r("user_signature_scheme"), "."]), ". The ", rs("dss_pk"), " have type ", def_parameter_type("UserPublicKey", "UserPublicKey", ["A protocol parameter of Meadowcap, the type of ", rs("dss_pk"), " of the ", r("user_signature_scheme"), "."]), ", and the ", rs("dss_signature"), " have type ", def_parameter_type("UserSignature", "UserSignature", ["A protocol parameter of Meadowcap, the type of ", rs("dss_signature"), " of the ", r("user_signature_scheme"), "."]), "."
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter_fn("encode_user_pk", "encode_user_pk", ["A protocol parameter of Meadowcap, the ", r("encoding_function"), " of ", r("UserPublicKey"), "."]), " for ", r("UserPublicKey"), ".",
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter_fn("encode_user_sig", "encode_user_sig", ["A protocol parameter of Meadowcap, the ", r("encoding_function"), " of ", r("UserSignature"), "."]), " for ", r("UserSignature"), ".",
          ],

          [
              "A function ", def_parameter_fn("is_communal", "is_communal", ["A protocol parameter of Meadowcap, a function from ", rs("NamespacePublicKey"), " to ", rs("Bool"), ", deciding whether a ", r("namespace"), " is ", r("communal_namespace", "communal"), " or ", r("owned_namespace", "owned"), "."]), " that maps ", rs("NamespacePublicKey"), " to booleans, determining whether a ", r("namespace"), " of a particular ", r("NamespaceId"), " is ", r("communal_namespace", "communal"), " or ", r("owned_namespace", "owned"), ".",
          ],

          [
              "Limits on the sizes of the ", rs("Path"), " and their ", rs("Component"), " that can appear in capabilities:", lis(
                [
                  "A natural number ", def_parameter_value({id: "mc_max_component_length", singular: "max_component_length"}, "max_component_length", ["A protocol parameter of Meadowcap, the maximal length of individual ", rs("Component"), "."]), " for limiting the length of individual ", rs("Component"), ".",
                ],
                [
                    "A natural number ", def_parameter_value({id: "mc_max_component_count", singular: "max_component_count"}, "max_component_count", ["A protocol parameter of Meadowcap, the maximal number of ", rs("Component"), " in a single ", r("Path"), "."]), " for limiting the number of ", rs("Component"), " per ", r("Path"), ".",
                ],
                [
                    "A natural number ", def_parameter_value({id: "mc_max_path_length", singular: "max_path_length"}, "max_path_length", ["A protocol parameter of Meadowcap, the maximal sum of the lengths of the ", rs("Component"), " of a single ", r("Path"), " in bytes."]), " for limiting the overall size of ", rs("Path"), ".",
                ],
              ),
          ],
      ),

      pinformative("A Meadowcap instantiation is ", def({id: "mc_compatible", singular: "compatible"}), " with Willow if", lis(
        ["the Willow parameter ", r("NamespaceId"), " is equal to the Meadowcap parameter ", r("NamespacePublicKey"), ","],
        ["the Willow parameter ", r("SubspaceId"), " is equal to the Meadowcap parameter ", r("UserPublicKey"), ", and"],
        ["the Willow parameters ", r("max_component_length"), ", ", r("max_component_count"), ", and ", r("max_path_length"), " are equal to the Meadowcap parameters ", r("mc_max_component_length"), ", ", r("mc_max_component_count"), ", and ", r("mc_max_path_length"), " respectively."],
      )),

      pinformative("Throughout the specification, we use these pairs of parameters interchangeably."),
    ]),

    hsection("capabilities", "Capabilities", [
      surpress_output(
        def_symbol({id: "access_read", singular: "read"}, "read", ["A value to signify that a capability grants the ability to ", em("read"), " ", rs("Entry"), "."]),
        def_symbol({id: "access_write", singular: "write"}, "write", ["A value to signify that a capability grants the ability to ", em("write"), " ", rs("Entry"), "."]),
      ),

      pinformative(
        marginale(img(asset("meadowcap/capability_semantics.png"), `A neat piece of paper, styled like an admission ticket, with a heading saying "This Capability Grants...". The heading is followed by four sections. The first section states the receiver as "Alfie", the second section states the granting of "read access", the third section gives a time range of "all messages from last week", and, finally, a large stamp mark simply says "valid".`)),
        "Intuitively, a capability should be some piece of data that answers four questions: To whom does it grant access? Does it grant read or write access? For which ", rs("Entry"), " does it grant access? And finally, is it valid or a forgery?",
      ),

      pinformative("We define three types that provide these semantics: one for implementing ", rs("communal_namespace"), ", one for implementing ", rs("owned_namespace"), ", and one for combining both."),

      hsection("communal_capabilities", "Communal Namespaces", [
        pseudocode(
          new Struct({
              id: "CommunalCapability",
              plural: "CommunalCapabilities",
              comment: ["A capability that implements ", rs("communal_namespace"), "."],
              fields: [
                  {
                      id: "communal_cap_access_mode",
                      name: "access_mode",
                      comment: ["The kind of access this grants."],
                      rhs: pseudo_choices(r("access_read"), r("access_write")),
                  },
                  {
                      id: "communal_cap_namespace",
                      name: "namespace_key",
                      comment: ["The ", r("namespace"), " in which this grants access."],
                      rhs: r("NamespacePublicKey"),
                  },
                  {
                      id: "communal_cap_user",
                      name: "user_key",
                      marginale: ["Remember that we assume ", r("SubspaceId"), " and ", r("UserPublicKey"), " to be the same types."],
                      comment: [
                        pinformative("The ", r("subspace"), " ", em("for which"), " and ", em("to whom"), " this grants access."),
                      ],
                      rhs: r("UserPublicKey"),
                  },
                  {
                      id: "communal_cap_delegations",
                      name: "delegations",
                      comment: ["Successive authorisations of new ", rs("UserPublicKey"), ", each restricted to a particular ", r("Area"), "."],
                      rhs: pseudo_array(pseudo_tuple(r("Area"), r("UserPublicKey"), r("UserSignature"))),
                  },
              ],
          }),
        ),

        pinformative("The ", def({id: "communal_cap_mode", singular: "access mode"}), " of a ", r("CommunalCapability"), " ", def_value({id: "communal_mode_cap", singular: "cap"}), " is ", field_access(r("communal_mode_cap"), "communal_cap_access_mode"), "."),
  
        pinformative("The ", r("communal_cap_receiver"), " of a ", r("CommunalCapability"), " is the user to whom it grants access. Formally, the ", def({id: "communal_cap_receiver", singular: "receiver"}), " is the final ", r("UserPublicKey"), " in the ", r("communal_cap_delegations"), ", or the ", r("communal_cap_user"), " if the ", r("communal_cap_delegations"), " are empty."),

        pinformative("The ", r("communal_cap_granted_namespace"), " of a ", r("CommunalCapability"), " is the ", r("namespace"), " for which it grants access. Formally, the ", def({id: "communal_cap_granted_namespace", singular: "granted namespace"}), " of a ", r("CommunalCapability"), " is its ", r("communal_cap_namespace"), "."),
  
        pinformative("The ", r("communal_cap_granted_area"), " of a ", r("CommunalCapability"), " is the ", r("Area"), " for which it grants access. Formally, the ", def({id: "communal_cap_granted_area", singular: "granted area"}), " of a ", r("CommunalCapability"), " is the final ", r("Area"), " in its ", r("communal_cap_delegations"), " if the ", r("communal_cap_delegations"), " are non-empty. Otherwise, it is the ", r("subspace_area"), " of the ", r("communal_cap_user"), "."),
  
        pinformative(R("communal_cap_valid", "Validity"), " governs how ", rs("CommunalCapability"), " can be delegated and restricted. We define ", def({id: "communal_cap_valid", singular: "valid"}, "validity", [pinformative("A ", r("CommunalCapability"), " is ", def_fake("communal_cap_valid", "valid"), " if its ", r("communal_cap_delegations"), " form a correct chain of ", rs("dss_signature"), " over ", rs("UserPublicKey"), ", and if the ", rs("Area"), " form a chain of containment."), pinformative("For the formal definition, click the reference, the proper definition does not fit into a tooltip.")]), " based on the number of ", r("communal_cap_delegations"), "."),
  
        pinformative("Every ", r("CommunalCapability"), " with zero ", r("communal_cap_delegations"), " is ", r("communal_cap_valid"), "."),

        pinformative("For a ", rs("CommunalCapability"), " ", def_value({id: "communal_cap_defvalid", singular: "cap"}), " with more than zero ", r("communal_cap_delegations"), ", let ", code("(", def_value({id: "communal_new_area", singular: "new_area"}), ", ", def_value({id: "communal_new_user", singular: "new_user"}), ", ", def_value({id: "communal_new_signature", singular: "new_signature"}), ")"), "be the final triplet of ", field_access(r("communal_cap_defvalid"), "communal_cap_delegations"), ", and let ", def_value({id: "communal_prev_cap", singular: "prev_cap"}), " be the ", r("CommunalCapability"), " obtained by removing the last triplet from ", field_access(r("communal_cap_defvalid"), "communal_cap_delegations"), ". Denote the  ", r("communal_cap_receiver"), " of ", r("communal_prev_cap"), " as ", def_value({id: "communal_prev_receiver", singular: "prev_receiver"}), ", and the ", r("communal_cap_granted_area"), " of ", r("communal_prev_cap"), " as ", def_value({id: "communal_prev_area", singular: "prev_area"}), "."),
  
        pinformative("Then ", r("communal_cap_defvalid"), " is ", r("communal_cap_valid"), " if ", r("communal_prev_cap"), " is ", r("communal_cap_valid"), ", the ", r("communal_cap_granted_area"), " of ", r("communal_prev_cap"), " ", rs("area_include_area"), " ", r("communal_new_area"), ", and ", r("communal_new_signature"), " is a ", r("UserSignature"), " issued by the ", r("communal_prev_receiver"), " over the bytestring ", def_value({id: "communal_handover", singular: "handover"}), ", which is defined as follows:"),
  
        lis(
          [
            "If ", field_access(r("communal_prev_cap"), "communal_cap_delegations"), " is empty, then ", r("communal_handover"), " is the concatenation of the following bytestrings:",
            lis(
              ["the byte ", code("0x00"), " (if ", field_access(r("communal_prev_cap"), "communal_cap_access_mode"), " is ", r("access_read"), ") or the byte ", code("0x01"), " (if ", field_access(r("communal_prev_cap"), "communal_cap_access_mode"), " is ", r("access_write"), "),"],
              [code(function_call(r("encode_namespace_pk"), field_access(r("communal_prev_cap"), "communal_cap_namespace"))), ","],
              [code(function_call(r("encode_area_in_area"), r("communal_new_area"), r("communal_prev_area"))), ","],
              [code(function_call(r("encode_user_pk"), r("communal_new_user"))), "."],
            ),
          ],
          [
            preview_scope("Otherwise, let ", def_value({id: "communal_prev_signature", singular: "prev_signature"}), " be the ", r("UserSignature"), " in the last triplet of ", field_access(r("communal_prev_cap"), "communal_cap_delegations"), "."), " Then ", r("communal_handover"), " is the concatenation of the following bytestrings:",
            lis(
              [code(function_call(r("encode_area_in_area"), r("communal_new_area"), r("communal_prev_area"))), ","],
              [code(function_call(r("encode_user_sig"), r("communal_prev_signature"))), "."],
              [code(function_call(r("encode_user_pk"), r("communal_new_user"))), "."],
            ),
          ],
        ),

      ]),

      hsection("owned_capabilities", "Owned Namespaces", [
        pseudocode(
          new Struct({
              id: "OwnedCapability",
              plural: "OwnedCapabilities",
              comment: ["A capability that implements ", rs("owned_namespace"), "."],
              fields: [
                  {
                      id: "owned_cap_access_mode",
                      name: "access_mode",
                      comment: ["The kind of access this grants."],
                      rhs: pseudo_choices(r("access_read"), r("access_write")),
                  },
                  {
                      id: "owned_cap_namespace",
                      name: "namespace_key",
                      comment: ["The ", r("namespace"), " for which this grants access."],
                      rhs: r("NamespacePublicKey"),
                  },
                  {
                      id: "owned_cap_user",
                      name: "user_key",
                      comment: [
                        pinformative("The user ", em("to whom"), " this grants access; granting access for the full ", r("owned_cap_namespace"), ", not just to a ", r("subspace"), "."),
                      ],
                      rhs: r("UserPublicKey"),
                  },
                  {
                      id: "owned_cap_initial_authorisation",
                      name: "initial_authorisation",
                      comment: [
                        pinformative("Authorisation of the ", r("owned_cap_user"), " by the ", r("owned_cap_namespace"), "."),
                      ],
                      rhs: r("NamespaceSignature"),
                  },
                  {
                      id: "owned_cap_delegations",
                      name: "delegations",
                      comment: ["Successive authorisations of new ", rs("UserPublicKey"), ", each restricted to a particular ", r("Area"), "."],
                      rhs: pseudo_array(pseudo_tuple(r("Area"), r("UserPublicKey"), r("UserSignature"))),
                  },
              ],
          }),
        ),

        pinformative("The ", def({id: "owned_cap_mode", singular: "access mode"}), " of an ", r("OwnedCapability"), " ", def_value({id: "owned_mode_cap", singular: "cap"}), " is ", field_access(r("owned_mode_cap"), "owned_cap_access_mode"), "."),
  
        pinformative("The ", r("owned_cap_receiver"), " of an ", r("OwnedCapability"), " is the user to whom it grants access. Formally, the ", def({id: "owned_cap_receiver", singular: "receiver"}), " is the final ", r("UserPublicKey"), " in the ", r("owned_cap_delegations"), ", or the ", r("owned_cap_user"), " if the ", r("owned_cap_delegations"), " are empty."),

        pinformative("The ", r("owned_cap_granted_namespace"), " of an ", r("OwnedCapability"), " is the ", r("namespace"), " for which it grants access. Formally, the ", def({id: "owned_cap_granted_namespace", singular: "granted namespace"}), " of an ", r("OwnedCapability"), " is its ", r("owned_cap_namespace"), "."),
  
        pinformative("The ", r("owned_cap_granted_area"), " of an ", r("OwnedCapability"), " is the ", r("Area"), " for which it grants access. Formally, the ", def({id: "owned_cap_granted_area", singular: "granted area"}), " of an ", r("OwnedCapability"), " is the final ", r("Area"), " in its ", r("owned_cap_delegations"), " if the ", r("owned_cap_delegations"), " are non-empty. Otherwise, it is the ", r("full_area"), "."),
  
        pinformative(R("owned_cap_valid", "Validity"), " governs how ", rs("OwnedCapability"), " can be delegated and restricted. We define ", def({id: "owned_cap_valid", singular: "valid"}, "validity", [pinformative("An ", r("OwnedCapability"), " is ", def_fake("owned_cap_valid", "valid"), " if its ", r("owned_cap_delegations"), " form a correct chain of ", rs("dss_signature"), " over ", rs("UserPublicKey"), ", and if the ", rs("Area"), " form a chain of containment."), pinformative("For the formal definition, click the reference, the proper definition does not fit into a tooltip.")]), " based on the number of ", r("owned_cap_delegations"), "."),

        pinformative("An ", r("OwnedCapability"), " with zero ", r("owned_cap_delegations"), " is ", r("owned_cap_valid"), " if ", r("owned_cap_initial_authorisation"), " is a ", r("NamespaceSignature"), " issued by the ", r("owned_cap_namespace"), " over either the byte ", code("0x02"), " (if ", r("owned_cap_access_mode"), " is ", r("access_read"), ") or the byte ", code("0x03"), " (if ", r("owned_cap_access_mode"), " is ", r("access_write"), "), followed by the ", r("owned_cap_user"), " (encoded via ", r("encode_user_pk"), ")."),

        pinformative("For an ", rs("OwnedCapability"), " ", def_value({id: "owned_cap_defvalid", singular: "cap"}), " with more than zero ", r("owned_cap_delegations"), ", let ", code("(", def_value({id: "owned_new_area", singular: "new_area"}), ", ", def_value({id: "owned_new_user", singular: "new_user"}), ", ", def_value({id: "owned_new_signature", singular: "new_signature"}), ")"), "be the final triplet of ", field_access(r("owned_cap_defvalid"), "owned_cap_delegations"), ", and let ", def_value({id: "owned_prev_cap", singular: "prev_cap"}), " be the ", r("OwnedCapability"), " obtained by removing the last triplet from ", field_access(r("owned_cap_defvalid"), "owned_cap_delegations"), ". Denote the  ", r("owned_cap_receiver"), " of ", r("owned_prev_cap"), " as ", def_value({id: "owned_prev_receiver", singular: "prev_receiver"}), ", and the ", r("owned_cap_granted_area"), " of ", r("owned_prev_cap"), " as ", def_value({id: "owned_prev_area", singular: "prev_area"}), "."),
  
        pinformative("Then ", r("owned_cap_defvalid"), " is ", r("owned_cap_valid"), " if ", r("owned_prev_cap"), " is ", r("owned_cap_valid"), ", the ", r("owned_cap_granted_area"), " of ", r("owned_prev_cap"), " ", rs("area_include_area"), " ", r("owned_new_area"), ", and ", r("owned_new_signature"), " is a ", r("UserSignature"), " issued by the ", r("owned_prev_receiver"), " over the bytestring ", def_value({id: "owned_handover", singular: "handover"}), ", which is defined as follows:"),
  
        lis(
          [
            "If ", field_access(r("owned_prev_cap"), "owned_cap_delegations"), " is empty, then ", r("owned_handover"), " is the concatenation of the following bytestrings:",
            lis(
              [code(function_call(r("encode_area_in_area"), r("owned_new_area"), r("owned_prev_area"))), ","],
              [code(function_call(r("encode_user_sig"), field_access(r("owned_prev_cap"), "owned_cap_initial_authorisation"))), "."],
              [code(function_call(r("encode_user_pk"), r("owned_new_user"))), "."],
            ),
          ],
          [
            preview_scope("Otherwise, let ", def_value({id: "owned_prev_signature", singular: "prev_signature"}), " be the ", r("UserSignature"), " in the last triplet of ", field_access(r("owned_prev_cap"), "owned_cap_delegations"), "."), " Then ", r("owned_handover"), " is the concatenation of the following bytestrings:",
            lis(
              [code(function_call(r("encode_area_in_area"), r("owned_new_area"), r("owned_prev_area"))), ","],
              [code(function_call(r("encode_user_sig"), r("owned_prev_signature"))), "."],
              [code(function_call(r("encode_user_pk"), r("owned_new_user"))), "."],
            ),
          ],
        ),

      ]),

      hsection("proper_capabilities", "Bringing Everything Together", [
        pinformative(Rs("CommunalCapability"), " and ", rs("OwnedCapability"), " are capability types for realising ", rs("communal_namespace"), " and ", rs("owned_namespace"), " respectively. It remains", marginale(["If you do not need to support both cases, you can also use one of ", rs("CommunalCapability"), " or ", rs("OwnedCapability"), " directly."]), " to define a type that unifies both."),
        
        pinformative("Crucially, for a given ", r("NamespaceId"), ", all its valid capabilities should implement either a ", r("communal_namespace"), " or an ", r("owned_namespace"), ", but there should be no mixture of capabilities. It should be impossible to have people believe they work in a ", r("communal_namespace"), ", for example, only to later present an ", r("OwnedCapability"), " that allows you to read or edit all their ", rs("Entry"), "."),

        pinformative("To ensure a strict distinction between ", rs("communal_namespace"), " and ", rs("owned_namespace"), ", we rely on the function ", r("is_communal"), " that specifies which kinds of capabilities are valid for which ", rs("namespace"), "."),

        pseudocode(
          new Struct({
              id: "Capability",
              name: "McCapability",
              plural: "McCapabilities",
              comment: ["A Meadowcap capability."],
              fields: [
                  {
                      id: "capability_inner",
                      name: "inner",
                      rhs: pseudo_choices(r("CommunalCapability"), r("OwnedCapability")),
                  },
              ],
          }),
        ),

        pinformative("A ", r("Capability"), " ", def_value({id: "cap_cap", singular: "cap"}), " is ", def({id: "cap_valid", singular: "valid"}), " if either ", lis(
          [field_access(r("cap_cap"), "capability_inner"), " is a ", r("communal_cap_valid"), " ", r("CommunalCapability"), " and ", code(function_call(r("is_communal"), field_access(field_access(r("cap_cap"), "capability_inner"), "communal_cap_namespace"))), " is ", code("true"), ", or"],
          [field_access(r("cap_cap"), "capability_inner"), " is a ", r("owned_cap_valid"), " ", r("OwnedCapability"), " and ", code(function_call(r("is_communal"), field_access(field_access(r("cap_cap"), "capability_inner"), "owned_cap_namespace"))), " is ", code("false"), "."],
        )),
  
        pinformative(def({id: "cap_mode", singular: "access mode"}, "Access mode"), ", ", def({id: "cap_receiver", singular: "receiver"}), ", ", def({id: "cap_granted_namespace", singular: "granted namespace"}), ", and ", def({id: "cap_granted_area", singular: "granted area"}), " of a ", r("Capability"), " ", def_value({id: "cap_cap2", singular: "cap"}), " are those of ", field_access(r("cap_cap2"), "capability_inner"), "."),
      ]),

    ]),

    hsection("mc_with_willow", "Usage With Willow", [
      pinformative("We have defined capabilities and their semantics. Now what?"),

      hsection("mc_writing_entries", "Writing Entries", [
        pinformative(Rs("Capability"), " with ", r("cap_mode"), " ", r("access_write"), " can be used to control who gets to write ", rs("Entry"), " in which ", rs("namespace"), " and with which ", rs("entry_subspace_id"), ", ", rs("entry_path"), ", and/or ", rs("entry_timestamp"), ". Intuitively, you authorise writing an ", r("Entry"), " by supplying a ", r("Capability"), " that grants ", r("access_write"), " ", r("cap_mode", "access"), " to the ", r("Entry"), " together with a ", r("dss_signature"), " over the ", r("Entry"), " by the ", r("cap_receiver"), " of the ", r("Capability"), "."),

        pinformative("More precisely, Willow verifies ", rs("Entry"), " via its ", r("AuthorisationToken"), " and ", r("is_authorised_write"), " parameters. Meadowcap supplies concrete choices of these parameters:"),

        pseudocode(
          new Struct({
              id: "MeadowcapAuthorisationToken",
              comment: ["To be used as an ", r("AuthorisationToken"), " for Willow."],
              fields: [
                  {
                      id: "mcat_cap",
                      name: "capability",
                      comment: [
                        "Certifies that an ", r("Entry"), " may be written."
                      ],
                      rhs: r("Capability"),
                  },
                  {
                      id: "mcat_sig",
                      name: "signature",
                      comment: [
                        "Proves that the ", r("Entry"), " was created by the ", r("cap_receiver"), " of the ", r("mcat_cap"), "."
                      ],
                      rhs: r("UserSignature"),
                  },
              ],
          }),
        ),

      pinformative("The function ", def_value("meadowcap_is_authorised_write"), " maps an ", r("Entry"), " and a ", r("MeadowcapAuthorisationToken"), " to a ", r("Bool"), ". It maps ", def_value({id: "mcia_entry", singular: "entry"}), " and ", def_value({id: "mcia_tok", singular: "mat"}), " to ", code("true"), " if and only if", lis(
        [field_access(r("mcia_tok"), "mcat_cap"), " is ", r("cap_valid"), ","],
        ["the ", r("cap_mode"), " of ", field_access(r("mcia_tok"), "mcat_cap"), " is ", r("access_write"), ","],
        ["the ", r("cap_granted_area"), " of ", field_access(r("mcia_tok"), "mcat_cap"), " ", rs("area_include"), " ", r("mcia_entry"), ", and"],
        [code(function_call(r("user_verify"), r("mcia_receiver"), field_access(r("mcia_tok"), "mcat_sig"), function_call(r("encode_entry"), r("mcia_entry")))), " is ", code("true"), ", where ", def_value({id: "mcia_receiver", singular: "receiver"}), " is the ", r("cap_receiver"), " of ", field_access(r("mcia_tok"), "mcat_cap"), "."],
      )),

      pinformative("For this definition to make sense, the protocol parameters of Meadowcap must be ", r("mc_compatible"), " with those of Willow. Further, there must be concrete choices for the ", rs("encoding_function"), " ", r("encode_namespace_id"), ", ", r("encode_subspace_id"), ", and ", r("encode_payload_digest"), " that determine the exact output of ", r("encode_entry"), "."),

      ]),

      hsection("mc_reading_entries", "Reading Entries", [
        pinformative("Whereas write access control is baked into the Willow data model, read access control resides in the replication layer. To manage read access via capabilities, all peers must cooperate in sending ", rs("Entry"), " only to peers who have presented a valid read capability for the ", r("Entry"), "."),

        pinformative("We describe the details in a capability-system-agnostic way ", link_name("access_control", "here"), ". To use Meadowcap for this approach, simply choose the type of ", r("cap_valid"), " ", rs("Capability"), " with ", r("cap_mode"), " ", r("access_write"), " as the ", rs("read_capability"), "."),
      ]),
    ]),

    img(asset("meadowcap/meadowcap.png"), `A Meadowcap emblem: A stylised drawing of two meadowcaps (a type of mushroom), next to a hand-lettered cursive of the word "Meadowcap".`),
  ],
);
