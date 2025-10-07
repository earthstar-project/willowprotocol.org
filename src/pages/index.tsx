import { Div, H3, Hr, Img, Li, Nav, P, Ul } from "macromania-html";
import { PageTemplate } from "../pageTemplate.tsx";
import { R } from "macromania-defref";
import { Marginale } from "macromania-marginalia";
import { File } from "macromania-outfs";
import { ResolveAsset } from "macromania-assets";
import { Expression } from "macromania";
import { Hsection } from "macromania-hsection";
import { Hidden } from "../macros.tsx";

function SpecBreakdown(
  { title, tagline, emblem, features }: {
    title: Expression;
    tagline: Expression;
    emblem: Expression;
    features: Expression[];
  },
): Expression {
  return (
    <>
      <H3>{title}</H3>
      <P clazz="spec-tagline">
        <Marginale inlineable>
          {emblem}
        </Marginale>
        {tagline}
      </P>
      <Ul clazz="spec-taglist">
        {features.map((feature) => <Li>{feature}</Li>)}
      </Ul>
    </>
  );
}

export const index = (
  <File name="index.html">
    <PageTemplate
      htmlTitle="Home"
      headingId="willow"
      heading={
        <>
          <Img
            clazz="only-narrow"
            src="/assets/emblem.png"
            alt={`A Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word "Willow".`}
          />
          <Img
            clazz="splash-image only-wide"
            src={<ResolveAsset asset={["splash.png"]} />}
            alt={`A detailed illustration. In the centre, a Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word \"Willow\". Connected to this emblem with dashed lines are various networks. In the top left, a network of computers being used by Alfie and Betty. On the right, Gemma, Epson, and Phoebe are networking with handheld devices. In the bottom left, Lemmy is crouched behind a server, trying to fix it. Below, Dalton heaves an enormous USB stick around. In the bottom right, Bip and Bop chat with each other. And at the top, a frustrated Numpty is unable to connect with anyone.`}
          />
        </>
      }
    >
      <P clazz="tagline wide">
        Peer-to-peer protocols which scale up, down, and sideways.
      </P>

      <Div id="outline">
        <P>
          <Marginale inlineable>
            <Img
              src={<ResolveAsset asset={["landing", "outline1.png"]} />}
              alt={`Emblem`}
            />
          </Marginale>
          Willow is a set of protocols for running your own digital spaces. All
          spaces are completely independent from each other, and they can be as
          big or small as you want.
        </P>

        <P>
          <Marginale inlineable>
            <Img
              src={<ResolveAsset asset={["landing", "outline2.png"]} />}
              alt={`Emblem`}
            />
          </Marginale>
          These digital spaces are stored on your own hardware, cutting out
          unwanted third parties.
        </P>

        <P>
          <Marginale inlineable>
            <Img
              src={<ResolveAsset asset={["landing", "outline3.png"]} />}
              alt={`Emblem`}
            />
          </Marginale>
          Only devices which have been given explicit consent to store data can
          receive it.
        </P>

        <P>
          <Marginale inlineable>
            <Img
              src={<ResolveAsset asset={["landing", "outline4.png"]} />}
              alt={`Emblem`}
            />
          </Marginale>
          Store any kind of data, organised in a manner similar to files and
          folders.
        </P>

        <P>
          <Marginale inlineable>
            <Img
              src={<ResolveAsset asset={["landing", "outline5.png"]} />}
              alt={`Emblem`}
            />
          </Marginale>
          Data can travel between devices in many different ways, so you can
          choose the appropriate pathways, whether that's the internet or a USB
          key.
        </P>
      </Div>

      <Nav clazz="ctas wide">
        <Ul>
          <Li>
            <R n="data_model">
              Start here
            </R>
          </Li>
          <Li>
            <R n="specifications">Specifications</R>
          </Li>

          <Hidden>
            <Li id="rust-nav">
              <R n="rust">Rust</R>
            </Li>
          </Hidden>

          <Li>
            <R n="changes">News</R>
          </Li>
          <Li>
            <R n="more">More!</R>
          </Li>
        </Ul>
      </Nav>

      <SpecBreakdown
        title={<R n="data_model">Willow</R>}
        tagline="Synchronisable data storage with destructive editing."
        emblem={
          <Img
            src={<ResolveAsset asset={["landing", "spec_willow.png"]} />}
            alt={`Emblem`}
          />
        }
        features={[
          "Works offline.",
          "Store any kind of data.",
          "Truly destructive editing.",
          "Actually delete stuff.",
          "End-to-end encryptable.",
          "Eventually consistent.",
        ]}
      />

      <SpecBreakdown
        title={<R n="meadowcap" />}
        tagline="A capability system for fine-grained access control"
        emblem={
          <Img
            src={<ResolveAsset asset={["landing", "spec_meadowcap.png"]} />}
            alt={`Emblem`}
          />
        }
        features={[
          "No central authority needed.",
          "No assumptions about what an identity is.",
          "Owned namespaces for top-down moderation.",
          "Communal namespaces for bottom-up networks.",
        ]}
      />

      <SpecBreakdown
        title={<R n="sync">W.G.P.S.</R>}
        tagline="Private and efficient synchronisation"
        emblem={
          <Img
            src={<ResolveAsset asset={["landing", "spec_wgps.png"]} />}
            alt={`Emblem`}
          />
        }
        features={[
          "Encrypted communication.",
          "Only syncs what you're interested in.",
          "Only syncs what others have access to.",
          "Man-in-the-middle attack resistant.",
          "Streaming sync.",
          "Dainty bandwidth and memory usage.",
        ]}
      />

      <SpecBreakdown
        title={<R n="sideloading">Sideloading</R>}
        tagline="Securely deliver data by any means possible."
        emblem={
          <Img
            src={<ResolveAsset asset={["landing", "spec_sideloading.png"]} />}
            alt={`Emblem`}
          />
        }
        features={[
          "Package Willow data in a single encrypted file.",
          "Move it however you want.",
          "Sneakernets.",
          "Email.",
          "FTP servers.",
          "Messaging apps.",
          "Dead drops.",
        ]}
      />
    </PageTemplate>
  </File>
);
