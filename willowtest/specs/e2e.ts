import {
aside_block,
    def_value,
    link,
    lis,
    path,
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
  import { link_name } from "../../linkname.ts";
  import { function_call } from "../../pseudocode.ts";
  
  export const e2e: Expression = site_template({
    name: "e2e",
    title: "Encrypted Willow",
  }, [
    pinformative("Willow has no built-in mechanisms for encrypting data. Still, it would be nice if peers (say, an always-on server in the cloud) could facilitate data exchange without being privy to the data they share. While it is straightforward to encrypt payloads, that still leaves the relays to learn about ", rs("Entry"), ", that is, all the metadata. In this document, we examine how we can protect this metadata."),

    pinformative("Unfortunately, we cannot simply encrypt all the fields of ", rs("Entry"), ", because peers need to access this data to determine which ", rs("Entry"), " overwrite which others. More precisely, peers need the ability to compute ", rs("store_join"), " of ", rs("store"), ". These well-defined concepts give us precise limits on which properties of which metadata we have to preserve, and which properties we can vigorously scramble."),

    pinformative("Typically, you would use symmetric encryption to achieve confidentiality — the core data model can provide authenticity via ", rs("AuthorizationToken"), " already. As for the granularity at which to use different keys, we consider three relevant options: a key per ", r("namespace"), ", a key per ", r("subspace"), ", or a key per combination of ", r("subspace"), " and ", sidenote(r("Path"), ["We describe a system based on key derivation for each successive ", r("Path"), " component in ", link_name("e2e_paths", "the section on encrypting paths"), "."]), "."),

    hsection("e2e_payloads", "Payload Digests and Length", [
      pinformative("When a peer stores a ", r("Payload"), ", it automatically knows its length and it can compute its digest. Hence, there is little point in encrypting ", r("entry_payload_length"), " and ", r("entry_payload_digest"), "."),

      pinformative("On the bright side, the ", r("Payload"), " itself need not be a plaintext document. One can append a nonce to each plaintext (so that equal plaintexts at different paths have different ", sidenote("digests", ["Salting with nonces is not necessary when using different encryption keys per ", r("Path"), "."]), "), apply some padding to a prespecified length (so that the length of the plaintext is not leaked), encrypt the result (so that the contents stay confidential), and use the resulting cyphertext as a ", r("Payload"), "."),

      pinformative("Anyone who can decrypt this ", r("Payload"), " can recover the original plaintext, but to anyone else, the ", r("Payload"), " and the associated ", r("entry_payload_length"), " and ", r("entry_payload_digest"), " are essentially meaningless. Yet, such peers can still store and replicate the ", r("Entry"), " and its ", r("Payload"), "."),
    ]),

    hsection("e2e_timestamps", "Timestamps", [
      pinformative("Computing ", rs("store_join"), " of ", rs("store"), " necessitates comparing ", rs("Timestamp"), " numerically. This does not mesh well with encryption; encrypted data is supposed to be indistinguishable from random data, but preserving relative ordering is very much non-random. Hence, we begrudingly accept that Willow deals in plaintext ", rs("Timestamp"), " only."),

      pinformative("The privacy-conscious user might still choose to obscure their ", rs("Timestamp"), ", as ", rs("Timestamp"), " need not reflect actual creation time after all. One option could be to downgrade the resolution to individual days, in order to obscure timezones", marginale(["There is some prior art on obfuscating timestamps ", link("with git", "https://github.com/EMPRI-DEVOPS/git-privacy"), "."]), ". When writing to a ", r("subspace"), " from a single device only, one could even use ", rs("Timestamps"), " as a logical counter by incrementing the ", r("entry_timestamp"), " of each successive ", r("Entry"), " by one, fully preserving the deletion semantics of accurate ", rs("entry_timestamp"), " while completely obscuring physical time."),

      pinformative("We hope to see software libraries emerge that make it easy for users to select an appropriate degree of obfuscation."),

      aside_block(
        pinformative("Encryption schemes that preserve the comparability of cyphertexts do exist, under the monikers of ", em("order-preserving "), sidenote(em("encryption"), [link(`Agrawal, Rakesh, et al. "Order preserving encryption for numeric data." Proceedings of the 2004 ACM SIGMOD international conference on Management of data. 2004.`, "https://rsrikant.com/papers/sigmod04.pdf")]), " and ", em("order-revealing "), sidenote(em("encryption"), [link(`Boneh, Dan, et al. "Semantically secure order-revealing encryption: Multi-input functional encryption without obfuscation." Annual International Conference on the Theory and Applications of Cryptographic Techniques. Berlin, Heidelberg: Springer Berlin Heidelberg, 2015.`, "https://eprint.iacr.org/2014/834.pdf")]), "."),

        pinformative("While efficient instantiations do ", sidenote("exist", ["For example, ", link(`Lewi, Kevin, and David J. Wu. "Order-revealing encryption: New constructions, applications, and lower bounds." Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications Security. 2016.`, "https://eprint.iacr.org/2016/612.pdf")]), ", they rely on non-standard cryptographic primitives, and they are vulnerable to inference ", sidenote("attacks", [link(`Naveed, Muhammad, Seny Kamara, and Charles V. Wright. "Inference attacks on property-preserving encrypted databases." Proceedings of the 22nd ACM SIGSAC Conference on Computer and Communications Security. 2015.`, "https://www.microsoft.com/en-us/research/wp-content/uploads/2017/02/edb.pdf")]), " (note that the defense of using a ", em("left/right ORE scheme"), " works only in a client-server setting, but not in the peer-to-peer setting of Willow). We do not feel like current techniques are reliable enough to warrant the significant increase in complexity of Willow if we incorporated them."),

        pinformative("Should an order-revealing encryption scheme of sufficient quality become available in the future (and it is not at all clear whether this will ever happen), it would be necessary to fork Willow to incorporate it. We accept this possibility in order to reduce the conceptual complexity of Willow today."),
      ),
    ]),

    hsection("e2e_spaceids", "NamespaceIds and SubspaceIds", [
      pinformative("If ", rs("NamespaceId"), " or ", rs("SubspaceId"), " were encrypted differently per ", r("subspace"), ", then ", rs("Entry"), " that should overwrite each other might not do so. Encrypting them on a per-", r("namespace"), " basis has no effect on the inferences that an observer can make about which ", rs("Entry"), " are part of the same ", rs("namespace"), " or ", rs("subspace"), ". Hence, there is little reason to encrypt them at all."),

      pinformative("Any non-random-looking information that is part of ", rs("NamespaceId"), " or ", rs("SubspaceId"), " should then be considered as public, but this is easily solved by hashing the meaningful parts of the Ids before passing them on to Willow. This is computationally less expensive than encrypting them."),
    ]),

    hsection("e2e_paths", "Paths", [
      pinformative(rs("Path"), " are arguably the most interesting facet of encryption in Willow. Since users (or their applications) deliberately select ", rs("Path"), " to enable meaningful data access, ", rs("Path"), " carry information that clearly should be encrypted."),

      pinformative("Because ", rs("Entry"), " in the same ", r("subspace"), " overwrite each other based on their ", rs("entry_path"), ", the cyphertexts of two ", rs("Path"), " that begin with some number of equal components must begin with as many equal components as well. Such ", em("prefix-preserving encryption"), " ", sidenote("schemes", [link(`Fan, Jinliang, et al. "Prefix-preserving IP address anonymization: measurement-based security evaluation and a new cryptography-based scheme." Computer Networks 46.2 (2004): 253-272.`, "https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=3d6387c053cc9f3fe153bbffc79b492f0775c354")]), " are well-understood, and leak less information than order-preserving encryption ", sidenote("schemes", [link(`Li, Jun, and Edward R. Omiecinski. "Efficiency and security trade-off in supporting range queries on encrypted databases." IFIP Annual Conference on Data and Applications Security and Privacy. Berlin, Heidelberg: Springer Berlin Heidelberg, 2005.`, "https://repository.gatech.edu/server/api/core/bitstreams/ca0b7d1f-b382-446b-be32-1016a4e443e4/content")]), "."),

      pinformative("The hierarchical nature of ", rs("Path"), " suggests another requirement: it should be possible to convey the ability to decrypt all ", rs("Entry"), " whose ", r("entry_path"), " starts with a particular prefix. For example, allowing somebody to decrypt ", path("blog", "ideas"), " should allow them to decrypt ", path("blog", "ideas", "game.txt"), " and ", path("blog", "ideas", "pets", "maze.txt"), " as well, but neither ", path("blog", "config.txt"), " nor ", path("code", "willow.rs"), "."),

      pinformative("We can achieve both hierarchic decryption capabilities and prefix-preservation by encrypting individual ", r("Path"), " components with encryption keys that we successively derive with a ", link("key derivation function", "https://en.wikipedia.org/wiki/Key_derivation_function"), ". Let ", def_value("kdf"), " be a key-derivation function that takes as inputs an encryption key and a byte string of length at most ", r("max_component_length"), ", and that returns a new encryption key.", marginale(["A suitable candidate for ", r("kdf"), " is ", link("HKDF (RFC 5869)", "https://datatracker.ietf.org/doc/html/rfc5869"), ", using ", r("Path"), " components as the salt of each derivation step."]), " Given an initial key ", def_value({id: "kdf_k0", singular: "key_0"}), ", we can then encrypt ", rs("Path"), " as follows:", lis(
        ["Encrypting the empty ", r("Path"), " yields the empty ", r("Path"), " again."],
        ["Encrypt ", rs("Path"), " with a single component ", def_value({id: "kdf_cmp0", singular: "component_0"}), " using the key ", function_call(r("kdf"), r("kdf_k0"), r("kdf_cmp0")), "."],
        ["For any other (longer) ", r("Path"), " , denote its final component as ", def_value({id: "kdf_cmpi", singular: "component_i"}), ", the ", r("Path"), " formed by its prior components as ", def_value({id: "kdf_pi", singular: "path_i"}), ", and denote the key that is used to encrypt the final component of ", r("kdf_pi"), " as ", def_value({id: "kdf_ski", singular: "key_i"}), ". You then encrypt the ", r("Path"), " by first encrypting ", r("kdf_pi"), ", and then appending ", function_call(r("kdf"), r("kdf_ki"), r("kdf_cmpi")), " as the final component."],
      )),

      pinformative("This technique produces prefix-preserving cyphertexts, and it lets anyone who can decrypt a certain ", r("Path"), " also decrypt all extensions of that ", r("Path"), ". As long as the ", r("kdf"), " is non-invertable even for known ", r("Path"), " components, no other ", rs("Path"), " can be decrypted beyond the point where they differ."),

      pinformative("Giving the ability to decrypt all ", rs("Path"), " starting with some ", r("Path"), " ", def_value({id: "kdf_p", singular: "p"}), " requires three pieces of information: the plaintext of ", r("kdf_p"), ", the cyphertext of ", r("kdf_p"), ", and the secret key that was used to encrypt the final component of ", r("kdf_p"), "."),

      pinformative("When ", link_name("e2e_payloads", "encrypting payloads"), ", you can use the same key that encrypts the final component of an ", r("Entry"), "’s ", r("entry_path"), " for encrypting the ", r("Entry"), "’s ", r("payload"), " as well (using ", r("kdf_k0"), " for encrypting ", rs("payload"), " at the empty ", r("Path"), "). This scheme then conveys the same hierarchical decryption capabilities as those for ", rs("Path"), "."),

      pinformative("Finally, we want to note that this style of encrypting ", rs("Path"), " can be implemented completely transparently. Applications specify ", rs("Path"), " in the clear, and a thin translation layer encrypts them before passing them to Willow, and decrypts ", rs("Path"), " before handing them from Willow to the applications. Internally, Willow does not need to be aware of this. Protocols like ", link_name("meadowcap", "Meadowcap"), " or the ", link_name("sync", "WGPS"), " ", em("just work"), " with the encrypted ", rs("Path"), "."),
    ]),

    hsection("e2e_auth", "AuthorizationTokens", [
      pinformative("Peers store and exchange not only ", rs("Entry"), " but ", rs("AuthorizedEntry"), ". Whether ", rs("AuthorizationToken"), " can be meaningfully encrypted depends on the choice of ", r("is_authorized_write"), ", and should be taken into account when designing and using these parameters. ", link_name("meadowcap", "Meadowcap"), " ", rs("Capability"), " cannot be encrypted, as this would remove the ability of peers without access to the decryption keys to verify the ", rs("dss_signature"), "."),
    ]),

    // pinformative("Spoilers: ", rs("namespace_id"), " and ", rs("subspace_id"), " can be encrypted with any normal block cypher. ", Rs("path"), " require encryption with a prefix-preserving encryption ", sidenote("scheme", [link(`Xu, Jun, et al. "Prefix-preserving ip address anonymization: Measurement-based security evaluation and a new cryptography-based scheme." 10th IEEE International Conference on Network Protocols, 2002. Proceedings. IEEE, 2002.`, "https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=3d6387c053cc9f3fe153bbffc79b492f0775c354")]), ". ", Rs("timestamp"), " cannot be encrypted while preserving Willow semantics."),
  ]);
  
  /*
  
  */
  