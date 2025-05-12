import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, Img, Li, P, S, Ul } from "macromania-html";
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
import { Quotes } from "../../macros.tsx";

export const timestamps_really = (
  <Dir name="timestamps_really">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Timestamps, Really?"
        headingId="timestamps_really"
        heading={"Timestamps, Really?"}
        toc
        parentId="more"
      >
        <P>
          Willow implements a key-value store (up to prefix-based overwrites),
          and a key-value store can map any one key to at most one value. Willow
          uses simple numeric <Rs n="Timestamp" />{" "}
          to resolve conflicting mappings. This design decision might trigger
          some healthy scepticism, so this text walks you through our reasoning
          for building them into the protocol.
        </P>

        <Hsection n="why_no_timestamps" title="Healthy Scepticism">
          <P>
            We start by laying out why unreflected usage of timestamps is a bad
            idea; both to give a solid foundation to our arguments in favour of
            using them regardless, and to give you a clear picture of which
            blind spots we might have (please reach out and tell us about them).
          </P>

          <P>
            Peer-to-peer systems operate in an asynchronous model of
            communication: peers cannot know how long it takes until a
            communication of theirs reaches its recipient. This networking model
            is full of <S>depressing</S> <Em>fun</Em>{" "}
            impossibility results, such as the impossibility of{" "}
            <AE href="https://en.wikipedia.org/wiki/Consensus_(computer_science)#The_FLP_impossibility_result_for_asynchronous_deterministic_consensus">
              reaching consensus
            </AE>. If it was possible to reach consensus in a peer-to-peer
            system, it could collectively act like a large, centralised system,
            simplifying many design issues.
          </P>

          <P>
            Assuming that everyone agrees on the same numeric representation of
            time at a given instant would mean that everyone reached{" "}
            <Em>consensus</Em>{" "}
            on the time. Which is impossible. So any system that <Em>relies</Em>
            {" "}
            on accurate timestamps is a centralised system in disguise.
          </P>

          <P>
            But isn’t time a physical phenomenon that resides outside these
            mathematical formalisms and that can be accurately tracked by fully
            independent devices? Unfortunately not. Any physical clock will
            exhibit{" "}
            <AE href="https://en.wikipedia.org/wiki/Clock_drift">
              clock drift
            </AE>, no two clocks can be assumed to stay in perfect sync forever.
            Relativity throws in a few more wrenches, earth satellites already
            have to account for time dilation.
          </P>

          <P>
            The gist is that there can be no globally shared understanding of
            time, we can only reason about the local understanding of time of
            each participant in a distributed system.{" "}
            <AE href="https://en.wikipedia.org/wiki/Clock_synchronisation">
              Clock synchronisation
            </AE>{" "}
            can go a long way, but requires connectivity and limits on how long
            it takes to transmit messages. A <Quotes>proper</Quotes>{" "}
            distributed system opts for{" "}
            <AE href="https://en.wikipedia.org/wiki/Logical_clock">
              logical clocks
            </AE>, tracking the{" "}
            <AE href="https://en.wikipedia.org/wiki/Happened-before">
              happened-before relation
            </AE>{" "}
            of events using{" "}
            <AE href="https://en.wikipedia.org/wiki/Vector_clock">
              vector clocks
            </AE>{" "}
            (or any of their many relatives).
          </P>

          <P>
            Relying on timestamps has another problem: we cannot trust our peers
            to be truthful. Any participant might claim its entries to have
            arbitrary timestamps, whether from the distant future or the distant
            past. And while we might be fine with simply shunning obvious liars
            from our set of peers, even a non-malicious peer might accidentally
            create entries with bogus timestamps if their operating system has
            funny ideas about their current time.
          </P>
        </Hsection>

        <Hsection
          n="why_timestamps_anyways"
          title="Why We Use Timestamps Anyways"
        >
          <P>
            Vector clocks that track the happened-before relation are real, and
            absolute timestamps are not. Why not use vector clocks then? First,
            tracking the happened-before relation accurately requires space
            proportional to the greatest number of concurrent events, a number
            we cannot bound in a peer-to-peer system. And second, it simply
            doesn’t help us: many entries will still be created concurrently,
            and we still have{" "}
            <Sidenote
              note={
                <>
                  We <Quotes>have to</Quotes> in order to guarantee{" "}
                  <AE href="https://en.wikipedia.org/wiki/Eventual_consistency">
                    eventual consistency
                  </AE>, which is a non-negotiable aim of Willow.
                </>
              }
            >
              to
            </Sidenote>{" "}
            deterministically choose a winner.
          </P>

          <P>
            Mapping a set of concurrently created <Rs n="Entry" />{" "}
            to a single winner cannot be done in a fully satisfactory way, but
            we can at least try to improve the situation: by annotating every
            {" "}
            <R n="Entry" /> with its <R n="entry_timestamp" />. <Em>If</Em>{" "}
            the issuers are truthful and have sufficiently synchronised clocks,
            we get the expected outcome of the newest <R n="Entry" />{" "}
            winning. That’s a lot better than taking a purist view and choosing,
            for example, the <R n="Entry" /> with the lowest{" "}
            <R n="entry_payload_digest" />. In case of tied{" "}
            <Rs n="entry_timestamp" />, we can safely fall back to the hash
            option (and distinct <Rs n="Payload" />{" "}
            never hash to the same digest by assumption).
          </P>

          <P>
            If an author is malicious, that author can deliberately choose a
            high timestamp to make its <R n="Entry" />{" "}
            the winner. But that’s not a useful argument against timestamps,
            because <Em>any</Em>{" "}
            deterministic solution (that gives all authors a fair treatment) can
            be gamed. If we decided by lowest hash, the malicious author could
            make semantically meaningless changes to their data until it hashed
            to a sufficiently low value.
          </P>

          <P>
            Willow does not rely on timestamps to be accurate — we still get
            well-defined, eventually-consistent behaviour even if authors choose
            their timestamps arbitrarily. They simply provide a significant
            improvement in terms of the intuitively expected behaviour in the
            happy case. And we can argue that the happy case is quite common.
          </P>

          <P>
            <Marginale>
              You might have more stringent requirements in terms of accuracy,
              in which case another, specialised system would be superior for
              your use-case. That’s okay, a rather general-purpose protocol like
              Willow cannot fit everybody’s needs.
            </Marginale>
            While clock drift is an issue in theory, most clocks are actually
            quite good in practise (as are the clock synchronisation algorithms
            your operating system employs without you knowing). When is the last
            time you missed an appointment because of digital clock drift? If
            you have a clear intuitive sense of which of two <Rs n="Entry" /> is
            {" "}
            <Quotes>newer</Quotes>, chances are the devices that produced those
            {" "}
            <Rs n="Entry" /> have given them <Rs n="entry_timestamp" />{" "}
            that reflect your perception.
          </P>
        </Hsection>

        <Hsection n="rogue_timestamps" title="Handling Rogue Timestamps">
          <P>
            These arguments hopefully are convincing, yet we cannot justify
            using timestamps by exclusively focusing on the happy case. So now
            we discuss the effects of maliciously (or buggily) crafted
            timestamps.
          </P>

          <P>
            Willow automatically separates <Rs n="Entry" /> by{" "}
            <R n="entry_subspace_id" />. An <R n="Entry" /> with a high{" "}
            <R n="entry_timestamp" /> only overwrites <Rs n="Entry" />{" "}
            in the same{" "}
            <R n="subspace" />. If you do not allow anyone else to write to your
            {" "}
            <R n="subspace" />, it does not matter how devilishly clever they
            choose their timestamps — your data remains unaffected.
          </P>

          <P>
            You can still collaborate with untrusted peers by aggregating data
            from different subspaces into a coherent view, whether through{" "}
            <AE href="https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type">
              CRDTs
            </AE>{" "}
            ",{" "}
            <AE href="https://en.wikipedia.org/wiki/Operational_transformation">
              operational transformations
            </AE>, or{" "}
            <AE href="https://arxiv.org/abs/1311.3903">abstract nonsense</AE>.
          </P>

          <P>
            User interfaces that rely on timestamps might still be coaxed into
            undesired behaviour, but that would be just as true if the
            timestamps came from an <R n="Entry" />’s <R n="Payload" />{" "}
            rather than its metadata. The issue of trusting timestamps in UI
            design (or using more secure alternatives) is removed from the
            underlying protocol.
          </P>

          <P>
            But what if you yourself create an <R n="Entry" />{" "}
            with an outlandish{" "}
            <R n="entry_timestamp" />? That’s where things become more
            problematic.
          </P>

          <P>
            If you accidentally backdate an{" "}
            <R n="Entry" />, it will vanish once it comes into contact with your
            own non-buggy <Rs n="Entry" /> (whose <R n="entry_path" />{" "}
            is a non-strict prefix). Frustrating, but no real way around it.
            Fortunately, the consequences are rather limited.
          </P>

          <P>
            If you accidentally assign a large{" "}
            <R n="entry_timestamp" />, things are more problematic: it will
            overwrite all non-buggy <Rs n="Entry" /> (whose <R n="entry_path" />
            {" "}
            it is a non-strict prefix), and the buggy <R n="Entry" />{" "}
            will replicate through the network, deleting the non-buggy{" "}
            <Rs n="Entry" />{" "}
            everywhere. To add insult to injury, you cannot create any new{" "}
            <Rs n="Entry" /> with accurate <Rs n="entry_timestamp" />{" "}
            (under the buggy{" "}
            <R n="entry_path" />) until the buggily assigned time has passed.
            The only remedy is to get every device that stores the buggy{" "}
            <R n="Entry" /> (or{" "}
            <Rs n="Entry" />) to locally delete them at the same time, before
            resuming data replication. This is quite an effort for small
            networks, and completely infeasible for large networks.
          </P>

          <P>
            This is bad. It should only happen very rarely, but it still makes
            sense to implement additional countermeasures. First, any API to
            create <Rs n="Entry" />{" "}
            of the current time can be hardcoded to raise an error if its time
            source reports a timestamp that unrealistically diverges from the
            implementation time. And second, peers can and should simply reject
            incoming <Rs n="Entry" />{" "}
            that were created too far in the future compared to their local
            time. This way, buggy <Rs n="Entry" />{" "}
            stay isolated on the offending device rather than polluting the
            network.
          </P>

          <P>
            An appropriate definition of <Quotes>too far in the future</Quotes>
            {" "}
            depends on the expected clock-drift and can hence be fairly
            accurate. Rejecting <Rs n="Entry" />{" "}
            ten minutes from the future should be more than enough to account
            for any clock drift that can be considered non-buggy. But there are
            good reasons for future-dating <Rs n="Entry" />{" "}
            in the context of moderation, which brings us to the next topic:
            capabilities.
          </P>
        </Hsection>

        <Hsection n="timestamps_meadowcap" title="Timestamps in Meadowcap">
          <P>
            <Marginale>
              Meadowcap is a security component. There will be no happy-case
              reasoning here, only adversarially chosen timestamps.
            </Marginale>

            Willow allows write-access control via the{" "}
            <R n="is_authorised_write" /> function, which receives a full{" "}
            <R n="Entry" /> as input — including its <R n="entry_timestamp" />.
            {" "}
            <R n="meadowcap">Meadowcap</R>{" "}
            (the recommended access-control system for Willow) allows to
            incorporate <Rs n="entry_timestamp" />{" "}
            into access control. In the following, we discuss issues of
            timestamps with respect to Meadowcap. We assume familiarity with
            (the introduction of) the{" "}
            <R n="meadowcap">Meadowcap specification</R>.
          </P>

          <P>
            When a Meadowcap capability restricts <R n="Entry" />{" "}
            creation based on timestamps, this has <Em>absolutely nothing</Em>
            {" "}
            to do with the (physical) time at which <Rs n="Entry" /> are{" "}
            <Em>created</Em>. It merely restricts which times can be{" "}
            <Em>claimed</Em> as the <Rs n="entry_timestamp" /> of{" "}
            <Rs n="Entry" />.
          </P>

          <P>
            If you give me a capability to write <Rs n="Entry" /> to your{" "}
            <R n="subspace" /> on the 18th of July 2024, I can still create{" "}
            <Rs n="Entry" /> in 2032 and add them to your{" "}
            <R n="subspace" />, but only if I give them a{" "}
            <R n="entry_timestamp" />{" "}
            for the 18th of July 2024. And you can make sure that no such{" "}
            <R n="Entry" /> will be propagated by creating your own{" "}
            <Rs n="Entry" /> whose <R n="entry_timestamp" />{" "}
            is higher than that of the 18th of July 2024.
          </P>

          <P>
            Repeatedly handing out capabilities that grant access for a small
            time span imitates the concept of revoking rights in a more
            centralised environment: you simply do not renew someone’s
            capability, and they cannot create accurately timestamped{" "}
            <Rs n="Entry" />{" "}
            once their last capability has expired. And by creating newer{" "}
            <Rs n="Entry" />, you make sure that someone with an expired
            capability cannot make their writes propagate anymore.
          </P>

          <P>
            There is an inherent tension between latency and offline-firstness
            here. Low latency in access revocation requires short-lived
            capabilities, but those need to be continuously renewed by
            contacting the authority that issues the capabilities. If I can only
            connect to the Internet once every three months, I{" "}
            <Sidenote
              note={
                <>
                  There are workarounds, however. I could cache <Rs n="Entry" />
                  {" "}
                  locally until I connect to the Internet, obtain a fresh
                  capability, and then publish all cached <Rs n="Entry" />{" "}
                  with backdated <Rs n="entry_timestamp" />.
                </>
              }
            >
              need
            </Sidenote>{" "}
            long-lived capabilities.
          </P>

          <P>
            The correct trade-off depends on the specific situation, it might
            even be impossible to know in advance. If this sounds discouraging,
            remember that centralised systems cannot tolerate ", em("any"), "
            period of disconnectivity.
          </P>

          <P>
            Write capabilities also happen to provide another layer of
            protection against accidentally future-dating your own{" "}
            <Rs n="Entry" />. If my write capability reaches only one week into
            the future, I can start mitigating the damage done by an accidental
            future-dating after a single week. Furthermore, the buggy clock has
            to produce a time in the valid range, whereas other buggy timestamps
            will be filtered out immediately, leaving the <R n="subspace" />
            {" "}
            unpolluted.
          </P>

          <P>
            The system of expiring capabilities does provide a good reason for
            future-dating entries: a moderator can irrevocably (for the original
            author) delete an <R n="Entry" /> by overwriting it with another
            {" "}
            <R n="Entry" /> whose <R n="entry_timestamp" />{" "}
            is greater than the greatest time at which the original author can
            date their{" "}
            <Rs n="Entry" />. Hence, peers should adjust the safeguard time
            difference they allow between new <Rs n="Entry" />{" "}
            and their local clock to allow for moderation (for example by only
            rejecting <Rs n="Entry" />{" "}
            whose time difference exceeds the longest issued capability lifetime
            by one extra minute).
          </P>
        </Hsection>

        <Hsection n="timestamps_conclusion" title="Conclusion">
          <P>
            Relying on accurate timestamps is a recipe for disaster. Thankfully,
            Willow doesn’t.
          </P>

          <P>
            If you feel like we are missing some vital points or rely on faulty
            arguments, please{" "}
            <AE href="mailto:mail@aljoscha-meyer.de,sam@gwil.garden">
              reach out
            </AE>.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
