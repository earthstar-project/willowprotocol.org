import { def, r, rs } from "../../defref.ts";
import { code, em, figcaption, figure, img, p } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { link_name } from "../../linkname.ts";
import { marginale, marginale_inlineable } from "../../marginalia.ts";
import { asset } from "../../out.ts";
import { Expression } from "../../tsgen.ts";
import { def_parameter, link, pinformative, site_template } from "../main.ts";

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
    ]),
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
  ],
);
