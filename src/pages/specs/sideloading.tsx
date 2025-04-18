import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, MarginCaption, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Br, Code, Em, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs, Rsb } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  StructDef,
  Tuple,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { DefVariant } from "macromania-rustic";
import {
  bitfieldIff,
  c64Tag,
  CodeFor,
  EncConditional,
  EncIterator,
  Encoding,
} from "../../encoding_macros.tsx";
import { C64Standalone } from "../../encoding_macros.tsx";
import { RawBytes } from "../../encoding_macros.tsx";

export const sideloading = (
  <Dir name="sideloading">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow Sideloading Protocol"
        headingId="sideloading"
        heading={"Willow Sideloading Protocol"}
        toc
        status="proposal"
      >
        <PreviewScope>
          <P>
            <Marginale inlineable>
              <Img
                src={<ResolveAsset asset={["sideload", "sideload_spot.png"]} />}
                alt={`An ornamental drawing of various characters transporting and discovering cardboard boxes. Dalton is looking at a map, unaware of the cardboard boxes behind the bush next to them. Alfie is transporting two cardboard boxes on the back of a bicycle. Betty is preparing to launch a cardboard box with a catapult, and seems rather pleased about it.`}
              />
              <MarginCaption>
                You really <Em>could</Em>{" "}
                transport Willow data using any of the means above.
              </MarginCaption>
            </Marginale>
            The <R n="sync">WGPS</R>{" "}
            presents a way for two peers with an established connection to
            efficiently exchange data. But running the necessary infrastructure
            to establish such connections (e.g. a{" "}
            <AE href="https://en.wikipedia.org/wiki/STUN">STUN server</AE>,{" "}
            <AE href="https://en.wikipedia.org/wiki/Distributed_hash_table">
              distributed hash table
            </AE>, or relay servers) is a non-trivial task, limiting who can
            operate them.
          </P>

          <P>
            The <Def n="sideloading_protocol">Willow Sideloading Protocol</Def>
            {" "}
            presents a way for peers to transmit data to each other
            asynchronously and via completely user-improvised channels.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            Instead of statefully coordinating which data to exchange, the
            Sideloading Protocol uses{" "}
            <Def n="drop" rs="drops">drops</Def>, arbitrary sets of{" "}
            <Rs n="Entry" /> and <Rs n="Payload" />{" "}
            compiled into a single bytestring. A <R n="drop" />{" "}
            can then be treated as a kind of static <R n="store" /> which can be
            {" "}
            <R n="store_join">joined</R> with any other <R n="store" />{" "}
            as per the <R n="data_model">Willow Data Model</R>.
          </P>

          <P>
            <Rsb n="drop" />{" "}
            are then shared via the informal ad-hoc infrastructure we refer to
            as the <Def n="sidenet" r="Sidenet" rs="Sidenets" />:
          </P>
          <Ul>
            <Li>USB keys</Li>
            <Li>SD cards</Li>
            <Li>CDs</Li>
            <Li>Email attachments</Li>
            <Li>Instant messages</Li>
            <Li>Torrents</Li>
            <Li>
              Or <Em>whatever means users have at hand</Em>.
            </Li>
          </Ul>
          <P>
            In contrast with{" "}
            <AE href="https://en.wikipedia.org/wiki/Sneakernet">
              sneakernets
            </AE>{" "}
            which only use physically transported storage devices, the{" "}
            <R n="sidenet" />{" "}
            also includes the internet and other established networks.
          </P>
        </PreviewScope>

        <P>
          <Rsb n="drop" />{" "}
          will often undoubtedly contain stale data that users are already aware
          of or no longer need. But what the{" "}
          <R n="sideloading_protocol">Sideloading Protocol</R>{" "}
          gives up in efficiency it more than makes up for in simplicity and
          flexibility. It is simple to implement, and works with the
          infrastructure users already have.
        </P>

        <P>
          Finally, given that this protocol cannot interactively authorise users
          (e.g. via{" "}
          <R n="private_interest_overlap">
            private interest intersection
          </R>), drops are always fully encrypted.
        </P>

        <Hsection n="sideload_parameters" title="Parameters">
          <PreviewScope>
            <P>
              In order to use the sideloading protocol, one must first specify a
              full suite of instantiations of the{" "}
              <R n="willow_parameters">
                parameters of the core Willow data model
              </R>. In addition to this, the sideloading protocol requires the
              following:
            </P>

            <Ul>
              <Li>
                An <R n="encoding_function" /> <R n="encode_namespace_id" /> for
                {" "}
                <R n="NamespaceId" />,
              </Li>
              <Li>
                An <R n="encoding_function" /> <R n="encode_subspace_id" /> for
                {" "}
                <R n="SubspaceId" />,
              </Li>
              <Li>
                An <R n="encoding_function" /> <R n="encode_payload_digest" />
                {" "}
                for <R n="PayloadDigest" />,
              </Li>
              <Li>
                An <R n="encoding_function" />{" "}
                <DefFunction
                  n="sideload_encode_token"
                  r="encode_authorisation_token"
                />{" "}
                for <R n="AuthorisationToken" />,
              </Li>
              <Li>
                a <R n="NamespaceId" />{" "}
                <DefValue n="sl_default_nsid" r="default_namespace_id" />,
              </Li>
              <Li>
                a <R n="SubspaceId" />{" "}
                <DefValue n="sl_default_ssid" r="default_subspace_id" />,
              </Li>
              <Li>
                a <R n="PayloadDigest" />{" "}
                <DefValue
                  n="sl_default_payload_digest"
                  r="default_payload_digest"
                />, and
              </Li>
              <Li>
                and a function <DefFunction n="encrypt" />{" "}
                which encrypts the final compiled encoding.
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>

        <Hsection n="sideload_protocol" title="Protocol">
          <PreviewScope>
            <P>
              Let <DefValue n="side_entries" r="entries" /> a sequence of{" "}
              pairs of a <Rs n="PossiblyAuthorisedEntry" />{" "}
              and either a full corresponding{" "}
              <Sidenote
                note={
                  <>
                    That is, a <R n="Payload" /> whose length is the{" "}
                    <R n="entry_payload_length" /> of the{" "}
                    <R n="Entry" />, and which hashes to the{" "}
                    <R n="entry_payload_digest" /> of the <R n="Entry" />.
                  </>
                }
              >
                <R n="Payload" />
              </Sidenote>{" "}
              or the marker value{" "}
              <DefVariant n="sl_none" r="none" />, all from a single{" "}
              <R n="namespace" /> with <R n="NamespaceId" />{" "}
              <DefValue n="sl_namespace" r="namespace" />. The Sideloading
              Protocol then defines how to encode this sequence as a single
              bytestring (the corresponding <R n="drop" />).
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Let{" "}
              <M>
                <DefValue n="initial_entry" r="entry_{-1}" />
              </M>{" "}
              be the result of{" "}
              <Code>
                <R n="default_entry" />(<R n="sl_default_nsid" />,{" "}
                <R n="sl_default_ssid" />, <R n="sl_default_payload_digest" />)
              </Code>.
            </P>
          </PreviewScope>

          <P>
            Then,{" "}
            <DefValue
              n="side_contents"
              r="contents"
              preview={
                <>
                  The unencrypted encoding of a sequence of{" "}
                  <Rs n="AuthorisedEntry" /> and optionally their{" "}
                  <Rs n="Payload" />, as used in a <R n="drop" />.
                </>
              }
            />{" "}
            is the concatenation of the following:
          </P>

          <PreviewScope>
            <Encoding
              standalone
              idPrefix="sl_enc"
              bitfields={[]}
              contents={[
                <C64Standalone>
                  the length (number) of <R n="side_entries" />
                </C64Standalone>,
                <CodeFor enc="encode_namespace_id" isFunction>
                  <R n="sl_namespace" />
                </CodeFor>,
                <EncIterator
                  val={
                    <>
                      <M>i</M>-th pair{" "}
                      <Tuple
                        fields={[
                          <Tuple
                            fields={[
                              <M>
                                <DefValue n="sl_e" r="entry_i" />
                              </M>,
                              <M>
                                <DefValue n="sl_a" r="auth_i" />
                              </M>,
                            ]}
                          />,
                          <M>
                            <DefValue n="sl_payload" r="optional\_payload_i" />
                          </M>,
                        ]}
                      />
                    </>
                  }
                  iter={
                    <>
                      <R n="side_entries" />
                    </>
                  }
                >
                  <Br />
                  <CodeFor isFunction enc="sideload_encode_token" notStandalone>
                    <R n="sl_a" />
                  </CodeFor>
                  , then
                  <Encoding
                    idPrefix="sl_enc_nested"
                    bitfields={[
                      bitfieldIff(
                        <>
                          <Code>
                            <R n="sl_payload" /> != <R n="sl_none" />
                          </Code>
                        </>,
                      ),
                      bitfieldIff(
                        <>
                          <Code>
                            <AccessStruct field="entry_subspace_id">
                              <R n="sl_e" />
                            </AccessStruct>{" "}
                            !={" "}
                            <AccessStruct field="entry_subspace_id">
                              <R n="sl_e">
                                entry_<Curly>i-1</Curly>
                              </R>
                            </AccessStruct>
                          </Code>
                        </>,
                      ),
                      {
                        count: 1,
                        content: (
                          <>
                            <Code>1</Code> if{" "}
                            <Code>
                              <AccessStruct field="entry_timestamp">
                                <R n="sl_e" />
                              </AccessStruct>{" "}
                              {"> "}
                              <AccessStruct field="entry_timestamp">
                                <R n="sl_e">
                                  entry_<Curly>i-1</Curly>
                                </R>
                              </AccessStruct>
                            </Code>, <Code>0</Code> if{" "}
                            <Code>
                              <AccessStruct field="entry_timestamp">
                                <R n="sl_e" />
                              </AccessStruct>{" "}
                              {"< "}
                              <AccessStruct field="entry_timestamp">
                                <R n="sl_e">
                                  entry_<Curly>i-1</Curly>
                                </R>
                              </AccessStruct>
                            </Code>, arbitrary if <Code>1</Code> if{" "}
                            <Code>
                              <AccessStruct field="entry_timestamp">
                                <R n="sl_e" />
                              </AccessStruct>{" "}
                              {"== "}
                              <AccessStruct field="entry_timestamp">
                                <R n="sl_e">
                                  entry_<Curly>i-1</Curly>
                                </R>
                              </AccessStruct>
                            </Code>.
                          </>
                        ),
                      },
                      {
                        count: 1,
                        content: <>arbitrary</>,
                      },
                      c64Tag(
                        "timediff",
                        2,
                        <>
                          <Code>
                            abs(
                            <AccessStruct field="entry_timestamp">
                              <R n="sl_e" />
                            </AccessStruct>{" "}
                            -{" "}
                            <AccessStruct field="entry_timestamp">
                              <R n="sl_e">
                                entry_<Curly>i-1</Curly>
                              </R>
                            </AccessStruct>
                            )
                          </Code>
                        </>,
                      ),
                      c64Tag(
                        "payload_len",
                        2,
                        <>
                          <Code>
                            <AccessStruct field="entry_payload_length">
                              <R n="sl_e" />
                            </AccessStruct>
                          </Code>
                        </>,
                      ),
                    ]}
                    contents={[
                      <EncConditional
                        condition={
                          <>
                            <Code>
                              <AccessStruct field="entry_subspace_id">
                                <R n="sl_e" />
                              </AccessStruct>{" "}
                              !={" "}
                              <AccessStruct field="entry_subspace_id">
                                <R n="sl_e">
                                  entry_<Curly>i-1</Curly>
                                </R>
                              </AccessStruct>
                            </Code>
                          </>
                        }
                      >
                        <CodeFor notStandalone enc="encode_subspace_id">
                          <AccessStruct field="entry_subspace_id">
                            <R n="sl_e" />
                          </AccessStruct>
                        </CodeFor>
                      </EncConditional>,
                      <CodeFor
                        enc="EncodePathRelativePath"
                        relativeTo={
                          <AccessStruct field="entry_path">
                            <R n="sl_e">
                              entry_<Curly>i-1</Curly>
                            </R>
                          </AccessStruct>
                        }
                      >
                        <AccessStruct field="entry_path">
                          <R n="sl_e" />
                        </AccessStruct>
                      </CodeFor>,
                      <C64Standalone>
                        <Code>
                          abs(
                          <AccessStruct field="entry_timestamp">
                            <R n="sl_e" />
                          </AccessStruct>{" "}
                          -{" "}
                          <AccessStruct field="entry_timestamp">
                            <R n="sl_e">
                              entry_<Curly>i-1</Curly>
                            </R>
                          </AccessStruct>
                          )
                        </Code>
                      </C64Standalone>,
                      <C64Standalone>
                        <Code>
                          <AccessStruct field="entry_payload_length">
                            <R n="sl_e" />
                          </AccessStruct>
                        </Code>
                      </C64Standalone>,
                      <CodeFor enc="encode_payload_digest">
                        <Code>
                          <AccessStruct field="entry_payload_digest">
                            <R n="sl_e" />
                          </AccessStruct>
                        </Code>
                      </CodeFor>,
                      <EncConditional
                        condition={
                          <>
                            <Code>
                              <R n="sl_payload" /> != <R n="sl_none" />
                            </Code>
                          </>
                        }
                      >
                        <RawBytes lowercase noPeriod>
                          <R n="sl_payload" />
                        </RawBytes>
                      </EncConditional>,
                    ]}
                  />
                </EncIterator>,
              ]}
            />
          </PreviewScope>

          <P>
            The the <R n="drop" /> corresponding to the sequence{" "}
            <R n="side_entries" /> is the result if applying <R n="encrypt" />
            {" "}
            to <R n="side_contents" />.
          </P>
        </Hsection>

        <Hsection n="sideload_transport" title="Transport">
          <P>
            Once created, a{" "}
            <R n="drop" />" can be transported by whatever means a single
            bytestring can be transferred, to be decrypted and the recovered
            {" "}
            <R n="side_entries" /> ingested by its intended recipient.
          </P>
        </Hsection>

        <Img
          src="/assets/sideload/sideload_emblem.png"
          alt={`A Sideloading emblem: A stylised drawing of tufty grass growing in between the cracks of paving stones, next to a graffiti-styled rendition of the word "Sideload".`}
        />
      </PageTemplate>
    </File>
  </Dir>
);
