import { Dir, File } from "macromania-outfs";
import { Code, Em, Hr, P } from "macromania-html";
import { PageTemplate } from "../pageTemplate.tsx";
import { AE, Curly, Green, Orange, Quotes, SkyBlue } from "../macros.tsx";
import { PreviewScope } from "macromania-previews";
import { DefType, DefVariant } from "macromania-rustic";
import { M } from "macromania-katex";
import { Def, R, Rs } from "macromania-defref";
import { Hsection } from "macromania-hsection";

export const misc_definitions = (
  <Dir name="misc-definitions">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Miscellaneous Definitions"
        headingId="misc_definitions"
        heading={"Miscellaneous Definitions"}
      >
        <P>
          You found the page where we define all of the previews we do not
          introduce in any spec. We hope you will enjoy your stay.
        </P>

        <Hr />

        <PreviewScope>
          <P>
            A <DefType n="U8" r="U8" rs="U8s" />{" "}
            is an unsigned 8-bit integer, i.e., a natural number between zero
            (inclusive) and <M>256</M> (exclusive).
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            A <DefType n="U64" r="U64" rs="U64s" />{" "}
            is an unsigned 64-bit integer, i.e., a natural number between zero
            (inclusive) and{" "}
            <M>
              2^<Curly>64</Curly>
            </M>{" "}
            (exclusive).
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            A <DefType n="Bool" r="Bool" rs="Bools" />{" "}
            is one of two possible values: <Code>true</Code> or{" "}
            <Code>false</Code>.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            The value <DefVariant n="range_open" r="open" /> signals that a{" "}
            <R n="range" /> is <R n="open_range">open</R>.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            The value <DefVariant n="area_any" r="any" /> signals that an{" "}
            <R n="Area" /> <R n="area_include">includes</R> <Rs n="Entry" />
            {" "}
            with arbitrary <Rs n="entry_subspace_id" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            <DefVariant n="access_read" r="read" />{" "}
            is a value that signifies that a capability grants the ability to
            {" "}
            <Em>read</Em> some <Rs n="Entry" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            <DefVariant n="access_write" r="write" />{" "}
            is a value that signifies that a capability grants the ability to
            {" "}
            <Em>write</Em> some <Rs n="Entry" />.
          </P>
        </PreviewScope>

        <Hsection n="spec_statuses" title="Specification Statuses">
          <PreviewScope>
            <P>
              <Green>
                <Def
                  n="status_final"
                  r="Final"
                  refClass="green"
                  defClass="green"
                />
              </Green>{" "}
              means the specified concepts will not change anymore. You can
              safely implement this specification.
            </P>

            <P>
              Anyone — including us — wishing for changes will have to fork and
              create their own, derivative specification. We may still update
              the page with presentational and non-normative changes.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <SkyBlue>
                <Def
                  n="status_candidate"
                  r="Candidate"
                  refClass="sky-blue"
                  defClass="sky-blue"
                />
              </SkyBlue>{" "}
              means we have a complete design and first implementation
              experience, but we want to practically validate it some more
              before committing to never changing it.
            </P>

            <P>
              We may still change details as issues arise. In principle, we
              might even do fundamental changes, but we hope optimistic this
              will not be necessary. We encourage implementation efforts and
              would love to hear about any stumbling blocks you encounter.
            </P>

            <P>
              We keep a changelog and RSS feed of all changes to{" "}
              <R n="status_candidate" /> specifications <R n="spec_changes" />.
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              <Orange>
                <Def
                  n="status_proposal"
                  r="Proposal"
                  refClass="orange"
                  defClass="orange"
                />
              </Orange>{" "}
              means we have a complete design which we think should work, but
              which has not been validated by any implementation work yet.
            </P>

            <P>
              There will probably be changes unless we got it right the first
              time. If we got it really wrong, there may be fundamental changes.
              While we would be delighted by outside implementation efforts and
              reports of stumbling blocks, we will happily save you the effort.
            </P>
          </PreviewScope>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
