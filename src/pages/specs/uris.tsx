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
                <Alj>
                  For Willow25, these would simply be base-16 encoding of public
                  keys and digests.
                </Alj>
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
              An (absolute){" "}
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
          </PreviewScope>

          <Hsection n="uris_entry_semantics" title="Entry URI Semantics">
            <PreviewScope>
              <P>
                The <R n="NamespaceId" /> of an <R n="EntryURI" />{" "}
                is optional. If it is missing, we say the <R n="EntryURI" /> is
                {" "}
                <Def n="namespace_relative" r="namespace-relative" />. It can
                then only be resolved relative to a given{" "}
                <R n="NamespaceId" />, and identifies an <R n="Entry" />{" "}
                of that given <R n="NamespaceId" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <R n="SubspaceId" /> of an <R n="EntryURI" />{" "}
                is optional. If it is missing, we say the <R n="EntryURI" /> is
                {" "}
                <Def n="subspace_relative" r="subspace-relative" />. It can then
                only be resolved relative to a given{" "}
                <R n="SubspaceId" />, and identifies an <R n="Entry" />{" "}
                of that given <R n="SubspaceId" />.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                The <DefType n="URIPath" rs="URIPaths" /> of an{" "}
                <R n="EntryURI" /> is not a regular Willow{" "}
                <R n="Path" />, but a pair of a boolean to indicate whether it
                is <Def n="uri_path_absolute" r="absolute" /> or{" "}
                <Def n="uri_path_relative" r="relative" />, and a sequence of
                {" "}
                <Rs n="URIPathComponent" />. A{" "}
                <DefType n="URIPathComponent" rs="URIPathComponents" />{" "}
                is a sequence consisting of regular <Rs n="Component" /> and
                {" "}
                <Def n="dot_segment" r="dot-segment" rs="dot-segments">
                  dot-segments
                </Def>{" "}
                — either <Code>.</Code> or <Code>..</Code>. If the{" "}
                <R n="URIPath" /> is <R n="uri_path_relative" />, we say the
                {" "}
                <R n="EntryURI" /> is{" "}
                <Def n="path_relative" r="path-relative" />.
              </P>

              <P>
                <Rs n="URIPath" /> can be converted into Willow{" "}
                <Rs n="Path" />. For <R n="uri_path_relative" />{" "}
                <Rs n="URIPath" />, this requires a Willow{" "}
                <Def
                  n="uri_reference_path"
                  r="reference path"
                  rs="reference paths"
                />{" "}
                to start from; for <R n="uri_path_absolute" />{" "}
                <Rs n="URIPath" />, the <R n="uri_reference_path" />{" "}
                is the empty <R n="Path" />. You then iterate through the{" "}
                <Rs n="URIPathComponent" /> and modify the{" "}
                <R n="uri_reference_path" />:
              </P>

              <Ul>
                <Li>
                  for each regular <R n="Component" />, append it to the{" "}
                  <R n="uri_reference_path" />,
                </Li>
                <Li>
                  for each <Code>..</Code>{" "}
                  <R n="dot_segment" />, remove the final <R n="Component" />
                  {" "}
                  of the <R n="uri_reference_path" />, and
                </Li>
                <Li>
                  for each <Code>.</Code> <R n="dot_segment" />, do nothing.
                </Li>
              </Ul>

              <P>
                If this would at any point result in removing a{" "}
                <R n="Component" /> from an empty{" "}
                <R n="uri_reference_path" />, then the <R n="EntryURI" />{" "}
                identifies nothing.
              </P>
            </PreviewScope>

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
              An <R n="EntryURI" />{" "}
              can optionally contain a sequence of other URIS (of any scheme,
              not just{" "}
              <Code>
                <Green>willow://</Green>
              </Code>) to serve as hints how to retrieve the identified{" "}
              <R n="Entry" /> (and, optionally, its{" "}
              <R n="Payload" />). Hints appearing early in the sequence should
              be tried before hints appearing later in the sequence. The
              sequence may contain duplicates, but that would be pretty
              pointless.
            </P>

            <P>
              Taken together, we get the following data that conceptually makes
              up an <R n="EntryURI" />:
            </P>

            <Pseudocode n="entry_uri_definition">
              <StructDef
                comment={
                  <>
                    The data of an <R n="EntryURI" />.
                  </>
                }
                id={["EntryURIData", "EntryURIData", "EntryURIData"]}
                fields={[
                  {
                    commented: {
                      comment: (
                        <>
                          The identifier of the <R n="namespace" />{" "}
                          to which the identified <R n="Entry" /> belongs. If
                          {" "}
                          <DefVariant n="entry_uri_ns_none" r="none" />, the
                          {" "}
                          <R n="EntryURI" /> is <R n="namespace_relative" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "namespace_id",
                          "entry_uri_namespace_id",
                          "namespace_ids",
                        ],
                        <ChoiceType
                          types={[
                            <R n="NamespaceId" />,
                            <R n="entry_uri_ns_none" />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The identifier of the <R n="subspace" />{" "}
                          to which the identified <R n="Entry" /> belongs. If
                          {" "}
                          <DefVariant n="entry_uri_ss_none" r="none" />, the
                          {" "}
                          <R n="EntryURI" /> is <R n="subspace_relative" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "subspace_id",
                          "entry_uri_subspace_id",
                          "subspace_ids",
                        ],
                        <ChoiceType
                          types={[
                            <R n="SubspaceId" />,
                            <R n="entry_uri_ss_none" />,
                          ]}
                        />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          Whether the <Rs n="URIPath" />{" "}
                          is absolute or relative.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "path_is_relative",
                          "entry_uri_path_is_relative",
                          "path_is_relatives",
                        ],
                        <R n="Bool" />,
                      ],
                    },
                  },
                  {
                    commented: {
                      comment: (
                        <>
                          The <Rs n="URIPathComponent" /> of the{" "}
                          <R n="URIPath" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "path_components",
                          "entry_uri_path_components",
                          "path_components",
                        ],
                        <SliceType children={[<R n="URIPathComponent" />]} />,
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
                          "entry_uri_payload_from",
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
                          "entry_uri_payload_to",
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
                          "entry_uri_expected_digest",
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
                          The resolution hints for the <R n="EntryURI" />.
                        </>
                      ),
                      dedicatedLine: true,
                      segment: [
                        [
                          "path_hints",
                          "entry_uri_hints",
                          "path_hints",
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
                ]}
              />
            </Pseudocode>
          </Hsection>

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
                is <Code>willow</Code>.
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
                <R n="UriEncodeNamespaceId" /> (simply omitted for{" "}
                <R n="namespace_relative" />{" "}
                <Rs n="EntryURI" />), followed by an ASCII{" "}
                <Code>!</Code>, followed by a <R n="code" /> of the{" "}
                <R n="SubspaceId" /> in <R n="UriEncodeSubspaceId" />{" "}
                (simply omitted for <R n="subspace_relative" />{" "}
                <Rs n="EntryURI" />), followed by an ASCII{" "}
                <Code>!</Code>. The authority subcomponent must adhere exactly
                to these rules (i.e., no{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.1">
                  user information
                </AE>,{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2">
                  IP addresses
                </AE>, or{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.3">
                  ports
                </AE>).
              </Li>
              <Li>
                The{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.3">
                  path segments
                </AE>{" "}
                are determined by the <Rs n="URIPathComponent" />.{" "}
                <Rs n="dot_segment" /> are encoded as ASCII <Code>.</Code> or
                {" "}
                <Code>..</Code> respectively. The <R n="uri_unreserved" />{" "}
                bytes of a regular <R n="Component" />{" "}
                are encoded as ASCII, all other bytes are encoded using{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-2.1">
                  percent encoding
                </AE>. Each encoded <R n="URIPathComponent" /> (and{" "}
                <R n="dot_segment" />) must be preceded by an ASCII{" "}
                <Code>/</Code>, with two exceptions: omit the <Code>/</Code>
                {" "}
                for the first <R n="URIPathComponent" /> of a{" "}
                <R n="path_relative" />{" "}
                <R n="EntryURI" />, and omit it when encoding an absolute, empty
                {" "}
                <R n="Path" />. When decoding, the latter case takes precedence.
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
                  <Li>
                    To indicate a non-empty list of resolution hints, the ASCII
                    string{" "}
                    <Code>
                      hints=<EscapeHtml>{"<"}encoded_hints{">"}</EscapeHtml>
                    </Code>, where{" "}
                    <Code>
                      <EscapeHtml>{"<"}encoded_hints{">"}</EscapeHtml>
                    </Code>{" "}
                    is a <Code>;</Code>-separated list of the hint URIs, with
                    {" "}
                    <R n="uri_unreserved" />{" "}
                    bytes being included verbatim, and all other bytes being
                    {" "}
                    <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-2.1">
                      percent-encoded
                    </AE>.
                  </Li>
                </Ul>

                If both a start and an end index are specified and the end
                offset is equal or less than the start offset, the{" "}
                <R n="EntryURI" /> identifies only the <R n="Entry" />{" "}
                but no subslice of its <R n="Payload" />.
              </Li>
              <Li>
                There may be an arbitrary{" "}
                <AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.5">
                  URI fragment
                </AE>, with application-specific semantics.
              </Li>
            </Ul>

            <P>
              Note that from the generic URI spec we inherit the ability to use
              relative URIs consisting of a path segments only, for example,
              {" "}
              <Code>
                <SkyBlue>
                  .
                </SkyBlue>/<SkyBlue>ideas</SkyBlue>
              </Code>. Such a relative URI is equivalent to a{" "}
              <R n="namespace_relative" /> and <R n="subspace_relative" />{" "}
              <R n="EntryURI" />, for example,{" "}
              <Code>
                <Green>willow</Green>://!!<SkyBlue>
                  .
                </SkyBlue>/<SkyBlue>ideas</SkyBlue>
              </Code>.
            </P>
          </Hsection>

          <Hsection n="uris_entry_examples" title="Entry URI Examples">
            <P>
              Here are some examples of valid <Rs n="EntryURI" />:
            </P>

            <Ul>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>ideas</SkyBlue>/
                </Code>{" "}
                (the <R n="Path" /> ends with an empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
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
                  </Purple>!<Vermillion>alfie</Vermillion>!
                </Code>{" "}
                (empty <R n="Path" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/
                </Code>{" "}
                (<R n="Path" /> consists of a single empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=0</Orange> (identifying an{" "}
                  <R n="Entry" /> and its complete <R n="Payload" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
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
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>to=6&from=4</Orange> (identifying an{" "}
                  <R n="Entry" /> and its <R n="Payload" /> bytes four and five)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&to=5</Orange> (identifying only an
                  {" "}
                  <R n="Entry" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=99&to=12</Orange> (identifying only an
                  {" "}
                  <R n="Entry" />)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&digest=b287afb0</Orange>
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
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
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=0</Orange>#blabla
                  (<AE href="https://datatracker.ietf.org/doc/html/rfc3986#section-3.5">
                    fragments
                  </AE>{" "}
                  are allowed!)
                </Code>
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!<SkyBlue>
                    cakes
                  </SkyBlue>
                </Code>{" "}
                (not <R n="namespace_relative" />, not{" "}
                <R n="subspace_relative" />, <R n="path_relative" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!<SkyBlue>
                    .
                  </SkyBlue>/<SkyBlue>
                    cakes
                  </SkyBlue>
                </Code>{" "}
                (equivalent to the preceeding one, and less confusing)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!!/<SkyBlue>
                    blog
                  </SkyBlue>
                </Code>{" "}
                (not <R n="namespace_relative" />,{" "}
                <R n="subspace_relative" />, not <R n="path_relative" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://!<Vermillion>
                    alfie
                  </Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>
                </Code>{" "}
                (<R n="namespace_relative" />, not{" "}
                <R n="subspace_relative" />, not <R n="path_relative" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://!!/<SkyBlue>
                    blog
                  </SkyBlue>
                </Code>{" "}
                (<R n="namespace_relative" />, <R n="subspace_relative" />, not
                {" "}
                <R n="path_relative" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!!<SkyBlue>
                    cakes
                  </SkyBlue>
                </Code>{" "}
                (not <R n="namespace_relative" />, <R n="subspace_relative" />,
                {" "}
                <R n="path_relative" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://!<Vermillion>
                    alfie
                  </Vermillion>!<SkyBlue>
                    cakes
                  </SkyBlue>
                </Code>{" "}
                (<R n="namespace_relative" />, not <R n="subspace_relative" />,
                {" "}
                <R n="path_relative" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://!!<SkyBlue>
                    .
                  </SkyBlue>
                </Code>{" "}
                (<R n="namespace_relative" />, <R n="subspace_relative" />,{" "}
                <R n="path_relative" />; addressing the current <R n="Path" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://!!
                </Code>{" "}
                (<R n="namespace_relative" />,{"  "}
                <R n="subspace_relative" />, not{" "}
                <R n="path_relative" />; addressing the empty <R n="Path" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://!!/
                </Code>{" "}
                (<R n="namespace_relative" />,{"  "}
                <R n="subspace_relative" />, not{" "}
                <R n="path_relative" />; addressing the <R n="Path" />{" "}
                consisting of a single empty <R n="Component" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>recipes</SkyBlue>
                </Code>{" "}
                (addresses nothing, because the first step of <R n="Path" />
                {" "}
                resolution would need to pop a <R n="Component" />{" "}
                from the empty <R n="Path" />)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>/
                  <SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>blog</SkyBlue>
                </Code>{" "}
                (pointless, but allowed)
              </Li>
            </Ul>

            <P>
              Here are some non-examples — these are not valid{" "}
              <Rs n="EntryURI" />:
            </P>

            <Ul>
              <Li>
                <Code>
                  <Green>willow</Green>://
                </Code>{" "}
                (needs more <Code>!!</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>/<SkyBlue>recipes</SkyBlue>?foo=bar
                </Code>{" "}
                (the specification allows no custom query components)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&from=7</Orange>
                </Code>{" "}
                (no duplicate query parts)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5to=7</Orange>
                </Code>{" "}
                (missing <Code>&</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>&from=5&from=7</Orange>
                </Code>{" "}
                (leading <Code>&</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&from=7&</Orange>
                </Code>{" "}
                (trailing <Code>&</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>!/<SkyBlue>
                    blog
                  </SkyBlue>?<Orange>from=5&&from=7</Orange>
                </Code>{" "}
                (duplicate <Code>&</Code>)
              </Li>
              <Li>
                <Code>
                  <Green>willow</Green>://<Purple>
                    family
                  </Purple>!<Vermillion>alfie</Vermillion>
                  <SkyBlue>
                    ..
                  </SkyBlue>/<SkyBlue>chess</SkyBlue>
                </Code>{" "}
                (missing the <Code>!</Code> after the <R n="SubspaceId" />)
              </Li>
            </Ul>
          </Hsection>
        </Hsection>

        <Hsection n="uris_area" title="Entry URIs">
          <P>
            <Alj inline>
              TODO: For identifying <Rs n="AreaOfInterest" />.
            </Alj>
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
