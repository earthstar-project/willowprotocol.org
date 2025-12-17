import { Dir, File } from "macromania-outfs";
import { AE, Curly, MarginCaption } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Br, Code, Em, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rs, Rsb } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  Tuple,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { DefVariant } from "macromania-rustic";
import {
  Bitfield,
  bitfieldIff,
  C64Encoding,
  c64Tag,
  CodeFor,
  EncConditional,
  EncIterator,
  Encoding,
} from "../../encoding_macros.tsx";
import { C64Standalone } from "../../encoding_macros.tsx";
import { RawBytes } from "../../encoding_macros.tsx";

export const drop_format = (
  <Dir name="drop-format">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow Drop Format"
        headingId="willow_drop_format"
        heading="Willow Drop Format"
        toc
        status="proposal"
        parentId="specifications"
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
            The <R n="confidential_sync">Confidential Sync protocol</R>{" "}
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
            The <Def n="drop_format">Willow Drop Format</Def>{" "}
            presents a way for peers to transmit data to each other
            asynchronously and via completely user-improvised channels.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            Instead of statefully coordinating which data to exchange, the Drop
            Format encodes{" "}
            <Def n="drop" rs="drops">drops</Def>, arbitrary sets of{" "}
            <Rs n="Entry" /> and <Rs n="Payload" />{" "}
            compiled into a single bytestring. A <R n="drop" />{" "}
            can then be treated as a kind of static <R n="store" /> which can be
            {" "}
            <R n="store_join">joined</R> with any other <R n="store" />{" "}
            as per the <R n="data_model">Willow Data Model</R>.
          </P>

          <P>
            <Marginale inlineable>
              <Img
                src={<ResolveAsset asset={["sideload", "example_flow.png"]} />}
                alt={`A diagram of an ad-hoc network. An old computer connects to a newer desktop computer via a USB key. The newer desktop computer connects to a smartphone via email. The smartphone connects to another smartphone via a messaging app. And that smartphone connects to a laptop via a local wireless connection.`}
              />
              <MarginCaption>
                An example flow of Willow data travelling from device to device,
                first via USB key, then email, then a messaging app, then local
                wireless.
              </MarginCaption>
            </Marginale>
            <Rsb n="drop" /> are then shared via informal ad-hoc infrastructure:
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
        </PreviewScope>

        <P>
          <Rsb n="drop" />{" "}
          will often undoubtedly contain stale data that users are already aware
          of or no longer need. But what the <R n="drop_format">Drop Format</R>
          {" "}
          gives up in efficiency it more than makes up for in simplicity and
          flexibility. It is simple to implement, and works with the
          infrastructure users already have.
        </P>

        <Hsection n="drop_format_parameters" title="Parameters">
          <PreviewScope>
            <P>
              <Marginale>
                See <R n="willow25_drop_format" />{" "}
                for a default recommendation of parameters.
              </Marginale>
              In order to use the drop format, one must first specify a full
              suite of instantiations of the{" "}
              <R n="willow_parameters">
                parameters of the core Willow data model
              </R>. The <R n="hash_payload" />{" "}
              parameter of the data model must be a member of the{" "}
              <AE href="https://worm-blossom.github.io/bab/">
                Bab family of hash functions
              </AE>. In addition to this, the drop format requires the
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
                <Marginale>
                  When using <R n="MeadowcapAuthorisationToken" />{" "}
                  as the type of <Rs n="AuthorisationToken" />, you can use{" "}
                  <R n="EncodeMeadowcapAuthorisationTokenRelative" />.
                </Marginale>
                A <R n="relative_encoding_relation" />{" "}
                <DefType
                  n="SideloadingEncodeAuthorisationToken"
                  r="EncodeAuthorisationToken"
                  preview={
                    <P>
                      A protocol parameter of the <R n="drop_format" />, the
                      {" "}
                      <R n="relative_encoding_relation" /> for encoding{" "}
                      <Rs n="AuthorisationToken" />.
                    </P>
                  }
                />{" "}
                encoding <Rs n="AuthorisationToken" /> relative to pairs of an
                {" "}
                <R n="AuthorisedEntry" /> (the previously encoded{" "}
                <R n="AuthorisedEntry" />) and an <R n="Entry" /> (the{" "}
                <R n="Entry" /> currently being encoded),
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
                />,
              </Li>
              <Li>
                an <R n="AuthorisationToken" />{" "}
                <DefValue
                  n="sl_default_authorisation_token"
                  r="default_authorisation_token"
                />{" "}
                which <R n="is_authorised_write">authorises</R>{" "}
                <Code>
                  <R n="default_entry" />(<R n="sl_default_nsid" />,{" "}
                  <R n="sl_default_ssid" />,{" "}
                  <R n="sl_default_payload_digest" />)
                </Code>, and
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>

        <Hsection n="drop_format_desc" title="Format">
          <P>
            A <R n="drop" />{" "}
            is a collection of entries, together with verifiable subslices of
            their payloads. The payload slice verification relies on{" "}
            <AE href="https://worm-blossom.github.io/bab/">Bab</AE>;{" "}
            <Rs n="drop" /> store the{" "}
            <AE href="https://worm-blossom.github.io/bab/#baseline_slice">
              baseline verifiable slice streams
            </AE>{" "}
            of payload slices.
          </P>

          <PreviewScope>
            <P>
              Let <DefValue n="drop_entries" r="entries" /> a sequence of{" "}
              pairs of a <Rs n="PossiblyAuthorisedEntry" />{" "}
              and a sequence of non-overlapping slices of payload{" "}
              <AE href="https://worm-blossom.github.io/bab/#chunk">chunks</AE>
              {" "}
              with stricly increasing start offsets. The{" "}
              <Rs n="PossiblyAuthorisedEntry" /> must all come from a single
              {" "}
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
              </Code>, and let{" "}
              <M>
                <DefValue n="initial_authtoken" r="auth_{-1}" />
              </M>{" "}
              be <R n="sl_default_authorisation_token" />.
            </P>
          </PreviewScope>

          <P>
            Then, the actual <R n="drop" />{" "}
            is the concatenation of the following:
          </P>

          <PreviewScope>
            <Encoding
              standalone
              idPrefix="sl_enc"
              bitfields={[]}
              contents={[
                <C64Standalone>
                  the length (number) of <R n="drop_entries" />
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
                            <DefValue
                              n="sl_payload_slices"
                              r="payload\_slices_i"
                            />
                          </M>,
                        ]}
                      />
                    </>
                  }
                  iter={
                    <>
                      <R n="drop_entries" />
                    </>
                  }
                >
                  <Encoding
                    idPrefix="sl_enc_nested"
                    bitfields={[
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
                            </Code>, arbitrary if{" "}
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
                      {
                        count: 2,
                        id: "slice_mode",
                        content: (
                          <>
                            Two bits, selected as follows:

                            <Ul>
                              <Li>
                                If <R n="sl_payload_slices" />{" "}
                                is empty, these two bits may be set to{" "}
                                <Code>00</Code>.
                              </Li>
                              <Li>
                                If <R n="sl_payload_slices" />{" "}
                                consists of a single slice, and that slice
                                constitutes the full payload of{" "}
                                <R n="sl_e" />, these two bits may be set to
                                {" "}
                                <Code>01</Code>.
                              </Li>
                              <Li>
                                If <R n="sl_payload_slices" />{" "}
                                consists of a single slice, and that slice
                                starts at chunk index zero, these two bits may
                                be set to <Code>10</Code>.
                              </Li>
                              <Li>
                                These two bits may always be set to{" "}
                                <Code>11</Code>.
                              </Li>
                            </Ul>
                          </>
                        ),
                      },
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
                      <C64Encoding id="timediff" />,
                      <C64Encoding id="payload_len" />,
                      <CodeFor enc="encode_payload_digest">
                        <Code>
                          <AccessStruct field="entry_payload_digest">
                            <R n="sl_e" />
                          </AccessStruct>
                        </Code>
                      </CodeFor>,
                      <CodeFor
                        enc="SideloadingEncodeAuthorisationToken"
                        // notStandalone
                        relativeTo={
                          <>
                            the pair of (<R n="sl_e">
                              entry_<Curly>i-1</Curly>
                            </R>,{" "}
                            <R n="sl_a">
                              auth_<Curly>i-1</Curly>
                            </R>) and{" "}
                            <R n="sl_e">
                              entry_<Curly>i</Curly>
                            </R>
                          </>
                        }
                      >
                        <R n="sl_a" />
                      </CodeFor>,
                      <Ul>
                        <Li>
                          If bits <Bitfield id={"slice_mode"} /> are{" "}
                          <Code>00</Code>: the empty string.
                        </Li>
                        <Li>
                          If bits <Bitfield id={"slice_mode"} /> are{" "}
                          <Code>01</Code>:{" "}
                          <RawBytes lowercase noPeriod>
                            the payload of <R n="sl_e" />
                          </RawBytes>.
                        </Li>
                        <Li>
                          If bits <Bitfield id={"slice_mode"} /> are{" "}
                          <Code>10</Code>: the concatenation of{" "}
                          <Ul>
                            <Li>
                              <C64Standalone notStandalone>
                                the length of the slice in chunks
                              </C64Standalone>, and
                            </Li>
                            <Li>
                              <RawBytes lowercase noPeriod>
                                the{" "}
                                <AE href="https://worm-blossom.github.io/bab/#kgrouped_baseline">
                                  64-grouped
                                </AE>{" "}
                                <AE href="https://worm-blossom.github.io/bab/#baseline_slice">
                                  baseline verifiable slice stream
                                </AE>{" "}
                                of the single slice in{" "}
                                <R n="sl_payload_slices" />
                              </RawBytes>.
                            </Li>
                          </Ul>
                        </Li>
                        <Li>
                          If bits <Bitfield id={"slice_mode"} /> are{" "}
                          <Code>11</Code>: the concatenation of{" "}
                          <Ul>
                            <Li>
                              <C64Standalone notStandalone>
                                the number in slices in{" "}
                                <R n="sl_payload_slices" />
                              </C64Standalone>,
                            </Li>
                            <Li>
                              <C64Standalone notStandalone>
                                the final chunk index (inclusive) of the final
                                slice in <R n="sl_payload_slices" />
                              </C64Standalone>, and
                            </Li>
                            <Li>
                              <EncIterator
                                val={
                                  <>
                                    <M>
                                      <DefValue n="drop_slice_j" r="slice_j" />
                                    </M>
                                  </>
                                }
                                iter={
                                  <>
                                    <R n="sl_payload_slices" />
                                  </>
                                }
                              >
                                <Encoding
                                  idPrefix="sl_enc_nested_nested"
                                  bitfields={[]}
                                  contents={[
                                    <C64Standalone>
                                      the start chunk index of{" "}
                                      <R n="drop_slice_j" />{" "}
                                      minus the end chunk index of the
                                      previously encoded slice for this entry
                                      (or zero for the first slice of the entry)
                                    </C64Standalone>,
                                    <C64Standalone>
                                      the length of <R n="drop_slice_j" />{" "}
                                      in chunks
                                    </C64Standalone>,
                                    <RawBytes>
                                      the{" "}
                                      <AE href="https://worm-blossom.github.io/bab/#kgrouped_baseline">
                                        64-grouped
                                      </AE>{" "}
                                      <AE href="https://worm-blossom.github.io/bab/#baseline_slice">
                                        baseline verifiable slice stream
                                      </AE>{" "}
                                      of{" "}
                                      <R n="drop_slice_j" />, with the maximal
                                      {" "}
                                      <AE href="https://worm-blossom.github.io/bab/#left_skip">
                                        left-skip
                                      </AE>{" "}
                                      such that the only omitted node data has
                                      been included in the encoding of an
                                      earlier slice in{" "}
                                      <R n="sl_payload_slices" />
                                    </RawBytes>,
                                  ]}
                                />
                              </EncIterator>
                            </Li>
                          </Ul>
                        </Li>
                      </Ul>,
                    ]}
                  />
                </EncIterator>,
              ]}
            />
          </PreviewScope>
        </Hsection>

        <Hsection n="sideload_transport" title="Transport">
          <P>
            Once created, a <R n="drop" />{" "}
            can be transported by whatever means a single bytestring can be
            transferred, so that the decoded <R n="drop_entries" />{" "}
            can be ingested by its recipients.
          </P>

          <P>
            We <Em>highly</Em> recommend encrypting drops for transport.
          </P>
        </Hsection>

        <Img
          src={<ResolveAsset asset={["sideload", "sideload_emblem.png"]} />}
          alt={`A Sideloading emblem: A stylised drawing of tufty grass growing in between the cracks of paving stones, next to a graffiti-styled rendition of the word "Sideload".`}
        />
      </PageTemplate>
    </File>
  </Dir>
);
