import { Expression } from "macro";
import { pinformative, site_template, lis, link } from "../main.ts";
import { def, r, rs } from "../../defref.ts";
import { link_name } from "../../linkname.ts";
import { em } from "../../h.ts";
import { hsection } from "../../hsection.ts";

export const sideloading: Expression = site_template(
	{
		title: "Willow Sideloading Protocol",
		name: "sideloading",
		status: 'proposal',
	},
	[
		pinformative("The ", r('WGPS'), " presents a way for two peers with an established connection to efficiently exchange data. But running the necessary infrastructure to establish such connections (e.g. a ", link("STUN server", "https://en.wikipedia.org/wiki/STUN"), ", ",  link("distributed hash table", "https://en.wikipedia.org/wiki/Distributed_hash_table"), ", or relay servers) is a non-trivial task, limiting who can operate them."),
		pinformative("The ", def("sideloading_protocol", "Willow Sideloading Protocol"), " presents a way for peers to transmit data to each other asynchronously and via completely user-improvised channels."),
		pinformative("Instead of statefully coordinating which data to exchange, the Sideloading Protocol uses ", def({
			id: 'drop',
			singular: 'drop',
			plural: 'drops',
		}, 'drops'), ", arbitrary sets of ", rs("Entry"), " and ", rs("Payload"), " compiled into on-disk archives. A ", r('drop'), " can then be treated as a kind of static ", r("store"), " which can be ", r("store_join", "joined"), " with any other ", r("store"), " as per the ", link_name("data_model", "Willow Data Model.")),
		pinformative(rs("drop", "Drops"), " are then shared via the informal ad-hoc infrastructure we refer to as the ", def("sidenet", "Sidenet"), ":"),
		lis(
			"USB keys",
			"SD cards",
			"CDs",
			"Email attachments",
			"Instant messages",
			"Torrents",
			["Or ", em("whatever means users have at hand"), "."]
		),
		pinformative("In contrast with ", link("sneakernets", "https://en.wikipedia.org/wiki/Sneakernet"), " which only use physically transported storage devices, the ", r('sidenet'), " also includes the internet and other established networks."),
		pinformative(rs("drop", "Drops"), " will often undoubtedly contain stale data that users are already aware of or no longer need. But what the ", r("sideloading_protocol", "sideloading protocol"), " gives up in efficiency it more than makes up for in simplicity and flexibility. It is simple to implement and permits users to exchange data using the infrastructure they already have."),
		pinformative("Finally, given that this protocol cannot interactively authorise users (e.g. via private area intersection), drops are always fully encrypted."),
		
		hsection("sideload_parameters", "Parameters", [
			
		]),
		
		hsection("sideload_protocol", "Protocol", [
			
		])
	],
	
)