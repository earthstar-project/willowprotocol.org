import { def, preview_scope, r, rs } from "../../../defref.ts";
import { code, img, p } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { link_name } from "../../../linkname.ts";
import { marginale } from "../../../marginalia.ts";
import { asset } from "../../../out.ts";
import { Expression } from "../../../tsgen.ts";
import { link, pinformative, site_template } from "../../main.ts";

const apo = "’";

export const access_control: Expression = site_template(
  {
    title: "Access Control",
    name: "access_control",
  },
  [
    pinformative(
      "The ",
      r("wgps"),
      " includes mechanisms for access control: peers only hand out data to recipients who can prove that they were granted access to that data. This document describes the concepts this involves.",
    ),

    pinformative(
      def(
        { id: "read_authentication", singular: "read authentication" },
        "Read authentication",
      ),
      " is the process of one peer proving that they have access to some data. We employ ",
      def({
        id: "read_capability",
        singular: "read capability",
        plural: "read capabilities",
      }, "read capabilities"),
      ", unforgeable tokens that grant access to some data to the holder of some secret key. The ",
      r("wgps"),
      " does not specify a particular capability scheme. We recommend using our bespoke ",
      link_name("meadowcap", "meadowcap"),
      " system, but this is not a hard requirement.",
    ),

    pinformative(
      "For a capability system to be usable for ",
      r("read_authentication"),
      " it needs to provide three types of semantics: each ",
      r("read_capability"),
      " must have a single ",
      def({ id: "access_receiver", singular: "receiver" }),
      " (a public key of some signature scheme), it must have a single ",
      def({ id: "granted_area", singular: "granted area" }),
      " (an ",
      r("area"),
      "), and it must have a single ",
      def({ id: "granted_namespace", singular: "granted namespace" }),
      " (a ",
      r("namespace_id"),
      "). The ",
      r("wgps"),
      " makes peers transmit ",
      rs("read_capability"),
      " of which they are the ",
      r("access_receiver"),
      ", and restricts peers to requesting only ",
      rs("entry"),
      " that are ",
      r("area_include", "included"),
      " in the ",
      r("granted_area"),
      " and ",
      r("granted_namespace"),
      " of one of the capabilities they registered.",
    ),

    pinformative(
      "In order to prove to each other that they are need the intended receivers of the",
      rs("read_capability"),
      " the peers registered, they need to produce a valid signature for the ",
      r("access_receiver"),
      " of each capability. To prevent them from replaying signatures they might have picked up earlier, the data they sign has to be a ",
      link("nonce", "https://en.wikipedia.org/wiki/Cryptographic_nonce"),
      ". Collectively finding a nonce even if one of the peers might be malicious is fortunately a solved problem.",
    ),

    marginale(img(asset("access_control/recommended_proof_technique.png"))),

    pinformative(
      "To negotiate a random ",
      code("m"),
      "-bit number, each peer locally generates a random ",
      code("m"),
      "-bit number, hashes it with a well-known, secure hash function, and sends the digest to the other peer. Once both peers have received the other",
      apo,
      "s digest, they then exchange their actual numbers, and verify that the number they received hashes to the digest they received before (if it does not, they abort the connection). XOR-ing the two locally chosen numbers then yields the desired random number. This mechanism is called a ",
      def({ id: "commitment_scheme", singular: "commitment scheme" }),
      ".",
    ),

    pinformative(
      "One peer can use this number directly as a ",
      def({ id: "access_challenge", singular: "access challenge" }),
      ": the other peer can prove that it holds the secret key that corresponds to some public key by producing a valid signature for the ",
      r("access_challenge"),
      ". The other peer should use a different ",
      r("access_challenge"),
      ", lest the peers copy each other",
      apo,
      "s signatures. Hence, the other peer should simply use the inverted number (where every bit is flipped) as its ",
      r("access_challenge"),
      ".",
    ),

    pinformative(
      "It is important to use this cooperative random number generation rather than allowing each peer to freely choose the ",
      r("access_challenge"),
      " they present to the other peer. If peers immediately transmitted the random choice without transmitting the hash first, a malicious peer could simply wait for the other",
      apo,
      "s choice before making its own choice, allowing it to freely select the resulting challenge. And if challenges were chosen directly, a malicious peer could simply pose a challenge that it itself needs to answer to a different, honest peer to obtain a valid signature without knowing the corresponding secret key.",
    ),

    pinformative(
      "As closing thoughts, we want to compare this way of controlling read access with that of encrypting data and passing it around freely. Both keep data inaccessible to unauthorized agents as long as the underlying cryptographic primitives remain strong. Freely sharing encrypted data has the drawback that all data becomes public once the encryption primitive is broken, whereas peer could begin to refuse to pass on any data once the signature scheme is broken. However, encrypted data can be readily propagated through a peer-to-peer network, whereas access-controlled unencrypted data can only travel between peers with access.",
    ),

    pinformative(
      "Which choice is more appropriate for which use case cannot be answered in general, and the best choice might be a hybrid option. We merely supply a tool for restricting how data propagates, but it is up to you to decide how to use that tool. The most important thing is that you carefully consider options and implications before making that decision.",
    ),
  ],
);
