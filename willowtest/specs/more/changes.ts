import { Expression } from "macro";
import { link, lis, pinformative, site_template, sky_blue } from "../../main.ts";
import { RssFeedItemMeta, create_rss_item } from "../../../rss.ts";
import { hsection } from "../../../hsection.ts";
import { link_name } from "../../../linkname.ts";
import { code, em } from "../../../h.ts";
import { r, rs } from "../../../defref.ts";

export function create_news_item(item: RssFeedItemMeta, description: Expression): Expression {
	return create_rss_item("Willow News and Updates", item, description);
  }
  
  export function create_changelog_item(item: RssFeedItemMeta, description: Expression): Expression {
	return create_rss_item("Willow Specification Changelog", item, description);
  }

export const changes: Expression = site_template({
	name: "changes",
	title: "News, improvements, and Necessary Changes"
}, [
	pinformative("Here, we maintain a changelog of breaking changes, and one of general site updates. You can subscribe to either via RSS."),

	
	
	hsection(
		'news_and_updates', 'News and Updates',
		[
			pinformative("Here we’ll share bits of news relevant to the Willow protocol, as well as improvements to the site. For example, the completion of an implementation, or the addition of new explanatory text and drawings to the site. Updates will be occasional and meaningful."),
			pinformative(link("RSS feed available here", "/rss_news.xml"), "."),
			lis(
				create_news_item(
					{
					name: 'april_25_crates', title: "Rust persistent data store released", pubDate: new Date(2025, 3, 9)		
					},
					[
						pinformative("We have released a new crate which implements a persistent Willow data ", r("store"), ". The source can be found at ", link("the willow-rs repository", "https://github.com/earthstar-project/willow-rs"), ", and complete documentation can be found at ", link("docs.rs", "https://docs.rs/willow-store-simple-sled/0.1.0/willow_store_simple_sled/"), "."),
						pinformative("In addition, we have also released a new crate with recommended parameters for the ", link_name("data_model", "Willow Data Model"), " and ", link_name("meadowcap", "Meadowcap"), ". We are referring to this set of recommend parameters as ", em("Willowʼ25"), " and will have more information available on this site soon. In the meantime, you can read documentation for the new crate over at ", link("docs.rs", "https://docs.rs/willow_25/0.1.0/willow_25/")),
						pinformative("Finally, we have published 0.2.0 versions for the ", link("willow-data-model", "https://docs.rs/willow-data-model/0.2.0/willow_data_model/"), " and ", link("meadowcap", "https://docs.rs/meadowcap/0.2.0/meadowcap/"), " crates with many new improvements, including a new ", link(code("Store"), "https://docs.rs/willow-data-model/0.2.0/willow_data_model/trait.Store.html"), " trait which can be used to implement Willow-compatible data storage.")
					]
				),
				create_news_item(
					{
						name: 'meadowcap_rs_0_1_0', title: "Rust implementation of Meadowcap released", pubDate: new Date(2024, 7, 10)
					},
					[ 
					pinformative("Our own ", em("Rust"), " implementation of ", link_name("meadowcap", "Meadowcap"), " now conforms to the specification as of August 10th, 2024. The source can be found at ", link("the willow-rs repository", "https://github.com/earthstar-project/willow-rs"), ", and complete documentation can be found at ", link("docs.rs", "https://docs.rs/meadowcap/0.1.0/meadowcap/"), ".")
					],
				),
				create_news_item(
					{
						name: "wgps_candidate",
						title: "Willow General Purpose Sync specification status promoted to ‘Candidate’",
						pubDate: new Date(2024, 5, 19)
					}, 
					[
						pinformative("With a working implementation of the ", link_name('sync', "Willow General Purpose Sync Protocol"), " in ", link("willow-js", "https://github.com/earthstar-project/willow-js"), " — and several other implementations now in progress — we feel comfortable in promoting the specification's status to ", sky_blue(r('status_candidate')), ".")
					]
				),
				create_news_item(
					{
						name: "willow_js_0_5_0", title: 'Sideloading in willow-js', pubDate: new Date(2024, 4, 29, 0)
					},
					[
						pinformative("Last week we published the ", link_name("sideloading", "Willow Sideloading protocol"), ", and this week we have a working implementation available via ", link("willow-js 0.5.0", "https://github.com/earthstar-project/willow-js"), "."),
						pinformative("For more information on this implementation, please see the documentation for ", link(code("createDrop"), "https://jsr.io/@earthstar/willow/doc/~/createDrop"), " and ", link(code("ingestDrop"), "https://jsr.io/@earthstar/willow/doc/~/ingestDrop"), ".")
					]
				),
				create_news_item(
					{
						name: 'sideload_spec', title: "Willow Sideloading Protocol", pubDate: new Date(2024, 4, 23, 0)
					},
					[
						pinformative(
							"A few months ago we published the ", link_name("sync", "Willow General Purpose Sync protocol"), ", a synchronisation specification for securely and efficiently synchronising data over a network connection. However, there are many contexts where establishing such a connection is difficult, undesirable, or outright impossible."
						),
						pinformative("The ", link_name("sideloading", "Willow Sideloading protocol"), " is a new protocol for securely delivering Willow data by whatever means possible. We build upon the tradition of sneakernets to introduce the concept of the ", r("sidenet"), ", the sporadically online and ad-hoc infrastructure users already have."),
						pinformative("This new protocol can be used in place of (or as a complement to) the ", link_name("sync", "WGPS"), ", is relatively simple to implement, and has a mercifully short specification.")
					]
				),
				create_news_item(
					{
						name: 'willowjs_0_2_1', title: "willow-js released", pubDate: new Date(2024, 4, 6, 0)
					}, 
					[
						pinformative(link("willow-js", "https://github.com/earthstar-project/willow-js"), ", our own TypeScript implementation of the ", link_name("data_model", "Willow Data Model"), " and the ", link_name("sync", "Willow General Purpose Sync protocol"), " now conforms to these specifications as of May 6th, 2024. This module can be used to create, query, and sync ", rs("Entry"), " and their corresponding ", rs("Payload")," in ", rs("store"), " in the browser and Deno runtime."), pinformative("The source, documentation, and usage instructions can be found at the ", link("willow-js repository", "https://github.com/earthstar-project/willow-js"), ".")
					]
				),
				create_news_item(
					{ name: "meadowcap_0_1_0", title: "meadowcap-js 0.2.0 released", pubDate: new Date(2024, 0, 23, 0)}, [
						pinformative("Our own TypeScript implementation of ", link_name("meadowcap", "Meadowcap"), " now conforms to the specification as of January 23rd, 2024. The source, documentation, and usage instructions can be found at the ", link("meadowcap-js repository", "https://github.com/earthstar-project/meadowcap-js"), ".")
					]
				),
				create_news_item(
					{ name: "news_launch", title: "Welcome to willowprotocol.org!", pubDate: new Date(2024, 0, 17, 0)},
					[pinformative("The site for the Willow protocol has been officially released to the public.")],
				),
			)
		]
	),
	
	hsection(
		'spec_changes', 'Necessary Changes',
		[
			pinformative("Although we consider Willow’s specifications stable, unforeseen outcomes may force us to make amendments. Rather than making this a source of exciting surprises for implementors, we prefer to list those (hopefully few) changes here. "),
			pinformative(link("RSS feed available here", "/rss_changelog.xml"), "."),
			lis(
				create_changelog_item(
					{ name: "prefingerprints_and_payload_transformations", title: "Sync Protocol Tweaks", pubDate: new Date(2024, 3, 26, 0)},
					[
						pinformative("We are progressing with implementing the Willow General Purpose Sync Protocol (WGPS), and have discovered some tweaks that make the protocol more powerful."),
	
						pinformative("First, we have generalised the parameters for fingerprint computation in range-based set reconciliation: the old type of ", code("Fingerprints"), " is now called ", code("PreFingerprint"), ". After computing a ", code("PreFingerprint"), " but before sending it to the other peer for comparison, it is transformed into an actual ", code("Fingerprint"), " with an arbitrary function. This allows using large fingerprints with nice algebraic properties for the computations, but compressing them with a conventional hash function before transmission."),
	
						pinformative("The second generalisation concerns payload transmission. Instead of transmitting payloads verbatim, peers may now transform the payloads into arbitrary other bytestrings, and exchange those instead. This opens up features such as streaming verification of partial payloads, or on-the-fly compression."),
					],
				),
				create_changelog_item(
					{ name: "changelog_launch", title: "Willow specification published", pubDate: new Date(2024, 0, 17, 0)},
					[pinformative("No changes yet!")],
				),
			)
		]
	),
])
