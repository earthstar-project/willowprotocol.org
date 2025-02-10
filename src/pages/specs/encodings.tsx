import { Curly, NoWrap, Path } from "../../macros.tsx";
import {
  bitfieldIff,
  C64Encoding,
  C64Standalone,
  c64Tag,
  ChooseMaximal,
  CodeFor,
  EncConditional,
  Encoding,
  EncodingRelationRelativeTemplate,
  EncodingRelationTemplate,
  MinTags,
  RelAccess,
  RelName,
  ValAccess,
  ValName,
} from "../../encoding_macros.tsx";
import { MSet } from "../../macros.tsx";
import {
  AE,
  Alj,
  Blue,
  Green,
  Orange,
  Purple,
  SkyBlue,
  Vermillion,
  Yellow,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { CanonicSubencodings } from "../../encoding_macros.tsx";
import { RawBytes } from "../../encoding_macros.tsx";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Def, R, Rs } from "macromania-defref";
import { Code, Em, Hr, Li, P, Ul } from "macromania-html";
import { Dir, File } from "macromania-outfs";
import { Hsection } from "macromania-hsection";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import {
  AccessStruct,
  ChoiceType,
  DefType,
  DefValue,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { EncIterator } from "../../encoding_macros.tsx";
import { Tuple } from "macromania-rustic";
import { DefFunction } from "macromania-rustic";

export const encodings = (
  <Dir name="encodings">
    <File name="index.html">
      <PageTemplate
        htmlTitle="On Encodings"
        headingId="encodings"
        heading={"On Encodings"}
        status="proposal"
        statusDate="17.01.2024"
        toc
      >
        <P>
          <Em>
            Those encodings referenced from the{" "}
            <R n="meadowcap">Meadowcap specification</R> have status{" "}
            <SkyBlue>
              <R n="status_candidate" />
            </SkyBlue>.
          </Em>
        </P>

        <P>
          <Alj>TODO: improve the TOC rendering (styling, top, Home?)</Alj>
          <Alj>TODO: fix preview iframe height</Alj>
          A perhaps curious feature of the Willow data model is that its
          specification does not talk about encodings.{" "}
          <Sidenote
            note={
              <>
                Let’s be honest: <R n="aljoscha" />
              </>
            }
          >
            We
          </Sidenote>{" "}
          strongly believe that specifications should concern themselves with
          purely logical data types as long as possible, treating encodings as a
          minor and ultimately interchangeable detail. When specifications
          define concepts in terms of their encodings, results usually end up
          miserably underspecified (see{" "}
          <AE href="https://en.wikipedia.org/wiki/JSON#Interoperability">
            JSON
          </AE>) or full of incidental complexity (see{" "}
          <AE href="https://en.wikipedia.org/wiki/XML">XML</AE>).
        </P>

        <P>
          Nevertheless, protocols that deal with persistent storage and network
          transmissions eventually have to serialise data. In this document, we
          give both some generic definitions around arbitrary encodings, and
          some specific encodings that recur throughout the Willow family of
          specifications.
        </P>

        <Hsection n="encodings_what" title="Encodings, In Detail">
          <P>
            The Willow protocols are generic over user-supplied parameters.
            Invariably, some values of the user-supplied types need to be
            encoded, so there also have to be user-supplied definitions of how
            to encode things. Hence, we need to precisely specify some
            properties and terminology around encodings.
          </P>

          <PreviewScope>
            <P>
              Let{" "}
              <M>
                <DefType n="encrel_s" r="S" />
              </M>{" "}
              be a set of values we want to encode. Then an{" "}
              <Def
                n="encoding_relation"
                r="encoding relation"
                rs="encoding relations"
              />
              <Marginale>
                In mathy terms: an <R n="encoding_relation" /> is a{" "}
                <AE href="https://en.wikipedia.org/wiki/Binary_relation#Types_of_binary_relations">
                  left-unique
                </AE>,{" "}
                <AE href="https://en.wikipedia.org/wiki/Total_relation">
                  left-total
                </AE>{" "}
                <AE href="https://en.wikipedia.org/wiki/Binary_relation">
                  binary relation
                </AE>{" "}
                on{" "}
                <NoWrap>
                  <M>
                    <R n="encrel_s" /> \times <MSet>0, 1, \ldots, 255</MSet>^*
                  </M>
                </NoWrap>{" "}
                which defines a{" "}
                <AE href="https://en.wikipedia.org/wiki/Prefix_code">
                  prefix code
                </AE>.
              </Marginale>{" "}
              assigns to each value in <R n="encrel_s" />{" "}
              at least one (but possibly many) finite bytestrings, called the
              {" "}
              <Def n="code" r="code" rs="codes">codes</Def>{" "}
              of that value. The assignment must satisfy the following
              properties:
            </P>
            <Ul>
              <Li>
                each bytestring is the <R n="code" /> of at most one value in
                {" "}
                <R n="encrel_s" />, and
              </Li>
              <Li>
                no <R n="code" /> is a{" "}
                <AE href="https://en.wikipedia.org/wiki/Substring#Prefix">
                  prefix
                </AE>{" "}
                of any other <R n="code" />.
              </Li>
            </Ul>

            <P>
              An <R n="encoding_relation" /> in which every value has{" "}
              <Em>exactly one</Em> corresponding <R n="code" />
              <Marginale>
                The one-to-one mapping between values and <Rs n="code" />{" "}
                lets us deterministically hash or sign values.
              </Marginale>{" "}
              is called an{" "}
              <Def
                n="encoding_function"
                r="encoding function"
                rs="encoding functions"
              />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Quite often, we define an <R n="encoding_relation" />{" "}
              for some set of values, and then specify a subset of its{" "}
              <Rs n="code" /> to obtain an{" "}
              <R n="encoding_function" />. We call such a specialisation to a
              function a <Def n="canonic" /> subset or encoding.
            </P>
          </PreviewScope>

          <P>
            A nice technique for achieving small <Rs n="code" />{" "}
            is to not encode a value itself, but to encode merely how a value
            differs from some reference value. This requires both the party
            doing the encoding and the party doing the decoding to know that
            reference value, of course. We formally capture this notion in the
            concepts of <Rs n="relative_encoding_relation" />
            <Marginale>
              Since the definitions require rather careful parsing, they are
              followed by an example.
            </Marginale>{" "}
            and <Rs n="relative_encoding_function" />:
          </P>

          <PreviewScope>
            <P>
              <Alj>TODO: fix font selection in Math post punctuation</Alj>
              Let{" "}
              <M>
                <DefType n="relencrel_ss" r="S" />
              </M>{" "}
              be a set of values we want to encode relative to some set of
              values{" "}
              <M>
                <DefType n="relencrel_rr" r="R" />
              </M>. For each{" "}
              <M>
                <DefValue n="relencrel_s" r="s" />
              </M>{" "}
              in{" "}
              <M post=",">
                <R n="relencrel_ss" />
              </M>{" "}
              let{" "}
              <M>
                <DefType n="relencrel_rs" r="R_s" /> \subseteq{" "}
                <R n="relencrel_rr" />
              </M>{" "}
              denote the set of values relative to which <R n="relencrel_s" />
              {" "}
              can be encoded. Then a{" "}
              <Def
                n="relative_encoding_relation"
                r="relative encoding relation"
                rs="relative encoding relations"
              />{" "}
              assigns to each pair of an{" "}
              <M>
                <DefValue n="relencrel_s2" r="s" />
              </M>{" "}
              in{" "}
              <M>
                <R n="relencrel_ss" />
              </M>{" "}
              and an{" "}
              <M>
                <DefValue n="relencrel_r2" r="r" />
              </M>{" "}
              in{" "}
              <M>
                <R n="relencrel_rs" />
              </M>{" "}
              at least one (but possibly many) finite bytestrings, called the
              {" "}
              <R n="relencrel_r2" />-<Def
                n="rel_code"
                r="relative code"
                rs="relative codes"
              >
                relative codes
              </Def>{" "}
              of <R n="relencrel_s2" />. For every fixed{" "}
              <M>
                <DefValue n="relencrel_r" r="r" />
              </M>{" "}
              in{" "}
              <M post=",">
                <R n="relencrel_rr" />
              </M>{" "}
              the assignment must satisfy the following properties:
            </P>
            <Ul>
              <Li>
                each bytestring is the <R n="relencrel_r" />-<R n="rel_code" />
                {" "}
                of at most one value in <R n="relencrel_ss" />, and
              </Li>
              <Li>
                no <R n="relencrel_r" />-<R n="rel_code" /> is a{" "}
                <AE href="https://en.wikipedia.org/wiki/Substring#Prefix">
                  prefix
                </AE>{" "}
                of any other <R n="relencrel_r" />-<R n="rel_code" />.
              </Li>
            </Ul>

            <P>
              If there is <Em>exactly one</Em>{" "}
              <R n="relencrel_r3" />-<R n="rel_code" /> for every{" "}
              <M>
                <DefValue n="relencrel_s3" r="s" />
              </M>{" "}
              in{" "}
              <M>
                <R n="relencrel_ss" />
              </M>{" "}
              and every{" "}
              <M>
                <DefValue n="relencrel_r3" r="r" />
              </M>{" "}
              in{" "}
              <M post=",">
                <R n="relencrel_rs" />
              </M>{" "}
              we call the <R n="relative_encoding_relation" /> a{" "}
              <Def
                n="relative_encoding_function"
                r="relative encoding function"
                rs="relative encoding functions"
              />.
            </P>
          </PreviewScope>

          <P>
            A toy example: we can encode unsigned bytes (natural numbers between
            {" "}
            <M>0</M> and <M>255</M>{" "}
            inclusive) relative to other unsigned bytes by encoding the
            difference between them as a bytestring of length one (the
            difference as a single unsigned byte). For simplicity, we allow this
            only when the difference is non-negative. So the{" "}
            <NoWrap>
              <M>7</M>-<R n="rel_code" />
            </NoWrap>{" "}
            of <M>12</M> would be the byte <Code>0x05</Code> (because{" "}
            <M>12 - 7 = 5</M>). It would not be possible to encode <M>3</M>{" "}
            relative to <M post=",">7</M> however, since{" "}
            <NoWrap>
              <M>3 - 7</M>
            </NoWrap>{" "}
            is a negative number.
          </P>

          <P>
            In this example, both <R n="relencrel_ss" /> and{" "}
            <R n="relencrel_rr" />{" "}
            are the set of unsigned bytes. For any unsigned byte{" "}
            <M post=",">
              <R n="relencrel_s" />
            </M>{" "}
            <R n="relencrel_rs" />{" "}
            is the set of unsigned bytes greater than or equal to{" "}
            <M post=".">
              <R n="relencrel_s" />
            </M>{" "}
            For any fixed unsigned byte{" "}
            <M post=",">
              <R n="relencrel_r" />
            </M>{" "}
            all <R n="relencrel_r" />-<R n="rel_code" />{" "}
            are unique (which also implies prefix-freeness, since all codes have
            the same length), so we have indeed defined a valid{" "}
            <R n="relative_encoding_relation" />. Note that codes might be
            duplicated across different <R n="relencrel_r" /> — the{" "}
            <NoWrap>
              <M>2</M>-<R n="rel_code" />
            </NoWrap>{" "}
            of <M>3</M> and the{" "}
            <NoWrap>
              <M>123</M>-<R n="rel_code" />
            </NoWrap>{" "}
            of <M>124</M> are both{" "}
            <Code>0x01</Code>, for example — but this is perfectly ok.
          </P>
        </Hsection>

        <Hsection n="compact_integers" title="Compact Integer Encodings">
          <P>
            In various places, we need to encode <R n="U64" />{" "}
            values. When we expect small values to be significantly more common
            than large values, we can save space by using a variable-length
            encoding that encodes smaller numbers in fewer bytes than larger
            numbers. In this section, we define some building blocks for doing
            just that.
          </P>

          <P>
            The basic idea is to use a <Em>tag</Em>{" "}
            — a small bitstring — to encode how many bytes will be used for
            encoding the actual number. We allow for actual encodings of either
            one, two, four, or eight bytes. To indicate those four options, we
            need tags of at least two bits. We can also allot more bits to a
            tag. When we do, the four greatest numbers that can be represented
            in the tag indicate the four possible encoding widths in bytes.
            Using any smaller number as the tag indicates that the tag itself
            {" "}
            <Em>is</Em> the <R n="U64" />.
          </P>

          <P>
            Some examples before we give a formal definition: when using a
            four-bit tag, there are five different ways of encoding the number
            {" "}
            <M post=":">7</M>
          </P>
          <Ul>
            <Li>
              the tag can be <M>15</M> (<M>1111</M>{" "}
              in binary), indicating an encoding in eight additional bytes, or
            </Li>
            <Li>
              the tag can be <M>14</M> (<M>1110</M>{" "}
              in binary), indicating an encoding in four additional bytes, or
            </Li>
            <Li>
              the tag can be <M>13</M> (<M>1101</M>{" "}
              in binary), indicating an encoding in two additional bytes, or
            </Li>
            <Li>
              the tag can be <M>12</M> (<M>1100</M>{" "}
              in binary), indicating an encoding in one additional byte, or
            </Li>
            <Li>
              the tag can be <M>7</M> (<M>0111</M>{" "}
              in binary), indicating an encoding in zero additional bytes.
            </Li>
          </Ul>

          <P>
            When using a two-bit tag for the number{" "}
            <M post=",">300</M>, there are only three options:
          </P>
          <Ul>
            <Li>
              the tag can be <M>3</M> (<M>11</M>{" "}
              in binary), indicating an encoding in eight additional bytes, or
            </Li>
            <Li>
              the tag can be <M>2</M> (<M>10</M>{" "}
              in binary), indicating an encoding in four additional bytes, or
            </Li>
            <Li>
              the tag can be <M>1</M> (<M>01</M>{" "}
              in binary), indicating an encoding in two additional bytes.
            </Li>
          </Ul>

          <P>
            Now for the formal definitions:
          </P>

          <PreviewScope>
            <P>
              <Alj>
                Fix colors and fonts in defs, refs, and math mode thereof.
              </Alj>
              Let <DefValue n="c64_n" r="n" /> be a <R n="U64" />, and let{" "}
              <DefValue n="c64_tw" r="tag_width" math={`tag\\_width`} />{" "}
              be a natural number between two and eight inclusive. Then the
              natural number <DefValue n="c64_t" r="t" /> is a (valid){" "}
              <Def n="c64_tag" r="tag" rs="tags" /> for <R n="c64_n" /> of{" "}
              <Def n="c64_width" r="width" rs="widths" /> <R n="c64_tw" />{" "}
              in all of the following cases:
            </P>
            <Ul>
              <Li>
                <M>
                  <R n="c64_t" /> = 2^<Curly>
                    <R n="c64_tw" />
                  </Curly>{" "}
                  - 1
                </M>, or
              </Li>
              <Li>
                <M>
                  <R n="c64_n" /> \lt 256^4
                </M>{" "}
                and{" "}
                <M post=",">
                  <R n="c64_t" /> = 2^<Curly>
                    <R n="c64_tw" />
                  </Curly>{" "}
                  - 2
                </M>{" "}
                or
              </Li>
              <Li>
                <M>
                  <R n="c64_n" /> \lt 256^2
                </M>{" "}
                and{" "}
                <M post=",">
                  <R n="c64_t" /> = 2^<Curly>
                    <R n="c64_tw" />
                  </Curly>{" "}
                  - 3
                </M>{" "}
                or
              </Li>
              <Li>
                <M>
                  <R n="c64_n" /> \lt 256
                </M>{" "}
                and{" "}
                <M post=",">
                  <R n="c64_t" /> = 2^<Curly>
                    <R n="c64_tw" />
                  </Curly>{" "}
                  - 4
                </M>{" "}
                or
              </Li>
              <Li>
                <M>
                  <R n="c64_n" /> = <R n="c64_t" />
                </M>{" "}
                and{" "}
                <M post=".">
                  <R n="c64_t" /> \leq 2^<Curly>
                    <R n="c64_tw" />
                  </Curly>{" "}
                  - 5
                </M>
              </Li>
            </Ul>

            <P>
              <Marginale>
                Note that there might be multiple <Rs n="c64_tag" />{" "}
                to choose from for any given combination of a <R n="U64" />{" "}
                and a <R n="c64_width" />, but once the <R n="c64_tag" />{" "}
                is selected, the <R n="c64_corresponding" /> is unique.
              </Marginale>
              For any <R n="U64" /> <DefValue n="c64_n2" r="n" /> and any{" "}
              <R n="c64_tag" /> <DefValue n="c64_t2" r="t" /> for{" "}
              <R n="c64_n2" /> of <R n="c64_width" />{" "}
              <DefValue n="c64_tw2" r="tag_width" math={`tag\\_width`} />, the
              {" "}
              <Def
                n="c64_corresponding"
                r="corresponding compact U64 encoding"
                rs="corresponding compact U64 encodings"
              />{" "}
              is:
            </P>
            <Ul>
              <Li>
                the unsigned little-endian 8-byte encoding of <R n="c64_n2" />
                {" "}
                if{" "}
                <M post=",">
                  <R n="c64_t2" /> = 2^<Curly>
                    <R n="c64_tw2" />
                  </Curly>{" "}
                  - 1
                </M>
              </Li>
              <Li>
                the unsigned little-endian 4-byte encoding of <R n="c64_n2" />
                {" "}
                if{" "}
                <M post=",">
                  <R n="c64_t2" /> = 2^<Curly>
                    <R n="c64_tw2" />
                  </Curly>{" "}
                  - 2
                </M>
              </Li>
              <Li>
                the unsigned little-endian 2-byte encoding of <R n="c64_n2" />
                {" "}
                if{" "}
                <M post=",">
                  <R n="c64_t2" /> = 2^<Curly>
                    <R n="c64_tw2" />
                  </Curly>{" "}
                  - 3
                </M>
              </Li>
              <Li>
                the unsigned little-endian 1-byte encoding of <R n="c64_n2" />
                {" "}
                if{" "}
                <M post=",">
                  <R n="c64_t2" /> = 2^<Curly>
                    <R n="c64_tw2" />
                  </Curly>{" "}
                  - 4
                </M>{" "}
                and
              </Li>
              <Li>the empty string otherwise.</Li>
            </Ul>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Marginale>
                Examples: the <R n="c64_minimal" /> <R n="c64_tag" /> for{" "}
                <M>7</M> of <R n="c64_width" /> four is <M post=",">7</M>{" "}
                and the <R n="c64_minimal" /> <R n="c64_tag" /> for <M>300</M>
                {" "}
                of <R n="c64_width" /> two is <M post=".">1</M>
              </Marginale>
              We call a <R n="c64_tag" /> <Def n="c64_minimal" r="minimal" />
              {" "}
              for some given <R n="U64" /> and <R n="c64_width" /> if the{" "}
              <R n="c64_corresponding" />{" "}
              is shorter than that for any other valid <R n="c64_tag" />{" "}
              for the same <R n="U64" /> and{" "}
              <R n="c64_width" />. This notion coincides with being the
              numerically least <R n="c64_tag" /> for a given <R n="U64" /> and
              {" "}
              <R n="c64_width" />.
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection n="encodings_data_model" title="Data Model Encodings">
          <PreviewScope>
            <P>
              We now list some useful encodings for the types of the{" "}
              <R n="data_model">Willow data model</R>. We assume availability of
              {" "}
              <Rs n="encoding_function" /> for various parameters of Willow:
            </P>

            <Ul>
              <Li>
                an <R n="encoding_function" />{" "}
                <DefFunction n="encode_namespace_id" /> for{" "}
                <R n="NamespaceId" />,
              </Li>
              <Li>
                an <R n="encoding_function" />{" "}
                <DefFunction n="encode_subspace_id" /> for{" "}
                <R n="SubspaceId" />, and
              </Li>
              <Li>
                an <R n="encoding_function" />{" "}
                <DefFunction n="encode_payload_digest" /> for{" "}
                <R n="PayloadDigestd" />.
              </Li>
            </Ul>
          </PreviewScope>

          <Hsection n="enc_path" title="Path Encoding" shortTitle="path">
            <EncodingRelationTemplate
              n="EncodePath"
              valType={<R n="Path" />}
              bitfields={[
                c64Tag(
                  "total_length",
                  4,
                  <>
                    the sum of the lengths of the <Rs n="Component" /> of{" "}
                    <ValName />
                  </>,
                ),
                c64Tag(
                  "component_count",
                  4,
                  <>
                    the number of <Rs n="Component" /> of <ValName />
                  </>,
                ),
              ]}
              contents={[
                <C64Encoding id="total_length" />,
                <C64Encoding id="component_count" />,
                <EncIterator
                  val={
                    <>
                      <R n="Component" /> <DefValue n="encpath_comp" r="comp" />
                    </>
                  }
                  iter={<ValName />}
                  skipLast
                >
                  <Encoding
                    idPrefix="EncodePath_nested"
                    bitfields={[
                      c64Tag(
                        "component_len",
                        8,
                        <>
                          the length of <R n="encpath_comp" />
                        </>,
                      ),
                    ]}
                    contents={[
                      <C64Encoding id="component_len" />,
                      <RawBytes>
                        <R n="encpath_comp" />
                      </RawBytes>,
                    ]}
                  />
                </EncIterator>,
                {
                  content: (
                    <>
                      <RawBytes noPeriod>
                        the final <R n="Component" /> of <ValName />
                      </RawBytes>, or the empty string if <ValName />{" "}
                      has zero components.
                    </>
                  ),
                  comment: (
                    <>
                      The length of the final <R n="Component" />{" "}
                      can be reconstructed from the total length and the lengths
                      of all prior <Rs n="Component" />.
                    </>
                  ),
                },
              ]}
              canonic={{
                n: "encode_path",
                how: [<MinTags />],
              }}
            />

            <P>
              <Alj>
                Either make this visually more pleasing or remove it again.
              </Alj>
              An example: encoding the <R n="Path" />{" "}
              <Path components={["blog", "ideas", "fun"]} /> with{" "}
              <R n="encode_path" /> yields
            </P>

            <P>
              <Code>
                <Orange>0C</Orange> <SkyBlue>03</SkyBlue> <Green>00 04</Green>
                {" "}
                <Purple>62 6C 6F 67</Purple> <Yellow>00 05</Yellow>{" "}
                <Blue>69 64 65 61 73</Blue> <Vermillion>66 75 6E</Vermillion>
              </Code>, because
            </P>
            <Ul>
              <Li>
                <Code>
                  <Orange>0C</Orange>
                </Code>{" "}
                is the <R n="c64_minimal" /> <R n="c64_tag" /> of{" "}
                <R n="c64_width" /> <M>4</M>{" "}
                for the total path length (<M>12</M>),
              </Li>
              <Li>
                <Code>
                  <SkyBlue>03</SkyBlue>
                </Code>{" "}
                is the <R n="c64_minimal" /> <R n="c64_tag" /> of{" "}
                <R n="c64_width" /> <M>4</M> for the number of{" "}
                <Rs n="Component" />,
              </Li>
              <Li>
                the <Rs n="c64_corresponding" />{" "}
                for both are the empty string, so they do not appear in the{" "}
                <R n="code" />,
              </Li>
              <Li>
                <Code>
                  <Green>00 04</Green>
                </Code>{" "}
                is the <R n="c64_minimal" /> <R n="c64_tag" /> of{" "}
                <R n="c64_width" /> <M>8</M> for the length of{" "}
                <Code>"blog"</Code>,
              </Li>
              <Li>
                the <Rs n="c64_corresponding" /> of the length of{" "}
                <Code>"blog"</Code>{" "}
                is the empty string, so it does not appear in the{" "}
                <R n="code" />,
              </Li>
              <Li>
                <Code>
                  <Purple>62 6C 6F 67</Purple>
                </Code>{" "}
                is the ASCII encoding of <Code>"blog"</Code>,
              </Li>
              <Li>
                <Code>
                  <Yellow>00 05</Yellow>
                </Code>{" "}
                is the <R n="c64_minimal" /> <R n="c64_tag" /> of{" "}
                <R n="c64_width" /> <M>8</M> for the length of{" "}
                <Code>"ideas"</Code>,
              </Li>
              <Li>
                the <Rs n="c64_corresponding" /> of the length of{" "}
                <Code>"ideas"</Code>{" "}
                is the empty string, so it does not appear in the{" "}
                <R n="code" />,
              </Li>
              <Li>
                <Code>
                  <Blue>69 64 65 61 73</Blue>
                </Code>{" "}
                is the ASCII encoding of <Code>"ideas"</Code>,
              </Li>
              <Li>
                the length of <Code>"fun"</Code>{" "}
                is not encoded (it can be reconstructed as{" "}
                <M>12 - (4 + 5) = 3</M>), and
              </Li>
              <Li>
                <Code>
                  <Vermillion>66 75 6E</Vermillion>
                </Code>{" "}
                is the ASCII encoding of <Code>"fun"</Code>.
              </Li>
            </Ul>

            <Hr />

            <EncodingRelationRelativeTemplate
              n="EncodePathRelativePath"
              valType={<R n="Path" />}
              relToDescription={
                <>
                  <R n="Path" />
                </>
              }
              preDefs={
                <P>
                  Let{" "}
                  <DefValue
                    n="EncodePathRelativePath_prefix_count"
                    r="prefix_count"
                  />{" "}
                  be a natural number such that the first{" "}
                  <R n="EncodePathRelativePath_prefix_count" />{" "}
                  <Rs n="Component" /> of <ValName /> are equal to the first
                  {" "}
                  <R n="EncodePathRelativePath_prefix_count" />{" "}
                  <Rs n="Component" /> of <RelName />.
                </P>
              }
              bitfields={[
                c64Tag(
                  "prefix_count",
                  8,
                  <>
                    <R n="EncodePathRelativePath_prefix_count" />
                  </>,
                ),
              ]}
              contents={[
                <C64Encoding id="prefix_count" />,
                <CodeFor enc="EncodePath">
                  the <R n="path_difference" /> from <RelName /> to <ValName />
                </CodeFor>,
              ]}
              canonic={{
                n: "path_rel_path",
                how: [
                  <ChooseMaximal n="EncodePathRelativePath_prefix_count" />,
                  <MinTags />,
                  <CanonicSubencodings />,
                ],
              }}
            />

            <Hr />

            <EncodingRelationRelativeTemplate
              n="EncodePathExtendsPath"
              valType={<R n="Path" />}
              relToDescription={
                <>
                  <R n="Path" /> which is a <R n="path_prefix" /> of <ValName />
                </>
              }
              bitfields={[]}
              contents={[
                <CodeFor enc="EncodePath">
                  the <R n="path_difference" /> from <RelName /> to <ValName />
                </CodeFor>,
              ]}
              canonic={{
                n: "path_extends_path",
                how: [
                  <MinTags />,
                  <CanonicSubencodings />,
                ],
              }}
            />
          </Hsection>
        </Hsection>

        <Hsection n="enc_capabilities" title="Capabilities">
          <P>
            Encodings for <R n="meadowcap" /> and{" "}
            <Rs n="McSubspaceCapability" />.<Alj>fix Meadowcap link color</Alj>
            <Alj>TODO add hsections to make for a useful TOC</Alj>
          </P>

          <P>
            <Alj inline>TODO mc subspace cap absolute</Alj>
          </P>

          <Hr />

          <P>
            <Alj inline>TODO mc cap absolute</Alj>
          </P>

          <Hr />

          <EncodingRelationRelativeTemplate
            n="EncodeMcSubspaceCapabilityRelativePrivateInterest"
            valType={<R n="McSubspaceCapability" />}
            relToDescription={
              <>
                <R n="PersonalPrivateInterest" /> with{" "}
                <Code>
                  <AccessStruct field="pi_ss">
                    <RelAccess field="ppi_pi" />
                  </AccessStruct>{" "}
                  == <R n="area_any" />
                </Code>{" "}
                and{" "}
                <Code>
                  <AccessStruct field="pi_ns">
                    <RelAccess field="ppi_pi" />
                  </AccessStruct>{" "}
                  == <ValAccess field="subspace_cap_namespace" />
                </Code>
              </>
            }
            shortRelToDescription={<R n="PersonalPrivateInterest" />}
            bitfields={[
              c64Tag(
                "delegation_count",
                8,
                <>
                  the number of pairs in{" "}
                  <ValAccess field="subspace_cap_delegations" />
                </>,
              ),
            ]}
            contents={[
              <C64Encoding id="delegation_count" />,
              <CodeFor enc="encode_namespace_sig">
                <ValAccess field="subspace_cap_initial_authorisation" />
              </CodeFor>,
              <EncConditional
                condition={
                  <>
                    the number of pairs in{" "}
                    <ValAccess field="subspace_cap_delegations" /> is nonzero
                  </>
                }
              >
                <CodeFor enc="encode_user_pk" notStandalone>
                  <ValAccess field="subspace_cap_user" />
                </CodeFor>
              </EncConditional>,
              <EncIterator
                val={
                  <>
                    pair{" "}
                    <Tuple
                      fields={[
                        <DefValue n="enc_sscap_rel_pk" r="pk" />,
                        <DefValue n="enc_sscap_rel_sig" r="sig" />,
                      ]}
                    />
                  </>
                }
                iter={<ValAccess field="subspace_cap_delegations" />}
                skipLast
              >
                <Alj inline>
                  TODO fix styling of nested encoding without bitfields
                </Alj>
                <Encoding
                  idPrefix="enc_sscap_rel_nested"
                  bitfields={[]}
                  contents={[
                    <CodeFor enc="encode_user_pk">
                      <R n="enc_sscap_rel_pk" />
                    </CodeFor>,
                    <CodeFor enc="encode_user_sig">
                      <R n="enc_sscap_rel_sig" />
                    </CodeFor>,
                  ]}
                />
              </EncIterator>,
              <EncConditional
                condition={
                  <>
                    the number of pairs in{" "}
                    <ValAccess field="subspace_cap_delegations" /> is nonzero
                  </>
                }
              >
                <CodeFor enc="encode_user_pk" notStandalone>
                  the final <R n="UserSignature" /> in{" "}
                  <ValAccess field="subspace_cap_delegations" />
                </CodeFor>
              </EncConditional>,
            ]}
          />
        </Hsection>

        <Hsection n="enc_private" title="Private Encodings">
          <P>
            We now define some relative encodings which take care to not reveal
            certain parts of the values being encoded. We use these in the{" "}
            <R n="private_interest_intersection" /> parts of the{" "}
            <R n="sync">WGPS</R>.
          </P>

          <Hsection
            n="enc_private_paths"
            title="Private Path Encoding"
            shortTitle="Path Extends Path"
          >
            <P>
              We start with a building block for more complex private encodings:
              the ability to encode a <R n="Path" /> relative to one of its{" "}
              <Rs n="path_prefix" />, while keeping secret all{" "}
              <Rs n="Component" /> that coincide with a third <R n="Path" />.
            </P>

            <Pseudocode n="private_path_def">
              <StructDef
                comment={
                  <>
                    The context necessary to <R n="enc_private">privately</R>
                    {" "}
                    encode <Rs n="Path" />.
                  </>
                }
                id={[
                  "PrivatePathContext",
                  "PrivatePathContext",
                  "PrivatePathContexts",
                ]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="Path" /> whose <Rs n="Component" />{" "}
                          are to be kept private.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["private", "PrivatePathContextPrivate"],
                        <R n="Path" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="path_prefix" /> relative to which we encode.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["rel", "PrivatePathContextRel"],
                        <R n="Path" />,
                      ],
                    },
                  },
                ]}
              />
            </Pseudocode>

            <EncodingRelationRelativeTemplate
              n="EncodePrivatePathExtendsPath"
              valType={<R n="Path" />}
              relToDescription={
                <>
                  <R n="PrivatePathContext" /> such that{" "}
                  <RelAccess field="PrivatePathContextRel" /> is a{" "}
                  <R n="path_prefix" /> of <ValName /> and{" "}
                  <RelAccess field="PrivatePathContextPrivate" /> is{" "}
                  <R n="path_related" /> to <ValName />
                </>
              }
              preDefs={
                <P>
                  Let <DefValue n="eppep_val_count" r="val_count" />{" "}
                  be the number of components in <ValName />. Let{" "}
                  <DefValue n="eppep_rel_count" r="rel_count" />{" "}
                  be the number of components in{" "}
                  <RelAccess field="PrivatePathContextRel" />. Let{" "}
                  <DefValue n="eppep_private_count" r="private_count" />{" "}
                  be the number of components in{" "}
                  <RelAccess field="PrivatePathContextPrivate" />.
                </P>
              }
              shortRelToDescription={<R n="PrivatePathContext" />}
              bitfields={[]}
              contents={[
                <EncConditional
                  condition={
                    <>
                      <Code>
                        <R n="eppep_rel_count" />
                        {" < "}
                        <R n="eppep_private_count" />
                      </Code>
                    </>
                  }
                >
                  <C64Standalone notStandalone>
                    <Code>
                      min(<R n="eppep_val_count" />,{" "}
                      <R n="eppep_private_count" />) - <R n="eppep_rel_count" />
                    </Code>
                  </C64Standalone>
                </EncConditional>,
                <EncConditional
                  condition={
                    <>
                      <Code>
                        <R n="eppep_val_count" />
                        {" >= "}
                        <R n="eppep_private_count" />
                      </Code>
                    </>
                  }
                >
                  <CodeFor enc="EncodePathExtendsPath" notStandalone>
                    the <R n="path_difference" /> from{" "}
                    <RelAccess field="PrivatePathContextPrivate" /> to{" "}
                    <ValName />, or the <R n="path_difference" /> from{" "}
                    <RelAccess field="PrivatePathContextRel" /> to{" "}
                    <ValName />, whichever is shorter
                  </CodeFor>
                </EncConditional>,
              ]}
            />
          </Hsection>

          <Hsection
            n="enc_private_areas"
            title="Private Area Encoding"
            shortTitle="Area in Area"
          >
            <P>
              Next, we build up to private <R n="Area" /> encoding: we encode an
              {" "}
              <R n="Area" /> that is <R n="area_include">included</R> in another
              {" "}
              <R n="Area" />, while keeping secret a <R n="PrivateInterest" />
              {" "}
              which <R n="pi_include">includes</R> both.
            </P>

            <Pseudocode n="private_are_def">
              <StructDef
                comment={
                  <>
                    The context necessary to <R n="enc_private">privately</R>
                    {" "}
                    encode <Rs n="Area" />.
                  </>
                }
                id={[
                  "PrivateAreaContext",
                  "PrivateAreaContext",
                  "PrivateAreaContexts",
                ]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="PrivateInterest" /> to be kept private.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["private", "PrivateAreaContextPrivate"],
                        <R n="PrivateInterest" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="area_include">containing</R> <R n="Area" />
                          {" "}
                          relative to which we encode.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        ["rel", "PrivateAreaContextRel"],
                        <R n="Area" />,
                      ],
                    },
                  },
                ]}
              />
            </Pseudocode>

            <EncodingRelationRelativeTemplate
              n="EncodePrivateAreaInArea"
              valType={<R n="Area" />}
              relToDescription={
                <>
                  <R n="PrivateAreaContext" /> such that{" "}
                  <RelAccess field="PrivateAreaContextRel" />{" "}
                  <R n="area_include">includes</R> <ValName /> and{" "}
                  <RelAccess field="PrivateAreaContextPrivate" />{" "}
                  <R n="pi_include">includes</R> to <RelName />
                </>
              }
              preDefs={
                <P>
                  Let{" "}
                  <DefValue n="epaia_start_from_start" r="start_from_start" />
                  {" "}
                  and <DefValue n="epaia_end_from_start" r="end_from_start" />
                  {" "}
                  be arbitrary <Rs n="Bool" />. If{" "}
                  <AccessStruct field="TimeRangeEnd">
                    <AccessStruct field="AreaTime">
                      <RelAccess field="PrivateAreaContextRel" />
                    </AccessStruct>
                  </AccessStruct>{" "}
                  is <R n="range_open" />, they must both be <Code>true</Code>.
                </P>
              }
              shortRelToDescription={<R n="PrivateAreaContext" />}
              bitfields={[
                bitfieldIff(
                  <Code>
                    <ValAccess field="AreaSubspace" /> !={" "}
                    <AccessStruct field="AreaSubspace">
                      <RelAccess field="PrivateAreaContextRel" />
                    </AccessStruct>
                  </Code>,
                ),
                bitfieldIff(
                  <Code>
                    <ValAccess field="AreaSubspace" /> == <R n="range_open" />
                  </Code>,
                ),
                bitfieldIff(<R n="epaia_start_from_start" />),
                bitfieldIff(<R n="epaia_end_from_start" />),
                c64Tag(
                  "start_diff",
                  2,
                  <>
                    either{" "}
                    <Code>
                      <AccessStruct field="TimeRangeStart">
                        <ValAccess field="AreaTime" />
                      </AccessStruct>
                      -{" "}
                      <AccessStruct field="TimeRangeStart">
                        <AccessStruct field="AreaTime">
                          <RelAccess field="PrivateAreaContextRel" />
                        </AccessStruct>
                      </AccessStruct>
                    </Code>{" "}
                    (if <R n="epaia_start_from_start" />), or{" "}
                    <Code>
                      <AccessStruct field="TimeRangeEnd">
                        <AccessStruct field="AreaTime">
                          <RelAccess field="PrivateAreaContextRel" />
                        </AccessStruct>
                      </AccessStruct>{" "}
                      -{" "}
                      <AccessStruct field="TimeRangeStart">
                        <ValAccess field="AreaTime" />
                      </AccessStruct>
                    </Code>{" "}
                    (otherwise)
                  </>,
                ),
                c64Tag(
                  "end_diff",
                  2,
                  <>
                    either{" "}
                    <Code>
                      <AccessStruct field="TimeRangeEnd">
                        <ValAccess field="AreaTime" />
                      </AccessStruct>
                      -{" "}
                      <AccessStruct field="TimeRangeStart">
                        <AccessStruct field="AreaTime">
                          <RelAccess field="PrivateAreaContextRel" />
                        </AccessStruct>
                      </AccessStruct>
                    </Code>{" "}
                    (if <R n="epaia_end_from_start" />), or{" "}
                    <Code>
                      <AccessStruct field="TimeRangeEnd">
                        <AccessStruct field="AreaTime">
                          <RelAccess field="PrivateAreaContextRel" />
                        </AccessStruct>
                      </AccessStruct>{" "}
                      -{" "}
                      <AccessStruct field="TimeRangeEnd">
                        <ValAccess field="AreaTime" />
                      </AccessStruct>
                    </Code>{" "}
                    (otherwise). If{" "}
                    <Code>
                      <AccessStruct field="TimeRangeEnd">
                        <ValAccess field="AreaTime" />
                      </AccessStruct>{" "}
                      == <R n="range_open" />
                    </Code>, these two bits can be set arbitrarily instead
                  </>,
                ),
              ]}
              contents={[
                <EncConditional
                  condition={
                    <Code>
                      <ValAccess field="AreaSubspace" /> !={" "}
                      <AccessStruct field="AreaSubspace">
                        <RelAccess field="PrivateAreaContextRel" />
                      </AccessStruct>
                    </Code>
                  }
                >
                  <CodeFor notStandalone enc="encode_subspace_id">
                    <ValAccess field="AreaSubspace" />
                  </CodeFor>
                </EncConditional>,
                <C64Encoding id="start_diff" />,
                <>
                  <C64Encoding id="end_diff" noDot />, or the empty string if
                  {" "}
                  <Code>
                    <AccessStruct field="TimeRangeEnd">
                      <ValAccess field="AreaTime" />
                    </AccessStruct>{" "}
                    == <R n="range_open" />
                  </Code>.
                </>,
                <CodeFor
                  enc="EncodePrivatePathExtendsPath"
                  relativeTo={
                    <>
                      the <R n="PrivatePathContext" /> with{" "}
                      <NoWrap>
                        <Code>
                          <R n="PrivatePathContextPrivate" /> :={" "}
                          <AccessStruct field="AreaPath">
                            <RelAccess field="PrivateAreaContextPrivate" />
                          </AccessStruct>
                        </Code>
                      </NoWrap>{" "}
                      and{" "}
                      <NoWrap>
                        <Code>
                          <R n="PrivatePathContextRel" /> :={" "}
                          <AccessStruct field="AreaPath">
                            <RelAccess field="PrivateAreaContextRel" />
                          </AccessStruct>
                        </Code>
                      </NoWrap>
                    </>
                  }
                >
                  <ValAccess field="AreaPath" />
                </CodeFor>,
              ]}
            />
          </Hsection>

          <Hsection
            n="enc_private_communal_capabilities"
            title="Communal Capability Encoding"
            shortTitle="Communal Capability"
          >
            <EncodingRelationRelativeTemplate
              n="EncodeCommunalCapabilityRelativePrivateInterest"
              valType={<R n="CommunalCapability" />}
              valRestriction={
                <>
                  with{" "}
                  <Code>
                    <ValAccess field="communal_cap_access_mode" /> =={" "}
                    <R n="access_read" />
                  </Code>
                </>
              }
              relToDescription={
                <>
                  <Marginale>
                    Note that <Rs n="CommunalCapability" />{" "}
                    are always restricted to a single <R n="SubspaceId" />, so
                    {" "}
                    <Rs n="PersonalPrivateInterest" /> with{" "}
                    <Code>
                      <R n="pi_ss" /> == <R n="area_any" />
                    </Code>{" "}
                    are never needed.
                  </Marginale>
                  <R n="PersonalPrivateInterest" /> with{" "}
                  <Code>
                    <AccessStruct field="pi_ss">
                      <RelAccess field="ppi_pi" />
                    </AccessStruct>{" "}
                    == <ValAccess field="communal_cap_user" />
                  </Code>{" "}
                  ,
                  <Code>
                    <AccessStruct field="pi_ns">
                      <RelAccess field="ppi_pi" />
                    </AccessStruct>{" "}
                    == <ValAccess field="subspace_cap_namespace" />
                  </Code>, and such that the <R n="AreaPath" /> of the{" "}
                  <R n="communal_cap_granted_area" /> of <ValName /> is a{" "}
                  <R n="path_prefix" /> of{" "}
                  <AccessStruct field="pi_path">
                    <RelAccess field="ppi_pi" />
                  </AccessStruct>, and such that <RelAccess field="ppi_user" />
                  {" "}
                  is equal to the final <R n="UserPublicKey" /> in{" "}
                  <ValAccess field="communal_cap_delegations" />{" "}
                  (if there is at least one delegation), or equal to{" "}
                  <ValAccess field="communal_cap_user" /> otherwise
                </>
              }
              shortRelToDescription={<R n="PersonalPrivateInterest" />}
              preDefs={
                <P>
                  To efficiently and privately encode the <Rs n="Area" /> in the
                  {" "}
                  <R n="communal_cap_delegations" /> of{" "}
                  <ValName />, we define a sequence of{" "}
                  <Rs n="PrivateAreaContext" />.{" "}
                  <M>
                    <DefValue n="ccrpi_ctx_i" r="ctx_i" />
                  </M>{" "}
                  is the <R n="PrivateAreaContext" /> whose{" "}
                  <R n="PrivateAreaContextPrivate" /> is <RelName /> and whose
                  {" "}
                  <R n="PrivateAreaContextRel" /> is the <M>i</M>-th{" "}
                  <R n="Area" /> in{" "}
                  <ValAccess field="communal_cap_delegations" />. Further, we
                  define{" "}
                  <M>
                    <Def n="ccrpi_ctx_base" r="ctx_{-1}" />
                  </M>{" "}
                  as the <R n="PrivateAreaContext" /> whose{" "}
                  <R n="PrivateAreaContextPrivate" /> is <RelName /> and whose
                  {" "}
                  <R n="PrivateAreaContextRel" /> is the <R n="subspace_area" />
                  {" "}
                  of <R n="SubspaceId" />{" "}
                  <AccessStruct field="pi_ss">
                    <AccessStruct field="ppi_pi">
                      <RelAccess field="PrivateAreaContextPrivate" />
                    </AccessStruct>
                  </AccessStruct>.
                </P>
              }
              bitfields={[]}
              contents={[
                <EncIterator
                  val={
                    <>
                      <M>i</M>-th triplet{" "}
                      <Tuple
                        fields={[
                          <DefValue n="enc_ccap_rel_area" r="area" />,
                          <DefValue n="enc_ccap_rel_pk" r="pk" />,
                          <DefValue n="enc_ccap_rel_sig" r="sig" />,
                        ]}
                      />
                    </>
                  }
                  iter={<ValAccess field="communal_cap_delegations" />}
                  skipLast
                >
                  <Encoding
                    idPrefix="enc_ccap_rel_nested"
                    bitfields={[]}
                    contents={[
                      <CodeFor
                        enc="EncodePrivateAreaInArea"
                        relativeTo={
                          <M>
                            <R n="ccrpi_ctx_i">
                              ctx_<Curly>i - 1</Curly>
                            </R>
                          </M>
                        }
                      >
                        <R n="enc_ccap_rel_area" />
                      </CodeFor>,
                      <CodeFor enc="encode_user_pk">
                        <R n="enc_ccap_rel_pk" />
                      </CodeFor>,
                      <CodeFor enc="encode_user_sig">
                        <R n="enc_ccap_rel_sig" />
                      </CodeFor>,
                    ]}
                  />
                </EncIterator>,
                <EncConditional
                  condition={
                    <>
                      the number of pairs in{" "}
                      <ValAccess field="communal_cap_delegations" /> is nonzero
                    </>
                  }
                >
                  <CodeFor
                    enc="EncodePrivateAreaInArea"
                    relativeTo={
                      <>
                        <M>
                          <R n="ccrpi_ctx_i">
                            ctx_<Curly>i - 1</Curly>
                          </R>
                        </M>{" "}
                        (where <M>i</M> is the length of{" "}
                        <ValAccess field="communal_cap_delegations" />{" "}
                        minus one)
                      </>
                    }
                  >
                    <R n="enc_ccap_rel_area" />
                  </CodeFor>
                </EncConditional>,
                <EncConditional
                  condition={
                    <>
                      the number of pairs in{" "}
                      <ValAccess field="communal_cap_delegations" /> is nonzero
                    </>
                  }
                >
                  <CodeFor enc="encode_user_sig">
                    the final <R n="UserSignature" /> in{" "}
                    <ValAccess field="communal_cap_delegations" />
                  </CodeFor>
                </EncConditional>,
              ]}
            />
          </Hsection>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
