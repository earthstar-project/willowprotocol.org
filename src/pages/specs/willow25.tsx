import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path, Quotes } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Br, Code, Em, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rc, Rs } from "macromania-defref";
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
            <R n="meadowcap">Meadowcap capability system</R>,{"  "}
            <R n="willow_confidential_sync" />, and the <R n="drop_format" />.
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
              <Marginale>
                There are some{" "}
                <AE href="https://github.com/earthstar-project/willowprotocol.org/issues/175">
                  nuances
                </AE>{" "}
                around <Quotes>just use ed25519 public keys</Quotes>{" "}
                we have yet to define properly. We will likely go with the most
                strict possible validation rules, as implemented by the Rust
                {" "}
                <AE href="https://github.com/dalek-cryptography/curve25519-dalek/issues/852">
                  <Code>ed25519_dalek::VerifyingKey::verify_strict</Code>
                </AE>{" "}
                function.
              </Marginale>
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

        <Hsection n="willow25_defaults" title="Default Values">
          <P>
            Various specifications expect well-known default choices for some of
            the cryptographic aspects of Willow. We consistently use the
            following values:
          </P>

          <PreviewScope>
            <P>
              The{" "}
              <Def n="willow25_default_namespace_id" r="default_namespace_id" />
              {" "}
              is{" "}
              <Marginale>
                This is an <R n="Ed25519Pk" />{" "}
                we generated randomly, the corresponding secret key is{" "}
                <Code>
                  [94, 20, 172, 228, 210, 200, 2, 143, 200, 154, 143, 4, 118,
                  91, 25, 210, 205, 117, 45, 145, 187, 55, 60, 12, 158, 212,
                  118, 39, 107, 92, 69, 65]
                </Code>.
              </Marginale>
              <Code>
                [147, 78, 96, 33, 51, 158, 31, 1, 59, 169, 73, 0, 237, 194, 93,
                141, 116, 192, 180, 229, 115, 118, 137, 16, 174, 15, 80, 125,
                140, 129, 115, 24]
              </Code>. This is a <R n="communal_namespace" />.
            </P>

            <P>
              The{" "}
              <Def n="willow25_default_subspace_id" r="default_subspace_id" />
              {" "}
              is equal to the <R n="willow25_default_namespace_id" />.
            </P>
          </PreviewScope>

          <P>
            The <R n="sync_default_payload_digest" /> is{" "}
            <Marginale>
              This is the <R n="william3" /> digest of the empty string.
            </Marginale>
            <Code>
              [59, 99, 143, 200, 242, 251, 104, 65, 131, 37, 163, 107, 71, 24,
              255, 176, 125, 228, 87, 172, 48, 19, 147, 168, 69, 70, 106, 121,
              238, 163, 40, 107]
            </Code>.
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
              <R n="willow25_default_namespace_id" />,
            </Li>
            <Li>
              <R n="communal_cap_user" /> of{" "}
              <R n="willow25_default_subspace_id" />, and
            </Li>
            <Li>
              empty <R n="communal_cap_delegations" />,
            </Li>
          </Ul>
          <P>
            and whose <R n="mcat_sig" /> is the correct signature for{" "}
            <Code>
              <R n="default_entry" />(<R n="willow25_default_namespace_id" />,
              {" "}
              <R n="willow25_default_subspace_id" />)
            </Code>.
          </P>
        </Hsection>

        <Hsection n="willow25_drop_format" title="Drop Format Parameters">
          <P>
            <Rb n="willow25" /> instantiates the{" "}
            <R n="willow_drop_format">Willow drop format</R>{" "}
            with the following parameters:
          </P>

          <P>
            The <R n="encode_namespace_id" />{" "}
            function is the identity function (the <Rs n="NamespaceId" />{" "}
            <Em>are</Em> bytestrings already).
          </P>

          <P>
            The <R n="encode_subspace_id" />{" "}
            function is the identity function (the <Rs n="SubspaceId" />{" "}
            <Em>are</Em> bytestrings already).
          </P>

          <P>
            The <R n="encode_payload_digest" />{" "}
            function is the identity function (the <Rs n="PayloadDigest" />{" "}
            <Em>are</Em> bytestrings already).
          </P>

          <P>
            The <R n="DropformatEncodeAuthorisationToken" /> relation is{" "}
            <R n="EncodeMeadowcapAuthorisationTokenRelative" />.
          </P>

          <P>
            The default values are defined in <Rc n="willow25_defaults" />.
          </P>
        </Hsection>

        <Hsection n="willow25_uris" title="URI Parameters">
          <P>
            <Rb n="willow25" /> instantiates the <R n="uris">Willow URI spec</R>
            {" "}
            with the following parameters:
          </P>

          <P>
            The <R n="URIEncodeNamespaceId" /> <R n="encoding_relation" />{" "}
            admits as <Rs n="code" /> of a <R n="NamespaceId" /> (which is a
            {" "}
            <R n="dss_pk" />, i.e., a bytestring) any concatenation of
          </P>
          <Ul>
            <Li>
              the byte <Code>43</Code> (ASCII <Code>+</Code>) if{" "}
              <R n="is_communal" /> maps the <R n="NamespaceId" /> to{" "}
              <Code>true</Code>, or the byte <Code>45</Code> (ASCII{" "}
              <Code>-</Code>) otherwise, and
            </Li>
            <Li>
              a base-16 ASCII encoding of the <R n="NamespaceId" />{" "}
              (lowercase is recommended, but uppercase is also allowed).
            </Li>
          </Ul>

          <P>
            The <R n="URIEncodeSubspaceId" /> <R n="encoding_relation" />{" "}
            admits as <Rs n="code" /> of a <R n="SubspaceId" /> (which is a{" "}
            <R n="dss_pk" />, i.e., a bytestring) any base-16 ASCII encoding of
            the <R n="SubspaceId" />{" "}
            (lowercase is recommended, but uppercase is also allowed).
          </P>

          <P>
            The <R n="URIEncodePayloadDigest" /> <R n="encoding_relation" />
            {" "}
            admits as <Rs n="code" /> of a <R n="PayloadDigest" /> (which is a
            {" "}
            <R n="William3Digest" />, i.e., a bytestring) any base-16 ASCII
            encoding of the <R n="PayloadDigest" />{" "}
            (lowercase is recommended, but uppercase is also allowed).
          </P>
        </Hsection>

        <Hsection
          n="willow25_confidential"
          title="Confidential Sync Parameters"
        >
          <P>
            <Rb n="willow25" /> instantiates <R n="confidential_sync" />{" "}
            with the following parameters:
          </P>

          <Hsection
            n="willow25_cs_handshake"
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

          <Hsection n="willow25_cs_general" title="General Parameters">
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

          <Hsection n="willow25_cs_encoding" title="Encoding Parameters">
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
              <R n="encode_user_pk" />{" "}
              — the identity function. The total order on <R n="SubspaceId" />
              {" "}
              is the numeric order on <R n="Ed25519Pk" />{" "}
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
        </Hsection>

        <Img
          src={<ResolveAsset asset={["willow_25", "emblem.png"]} />}
          alt={`A Willow'25 emblem: A drawing of a simplified Willow emblem next to a large, red, '25.`}
        />
      </PageTemplate>
    </File>
  </Dir>
);
