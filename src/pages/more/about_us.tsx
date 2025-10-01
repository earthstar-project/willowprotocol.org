import { PageTemplate } from "../../pageTemplate.tsx";
import { AE, Quotes } from "../../macros.tsx";
import { Dir, File } from "macromania-outfs";
import { A, Em, Img, Li, P, Span, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { PreviewScope } from "macromania-previews";
import { Hsection } from "macromania-hsection";
import { Marginale } from "macromania-marginalia";
import { Def, R, Rb } from "macromania-defref";

export const about_us = (
  <Dir name="about-us">
    <File name="index.html">
      <PageTemplate
        htmlTitle="About Us"
        headingId="about"
        heading="About Us"
      >
        <P>
          <Marginale>
            <Img
              src={<ResolveAsset asset={["about", "cinn.png"]} />}
              alt="Cinnamon"
            />
          </Marginale>
          Willow started as a{" "}
          <A href={<ResolveAsset asset={["about", "soilsun.md"]} />}>
            minimalistic reimagining
          </A>{" "}
          of{" "}
          <AE href="https://earthstar-project.org">Earthstar</AE>. Over time, we
          did a <Em>lot</Em> more reimagining, and a lot less minimalism.
        </P>

        <P>
          The path / author / timestamp model at the heart of Willow was
          designed by our dear departed friend Cinnamon, without whom there
          would be no Willow. We miss you.
        </P>

        <P>
          <Marginale>
            <Img
              src={<ResolveAsset asset={["about", "wb.png"]} />}
              alt="Aljoscha and Sam"
            />
          </Marginale>
          Willow was designed by Aljoscha Meyer and Sam Gwilym, who have been
          working together since 2022. Their first collaboration was a
          proof-of-concept implementation of range based set reconciliation. But
          they soon realised there was no-one around to say ‘no’, and have used
          Willow as the pretext for spinning out a macro processor, a sink /
          stream abstraction for Rust, and a new secure hash function.
        </P>

        <P>
          <Def n="aljoscha" r="Aljoscha" rs="Aljoschas">
            Aljoscha
          </Def>{" "}
          is a computer scientist. He lives in Berlin.

          <Ul>
            <Li>
              <AE href="https://aljoscha-meyer.de/">Website</AE>
            </Li>
            <Li>
              <AE href="mailto:mail@aljoscha-meyer.de">Email</AE>
            </Li>
          </Ul>
        </P>

        <P>
          <Def n="gwil" r="gwil" rs="gwils">
            Sam
          </Def>{" "}
          is a programmer and illustrator. She lives in The Hague.

          <Ul>
            <Li>
              <AE href="https://gwil.garden">Website</AE>
            </Li>
            <Li>
              <AE href="mailto:sam@gwil.garden">Email</AE>
            </Li>
            <Li>
              <AE href="https://post.lurk.org/@gwil">Mastodon</AE>
            </Li>
          </Ul>
        </P>
      </PageTemplate>
    </File>
  </Dir>
);
