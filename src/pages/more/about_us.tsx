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
          <Marginale inlineable>
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
          <PreviewScope>
            <Def n="aljoscha" r="Aljoscha" rs="Aljoschas">
              Aljoscha
            </Def>{" "}
            is a computer scientist. He lives in Berlin.
          </PreviewScope>

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
          <PreviewScope>
            <Def n="gwil" r="gwil" rs="gwils">
              Sam
            </Def>{" "}
            is a programmer and illustrator. She lives in The Hague.
          </PreviewScope>

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

        <Hsection title="Special Thanks" n="special_thanks">
          <P>
            <AE href="https://nuh.dev/">Nuh</AE>{" "}
            realised that Willow could use capability systems for authorisation.
            Thank you.
          </P>

          <P>
            <AE href="https://frando.unbiskant.org/">Frando</AE>{" "}
            has implemented, discussed, and improved several iterations of the
            {" "}
            <R n="willow_confidential_sync">Confidential Sync</R>{" "}
            protocol. Thank you.
          </P>

          <P>
            <AE href="https://dziban.net/">Marcelino Coll</AE>{" "}
            reported a critical error in an early draft of the{" "}
            <R n="willow_confidential_sync">Confidential Sync</R>{" "}
            specification. Thank you.
          </P>

          <P>
            <AE href="https://joakim.io/">Joakim</AE> pointed us to{" "}
            <AE href="https://en.wikipedia.org/wiki/International_Atomic_Time">
              International Atomic Time
            </AE>{" "}
            as a better choice than UNIX time for how to interpret timestamps.
            Thank you.
          </P>

          <P>
            <AE href="https://shiba.computer/">Cade</AE>{" "}
            has been an inspiration and aspiration for Willow throughout its
            creation. Thank you.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
