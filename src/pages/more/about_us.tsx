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
          Over the course of ten months, we put a tremendous amount of work and
          care into the design of these protocols and the website which serves
          as its introduction. Here’s a little bit about us.
        </P>

        <Hsection title="Aljoscha Meyer" n="aljoscha_section">
          <PreviewScope>
            <P>
              <Marginale inlineable>
                <Img
                  src={<ResolveAsset asset={["about", "aljoscha.png"]} />}
                  alt="A webcam-angle drawing of Aljoscha in his room, as seen by gwil in their many video chats. Lovely purple curtains and a piano in the background (the sheet music is Bach, but you cannot tell from the drawing), big glasses and a big smile on his face."
                />
              </Marginale>

              <Span style="font-style: italic">
                I’m{" "}
                <Def n="aljoscha" r="Aljoscha" rs="Aljoschas" wide />, a
                computer scientist and fledgling researcher based in Berlin,
                Germany. As an avid shaver of yaks who even tackles protocol
                website creation by first writing a custom macro processor from
                scratch, I am grateful that <R n="gwil" />{" "}
                decided to team up on Willow. Turns out we actually got
                something done this way that we are quite proud of. Now, how do
                I turn any of this into a paper to justify the immense time
                sink? Intrinsic motivation cannot possibly go that far, right?
              </Span>

              <Ul>
                <Li>
                  <AE href="https://aljoscha-meyer.de/">Website</AE>
                </Li>
                <Li>
                  <AE href="mailto:mail@aljoscha-meyer.de">Email</AE>
                </Li>
              </Ul>
            </P>
          </PreviewScope>
        </Hsection>

        <Hsection
          title={
            <>
              Sam <Quotes>gwil</Quotes> Gwilym
            </>
          }
          n="gwil_section"
        >
          <PreviewScope>
            <P>
              <Marginale inlineable>
                <Img
                  src={<ResolveAsset asset={["about", "gwil.png"]} />}
                  alt="A webcam-angle drawing of gwil in the studio, as seen by Aljoscha in their many video chats. Thankfully still drawn by gwil, however. Sunlight fills the room, the walls are full of drawings. Gwil grins as gwil often does, and gives a thumbs-up."
                />
              </Marginale>

              <Span style="font-style: italic">
                I’m{" "}
                <Def n="gwil" r="gwil" rs="gwils" wide />. I’m a programmer,
                illustrator, and parent living in the Hague, the Netherlands.
                Despite my better judgement, I've been active in the
                decentralised space for a couple of years now. I'm a core
                maintainer for Earthstar and Willow's TypeScript and Rust
                implementations. <Rb n="aljoscha" />{" "}
                and I have really pushed each other to do our best work in
                designing these protocols, though it's really all the wobbly
                drawings for the site that have been the highlight of my
                computer science career.
              </Span>

              <Ul>
                <Li>
                  <AE href="https://gwil.garden">Blog</AE>
                </Li>
                <Li>
                  <AE href="https://post.lurk.org/@gwil">Mastodon</AE>
                </Li>
                <Li>
                  <AE href="mailto:sam@gwil.garden">Email</AE>
                </Li>
              </Ul>
            </P>
          </PreviewScope>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
