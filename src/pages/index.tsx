import { H2, H3, Hr, Img, Li, Nav, P, Ul } from "macromania-html";
import { PageTemplate } from "../pageTemplate.tsx";
import { R, Rs } from "macromania-defref";
import { Marginale } from "macromania-marginalia";
import { File } from "macromania-outfs";
import { ResolveAsset } from "macromania-assets";
import { Expression } from "macromania";

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
        <Marginale>
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
        <Img
          clazz="splash-image"
          src={<ResolveAsset asset={["splash.png"]} />}
          alt={`A detailed illustration. In the centre, a Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word \"Willow\". Connected to this emblem with dashed lines are various networks. In the top left, a network of computers being used by Alfie and Betty. On the right, Gemma, Epson, and Phoebe are networking with handheld devices. In the bottom left, Lemmy is crouched behind a server, trying to fix it. Below, Dalton heaves an enormous USB stick around. In the bottom right, Bip and Bop chat with each other. And at the top, a frustrated Numpty is unable to connect with anyone.`}
        />
      }
    >
      <P clazz="tagline wide">
        Peer-to-peer storage which scales up, down, and sideways.
      </P>

      <Ul clazz="taglist wide">
        <Li>Works offline.</Li>
        <Li>Store any kind of data.</Li>
        <Li>Destructive edits.</Li>
        <Li>Real deletion.</Li>
        <Li>Fine-grained permissions.</Li>
        <Li>Encrypted.</Li>
        <Li>Private networks.</Li>
        <Li>Public networks.</Li>
        <Li>Live networking.</Li>
        <Li>Sneakernets.</Li>
        <Li>Rust implementations.</Li>
        <Li>Free forever, in every sense.</Li>
      </Ul>

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
          <Li>
            <R n="rust">Rust</R>
          </Li>
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
        tagline="Synchronisable data storage with destrucive editing."
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
          <>
            Actually delete stuff with <R n="prefix_pruning" />.
          </>,
          "End-to-end encryptable.",
          "Eventually consistent.",
          "Rust implementation.",
        ]}
      />

      <SpecBreakdown
        title={<R n="meadowcap" />}
        tagline={"A capability system for fine-grained access to Willow data."}
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
          "Rust implementation.",
        ]}
      />

      <SpecBreakdown
        title={<R n="sync">W.G.P.S.</R>}
        tagline={"Private and efficient synchronisation for Willow data."}
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
          "Rust implementation in progress.",
        ]}
      />

      <SpecBreakdown
        title={<R n="sideloading">Sideloading</R>}
        tagline={"Securely deliver Willow data by any means possible."}
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
          "Rust implementation in progress.",
        ]}
      />

      <H2>In a nutshell</H2>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "local-first.png"]} />}
            alt="An anthropomorphic computer smiles and shrugs while a series of comical connectivity issues threaten its ethernet cable: a mouse nibbles through the cable, an axe chops it up, and an anvil falls toward it at high velocity."
          />
        </Marginale>
        Data storage which never goes offline. You get always-available storage
        for arbitrary data (e.g. text, images, audio, video). You can have as
        many of these <Rs n="store"></Rs> as you want, keyed to different{" "}
        <Rs n="namespace" />. When stores from different devices belong to the
        same namespace, they <R n="store_join">deterministically sync</R>{" "}
        with each other.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "privacy.png"]} />}
            alt="A cartoonish troll tries to spy on a person enjoying themselves with a paper airplane, but a solid brick wall blocks the troll’s line of sight. The trool is deeply unhappy about this circumstance."
          />
        </Marginale>
        Private and{" "}
        <R n="handshake_and_encryption">end-to-end encrypted</R>. Other users
        can't find out what you’re interested in{" "}
        <R n="private_interest_overlap">
          unless they already know about it themselves
        </R>. And if they get that far, they still have to be able to{" "}
        <R n="e2e">
          decrypt synced data
        </R>{" "}
        to make any sense of it.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "sideload.png"]} />}
            alt={`An envelope with a Willow-flavoured file inside. A Willow-flavoured USB stick. A bird carrying a Willow-flavoured file.`}
          />
        </Marginale>
        Exchange data in whatever way suits you using{" "}
        <R n="sideloading">sideloading</R>. Go completely off-grid with USB keys
        and dead drops, or send packages of data via your favourite existing
        infrastructure. All completely encrypted.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "prefix-pruning.png"]} />}
            alt="Three stylised paper files hang off a tree branch. The branch is being cut off near its base by a pair of hedge clippers, in a way that all files will be pruned of the tree."
          />
        </Marginale>
        Total erasure of data. Distributed systems use tombstones to communicate
        deletes, but even these leave metadata behind.{" "}
        <R n="prefix_pruning">Prefix pruning</R>{" "}
        deletes many entries and all of their metadata in their entirety,
        leaving a single tombstone in their place.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "capabilities.png"]} />}
            alt={`Two stylised admission tickets. One says "Admin", the other says "Aug 1st to Sep 3rd".`}
          />
        </Marginale>
        Fine grained capabilities. Restrict read and write access by{" "}
        <R n="Area">semantically meaningful areas of data</R>, and choose the
        right kind of community topology for you with{" "}
        <R n="meadowcap">Meadowcap</R>.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "partial-sync.png"]} />}
            alt={`A cake with a single slice being removed. The selected slice has a strawberry on top. Hmm, strawberry cake...`}
          />
        </Marginale>
        Partial sync. Have a lot of data, but don't want to sync the whole thing
        to a particular device? Choose which data to replicate by what, when, or
        who.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "destructive-edits.png"]} />}
            alt={`A pencil overwriting a sequence of bits (zeros and ones), leaving no trace of the overwritten bits.`}
          />
        </Marginale>
        Destructive edits. When you update a value, the old values and
        associated metadata are overwritten.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "forget-data.png"]} />}
            alt={`A cartoon foot cartoonishly kicking a cartoon file out of a cartoon door.`}
          />
        </Marginale>
        Locally delete data you don’t want to store, even if it was authored by
        someone else.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "ants.png"]} />}
            alt={`Five ants carry zeros and ones off to the right. The numbers are about as large as the hard-working insects.`}
          />
        </Marginale>
        <R n="lcmux">Peers can communicate resource budgets</R>, so devices with
        very limited memory can sync too.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "parametrised.png"]} />}
            alt={`The pronoun "I", followed by a heart, followed by two crossed-out names of hash functions ("MD5" and "SHA256), followed by the hash function of choice: "BLAKE3".`}
          />
        </Marginale>
        You choose the transport and cryptographic primitives suited to your
        use-case. Or use our{" "}
        <R n="willow25">secure and efficient set of recommended parameters</R>.
      </P>
    </PageTemplate>
  </File>
);
