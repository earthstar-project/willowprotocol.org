import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, Hr, Img, Li, P, Ul } from "macromania-html";
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
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";

export const why_willow = (
  <Dir name="why_willow">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Why Did We Make Willow?"
        headingId="why_willow"
        heading={"Why Did We Make Willow?"}
      >
        <P>
          With so many existing protocols for data networks out there, why would
          we make Willow?
        </P>

        <P>
          We believe we’ve found a novel combination of techniques which allows
          Willow to satisfy many vital — and competing — criteria all at once.
        </P>

        <P>
          We made Willow to make running a network <Em>together</Em>{" "}
          a sustainable practice. A protocol which enables a plurality of small,
          private networks alongside big, public ones. A protocol where the
          burden of running infrastructure is divided among its users, with no
          need for volunteer server admins.
        </P>

        <P>
          We made Willow to be a credible solution to digital networking in an
          uncertain era. It must be resilient in the times we’re <Em>forced</Em>
          {" "}
          to scale down, whether that’s due to a temporary loss of signal,
          natural disaster, or war. It must be respectful of the resources we’re
          left with, and able to run on low-spec hardware and on low-bandwidth
          networks.
        </P>

        <P>
          We made Willow to be private, so that it’s possible to find people
          with common interests without broadcasting those interests to the
          world, and so that it’s possible to let others distribute data on your
          behalf without letting them know what that data <Em>is</Em>.
        </P>

        <P>
          We made Willow to reconcile peer-to-peer networks with social
          realities. Wrangling the complexity of distributed systems shouldn’t
          mean we trade away basic features like deletion, or accept data
          structures which can only grow without limit.
        </P>

        <P>
          We made Willow to do something to the best of our ability, and in the
          light of the kind of world we’d like to see.
        </P>

        <Hr />

        <P>
          For more detailed comparisons to various other protocols, see{" "}
          <R n="willow_compared">here</R>.
        </P>
      </PageTemplate>
    </File>
  </Dir>
);
