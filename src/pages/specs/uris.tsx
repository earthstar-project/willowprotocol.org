import { Dir, File } from "macromania-outfs";
import {
  AE,
  Alj,
  Curly,
  Green,
  MarginCaption,
  Orange,
  Path,
  Purple,
  Quotes,
  SkyBlue,
  Vermillion,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Br, Code, Div, Em, EscapeHtml, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rc, Rs, Rsb } from "macromania-defref";
import {
  AccessStruct,
  ChoiceType,
  DefFunction,
  DefType,
  DefValue,
  SliceType,
  StructDef,
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
  EncodingRelationTemplate,
  ValAccess,
} from "../../encoding_macros.tsx";
import { C64Standalone } from "../../encoding_macros.tsx";
import { RawBytes } from "../../encoding_macros.tsx";
import { Pseudocode } from "macromania-pseudocode";

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
          This specifications describes the <Code>willow://</Code>{" "}
          <AE href="https://datatracker.ietf.org/doc/html/rfc3986">
            URI scheme
          </AE>{" "}
          for identifying Willow resources in a standardised, human-readable
          form. More specifically, each <Code>willow://</Code>{" "}
          URI identifies either an <R n="Entry" />{" "}
          (optionally together with a single contiguous slice of its{" "}
          <R n="Payload" />), or an <R n="AreaOfInterest" /> in some{" "}
          <R n="namespace" />.
        </P>

        <P>
          At a glance:
        </P>

        <Ul clazz="wide">
          <Li>
            <Rs n="Entry" />:{" "}
            <Code>
              <Green>willow</Green>://<Purple>
                namespace
              </Purple>.<Vermillion>subspace</Vermillion>/<SkyBlue>
                path
              </SkyBlue>/<SkyBlue>
                components
              </SkyBlue>?<Orange>select_features</Orange>#fragment
            </Code>
          </Li>
          <Li>
            <R n="Entry" /> example:{" "}
            <Code>
              <Green>willow</Green>://<Purple>
                family
              </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                blog
              </SkyBlue>/<SkyBlue>
                idea.txt
              </SkyBlue>?<Orange>from=5&digest=b287af</Orange>#about
            </Code>
          </Li>
          <Li>
            <R n="AreaOfInterest">Areas</R>:{" "}
            <Code>
              <Green>willow</Green>://<Purple>
                namespace
              </Purple>.<Vermillion>subspace</Vermillion>/<SkyBlue>
                path
              </SkyBlue>/<SkyBlue>
                components
              </SkyBlue>?area<Orange>&select_features</Orange>#fragment
            </Code>
          </Li>
          <Li>
            <R n="AreaOfInterest">Area</R> example:{" "}
            <Code>
              <Green>willow</Green>://<Purple>
                family
              </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                blog
              </SkyBlue>?area&<Orange>count=12</Orange>
            </Code>
          </Li>
        </Ul>

        <Hsection n="uris_preliminaries" title="Preliminaries">
          <PreviewScope>
            <P>
              We say a byte is a{" "}
              <Def n="uri_subdelimiter" r="sub-delimiter" rs="sub-delimiters" />
              <Marginale>
                This definition agrees with{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-2.2">
                  the <Code>sub-delim</Code> production of RFC 3986
                </AE>.
              </Marginale>{" "}
              if its numeric value is the ASCII code of one of the following
              characters:{" "}
              <Code>
                !$&'()*+,;=
              </Code>.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We say a byte is <Def n="uri_unreserved" r="unreserved" />
              <Marginale>
                This definition agrees with{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-2.3">
                  the <Code>unreserved</Code> production of RFC 3986
                </AE>.
              </Marginale>{" "}
              if its numeric value is the ASCII code of one of the following
              characters:{" "}
              <Code>
                -.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_~
              </Code>{" "}
              (i.e., alphanumerics and <Code>-</Code>, <Code>.</Code>,{" "}
              <Code>_</Code>, and <Code>~</Code>).
            </P>

            <P>
              We say a byte is <Def n="uri_reserved" /> if it is not{" "}
              <R n="uri_unreserved" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We say a sequence of three bytes is a{" "}
              <Def
                n="percent_encoding"
                r="percent encoding"
                rs="percent encodings"
              />
              <Marginale>
                This definition agrees with{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-2.1">
                  the <Code>pct-encoded</Code> production of RFC 3986
                </AE>.
              </Marginale>{" "}
              if its first byte is <Code>37</Code> (ASCII{" "}
              <Code>%</Code>), followed by two ASCII codes of hex digits (any of
              {" "}
              <Code>0123456789abcdefABCDEF</Code>). The two hex digits then
              encode the value of some arbitrary byte. For consistency, you
              should use uppercase hex digits<Marginale>
                This is what RFC 3986 suggests.
              </Marginale>.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We denote by <DefFunction n="percent_encode" />{" "}
              the function which maps a bytestring to the bytestring obtained by
              replacing with their <Rs n="percent_encoding" /> all{" "}
              <R n="uri_reserved" /> bytes.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We say a sequence of bytes is{" "}
              <Def n="uri_host_safe" r="host-safe" />
              <Marginale>
                This definition agrees with{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2">
                  the <Code>reg-name</Code> production of RFC 3986
                </AE>.
              </Marginale>{" "}
              if it consists solely of <R n="uri_unreserved" /> bytes,{" "}
              <R n="uri_subdelimiter" /> bytes, or <Rs n="percent_encoding" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We say a sequence of bytes is{" "}
              <Def n="uri_query_safe" r="query-safe" />
              <Marginale>
                This definition agrees with{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.4">
                  the <Code>query</Code> production of RFC 3986
                </AE>.
              </Marginale>{" "}
              if it consists solely of <R n="uri_unreserved" /> bytes,{" "}
              <R n="uri_subdelimiter" /> bytes,{" "}
              <Rs n="percent_encoding" />, or the ASCII code of any of the
              following characters:{" "}
              <Code>
                /?:@
              </Code>.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We say a sequence of bytes is{" "}
              <Def n="uri_fragment_safe" r="fragment-safe" />
              <Marginale>
                This definition agrees with{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.5">
                  the <Code>fragment</Code> production of RFC 3986
                </AE>.
              </Marginale>{" "}
              if it is <R n="uri_query_safe" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We denote by <DefFunction n="fragment_encode" />{" "}
              the function which maps a bytestring to the bytestring obtained by
              replacing with their <Rs n="percent_encoding" />{" "}
              all bytes which are neither <R n="uri_unreserved" /> bytes, nor
              {" "}
              <R n="uri_subdelimiter" />{" "}
              bytes, nor the ASCII code of any of the characters{" "}
              <Code>
                /?:@
              </Code>, nor part of a <Rs n="percent_encoding" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Rs n="Willow_URI" /> extend regular Willow <Rs n="Path" />{" "}
              with the <Rs n="dot_segment" />
              <Marginale>
                <Rsb n="dot_segment" />{" "}
                are fairly useless in absolute URIs, but they become important
                for constructing <R n="uri_references">URI References</R>.
              </Marginale>{" "}
              of{" "}
              <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.3">
                RFC 3986
              </AE>:
            </P>

            <Ul>
              <Li>
                the two{" "}
                <Def n="dot_segment" r="dot-segment" rs="dot-segments">
                  dot-segments
                </Def>{" "}
                are <Code>.</Code> and <Code>..</Code>,
              </Li>
              <Li>
                a <DefType n="URIPathComponent" rs="URIPathComponents" />{" "}
                is either a regular <Rs n="Component" /> or a{" "}
                <R n="dot_segment" />, and
              </Li>
              <Li>
                a <DefType n="URIPath" rs="URIPaths" /> is a sequence of{" "}
                <Rs n="URIPathComponent" />{" "}
                which, using the procedure defined below, converts into a valid
                {" "}
                <R n="Path" /> (i.e., respecting <R n="max_component_count" />
                {" "}
                and <R n="max_path_length" />).
              </Li>
            </Ul>

            <P>
              <Marginale>
                This procedure agrees with{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4">
                  that of RFC 3968
                </AE>.
              </Marginale>
              To convert a <R n="URIPath" /> into the Willow <R n="Path" />{" "}
              it identifies, repeat the following action for the first (<Quotes>
                leftmost
              </Quotes>) <R n="dot_segment" /> until no <Rs n="dot_segment" />
              {" "}
              remain:
            </P>

            <Ul>
              <Li>
                If the <R n="dot_segment" /> is <Code>.</Code>, remove it.
              </Li>
              <Li>
                If the <R n="dot_segment" /> is <Code>..</Code>{" "}
                and the very first <R n="URIPathComponent" /> of the (remaining)
                {" "}
                <R n="URIPath" />, remove it.
              </Li>
              <Li>
                If the <R n="dot_segment" /> is <Code>..</Code>{" "}
                but not the very first <R n="URIPathComponent" />{" "}
                of the (remaining){" "}
                <R n="URIPath" />, remove both it and the preceding{" "}
                <R n="Component" />.
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>

        <Hsection n="uris_parameters" title="Parameters">
          <P>
            <Marginale>
              See <R n="willow25_uris">Willow’25</R>{" "}
              for a default recommendation of parameters.
            </Marginale>
            In order to work with{" "}
            <Rs n="Willow_URI" />, one must first specify a full suite of
            instantiations of the{" "}
            <R n="willow_parameters">
              parameters of the core Willow data model
            </R>. Additionally, one needs:
          </P>

          <Ul>
            <Li>
              An <R n="encoding_relation" />{" "}
              <DefType
                n="URIEncodeNamespaceId"
                preview={
                  <P>
                    A protocol parameter of the <Rs n="Willow_URI" />, the{" "}
                    <R n="encoding_relation" /> for encoding{" "}
                    <Rs n="NamespaceId" />, producing <R n="uri_host_safe" />
                    {" "}
                    <Rs n="code" /> only.
                  </P>
                }
              />{" "}
              for <R n="NamespaceId" />, such that all <Rs n="code" /> are{" "}
              <R n="uri_host_safe" />.
            </Li>
            <Li>
              An <R n="encoding_relation" />{" "}
              <DefType
                n="URIEncodeSubspaceId"
                preview={
                  <P>
                    A protocol parameter of the <Rs n="Willow_URI" />, the{" "}
                    <R n="encoding_relation" /> for encoding{" "}
                    <Rs n="SubspaceId" />, producing <R n="uri_host_safe" />
                    {" "}
                    <Rs n="code" /> only.
                  </P>
                }
              />{" "}
              for <R n="SubspaceId" />, such that all <Rs n="code" /> are{" "}
              <R n="uri_host_safe" />.
            </Li>
            <Li>
              An <R n="encoding_relation" />{" "}
              <DefType
                n="URIEncodePayloadDigest"
                preview={
                  <P>
                    A protocol parameter of the <Rs n="Willow_URI" />, the{" "}
                    <R n="encoding_relation" /> for encoding{" "}
                    <Rs n="PayloadDigest" />, producing <R n="uri_query_safe" />
                    {" "}
                    <Rs n="code" /> only.
                  </P>
                }
              />{" "}
              for <R n="PayloadDigest" />, such that all <Rs n="code" /> are
              {" "}
              <R n="uri_query_safe" />.
            </Li>
          </Ul>
        </Hsection>

        <Hsection n="uris_semantics" title="URI Semantics">
          <PreviewScope>
            <P>
              <Marginale>
                Note that URIs always provide an absolute reference. Relative
                identification (think relative hyperlinks in HTML) are not URIs
                but{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-4.1">
                  URI references
                </AE>. We inherit their semantics for free.
              </Marginale>
              We first specify the information contained by each{" "}
              <Def n="Willow_URI" r="Willow URI" rs="Willow URIs" />,
              independent from URI syntax.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Each <R n="Willow_URI" /> identifies either an <R n="Entry" />
              {" "}
              (plus, optionally, a single contiguous slice of its{" "}
              <R n="Payload" />), or an <R n="AreaOfInterest" /> in some{" "}
              <R n="namespace" />. We call such <Rs n="Willow_URI" />{" "}
              <Def n="Entry_URI" r="Entry URI" rs="Entry URIs">Entry URIs</Def>
              {" "}
              and <Def n="Area_URI" r="Area URI" rs="Area URIs">Area URIs</Def>
              {" "}
              respectively.
            </P>
          </PreviewScope>

          <P>
            Each <R n="Willow_URI" /> contains a{" "}
            <R n="NamespaceId" />. This identifies the{" "}
            <R n="entry_namespace_id" /> of an <R n="Entry" />, or the{" "}
            <R n="namespace" /> in which to locate an <R n="AreaOfInterest" />.
          </P>

          <P>
            Each <R n="Willow_URI" /> contains a{" "}
            <R n="SubspaceId" />. This identifies the{" "}
            <R n="entry_subspace_id" /> of an <R n="Entry" />, or the{" "}
            <R n="AreaSubspace" /> of an <R n="AreaOfInterest" />.
          </P>

          <P>
            Each <R n="Willow_URI" /> contains a{" "}
            <R n="URIPath" />. This identifies the <R n="entry_path" /> of an
            {" "}
            <R n="Entry" />, or the <R n="AreaPath" /> of an{" "}
            <R n="AreaOfInterest" />.
          </P>

          <P>
            Each <R n="Willow_URI" /> contains a (possibly empty) sequence of
            {" "}
            <Sidenote
              note={
                <>
                  Typically <Em>not</Em> <Rs n="Willow_URI" />.
                </>
              }
            >
              URIs
            </Sidenote>, which serve as hints for how and/or where to obtain the
            identified data. Hints appearing early in the sequence should be
            tried before hints appearing later in the sequence. The sequence
            {" "}
            <Sidenote
              note={
                <>
                  Duplicates are fairly pointless though. Almost as pointless as
                  including the original <R n="Willow_URI" /> in the sequence.
                </>
              }
            >
              may
            </Sidenote>{" "}
            contain duplicates.
          </P>

          <P>
            Each <R n="Willow_URI" />{" "}
            may optionally contain a bytestring of application-specific{" "}
            <Sidenote
              note={
                <>
                  The content of this fragment is opaque to this specification;
                  the intended scope and functionality are detailed in{" "}
                  <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.5">
                    Section 3.5 of RFC 3986
                  </AE>.
                </>
              }
            >
              data
            </Sidenote>.
          </P>

          <Hsection n="uris_semantics_entry" title="Entry URI Semantics">
            <P>
              Each <R n="Entry_URI" /> optionally contains an expected{" "}
              <R n="PayloadDigest" />. Such an <R n="Entry_URI" />{" "}
              can only identify <Rs n="Entry" /> with that exact{" "}
              <R n="entry_payload_digest" />. In other words, this feature can
              be used to identify an <R n="Entry" /> with a specific{" "}
              <R n="Payload" />, filtering out all differently-payloaded{" "}
              <Rs n="Entry" /> which have been or{" "}
              <Sidenote
                note={
                  <>
                    Conformant <Rs n="store" /> will delete the overwritten{" "}
                    <R n="Entry" />, and using an <R n="Entry_URI" /> will not
                    {" "}
                    <Quotes>pin</Quotes>{" "}
                    it in any way. This feature will make it so that retrieval
                    deliberately <Em>fails</Em> if the intended <R n="Entry" />
                    {" "}
                    got pruned, it does not allow keeping pruned data around.
                  </>
                }
              >
                will
              </Sidenote>{" "}
              have been written in the same <R n="namespace" /> with the same
              {" "}
              <R n="entry_subspace_id" /> and <R n="entry_path" />.
            </P>

            <P>
              Each <R n="Entry_URI" /> optionally contains a starting index (a
              {" "}
              <R n="U64" />) and optionally contains an end index (also a{" "}
              <R n="U64" />), to identify a specific subslice of the{" "}
              <R n="Payload" /> of the <R n="Entry" /> in addition to the{" "}
              <R n="Entry" /> itself. The semantics are as follows:
            </P>

            <Ul>
              <Li>
                If neither index is present, the <R n="Entry_URI" />{" "}
                identifies only an <R n="Entry" /> but not its{" "}
                <R n="Payload" />.
              </Li>
              <Li>
                If both indices are present, the <R n="Entry_URI" />{" "}
                identifies not only an{" "}
                <R n="Entry" />, but also the zero-indexed subslice of its{" "}
                <R n="Payload" />, starting at the start index (inclusive) and
                up until the end index (exclusive). If the start index is
                strictly greater than the end index, treat the{" "}
                <R n="Entry_URI" />{" "}
                as if its end index was set to the start index instead. Indexes
                strictly greater than the <R n="Payload" />{" "}
                length are truncated<Marginale>
                  Giving an end index which is too large identifies the slice
                  extending to the very end of the{" "}
                  <R n="Payload" />; and giving a start index which is too large
                  identifies the empty slice, positioned at the very end of the
                  {" "}
                  <R n="Payload" />.
                </Marginale>{" "}
                down to the exact <R n="Payload" /> length for this purpose.
              </Li>
              <Li>
                If only one index is present, the other defaults to zero (for
                the start index) or the length of the <R n="Payload" />{" "}
                (for the end index), and then the preceding case applies.
              </Li>
            </Ul>

            <P>
              Summarising as a data type:
            </P>

            <Pseudocode n="entry_uri_definition">
              <StructDef
                comment={
                  <>
                    The data of an <R n="Entry_URI" />.
                  </>
                }
                id={["EntryURI", "EntryURI", "EntryURIs"]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="entry_namespace_id" /> of the identified
                          {" "}
                          <R n="Entry" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "namespace_id",
                          "EntryURINamespaceId",
                          "namespace_ids",
                        ],
                        <R n="NamespaceId" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="entry_subspace_id" /> of the identified{" "}
                          <R n="Entry" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "subspace_id",
                          "EntryURISubspaceId",
                          "subspace_ids",
                        ],
                        <R n="SubspaceId" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="URIPath" /> indicating the{" "}
                          <R n="entry_path" /> of the identified{" "}
                          <R n="Entry" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "path",
                          "EntryURIPath",
                          "path",
                        ],
                        <R n="URIPath" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The resolution hints for the <R n="Entry_URI" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "hints",
                          "EntryURIHints",
                          "hints",
                        ],
                        <SliceType
                          children={[
                            <AE href="https://datatracker.ietf.org/doc/html/rfc3986">
                              URI
                            </AE>,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The optional, application-specific extra data
                          associated with this <R n="Entry_URI" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "fragment",
                          "EntryURIFragment",
                          "fragment",
                        ],
                        <ChoiceType
                          types={[
                            <SliceType children={[<R n="U8" />]} />,
                            <DefVariant
                              n="entry_uri_fragment_none"
                              r="none"
                            />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The optional expected <R n="PayloadDigest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "expected_digest",
                          "EntryURIExpectedDigest",
                          "expected_digests",
                        ],
                        <ChoiceType
                          types={[
                            <R n="PayloadDigest" />,
                            <DefVariant
                              n="entry_uri_expected_digest_none"
                              r="none"
                            />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The optional start index of the <R n="Payload" />{" "}
                          slice.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "payload_from",
                          "EntryURIPayloadFrom",
                          "payload_froms",
                        ],
                        <ChoiceType
                          types={[
                            <R n="U64" />,
                            <DefVariant
                              n="entry_uri_payload_from_none"
                              r="none"
                            />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The optional end index of the <R n="Payload" /> slice.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "payload_to",
                          "EntryURIPayloadTo",
                          "payload_to",
                        ],
                        <ChoiceType
                          types={[
                            <R n="U64" />,
                            <DefVariant
                              n="entry_uri_payload_to_none"
                              r="none"
                            />,
                          ]}
                        />,
                      ],
                    },
                  },
                ]}
              />
            </Pseudocode>
          </Hsection>

          <Hsection n="uris_semantics_area" title="Area URI Semantics">
            <P>
              Each <R n="Area_URI" /> contains a <R n="U64" /> to indicate the
              {" "}
              <R n="aoi_count" /> of the identified <R n="AreaOfInterest" />.
            </P>

            <P>
              Each <R n="Area_URI" /> contains a <R n="U64" /> to indicate the
              {" "}
              <R n="aoi_size" /> of the identified <R n="AreaOfInterest" />.
            </P>

            <P>
              Each <R n="Area_URI" /> contains a <R n="Timestamp" />{" "}
              to indicate the <R n="TimeRangeStart" /> of the <R n="AreaTime" />
              {" "}
              of the <R n="aoi_area" /> of the identified{" "}
              <R n="AreaOfInterest" />.
            </P>

            <P>
              Each <R n="Area_URI" /> optionally contains a <R n="Timestamp" />
              {" "}
              to indicate the <R n="TimeRangeEnd" /> of the <R n="AreaTime" />
              {" "}
              of the <R n="aoi_area" /> of the identified{" "}
              <R n="AreaOfInterest" />. If this <R n="Timestamp" />{" "}
              is not present, then the <R n="TimeRangeEnd" /> is{" "}
              <R n="range_open" />.
            </P>

            <P>
              Summarising as a data type (the first five fields are identical to
              those of <R n="EntryURI" />):
            </P>

            <Pseudocode n="area_uri_definition">
              <StructDef
                comment={
                  <>
                    The data of an <R n="Area_URI" />.
                  </>
                }
                id={["AreaURI", "AreaURI", "AreaURIs"]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="NamespaceId" /> in which to identify the
                          {" "}
                          <R n="AreaOfInterest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "namespace_id",
                          "AreaURINamespaceId",
                          "namespace_ids",
                        ],
                        <R n="NamespaceId" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="AreaSubspace" /> of the <R n="aoi_area" />
                          {" "}
                          of the identified <R n="AreaOfInterest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "subspace_id",
                          "AreaURISubspaceId",
                          "subspace_ids",
                        ],
                        <R n="SubspaceId" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="URIPath" /> indicating the{" "}
                          <R n="AreaPath" /> of the <R n="aoi_area" />{" "}
                          of the identified <R n="AreaOfInterest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "path",
                          "AreaURIPath",
                          "path",
                        ],
                        <R n="URIPath" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The resolution hints for the <R n="Area_URI" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "hints",
                          "AreaURIHints",
                          "hints",
                        ],
                        <SliceType
                          children={[
                            <AE href="https://datatracker.ietf.org/doc/html/rfc3986">
                              URI
                            </AE>,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The optional, application-specific extra data
                          associated with this <R n="Area_URI" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "fragment",
                          "AreaURIFragment",
                          "fragment",
                        ],
                        <ChoiceType
                          types={[
                            <SliceType children={[<R n="U8" />]} />,
                            <DefVariant
                              n="area_uri_fragment_none"
                              r="none"
                            />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="aoi_count" /> of the identified{" "}
                          <R n="AreaOfInterest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "max_count",
                          "AreaURIMaxCount",
                          "max_counts",
                        ],
                        <R n="U64" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="aoi_size" /> of the identified{" "}
                          <R n="AreaOfInterest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "max_size",
                          "AreaURIMaxSize",
                          "max_size",
                        ],
                        <R n="U64" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="TimeRangeStart" /> of the <R n="AreaTime" />
                          {" "}
                          of the <R n="aoi_area" /> of the identified{" "}
                          <R n="AreaOfInterest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "timestamp_from",
                          "AreaURITimestampFrom",
                          "timestamp_from",
                        ],
                        <R n="Timestamp" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <R n="TimeRangeEnd" /> of the <R n="AreaTime" />
                          {" "}
                          of the <R n="aoi_area" /> of the identified{" "}
                          <R n="AreaOfInterest" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "timestamp_to",
                          "AreaURITimestampTo",
                          "timestamp_to",
                        ],
                        <ChoiceType
                          types={[
                            <R n="Timestamp" />,
                            <DefVariant
                              n="area_uri_timestamp_to_none"
                              r="none"
                            />,
                          ]}
                        />,
                      ],
                    },
                  },
                ]}
              />
            </Pseudocode>
          </Hsection>
        </Hsection>

        <Hsection n="uris_syntax" title="URI Syntax">
          <P>
            We now define the syntax of a human-readable,{" "}
            <AE href="https://datatracker.ietf.org/doc/html/rfc3986">
              RFC 3986
            </AE>-compatible encoding for{" "}
            <Rs n="Willow_URI" />, and give some example <Rs n="code" />.
          </P>

          <Hsection n="uris_entry_syntax" title="Entry URI Syntax">
            <EncodingRelationTemplate
              n="EncodeEntryURI"
              valType={<R n="EntryURI" />}
              preDefs={
                <>
                  <P>
                    Let{" "}
                    <DefValue n="entry_uri_encoded_hints" r="encoded_hints" />
                    {" "}
                    be the bytestring obtained by applying{" "}
                    <R n="percent_encode" /> to every URI in{" "}
                    <ValAccess field="EntryURIHints" />{" "}
                    and joining the results with <Code>59</Code> (ASCII{" "}
                    <Code>;</Code>) bytes (with neither leading nor trailing
                    {" "}
                    <Code>;</Code>).
                  </P>

                  <P>
                    Let <DefValue n="entry_uri_query" r="query_component" />
                    {" "}
                    be a bytestring obtained by concatenating the following
                    bytestrings in arbitrary order, joining non-empty ones with
                    {" "}
                    <Code>38</Code> (ASCII{" "}
                    <Code>&</Code>) bytes (with neither leading nor trailing
                    {" "}
                    <Code>&</Code>):
                  </P>

                  <Encoding
                    idPrefix="uri_entry_query"
                    bitfields={[]}
                    contents={[
                      <EncConditional
                        condition={
                          <>
                            <ValAccess field="EntryURIHints" />{" "}
                            is not the empty sequence
                          </>
                        }
                      >
                        the bytes <Code>[104, 105, 110, 116, 115, 61]</Code>
                        {" "}
                        (ASCII <Code>hints=</Code>), followed by{" "}
                        <R n="entry_uri_encoded_hints" />
                      </EncConditional>,
                      <EncConditional
                        condition={
                          <Code>
                            <ValAccess field="EntryURIExpectedDigest" /> !={" "}
                            <R n="entry_uri_expected_digest_none" />
                          </Code>
                        }
                      >
                        the bytes{" "}
                        <Code>[100, 105, 103, 101, 115, 116, 61]</Code> (ASCII
                        {" "}
                        <Code>digest=</Code>), followed by{" "}
                        <CodeFor notStandalone enc="URIEncodePayloadDigest">
                          <ValAccess field="EntryURIExpectedDigest" />
                        </CodeFor>
                      </EncConditional>,
                      <EncConditional
                        condition={
                          <Code>
                            <ValAccess field="EntryURIPayloadFrom" /> !={" "}
                            <R n="entry_uri_payload_from_none" />
                          </Code>
                        }
                      >
                        the bytes <Code>[102, 114, 111, 109, 61]</Code> (ASCII
                        {" "}
                        <Code>from=</Code>), followed by an ASCII decimal
                        encoding of <ValAccess field="EntryURIPayloadFrom" />
                        {" "}
                        with arbitrarily many leading zeros
                      </EncConditional>,
                      <EncConditional
                        condition={
                          <Code>
                            <ValAccess field="EntryURIPayloadTo" /> !={" "}
                            <R n="entry_uri_payload_to_none" />
                          </Code>
                        }
                      >
                        the bytes <Code>[116, 111, 61]</Code> (ASCII{" "}
                        <Code>to=</Code>), followed by an ASCII decimal encoding
                        of <ValAccess field="EntryURIPayloadTo" />{" "}
                        with arbitrarily many leading zeros
                      </EncConditional>,
                    ]}
                  />
                </>
              }
              bitfields={[]}
              contents={[
                <>
                  The bytes{" "}
                  <Code>[119, 105, 108, 108, 111, 119, 58, 47, 47]</Code> (ASCII
                  {" "}
                  <Code>willow://</Code>).
                </>,
                <CodeFor enc="URIEncodeNamespaceId">
                  <ValAccess field="EntryURINamespaceId" />
                </CodeFor>,
                <>
                  The byte <Code>46</Code> (ASCII <Code>.</Code>).
                </>,
                <CodeFor enc="URIEncodeSubspaceId">
                  <ValAccess field="EntryURISubspaceId" />
                </CodeFor>,
                <EncIterator
                  val={
                    <>
                      <R n="URIPathComponent" />{" "}
                      <DefValue n="uri_entry_path_comp" r="comp" />
                    </>
                  }
                  iter={<ValAccess field="EntryURIPath" />}
                >
                  <Encoding
                    idPrefix="uri_entry_path"
                    bitfields={[]}
                    contents={[
                      <>
                        The byte <Code>47</Code> (ASCII <Code>/</Code>).
                      </>,
                      <>
                        <Ul>
                          <Li>
                            If <R n="uri_entry_path_comp" /> is the{" "}
                            <R n="dot_segment" /> <Code>.</Code>, the byte{" "}
                            <Code>46</Code> (ASCII <Code>.</Code>),
                          </Li>
                          <Li>
                            else, if <R n="uri_entry_path_comp" /> is the{" "}
                            <R n="dot_segment" /> <Code>..</Code>, the bytes
                            {" "}
                            <Code>[46, 46]</Code> (ASCII <Code>..</Code>),
                          </Li>
                          <Li>
                            else, the result of applying{" "}
                            <R n="percent_encode" /> to the <R n="Component" />.
                          </Li>
                        </Ul>
                      </>,
                    ]}
                  />
                </EncIterator>,
                <EncConditional
                  condition={
                    <>
                      <R n="entry_uri_query" /> is not the empty string
                    </>
                  }
                >
                  the byte <Code>63</Code> (ASCII <Code>?</Code>)
                </EncConditional>,
                <RawBytes>
                  <R n="entry_uri_query" />
                </RawBytes>,
                <EncConditional
                  condition={
                    <Code>
                      <ValAccess field="EntryURIFragment" /> !={" "}
                      <R n="entry_uri_fragment_none" />
                    </Code>
                  }
                >
                  the byte <Code>35</Code> (ASCII{" "}
                  <Code>#</Code>), followed by the result of applying{" "}
                  <R n="fragment_encode" /> to{" "}
                  <ValAccess field="EntryURIFragment" />
                </EncConditional>,
              ]}
            />
          </Hsection>

          <Hsection n="uris_entry_examples" title="Entry URI Examples">
            <P>
              Here are some examples of valid <Rs n="Entry_URI" />:
            </P>

            <Ul>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>/
                </Code>{" "}
                (the <R n="Path" /> ends with an empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
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
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>
                </Code>{" "}
                (empty <R n="Path" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/
                </Code>{" "}
                (<R n="Path" /> consists of a single empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>.</SkyBlue>/<SkyBlue>
                    ideas
                  </SkyBlue>/<SkyBlue>..</SkyBlue>
                </Code>{" "}
                (<R n="Path" /> is equivalent to <Path components={["blog"]} />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    chess
                  </SkyBlue>/<SkyBlue>..</SkyBlue>/<SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>..</SkyBlue>/<SkyBlue>blog</SkyBlue>
                </Code>{" "}
                (<R n="Path" /> is equivalent to <Path components={["blog"]} />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>
                    hints=wgps%3A%2F%2Fworm-blossom.org%3A1234%2Fexample;wtp%3A%2F%2Fworm-blossom.org%3A1235%2Fexample
                  </Orange>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>digest=b287afb0</Orange>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>digest=b287afb0</Orange>#blabla%0A
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=0</Orange> (identifying an{" "}
                  <R n="Entry" /> and its complete <R n="Payload" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>to=17</Orange> (identifying an{" "}
                  <R n="Entry" />{" "}
                  and the first 17 bytes (bytes zero to sixteen inclusive) of
                  its <R n="Payload" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>to=6&from=4</Orange> (identifying an{" "}
                  <R n="Entry" /> and its <R n="Payload" /> bytes four and five)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&to=5</Orange> (identifying an{" "}
                  <R n="Entry" /> and an empty subslice of its{" "}
                  <R n="Payload" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=99&to=12</Orange> (identifying an{" "}
                  <R n="Entry" /> and an empty subslice of its{" "}
                  <R n="Payload" />)
                </Code>
              </Li>
            </Ul>
          </Hsection>

          <Hsection n="uris_area_syntax" title="Area URI Syntax">
            <EncodingRelationTemplate
              n="EncodeAreaURI"
              valType={<R n="AreaURI" />}
              preDefs={
                <>
                  <P>
                    <Marginale>
                      This encoding works mostly the same way as that for{" "}
                      <Rs n="EntryURI" />. The only differences are the
                      construction of{" "}
                      <R n="area_uri_query" />, and the query fragment always
                      starting with <Code>?area</Code>
                    </Marginale>
                    Let{" "}
                    <DefValue n="area_uri_encoded_hints" r="encoded_hints" />
                    {" "}
                    be the bytestring obtained by applying{" "}
                    <R n="percent_encode" /> to the URIs in{" "}
                    <ValAccess field="AreaURIHints" />{" "}
                    and joining the results with <Code>59</Code> (ASCII{" "}
                    <Code>;</Code>) bytes (with neither leading nor trailing
                    {" "}
                    <Code>;</Code>).
                  </P>

                  <P>
                    Let <DefValue n="area_uri_query" r="query_component" />{" "}
                    be a bytestring obtained by concatenating the following
                    bytestrings in arbitrary order, joining non-empty ones with
                    {" "}
                    <Code>38</Code> (ASCII{" "}
                    <Code>&</Code>) bytes (with neither leading nor trailing
                    {" "}
                    <Code>&</Code>):
                  </P>

                  <Encoding
                    idPrefix="uri_area_query"
                    bitfields={[]}
                    contents={[
                      <EncConditional
                        condition={
                          <>
                            <ValAccess field="AreaURIHints" />{" "}
                            is not the empty sequence
                          </>
                        }
                      >
                        the bytes <Code>[104, 105, 110, 116, 115, 61]</Code>
                        {" "}
                        (ASCII <Code>hints=</Code>), followed by{" "}
                        <R n="area_uri_encoded_hints" />
                      </EncConditional>,
                      <EncConditional
                        condition={
                          <>
                            <Code>
                              <ValAccess field="AreaURIMaxCount" /> != 0
                            </Code>, or if{" "}
                            <Code>
                              <ValAccess field="AreaURIMaxCount" /> == 0
                            </Code>{" "}
                            but you feel like encoding it explicitly anyway
                          </>
                        }
                      >
                        the bytes <Code>[99, 111, 117, 110, 116, 61]</Code>{" "}
                        (ASCII{" "}
                        <Code>count=</Code>), followed by an ASCII decimal
                        encoding of <ValAccess field="AreaURIMaxCount" />{" "}
                        with arbitrarily many leading zeros
                      </EncConditional>,
                      <EncConditional
                        condition={
                          <>
                            <Code>
                              <ValAccess field="AreaURIMaxSize" /> != 0
                            </Code>, or if{" "}
                            <Code>
                              <ValAccess field="AreaURIMaxSize" /> == 0
                            </Code>{" "}
                            but you feel like encoding it explicitly anyway
                          </>
                        }
                      >
                        the bytes <Code>[115, 105, 112, 101, 61]</Code> (ASCII
                        {" "}
                        <Code>size=</Code>), followed by an ASCII decimal
                        encoding of <ValAccess field="AreaURIMaxSize" />{" "}
                        with arbitrarily many leading zeros
                      </EncConditional>,
                      <EncConditional
                        condition={
                          <>
                            <Code>
                              <ValAccess field="AreaURITimestampFrom" /> != 0
                            </Code>, or if{" "}
                            <Code>
                              <ValAccess field="AreaURITimestampFrom" /> == 0
                            </Code>{" "}
                            but you feel like encoding it explicitly anyway
                          </>
                        }
                      >
                        the bytes <Code>[102, 114, 111, 109, 61]</Code> (ASCII
                        {" "}
                        <Code>from=</Code>), followed by an ASCII decimal
                        encoding of <ValAccess field="AreaURITimestampFrom" />
                        {" "}
                        with arbitrarily many leading zeros
                      </EncConditional>,
                      <EncConditional
                        condition={
                          <Code>
                            <ValAccess field="AreaURITimestampTo" /> !={" "}
                            <R n="area_uri_timestamp_to_none" />
                          </Code>
                        }
                      >
                        the bytes <Code>[116, 111, 61]</Code> (ASCII{" "}
                        <Code>to=</Code>), followed by an ASCII decimal encoding
                        of <ValAccess field="AreaURITimestampTo" />{" "}
                        with arbitrarily many leading zeros
                      </EncConditional>,
                    ]}
                  />
                </>
              }
              bitfields={[]}
              contents={[
                <>
                  The bytes{" "}
                  <Code>[119, 105, 108, 108, 111, 119, 58, 47, 47]</Code> (ASCII
                  {" "}
                  <Code>willow://</Code>).
                </>,
                <CodeFor enc="URIEncodeNamespaceId">
                  <ValAccess field="AreaURINamespaceId" />
                </CodeFor>,
                <>
                  The byte <Code>46</Code> (ASCII <Code>.</Code>).
                </>,
                <CodeFor enc="URIEncodeSubspaceId">
                  <ValAccess field="AreaURISubspaceId" />
                </CodeFor>,
                <EncIterator
                  val={
                    <>
                      <R n="URIPathComponent" />{" "}
                      <DefValue n="uri_area_path_comp" r="comp" />
                    </>
                  }
                  iter={<ValAccess field="AreaURIPath" />}
                >
                  <Encoding
                    idPrefix="uri_area_path"
                    bitfields={[]}
                    contents={[
                      <>
                        The byte <Code>47</Code> (ASCII <Code>/</Code>).
                      </>,
                      <>
                        <Ul>
                          <Li>
                            If <R n="uri_area_path_comp" /> is the{" "}
                            <R n="dot_segment" /> <Code>.</Code>, the byte{" "}
                            <Code>46</Code> (ASCII <Code>.</Code>),
                          </Li>
                          <Li>
                            else, if <R n="uri_area_path_comp" /> is the{" "}
                            <R n="dot_segment" /> <Code>..</Code>, the bytes
                            {" "}
                            <Code>[46, 46]</Code> (ASCII <Code>..</Code>),
                          </Li>
                          <Li>
                            else, the result of applying{" "}
                            <R n="percent_encode" /> to the <R n="Component" />.
                          </Li>
                        </Ul>
                      </>,
                    ]}
                  />
                </EncIterator>,
                <>
                  The bytes <Code>[38, 97, 114, 101, 97]</Code> (ASCII{" "}
                  <Code>&area</Code>).
                </>,
                <EncConditional
                  condition={
                    <>
                      <R n="area_uri_query" /> is not the empty string
                    </>
                  }
                >
                  the byte <Code>38</Code> (ASCII <Code>&</Code>)
                </EncConditional>,
                <RawBytes>
                  <R n="area_uri_query" />
                </RawBytes>,
                <EncConditional
                  condition={
                    <Code>
                      <ValAccess field="AreaURIFragment" /> !={" "}
                      <R n="area_uri_fragment_none" />
                    </Code>
                  }
                >
                  the byte <Code>35</Code> (ASCII{" "}
                  <Code>#</Code>), followed by the result of applying{" "}
                  <R n="fragment_encode" /> to{" "}
                  <ValAccess field="AreaURIFragment" />
                </EncConditional>,
              ]}
            />
          </Hsection>

          <Hsection n="uris_area_examples" title="Area URI Examples">
            <P>
              Here are some examples of valid <Rs n="Area_URI" />:
            </P>

            <Ul>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>?area
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>/?area
                </Code>{" "}
                (the <R n="Path" /> ends with an empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>
                  {"///"}
                  <SkyBlue>ideas</SkyBlue>?area
                </Code>{" "}
                (the <R n="Path" /> has two empty <Rs n="Component" />{" "}
                in the middle)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>?area
                </Code>{" "}
                (empty <R n="Path" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/?area
                </Code>{" "}
                (<R n="Path" /> consists of a single empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>.</SkyBlue>/<SkyBlue>
                    ideas
                  </SkyBlue>/<SkyBlue>..</SkyBlue>?area
                </Code>{" "}
                (<R n="Path" /> is equivalent to <Path components={["blog"]} />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    chess
                  </SkyBlue>/<SkyBlue>..</SkyBlue>/<SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>..</SkyBlue>/<SkyBlue>blog</SkyBlue>?area
                </Code>{" "}
                (<R n="Path" /> is equivalent to <Path components={["blog"]} />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?area&<Orange>
                    hints=wgps%3A%2F%2Fworm-blossom.org%3A1234%2Fexample;wtp%3A%2F%2Fworm-blossom.org%3A1235%2Fexample
                  </Orange>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?area&<Orange>count=5&size=0</Orange>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?area&<Orange>count=5&size=0</Orange>#blabla%0A
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?area&<Orange>from=0</Orange>{" "}
                  (redundantly specifying the <R n="TimeRangeStart" /> of the
                  {" "}
                  <R n="TimeRange" /> as zero; the <R n="TimeRangeEnd" /> is
                  {" "}
                  <R n="range_open" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?area&<Orange>to=17</Orange> (specifying the{" "}
                  <R n="TimeRangeEnd" /> of the <R n="TimeRange" /> as 17)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>.<Vermillion>alfie</Vermillion>/<SkyBlue>
                    blog
                  </SkyBlue>?area&<Orange>to=6&from=4</Orange> (specifying the
                  {" "}
                  <R n="TimeRange" /> from four to six)
                </Code>
              </Li>
            </Ul>
          </Hsection>
        </Hsection>

        <Hsection n="uri_references" title="URI References">
          <P>
            <Rsb n="Willow_URI" />{" "}
            identify resources absolutely. Many applications benefit from
            relative addressing, in the vein of{" "}
            <Quotes>
              starting from this <R n="Entry" />, apply the <R n="URIPath" />
              {" "}
              <Code>../image.png</Code> to obtain a different <R n="Entry" />
            </Quotes>. RFC 3986 provides this feature for arbitrary URIs — so,
            in particular, also for <Rs n="Willow_URI" /> — using its concept of
            {" "}
            <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-4.1">
              URI References
            </AE>.
          </P>

          <P>
            Implementations of this specification should provide support both
            for pure <Rs n="Willow_URI" /> and for URI References using{" "}
            <Rs n="Willow_URI" />.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
