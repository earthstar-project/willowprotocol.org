import { Dir, File } from "macromania-outfs";
import {
  AE,
  Alj,
  Curly,
  Green,
  MarginCaption,
  Orange,
  Purple,
  SkyBlue,
  Vermillion,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Br, Code, Em, EscapeHtml, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs, Rsb } from "macromania-defref";
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

export const uris = (
  <Dir name="uris">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow URIs"
        headingId="uris"
        heading="Willow URIs"
        toc
        status="proposal"
        parentId="specifications"
      >
        <P>
          This specifications describes two{" "}
          <AE href="https://datatracker.ietf.org/doc/html/rfc3986">URI</AE>{" "}
          schemes for use with Willow: one for identifying{" "}
          <Rs n="Entry" />, and one for identifying <Rs n="AreaOfInterest" />.
        </P>

        <PreviewScope>
          <P>
            We say a byte is <Def n="uri_unreserved" r="unreserved" />{" "}
            if its numeric value is the ASCII code of one of the following
            characters:{" "}
            <Code>
              -.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_~
            </Code>{" "}
            (i.e., alphanumerics and <Code>-</Code>, <Code>.</Code>,{" "}
            <Code>_</Code>, and <Code>~</Code>).
          </P>
        </PreviewScope>

        <Hsection n="uris_parameters" title="Parameters">
          <PreviewScope>
            <P>
              <Marginale>
                See <R n="willow25" />{" "}
                for a default recommendation of parameters.
              </Marginale>
              In order to use Willow URIs, one must first specify a full suite
              of instantiations of the{" "}
              <R n="willow_parameters">
                parameters of the core Willow data model
              </R>. In addition to this, the URIs require the following:
            </P>

            <Ul>
              <Li>
                An <R n="encoding_relation" />{" "}
                <DefType n="UriEncodeNamespaceId" /> for{" "}
                <R n="NamespaceId" />, such that the bytes of all{" "}
                <Rs n="code" /> are <R n="uri_unreserved" />.
              </Li>
              <Li>
                An <R n="encoding_relation" />{" "}
                <DefType n="UriEncodeSubspaceId" /> for{" "}
                <R n="SubspaceId" />, such that the bytes of all <Rs n="code" />
                {" "}
                are <R n="uri_unreserved" />.
              </Li>
              <Li>
                An <R n="encoding_relation" />{" "}
                <DefType n="UriEncodePayloadDigest" /> for{" "}
                <R n="PayloadDigest" />, such that the bytes of all{" "}
                <Rs n="code" /> are <R n="uri_unreserved" />.
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>

        <Hsection n="uris_entry" title="Entry URIs">
          <PreviewScope>
            <P>
              An{" "}
              <DefType n="EntryURI" r="Entry URI" rs="Entry URIs">
                Entry URI
              </DefType>{" "}
              identifies an <R n="Entry" />, by specifying a{" "}
              <R n="NamespaceId" />, <R n="SubspaceId" /> and{" "}
              <R n="Path" />; the identified <R n="Entry" />{" "}
              is — conceptually speaking — the globally{" "}
              <R n="entry_newer">newest</R> <R n="Entry" /> of the given{" "}
              <R n="NamespaceId" />, <R n="SubspaceId" /> and{" "}
              <R n="Path" />. In practice, the URI will resolve to the{" "}
              <R n="entry_newer">newest</R> matching <R n="Entry" />{" "}
              known to the communication partner.
            </P>

            <P>
              An <R n="EntryURI" />{" "}
              can optionally and additionally identify (a single contiguous
              subslice of) the <R n="Payload" /> of the identified{" "}
              <R n="Entry" />. The bytewise, zero-indexed <R n="Payload" />{" "}
              subslice is specified by an optional start index, and an optional
              end index. If both are missing, the <R n="EntryURI" />{" "}
              refers to the <R n="Entry" /> only, without its{" "}
              <R n="Payload" />. If both are given, the indices describe the
              identified subslice (the start index is inclusive, but the end
              index is exclusive). If only the start index is given, then the
              subslice extends to the end of the{" "}
              <R n="Payload" />. If only the end index is given, the subslcie
              starts at the initial byte of the <R n="Payload" />.
            </P>

            <P>
              An <R n="EntryURI" /> can optionally contain an expected{" "}
              <R n="PayloadDigest" />. If the <R n="Entry" />{" "}
              it would address does not have a <R n="Payload" /> of the expected
              {" "}
              <R n="PayloadDigest" />, then the URI identifies nothing instead.
              This feature <Em>cannot</Em> be used to address old{" "}
              <Rs n="Entry" /> which had been{" "}
              <R n="prefix_pruning">prefix-pruned</R>.
            </P>

            <P>
              A <Def n="entry_uri_relative" r="relative" /> <R n="EntryURI" />
              {" "}
              has no <R n="NamespaceId" /> and no{" "}
              <R n="SubspaceId" />, instead it has a non-empty sequence of
              dot-segments (<Code>.</Code> or <Code>..</Code>). A{" "}
              <R n="entry_uri_relative" /> <R n="EntryURI" /> identifies an{" "}
              <R n="Entry" /> relative to a triplet of a{" "}
              <Def n="entry_uri_base" r="base" /> <R n="NamespaceId" />,{" "}
              <R n="entry_uri_base" /> <R n="SubspaceId" />, and{" "}
              <R n="entry_uri_base" /> <R n="Path" />. It identifies the same
              {" "}
              <R n="Entry" /> as the absolute <R n="EntryURI" /> whose{" "}
              <R n="NamespaceId" /> is the <R n="entry_uri_base" />{" "}
              <R n="NamespaceId" />, whose <R n="SubspaceId" /> is the{" "}
              <R n="entry_uri_base" /> <R n="SubspaceId" />, and whose{" "}
              <R n="Path" /> is obtained from the <R n="entry_uri_base" />{" "}
              <R n="Path" /> by removing as many <Rs n="Component" />{" "}
              from the end as there are <Code>..</Code>{" "}
              dot-segments. If this would result in removing a{" "}
              <R n="Component" /> from the empty <R n="Path" />, then the{" "}
              <R n="entry_uri_relative" /> <R n="EntryURI" />{" "}
              identifies nothing instead.
            </P>
          </PreviewScope>

          <Hsection n="uris_entry_syntax" title="Entry URI Syntax">
            <P>
              <Rb n="EntryURI" /> syntax follows the{" "}
              <AE href="https://datatracker.ietf.org/doc/html/rfc3986">
                RFC 3986
              </AE>{" "}
              URI syntax. In particular:
            </P>

            <Ul>
              <Li>
                The{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.1">
                  scheme
                </AE>{" "}
                is <Code>willowentry</Code>.<Alj>
                  Should this be <Code>willow</Code> only?
                </Alj>
              </Li>
              <Li>
                The{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2">
                  host
                </AE>{" "}
                subcomponent of the{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.2">
                  authority
                </AE>{" "}
                is given by a <R n="code" /> of the <R n="NamespaceId" /> in
                {" "}
                <R n="UriEncodeNamespaceId" />, followed by an ASCII{" "}
                <Code>!</Code>, followed by a <R n="code" /> of the{" "}
                <R n="SubspaceId" /> in{" "}
                <R n="UriEncodeSubspaceId" />. The authority must be present for
                absolute <Rs n="EntryURI" />, and must not be present for{" "}
                <R n="entry_uri_relative" /> <Rs n="EntryURI" />.
              </Li>
              <Li>
                The{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.3">
                  path segments
                </AE>{" "}
                are given by the <Rs n="Component" /> of the <R n="Path" />{" "}
                of the <R n="Entry" /> to identify. The <R n="uri_unreserved" />
                {" "}
                bytes of a <R n="Component" />{" "}
                are encoded as ASCII, all other bytes are encoded using{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-2.1">
                  percent encoding
                </AE>. For <R n="entry_uri_relative" />{" "}
                <Rs n="EntryURI" />, the segments must be receded by the
                dot-segments, each followed by a <Code>/</Code>.
              </Li>
              <Li>
                The{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.4">
                  query component
                </AE>{" "}
                is a (possibly empty) sequence of the following strings — in any
                order, separated by <Code>&</Code>{" "}
                — where no option occurs more than once in the URI:
                <Ul>
                  <Li>
                    To indicate a <R n="Payload" />{" "}
                    slice start index, the ASCII string{" "}
                    <Code>
                      from=<EscapeHtml>{"<"}decimal{">"}</EscapeHtml>
                    </Code>, where{" "}
                    <Code>
                      <EscapeHtml>{"<"}decimal{">"}</EscapeHtml>
                    </Code>{" "}
                    denotes an ASCII base-ten representation of the start index
                    (with an arbitrary number of leading zeros).
                  </Li>
                  <Li>
                    To indicate a <R n="Payload" />{" "}
                    slice end index, the ASCII string{" "}
                    <Code>
                      to=<EscapeHtml>{"<"}decimal{">"}</EscapeHtml>
                    </Code>, where{" "}
                    <Code>
                      <EscapeHtml>{"<"}decimal{">"}</EscapeHtml>
                    </Code>{" "}
                    denotes an ASCII base-ten representation of the end index
                    (with an arbitrary number of leading zeros).
                  </Li>
                  <Li>
                    To indicate an expected{" "}
                    <R n="PayloadDigest" />, the ASCII string{" "}
                    <Code>
                      digest=<EscapeHtml>{"<"}code{">"}</EscapeHtml>
                    </Code>, where{" "}
                    <Code>
                      <EscapeHtml>{"<"}code{">"}</EscapeHtml>
                    </Code>{" "}
                    is a <R n="code" /> of the expected <R n="PayloadDigest" />
                    {" "}
                    in <R n="UriEncodePayloadDigest" />.
                  </Li>
                </Ul>

                If both a start and an end index are specified and the end
                offset is equal or less than the start offset, the{" "}
                <R n="EntryURI" /> identifies only the <R n="Entry" />{" "}
                but no subslice of its <R n="Payload" />.
              </Li>
            </Ul>
          </Hsection>

          <Hsection n="uris_entry_examples" title="Entry URI Examples">
            <P>
              Here are some examples of valid <Rs n="EntryURI" />:
            </P>

            <Ul>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>/
                </Code>{" "}
                (the <R n="Path" /> ends with an empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>
                  {"///"}
                  <SkyBlue>ideas</SkyBlue>
                </Code>{" "}
                (the <R n="Path" /> has two empty <Rs n="Component" />{" "}
                in the middle)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>
                </Code>{" "}
                (empty <R n="Path" />)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/
                </Code>{" "}
                (<R n="Path" /> consists of a single, empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>recipes</SkyBlue>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<SkyBlue>
                    .
                  </SkyBlue>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=0</Orange> (identifying an{" "}
                  <R n="Entry" /> and its complete <R n="Payload" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>to=17</Orange> (identifying an{" "}
                  <R n="Entry" />{" "}
                  and the first 17 bytes (bytes zero to sixteen inclusive) of
                  its <R n="Payload" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>to=6&from=4</Orange> (identifying an{" "}
                  <R n="Entry" /> and its <R n="Payload" /> bytes four and five)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&to=5</Orange> (identifying only an
                  {" "}
                  <R n="Entry" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=99&to=12</Orange> (identifying only an
                  {" "}
                  <R n="Entry" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&digest=b287afb0</Orange>
                </Code>
              </Li>
            </Ul>

            <P>
              Here are some non-examples — these are not valid{" "}
              <Rs n="EntryURI" />:
            </P>

            <Ul>
              <Li>
                <Code>
                  <Green>willowentry</Green>://
                </Code>{" "}
                (either missing authority or an empty list of dot-segments)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>recipes</SkyBlue>
                </Code>{" "}
                (<R n="entry_uri_relative" /> <R n="EntryURI" />{" "}
                must omit the authority)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>
                  <SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>recipes</SkyBlue>
                </Code>{" "}
                (no dot-segments in-between normal path segments)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>recipes</SkyBlue>?foo=bar
                </Code>{" "}
                (the specification allows no custom query components)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&from=7</Orange>
                </Code>{" "}
                (no duplicate query parts)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5to=7</Orange>
                </Code>{" "}
                (missing <Code>&</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>&from=5&from=7</Orange>
                </Code>{" "}
                (leading <Code>&</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&from=7&</Orange>
                </Code>{" "}
                (trailing <Code>&</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willowentry</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&&from=7</Orange>
                </Code>{" "}
                (duplicate <Code>&</Code>)
              </Li>
            </Ul>
          </Hsection>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
