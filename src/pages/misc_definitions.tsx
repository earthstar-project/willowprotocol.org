import { Dir, File } from "macromania-outfs";
import { Code, Em, Hr, Li, P, Ul } from "macromania-html";
import { PageTemplate } from "../pageTemplate.tsx";
import {
  AE,
  Curly,
  Green,
  Orange,
  Purple,
  Quotes,
  SkyBlue,
  Vermillion,
} from "../macros.tsx";
import { PreviewScope } from "macromania-previews";
import { DefFunction, DefType, DefValue, DefVariant } from "macromania-rustic";
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
            We define{" "}
            <Code>
              <DefFunction n="default_entry" />(<DefValue
                n="default_entry_ns"
                r="default_namespace_id"
              />, <DefValue n="default_entry_ss" r="default_subspace_id" />,
              {" "}
              <DefValue n="default_entry_digest" r="default_digest" />)
            </Code>{" "}
            to denote the <R n="Entry" /> with the following members:
          </P>
          <Ul>
            <Li>
              <Code>
                <R n="entry_namespace_id" /> = <R n="default_entry_ns" />
              </Code>,
            </Li>
            <Li>
              <Code>
                <R n="entry_subspace_id" /> = <R n="default_entry_ss" />
              </Code>,
            </Li>
            <Li>
              <Code>
                <R n="entry_path" />
              </Code>{" "}
              is the empty <R n="Path" />,
            </Li>
            <Li>
              <Code>
                <R n="entry_timestamp" /> = 0
              </Code>,
            </Li>
            <Li>
              <Code>
                <R n="entry_payload_length" /> = 0
              </Code>, and
            </Li>
            <Li>
              <Code>
                <R n="entry_payload_digest" /> = <R n="default_entry_digest" />
              </Code>.
            </Li>
          </Ul>
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
            The value <DefVariant n="ss_any" r="any" />{" "}
            signals that not any specific <R n="SubspaceId" />{" "}
            is meant, but any arbitrary one works.
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

          <PreviewScope>
            <P>
              <Purple>
                <Def
                  n="status_sketch"
                  r="Sketch"
                  refClass="purple"
                  defClass="purple"
                />
              </Purple>{" "}
              means we are sharing an early draft. You should <Em>not</Em>{" "}
              try implementing this yet, but feedback on the design is very
              welcome!
            </P>
          </PreviewScope>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
