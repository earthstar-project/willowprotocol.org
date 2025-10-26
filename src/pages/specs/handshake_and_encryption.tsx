import { Dir, File } from "macromania-outfs";
import {
  AE,
  Alj,
  AsideBlock,
  Curly,
  Gwil,
  NoWrap,
  Path,
  Purple,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import {
  A,
  Blockquote,
  Br,
  Code,
  Details,
  Div,
  Em,
  Figcaption,
  Figure,
  Hr,
  Img,
  Li,
  Ol,
  P,
  Style,
  Summary,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
  Ul,
} from "macromania-html";
import { Bib } from "macromania-bib";
import { Marginale, Sidenote, Sidenotes } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  ChoiceType,
  DefFunction,
  DefType,
  DefValue,
  SliceType,
  StructDef,
  Tuple,
  TupleType,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { Expression, Expressions } from "macromaniajsx/jsx-dev-runtime";
import { CodeFor, Encoding } from "../../encoding_macros.tsx";
import { ResolveAsset } from "macromania-assets";
import { ArrayType } from "macromania-rustic";
import { ArrayLiteral } from "macromania-rustic";

export const handshake_and_encryption = (
  <Dir name="handshake_and_encryption">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Handshake and Encryption Scheme"
        headingId="handshake_and_encryption"
        heading={"A Recommended Handshake and Encryption Scheme"}
        toc
        bibliography
        parentId="specifications"
      >
        <P>
          The specification of{" "}
          <R n="private_interest_overlap">private interest overlap detection</R>
          {" "}
          mandates using a handshake and subsequent encryption with{" "}
          <R n="sync_confidentiality_details">certain properties</R>. In this
          document, we provide specific constructions for achieving the required
          properties.
        </P>

        <Hsection n="spec_handshake" title="Handshake">
          <P>
            The handshake we describe here is essentially the{" "}
            <AE href="https://noiseprotocol.org/noise.html#interactive-handshake-patterns-fundamental">
              <Code>XX</Code>
            </AE>{" "}
            handshake of the{" "}
            <Sidenote
              note={
                <>
                  Specifically,{" "}
                  <A
                    href={
                      <ResolveAsset
                        asset={[
                          "handshake_and_encryption",
                          "noise_revision_34.pdf",
                        ]}
                      />
                    }
                  >
                    revision 34
                  </A>.
                </>
              }
            >
              <AE href="https://noiseprotocol.org/noise.html">
                noise protocol framework
              </AE>
            </Sidenote>, with a few modifications:
          </P>

          <Ul>
            <Li>
              Noise only supports a limited set of cryptographic primitives,
              whereas we — analogous to all the other Willow specs — allow for
              arbitrary parameters.
            </Li>
            <Li>
              We use tweaked{" "}
              <AE href="https://noiseprotocol.org/noise.html#protocol-names-and-modifiers">
                protocol names
              </AE>{" "}
              (which determine the initialisation of the Noise <Code>h</Code>
              {" "}
              variable): the names start with <Code>Nose</Code> intead of{" "}
              <Code>Noise</Code>.
            </Li>
            <Li>
              The <Code>h</Code>{" "}
              variables of the peers are always initialised to the hash of the
              protocol name, instead of zero-padding sufficiently short names.
            </Li>
            <Li>
              The{" "}
              <AE href="https://noiseprotocol.org/noise.html#cryptographic-algorithm-name-sections">
                algorithm names
              </AE>{" "}
              may also be non-standard, due to our greater flexibility in
              parameter selection.
            </Li>
            <Li>
              Our handshake has no notion of payloads. Unmodified Noise would
              force us to encrypt and authenticate the empty string as part of
              each message, adding an overhead of 16 bytes per message. We
              completely remove the notion instead.
            </Li>
          </Ul>

          <P>
            We give a self-contained specification next, defining precisely the
            possible parameters and omitting all details of the noise framework
            but those relevant for the XX handshake pattern.
          </P>

          <Hsection n="handshake_parameters" title="Parameters">
            <PreviewScope>
              <P>
                <Marginale>
                  Noise allows for{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-25519-dh-functions">
                    Curve25519
                  </AE>{" "}
                  and{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-448-dh-functions">
                    Curve448
                  </AE>{" "}
                  here.
                </Marginale>
                The parameters for the{" "}
                <AE href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange">
                  Diffie-Hellman part
                </AE>{" "}
                of the handshake are types{" "}
                <DefType n="hs_pk" r="PublicKey" rs="PublicKeys" /> and{" "}
                <DefType n="hs_sk" r="SecretKey" rs="SecretKeys" />, a function
                {" "}
                <DefFunction n="hs_corresponding" r="corresponding" /> from{" "}
                <R n="hs_sk" /> to <R n="hs_pk" />, and a function{" "}
                <Code>
                  <DefFunction n="hs_dh" r="dh" />(<R n="hs_sk" />,{" "}
                  <R n="hs_pk" />) {"->"} <R n="hs_pk" />
                </Code>{" "}
                such that for any two <Rs n="hs_sk" />{" "}
                <DefValue n="hs_dh_sk1" r="sk1" /> and{" "}
                <DefValue n="hs_dh_sk2" r="sk2" />, we have that{" "}
                <Code>
                  <R n="hs_dh" />(<R n="hs_dh_sk1" />,{" "}
                  <R n="hs_corresponding" />(<R n="hs_dh_sk2" />)) =={" "}
                  <R n="hs_dh" />(<R n="hs_dh_sk2" />,{" "}
                  <R n="hs_corresponding" />(<R n="hs_dh_sk1" />))
                </Code>. We further require an <R n="encoding_function" />{" "}
                <DefFunction n="hs_encode_pk" r="encode_pk" /> for{" "}
                <R n="hs_pk" />, and we denote the inverse as{" "}
                <DefFunction n="hs_decode_pk" r="decode_pk" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                <Marginale>
                  Noise allows for{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-chachapoly-cipher-functions">
                    ChaChaPoly
                  </AE>{" "}
                  and{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-aesgcm-cipher-functions">
                    AES256 with GCM
                  </AE>{" "}
                  here.
                </Marginale>
                The parameters for the{" "}
                <AE href="https://en.wikipedia.org/wiki/Authenticated_encryption#Authenticated_encryption_with_associated_data">
                  AEAD part
                </AE>{" "}
                are a type{" "}
                <DefType n="hs_aeadk" r="AEADKey" rs="AEADKeys" />, a natural
                number{" "}
                <DefValue
                  n="hs_nl"
                  r="nonce_length"
                  rs="nonce_lengths"
                  math={"nonce\\_length"}
                />{" "}
                — we write <DefType n="hs_nonce" r="Nonce" rs="Nonces" />{" "}
                for the type of natural numbers between <M>0</M> and{" "}
                <M>
                  2^<Curly>
                    <R n="hs_nl" /> - 1
                  </Curly>
                </M>{" "}
                (both inclusive), and a two functions
              </P>
              <Ul>
                <Li>
                  <Code>
                    <DefFunction n="hs_encrypt" r="encrypt" />(pk:{" "}
                    <R n="hs_aeadk" />, nonce: <R n="hs_nonce" />, ad:{" "}
                    <SliceType>
                      <R n="U8" />
                    </SliceType>, plaintext:{" "}
                    <SliceType>
                      <R n="U8" />
                    </SliceType>) {"->"}{" "}
                    <SliceType>
                      <R n="U8" />
                    </SliceType>
                  </Code>, and
                </Li>
                <Li>
                  <Marginale>
                    We do not reflect this on the type level to keep things
                    simple, but <R n="hs_decrypt" />{" "}
                    also needs a way of signalling decryption failures. Any
                    decryption failure immediately aborts the connection.
                  </Marginale>
                  <Code>
                    <DefFunction n="hs_decrypt" r="decrypt" />(pk:{" "}
                    <R n="hs_aeadk" />, nonce: <R n="hs_nonce" />, ad:{" "}
                    <SliceType>
                      <R n="U8" />
                    </SliceType>, cyphertext:{" "}
                    <SliceType>
                      <R n="U8" />
                    </SliceType>) {"->"}{" "}
                    <SliceType>
                      <R n="U8" />
                    </SliceType>
                  </Code>,
                </Li>
              </Ul>
              <P>
                such that using the output of <R n="hs_encrypt" />{" "}
                as the final argument for <R n="hs_decrypt" />{" "}
                yields the original <Code>plaintext</Code>{" "}
                (for arbitrary but equal other arguments).
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                <Marginale>
                  Noise allows for{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-sha256-hash-function">
                    SHA256
                  </AE>,{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-sha512-hash-function">
                    SHA512
                  </AE>,{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-blake2s-hash-function">
                    Blake2s
                  </AE>{" "}
                  and{" "}
                  <AE href="https://noiseprotocol.org/noise.html#the-blake2b-hash-function">
                    Blake2b
                  </AE>{" "}
                  here.
                </Marginale>
                The parameters for hashing during the handshake are a natural
                number <DefValue n="hs_hashlen" r="hashlen" />{" "}
                (must be 32 or greater), a hash function{" "}
                <Code>
                  <DefFunction n="hs_hash" r="hash" />(<SliceType>
                    <R n="U8" />
                  </SliceType>) {"->"}{" "}
                  <ArrayType count={<R n="hs_hashlen" />}>
                    <R n="U8" />
                  </ArrayType>
                </Code>, and a natural number{" "}
                <DefValue n="hs_blocklen" r="blocklen" /> to serve as the{" "}
                <Code>B</Code> parameter of{" "}
                <AE href="https://www.ietf.org/rfc/rfc2104.txt">HMAC</AE>{" "}
                (i.e., it should be the block length of <R n="hs_hash" />{" "}
                in bytes). We further require a{" "}
                <Sidenote
                  note={
                    <>
                      In Noise, this corresponds to truncating a hash and using
                      the result as an encryption key.
                    </>
                  }
                >
                  function
                </Sidenote>{" "}
                <DefFunction n="hs_digest_to_aeadkey" r="digest_to_aeadkey" />
                {" "}
                from{" "}
                <Code>
                  <ArrayType count={<R n="hs_hashlen" />}>
                    <R n="U8" />
                  </ArrayType>
                </Code>{" "}
                to <R n="hs_aeadk" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The parameters for state initialisation are an arbitrary
                bytestring{" "}
                <Sidenote
                  note={
                    <>
                      The prologue data is hashed into the initial states of the
                      peers, handshakes between two peers with non-equal
                      prologues will fail. We recommend using 16 zero-bytes as
                      the prologue if you want to interact with as many peers as
                      possible, and to otherwise use a (pseudo-) random 16 byte
                      number for creating a fully independent universe of
                      syncing.
                    </>
                  }
                >
                  <DefValue n="hs_prologue" r="prologue" />
                </Sidenote>, and an ASCII{" "}
                <DefValue n="hs_protocol_name" r="protocol_name" /> of the form
                {" "}
                <Code>
                  Nose_XX_<Curly>dh</Curly>_<Curly>aead</Curly>_<Curly>
                    hash
                  </Curly>
                </Code>{" "}
                (note the deliberate lack of an <Code>i</Code>{" "}
                in the first part), where{" "}
                <Code>
                  <Curly>dh</Curly>
                </Code>{" "}
                is an{" "}
                <AE href="https://noiseprotocol.org/noise.html#cryptographic-algorithm-name-sections">
                  algorithm name
                </AE>{" "}
                for the Diffie Hellman parameters,{" "}
                <Code>
                  <Curly>aead</Curly>
                </Code>{" "}
                is an algorithm name for the AEAD parameters, and{" "}
                <Code>
                  <Curly>hash</Curly>
                </Code>{" "}
                is an algorithm name for the hashing parameters. When using
                parameters supported by Noise, you should use the same names as
                Noise does. An example name would be{" "}
                <Code>Nose_XX_ED25519_ChaChaPoly_WILLIAM3</Code>.
              </P>
            </PreviewScope>
          </Hsection>

          <Hsection n="handshake_handshake" title="Handshake Definition">
            <PreviewScope>
              <P>
                We now describe the data that the two peers exchange, and the
                local state they need to track in order to perform the necessary
                computations. We call the peer that sends the first message the
                {" "}
                <Def n="hs_initiator" r="initiator" rs="initiators" />, and the
                other peer the{" "}
                <Def n="hs_responder" r="responder" rs="responders" />.
              </P>
            </PreviewScope>

            <P>
              <Marginale>
                A helpful resource that can serve as a middle ground between our
                presentation and the Noise spec is{" "}
                <AE href="https://noiseexplorer.com/patterns/XX/">
                  Noise Explorer
                </AE>, which essentially projects the Noise spec down to a
                single handshake.
              </Marginale>
              The presentation is in a deliberately different style than the
              Noise spec: minimal abstractions, sequential reading, a birds-eye
              view of both peers. The variable names are derived from those of
              the Noise spec, with <Code>ini</Code> or <Code>res</Code> prefixes
              {" "}
              to indicate variables maintained by the <R n="hs_initiator" />
              {" "}
              or the <R n="hs_responder" /> respectively, and with{" "}
              <Code>pk</Code> and <Code>sk</Code>{" "}
              suffixes to indicate public keys and secret keys respectively.
            </P>

            <PreviewScope>
              <P>
                We denote by{" "}
                <Code>
                  <DefFunction n="hs_hkdf" r="hkdf" />(chaining_key:{" "}
                  <ArrayType count={<R n="hs_hashlen" />}>
                    <R n="U8" />
                  </ArrayType>, input_key_material:{" "}
                  <SliceType>
                    <R n="U8" />
                  </SliceType>):{" "}
                  <TupleType
                    types={[
                      <ArrayType count={<R n="hs_hashlen" />}>
                        <R n="U8" />
                      </ArrayType>,
                      <ArrayType count={<R n="hs_hashlen" />}>
                        <R n="U8" />
                      </ArrayType>,
                    ]}
                  />
                </Code>{" "}
                the function that produces two OKMs with the <Code>HKDF</Code>
                {" "}
                (<AE href="https://www.ietf.org/rfc/rfc5869.txt">RFC 5869</AE>)
                function, using <R n="hs_hash" /> as the{" "}
                <Code>HMAC-Hash</Code>. This corresponds directly to the{" "}
                <Code>HKDF</Code> function of the{" "}
                <AE href="https://noiseprotocol.org/noise.html#hash-functions">
                  Noise spec
                </AE>, with <Code>num_outputs</Code> set to two.
              </P>
            </PreviewScope>

            <Div id="handshake_container" clazz="wide">
              <HandshakeHeader>Setup</HandshakeHeader>

              <RowGroup
                title="init keys"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_esk" /> (type{" "}
                        <R n="hs_sk" />) to a random <R n="hs_sk" />.
                      </>
                    }
                    right={
                      <>
                        Initialise <DefValue n="res_esk" /> (type{" "}
                        <R n="hs_sk" />) to a random <R n="hs_sk" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_epk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_corresponding" />(<R n="ini_esk" />)
                        </Code>.
                      </>
                    }
                    right={
                      <>
                        Initialise <DefValue n="res_epk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_corresponding" />(<R n="res_esk" />)
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_ssk" /> (type{" "}
                        <R n="hs_sk" />) to an arbitrary <R n="hs_sk" />.
                      </>
                    }
                    right={
                      <>
                        Initialise <DefValue n="res_ssk" /> (type{" "}
                        <R n="hs_sk" />) to an arbitrary <R n="hs_sk" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_spk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_corresponding" />(<R n="ini_ssk" />)
                        </Code>.
                      </>
                    }
                    right={
                      <>
                        Initialise <DefValue n="res_spk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_corresponding" />(<R n="res_ssk" />)
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="init state"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_h" /> (type{" "}
                        <ArrayType count={<R n="hs_hashlen" />}>
                          <R n="U8" />
                        </ArrayType>) to to{" "}
                        <Code>
                          <R n="hs_hash" />(<R n="hs_protocol_name" />)
                        </Code>.
                      </>
                    }
                    right={
                      <>
                        Initialise <DefValue n="res_h" /> (type{" "}
                        <ArrayType count={<R n="hs_hashlen" />}>
                          <R n="U8" />
                        </ArrayType>) to to{" "}
                        <Code>
                          <R n="hs_hash" />(<R n="hs_protocol_name" />)
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_ck" /> (type{" "}
                        <ArrayType count={<R n="hs_hashlen" />}>
                          <R n="U8" />
                        </ArrayType>) to <R n="ini_h" />.
                      </>
                    }
                    right={
                      <>
                        Initialise <DefValue n="res_ck" /> (type{" "}
                        <ArrayType count={<R n="hs_hashlen" />}>
                          <R n="U8" />
                        </ArrayType>) to <R n="res_h" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="ini_h" />,{" "}
                          <R n="hs_prologue" />))
                        </Code>.
                      </>
                    }
                    right={
                      <>
                        Set <R n="res_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="res_h" />,{" "}
                          <R n="hs_prologue" />))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <HandshakeHeader>
                e →
              </HandshakeHeader>

              <RowGroup
                title="e"
                who="left"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Send{" "}
                        <Code>
                          <R n="hs_encode_pk" />(<R n="ini_epk" />)
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="ini_h" />,{" "}
                          <R n="hs_encode_pk" />(<R n="ini_epk" />)))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="e"
                who="right"
                rows={[
                  <HandshakeRow
                    right={
                      <>
                        Receive the encoded <R n="ini_epk" />, call the encoding
                        {" "}
                        <DefValue n="msg1_e" r="e" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Initialise <DefValue n="res_repk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_decode_pk" />(<R n="msg1_e" />)
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="res_h" />,{" "}
                          <R n="msg1_e" />))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <HandshakeHeader>
                ← e, ee, s, es
              </HandshakeHeader>

              <RowGroup
                who="right"
                title="e"
                rows={[
                  <HandshakeRow
                    right={
                      <>
                        Send{" "}
                        <Code>
                          <R n="hs_encode_pk" />(<R n="res_epk" />)
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="res_h" />,{" "}
                          <R n="hs_encode_pk" />(<R n="res_epk" />)))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="ee"
                who="right"
                rows={[
                  <HandshakeRow
                    right={
                      <>
                        Let{" "}
                        <Code>
                          <Tuple
                            fields={[
                              <DefValue n="tmp_ck1" r="tmp_ck" />,
                              <DefValue n="tmp_k1" r="tmp_k" />,
                            ]}
                          />{" "}
                          = <R n="hs_hkdf" />(<R n="res_ck" />,{" "}
                          <R n="hs_dh" />(<R n="res_esk" />,{" "}
                          <R n="res_repk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_ck" /> to <R n="tmp_ck1" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Initialise <DefValue n="res_k" /> (type{" "}
                        <R n="hs_aeadk" />) to{" "}
                        <Code>
                          <R n="hs_digest_to_aeadkey" />(<R n="tmp_k1" />)
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="s"
                who="right"
                rows={[
                  <HandshakeRow
                    right={
                      <>
                        Let <DefValue n="tmp_cypher1" r="cyphertext1" /> be{" "}
                        <Code>
                          <R n="hs_encrypt" />(<R n="res_k" />, 0,{" "}
                          <R n="res_h" />,{" "}
                          <R n="hs_encode_pk" />(<R n="res_spk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Send <R n="tmp_cypher1" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="res_h" />,{" "}
                          <R n="tmp_cypher1" />))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="es"
                who="right"
                rows={[
                  <HandshakeRow
                    right={
                      <>
                        Let{" "}
                        <Code>
                          <Tuple
                            fields={[
                              <DefValue n="tmp_ck2" r="tmp_ck" />,
                              <DefValue n="tmp_k2" r="tmp_k" />,
                            ]}
                          />{" "}
                          = <R n="hs_hkdf" />(<R n="res_ck" />,{" "}
                          <R n="hs_dh" />(<R n="res_ssk" />,{" "}
                          <R n="res_repk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_ck" /> to <R n="tmp_ck2" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_k" /> to{" "}
                        <Code>
                          <R n="hs_digest_to_aeadkey" />(<R n="tmp_k2" />)
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="e"
                who="left"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Receive the encoded <R n="res_epk" />, call the encoding
                        {" "}
                        <DefValue n="msg2_e" r="e" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_repk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_decode_pk" />(<R n="msg2_e" />)
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="ini_h" />,{" "}
                          <R n="msg2_e" />))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="ee"
                who="left"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Let{" "}
                        <Code>
                          <Tuple
                            fields={[
                              <DefValue n="tmp_ck3" r="tmp_ck" />,
                              <DefValue n="tmp_k3" r="tmp_k" />,
                            ]}
                          />{" "}
                          = <R n="hs_hkdf" />(<R n="ini_ck" />,{" "}
                          <R n="hs_dh" />(<R n="ini_esk" />,{" "}
                          <R n="ini_repk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_ck" /> to <R n="tmp_ck3" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_k" /> (type{" "}
                        <R n="hs_aeadk" />) to{" "}
                        <Code>
                          <R n="hs_digest_to_aeadkey" />(<R n="tmp_k3" />)
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="s"
                who="left"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Receive <R n="tmp_cypher1" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Initialise <DefValue n="ini_rspk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_decode_pk" />(<R n="hs_decrypt" />(<R n="ini_k" />,
                          0, <R n="ini_h" />, <R n="tmp_cypher1" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="ini_h" />,{" "}
                          <R n="tmp_cypher1" />))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="es"
                who="left"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Let{" "}
                        <Code>
                          <Tuple
                            fields={[
                              <DefValue n="tmp_ck4" r="tmp_ck" />,
                              <DefValue n="tmp_k4" r="tmp_k" />,
                            ]}
                          />{" "}
                          = <R n="hs_hkdf" />(<R n="ini_ck" />,{" "}
                          <R n="hs_dh" />(<R n="ini_esk" />,{" "}
                          <R n="ini_rspk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_ck" /> to <R n="tmp_ck4" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_k" /> to{" "}
                        <Code>
                          <R n="hs_digest_to_aeadkey" />(<R n="tmp_k4" />)
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <HandshakeHeader>
                s, se →
              </HandshakeHeader>

              <RowGroup
                title="s"
                who="left"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Let <DefValue n="tmp_cypher2" r="cyphertext2" /> be{" "}
                        <Code>
                          <R n="hs_encrypt" />(<R n="ini_k" />, 0,{" "}
                          <R n="ini_h" />,{" "}
                          <R n="hs_encode_pk" />(<R n="ini_spk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Send <R n="tmp_cypher2" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="ini_h" />,{" "}
                          <R n="tmp_cypher2" />))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="se"
                who="left"
                rows={[
                  <HandshakeRow
                    left={
                      <>
                        Let{" "}
                        <Code>
                          <Tuple
                            fields={[
                              <DefValue n="tmp_ck5" r="tmp_ck" />,
                              <DefValue n="tmp_k5" r="tmp_k" />,
                            ]}
                          />{" "}
                          = <R n="hs_hkdf" />(<R n="ini_ck" />,{" "}
                          <R n="hs_dh" />(<R n="ini_ssk" />,{" "}
                          <R n="ini_repk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_ck" /> to <R n="tmp_ck5" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    left={
                      <>
                        Set <R n="ini_k" /> to{" "}
                        <Code>
                          <R n="hs_digest_to_aeadkey" />(<R n="tmp_k5" />)
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="s"
                who="right"
                rows={[
                  <HandshakeRow
                    right={
                      <>
                        Receive <R n="tmp_cypher2" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Initialise <DefValue n="res_rspk" /> (type{" "}
                        <R n="hs_pk" />) to{" "}
                        <Code>
                          <R n="hs_decode_pk" />(<R n="hs_decrypt" />(<R n="res_k" />,
                          0, <R n="res_h" />, <R n="tmp_cypher2" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_h" /> to{" "}
                        <Code>
                          <R n="hs_hash" />(concat(<R n="res_h" />,{" "}
                          <R n="tmp_cypher2" />))
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <RowGroup
                title="se"
                who="right"
                rows={[
                  <HandshakeRow
                    right={
                      <>
                        Let{" "}
                        <Code>
                          <Tuple
                            fields={[
                              <DefValue n="tmp_ck6" r="tmp_ck" />,
                              <DefValue n="tmp_k6" r="tmp_k" />,
                            ]}
                          />{" "}
                          = <R n="hs_hkdf" />(<R n="res_ck" />,{" "}
                          <R n="hs_dh" />(<R n="res_esk" />,{" "}
                          <R n="res_rspk" />))
                        </Code>.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_ck" /> to <R n="tmp_ck6" />.
                      </>
                    }
                  />,
                  <HandshakeRow
                    right={
                      <>
                        Set <R n="res_k" /> to{" "}
                        <Code>
                          <R n="hs_digest_to_aeadkey" />(<R n="tmp_k6" />)
                        </Code>.
                      </>
                    }
                  />,
                ]}
              />

              <HandshakeHeader>Secret Derivation</HandshakeHeader>
              <HandshakeRow
                left={
                  <>
                    Let <DefValue n="zerolen_left" r="zerolen" />{" "}
                    denote the byte string of length zero.
                  </>
                }
                right={
                  <>
                    Let <DefValue n="zerolen_right" r="zerolen" />{" "}
                    denote the byte string of length zero.
                  </>
                }
              />
              <HandshakeRow
                left={
                  <>
                    Let{" "}
                    <Code>
                      <Tuple
                        fields={[
                          <DefValue n="tmp_k8" r="ini_tmp_k1" />,
                          <DefValue n="tmp_k9" r="ini_tmp_k2" />,
                        ]}
                      />{" "}
                      = <R n="hs_hkdf" />(<R n="ini_ck" />,{" "}
                      <R n="zerolen_left" />)
                    </Code>.
                  </>
                }
                right={
                  <>
                    Let{" "}
                    <Code>
                      <Tuple
                        fields={[
                          <DefValue n="tmp_k10" r="res_tmp_k1" />,
                          <DefValue n="tmp_k11" r="res_tmp_k2" />,
                        ]}
                      />{" "}
                      = <R n="hs_hkdf" />(<R n="res_ck" />,{" "}
                      <R n="zerolen_right" />)
                    </Code>.
                  </>
                }
              />
              <HandshakeRow
                left={
                  <>
                    Initialise <DefValue n="ini_aeadk1" /> (type{" "}
                    <R n="hs_aeadk" />) to{" "}
                    <Code>
                      <R n="hs_digest_to_aeadkey" />(<R n="tmp_k8" />)
                    </Code>.
                  </>
                }
                right={
                  <>
                    Initialise <DefValue n="res_aeadk1" /> (type{" "}
                    <R n="hs_aeadk" />) to{" "}
                    <Code>
                      <R n="hs_digest_to_aeadkey" />(<R n="tmp_k10" />)
                    </Code>.
                  </>
                }
              />
              <HandshakeRow
                left={
                  <>
                    Initialise <DefValue n="ini_aeadk2" /> (type{" "}
                    <R n="hs_aeadk" />) to{" "}
                    <Code>
                      <R n="hs_digest_to_aeadkey" />(<R n="tmp_k9" />)
                    </Code>.
                  </>
                }
                right={
                  <>
                    Initialise <DefValue n="res_aeadk2" /> (type{" "}
                    <R n="hs_aeadk" />) to{" "}
                    <Code>
                      <R n="hs_digest_to_aeadkey" />(<R n="tmp_k11" />)
                    </Code>.
                  </>
                }
              />
            </Div>
          </Hsection>

          <P>
            By the end of this handshake, it holds that{" "}
            <Code>
              <R n="ini_aeadk1" /> == <R n="res_aeadk1" />
            </Code>,{" "}
            <Code>
              <R n="ini_aeadk2" /> == <R n="res_aeadk2" />
            </Code>, and{" "}
            <Code>
              <R n="ini_h" /> == <R n="res_h" />
            </Code>.
          </P>

          <P>
            In the context of{" "}
            <R n="private_interest_overlap">
              private interest overlap detection
            </R>, <R n="ini_h" /> and <R n="res_h" />{" "}
            serve as the shared, random bytestring{" "}
            <R n="pio_rnd" />. The public keys for which the{" "}
            <R n="pio_initiator" /> proves ownership (<R n="ini_pk" /> in the
            {" "}
            <R n="private_interest_overlap">PIO spec</R>) is{" "}
            <R n="ini_spk" />. The public keys for which the{" "}
            <R n="pio_responder" /> proves ownership (<R n="res_pk" /> in the
            {" "}
            <R n="private_interest_overlap">PIO spec</R>) is <R n="res_spk" />.
          </P>

          <P>
            Subsequent encryption is performed as described in the next section,
            with <R n="ini_aeadk1" /> and <R n="ini_aeadk2" />{" "}
            (which are equal to <R n="res_aeadk1" /> and <R n="res_aeadk2" />
            {" "}
            respectively) serving as the shared secrets for symmetric
            encryption.
          </P>
        </Hsection>

        <Hsection n="transport_encryption" title="Transport Encryption">
          <PreviewScope>
            <P>
              When sending data after the handshake, the data is encrypted with
              {" "}
              <R n="hs_encrypt" />. To this end, each peer needs a{" "}
              <DefValue n="hs_sending_key" r="sending_key" />: for the{" "}
              <R n="hs_initiator" />, it is <R n="ini_aeadk1" />, and for the
              {" "}
              <R n="hs_responder" />, it is{" "}
              <R n="ini_aeadk2" />. Each peer also maintains a 64-bit integer
              {" "}
              <DefValue n="sending_nonce" />, initialised to zero.
            </P>

            <P>
              For decryption (which we do not specify explicitly), the peers
              also require a <DefValue n="receiving_nonce" />{" "}
              (initialised to zero) and a{" "}
              <DefValue n="hs_receiving_key" r="receiving_key" />{" "}
              (<R n="ini_aeadk2" /> for the <R n="hs_initiator" />, and{" "}
              <R n="ini_aeadk1" /> for the <R n="hs_responder" />).
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Marginale>
                This aproach to encryption is a generalisation of Dominic Tarr’s
                {" "}
                <AE href="https://github.com/dominictarr/pull-box-stream">
                  Box Stream
                </AE>, and it is compatible with how Noise specifies{" "}
                <AE href="https://noiseprotocol.org/noise.html#processing-rules">
                  transport message transmission
                </AE>.
              </Marginale>
              After the handshake, data can be sent in chunks of length at least
              one and at most <M>4096</M> (both inclusive). To send a chunk{" "}
              <DefValue n="hs_chunk" /> of length{" "}
              <DefValue n="hs_chunklen" r="len" />, a peer first transmits{" "}
              <Code>
                <R n="hs_encrypt" />(<R n="hs_sending_key" />,{" "}
                <R n="sending_nonce" />, <R n="zerolen_left" />,{" "}
                <R n="be_chunklen" />)
              </Code>, where <DefValue n="be_chunklen" /> is{" "}
              <R n="hs_chunklen" />{" "}
              encoded as a big-endian two-byte integer. Then, the peer
              increments <R n="sending_nonce" />. Then, the peer transmits{" "}
              <Code>
                <R n="hs_encrypt" />(<R n="hs_sending_key" />,{" "}
                <R n="sending_nonce" />, <R n="zerolen_left" />,{" "}
                <R n="hs_chunk" />)
              </Code>, and finally increments <R n="sending_nonce" /> again.
            </P>

            <P>
              If incrementing the <R n="sending_nonce" />{" "}
              would result in an overflow, an error must be emitted instead and
              no further bytes may be sent.
            </P>
          </PreviewScope>

          <P>
            Instead of sending a chunk, a peer can also signal the end of all
            transmissions, by transmitting{" "}
            <Code>
              <R n="hs_encrypt" />(<R n="hs_sending_key" />,{" "}
              <R n="sending_nonce" />, <R n="zerolen_left" />, 0x0000)
            </Code>.
          </P>

          <P>
            This approach to encrypting and sending data authenticates the end
            of the stream, and it makes chunk boundaries less obvious than when
            sending them in plaintext. Note that chunk boundaries are still not
            fully obscured either: for one, physically sending off a chunk leaks
            where it ends; and also, active attackers can induce bitflips and
            then observe where exactly decoding{" "}
            <Sidenote
              note={
                <>
                  For a detailed discussion of the theoretical security notions
                  at play here, see the InterMAC
                  paper<Bib item="boldyreva2012security" />.
                </>
              }
            >
              fails
            </Sidenote>. Paranoid peers that wish to achieve better theoretical
            security guarantees can do so by only using a single chunk length,
            padding shorter chunks if necessary. When using{" "}
            <R n="lcmux" />, you can pad with with <Rs n="SendGlobalFrame" />
            {" "}
            of empty <R n="SendGlobalFrameContent" />, for example.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);

function HandshakeRow(
  { left, right }: { left?: Expressions; right?: Expressions },
): Expression {
  return (
    <Div clazz="hs_row">
      <PreviewScope>
        <P clazz="hs_left">
          <exps x={left} />
        </P>
      </PreviewScope>
      <PreviewScope>
        <P clazz="hs_right">
          <exps x={right} />
        </P>
      </PreviewScope>
    </Div>
  );
}

function RowGroup(
  { title, rows, who }: {
    title?: Expressions;
    rows: Expressions[];
    who?: "left" | "right";
  },
): Expression {
  return (
    <Div clazz={`rowgroup${who ? ` ${who}` : ""}`}>
      <Div clazz={`groupHeader${who === undefined ? "" : ` ${who}`}`}>
        <exps x={title} />
      </Div>
      <exps x={rows.map((row) => <exps x={row} />)} />
    </Div>
  );
}

function HandshakeHeader({ children }: { children?: Expressions }): Expression {
  return (
    <Div clazz="handshake_header">
      <exps x={children} />
    </Div>
  );
}
