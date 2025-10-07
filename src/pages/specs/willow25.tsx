import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Br, Code, Em, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  ArrayType,
  DefFunction,
  DefType,
  DefValue,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import {
  bitfieldArbitrary,
  bitfieldConstant,
  bitfieldIff,
  CodeFor,
  EncConditional,
  Encoding,
  RawBytes,
  ValAccess,
} from "../../encoding_macros.tsx";

export const willow25 = (
  <Dir name="willow25">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow’25"
        headingId="willow25_spec"
        heading="Willow’25"
        parentId="specifications"
        toc
        status="proposal"
        statusDate="05.17.2025"
      >
        <PreviewScope>
          <P>
            The various Willow specifications leave open some parameter choices,
            primarily around cryptographic primitives.{" "}
            <Def n="willow25" r="Willow’25" />{" "}
            is a set of recommended parameters that should work in a variety of
            settings. It provides parameter choices for the{" "}
            <R n="data_model">Willow data model</R>, the{" "}
            <R n="meadowcap">Meadowcap capability system</R>, the{" "}
            <R n="sync">Willow General Purpose Sync protocol</R>, and the{" "}
            <R n="drop_format" />.
          </P>
        </PreviewScope>

        <P>
          The parameters are applicable to a large variety of use cases. By
          using{" "}
          <R n="willow25" />, you sidestep the daunting task of defining your
          own parameter choices, and you open up interoperability to all other
          Willow deployments which also conform to <R n="willow25" />.
        </P>

        <Hsection n="willow25_crypto" title="Cryptographic Primitives">
          <P>
            <Rb n="willow25" />{" "}
            uses cryptographically secure parameters. We intend to not release
            another set of recommended parameters until one of the cryptographic
            primitives of <R n="willow25" /> is broken.
          </P>

          <PreviewScope>
            <P>
              We use <Def n="ed25519" r="Ed25519" />{" "}
              (<AE href="https://ed25519.cr.yp.to/">defined here</AE>) as the
              {" "}
              <R n="signature_scheme" />. We write{" "}
              <DefType n="Ed25519Pk" rs="Ed25519Pks" /> for the type of{" "}
              <R n="ed25519" />{" "}
              public keys (the 32 byte encodings, not the actual curve points).
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Marginale>
                We are still debating whether to go with Blake3 instead of
                William3. This is a <R n="status_proposal" />{" "}
                document after all.
              </Marginale>
              We use <DefFunction n="william3" r="WILLIAM3" />{" "}
              as the go-to hash function, which is defined as{" "}
              <AE href="https://worm-blossom.github.io/bab/#instantiations_william">
                part of the Bab specification
              </AE>. We write{" "}
              <DefType n="William3Digest" rs="William3Digests" />{" "}
              for the type of digests, which is simply the type of 32-byte
              arrays.
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection n="willow25_data_model" title="Data Model Parameters">
          <P>
            <Rb n="willow25" /> instantiates the{" "}
            <R n="data_model">Willow data model</R>{" "}
            with the following parameters:
          </P>

          <P>
            The type <R n="NamespaceId" /> is the type of <Rs n="Ed25519Pk" />.
          </P>

          <P>
            The type <R n="SubspaceId" /> is the type of <Rs n="Ed25519Pk" />.
          </P>

          <P>
            The <R n="max_component_length" /> is <Code>4096</Code>, the{" "}
            <R n="max_component_count" /> is <Code>4096</Code>, and the{" "}
            <R n="max_path_length" /> is <Code>4096</Code>.
          </P>

          <P>
            The <R n="hash_payload" /> function is <R n="william3" />.
          </P>

          <P>
            The type <R n="PayloadDigest" /> is{" "}
            <R n="William3Digest" />, the total order we use is the numeric one.
          </P>

          <P>
            The type <R n="AuthorisationToken" /> is{" "}
            <R n="MeadowcapAuthorisationToken" /> and the{" "}
            <R n="is_authorised_write" /> function is{" "}
            <R n="meadowcap_is_authorised_write" />, with the{" "}
            <R n="meadowcap" /> parameter instantiation described in the{" "}
            <R n="willow25_meadowcap">next section</R>.
          </P>
        </Hsection>

        <Hsection n="willow25_meadowcap" title="Meadowcap Parameters">
          <P>
            <Rb n="willow25" /> instantiates <R n="meadowcap">Meadowcap</R>{" "}
            with the following parameters:
          </P>

          <P>
            The <R n="namespace_signature_scheme" /> is <R n="ed25519" />.
          </P>

          <P>
            The <R n="encode_namespace_pk" />{" "}
            function is the identity function (the <Rs n="dss_pk" />{" "}
            <Em>are</Em> bytestrings already).
          </P>

          <P>
            The <R n="encode_namespace_sig" />{" "}
            function is the identity function (the <Rs n="dss_signature" />{" "}
            <Em>are</Em> bytestrings already).
          </P>

          <P>
            The <R n="user_signature_scheme" /> is <R n="ed25519" />.
          </P>

          <P>
            The <R n="encode_user_pk" /> function is the identity function (the
            {" "}
            <Rs n="dss_pk" /> <Em>are</Em> bytestrings already).
          </P>

          <P>
            The <R n="encode_user_sig" /> function is the identity function (the
            {" "}
            <Rs n="dss_signature" /> <Em>are</Em> bytestrings already).
          </P>

          <P>
            The <R n="is_communal" /> function maps an <R n="Ed25519Pk" /> to
            {" "}
            <Code>true</Code> if and only if its least significant bit is{" "}
            <Code>0</Code>.
          </P>

          <P>
            The choices for the Meadowcap <R n="mc_max_component_length" />,
            {" "}
            <R n="mc_max_component_count" />, and <R n="mc_max_path_length" />
            {" "}
            are the same as those for the data model{" "}
            <R n="max_component_length" />, <R n="max_component_count" />, and
            {" "}
            <R n="max_path_length" /> (i.e., <Code>4096</Code> each).
          </P>

          <P>
            These choices of parameters make the Meadowcap instantiation{" "}
            <R n="mc_compatible" /> with the data model instantiation.
          </P>
        </Hsection>

        <Hsection n="willow25_wgps" title="WGPS Parameters">
          <P>
            <Rb n="willow25" /> instantiates the <R n="sync">WGPS</R>{" "}
            with the following parameters:
          </P>

          <Hsection
            n="willow25_wgps_handshake"
            title="Handshake and Transport Encryption"
          >
            <P>
              The <R n="hs_sk" /> of the{" "}
              <R n="handshake_and_encryption">handshake</R>{" "}
              are the secret keys of <R n="ed25519" />. The <R n="hs_pk" />{" "}
              are the encoded <Rs n="Ed25519Pk" />, i.e., the 32 byte integers.
            </P>

            <P>
              The <R n="hs_dh" /> function is <R n="ed25519" />{" "}
              scalar multiplication. <R n="hs_encode_pk" />{" "}
              is the identify function (public keys are already byte strings).
            </P>

            <P>
              For encryption, we use{" "}
              <AE href="https://www.ietf.org/rfc/rfc7539.txt">
                AEAD_CHACHA20_POLY1305
              </AE>. Unlike{" "}
              <AE href="https://noiseprotocol.org/noise.html#the-chachapoly-cipher-functions">
                Noise
              </AE>, we use a <R n="hs_nl" /> of 12 bytes.{"  "}
              The keys are of type{" "}
              <Code>
                <ArrayType count="32">
                  <R n="U8" />
                </ArrayType>
              </Code>.
            </P>

            <P>
              The <R n="hs_hash" /> function for the handshake is{" "}
              <R n="william3" />, which has a <R n="hs_hashlen" />{" "}
              of 32 bytes, and a <R n="hs_blocklen" /> of 128 bytes. The{" "}
              <R n="hs_digest_to_aeadkey" />{" "}
              function is the identity function (both digests and encryption
              keys are 32 byte integers).
            </P>

            <P>
              The <R n="hs_protocol_name" /> is the ASCII encoding of{" "}
              <Code>Nose_XX_ED25519_ChaChaPoly_WILLIAM3</Code>:<Br />
              <Code>
                78, 111, 115, 101, 95, 88, 88, 95, 69, 68, 50, 53, 53, 49, 57,
                95, 67, 104, 97, 67, 104, 97, 80, 111, 108, 121, 95, 87, 73, 76,
                76, 73, 65, 77, 51
              </Code>{" "}
              (decimal).
            </P>
          </Hsection>

          <Hsection n="willow25_wgps_general" title="General Parameters">
            <P>
              The <Rs n="ReadCapability" /> are the <Rs n="Capability" />{" "}
              — as instantiated above — with a <R n="cap_mode" /> of{" "}
              <R n="access_read" />. Consequently, the type{" "}
              <R n="sync_receiver" /> is <R n="Ed25519Pk" />. The type{" "}
              <R n="EnumerationCapability" /> is the type of{" "}
              <Rs n="McEnumerationCapability" />{" "}
              for our instantiation of Meadowcap.
            </P>

            <P>
              The <R n="interest_hash_length" /> is 32. The <R n="sync_h" />
              {" "}
              function operates by applying <R n="william3" />{" "}
              to the concatenation of the following bytes:
            </P>

            <Encoding
              standalone
              idPrefix="willow25_enc_sync_h"
              bitfields={[
                bitfieldIff(
                  <>
                    the <R n="pi_ss" /> of the <R n="PrivateInterest" /> is{" "}
                    <R n="ss_any" />
                  </>,
                ),
                bitfieldConstant([0, 0, 0, 0, 0, 0, 0]),
              ]}
              contents={[
                <RawBytes>
                  the salt
                </RawBytes>,
                <RawBytes>
                  the <R n="pi_ns" /> of the <R n="PrivateInterest" />
                </RawBytes>,
                <EncConditional
                  condition={
                    <>
                      the <R n="pi_ss" /> of the <R n="PrivateInterest" /> is
                      {" "}
                      <R n="ss_any" />
                    </>
                  }
                >
                  <RawBytes>
                    the <R n="pi_ss" /> of the <R n="PrivateInterest" />
                  </RawBytes>
                </EncConditional>,
                <CodeFor isFunction enc="encode_path">
                  <R n="pi_path" /> of the <R n="PrivateInterest" />
                </CodeFor>,
              ]}
            />
          </Hsection>

          <PreviewScope>
            <P>
              For set reconciliation, the{" "}
              <R n="hash_lengthy_authorised_entries" />{" "}
              function is defined as follows:
            </P>

            <Ul>
              <Li>
                <R n="hash_lengthy_authorised_entries" />{" "}
                maps the empty set to the 32 byte array of all zeros.
              </Li>
              <Li>
                <R n="hash_lengthy_authorised_entries" />{" "}
                maps sets containing exactly one{" "}
                <R n="LengthyAuthorisedEntry" />{" "}
                <DefValue n="hlae_e" r="entry" /> to the{" "}
                <R n="william3" />digest of the concatenation of<Br />
                <Br />
                <Encoding
                  standalone
                  idPrefix="willow25_enc_hash_lengthy_authorised_entries"
                  bitfields={[]}
                  contents={[
                    <>
                      <AccessStruct field="lengthy_entry_available">
                        <R n="hlae_e" />
                      </AccessStruct>{" "}
                      as a big-endian unsigned 8 byte integer.
                    </>,
                    <CodeFor isFunction enc="encode_mc_capability">
                      <R n="AuthorisationToken" /> of the{" "}
                      <AccessStruct field="lengthy_entry_entry">
                        <R n="hlae_e" />
                      </AccessStruct>
                    </CodeFor>,
                    <CodeFor isFunction enc="encode_entry">
                      <R n="Entry" /> of the{" "}
                      <AccessStruct field="lengthy_entry_entry">
                        <R n="hlae_e" />
                      </AccessStruct>
                    </CodeFor>,
                  ]}
                />
                <Br />
              </Li>
              <Li>
                <R n="hash_lengthy_authorised_entries" />{" "}
                hashes sets of multiple <Rs n="LengthyAuthorisedEntry" />{" "}
                by first hashing each singleton set as described above, and then
                adding the hashes modulo{" "}
                <M>
                  256^<Curly>32</Curly>
                </M>{" "}
                (i.e., discarding all overflows).
              </Li>
            </Ul>
          </PreviewScope>

          <P>
            The <R n="transform_payload" /> function maps each <R n="Payload" />
            {" "}
            to the corresponding Bab{" "}
            <AE href="https://worm-blossom.github.io/bab/#light">
              light verifiable stream
            </AE>{" "}
            without the leading length indicator.
          </P>

          <P>
            The <R n="sync_default_namespace_id" /> is{" "}
            <Sidenote
              note={
                <>
                  This is an <R n="Ed25519Pk" />{" "}
                  that we generated randomly, the corresponding secret key is
                  {" "}
                  <Alj inline>TODO</Alj>.<Alj inline>
                    TODO ensure this is a communal namespace.
                  </Alj>
                </>
              }
            >
              <Alj inline>TODO</Alj>
            </Sidenote>. The <R n="sync_default_subspace_id" /> is equal to the
            {" "}
            <R n="sync_default_namespace_id" />.
          </P>

          <P>
            The <R n="sync_default_payload_digest" /> is{" "}
            <Sidenote
              note={
                <>
                  This is the <R n="william3" /> digest of the empty string.
                </>
              }
            >
              <Alj inline>TODO</Alj>
            </Sidenote>.
          </P>

          <P>
            The <R n="sync_default_authorisation_token" /> is the{" "}
            <R n="MeadowcapAuthorisationToken" /> whose <R n="mcat_cap" />{" "}
            is the <R n="CommunalCapability" /> with an
          </P>
          <Ul>
            <Li>
              <R n="communal_cap_access_mode" /> of <R n="access_write" />,
            </Li>
            <Li>
              <R n="communal_cap_namespace" /> of{" "}
              <R n="sync_default_namespace_id" />,
            </Li>
            <Li>
              <R n="communal_cap_user" /> of{" "}
              <R n="sync_default_subspace_id" />, and
            </Li>
            <Li>
              empty <R n="communal_cap_delegations" />,
            </Li>
          </Ul>
          <P>
            and whose <R n="mcat_sig" /> is <Alj inline>TODO</Alj>.
          </P>
        </Hsection>

        <Hsection n="willow25_wgps_encoding" title="Encoding Parameters">
          <P>
            The <R n="EncodeReadCapability" /> <R n="encoding_relation" /> is
            {" "}
            <R n="EncodeMcCapabilityRelativePrivateInterest" />.
          </P>

          <P>
            The <R n="EncodeEnumerationCapability" />{" "}
            <R n="encoding_relation" /> is{" "}
            <R n="EncodeMcEnumerationCapabilityRelativePrivateInterest" />.
          </P>

          <P>
            The <R n="encoding_function" /> for <R n="SubspaceId" /> is — like
            {" "}
            <R n="encode_user_pk" /> — the identity function. The total order on
            {" "}
            <R n="SubspaceId" /> is the numeric order on <R n="Ed25519Pk" />
            {" "}
            (interpreted as big-endian, unsigned integers).
          </P>

          <P>
            The <R n="EncodeFingerprint" /> <R n="encoding_relation" />{" "}
            is the identity function (<R n="william3" /> digests <Em>are</Em>
            {" "}
            bytestrings already).
          </P>

          <P>
            The <R n="EncodeAuthorisationToken" /> <R n="encoding_relation" />
            {" "}
            is <R n="EncodeMeadowcapAuthorisationTokenRelative" />.
          </P>
        </Hsection>

        {
          /*

				hsection("es6_wgps_encoding", "Encoding Parameters", [
					pinformative("Whenever any encoding function needs to encode a ", r("cinn25519"), "public key, use ", r("encode_cinn_pk"), ". Whenever any encoding function needs to encode a signature or a digest, just use the signature or the digest itself (they already are sequences of bytes)."),

					pinformative(
						"The ", r("encode_group_member"), " function encodes each ", r("PsiGroup"), " member (i.e., each Edwards25519 curve point) ", link("according to RFC8032", "https://datatracker.ietf.org/doc/html/rfc8032#section-5.1.2"), "."
					),

					pinformative(
						"The ", r("encode_subspace_capability"), " function is ", r("encode_mc_subspace_capability"), ", except you omit encoding the <R n="enumcap_namespace"/>."
					),

					pinformative(
						"The ", r("encode_sync_subspace_signature"), " function maps each ", r("sync_subspace_signature"), " (i.e., each ed25519 signature, which is already a sequence of bytes) to itself."
					),

					pinformative(
						"The ", r("encode_read_capability"), " function is ", r("encode_mc_capability"), ", except you omit encoding the ", r("communal_cap_namespace"), "."
					),

					pinformative(
						"The ", r("encode_sync_signature"), " function maps each <R n="sync_signature"/> (i.e., each ed25519 signature, which is already a sequence of bytes) to itself."
					),

					pinformative(
						"The total order on <R n="SubspaceId"/> (i.e., on <R n="Ed25519Pk"/>) orders by ", r("cinn_shortname"), " first (lexicographically), and by ", r("cinn_pk_pk"), " second (again lexicographically). This ordering fulfils the necessary properties, and <R n="sync_default_subspace_id"/> is indeed the unique least element.",
					),

					pinformative(
						"The ", r("encode_static_token"), " function is ", r("encode_mc_capability"), ", encoding relative to the ", r("full_area"), "."
					),

					pinformative(
						"The ", r("encode_dynamic_token"), " function maps each <R n="DynamicToken"/> (i.e., each ed25519 signature, which is already a sequence of bytes) to itself."
					),

					pinformative(
						"The ", r("encode_fingerprint"), " function maps each <R n="Fingerprint"/> (which is already a sequence of bytes) to itself."
					),
				]),

			hsection("es6_friendly_paths", "Friendly paths", [
				pinformative("While Willow's <Rs n="Path"/> are defined as sequences of bytestrings, Earthstar defines a subset of these as human-readable ", def({
					id: "es6_friendly_path",
					singular: "friendly path",
					plural: "friendly paths",
				}, "friendly paths"), "."),
				pinformative("A path is considered ", r("es6_friendly_path", 'friendly'), " if every byte of its bytestrings belong to the set of ascii encodings of the following characters: ", code("-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_"), ", that is, alphanumerics and ", code("-"), ", ", code("."), ", and ", code("_"), "."),
				pinformative("This makes it possible to provide legible encodings of paths, e.g. ", path('blog', 'recipes', 'chocolate_pizza'), ", and to input paths using a keyboard.")
			]),

			img(asset("earthstar/emblem.png"), `An Earthstar emblem: A stylised drawing of three Earthstars (a type of mushroom) sitting on a mossy knoll, with a silhoette of a rabbit in the background, all next to a hand-lettered cursive of the word "Meadowcap".`),
	 */
        }

        <Img
          src={<ResolveAsset asset={["willow_25", "emblem.png"]} />}
          alt={`A Willow'25 emblem: A drawing of a simplified Willow emblem next to a large, red, '25.`}
        />
      </PageTemplate>
    </File>
  </Dir>
);
