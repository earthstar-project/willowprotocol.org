import { Expression } from "macro";
import { pinformative, site_template, lis, link, def_parameter_fn, def_value } from "../main.ts";
import { def, preview_scope, r, rs } from "../../defref.ts";
import { link_name } from "../../linkname.ts";
import { code, em } from "../../h.ts";
import { hsection } from "../../hsection.ts";
import { marginale } from "../../marginalia.ts";
import { field_access, function_call } from "../../pseudocode.ts";

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
		preview_scope(
			pinformative(rs("drop", "Drops"), " are then shared via the informal ad-hoc infrastructure we refer to as the ", def("sidenet", "Sidenet"), ":", marginale([
				"In contrast with ", link("sneakernets", "https://en.wikipedia.org/wiki/Sneakernet"), " which only use physically transported storage devices, the ", r('sidenet'), " also includes the internet and other established networks."
			])),
			lis(
				"USB keys",
				"SD cards",
				"CDs",
				"Email attachments",
				"Instant messages",
				"Torrents",
				["Or ", em("whatever means users have at hand"), "."]
			)
		),
		pinformative(rs("drop", "Drops"), " will often undoubtedly contain stale data that users are already aware of or no longer need. But what the ", r("sideloading_protocol", "sideloading protocol"), " gives up in efficiency it more than makes up for in simplicity and flexibility. It is simple to implement and permits users to exchange data using the infrastructure they already have."),
		pinformative("Finally, given that this protocol cannot interactively authorise users (e.g. via ", link_name("private_area_intersection", "private area intersection"), "), drops are always fully encrypted."),
		
		hsection("sideload_parameters", "Parameters", [
			pinformative("In order to use the sideloading protocol, one must first specify a full suite of instantiations of the ", link_name("willow_parameters", "parameters of the core Willow data model"), ". In addition to this, the sideloading protocol requires the following:"),
			lis(
				["A ", link("total order", "https://en.wikipedia.org/wiki/Total_order"), " on ", r("SubspaceId"), " with least element ", r("sync_default_subspace_id"), ", in which for every ", r("SubspaceId"), " ", r("subspace"), " there exists a successor ", r("subspace_successor_t"), " such that ", r("subspace_successor_s"), " is less than ", r("subspace_successor_t"), " and no other ", r("SubspaceId"), " is greater than ", r("subspace_successor_s"), " and less than ", r("subspace_successor_t"), "."],
				["An ", r("encoding_function"), " for ", r("NamespaceId")],
				["An ", r("encoding_function"), " for ", r("SubspaceId")],
				["An ", r("encoding_function"), " for ", r("PayloadDigest")],
				["An ", r("encoding_function"), " for ", r("AuthorisationToken")],
				["A ", r("NamespaceId"), " ", def_value({id:"side_default_namespace_id", singular: "default_namespace_id" })],
				["A ", r("SubspaceId"), " ", def_value({id:"side_default_subspace_id", singular: "default_subspace_id" })],
				["A ", r("PayloadDigest"), " ", def_value({id:"side_default_payload_digest", singular: "default_payload_digest" })],
				["And a function which encrypts the final compiled encoding, ", def_parameter_fn({id: "encrypt"}), "."]
			)
		]),
		
		hsection("sideload_protocol", "Protocol", [
			pinformative("Let ", def_value({id: "side_entries", singular: 'entries'}), " be an arbitrarily selected set of ", r("PossiblyAuthorisedEntry"), " from the ", r("namespace"), " ", def_value({id: "namespace_n", singular: 'namespace'}), " in a specific order."),
			pinformative(
				marginale(["This ordering is used to take maximum advantage of the relative encodings used."]),
				"An ", r("PossiblyAuthorisedEntry"), "'s entry ", def_value({id: "side_ord_e1", singular: "e1"}), " is prior to an ", r("PossiblyAuthorisedEntry"), "'s entry ", def_value({id: "side_ord_e2", singular: "e2"}), " if ", lis(
					[
						code(field_access(r("side_ord_e2"), "entry_subspace_id"), " < ", field_access(r("side_ord_e1"), "entry_subspace_id")), ", or",
					],
					[
						code(field_access(r("side_ord_e2"), "entry_path"), " < ", field_access(r("side_ord_e1"), "entry_path")), ", or",
					],
					[
						code(field_access(r("side_ord_e2"), "entry_timestamp"), " < ", field_access(r("side_ord_e1"), "entry_timestamp")), "."
					],
				)),
				pinformative([
					"Let ", def_value("initial_entry"), " be the result of ", code(function_call(r("default_entry"), r("side_default_namespace_id"), r("side_default_subspace_id"), r("side_default_payload_digest")), ".")
				]),
				pinformative("Let ", def_value({id: "side_contents", singular: "contents"}), " be the concatenation of", lis(
					["An unsigned 64 bit integer of the length of ", r("side_entries"), " followed by",],
					[	"Each ", r("PossiblyAuthorisedEntry"), " of ",  r("side_entries"), " mapped to triples of ", code("[", def_value({id: "side_encoded_entry", singular: "encoded_entry"}), ", ", def_value({id: "side_encoded_token", singular: "encoded_token"}), ", ", def_value({id: "side_payload", singular: "payload"}), "]"), " where ", def_value({id: "side_entry", singular: "entry"}), " and ", def_value({id: "side_token", singular: 'token'}), " are the respective elements of ", r("AuthorisationToken"), ", and", lis(
						[
							r("side_encoded_entry"), " is the result of ", code(function_call(r("encode_entry_relative_entry"), r("side_entry"), r('side_prior_entry'), )), " where ", marginale(["And if ", r("side_entry"), " is the first entry, ", r("side_prior_entry"), " is ", r("initial_entry"), '.']), def_value({id: 'side_prior_entry', singular: "prior_entry"}), " is the ", r("Entry"), " prior to this one in ", r("side_entries"), ".",
						],
						[ " where ", r("side_encoded_token"), " is the result of encoding ", r("side_token") ],
						["and ", r("side_payload"), " is the complete ", r("Payload"), " of ", r("side_entry"), "." ] 
					)],
				), 
				pinformative("Finally, let ", def_value({id: "side_drop", singular: "drop"}), " be the result of", code(function_call(r("encrypt"), r("side_contents"))), ".")),
				hsection("sideload_transport", "Transport", [
					"Once created, ", r("side_drop"), " can be transported by whatever means a single bytestring can be transferred, to be decrypted and ", r("side_contents"), " ingested by its intended recipient."  
				])
		])
	],
	
)