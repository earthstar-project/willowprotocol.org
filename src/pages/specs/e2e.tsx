import { Dir, File } from "macromania-outfs";
import { AE, Alj, AsideBlock, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs, Rsb } from "macromania-defref";
import { Bib } from "macromania-bib";
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

export const e2e = (
  <Dir name="e2e">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Encrypted Willow"
        headingId="e2e"
        heading={"Encrypted Willow"}
        toc
        bibliography
        parentId="specifications"
      >
        <P>
          Willow has no built-in mechanisms for encrypting data. Still, it would
          be nice if peers (say, an always-on server in the cloud) could
          facilitate data exchange without being privy to the data they share.
          While it is straightforward to encrypt payloads, that still leaves the
          relays to learn about{" "}
          <Rs n="Entry" />, that is, all the metadata. In this document, we
          examine how we can protect this metadata.
        </P>

        <P>
          Unfortunately, we cannot simply encrypt all the fields of{" "}
          <Rs n="Entry" />, because peers need to access this data to determine
          which <Rs n="Entry" />{" "}
          overwrite which others. More precisely, peers need the ability to
          compute <Rs n="store_join" /> of{" "}
          <Rs n="store" />. These well-defined concepts give us precise limits
          on which properties of which metadata we have to preserve, and which
          properties we can vigorously scramble.
        </P>

        <P>
          Typically, you would use symmetric encryption to achieve
          confidentiality — the core data model can provide authenticity via
          {" "}
          <Rs n="AuthorisationToken" />{" "}
          already. As for the granularity at which to use different keys, we
          consider three relevant options: a key per{" "}
          <R n="namespace" />, a key per{" "}
          <R n="subspace" />, or a key per combination of <R n="subspace" /> and
          {" "}
          <Sidenote
            note={
              <>
                We describe a system based on key derivation for each successive
                {" "}
                <R n="Path" /> <R n="Component" /> in{" "}
                <R n="e2e_paths">the section on encrypting paths</R>.
              </>
            }
          >
            <R n="Path" />
          </Sidenote>.
        </P>

        <Hsection n="e2e_payloads" title="Payload Digest and Length">
          <P>
            When a peer stores a{" "}
            <R n="Payload" />, it automatically knows its length and it can
            compute its digest. Hence, there is little point in encrypting{" "}
            <R n="entry_payload_length" /> and <R n="entry_payload_digest" />.
          </P>

          <P>
            On the bright side, the <R n="Payload" />{" "}
            itself need not be a plaintext document. One can append a nonce to
            each plaintext (so that equal plaintexts at different paths have
            different{" "}
            <Sidenote
              note={
                <>
                  Salting with nonces is not necessary when using different
                  encryption keys per <R n="Path" />.
                </>
              }
            >
              digests
            </Sidenote>), apply some padding to a prespecified length (so that
            the length of the plaintext is not leaked), encrypt the result (so
            that the contents stay confidential), and use the resulting
            cyphertext as a <R n="Payload" />.
          </P>

          <P>
            Anyone who can decrypt this <R n="Payload" />{" "}
            can recover the original plaintext, but to anyone else, the{" "}
            <R n="Payload" /> and the associated <R n="entry_payload_length" />
            {" "}
            and <R n="entry_payload_digest" />{" "}
            are essentially meaningless. Yet, such peers can still store and
            replicate the <R n="Entry" /> and its <R n="Payload" />.
          </P>
        </Hsection>

        <Hsection n="e2e_timestamps" title="Timestamp">
          <P>
            Computing <Rs n="store_join" /> of <Rs n="store" />{" "}
            necessitates comparing <Rs n="Timestamp" />{" "}
            numerically. This does not mesh well with encryption; encrypted data
            is supposed to be indistinguishable from random data, but preserving
            relative ordering is very much non-random. Hence, we begrudingly
            accept that Willow deals in plaintext <Rs n="Timestamp" /> only.
          </P>

          <P>
            The privacy-conscious user might still choose to obscure their{" "}
            <Rs n="Timestamp" />, as <Rs n="Timestamp" />{" "}
            need not reflect actual creation time after all. One option could be
            to downgrade the resolution to individual days, in order to obscure
            timezones<Marginale>
              There is some prior art on obfuscating timestamps{" "}
              <AE href="https://github.com/EMPRI-DEVOPS/git-privacy">
                with git
              </AE>.
            </Marginale>. When writing to a <R n="subspace" />{" "}
            from a single device only, one could even use <Rs n="Timestamp" />
            {" "}
            as a logical counter by incrementing the <R n="entry_timestamp" />
            {" "}
            of each successive <R n="Entry" />{" "}
            by one, fully preserving the deletion semantics of accurate{" "}
            <Rs n="entry_timestamp" /> while completely obscuring physical time.
          </P>

          <P>
            We hope to see software libraries emerge that make it easy for users
            to select an appropriate degree of obfuscation.
          </P>

          <AsideBlock>
            <P>
              Encryption schemes that preserve the comparability of cyphertexts
              do exist, under the monikers of{" "}
              <Em>order-preserving encryption</Em>
              <Bib item="agrawal2004order" /> and{" "}
              <Em>order-revealing encryption</Em>
              <Bib item="boneh2015semantically" />.
            </P>

            <P>
              While efficient instantiations do{" "}
              <Sidenote
                note={
                  <>
                    For example <Bib item="lewi2016order" />.
                  </>
                }
              >
                exist
              </Sidenote>, they rely on non-standard cryptographic primitives,
              and they are vulnerable to inference
              attacks<Bib item="naveed2015inference" />{" "}
              (note that the defence of using a <Em>left/right ORE scheme</Em>
              {" "}
              works only in a client-server setting, but not in the peer-to-peer
              setting of Willow). We do not feel like current techniques are
              reliable enough to warrant the significant increase in complexity
              of Willow if we incorporated them.
            </P>

            <P>
              Should an order-revealing encryption scheme of sufficient quality
              become available in the future (and it is not at all clear whether
              this will ever happen), it would be necessary to fork Willow to
              incorporate it. We accept this possibility in order to reduce the
              conceptual complexity of Willow today.
            </P>
          </AsideBlock>
        </Hsection>

        <Hsection n="e2e_spaceids" title="NamespaceId and SubspaceId">
          <P>
            If <Rs n="NamespaceId" /> or <Rs n="SubspaceId" />{" "}
            were encrypted differently per <R n="subspace" />, then{" "}
            <Rs n="Entry" />{" "}
            that should overwrite each other might not do so. Encrypting them on
            a per-<R n="namespace" />{" "}
            basis has no effect on the inferences that an observer can make
            about which <Rs n="Entry" /> are part of the same{" "}
            <Rs n="namespace" /> or{" "}
            <Rs n="subspace" />. Hence, there is little reason to encrypt them
            at all.
          </P>

          <P>
            Any non-random-looking information that is part of{" "}
            <Rs n="NamespaceId" /> or <Rs n="SubspaceId" />{" "}
            should then be considered as public, but this is easily solved by
            hashing the meaningful parts of the Ids before passing them on to
            Willow. This is computationally less expensive than encrypting them.
          </P>
        </Hsection>

        <Hsection n="e2e_paths" title="Path">
          <P>
            <Rsb n="Path" />{" "}
            are arguably the most interesting facet of encryption in Willow.
            Since users (or their applications) deliberately select{" "}
            <Rs n="Path" /> to enable meaningful data access, <Rs n="Path" />
            {" "}
            carry information that clearly should be encrypted.
          </P>

          <P>
            Because <Rs n="Entry" /> in the same <R n="subspace" />{" "}
            overwrite each other based on their{" "}
            <Rs n="entry_path" />, the cyphertexts of two <Rs n="Path" />{" "}
            that begin with some number of equal <Rs n="Component" />{" "}
            must begin with as many equal <Rs n="Component" /> as well. Such
            {" "}
            <Em>prefix-preserving encryption schemes</Em>
            <Bib item="fan2004prefix" />{" "}
            are well-understood, and leak less information than order-preserving
            encryption schemes<Bib item="li2005efficiency" />.
          </P>

          <P>
            The hierarchical nature of <Rs n="Path" />{" "}
            suggests another requirement: it should be possible to convey the
            ability to decrypt all <Rs n="Entry" /> whose <R n="entry_path" />
            {" "}
            starts with a particular prefix. For example, allowing somebody to
            decrypt <Path components={["blog", "ideas"]} />{" "}
            should allow them to decrypt{" "}
            <Path components={["blog", "ideas", "game.txt"]} /> and{" "}
            <Path components={["blog", "ideas", "pets", "maze.txt"]} />{" "}
            as well, but neither <Path components={["blog", "config.txt"]} />
            {" "}
            nor <Path components={["code", "willow.rs"]} />.
          </P>

          <PreviewScope>
            <P>
              We can achieve both hierarchic decryption capabilities and
              prefix-preservation by encrypting individual <Rs n="Component" />
              {" "}
              with encryption keys that we successively derive with a{" "}
              <AE href="https://en.wikipedia.org/wiki/Key_derivation_function">
                key derivation function
              </AE>. Let <DefFunction n="kdf" />{" "}
              be a key-derivation function that takes as inputs an encryption
              key and a byte string of length at most{" "}
              <R n="max_component_length" />, and that returns a new encryption
              key.<Marginale>
                A suitable candidate for <R n="kdf" /> is{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc5869">
                  HKDF (RFC 5869)
                </AE>, using successive <Rs n="Component" />{" "}
                as the salt of each derivation step.
              </Marginale>{" "}
              Let{" "}
              <DefFunction n="path_encrypt_component" r="encrypt_component" />
              {" "}
              be a function that encrypts a single <R n="Component" />{" "}
              with a given encryption key. Given an initial key{" "}
              <DefValue n="kdf_k0" r="key_0" />, we can then encrypt{" "}
              <Rs n="Path" /> as follows:
            </P>

            <Ul>
              <Li>
                Encrypting the empty <R n="Path" /> yields the empty{" "}
                <R n="Path" /> again.
              </Li>
              <Li>
                Encrypt a <R n="Path" /> with a single <R n="Component" />{" "}
                <DefValue n="kdf_cmp0" r="component_0" /> as{" "}
                <Code>
                  <R n="path_encrypt_component" />(<R n="kdf_k0" />,{" "}
                  <R n="kdf_cmp0" />)
                </Code>.
              </Li>
              <Li>
                For any other (longer) <R n="Path" /> , denote its final{" "}
                <R n="Component" /> as{" "}
                <DefValue n="kdf_cmpipp" r="component_ipp" />, the{" "}
                <R n="Path" /> formed by its prior <Rs n="Component" /> as{" "}
                <DefValue n="kdf_pi" r="path_i" />, the final component of{" "}
                <R n="kdf_pi" /> as{" "}
                <DefValue n="kdf_cmpi" r="component_i" />, and denote the key
                that is used to encrypt <R n="kdf_cmpi" /> as{" "}
                <DefValue n="kdf_ski" r="key_i" />. You then encrypt the{" "}
                <R n="Path" /> by first encrypting{" "}
                <R n="kdf_pi" />, and then appending{" "}
                <Code>
                  <R n="path_encrypt_component" />(<R n="kdf" />(<R n="kdf_ski" />,
                  {" "}
                  <R n="kdf_cmpi" />), <R n="kdf_cmpipp" />)
                </Code>.
              </Li>
            </Ul>
          </PreviewScope>

          <P>
            This technique produces prefix-preserving cyphertexts, and it lets
            anyone who can decrypt a certain <R n="Path" />{" "}
            also decrypt all extensions of that <R n="Path" />. As long as the
            {" "}
            <R n="kdf" /> is non-invertable even for known{" "}
            <Rs n="Component" />, no other <Rs n="Path" />{" "}
            can be decrypted beyond the point where they differ.
          </P>

          <PreviewScope>
            <P>
              Giving the ability to decrypt all <Rs n="Path" />{" "}
              starting with some <R n="Path" /> <DefValue n="kdf_p" r="p" />
              {" "}
              requires three pieces of information: the plaintext of{" "}
              <R n="kdf_p" />, the cyphertext of{" "}
              <R n="kdf_p" />, and the encryption key that is used for
              encrypting <Rs n="Path" /> that have exactly one more{" "}
              <R n="Component" /> than <R n="kdf_p" />.
            </P>
          </PreviewScope>

          <P>
            When{" "}
            <R n="e2e_payloads">encrypting payloads</R>, you can use the same
            key that encrypts the final <R n="Component" /> of an{" "}
            <R n="Entry" />’s <R n="entry_path" /> for encrypting the{" "}
            <R n="Entry" />’s <R n="Payload" /> as well (leaving{" "}
            <Rs n="Payload" /> at the empty <R n="Path" />{" "}
            unencrypted). This scheme then conveys the same hierarchical
            decryption capabilities as those for <Rs n="Path" />.
          </P>

          <P>
            Finally, we want to note that this style of encrypting{" "}
            <Rs n="Path" />{" "}
            can be implemented completely transparently. Applications specify
            {" "}
            <Rs n="Path" />{" "}
            in the clear, and a thin translation layer encrypts them before
            passing them to Willow, and decrypts <Rs n="Path" />{" "}
            before handing them from Willow to the applications. Internally,
            Willow does not need to be aware of this. Protocols like{" "}
            <R n="meadowcap">Meadowcap</R> or the <R n="sync">WGPS</R>{" "}
            <Em>just work</Em> with the encrypted <Rs n="Path" />.
          </P>
        </Hsection>

        <Hsection n="e2e_auth" title="AuthorisationToken">
          <P>
            Peers store and exchange not only <Rs n="Entry" /> but{" "}
            <Rs n="AuthorisedEntry" />. Whether <Rs n="AuthorisationToken" />
            {" "}
            can be meaningfully encrypted depends on the choice of{" "}
            <R n="is_authorised_write" />, and should be taken into account when
            designing and using these parameters. <R n="meadowcap">Meadowcap</R>
            {" "}
            <Rs n="Capability" />{" "}
            cannot be encrypted, as this would remove the ability of peers
            without access to the decryption keys to verify the{" "}
            <Rs n="dss_signature" />.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
