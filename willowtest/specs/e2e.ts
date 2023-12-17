import {
aside_block,
    def_value,
    link,
    lis,
    pinformative,
    site_template,
  } from "../main.ts";
  import {
    code,
    em,
    figcaption,
    figure,
    img,
    table,
    tbody,
    td,
    th,
    thead,
    tr,
  } from "../../h.ts";
  import { r, def, rs, Rs } from "../../defref.ts";
  import { asset } from "../../out.ts";
  import { marginale, marginale_inlineable, sidenote } from "../../marginalia.ts";
  import { Expression } from "../../tsgen.ts";
  import { hsection } from "../../hsection.ts";
  
  export const e2e: Expression = site_template({
    name: "e2e",
    title: "Encrypted Willow",
  }, [
    pinformative("Willow has no built-in mechanisms for encrypting data. Still, it would be nice if peers (say, an always-on server in the cloud) could facilitate data exchange without being privy to the data they share. While it is straightforward to encrypt payloads, that still leaves the relays to learn about ", rs("Entry"), ", that is, all the metadata. In this document, we examine how we can protect this metadata."),

    pinformative("Unfortunately, we cannot simply encrypt all the fields of ", rs("Entry"), ", because peers need to access this data to determine which ", rs("Entry"), " overwrite which others. More precisely, peers need the ability to compute ", rs("store_join"), " of ", rs("store"), ". These well-defined concepts give us precise limits on which properties of which metadata we have to preserve, and which properties we can vigorously scramble."),

    pinformative("The short story is that ", rs("entry_timestamp"), ", ", rs("entry_payload_length"), ", and ", rs("entry_payload_digest"), " have to stay unencrypted, but ", rs("entry_namespace_id"), ", ", rs("entry_subspace_id"), ", and ", rs("entry_path"), " can be encrypted. TODO nope. The long story is a bit more involved, and makes up the remainder of this document."),

    hsection("e2e_payloads", "Payload Digests and Length", [
      pinformative("When a peer stores a ", r("Payload"), ", it automatically knows its length, and it can compute its digest. Hence, there is no point in encrypting ", r("entry_payload_length"), " and ", r("entry_payload_digest"), "."),

      pinformative("On the bright side, the ", r("Payload"), " itself need not be a plaintext document. Depending on the degree of paranoia, one can append a nonce to each plaintext (so that equal plaintexts at different paths have different digests), apply some padding to a prespecified length (so that the length of the plaintext is not leaked), encrypt the result (so that the contents stay confidential), and use the resulting cyphertext as a ", r("Payload"), "."),

      pinformative("Anyone who can decrypt this ", r("Payload"), " can recover the original plaintext, but to anyone else, the ", r("Payload"), " and the associated ", r("entry_payload_length"), " and ", r("entry_payload_digest"), " are essentially meaningless. Yet, such a peer can still store and replicate the ", r("Entry"), " and ", r("Payload"), "."),
    ]),

    hsection("e2e_timestamps", "Timestamps", [
      pinformative("Computing ", rs("store_join"), " of ", rs("store"), " necessitates comparing ", rs("Timestamp"), " numerically. This does not mesh well with encryption; encrypted data is supposed to be indistinguishable from random data, but preserving relative ordering is very much non-random. Hence, we begrudingly accept that Willow deals in plaintext ", rs("Timestamp"), " only."),

      pinformative("The privacy-conscious user might still choose to obscure their ", rs("Timestamp"), ", they need not reflect actual creation time after all. One option could be to downgrade the resolution of the timestamps to individual days, in order to obscure timezones", marginale(["There is some prior art on obfuscating timestamps ", link("with git", "https://github.com/EMPRI-DEVOPS/git-privacy"), "."]), ". When writing to a ", r("subspace"), " from a single device only, one could even use ", rs("Timestamps"), " as a logical counter by incrementing the ", r("entry_timestamp"), " of each successive ", r("Entry"), " by one, fully preserving the deletion semantics of accurate ", rs("entry_timestamp"), " while completely obscuring physical time."),

      pinformative("We hope to see software libraries emerge that make it easy to allow Willow applications to let their users select an appropriate degree of obfuscation."),

      aside_block(
        pinformative("Encryption schemes that preserve the comparability of cyphertexts do exist, under the monikers of ", em("order-preserving "), sidenote(em("encryption"), [link(`Agrawal, Rakesh, et al. "Order preserving encryption for numeric data." Proceedings of the 2004 ACM SIGMOD international conference on Management of data. 2004.`, "https://rsrikant.com/papers/sigmod04.pdf")]), " and ", em("order-revealing "), sidenote(em("encryption"), [link(`Boneh, Dan, et al. "Semantically secure order-revealing encryption: Multi-input functional encryption without obfuscation." Annual International Conference on the Theory and Applications of Cryptographic Techniques. Berlin, Heidelberg: Springer Berlin Heidelberg, 2015.`, "https://eprint.iacr.org/2014/834.pdf")]), "."),

        pinformative("While efficient instantiations do ", sidenote("exist", ["For example, ", link(`Lewi, Kevin, and David J. Wu. "Order-revealing encryption: New constructions, applications, and lower bounds." Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications Security. 2016.`, "https://eprint.iacr.org/2016/612.pdf")]), ", they rely on non-standard cryptographic primitives, and they are vulnerable to inference ", sidenote("attacks", [link(`Naveed, Muhammad, Seny Kamara, and Charles V. Wright. "Inference attacks on property-preserving encrypted databases." Proceedings of the 22nd ACM SIGSAC Conference on Computer and Communications Security. 2015.`, "https://www.microsoft.com/en-us/research/wp-content/uploads/2017/02/edb.pdf")]), " (note that the defense of using a ", em("left/right ORE scheme"), " works only in a client-server setting, but not in the peer-to-peer setting of Willow). We do not feel like current techniques are reliable enough to warrant the significant increase in complexity of Willow if we incorporated them."),

        pinformative("Should an order-revealing encryption scheme of sufficient quality become available in the future (and it is not at all clear whether this will happen), it will be necessary to fork Willow to incorporate it. We accept this possibility in order to reduce the conceptual complexity of Willow today."),
      ),
    ]),

    hsection("e2e_spaceids", "NamespaceIds and SubspaceIds", [
      // pinformative("To the Willow datamodel, ", rs("NamespaceId"), " and ", rs("SubspaceId"), " are opaque tokens with no semantics beyond equality comparisons. Hence, you can simply encrypt them with a ", link("block cypher", "https://en.wikipedia.org/wiki/Block_cipher"), " of your choice."),
    ]),

    hsection("e2e_paths", "Paths", [
      pinformative(""),
    ]),

    // pinformative("Spoilers: ", rs("namespace_id"), " and ", rs("subspace_id"), " can be encrypted with any normal block cypher. ", Rs("path"), " require encryption with a prefix-preserving encryption ", sidenote("scheme", [link(`Xu, Jun, et al. "Prefix-preserving ip address anonymization: Measurement-based security evaluation and a new cryptography-based scheme." 10th IEEE International Conference on Network Protocols, 2002. Proceedings. IEEE, 2002.`, "https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=3d6387c053cc9f3fe153bbffc79b492f0775c354")]), ". ", Rs("timestamp"), " cannot be encrypted while preserving Willow semantics."),
  ]);
  
  /*
  
  */
  