import { Expression } from "macro";
import { link, path, pinformative, quotes, site_template } from "../../main.ts";
import { code, em } from "../../../h.ts";
import { hsection, table_of_contents } from "../../../hsection.ts";
import { r, rs } from "../../../defref.ts";
import { marginale, sidenote } from "../../../marginalia.ts";

export const willow_compared: Expression = site_template(
    {
            title: "Comparison to Other Protocols",
            name: "willow_compared",
    },
    [
        pinformative("How does Willow compare conceptually and technically to other distributed systems and protocols? Here, we give an overview regarding some popular projects."),

        table_of_contents(7),
    
        hsection("compare_ipfs", "IPFS, Veilid, Content-Addressed Storage", [
            pinformative(
                link("IPFS", "https://ipfs.tech/"), ", ", link("Veilid", "https://veilid.com/"), ", and similar systems are fundamentally about providing and retrieving ", em("content-addressed data"), ". You give the system a hash, and it answers with the original data. Ingesting data into the system requires no information but the data itself. Willow, on the other hand, employs explicit ", em("naming"), " of data. Rather than ", em("ingesting"), " data into a system, you ", em("bind"), " data to a freely chosen name. Retrieving data consists of supplying a name and receiving the value that was most recently bound to that name.",
            ),
    
            pinformative(
                "Pure content-addressing faces a bootstrapping problem: in order to actively distribute data to others, I must first inform them about the hash of that data. Doing so via the system itself requires me to send the hash of the hash first, and so on. For every new piece of data, I must eventually leave the system and transmit a new hash out-of-band. Willow functions differently: after agreeing on an initial name, I can continuously bind new data to the name, which automatically reaches those interested.",
            ),
    
            pinformative(
                "Furthermore, Willow's names are meaningful and hierarchical. Hashing individual moves of an unfolding chess match yields completely unrelated hashes. In Willow, I can assign related names (", rs("Path"), ") to the moves: ", path("chess", "me_vs_alex", "move1"), ", ", path("chess", "me_vs_alex", "move2"), ", et cetera. The synchronisation API makes use of the hierarchy; I can requests all moves in this game (names starting with ", path("chess", "me_vs_alex"), "), or all chess games in total (names starting with ", path("chess"), ").",
            ),
    
            pinformative(
                "This example showcases another difference: names are chosen ", em("by"), " someone in a specific ", em("context"), ". My names need not make sense to Alex in Kentucky", marginale("Sorry, Alex!"), ". Willow does not aim for a globally meaningful data pool, but for organising data in a way that is meaningful to certain groups of people. Hashes, in contrast, are universal. With IPFS you query ", quotes("the system"), " for data, with Willow you query peers with whom you share some context.",
            ),
    
            pinformative(
                "Content-addressed data excels at immutability, statelessness, and global connectivity. Willow embraces mutability and statefulness, locality, and structure. Just like functional and imperative programming, there is a place for both. As the landscape of modern peer-to-peer applications matures, we expect content-addressed systems and Willow to complement each other. Lauding either as universally superior misses the point.",
            ),
        ]),
    
        hsection("compare_logs", "Scuttlebutt, Hypercore, Append-Only Logs", [
            pinformative(
                link("Secure Scuttlebutt", "https://scuttlebutt.nz/"), ", ", link("Hypercore", "https://hypercore-protocol.org"), ", and similar systems arrange data into linked hash chains, and identify these lists (", quotes("logs"), ") via the public keys of a digital signature scheme", marginale("In principle, you can also design a log-based system to use capabilities instead of public keys. As of writing, there exists no popular such system, however."), ". Subscribing to a log amounts to requesting data without knowing the hash of that data, possibly even data that does not yet exist at the time of subscription. This elegantly tackles the bootstrapping problem faced by purely content-addressed systems.",
            ),
    
            pinformative(
                "Data replication is more efficient and significantly more simple than for Willow: for each log, peers simply exchange the number of entries they have in that log, and whoever sent a greater number then transmits all entries the other peer is missing."
            ),

            pinformative(
                "A hash chain of data cryptographically authenticates that authors never ", sidenote("produce", [
                    "Or, more precisely, it ensures that such misbehavior can be detected efficiently and arbitrarily long after the fact."
                ]), " differing extensions of the same log. In itself, this can be a ", link("laudable feature", "https://en.wikipedia.org/wiki/Certificate_Transparency"), ", but it precludes the option of concurrent writes from multiple devices. With ", r("d3rbsr"), ", Willow can achieve efficient data synchronisation without the need to restrict updates to a linear sequence. We do not need to enforce linearity to keep sync complexity manageable, so we opt for effortless multi-writer support instead.",
            ),
    
            pinformative(
                "The need to verify the hash chain also makes it difficult to edit or delete (meta-) data. This can be a boon for some use-cases, but also quite dangerous when employed carelessly. Furthermore, data storage may be ", sidenote("cheap", ["As of writing, that is."]), ", but designing systems for unbounded growth tends to backfire sooner or later. Willow deliberately avoids any cryptographic proofs of completeness, allowing for traceless data removal when the need arises."
            ),
        ]),
    
        hsection("compare_tangles", "Tangle Sync", [
            pinformative(
                "Several projects have evolved the append-only log to an append-only ", link("DAG", "https://en.wikipedia.org/wiki/Directed_acyclic_graph"), ", termed a ", link("tangle", "https://github.com/cn-uofbasel/ssbdrv/blob/master/doc/tangle.md"), ". Projects in the wild exploring this concept include ", link("p2panda", "https://p2panda.org/"), ", and a scuttlebutt-adjacent project codenamed ", sidenote(link("ppppp", "https://github.com/staltz/ppppp-sync"), [
                    "As of writing, the best sources for information on ppppp on the web seem to be the ", link("manyverse newsletters", "https://www.manyver.se/blog/2023-04-05"), ", beginning in April 2023."
                ]), ". There is also some independent ", sidenote("academic", [
                    link(`Scherb, Christopher, Dennis Grewe, and Christian Tschudin. "Tangle centric networking." Proceedings of the 8th ACM Conference on Information-Centric Networking. 2021.`, "https://www.researchgate.net/profile/Christopher-Scherb/publication/353385703_Tangle_Centric_Networking/links/6118e7920c2bfa282a46e1c0/Tangle-Centric-Networking.pdf"),
                ]), " ", sidenote("interest", [
                    link("https://arxiv.org/pdf/2306.13941.pdf", "https://arxiv.org/pdf/2306.13941.pdf"),
                ]), " in the concept.",
            ),

            pinformative(
                "If the maximum number of concurrent writes to a tangle is not bounded, then tangle sync can be no more efficient than the set reconciliation algorithms we suggest for Willow. With their cryptographically authenticated happened-before relation, tangles inherit the content-addressing and immutability of logs, whereas Willow embraces semantic naming and mutability. None is inherently superior, different projects have different needs across this spectrum.",
            ),
    
            pinformative(
                "Finally, it bears saying that ", link("p2panda", "https://p2panda.org/"), " is pretty cool 🐼."
            ),
        ]),
    
        hsection("compare_nostr", "Nostr", [
            pinformative(
                link("Nostr", "https://nostr.com/"), " appears to be quite similar to Willow at a cursory glance. Willow peers store and exchange sets of ", rs("Entry"), ", Nostr peers store and exchange sets of ", em("events"), ". Every ", r("Entry"), " has a ", r("entry_timestamp"), ", every event has a ", code("created_at"), " time. Every ", r("Entry"), " belongs to a single ", r("subspace"), ", every event belongs to a single ", code("pubkey"), ". Willow organises ", rs("Entry"), " by their ", rs("entry_path"), ", Nostr organises events by their ", code("tags"), "."
            ),
    
            pinformative(
                "While ", rs("subspace"), " are more of a straightforward generalisation of public keys rather than a conceptual difference, the difference between paths and tags is significant. Paths allow ", rs("Entry"), " to overwrite each other, whereas tags do not. Nostr has no comparable concepts for mutability and deletion. This difference is a symptom of a significant conceptual difference between the protocols: Willow provides naming for data, Nostr does not. In Nostr, events are content-addressed — despite the superficial similarities, Nostr is ultimately closer to Scuttlebutt than to Willow.",
            ),

            pinformative(
                "Willow has more generalist ambitions than Nostr, we focus on providing a general-purpose syncing primitive with precisely specified semantics and properties such as ", link("eventual consistency", "https://en.wikipedia.org/wiki/Eventual_consistency"), ". Nostr takes a much more laissez-faire approach, making it significantly easier to implement, but arguably also more difficult to ", em("solidly"), " build upon.",
            ),

            pinformative(
                "Furthermore, the Willow design takes great care to ensure that all necessary operations on Willow data are efficiently supported by appropriate data structures, whereas Nostr appears more happy to quickly get things working on smaller scales. To give an example, various ", r("Path"), " handling tasks can be tackled via ", link("radix trees", "https://en.wikipedia.org/wiki/Radix_tree"), ", whereas the exponential state space of arbitrary combinations of tags is much harder to tame. Similarly, Nostr was not designed with an efficient set reconciliation protocol in mind", marginale(["Although there is ", link("work", "https://github.com/hoytech/negentropy"), " to integrate a proper set reconciliation protocol."]), ", despite ultimately being a protocol for exchanging sets of events.",
            ),
        ]),
    
        hsection("compare_es", "Earthstar", [
            pinformative(
                "If ", link("Earthstar", "https://earthstar-project.org/"), " feels very similar to Willow, then that is no coincidence. Willow started out as a reimagining of Earthstar, future Earthstar versions will build upon Willow, and the ", r("gwil", "core maintainer"), " of Earthstar is one of the two Willow authors."
            ),
        ]),
    
        hsection("compare_general", "General Conclusions", [
            pinformative(
                "There exist many other projects in this design space, we cannot list them all. These are the ones that have informed the design of Willow or that came up as points of reference the most often.",
            ),
    
            pinformative(
                "Among all these projects, we consider Willow to have the strongest story for mutability, as Willow is the only one to completely eschew content-addressing on the protocol level. Further improving the deletion story is ", r("prefix_pruning"), ", which is a feature we have not seen in any other protocol we are aware of.",
            ),
    
            pinformative(
                "Another group of features that we consistently miss in other protocols are those around capabilities. Willow’s use of write capabilities rather than public keys allows for flexible delegation. Few if any protocols devote the attention to controlling data propagation through read capabilities, and even fewer extend this care to metadata privacy by incorporating private intersection techniques.",
            ),
    
            pinformative(
                "The story for end-to-end encryption is considerably more difficult for Willow than for content-addressed systems where you can simply use hashes of data that happens to be encrypted. ", rs("Path"), " allow for comparatively rich semantics for data organisation and partial syncing, even when end-to-end encrypted. This combination of strucure and end-to-end encryption is one we did not find in preexisting protocols.",
            ),
    
            pinformative(
                "Ultimately, Willow takes on more complexity than many other protocols, but it also gives greater expressivity to its users. Organising ", rs("Entry"), " by ", rs("SubspaceId"), ", user-defined ", rs("Path"), ", and ", rs("Timestamp"), " is a choice motivated by maximising expressivity while still allowing for efficient (partial) sync, end-to-end encryption, and principled implementation techniques. All in all, we think it is pretty neat!",
            ),
        ]),
    ],
);
