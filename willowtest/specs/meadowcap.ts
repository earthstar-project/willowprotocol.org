import { def, def_fake, preview_scope, r, rs } from "../../defref.ts";
import { br, code, em, figcaption, figure, img, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";
import { asset } from "../../out.ts";
import { Struct, def_symbol, hl_builtin, pseudocode, pseudo_choices, pseudo_array, pseudo_tuple, field_access, function_call } from "../../pseudocode.ts";
import { Expression } from "../../tsgen.ts";
import {
aside_block,
  def_parameter,
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
  },
  [
    pinformative(
      "Meadowcap is a capability system for use with Willow. In this specification, we assume familiarity with the ",
      link_name("data_model", "Willow data model"),
      ".",
    ),

    hsection("meadowcap_overview", "Overview", [
      pinformative(
        "When interacting with a peer in Willow, there are two fundamental operations: ",
        em("writing"),
        " data — asking your peer to add ",
        rs("entry"),
        " to their ",
        rs("store"),
        " — and ",
        em("reading"),
        " data — asking your peer to send ",
        rs("entry"),
        " to you. Both operations should be restricted; Willow would be close to useless if everyone in the world could (over-)write data everywhere, and it would be rather scary if everyone could request to read any piece of data.",
      ),

      pinformative(
        "A capability system helps enforce boundaries on who gets to read and write which data. A ", em("capability"), " is an unforgeable token that bestows read or write access for some data to a particular person, issued by the owner of that data. When Alfie asks Betty for some entries owned by Gemma, then Betty will only answer when presented with a valid capability proving that Gemma gave read access to Alfie. Similarly, Betty will not integrate data created by Alfie in a ", r("subspace"), " owned by Gemma, unless the data is accompanied by a capability proving that Gemma gave write access to Alfie.",
      ),

      figure(
        img(asset("meadowcap/capability_attempts.png")),
      ),

      pinformative(
        "What makes somebody ", quotes("the owner"), " of ", quotes("some data"), "? Meadowcap offers two different models, which we call ",
        rs("owned_namespace"),
        " and ",
        rs("communal_namespace"),
        ".",
      ),

      marginale([
        img(asset("meadowcap/communal_namespace.png")),
        "A ", r("communal_namespace"), ". Metaphorically, everyone has their own private space in the same building.",
      ]),

      pinformative(
        "In a ",
        def({
          id: "communal_namespace",
          singular: "communal namespace",
          plural: "communal namespaces",
        }),
        ", each ", r("subspace"), " is owned by a particular author. This is implemented by using public keys of a ", link("digital signature scheme", "https://en.wikipedia.org/wiki/Digital_signature_scheme"), " as ", rs("subspace_id"), ", you then prove ownership by providing valid signatures (which requires the corresponding secret key).",
      ),

      marginale([
        img(asset("meadowcap/owned_namespace.png")),
        "An ", r("owned_namespace"), ". Metaphorically, a single owner manages others’ access to their building.",
      ]),

      pinformative(
        "In an ",
        def({
          id: "owned_namespace",
          singular: "owned namespace",
          plural: "owned namespaces",
        }),
        ", the person who created the ", r("namespace"), " is the owner of all its data. To implement this, ",
        rs("namespace_id"),
        " are public keys. In an ", r("owned_namespace"), ", peers reject all requests unless they involve a signature from the ",
        r("namespace"),
        " keypair; in a ", r("communal_namespace"), ", peers reject all requests unless they involve a signature from the ",
        r("subspace"),
        " keypair.",
      ),

      pinformative(
        rs("owned_namespace", "Owned namespaces"),
        " would be quite pointless were it not for the next feature: ",
        em("capability delegation"),
        ". A capability bestows not only access rights but also the ability to mint new capabilities for the same resources but to another peer. When you create an owned namespace, you can invite others to join the fun by delegating read and/or write access to them.",
      ),

      pinformative(
        "The implementation relies on signature schemes again. Consider Alfie and Betty, each with a public key (",
        code(`P_Alfie`),
        " and ",
        code(`P_Betty`),
        " respectively) and the corresponding secret key (",
        code(`S_Alfie`),
        " and ",
        code(`S_Betty`),
        " respectively). Alfie can mint a new capability for Betty by signing his own capability together with ",
        code(`P_Betty`),
        ".",
      ),

      pinformative(
        "Once Alfie has minted a capability for Betty, Betty can mint one (or several) for Gemma, and so on.",
      ),

      pinformative(
        "Verifying whether a delegated capability bestows access rights is done recursively: check that the last delegation step is accompanied by a valid signature, then verify the capability that was being delegated.",
      ),

      pinformative(
        "The next important feature of Meadowcap is that of ", em("restricting"), " capabilities. Suppose I maintain several code repositories inside my personal ",
        r("subspace"),
        ". I use different ",
        rs("path"),
        " to organize the data pertaining to different repositories, say ",
        path("code", "seasonal-clock"),
        " and ",
        path("code", "earthstar"),
        ". If I wanted to give somebody write-access to the ",
        path("code", "seasonal-clock"),
        " repository, I should ", em("not"), " simply grant them write access to my complete ",
        r("subspace"),
        " — if I did, they could also write to ",
        path("code", "earthstar"),
        ". Or to ",
        path("blog", "embarrassing-facts"),
        " for that matter.",
      ),

      // marginale(img(asset("meadowcap/capability_types.png"))),

      pinformative(
        " Hence, Meadowcap allows to ",
        em("restrict"),
        " capabilities, turning them into less powerful ones. Restrictions can limit access by ",
        r("entry_path"),
        ", by ",
        r("timestamp"),
        ", and/or by ",
        r("subspace_id"),
        ".",
      ),

      aside_block(
        pinformative(
          "Another typical example of using restrictions is an ", r("owned_namespace"), ", whose owner — Owen — gives write capabilities for distinct ", rs("subspace"), " to distinct people. Alfie might get the ", r("subspace"), " of", r("subspace_id"), " ", code("alfies-things"), ", Betty would get ", code("bettys-things"), ", and so on. This results in a system similar to a ", r("communal_namespace"), ", except that Owen has control over who gets to participate, and can also remove or change anything written by Alfie or Betty. It is however still clear which ", rs("entry"), " were created by Owen and which were not — Owen cannot impersonate anyone.",
        ),
  
        pinformative(
          "Going even further, Owen might only give out capabilities that are valid for one week at a time. If Alfie starts posting abusive comments, Owen can delete some or all of Alfie's ", rs("entry"), " by writing ", rs("entry"), " to `alfies-things` whose ", r("timestamp"), " lies two weeks in the future. Any ", rs("entry"), " Alfie can create are immediately overwritten by Owen's ", rs("entry"), " from the future. Owen probably will not give Alfie a new capability at the end of the week either, effectively removing Alfie from the space.",
        ),
  
        pinformative(
          "Using these techniques, Willow can support moderated spaces similar to, for example, the fediverse. And Owen can create powerful capabilities that allow other, trusted people to help moderating the space. If the idea of a privileged group of users who can actively shape what happens in a ", r("namespace"), " makes you feel safe and unburdened, ", rs("owned_namespace"), " might be for you. If it sounds like an uncomfortable level of control and power, you might prefer ", rs("communal_namespace"), ". Meadowcap supports both, because we believe that both kinds of spaces fulfil important roles.",
        ),
      ),
      
      marginale([
        "If it helps to have some code to look at, there's also a ",
        link(
          "reference implementation",
          "https://github.com/earthstar-project/meadowcap-js",
        ),
        " of Meadowcap.",
      ]),
      pinformative(
        "This concludes the intuitive overview of Meadowcap. The remainder of this document is rather formal: capabilities are a security feature, so we have to be fully precise when defining them.",
      ),
    ]),

    hsection("meadowcap_parameters", "Parameters", [
      pinformative("Like Willow, Meadowcap is a generic protocol that needs to be instantiated with concrete choices for the parameters we describe in this section."),

      pinformative("Meadowcap makes heavy use of ", link("digital signature schemes", "https://en.wikipedia.org/wiki/Digital_signature"), "; it assumes that Willow uses public keys as ", rs("namespace_id"), " and ", rs("subspace_id"), ". ", preview_scope(
        "A ", def({id: "signature_scheme", singular: "signature scheme"}), " consists of three algorithms:", lis(
          [def_value({id: "dss_generate_keys", singular: "generate_keys"}), " maps a ", def({id: "dss_seed", singular: "seed"}), " to a ", def({id: "dss_pk", singular: "public key"}), " and a ", def({id: "correspond"}, "corresponding"), " ", def({id: "dss_sk", singular: "secret key"}), "."],

          [def_value({id: "dss_sign", singular: "sign"}), " maps a ", r("dss_sk"), " and a bytestring to a ", def({id: "dss_signature", singular: "signature"}), " of the bytestring."],

          [def_value({id: "dss_verify", singular: "verify"}), " takes a ", r("dss_pk"), ", a ", r("dss_signature"), ", and a bytestring, and returns whether the ", r("dss_signature"), " had been created with the ", r("dss_sk"), " that ", r("correspond", "corresponds"), " to the given ", r("dss_pk"), "."],
        ),
      )),

      pinformative("An instantiation of Meadowcap must define concrete choices of the following parameters:"),

      lis(
          [
              marginale(["In ", rs("owned_namespace"), ", all valid capabilities stem from knowing a particular ", r("dss_sk"), " of the ", r("NamespaceSignatureScheme"), "."]),
              "A ", r("signature_scheme"), " ", def_parameter("NamespaceSignatureScheme", "NamespaceSignatureScheme", ["A protocol parameter of Meadowcap, "]), " consisting of algorithms ", def_parameter("namespace_generate_keys", "namespace_generate_keys", ["A protocol parameter of Meadowcap, "]), ", ", def_parameter("namespace_sign", "namespace_sign", ["A protocol parameter of Meadowcap, "]), ", and ", def_parameter("namespace_verify", "namespace_verify", ["A protocol parameter of Meadowcap, "]), ". The ", rs("dss_pk"), " have type ", def_parameter("NamespacePublicKey", "NamespacePublicKey", ["A protocol parameter of Meadowcap, "]), ", and the ", rs("dss_signature"), " have type ", def_parameter("NamespaceSignature", "NamespaceSignature", ["A protocol parameter of Meadowcap, "]), "."
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter("encode_namespace_pk", "encode_namespace_pk", ["A protocol parameter of Meadowcap, "]), " for ", r("NamespacePublicKey"), ".",
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter("encode_namespace_sig", "encode_namespace_sig", ["A protocol parameter of Meadowcap, "]), " for ", r("NamespaceSignature"), ".",
          ],

          [
              marginale(["Users identities are ", rs("dss_pk"), " of the ", r("UserSignatureScheme"), ". Further, ", r("subspace_id"), " must be ", rs("dss_pk"), " of the ", r("UserSignatureScheme"), " as well. In ", rs("communal_namespace"), ", all valid capabilities stem from knowing a particular ", r("dss_sk"), " of the ", r("UserSignatureScheme"), "."]),
              "A ", r("signature_scheme"), " ", def_parameter("UserSignatureScheme", "UserSignatureScheme", ["A protocol parameter of Meadowcap, "]), " consisting of algorithms ", def_parameter("user_generate_keys", "user_generate_keys", ["A protocol parameter of Meadowcap, "]), ", ", def_parameter("user_sign", "user_sign", ["A protocol parameter of Meadowcap, "]), ", and ", def_parameter("user_verify", "user_verify", ["A protocol parameter of Meadowcap, "]), ". The ", rs("dss_pk"), " have type ", def_parameter("UserPublicKey", "UserPublicKey", ["A protocol parameter of Meadowcap, "]), ", and the ", rs("dss_signature"), " have type ", def_parameter("UserSignature", "UserSignature", ["A protocol parameter of Meadowcap, "]), "."
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter("encode_user_pk", "encode_user_pk", ["A protocol parameter of Meadowcap, "]), " for ", r("UserPublicKey"), ".",
          ],
          [
              "An ", r("encoding_function"), " ", def_parameter("encode_user_sig", "encode_asubpace_sig", ["A protocol parameter of Meadowcap, "]), " for ", r("UserSignature"), ".",
          ],

          [
              "A function ", def_parameter("is_communal", "is_communal", ["A protocol parameter of Meadowcap, "]), " that maps ", rs("NamespacePublicKey"), " to booleans, determining whether a ", r("namespace"), " of a particular ", r("namespace_id"), " is ", r("communal_namespace", "communal"), " or ", r("owned_namespace", "owned"), ".",
          ],

          [
              "A hash function ", def_parameter("hash_capability", "hash_capability", ["A protocol parameter of Meadowcap, "]), " that maps bytestrings to shorter bytestrings. It is used to hash the encoding of capabilities before signing them.",
          ],

          [
              "Limits on the sizes of the ", rs("path"), " that can appear in capabilities:", lis(
                [
                  "A natural number ", def_parameter("mc_max_component_length", "max_component_length", ["A protocol parameter of Meadowcap, the maximal length of individual ", r("path"), " components."]), " for limiting the length of path components.",
                ],
                [
                    "A natural number ", def_parameter("mc_max_component_count", "max_component_count", ["A protocol parameter of Meadowcap, the maximal number of components (bytestrings) in a single ", r("path"), "."]), " for limiting the number of path components.",
                ],
                [
                    "A natural number ", def_parameter("mc_max_path_length", "max_path_length", ["A protocol parameter of Meadowcap, the maximal sum of the lengths of the components (bytestrings) of a single ", r("path"), " in bytes."]), " for limiting the overall size of paths.",
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
      pinformative(marginale(img(asset("meadowcap/capability_semantics.png"))), "Intuitively, a capability should be some piece of data that answers four questions: To whom does it grant access? Does it grant read or write access? For which ", rs("entry"), " does it grant access? And finally, is it valid or a forgery? The following type allows us to answer the formal counterparts of all these questions."),

      pseudocode(
        new Struct({
            id: "Capability",
            comment: ["A Meadowcap capability."],
            fields: [
                {
                    id: "cap_access_mode",
                    name: "access_mode",
                    comment: ["The kind of access this grants."],
                    rhs: pseudo_choices(
                      def_symbol({id: "access_read", singular: "read"}, "read", ["One of two possible ", r("cap_access_mode"), " of a ", r("Capability"), "."]),
                      def_symbol({id: "access_write", singular: "write"}, "write", ["One of two possible ", r("cap_access_mode"), " of a ", r("Capability"), "."]),
                    ),
                },
                {
                    id: "cap_namespace",
                    name: "namespace_key",
                    comment: ["The ", r("namespace"), " for which this grants access."],
                    rhs: r("NamespacePublicKey"),
                },
                {
                    id: "cap_user",
                    name: "user_key",
                    comment: [
                      pinformative("In a ", r("communal_namespace"), ", the ", r("subspace"), " ", em("for which"), " and ", em("to whom"), " this grants access."),

                      pinformative("In an ", r("owned_namespace"), ", the user ", em("to whom"), " this grants access; granting access for the full ", r("cap_namespace"), ", not just to a ", r("subspace"), "."),
                    ],
                    rhs: r("UserPublicKey"),
                },
                {
                    id: "cap_initial_authorization",
                    name: "initial_authorization",
                    comment: [
                      pinformative("In a ", r("communal_namespace"), ", ", r("cap_initial_none"), "."),

                      pinformative("In an ", r("owned_namespace"), ", authorization of the ", r("cap_user"), " by the ", r("namespace_key"), "."),
                    ],
                    rhs: pseudo_choices(
                      r("NamespaceSignature"),
                      def_symbol({id: "cap_initial_none", singular: "none"}, "none", ["A value to indicate absence of an ", r("cap_initial_authorization"), " in a ", r("Capability"), " for a ", r("communal_namespace"), "."]),
                    ),
                },
                {
                    id: "cap_delegations",
                    name: "delegations",
                    comment: ["Successive authorizations of new ", rs("UserPublicKey"), ", each restricted to a particular ", r("area"), "."],
                    rhs: pseudo_array(pseudo_tuple(r("area"), r("UserPublicKey"), r("UserSignature"))),
                },
            ],
        }),
      ),

      pinformative("The ", r("cap_receiver"), " of a ", r("Capability"), " is the user to whom it grants access. Formally, the ", def({id: "cap_receiver", singular: "receiver"}), " is the final ", r("UserPublicKey"), " in the ", r("cap_delegations"), ", or the ", r("cap_user"), " if the ", r("cap_delegations"), " are empty."),

      pinformative("The ", r("cap_granted_area"), " of a ", r("Capability"), " is the ", r("area"), " for which it grants access. Formally, the ", def({id: "cap_granted_area", singular: "granted area"}), " of a ", r("Capability"), " is the final ", r("area"), " in its ", r("cap_delegations"), " if the ", r("cap_delegations"), " are non-empty. Otherwise, it is the ", r("full_area"), " for an ", r("owned_namespace"), ", or the ", r("subspace_area"), " of the ", r("cap_user"), " for a ", r("communal_namespace"), "."),

      pinformative("The final remaining definition is that of ", r("cap_valid", "validity"), "; it governs how ", rs("capability"), " can be delegated and restricted. We define ", def({id: "cap_valid", singular: "valid"}, "validity", [pinformative("A ", r("Capability"), " is ", def_fake("cap_valid", "valid"), " if its ", r("cap_initial_authorization"), " and its ", r("cap_delegations"), " form correct chains of ", rs("dss_signature"), " over ", rs("UserPublicKey"), ", and if the ", rs("area"), " form a chain of containment."), pinformative("For the formal definition, click the reference, the proper definition does not fit into a tooltip.")]), " inductively based on the number of ", r("cap_delegations"), "."),

      pinformative("A ", r("Capability"), " with zero ", r("cap_delegations"), " and a ", r("communal_namespace"), " is ", r("cap_valid"), " if ", r("cap_initial_authorization"), " is ", r("cap_initial_none"), "."),

      pinformative("A ", r("Capability"), " with zero ", r("cap_delegations"), " and an ", r("owned_namespace"), " is ", r("cap_valid"), " if ", r("cap_initial_authorization"), " is a ", r("NamespaceSignature"), " issued by the ", r("cap_namespace"), " over either the byte ", code("0x00"), " (if ", r("cap_access_mode"), " is ", r("access_read"), ") or the byte ", code("0x01"), " (if ", r("cap_access_mode"), " is ", r("access_write"), "), followed by the ", r("cap_user"), " (encoded via ", r("encode_user_pk"), ")."),

      pinformative("For the inductive case, let ", code("prev_cap"), " be a ", r("cap_valid"), " ", r("Capability"), " with ", r("cap_receiver"), " ", code("prev_receiver"), ", and ", r("cap_granted_area"), " ", code("prev_area"), ". Now let ", code("cap"), " be a ", r("Capability"), " obtained from ", code("prev_cap"), " by appending a triplet ", code("(new_area, new_user, new_signature)"), " to the ", r("cap_delegations"), " of ", code("prev_cap"), "."),

      pinformative("Then ", code("cap"), " is ", r("cap_valid"), " if the ", r("granted_area"), " of ", code("prev_cap"), " ", rs("area_include_area"), " ", code("new_area"), ", and ", code("new_signature"), " is a ", r("UserSignature"), " issued by the ", code("prev_receiver"), " over the bytestring ", code("handover"), ", which is defined as follows:"),

      lis(
        [
          "If ", field_access(code("prev_cap"), "cap_delegations"), " is empty and ", field_access(code("prev_cap"), "cap_namespace"), " is ", r("communal_namespace", "communal"), ", then ", code("handover"), " is the concatenation of the following bytestrings:",
          lis(
            ["the byte ", code("0x00"), " (if ", field_access(code("prev_cap"), "cap_access_mode"), " is ", r("access_read"), ") or the byte ", code("0x01"), " (if ", field_access(code("prev_cap"), "cap_access_mode"), " is ", r("access_write"), "),"],
            [function_call(r("encode_namespace_pk"), field_access(code("prev_cap"), "cap_namespace")), ","],
            ["TODO area,"],
            [function_call(r("encode_user_pk"), code("new_user")), "."],
          ),
        ],
        [
          "Else, if ", field_access(code("prev_cap"), "cap_delegations"), " is empty and ", field_access(code("prev_cap"), "cap_namespace"), " is ", r("owned_namespace", "owned"), ", then ", code("handover"), " is the concatenation of the following bytestrings:",
          lis(
            ["TODO area,"],
            [function_call(r("encode_user_signature"), field_access(code("prev_cap"), "cap_initial_authorization")), "."],
            [function_call(r("encode_user_pk"), code("new_user")), "."],
          ),
        ],
        [
          "Otherwise, let ", code("prev_signature"), " be the ", r("UserSignature"), " in the last triplet of ", field_access(code("prev_cap"), "cap_delegations"), ". Then ", code("handover"), " is the concatenation of the following bytestrings:",
          lis(
            ["TODO area,"],
            [function_call(r("encode_user_signature"), code("prev_signature")), "."],
            [function_call(r("encode_user_pk"), code("new_user")), "."],
          ),
        ],
      ),

      

      

      

      
    ]),

    hsection("mc_with_willow", "Usage With Willow", [
      pinformative("We have defined capabilities and their semantics. Now what?"),

      hsection("mc_writing_entries", "Writing Entries", [
        pinformative(""),
      ]),

      hsection("mc_reading_entries", "Reading Entries", [
        pinformative(""),
      ]),
    ]),

    img(asset("meadowcap/meadowcap.png")),
  ],
);
