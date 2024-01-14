import { Expression } from "macro";
import { link, path, pinformative, quotes, site_template } from "../../main.ts";
import { code, em } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { r, rs } from "../../../defref.ts";
import { marginale, sidenote } from "../../../marginalia.ts";

export const why_willow: Expression = site_template(
		{
				title: "Why did we make Willow?",
				name: "why_willow",
		},
		[
				pinformative("With so many existing protocols for data networks out there, why would we make Willow?"),
				pinformative("We believe we’ve found a novel combination of techniques which allows Willow to satisfy many vital — and competing — criteria all at once."),
				pinformative("We made Willow to make running a network ", em("together"), " a sustainable practice. A protocol which enables a plurality of small, private networks alongside big, public ones. A protocol where the burden of running infrastructure is divided among its users, with no need for volunteer server admins."),
				pinformative("We made Willow to be a credible solution to digital networking in an uncertain era. It must be resilient in the times we’re ", em("forced"), " to scale down, whether that’s due to a temporary loss of signal, natural disaster, or war. It must be respectful of the resources we’re left with, and able to run on low-spec hardware and on low-bandwidth networks."),
				pinformative("We made Willow to be private, so that it’s possible to find people with common interests without broadcasting those interests to the world, and so that it’s possible to let others distribute data on your behalf without letting them know what that data ", em("is"), "."),
				pinformative("We made Willow to reconcile peer-to-peer networks with social realities. Wrangling the complexity of distributed systems shouldn’t mean we trade away basic features like deletion, or accept data structures which can only grow without limit."),
				pinformative("We made Willow to do something to the best of our ability, and in the light of the kind of world we’d like to see."),

				hsection("willow_compared", "Comparison To Other Protocols", [
					pinformative("How does Willow compare conceptually and technically to other distributed systems and protocol? Here we give an overview regarding some popular projects."),

					hsection("compare_ipfs", "IPFS, Veilid, Content-Addressed Storage", [
						pinformative(
							link("IPFS", "https://ipfs.tech/"), ", ", link("Veilid", "https://veilid.com/"), ", and similar systems are fundamentally about providing and retrieving ", em("content-addressed data"), ". You give the system a hash, and it answers with the original data. Ingesting data into the system requires no information but the data itself. Willow, on the other hand, employs explicit ", em("naming"), " of data. Rather than ", em("ingesting"), " data into a system, you ", em("bind"), " data to a freely chosen name. Retrieving data consists of supplying a name and receiving the value that was most recently bound to that name.",
						),

						pinformative(
							"Pure content-addressing faces a bootstrapping problem: in order to actively distribute data to others, I must first inform them about the hash of that data. Doing so via the system itself requires me to send the hash of the hash first, and so on. For every new piece of data, I must eventually leave the system and transmit a new hash out-of-band. Willow functions differently: after agreeing on an initial name, I can continuously bind new data to the name, which automatically reaches those interested.",
						),

						pinformative(
							"Furthermore, Willow's names are meaningful and hierarchical. Hashing individual moves of an unfolding chess match yields completely unrelated hashes. In Willow, I can assign related names (", rs("Path"), ") to the moves: ", path("chess", "me_vs_gwil", "move1"), ", ", path("chess", "me_vs_gwil", "move2"), ", et cetera. The synchronization API makes use of the hierarchy; I can requests all moves in this game (names starting with ", path("chess", "me_vs_gwil"), "), or all chess games in total (names starting with ", path("chess"), ").",
						),

						pinformative(
							"This example showcases another difference: names are chosen ", em("by"), " someone in a specific ", em("context"), ". My names need not make sense to Alex in Kentucky", marginale("Sorry, Alex!"), ". Willow does not aim for a globally meaningful data pool, but for organizing data in a way that is meaningful to certain groups of people. Hashes, in contrast, are universal. In IPFS you query ", quotes("the system"), " for data, in willow you query peers with whom you share some context.",
						),

						pinformative(
							"Content-addressed data excels at immutability, statelessness, and global connectivity. Willow embraces mutability and statefulness, locality and structure. Just like functional and imperative programming, there is a place for both. As the landscape of modern peer-to-peer applications matures, we expect content-addressed systems and willow to complement each other. Lauding either as universally superior misses the point.",
						),
					]),

					hsection("compare_logs", "Scuttlebutt, Hypercore, Append-Only Logs", [
						pinformative(
							link("Secure Scuttlebutt", "https://scuttlebutt.nz/"), ", ", link("Hypercore", "https://hypercore-protocol.org"), ", and similar systems arrange data into linked hash chains, and identify these lists (", quotes("logs"), ") via the public keys of a digital signature scheme", marginale("In principle, you can also design a log-based system to use capabilities instead of public keys. As of writing, there exists no popular such system, however."), ". Subscribing to a log amounts to requesting data without knowing the hash of that data, even particularly data that might not yet exist at the time of subscription. This elegantly solves the bootstrapping problem faced by purely content-addressed systems.",
						),

						pinformative(
							"Data replication is more efficient and significantly more simple than for Willow: for each log, peers simply exchange the number of entries they have in that log, and whoever sent a greater number then transmits all entries the other peer is missing."
						),

						pinformative(
							"Log-based systems can address an individual datum either by a combination of the log identifier and a sequence number, or content-addressed by hash. As data never gets removed from a log, content-addressing retains advantages such as immunity to link rot and self-verifiability. Referencing data by a log identifier and a sequence number is closer to the explicit naming of Willow: knowing a name does not yield any information about the data it is bound to. Compared to Willow, this naming scheme is restrictive and non-semantic, however.",
						),

						pinformative(
							"The hash chain of data securely authenticates the ", link("happened-before relation", "https://en.wikipedia.org/wiki/Happened-before"), " of entries from the same log, which allows for ", link("certain use-cases", "https://dl.acm.org/doi/pdf/10.1145/3565383.3566113"), " that Willow canot support. Enforcing a total order on all entries in the same log also leads to the greatest weakness of these systems, however: any two concurrent writes to the same log — say, from different devices — invalidate the log. Hence, log-based systems are inherently restricted to single-writer systems. Emulating multi-writer systems inside a log-based system by grouping and bundling entries from several logs incurs a significant conceptual overhead, one that Willow can sidestep completely.",
						),

						pinformative(
							"The need to verify the hash chain also makes it difficult to edit or delete (meta-) data. This makes for good archival systems, but can also pose risks to users. Furthermore, data storage may be cheap (as of writing, at least), but designing systems for unbounded growth tends to backfire sooner or later."
						),

						pinformative(
							"We believe that systems which do not need an authenticated happened-before relation benefit from Willow’s support for concurrent writes, overwriting of data, and more expressive naming scheme. Archival qualities and content-addressing can be brought into a name-based system such as Willow by referencing a dedicated content-addressed store. The benefits from the log-powered hybrid approach between content-addressed storage and naming scheme feel insufficient to us."
						),
					]),

					hsection("compare_tangles", "Tangle Sync", [
						pinformative(
							"Several projects have evolved the append-only log to an append-only ", link("DAG", "https://en.wikipedia.org/wiki/Directed_acyclic_graph"), ", termed a ", link("tangle", "https://github.com/cn-uofbasel/ssbdrv/blob/master/doc/tangle.md"), ". Projects in the wild exploring this concept include ", link("p2panda", "https://p2panda.org/"), ", and a scuttlebutt-adjacent project codenamed ", sidenote(link("ppppp", "https://github.com/staltz/ppppp-sync"), [
								"As of writing, the best sources for information on ppppp on the web seem to be the ", link("manyverse newsletters", "https://www.manyver.se/blog/2023-04-05"), " starting in April 2023."
							]), ". There is also some independent ", sidenote("academic", [
								link(`Scherb, Christopher, Dennis Grewe, and Christian Tschudin. "Tangle centric networking." Proceedings of the 8th ACM Conference on Information-Centric Networking. 2021.`, "https://www.researchgate.net/profile/Christopher-Scherb/publication/353385703_Tangle_Centric_Networking/links/6118e7920c2bfa282a46e1c0/Tangle-Centric-Networking.pdf"),
							]), " ", sidenote("interest", [
								link("https://arxiv.org/pdf/2306.13941.pdf", "https://arxiv.org/pdf/2306.13941.pdf"),
							]), " in the concept.",
						),

						pinformative(
							"If the number of concurrent entries in a tangle is explicitly bounded, tangle syc can leverage log-style replication. Replication algorithms that take into account the partial order of the tangle do degrade, however, when there can be a large number of concurrent entries. In these cases, tangle sync can do no better than the range-based set reconciliation algorithm suggested for Willow. Blindly syncing based on backlinks in face of a wide tangle is less efficient than a proper set reconciliation protocol. We consider range-based set reconciliation to be sufficiently efficient to justify using it even in settings with bounded concurrency.",
						),

						pinformative(
							"While logs come with a natural naming scheme for entries of log identifier and sequence number, tangles lose this dimension. The set of all entries in a tangle remains meaningful, but giving a specific name of a future entry is not possible anymore. Willow supports multi-writer while retaining the ability to name data before it even exists."
						),

						pinformative(
							"When requiring a cryptographically verified but possibly non-total happened-before relation and immutability of all data, tangle sync projects are a better choice than Willow. Otherwise, we prefer the benefits around mutability and expressive naming that Willow provides."
						),
					]),

					hsection("compare_nostr", "Nostr", [
						pinformative(
							link("Nostr", "https://nostr.com/"), " appears superficially to be quite similar to Willow. Willow peers store and exchange sets of ", rs("Entry"), ", Nostr peers store and exchange ", em("events"), ". Every ", r("Entry"), " has a ", r("entry_timestamp"), ", every event has a ", code("created_at"), " time. Every ", r("Entry"), " belongs to a single ", r("subspace"), ", every event belongs to a single ", code("pubkey"), ". Willow organises ", rs("Entry"), " by their ", rs("entry_path"), ", Nostr organises events by their ", code("tags"), "."
						),

						pinformative(
							"While ", rs("subspace"), " are more of a straightforward generalization of public keys rather than a conceptual difference, the difference between paths and tags is significant. Paths allow ", rs("Entry"), " to overwrite each other, whereas tags do not. Nostr has no comparable concepts for mutability and deletion. This difference is only a symptom of a significant conceptual difference between the protocols: Willow provides naming for data, Nostr does not. In Nostr, events are content-addressed — despite the superficial similarities, Nostr is ultimately closer to Scuttlebutt than to Willow.",
						),
					]),

					hsection("compare_es", "Earthstar", [
						pinformative(
							link("Earthstar", "https://earthstar-project.org/"), " is the project with the greatest overlap to Willow. This is no coincidence: Willow evolved out of a redesign of Earthstar and was picked up by the core maintainer of Earthstar. Earthstar protocol version 6 will, in fact, build upon Willow."
						),
					]),

					hsection("compare_general", "General Conclusions", [
						pinformative(
							"There exist many other projects in this design space, but we cannot list them all. These are the ones that have informed the design of Willow or that came up as points of comparison the most often.",
						),

						pinformative(
							"Among all these projects, we consider Willow to have the strongest story for mutability, as Willow is the only one to completely eschew content-addressing on the protocol level. That would even be true without ", r("prefix_pruning"), ", which is a feature we have not seen in any other protocol we are aware of.",
						),

						pinformative(
							"Another group of features that we consistently miss in other protocols are those around capabilities. Willow’s use of write capabilities rather than public keys allows for flexible delegation. Few if any protocols devote the attention to controlling data propagation through read capabilities, and even fewer ensure extend this care to metadata privacy by incorporating private intersection techniques.",
						),

						pinformative(
							"The story for end-to-end encryption is considerably more difficult for Willow than for content-addressed systems where you can simply use hashes of data that happens to be encrypted. The combination of the fairly rich semantics that ", rs("Path"), " afford for data access and partial syncing with the ability to remain end-to-end encrypted is one we did not find in preexisting protocols.",
						),

						pinformative(
							"Ultimately, Willow takes on more complexity than many other protocols. "
						),

						// express tradeoff
					]),
				]),

				"TODO teapot!"
		],
);

// # How does Willow compare to...

// ## [Secure Scuttlebutt](https://scuttlebutt.nz/), [Hypercore]( https://hypercore-protocol.org), Append-Only Logs in General?

// Secure scuttlebutt, hypercore, and similar systems arrange data into linked hash chains, and identify these lists ("logs") via the public keys of a digital signature scheme. Subscribing to a log amounts to requesting data without knowing its hash, 



// - Archival/no editing
// - metadata deletion
// - cryptographically secured happened-before relation
// - single writer

// ## [Activity Pub](https://activitypub.rocks/) and the [Fediverse](https://fediverse.party/)?

// ## [Nostr](https://nostr.com/)?


// ## [Earthstar](https://earthstar-project.org/)?

// <!-- ## [DNS](https://en.wikipedia.org/wiki/Domain_Name_System)?
// ## [Spritely Goblins](https://spritely.institute/goblins/)? -->