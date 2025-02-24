import { Dir, File } from "macromania-outfs";
import { Code, Em, Figcaption, Figure, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  StructDef,
} from "macromania-rustic";
import { ChoiceType } from "macromania-rustic";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import {
  AE,
  Alj,
  Blue,
  Green,
  MarginCaption,
  Orange,
  Purple,
  Quotes,
  Vermillion,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Rsb } from "macromania-defref";
import { M } from "macromania-katex";

export const grouping_entries = (
  <Dir name="grouping-entries">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Grouping Entries"
        headingId="grouping_entries"
        heading={"Grouping Entries"}
        toc
      >
        <P>
          <Marginale inlineable>
            <Img
              src={<ResolveAsset asset={["grouping_entries", "axes.png"]} />}
              alt={`An abstract, three-dimensional coordinate system. The axes are labelled "subspace", "path", and "timestamp".`}
            />
            <MarginCaption>
              The three dimensions of a <R n="namespace" />.
            </MarginCaption>
          </Marginale>
          Willow lets authors place <Rs n="Entry" /> in{" "}
          <Rs n="namespace" />, and within each <R n="namespace" />,{" "}
          <Rs n="Entry" />{" "}
          are arranged according to three orthogonal dimensions:{" "}
          <R n="entry_subspace_id" />, <R n="entry_path" />, and{" "}
          <R n="entry_timestamp" />. This suggests a powerful way of thinking
          about Willow: a <R n="namespace" />{" "}
          is a collection of points (<Rs n="Entry" />) in a three-dimensional
          space. Or more accurately, a <R n="namespace" /> is a <Em>mapping</Em>
          {" "}
          from points in this three-dimensional space to hashes and sizes of
          {" "}
          <Rs n="Payload" />.
        </P>

        <P>
          This viewpoint enables us to meaningfully group <Rs n="Entry" />{" "}
          together. An application might want to access all chess games that a
          certain author played in the past week. This kind of query corresponds
          to a box (a{" "}
          <AE href="https://en.wikipedia.org/wiki/Rectangular_cuboid">
            rectangular cuboid
          </AE>{" "}
          to use precise terminology) in the three-dimensional Willow space.
        </P>

        <P>
          In this document, we develop and define a vocabulary for grouping{" "}
          <Rs n="Entry" /> based on their <Rs n="entry_subspace_id" />,{" "}
          <Rs n="entry_path" />, and{" "}
          <Rs n="entry_timestamp" />. These definitions are not necessary for
          defining and understanding the core data model, but we make heavy use
          of them in our <R n="meadowcap">recommended capability system</R>{" "}
          and our <R n="sync">recommended synchronisation protocol</R>.
        </P>

        <Hsection n="ranges" title="Ranges">
          <PreviewScope>
            <P>
              Ranges are simple, one-dimensional ways of grouping{" "}
              <Rs n="Entry" />, they can express groupings such as{" "}
              <Quotes>
                last week’s <Rs n="Entry" />
              </Quotes>. A <Def n="range" rs="ranges" /> is either a{" "}
              <R n="closed_range" /> or an <R n="open_range" />. A{" "}
              <Def n="closed_range" r="closed range" rs="closed ranges" />{" "}
              consists of a{" "}
              <Def n="start_value" r="start value" rs="start values" /> and an
              {" "}
              <Def n="end_value" r="end value" rs="end values" /> , an{" "}
              <Def n="open_range" r="open range" rs="open ranges" />{" "}
              consists only of a <R n="start_value" />. A <R n="range" />{" "}
              <Def n="range_include" r="include">includes</Def>{" "}
              all values greater than or equal to its <R n="start_value" />{" "}
              and strictly less than its <R n="end_value" />{" "}
              (if it is has one). A <R n="range" /> is{" "}
              <Def n="range_empty" r="empty" /> if it{" "}
              <R n="range_include">includes</R> no values.
            </P>
          </PreviewScope>

          <Figure>
            <Img
              src={<ResolveAsset asset={["grouping_entries", "ranges.png"]} />}
              alt={`A visualisation of both a closed range and an open range as contiguous segments of a line of numbers.`}
            />
            <Figcaption>
              A{" "}
              <Vermillion>
                <R n="closed_range" />
              </Vermillion>{" "}
              and an{" "}
              <Green>
                <R n="open_range" />
              </Green>.
            </Figcaption>
            <Alj>TODO: fix colouring of refs here</Alj>
          </Figure>

          <P>
            The Willow protocols use three types of <Rs n="range" />:
          </P>

          <Pseudocode n="ranges_defs">
            <StructDef
              comment={
                <>
                  A <R n="range" /> of <Rs n="SubspaceId" />.
                </>
              }
              id={["SubspaceRange", "SubspaceRange", "SubspaceRanges"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        A <R n="SubspaceId" />{" "}
                        must be greater than or equal to this to be{" "}
                        <R n="range_include">included</R> in the{" "}
                        <R n="range" />. The ordering must be given by a
                        protocol parameter.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["start", "SubspaceRangeStart"],
                      <R n="SubspaceId" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        If <R n="range_open" />, the <R n="range" /> is an{" "}
                        <R n="open_range" />. Otherwise, a <R n="SubspaceId" />
                        {" "}
                        must be numerically strictly less than this to be{" "}
                        <R n="range_include">included</R> in the{" "}
                        <R n="range" />. The ordering must be given by a
                        protocol parameter.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["end", "SubspaceRangeEnd"],
                      <ChoiceType
                        types={[<R n="SubspaceId" />, <R n="range_open" />]}
                      />,
                    ],
                  },
                },
              ]}
            />

            <StructDef
              comment={
                <>
                  A <R n="range" /> of <Rs n="Path" />.
                </>
              }
              id={["PathRange", "PathRange", "PathRanges"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        A <R n="Path" /> must be{" "}
                        <AE href="https://en.wikipedia.org/wiki/Lexicographic_order">
                          lexicographically
                        </AE>{" "}
                        greater than or equal to this to be{" "}
                        <R n="range_include">included</R> in the{" "}
                        <R n="range" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [["start", "PathRangeStart"], <R n="Path" />],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        If <R n="range_open" />, the <R n="range" /> is an{" "}
                        <R n="open_range" />. Otherwise, a <R n="Path" />{" "}
                        must be{" "}
                        <AE href="https://en.wikipedia.org/wiki/Lexicographic_order">
                          lexicographically
                        </AE>{" "}
                        strictly less than this to be{" "}
                        <R n="range_include">included</R> in the{" "}
                        <R n="range" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["end", "PathRangeEnd"],
                      <ChoiceType
                        types={[<R n="Path" />, <R n="range_open" />]}
                      />,
                    ],
                  },
                },
              ]}
            />

            <StructDef
              comment={
                <>
                  A <R n="range" /> of <Rs n="Timestamp" />.
                </>
              }
              id={["TimeRange", "TimeRange", "TimeRanges"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        A <R n="Timestamp" />{" "}
                        must be numerically greater than or equal to this to be
                        {" "}
                        <R n="range_include">included</R> in the{" "}
                        <R n="range" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [["start", "TimeRangeStart"], <R n="Timestamp" />],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        If <R n="range_open" />, the <R n="range" /> is an{" "}
                        <R n="open_range" />. Otherwise, a <R n="Timestamp" />
                        {" "}
                        must be numerically strictly less than this to be{" "}
                        <R n="range_include">included</R> in the{" "}
                        <R n="range" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["end", "TimeRangeEnd"],
                      <ChoiceType
                        types={[<R n="Timestamp" />, <R n="range_open" />]}
                      />,
                    ],
                  },
                },
              ]}
            />
          </Pseudocode>

          <PreviewScope>
            <P>
              Let <DefValue n="rangeisectr1" r="r1" /> and{" "}
              <DefValue n="rangeisectr2" r="r2" /> be <Rs n="range" />{" "}
              (over the same types of values). The{" "}
              <Def n="range_intersection" r="intersection" rs="intersections" />
              {" "}
              of <R n="rangeisectr1" /> and <R n="rangeisectr2" />{" "}
              is the range whose <R n="start_value" /> is the greater of the
              {" "}
              <Rs n="start_value" /> of <R n="rangeisectr1" /> and{" "}
              <R n="rangeisectr2" />, and whose <R n="end_value" />{" "}
              is the lesser of the <Rs n="end_value" /> of{" "}
              <R n="rangeisectr1" /> and <R n="rangeisectr2" /> (if both are
              {" "}
              <Rs n="closed_range" />), the one <R n="end_value" /> among{" "}
              <R n="rangeisectr1" /> and <R n="rangeisectr2" />{" "}
              (if exactly one of them is a <R n="closed_range" />), or no{" "}
              <R n="end_value" /> (if both <R n="rangeisectr1" /> and{" "}
              <R n="rangeisectr2" /> are <Rs n="open_range" />).
            </P>
          </PreviewScope>

          <P>
            <Marginale inlineable>
              <Img
                src={
                  <ResolveAsset asset={["grouping_entries", "3d_range.png"]} />
                }
                alt={`A three-dimensional coordinate system. On each axis, there is a contiguous, highlighted one-dimensional subrange. On the time axis, the subrange is labeled "11:30 to 12:30". On the path axis, it is labelled "blog to chat". On the subspace axis, it is labelled "Alfie to Betty". These three one-dimensional ranges together describe a three-dimensional box. This box is highlighted in the depicted space.`}
              />
              <MarginCaption>
                A{" "}
                <Orange>
                  <R n="D3Range" />
                </Orange>{" "}
                composed of a{" "}
                <Purple>
                  <R n="SubspaceRange" />
                </Purple>,{" "}
                <Blue>
                  <R n="PathRange" />
                </Blue>, and{" "}
                <Green>
                  <R n="TimeRange" />
                </Green>.
              </MarginCaption>
            </Marginale>

            When we combine <Rs n="range" />{" "}
            of all three dimensions, we can delimit boxes in Willow space.
          </P>

          <Pseudocode n="d3ranges_def">
            <StructDef
              comment={
                <>
                  A three-dimensional range that{" "}
                  <R n="d3_range_include">includes</R> every <R n="Entry" />
                  {" "}
                  <R n="range_include">included</R> in all three of its{" "}
                  <Rs n="range" />.
                </>
              }
              id={["3dRange", "D3Range", "3dRanges"]}
              fields={[
                [
                  ["subspaces", "D3RangeSubspace", "subspaces"],
                  <R n="SubspaceRange" />,
                ],
                [["paths", "D3RangePath", "paths"], <R n="PathRange" />],
                [["times", "D3RangeTime", "times"], <R n="TimeRange" />],
              ]}
            />
          </Pseudocode>

          <PreviewScope>
            <P>
              A <R n="D3Range" />{" "}
              <Def n="d3_range_include" r="include">includes</Def> every{" "}
              <R n="Entry" /> whose <R n="entry_subspace_id" />,{" "}
              <R n="entry_path" />, and <R n="entry_timestamp" /> are all{" "}
              <R n="range_include">included</R> their respective{" "}
              <R n="range" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              We define{" "}
              <Code>
                <DefFunction n="default_3d_range" />(<DefValue
                  n="default_3d_ss"
                  r="default_subspace"
                />)
              </Code>{" "}
              to denote the <R n="D3Range" /> with the following members:
            </P>

            <Ul>
              <Li>
                <R n="D3RangeSubspace" /> is the <R n="open_range">open</R>{" "}
                <R n="SubspaceRange" /> with <R n="SubspaceRangeStart" />{" "}
                <R n="default_3d_ss" />,
              </Li>
              <Li>
                <R n="D3RangePath" /> is the <R n="open_range">open</R>{" "}
                <R n="PathRange" /> whose <R n="PathRangeStart" /> is the empty
                {" "}
                <R n="Path" />, and
              </Li>
              <Li>
                <R n="D3RangeTime" /> is the <R n="open_range">open</R>{" "}
                <R n="TimeRange" /> with <R n="TimeRangeStart" /> zero.
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>

        <Hsection n="areas" title="Areas">
          <P>
            <Rsb n="D3Range" /> provide a natural way of grouping{" "}
            <Rs n="Entry" />, but they have certain drawbacks around encrypted
            data in Willow: when encrypting{" "}
            <Rs n="Path" />, for example, the lexicographic ordering of the
            encrypted <Rs n="Path" />{" "}
            is inconsistent with the ordering of the unencrypted{" "}
            <Rs n="Path" />. Similarly, <Rs n="SubspaceRange" />{" "}
            do not preserve their meaning under encryption either. Hence,
            user-specified <Rs n="D3Range" />{" "}
            are close to useless when dealing with encrypted data.
          </P>

          <P>
            Fortunately, there do exist encryption techniques that preserve some
            weaker properties than arbitrary orderings.<Marginale>
              See <R n="e2e">here</R> for information on encrypting Willow.
            </Marginale>{" "}
            Without going into the cryptographic details, we now define an
            alternative to <Rs n="D3Range" />{" "}
            that can be used even when encrypting <Rs n="Path" /> and{" "}
            <Rs n="SubspaceId" />.
          </P>

          <P>
            <Marginale>
              Every <R n="Area" /> can be expressed as a{" "}
              <R n="D3Range" />, but not the other way around. <Rsb n="Area" />
              {" "}
              always denote boxes in Willow space, but some boxes do not
              correspond to any <R n="Area" />.
            </Marginale>
            <Marginale>
              <Img
                src={<ResolveAsset asset={["grouping_entries", "area.png"]} />}
                alt={`Like the diagram for 3dRanges, a coordinate system with a highlighted box. The time dimension of the box is given as a time range, but the path and subspace dimensions are specified from a single path ("blog") and a single subspace ("Alfie") respectively.`}
              />
              <MarginCaption>
                This diagram attempts to show the key difference between a{" "}
                <R n="D3Range" /> and an{" "}
                <R n="Area" />, namely that its dimensions are <Em>derived</Em>
                {" "}
                from its{" "}
                <Purple>
                  <R n="AreaSubspace" />
                </Purple>{" "}
                and its{" "}
                <Blue>
                  <R n="AreaPath" />
                </Blue>.
              </MarginCaption>
            </Marginale>
          </P>

          <Pseudocode n="area_def">
            <StructDef
              comment={
                <>
                  A grouping of <Rs n="Entry" />.
                </>
              }
              id={["Area", "Area", "Areas"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        To be <R n="area_include">included</R> in this{" "}
                        <R n="Area" />, an <R n="Entry" />’s{" "}
                        <R n="entry_subspace_id" /> must be equal to the{" "}
                        <R n="AreaSubspace" />, unless it is <R n="area_any" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["subspace_id", "AreaSubspace", "subspace_ids"],
                      <ChoiceType
                        types={[<R n="SubspaceId" />, <R n="area_any" />]}
                      />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        To be <R n="area_include">included</R> in this{" "}
                        <R n="Area" />, an <R n="Entry" />’s{" "}
                        <R n="entry_path" /> must be{" "}
                        <R n="path_prefix">prefixed</R> by the{" "}
                        <R n="AreaPath" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["path", "AreaPath", "paths"],
                      <R n="Path" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        To be <R n="area_include">included</R> in this{" "}
                        <R n="Area" />, an <R n="Entry" />’s{" "}
                        <R n="entry_timestamp" /> must be{" "}
                        <R n="range_include">included</R> in the{" "}
                        <R n="AreaTime" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["times", "AreaTime", "times"],
                      <R n="TimeRange" />,
                    ],
                  },
                },
              ]}
            />
          </Pseudocode>

          <PreviewScope>
            <P>
              An <R n="Area" /> <DefValue n="area_include_a" r="a" />{" "}
              <Def n="area_include" r="include">includes</Def> an{" "}
              <R n="Entry" /> <DefValue n="area_include_e" r="e" /> if
            </P>

            <Ul>
              <Li>
                <Code>
                  <AccessStruct field="AreaSubspace">
                    <R n="area_include_a" />
                  </AccessStruct>{" "}
                  == <R n="area_any" /> or{" "}
                  <AccessStruct field="AreaSubspace">
                    <R n="area_include_a" />
                  </AccessStruct>{" "}
                  =={" "}
                  <AccessStruct field="entry_subspace_id">
                    <R n="area_include_e" />
                  </AccessStruct>
                </Code>,
              </Li>
              <Li>
                <AccessStruct field="AreaPath">
                  <R n="area_include_a" />
                </AccessStruct>{" "}
                is a <R n="path_prefix" /> of{" "}
                <AccessStruct field="entry_path">
                  <R n="area_include_e" />
                </AccessStruct>, and
              </Li>
              <Li>
                <AccessStruct field="AreaPath">
                  <R n="AreaTime" />
                </AccessStruct>{" "}
                <R n="range_include">includes</R>{" "}
                <AccessStruct field="entry_timestamp">
                  <R n="area_include_e" />
                </AccessStruct>.
              </Li>
            </Ul>
          </PreviewScope>

          <PreviewScope>
            <P>
              An <R n="Area" /> is <Def n="area_empty" r="empty" /> if it{" "}
              <R n="area_include">includes</R> no{" "}
              <Rs n="Entry" />. This is the case if and only if its{" "}
              <R n="AreaTime" /> is <R n="range_empty" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              An <R n="Area" />{" "}
              <Def n="area_include_area" r="include">includes</Def> another{" "}
              <R n="Area" /> if the first <R n="Area" />{" "}
              <R n="area_include">includes</R> all <Rs n="Entry" />{" "}
              that the second <R n="Area" />{" "}
              <R n="area_include">includes</R>. In particular, every{" "}
              <R n="Area" /> <R n="area_include_area">includes</R> itself.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              The <Def n="full_area" r="full area" /> is the <R n="Area" />{" "}
              whose <R n="AreaSubspace" /> is <R n="area_any" />, whose{" "}
              <R n="AreaPath" /> is the empty <R n="Path" />, and whose{" "}
              <R n="AreaTime" /> is the <R n="open_range">open</R>{" "}
              <R n="TimeRange" /> with <R n="TimeRangeStart" />{" "}
              <M post=".">0</M> It <R n="area_include">includes</R> all{" "}
              <Rs n="Entry" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              The <Def n="subspace_area" r="subspace area" /> of the{" "}
              <R n="SubspaceId" /> <DefValue n="subspacearea_sub" r="sub" />
              {" "}
              is the <R n="Area" /> whose <R n="AreaSubspace" /> is{" "}
              <R n="subspacearea_sub" />, whose <R n="AreaPath" /> is the empty
              {" "}
              <R n="Path" />, and whose <R n="AreaTime" /> is the{" "}
              <R n="open_range">open</R> <R n="TimeRange" /> with{" "}
              <R n="TimeRangeStart" /> <M post=".">0</M> It{" "}
              <R n="area_include">includes</R> exactly the <Rs n="Entry" /> with
              {" "}
              <R n="entry_subspace_id" /> <R n="subspacearea_sub" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              If two <Rsb n="Area" /> overlap, the overlap is again an{" "}
              <R n="Area" />. Let <DefValue n="area_inter_a1" r="a1" /> and{" "}
              <DefValue n="area_inter_a2" r="a2" /> be{" "}
              <Rsb n="Area" />. If there exists at least one <R n="Entry" />
              {" "}
              <R n="area_include">included</R> in both{" "}
              <R n="area_inter_a1" />, and{" "}
              <R n="area_inter_a2" />, then we define the{" "}
              <Def n="area_intersection" r="intersection" rs="intersections">
                (nonempty) intersection
              </Def>{" "}
              of <R n="area_inter_a1" />, and <R n="area_inter_a2" /> as the
              {" "}
              <R n="Area" /> whose
            </P>

            <Ul>
              <Li>
                <R n="AreaSubspace" /> is{" "}
                <AccessStruct field="AreaSubspace">
                  <R n="area_inter_a1" />
                </AccessStruct>{" "}
                if{" "}
                <AccessStruct field="AreaSubspace">
                  <R n="area_inter_a1" />
                </AccessStruct>{" "}
                is not <R n="area_any" />, or{" "}
                <AccessStruct field="AreaSubspace">
                  <R n="area_inter_a2" />
                </AccessStruct>{" "}
                otherwise, whose
              </Li>
              <Li>
                <R n="AreaPath" /> is the longer of{" "}
                <AccessStruct field="AreaPath">
                  <R n="area_inter_a1" />
                </AccessStruct>{" "}
                and<Marginale>
                  One is a prefix of the other, otherwise the intersection would
                  be empty.
                </Marginale>{" "}
                <AccessStruct field="AreaPath">
                  <R n="area_inter_a2" />
                </AccessStruct>, and whose
              </Li>
              <Li>
                <R n="AreaTime" /> is the <R n="range_intersection" /> of{" "}
                <AccessStruct field="AreaTime">
                  <R n="area_inter_a1" />
                </AccessStruct>{" "}
                and{" "}
                <AccessStruct field="AreaTime">
                  <R n="area_inter_a2" />
                </AccessStruct>.
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>

        <Hsection n="aois" title="Areas of Interest">
          <P>
            Occasionally, we wish to group <Rs n="Entry" />{" "}
            based on the contents of some{" "}
            <R n="store" />. For example, a space-constrained peer might ask for
            the 100 newest <Rs n="Entry" /> of some <R n="store" />{" "}
            when synchronising data.
          </P>

          <P>
            We serve these use cases by combining an <R n="Area" />{" "}
            with limits to restrict the contents to the <Rs n="Entry" />{" "}
            with the greatest <Rs n="entry_timestamp" />.
          </P>

          <Pseudocode n="aoi_def">
            <StructDef
              comment={
                <>
                  A grouping of <Rs n="Entry" />{" "}
                  that are among the newest in some <R n="store" />.
                </>
              }
              id={["AreaOfInterest", "AreaOfInterest", "AreasOfInterest"]}
              fields={[
                {
                  commented: {
                    comment: (
                      <>
                        To be <R n="aoi_include">included</R> in this{" "}
                        <R n="AreaOfInterest" />, an <R n="Entry" /> must be
                        {" "}
                        <R n="area_include">included</R> in the{" "}
                        <R n="aoi_area" />.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["area", "aoi_area"],
                      <R n="Area" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        To be <R n="aoi_include">included</R> in this{" "}
                        <R n="AreaOfInterest" />, an <R n="Entry" />’s{" "}
                        <R n="entry_timestamp" /> must be among the{" "}
                        <R n="aoi_count" /> <R n="entry_newer">newest</R>{" "}
                        <Rs n="Entry" />, unless <R n="aoi_count" /> is zero.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["max_count", "aoi_count"],
                      <R n="U64" />,
                    ],
                  },
                },
                {
                  commented: {
                    comment: (
                      <>
                        The total <Rs n="entry_payload_length" /> of all{" "}
                        <R n="aoi_include">included</R> <Rs n="Entry" />{" "}
                        is at most <R n="aoi_size" />, unless <R n="aoi_size" />
                        {" "}
                        is zero.
                      </>
                    ),
                    dedicatedLine: true,
                    segment: [
                      ["max_size", "aoi_size"],
                      <R n="U64" />,
                    ],
                  },
                },
              ]}
            />
          </Pseudocode>

          <PreviewScope>
            <P>
              An <R n="AreaOfInterest" /> <DefValue n="aoi_include_a" r="aoi" />
              {" "}
              <Def n="aoi_include">includes</Def> an <R n="Entry" />{" "}
              <DefValue n="aoi_include_e" r="e" /> from a <R n="store" />{" "}
              <DefValue n="aoi_include_s" r="s" /> if
            </P>
            <Ul>
              <Li>
                <AccessStruct field="aoi_area">
                  <R n="aoi_include_a" />
                </AccessStruct>{" "}
                <R n="area_include">includes</R> <R n="aoi_include_e" />,
              </Li>
              <Li>
                <AccessStruct field="aoi_count">
                  <R n="aoi_include_a" />
                </AccessStruct>{" "}
                is zero, or <R n="aoi_include_e" /> is among the{" "}
                <AccessStruct field="aoi_count">
                  <R n="aoi_include_a" />
                </AccessStruct>{" "}
                <R n="entry_newer">newest</R> <Rs n="Entry" /> of{" "}
                <R n="aoi_include_s" />, and
              </Li>
              <Li>
                <AccessStruct field="aoi_size">
                  <R n="aoi_include_a" />
                </AccessStruct>{" "}
                is zero, or the sum of the <Rs n="entry_payload_length" /> of
                {" "}
                <R n="aoi_include_e" /> and all <R n="entry_newer" />{" "}
                <Rs n="Entry" /> in <R n="aoi_include_s" />{" "}
                is less than or equal to{" "}
                <AccessStruct field="aoi_size">
                  <R n="aoi_include_a" />
                </AccessStruct>.
              </Li>
            </Ul>
          </PreviewScope>

          <PreviewScope>
            <P>
              Let <DefValue n="aoi_inter_a1" r="aoi1" /> and{" "}
              <DefValue n="aoi_inter_a2" r="aoi2" /> be{" "}
              <Rs n="AreaOfInterest" />. If there exists at least one{" "}
              <R n="Entry" /> <R n="area_include">included</R> in both{" "}
              <AccessStruct field="aoi_area">
                <R n="aoi_inter_a1" />
              </AccessStruct>{"  "}
              and{" "}
              <AccessStruct field="aoi_area">
                <R n="aoi_inter_a2" />
              </AccessStruct>, then we define the{" "}
              <Def n="aoi_intersection" r="intersection" rs="intersections">
                (nonempty) intersection
              </Def>{" "}
              of <R n="aoi_inter_a1" />, and <R n="aoi_inter_a2" /> as the{" "}
              <R n="AreaOfInterest" /> whose
            </P>
            <Ul>
              <Li>
                <R n="aoi_area" /> is the <R n="area_intersection" /> of{" "}
                <AccessStruct field="aoi_area">
                  <R n="aoi_inter_a1" />
                </AccessStruct>{" "}
                and{" "}
                <AccessStruct field="aoi_area">
                  <R n="aoi_inter_a2" />
                </AccessStruct>, whose
              </Li>
              <Li>
                <R n="aoi_count" /> is{" "}
                <Ul>
                  <Li>
                    <AccessStruct field="aoi_count">
                      <R n="aoi_inter_a1" />
                    </AccessStruct>{" "}
                    if{" "}
                    <AccessStruct field="aoi_count">
                      <R n="aoi_inter_a2" />
                    </AccessStruct>{" "}
                    is zero,
                  </Li>
                  <Li>
                    <AccessStruct field="aoi_count">
                      <R n="aoi_inter_a2" />
                    </AccessStruct>{" "}
                    if{" "}
                    <AccessStruct field="aoi_count">
                      <R n="aoi_inter_a1" />
                    </AccessStruct>{" "}
                    is zero, or
                  </Li>
                  <Li>
                    the minimum of{" "}
                    <AccessStruct field="aoi_count">
                      <R n="aoi_inter_a1" />
                    </AccessStruct>{" "}
                    and{" "}
                    <AccessStruct field="aoi_count">
                      <R n="aoi_inter_a2" />
                    </AccessStruct>{" "}
                    otherwise, and whose
                  </Li>
                </Ul>
              </Li>
              <Li>
                <R n="aoi_size" /> is<Ul>
                  <Li>
                    <AccessStruct field="aoi_size">
                      <R n="aoi_inter_a1" />
                    </AccessStruct>{" "}
                    if{" "}
                    <AccessStruct field="aoi_size">
                      <R n="aoi_inter_a2" />
                    </AccessStruct>{" "}
                    is zero,
                  </Li>
                  <Li>
                    <AccessStruct field="aoi_size">
                      <R n="aoi_inter_a2" />
                    </AccessStruct>{" "}
                    if{" "}
                    <AccessStruct field="aoi_size">
                      <R n="aoi_inter_a1" />
                    </AccessStruct>{" "}
                    is zero, or
                  </Li>
                  <Li>
                    the minimum of{" "}
                    <AccessStruct field="aoi_size">
                      <R n="aoi_inter_a1" />
                    </AccessStruct>{" "}
                    and{" "}
                    <AccessStruct field="aoi_size">
                      <R n="aoi_inter_a2" />
                    </AccessStruct>{" "}
                    otherwise.
                  </Li>
                </Ul>
              </Li>
            </Ul>
          </PreviewScope>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
