import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";

export const access_control = (
  <Dir name="access_control">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Access Control"
        headingId="access_control"
        heading={"Access Control"}
      >
        <P>
          <Alj inline>TODO</Alj>
        </P>
        {
          /*
        pinformative("In this document, we describe how peers can control who gets to request which <Rs n="Entry"/>. The basic idea is simple: you only answer requests for <Rs n="Entry"/> if the request comes with some proof that the original author has allowed the requesting peer to access the data."),

pinformative(def({ id: "read_authentication", singular: "read authentication" }, "Read authentication"), " is the process of one peer proving that they were granted access to some data. We employ ", def({id: "read_capability", singular: "read capability", plural: "read capabilities", }, "read capabilities"), ", unforgeable tokens that grant access to some data to the holder of some secret key."),

pinformative("For a capability system to be usable for ", r("read_authentication"), " it needs to provide three types of semantics", marginale([link_name("meadowcap", "Meadowcap"), ", our bespoke capability system for Willow, just so happens to provide these semantics."]), ": each <R n="read_capability"/> must have a single ", def({ id: "access_receiver", singular: "receiver" }), " (a ", r("dss_pk"), " of some ", r("signature_scheme"), "), it must have a single ", def({ id: "granted_area", singular: "granted area" }), " (an ", r("Area"), "), and it must have a single ", def({ id: "granted_namespace", singular: "granted namespace" }), " (a <R n="NamespaceId"/>). Access control can then be implemented by answering only requests for <Rs n="Entry"/> in the ", r("granted_namespace"), " and ", r("granted_area"), " of some <R n="read_capability"/> whose ", r("access_receiver"), " is the peer in question."),

pinformative("Peers can prove that they are the ", r("access_receiver"), " of a <R n="read_capability"/> by supplying a valid ", r("dss_signature"), " over some data that has never been signed by that ", r("dss_pk"), " before (this prevents replaying of ", rs("dss_signature"), "). To obtain such a piece of data (a ", link("nonce", "https://en.wikipedia.org/wiki/Cryptographic_nonce"), "), the peers can simply generate a sufficiently large random number. Thankfully, collaboratively generating a random number — even if one of the peers might be malicious — is a solved problem."),

marginale(img(asset("access_control/recommended_proof_technique.png"), `A comic visualising nonce generation with one column for each peer. The peers think of their numbers, hash them, exchange the hashes, then exchange their numbers, verify the hash of the received number, xor the numbers together, with one peer using the complement number instead. With the nonces generated, the peers then each sign their nonce, exchange the signatures, and verify the signature they received. After successful verification, they start vivaciously chattering in binary.`)),

pinformative("To securely negotiate a random ", def_value({id: "nonce_m", singular: "m"}, "m", "The number of random bits to generate collaboratively."), "-bit number, each peer locally generates a random ", r("nonce_m"), "-bit number, hashes it with a well-known, secure hash function, and sends the digest to the other peer. This mechanism is called a ", def({ id: "commitment_scheme", singular: "commitment scheme" }), "; the peers irrevocably commit to their choice and cannot change it later without detection. Once both peers have received the other’s digest, they then exchange their actual numbers, and verify that the number they received hashes to the digest they received before (if it does not, they abort the connection). XOR-ing the two locally chosen numbers then yields the desired random number."),

pinformative("One peer can use this number directly as an ", def({ id: "access_challenge", singular: "access challenge" }), ": the other peer can then prove that it holds the ", r("dss_sk"), " that corresponds to some ", r("dss_pk"), " (in particular, for the ", r("access_receiver"), " of any <R n="read_capability"/>) by producing a valid ", r("dss_signature"), " for the ", r("access_challenge"), ". The other peer should use a different ", r("access_challenge"), ", lest the peers copy each other’s ", rs("dss_signature"), ". Hence, the other peer simply uses the inverted number (where every bit is flipped) as its ", r("access_challenge"), "."),

pinformative("It is important to use this cooperative random number generation rather than allowing each peer to freely choose the ", r("access_challenge"), " they present to the other peer. If peers immediately transmitted their random choice without transmitting the hash first, a malicious peer could simply wait for the other’s choice before making its own choice, allowing it to freely select the resulting challenge. And if challenges were chosen directly, a malicious peer could simply pose a challenge that it itself needs to answer to a different, honest peer to obtain a valid ", r("dss_signature"), " without actually knowing the corresponding ", r("dss_sk"), "."),

pinformative("As closing thoughts, we want to compare this way of controlling read access with that of encrypting data and passing it around freely. Both approaches keep data inaccessible to unauthorised agents as long as the underlying cryptographic primitives remain strong. Freely sharing encrypted data has the drawback that all data becomes public once the encryption primitive is broken, whereas peers could refuse to pass on any data once the signature scheme is broken. Then again, encrypted data can readily propagate through an untrusted peer-to-peer network, whereas access-controlled unencrypted data can only travel between peers with access."),

pinformative("The safest option is to combine both choices. We dicuss recommended techniques for encrypting data in Willow ", link_name("e2e", "here"), "."), */
        }
      </PageTemplate>
    </File>
  </Dir>
);
