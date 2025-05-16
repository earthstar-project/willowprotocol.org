import { Dir, File } from "macromania-outfs";
import { AE, Path, Quotes } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Em, P } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { R, Rs } from "macromania-defref";

export const willow_compared = (
  <Dir name="willow_compared">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Comparison to Other Protocols"
        headingId="willow_compared"
        heading="Comparison to Other Protocols"
        toc
        parentId="more"
      >
        <P>
          How does Willow compare conceptually and technically to other
          distributed systems and protocols? Here, we give an overview regarding
          some <Sidenote note={<>As of early 2025.</>}>popular</Sidenote>{" "}
          projects.
        </P>

        <Hsection
          n="compare_ipfs"
          title="IPFS, Veilid, Content-Addressed Storage"
        >
          <P>
            <AE href="https://ipfs.tech/">IPFS</AE>,{" "}
            <AE href="https://veilid.com/">Veilid</AE>, and similar systems are
            fundamentally about providing and retrieving{" "}
            <Em>content-addressed data</Em>. You give the system a hash, and it
            answers with the original data. Ingesting data into the system
            requires no information but the data itself. Willow, on the other
            hand, employs explicit <Em>naming</Em> of data. Rather than{" "}
            <Em>ingesting</Em> data into a system, you <Em>bind</Em>{" "}
            data to a freely chosen name. Retrieving data consists of supplying
            a name and receiving the value that was most recently bound to that
            name.
          </P>

          <P>
            Pure content-addressing faces a bootstrapping problem: in order to
            actively distribute data to others, I must first inform them about
            the hash of that data. Doing so via the system itself requires me to
            send the hash of the hash first, and so on. For every new piece of
            data, I must eventually leave the system and transmit a new hash
            out-of-band. Willow functions differently: after agreeing on an
            initial name, I can continuously bind new data to the name, which
            automatically reaches those interested.
          </P>

          <P>
            Furthermore, Willow's names are meaningful and hierarchical. Hashing
            individual moves of an unfolding chess match yields completely
            unrelated hashes. In Willow, I can assign related names
            (<Rs n="Path" />) to the moves:{" "}
            <Path components={["chess", "me_vs_alex", "move1"]} />,{" "}
            <Path components={["chess", "me_vs_alex", "move2"]} />, et cetera.
            The synchronisation API makes use of the hierarchy; I can requests
            all moves in this game (names starting with{" "}
            <Path components={["chess", "me_vs_alex"]} />), or all chess games
            in total (names starting with <Path components={["chess"]} />).
          </P>

          <P>
            This example showcases another difference: names are chosen{" "}
            <Em>by</Em> someone in a specific{" "}
            <Em>context</Em>. My names need not make sense to Alex in
            Kentucky<Marginale>Sorry, Alex!</Marginale>. Willow does not aim for
            a globally meaningful data pool, but for organising data in a way
            that is meaningful to certain groups of people. Hashes, in contrast,
            are universal. With IPFS you query <Quotes>the system</Quotes>{" "}
            for data, with Willow you query peers with whom you share some
            context.
          </P>

          <P>
            Content-addressed data excels at immutability, statelessness, and
            global connectivity. Willow embraces mutability and statefulness,
            locality, and structure. Just like functional and imperative
            programming, there is a place for both. As the landscape of modern
            peer-to-peer applications matures, we expect content-addressed
            systems and Willow to complement each other. Lauding either as
            universally superior misses the point.
          </P>
        </Hsection>

        <Hsection
          n="compare_logs"
          title="Scuttlebutt, Hypercore, Append-Only Logs"
        >
          <P>
            <AE href="https://scuttlebutt.nz/">Secure Scuttlebutt</AE>,{" "}
            <AE href="https://hypercore-protocol.org">Hypercore</AE>, and
            similar systems arrange data into linked hash chains, and identify
            these lists (<Quotes>logs</Quotes>) via the public keys of a digital
            signature scheme<Marginale>
              In principle, you can also design a log-based system to use
              capabilities instead of public keys. As of writing, there exists
              no popular such system, however.
            </Marginale>. Subscribing to a log amounts to requesting data
            without knowing the hash of that data, possibly even data that does
            not yet exist at the time of subscription. This elegantly tackles
            the bootstrapping problem faced by purely content-addressed systems.
          </P>

          <P>
            Data replication is more efficient and significantly more simple
            than for Willow: for each log, peers simply exchange the number of
            entries they have in that log, and whoever sent a greater number
            then transmits all entries the other peer is missing.
          </P>

          <P>
            A hash chain of data cryptographically authenticates that authors
            never{" "}
            <Sidenote
              note={
                <>
                  Or, more precisely, it ensures that such misbehavior can be
                  detected efficiently and arbitrarily long after the fact.
                </>
              }
            >
              produce
            </Sidenote>{" "}
            differing extensions of the same log. In itself, this can be a{" "}
            <AE href="https://en.wikipedia.org/wiki/Certificate_Transparency">
              laudable feature
            </AE>, but it precludes the option of concurrent writes from
            multiple devices. With{" "}
            <R n="d3rbsr" />, Willow can achieve efficient data synchronisation
            without the need to restrict updates to a linear sequence. We do not
            need to enforce linearity to keep sync complexity manageable, so we
            opt for effortless multi-writer support instead.
          </P>

          <P>
            The need to verify the hash chain also makes it difficult to edit or
            delete (meta-) data. This can be a boon for some use-cases, but also
            quite dangerous when employed carelessly. Furthermore, data storage
            may be{" "}
            <Sidenote note={<>As of writing, that is.</>}>cheap</Sidenote>, but
            designing systems for unbounded growth tends to backfire sooner or
            later. Willow deliberately avoids any cryptographic proofs of
            completeness, allowing for traceless data removal when the need
            arises.
          </P>
        </Hsection>

        <Hsection n="compare_nostr" title="Nostr">
          <P>
            <AE href="https://nostr.com/">Nostr</AE>{" "}
            appears to be quite similar to Willow at a cursory glance. Willow
            peers store and exchange sets of{" "}
            <Rs n="Entry" />, Nostr peers store and exchange sets of{" "}
            <Em>events</Em>. Every <R n="Entry" /> has a{" "}
            <R n="entry_timestamp" />, every event has a <Code>created_at</Code>
            {" "}
            time. Every <R n="Entry" /> belongs to a single{" "}
            <R n="subspace" />, every event belongs to a single{" "}
            <Code>pubkey</Code>. Willow organises <Rs n="Entry" /> by their{" "}
            <Rs n="entry_path" />, Nostr organises events by their{" "}
            <Code>tags</Code>.
          </P>

          <P>
            While <Rs n="subspace" />{" "}
            are more of a straightforward generalisation of public keys rather
            than a conceptual difference, the difference between paths and tags
            is significant. Paths allow <Rs n="Entry" />{" "}
            to overwrite each other, whereas regular tags do not. This
            difference is a symptom of a significant conceptual difference
            between the protocols: Willow is based on naming data, Nostr is not.
            In Nostr, events are content-addressed — despite the superficial
            similarities, Nostr is ultimately closer to Scuttlebutt than to
            Willow.
          </P>

          <P>
            Willow has more generalist ambitions than Nostr, we focus on
            providing a general-purpose syncing primitive with precisely
            specified semantics and properties such as{" "}
            <AE href="https://en.wikipedia.org/wiki/Eventual_consistency">
              eventual consistency
            </AE>. Nostr takes a much more laissez-faire approach, making it
            significantly easier to implement, but arguably also more difficult
            to <Em>solidly</Em> build upon.
          </P>

          <P>
            Furthermore, the Willow design takes great care to ensure that all
            necessary operations on Willow data are efficiently supported by
            appropriate data structures, whereas Nostr appears more happy to
            quickly get things working on smaller scales. To give an example,
            various <R n="Path" /> handling tasks can be tackled via{" "}
            <AE href="https://en.wikipedia.org/wiki/Radix_tree">
              radix trees
            </AE>, ", whereas the exponential state space of arbitrary
            combinations of tags is much harder to tame. Similarly, Nostr was
            not designed with an efficient set reconciliation protocol in
            mind<Marginale>
              Although there is{" "}
              <AE href="https://github.com/hoytech/negentropy">work</AE>{" "}
              to integrate a proper set reconciliation protocol.
            </Marginale>, despite ultimately being a protocol for exchanging
            sets of events.
          </P>
        </Hsection>

        <Hsection n="compare_fediverse" title="ActivityPub and the Fediverse">
          <P>
            <AE href="https://en.wikipedia.org/wiki/ActivityPub">
              ActivityPub
            </AE>, like Willow, provides proper mutability by referring to data
            via user-selected names. Unlike Willow, however, these names work by
            addressing a particular server that supplies the data. This
            introduces a certain brittleness into the system, and forces server
            operators to take on responsibilities that can be hard to properly
            assess in advance. The projects are similar in spirit, but Willow
            deliberately aims to eliminate the bottleneck of server operators.
          </P>

          <P>
            The <Rs n="owned_namespace" />{" "}
            of Meadowcap were designed to mimic the curative function of a
            fediverse instance host without tying it to computational resources
            (and capability delegation makes it simple to delegate and spread
            the cognitive load). Beyond this, <Rs n="communal_namespace" />{" "}
            provide a model that cannot realistically be replicated in the
            fediverse (unless everybody ran their own server).
          </P>
        </Hsection>

        <Hsection n="compare_es" title="Earthstar">
          <P>
            If <AE href="https://earthstar-project.org/">Earthstar</AE>{" "}
            feels very similar to Willow, then that is no coincidence. Willow
            started out as a reimagining of Earthstar, future Earthstar versions
            will build upon Willow, and the <R n="gwil">core maintainer</R>{" "}
            of Earthstar is one of the two Willow authors.
          </P>
        </Hsection>

        <Hsection n="compare_general" title="General Conclusions">
          <P>
            There exist many other projects in this design space, we cannot list
            them all. These are the ones that have informed the design of Willow
            or that came up as points of reference the most often.
          </P>

          <P>
            Among all these projects, we consider Willow to have the strongest
            story for mutability, as Willow is the only one to completely eschew
            content-addressing on the protocol level. Further improving the
            deletion story is <R n="prefix_pruning" />{" "}
            which is a feature we have not seen in any other protocol we are
            aware of.
          </P>

          <P>
            Another group of features that we consistently miss in other
            protocols are those around capabilities. Willow’s use of write
            capabilities rather than public keys allows for flexible delegation.
            Few if any protocols devote the attention to controlling data
            propagation through read capabilities, and even fewer extend this
            care to metadata privacy by incorporating private intersection
            techniques.
          </P>

          <P>
            The story for end-to-end encryption is considerably more difficult
            for Willow than for content-addressed systems where you can simply
            use hashes of data that happens to be encrypted. <Rs n="Path" />
            {" "}
            allow for comparatively rich semantics for data organisation and
            partial syncing, even when end-to-end encrypted. This combination of
            strucure and end-to-end encryption is one we did not find in
            preexisting protocols.
          </P>

          <P>
            Ultimately, Willow takes on more complexity than many other
            protocols, but it also gives greater expressivity to its users.
            Organising <Rs n="Entry" /> by <Rs n="SubspaceId" />, user-defined
            {" "}
            <Rs n="Path" />, and <Rs n="Timestamp" />{" "}
            is a choice motivated by maximising expressivity while still
            allowing for efficient (partial) sync, end-to-end encryption, and
            principled implementation techniques. All in all, we think it is
            pretty neat!
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
