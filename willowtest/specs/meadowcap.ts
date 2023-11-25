import { def, r, rs } from "../../defref.ts";
import { code, em, figcaption, figure, img, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";
import { asset } from "../../out.ts";
import { Expression } from "../../tsgen.ts";
import {
  def_parameter,
  link,
  lis,
  pinformative,
  site_template,
} from "../main.ts";

export const meadowcap: Expression = site_template(
  {
    title: "Meadowcap",
    name: "meadowcap",
  },
  [
    pinformative(
      "Meadowcap is a capability system for use with Willow. This document assumes familiarity with the ",
      link_name("data_model", "Willow data model"),
      ".",
    ),

    hsection("meadowcap_overview", "Overview", [
      pinformative(
        "When interacting with a peer in Willow, there are two fundamental operations: ",
        em("writing"),
        " data, that is, asking your peer to add ",
        rs("entry"),
        " to their ",
        rs("store"),
        " and ",
        em("reading"),
        " data, that is, asking your peer to send ",
        rs("entry"),
        " to you. Both operations should be restricted; Willow would be close to useless if everyone in the world could (over-)write data everywhere, and it would be rather scary if everyone could request to read any piece of data.",
      ),
      pinformative(
        "A capability system helps enforce boundaries on who gets to read and write which data. A ",
        def({
          id: "capability",
          singular: "capability",
          plural: "capabilities",
        }),
        " is an unforgeable token that bestows read or write access to some data to a particular person, issued by the owner of that data. When Alfie asks Betty for some entries owned by Gemma, then Betty will only answer when presented with a valid capability proving that Gemma gave read access to Alfie. Similarly, Betty will not integrate data created by Alfie in a, ",
        r("subspace"),
        " owned by Gemma, unless the data is accompanied by a capability proving that Gemma gave write access to Alfie.",
      ),
      figure(
        img(asset("meadowcap/capability_attempts.png")),
      ),
      pinformative(
        "What makes somebody the “owner” of “some data”? Meadowcap offers two different models, which we call ",
        rs("owned_namespace"),
        " and ",
        rs("communal_namespace"),
        ".",
      ),
      pinformative(
        marginale_inlineable([
          figure(
            img(asset("meadowcap/communal_namespace.png")),
          ),
          figcaption(
            "A ",
            r("communal_namespace"),
            ". Metaphorically, everyone has their own private space in the same building.",
          ),
        ]),
        "In a ",
        def({
          id: "communal_namespace",
          singular: "communal namespace",
          plural: "communal namespaces",
        }),
        " each subspace is owned by a particular author. This is implemented by using public keys of a digital signature scheme as ",
        rs("subspace_id"),
        " you then prove ownership by providing valid signatures (which requires the corresponding secret key).",
      ),
      pinformative(
        marginale_inlineable([
          figure(
            img(asset("meadowcap/owned_namespace.png")),
          ),
          figcaption(
            "An ",
            r("owned_namespace"),
            ". Metaphorically, a single owner manages others’ access to their building.",
          ),
        ]),
        "In an ",
        def({
          id: "owned_namespace",
          singular: "owned namespace",
          plural: "owned namespaces",
        }),
        " the person who created the namespace is the owner of all its data. To implement this, ",
        rs("namespace_id"),
        " are public keys. In a owned namespace, peers reject all requests unless they involve a signature from the ",
        r("namespace"),
        " keypair; in a communal namespace, peers reject all requests unless they involve a signature from the ",
        r("subspace"),
        " keypair.",
      ),
      pinformative(
        rs("owned_namespace", "Owned namespaces"),
        " would be quite pointless were it not for the next feature: ",
        em("capability delegation"),
        ". A capability may bestow not only access rights but also the ability to mint new capabilities for the same resources but for a new peer. When you create a owned namespace, you can invite others to join the fun by giving them read and/or write capabilities.",
      ),
      pinformative(
        "The implementation relies on signature schemes again. Consider Alfie and Betty, each with a public key (",
        def_parameter(`P_Alfie`),
        " and ",
        def_parameter(`P_Betty`),
        " respectively) and the corresponding secret key (",
        def_parameter(`S_Alfie`),
        " and ",
        def_parameter(`S_Betty`),
        " respectively). Alfie can mint a new capability for Betty by signing their own capability together with ",
        r(`P_Betty`),
        ".",
      ),
      pinformative(
        "Once Alfie has minted a capability for Betty, Betty can mint one (or several) for Gemma, and so on. Meadowcap also has a mechanism for limiting how far capabilities can be delegated, but we'll discuss that later.",
      ),
      pinformative(
        "Verifying whether a delegated capability grants access rights is done recursively: check that the last delegation step is accompanied by a valid signature, then verify the capability that was being delegated.",
      ),
      pinformative(
        "The next important feature of Meadowcap is that of restricting capabilities. Suppose I maintain several code repositories inside my personal ",
        r("subspace"),
        ". I use different ",
        rs("path"),
        " to organize the data pertaiing to different repositories, say ",
        code(`/code/seasonal-clock`),
        " and ",
        code(`/code/earthstar`),
        ". If I wanted to give somebody write-access to the ",
        code(`seasonal-clock`),
        " repository, I should not just grant them write access to my complete ",
        r("subspace"),
        " — if I did, they now could also write to ",
        code(`/code/earthstar`),
        " (or to ",
        code(`/blog/embarrassing-facts-about-me`),
        " for that matter).",
      ),
      // Not sure how to put this in a special long diversion section...
      pinformative(
        "A typical example would be an owned namespace whose owner — Owen — gives write capabilities to distinct subspaces to distinct people. Alfie might get the subspace of id `alfies-things`, Betty would get `betties-things`, and so on. This results in a system similar to a communal namespace, except that Owen has control over who gets a subspace and who cannot participate, and can also remove or change anything written by Alfie or Betty. It is however still clear which entries were created by Owen and which were not — Owen cannot impersonate anyone or put words into their mouth.",
      ),

      pinformative(
        " Going even further, Owen might only give out capabilities that are valid for one week at a time. If Alfie starts posting abusive comments, Owen can delete some or all of Alfie's entries by writing entries to `alfies-things` whose timestamp lies two weeks in the future. Any entries Alfie can create are immediately overwritten by Owen's entries from the future. Owen probably will not give Alfie a new capability at the end of the week either, effectively removing Alfie from the space.",
      ),

      pinformative(
        "Using these techniques, Willow can support moderated spaces similar to, for example, the fediverse. And Owen can of course create powerful capabilities that allow other, trusted people to help moderating the space. If the idea of a privileged group of users who can actively shape what happens in a namespace makes you feel safe and unburdened, owned namespaces might be for you. If it sounds like an uncomfortable level of control and power, you might prefer communal namespaces. Meadowcap supports both, because we believe that both kinds of spaces fulfil important roles.",
      ),
      // End of diversion.

      pinformative(
        marginale_inlineable(
          [
            img(asset("meadowcap/capability_types.png")),
          ],
        ),
        " Hence, Meadowcap allows to ",
        em("restrict"),
        " capabilities, turning them into less powerful ones. Restrictions can restrict by ",
        r("path"),
        ", by ",
        r("timestamp"),
        ", and/or by ",
        r("subspace"),
        ".",
      ),
      pinformative(
        "Finally, Meadowcap allows to ",
        em("merge"),
        " several capabilities into a single, more powerful one (barring some restrictions we detail later). If you had multiple capabilities for the same ",
        r("subspace"),
        " and paths therein, but each restricted to a single day of the past month, you could merge them into a single capability that grants you access for that full month.",
      ),
      pinformative(
        "This seemingly innocent feature introduces a surprising amount of complexity to the specification, and it might not seem particularly important at first glance. So why include it? We want to support powerful queries when asking a peer for data, for example, “Please give me all entries whose path starts with ",
        code(`/code/`),
        " in the ",
        r("subspace"),
        " of Alphie, Betty, or Gemma”. In a ",
        r("communal_namespace"),
        " there can be no single capability that grants the required rights for this query, unless we support capability merging. The ability to authenticate every possible query with exactly one capability greatly simplifies systems building on top of Meadowcap.",
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
        "This concludes the overview of Meadowcap. The remainder of this document gets quite nitty-gritty at times: capabilities are a security feature, so we have to be fully precise when defining them.",
      ),
    ]),
    hsection("preliminaries", "Preliminaries", [
      pinformative(
        "Before we can get into the the precise definition of Meadowcap capabilities, we need to define some general concepts.",
      ),
      hsection("signature_schemes", "Signature Schemes", [
        pinformative(
          "Meadowcap makes heavy use of ",
          link(
            "digital signature schemes",
            "https://en.wikipedia.org/wiki/Digital_signature",
          ),
          ". For our purposes, a ",
          em("signature scheme"),
          " consists of three algorithms:",
        ),
        lis(
          [
            code(`generate_keys(Seed) -> (PublicKey, SecretKey)`),
            " generates a keypair from a seed; we say that a public key ",
            code(`pk`),
            " and a secret key ",
            code(`sk`),
            em(" correspond to each other"),
            " if there exist a seed ",
            code(`s`),
            " such that ",
            code(`(pk, sk) == generate_keys(s)`),
            ".",
          ],
          [
            code(`sign(SecretKey, Bytestring) -> Signature`),
            " maps arbitrary bytestrings to a ",
            r("signature"),
            " given a secret key.",
          ],
          [
            code(`verify(PublicKey, Signature, Bytestring) -> Bool`),
            " returns ",
            code(`true`),
            " if the signature was produced by invoking ",
            code(`sign`),
            " on the input string with the secret key corresponding to the given public key.",
          ],
        ),
        pinformative(
          "This is a completely standard definition; the only surprising part might be that we never require signatures to be difficult to fake. Meadowcap works the same whether the signature scheme you use is actually secure or not.",
        ),
      ]),
      hsection(
        "uses_encodings",
        "Encodings",
        pinformative(
          "We explain our ",
          link_name("encodings", "definition of encoding here", "."),
        ),
      ),
      hsection(
        "uses_products",
        "3d Products",
        pinformative(
          "We explain ",
          link_name("3d_products", "3d products here"),
          ".",
        ),
      ),
      hsection(
        "meadowcap_parametrs",
        "Parameters",
        pinformative(
          "Just like Willow, Meadowcap does not prescribe particular choices of cryptographic primitives. Before you can use Meadowcap, you thus have to specify certain parameters, among them:",
        ),
        lis(
          [
            "a ",
            em("namespace signature scheme"),
            code(`(namespace_generate_keys, namespace_sign, namespace_verify)`),
            ", whose public and secret keys have types ",
            def_parameter(`NamespacePublicKey`),
            " and ",
            def_parameter(`NamespaceSecretKey`),
            " respectively, and whose signatures have type ",
            def_parameter(`NamespaceSignature`),
            ", and",
          ],
          ["a function ", code(`is_communal(NamespacePublicKey) -> bool`)],
        ),
        pinformative(
          "These choices make Meadowcap compatible with an instantiation of Willow that uses ",
          r(`NamespacePublicKey`),
          " as the set of Willow's namespace IDs. The function ",
          code(`is_communal`),
          " is applied to a namespace ID to determine whether the namespace is ",
          r("communal_namespace", "communal"),
          " or ",
          r("owned_namespace", "owned"),
          ". For ",
          r("owned_namespace", "owned"),
          " namespaces, all valid capabilities are ultimately based on signatures issued by the secret key that corresponds to the namespace ID (which is a ",
          r(`NamespacePublicKey`),
          ").",
        ),
        pinformative(
          "In ",
          r("communal_namespace", "communal"),
          " namespaces, the root authority stems not from a central namespace keypair, but from a keypair that is specific to each subspace. Subspace IDs hence are public keys of another signature scheme:",
        ),
        marginale(
          "This scheme *can* be identical to that the *namespace signature scheme*, but it need not be. The main reason for using separate signature schemes is for (effectively) using Willow *without* *subspaces*: by using the trivial signature scheme (`PublicKey` and `SecretKey` contain a single value each, `sign` always produces the empty string, `verify` always returns `true`, and the encoding of keys and signatures is always the empty string), you effectively remove subspaces from Willow. Doing so reduces the size of the encodings of entries, compared to entries with “real” (say, 32 byte) *subspace IDs*.",
        ),
        lis(
          "a **subspace signature scheme** `(subspace_generate_keys, subspace_sign, subspace_verify)`, whose public and secret keys have types `NamespacePublicKey` and `SubspaceSecretKey` respectively, and whose signatures have type `SubspaceSignature`,",
          "a [total order](https://en.wikipedia.org/wiki/Total_order) on `SubspacePublicKey` with a least element `minimal_subspace_public_key`.",
        ),
        pinformative(
          "These choices make Meadowcap compatible with an instantiation of Willow that uses `SubspacePublicKey` as the set of Willow's subspace IDs. For *communal* namespaces, all valid capabilities are ultimately based on signatures issued by the secret key that corresponds to the namespace ID (which is a `NamespacePublicKey`).",
        ),
        pinformative(
          marginale(
            "In particular, the set of *all* subspace public keys could not be represented by a single range, because our definition of ranges always requires a least element.",
          ),
          "The total order on `SubspacePublicKey` is required to make 3d ranges and products work. We require existence of a least element because otherwise there exist sequences of consecutive subspace public keys that cannot be represented by a range.",
        ),
        pinformative(
          "The total order on `SubspacePublicKey` is required to make 3d ranges and products work. We require existence of a least element because otherwise there exist sequences of consecutive subspace public keys that cannot be represented by a range.",
        ),
        pinformative(
          "Meadowcap needs to know about the type `PayloadDigest` that is used by Willow, because it needs to encode the payload digests for hashing. The *encoding function* `encode_payload_hash` for `PayloadDigest` is a parameter to do exactly that, further encoding function parameters are `encode_namespace_public_key` and `encode_namespace_signature` for `NamespacePublicKey` and `NamespaceSignature` respectively, `encode_subspace_public_key` and `encode_subspace_signature` for `SubspacePublicKey` and `SubspaceSignature` respectively.",
        ),
        pinformative(
          "Another parameter is a function `hash_capability` that maps bytestrings to other bytestrings. As the name suggests, it is used for hashing capabilities. Its exact usage and the reasoning behind using it are explained later.",
        ),
        pinformative(
          "Finally, Meadowcap needs to know `k`, the maximum length of *paths*.",
        ),
        marginale(
          [
            img(asset("meadowcap/parameter_list.png")),
            "A list of necessary parameters which you may print out",
          ],
        ),
        pinformative(
          "With all of these parameters defined, Meadowcap produces a set `AuthorizationToken` and a function `is_authorized_write(Entry, AuthorizationToken) -> bool` which can then be used by Willow to determine whether entries are valid, i.e., to implement write-access control. The specifics of how to achieve write-access control (and also read-access) control with Meadowcap are detailed at the very end of this specification, as they put together (and justify) all the prior definitions.",
        ),
        pinformative(
          "Before we can define capabilities, we need a final, purely technical definition for dealing with the fact that namespaces and subspaces use different signature schemes. When delegating capabilities, the capability issuer uses the signature scheme that corresponds to whether the namespace of the capability is *owned* or *communal*.",
        ),
        pinformative(
          "The **author signature scheme** of a namespace is the namespace signature scheme if the namespace is owned, or the subspace signature scheme otherwise. We write `author_generate_keys`, `author_sign`, `author_verify`, `AuthorPublicKey`, `AuthorSecretKey`, `AuthorSignature`, `encode_author_public_key`, and `encode_author_signature` for the corresponding functions and types.",
        ),
      ),
      hsection(
        "capabilities",
        "Capabilities",
        pinformative(
          "We now have the required definitions and background knowledge to precisely define the set of Meadowcap capabilities. We start by defining the logical data type without directly attaching any semantics.",
        ),
        pinformative("A **capability** is either:"),
        lis(
          [
            "a **source capability** consisting of a `NamespacePublicKey` called its `namespace_id`, a `SubspacePublicKey` called its `subspace_id` which must always be `minimal_subspace_public_key` if `is_communal(namespace_id)` is `false`, and an `access_mode` (either `read` or `write`), or",
          ],
          ["a **delegation capability** consisting of a capability called its `parent`, an `AuthorPublicKey` called its `delegee`, an `AuthorSignature` called its `authorization`, and an unsigned 8-bit number called its `delegation_limit` (the `delegation_limit` determines how many times the capability may still be delegated. `255` indicates infinity<!-- TODO turn back into an aside -->), or"],
          ["a **restriction capability** consisting of a capability called its `parent`, and a 3d product called its `product`, or"],
          ["a **merge capability** consisting of a sequence of capabilities that contains at least two and at most `2^64 - 1` capabilities, called its `components`."],
        ),
        marginale(img(asset("meadowcap/capability_semantics.png"))),
        pinformative(
          "For this datatype to be useful, we need to assign four different semantics: for any given capability we need to know whom (i.e., which author public key) the capability grants access to, which access mode (`read` or `write`) the capability grants, to which entries the capability grants access, and whether the capability is actually *valid*. Some of these definitions depend cyclically on each other: we (can) only assign semantics to *valid* capabilities, yet validity of non-*source capabilities* hinges on the semantics of their component capabilities. We opt for a sequential presentation regardless, requiring validity of capabilities before actually giving the definition of validity.",
        ),
        pinformative(
          "Determining to whom the capability bestows access is where the distinction between *owned* and *communal* namespaces formally enters play, it determines whether a *source capability* grants access to the holder of the secret key corresponding to its `namespace_id` or its `subspace_id`. *Restriction* and *merge* capabilities give access to the same keys as their component capabilities, whereas *delegation* capabilities can arbitrarily change that key. Formally:",
        ),
        pinformative(
          "The **receiver** of a *valid* capability `cap` is a `AuthorPublicKey` that depends on the kind of `cap`:",
        ),
        lis(
          "*source capability*:",
          lis(
            "if `is_communal(cap.namespace_id)`, the *receiver* is `cap.subspace_id`,",
            "else, the *receiver* is `cap.namespace_id`.",
          ),
          "*delegation capability*:",
          lis(
            "the *access mode* is the *access mode* of `cap.parent`.",
          ),
          "*restriction capability*:",
          lis(
            "the *access mode* is the *access mode* of `cap.parent`.",
          ),
          "*merge capability*:",
          lis(
            [
              " the *access mode* is the *access mode* of the first component (`cap.components[0]`).",
              lis(
                "*Merge capabilities* whose components grant distinct *access modes* will be defined to be *invalid*.",
              ),
              "<!-- TODO turn back into an aside -->",
            ],
          ),
        ),
        pinformative(
          "We define the set of entries to which a capability grants access as the set of all entries in some namespace that are *included* in some 3d product derived from the capability.",
        ),
        pinformative(
          "The **granted namespace** and **granted product** of a *valid* capability `cap` depend on the kind of `cap`:",
        ),
        lis(
          [
            "*source capability*:",
            lis(
              "the *granted namespace* is `cap.namespace_id`, and",
              [
                "the *granted product* is a 3d product whose time ranges consist of the single, *open* time range that starts at zero, whose path ranges consist of the single, *open* path range that starts at the empty path, and whose subspace ranges consist of a single subspace range that depends on `is_communal(cap.namespace_id)`:",
                lis(
                  "if `is_communal(cap.namespace_id)`, the range is the *closed* range that *includes* `cap.subspace_id` but no other *subspace ID*,",
                  "else, the range is the *open* range that starts at `minimal_subspace_public_key`.",
                  "All of this is a precise way of saying that source capabilities grant access to *everything* in an owned namespace, and access to everything *in a single subspace* in a communal namespace.<!-- TODO turn back into an aside -->",
                ),
              ],
            ),
          ],
          [
            "*delegation capability*:",
            lis(
              "the *granted namespace* and *granted product* are the *granted namespace* and *granted product* of `cap.parent` respectively.",
            ),
          ],
          [
            "*restriction capability*:",
            lis(
              "the *granted namespace* is the *granted namespace* of `cap.parent`, and",
              "the *granted product* is the *intersection* of `cap.product` and the *granted product* of `cap.parent`.",
              [
                "*merge capability*:",
                lis(
                  "the *granted namespace* is the *granted namespace* of the first component (`cap.components[0]`), and",
                  "the *granted product* is the *union* of the *granted products* of all capabilities in `cap.components`.",
                  lis(
                    "Validity ensures the union is another 3d product.<!-- TODO turn back into an aside -->",
                  ),
                ),
              ],
            ),
          ],
        ),
        pinformative(
          "Now it remains to define validity. Validity encompasses several independent syntactic criteria: all *source capabilities* of a single compound capability must agree on *namespace ID* and *access mode*, and *merge capability* components must have pairwise *mergegeable* *granted products*, *delegation capabilities* must respect delegation limits, and they must contain correct signatures. To precisely define all of this, we first need another helper definition.",
        ),
        marginale(
          "This definition is *not* about enforcing that delegation limits decrease as expected, it merely supplies the raw data to later define what precisely has to be enforced.",
        ),
        pinformative(
          "The **delegation limit** of a *valid* capability `cap` depends on the kind of `cap`:",
        ),
        lis(
          ["*source capability*:", lis("the *delegation limit* is `255`.")],
          [
            "*delegation capability*:",
            lis("the *delegation limit* is `cap.delegation_limit`."),
          ],
          [
            "*restriction capability*:",
            lis(
              "the *delegation limit* is the *delegation limit* of `cap.parent`.",
            ),
          ],
          [
            "*merge capability*:",
            lis(
              "the *delegation limit* is the minimum *delegation limit* of all capabilities in `cap.components`.",
            ),
          ],
        ),
        pinformative(
          "In order to define valid signatures, we need an encoding function `encode_capability`. We give the definition *after* defining validity, because defining an encoding is rather tedious, and the specifics are more or less arbitrary and not tied to any conceptual understanding.",
        ),
        marginale_inlineable(
          "This is a matter of efficiency: verifying the signatures over every subcapability of a capability that contains `n` nested delegations using distinct keypairs takes `O(n^2)` time, whereas producing the `n` hashes of these subcapabilities takes only `O(n)` time (by reusing the internal state of the hash function across hash computations), as does computing the signatures of those hashes.",
        ),
        pinformative(
          "Conceptually interesting, however, is the fact that the signature of a valid *delegation capability* `cap` does *not* sign `encode_capability(cap.parent)` directly, but rather signs `hash_capability(encode_capability(cap.parent))` (in addition to `cap.delegee`).",
        ),
        pinformative(
          "Whether a capability `cap` is **valid** depends on the kind of `cap`:",
        ),
        lis(
          [
            "*source capability*:",
            lis(
              "if `is_communal(cap.namespace_id)`, `cap` is always valid, otherwise `cap` is valid if `cap.subspace_id` is `minimal_subspace_public_key`",
            ),
          ],
          [
            "*delegation capability*:",
            lis([
              "`cap` is *valid* if:",
              lis(
                "`cap.parent` is *valid*, and",
                "the *delegation limit* of `cap.parent` is `255`, or `cap.delegation_limit` is strictly less than the *delegation limit* of `cap.parent`, and",
                "`verify(parent_receiver, cap.authorization, concat(hash_capability(encode_capability(cap.parent)), cap.delegation_limit, encode_author_public_key(cap.delegee)))` is `true`, where `parent_receiver` is the *receiver* of `cap.parent` (and `cap.delegation_limit` is encoded as a single byte).",
              ),
            ]),
          ],
          [
            "*restriction capability*:",
            lis([
              "`cap` is *valid* if:",
              lis(
                "`cap.parent` is *valid*, and",
                "`cap.product` contains strictly less than `2^64` time ranges, strictly less than `2^64` path ranges, and strictly less than `2^64` subspace ranges.",
              ),
            ]),
          ],
          [
            "*merge capability*:",
            lis([
              "`cap` is *valid* if",
              lis(
                "all capabilities in `cap.components` are *valid*, and",
                "the *access modes* of all capabilities in `cap.components` are equal, and",
                "the *receivers* of all capabilities in `cap.components` are equal, and",
                "the *granted namespaces* of all capabilities in `cap.components` are equal, and",
                "the *granted products* of all capabilities in `cap.components` are pairwise *mergeable*.",
              ),
            ]),
          ],
        ),
        pinformative(
          "Now it remains to define `encode_capability`. We aim for a reasonable compromise between simplicity and efficiency. Most of the complexity lies in encoding 3d products, so we independently define their encodings first.",
        ),
      ),
    ]),
  ],
);
