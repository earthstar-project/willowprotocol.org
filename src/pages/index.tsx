import { Img, Li, Nav, P, Ul } from "macromania-html";
import { PageTemplate } from "../pageTemplate.tsx";
import { R } from "macromania-defref";
import { Marginale } from "macromania-marginalia";
import { File } from "macromania-outfs";
import { ResolveAsset } from "macromania-assets";

export const index = (
  <File name="index.html">
    <PageTemplate
      htmlTitle="Willow"
      headingId="willow"
      heading={
        <Img
          src="/assets/emblem.png"
          alt={`A Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word \"Willow\".`}
        />
      }
    >
      <P clazz="introductory">
        Protocols for synchronisable data stores. The best parts? Fine-grained
        permissions, a keen approach to privacy, destructive edits, and a dainty
        bandwidth and memory footprint.
      </P>

      <Nav>
        <Ul>
          <Li>
            <R n="why_willow">Why did we make Willow?</R>
          </Li>
          <Li>
            <R n="data_model">
              If you read only one specification, let it be this one
            </R>
          </Li>
          <Li>
            <R n="specifications">All of the specifications</R>
          </Li>
          <Li>
            <R n="changes">News and updates</R>
          </Li>
        </Ul>
      </Nav>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "local-first.png"]} />}
            alt="An anthropomorphic computer smiles and shrugs while a series of comical connectivity issues threaten its ethernet cable: a mouse nibbles through the cable, an axe chops it up, and an anvil falls toward it at high velocity."
          />
        </Marginale>
        Data storage which never goes offline. You get always-available storage
        for arbitrary data (e.g. text, media). You can have as many of these
        stores as you want, keyed to different namespaces. When stores from
        different devices belong to the same namespace, they deterministically
        sync with each other.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "privacy.png"]} />}
            alt="A cartoonish troll tries to spy on a person enjoying themselves with a paper airplane, but a solid brick wall blocks the troll’s line of sight. The trool is deeply unhappy about this circumstance."
          />
        </Marginale>
        Private and end-to-end encrypted. Other users can't find out what you’re
        interested in unless they already know about it themselves. And if they
        get that far, they still have to be able to decrypt synced data to make
        any sense of it.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "prefix-pruning.png"]} />}
            alt="Three stylised paper files hang off a tree branch. The branch is being cut off near its base by a pair of hedge clippers, in a way that all files will be pruned of the tree."
          />
        </Marginale>
        Total erasure of data. Distributed systems use tombstones to communicate
        deletes, but even these leave metadata behind. Prefix pruning deletes
        many entries and all of their metadata in their entirety, leaving a
        single tombstone in their place.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "capabilities.png"]} />}
            alt={`Two stylised admission tickets. One says "Admin", the other says "Aug 1st to Sep 3rd".`}
          />
        </Marginale>
        Fine grained capabilities. Restrict read and write access by
        semantically meaningful ranges of data, or time range. Use your
        favourite existing capability system, or try our Meadowcap system.
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
        Peers can communicate resource budgets, so devices with very limited
        memory can sync too.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "parametrised.png"]} />}
            alt={`The pronoun "I", followed by a heart, followed by two crossed-out names of hash functions ("MD5" and "SHA256), followed by the hash function of choice: "BLAKE3".`}
          />
        </Marginale>
        You choose the transport and cryptographic primitives suited to your
        use-case.
      </P>

      <P>
        <Marginale inlineable>
          <Img
            src={<ResolveAsset asset={["landing", "concurrent.png"]} />}
            alt={`A happy little smiley face holding a laptop in one hand and a phone in the other hand. Yay.`}
          />
        </Marginale>
        Authors can write from multiple devices concurrently. Yay.
      </P>
    </PageTemplate>
  </File>
);
