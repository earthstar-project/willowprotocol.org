import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Img, Li, P, Ul } from "macromania-html";
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

export const sideloading = (
  <Dir name="sideloading">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Willow Sideloading Protocol"
        headingId="sideloading"
        heading={"Willow Sideloading Protocol"}
        toc
        status="proposal"
      >
        <P>
          <Alj inline>TODO</Alj>
        </P>

        {
          /* pinformative("The ", r('WGPS'), " presents a way for two peers with an established connection to efficiently exchange data. But running the necessary infrastructure to establish such connections (e.g. a ", link("STUN server", "https://en.wikipedia.org/wiki/STUN"), ", ",  link("distributed hash table", "https://en.wikipedia.org/wiki/Distributed_hash_table"), ", or relay servers) is a non-trivial task, limiting who can operate them."),
		pinformative("The ", def("sideloading_protocol", "Willow Sideloading Protocol"), " presents a way for peers to transmit data to each other asynchronously and via completely user-improvised channels."),
		pinformative("Instead of statefully coordinating which data to exchange, the Sideloading Protocol uses ", def({
			id: 'drop',
			singular: 'drop',
			plural: 'drops',
		}, 'drops'), ", arbitrary sets of <Rs n="Entry"/> and <Rs n="Payload"/> compiled into a single bytestring. A ", r('drop'), " can then be treated as a kind of static ", r("store"), " which can be ", r("store_join", "joined"), " with any other ", r("store"), " as per the ", link_name("data_model", "Willow Data Model.")),
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
		pinformative(rs("drop", "Drops"), " will often undoubtedly contain stale data that users are already aware of or no longer need. But what the ", r("sideloading_protocol", "sideloading protocol"), " gives up in efficiency it more than makes up for in simplicity and flexibility. It is simple to implement, and works with the infrastructure users already have."),
		pinformative("Finally, given that this protocol cannot interactively authorise users (e.g. via ", link_name("private_area_intersection", "private area intersection"), "), drops are always fully encrypted."),

		hsection("sideload_parameters", "Parameters", [
			preview_scope(
				pinformative("In order to use the sideloading protocol, one must first specify a full suite of instantiations of the ", link_name("willow_parameters", "parameters of the core Willow data model"), ". In addition to this, the sideloading protocol requires the following:"),
				lis(
					["A ", link("total order", "https://en.wikipedia.org/wiki/Total_order"), " on <R n="SubspaceId"/> with least element ", r("sync_default_subspace_id"), ", in which for every <R n="SubspaceId"/> <R n="subspace"/> there exists a successor ", r("subspace_successor_t"), " such that ", r("subspace_successor_s"), " is less than ", r("subspace_successor_t"), " and no other <R n="SubspaceId"/> is greater than ", r("subspace_successor_s"), " and less than ", r("subspace_successor_t"), "."],
					["An ", r("encoding_function"), " for ", r("NamespaceId")],
					["An ", r("encoding_function"), " for ", r("SubspaceId")],
					["An ", r("encoding_function"), " for ", r("PayloadDigest")],
					["An ", r("encoding_function"), " ", def_fn({id: "sideload_encode_token", singular: "encode_authorisation_token"}), " for ", r("AuthorisationToken")],
					["A <R n="NamespaceId"/> ", def_value({id:"side_default_namespace_id", singular: "default_namespace_id" })],
					["A <R n="SubspaceId"/> ", def_value({id:"side_default_subspace_id", singular: "default_subspace_id" })],
					["A ", r("PayloadDigest"), " ", def_value({id:"side_default_payload_digest", singular: "default_payload_digest" })],
					["And a function which encrypts the final compiled encoding, ", def_parameter_fn({id: "encrypt"}), "."]
				),
			),
		]),

		hsection("sideload_protocol", "Protocol", [
			pinformative("Let ", def_value({id: "side_entries", singular: 'entries'}), " be an arbitrarily selected set of ", rs("PossiblyAuthorisedEntry"), " from a <R n="namespace"/> ", def_value({id: "namespace_n", singular: 'namespace'}), ", transformed into a sequence by ordering according to the following criteria:"),
			pinformative(
				marginale(["This ordering takes maximum advantage of our relative encodings."]),
				"A ", r("PossiblyAuthorisedEntry"), " ", def_value({id: "side_ord_p1", singular: "p1"}), " is prior to an ", r("PossiblyAuthorisedEntry"), " ", def_value({id: "side_ord_p2", singular: "p2"}), " if ", lis(
					[
						marginale(['using the ', link("total order", "https://en.wikipedia.org/wiki/Total_order"), " on ", r("SubspaceId")]),
						code(r("side_ord_p1"), ".", field_access("0", "entry_subspace_id"), " < ", r("side_ord_p2"), ".", field_access("0", "entry_subspace_id")), ", or",
					],
					[
						marginale(["using ", link("lexicographic", "https://en.wikipedia.org/wiki/Lexicographic_order"), " ordering"]),
						code(r("side_ord_p1"), ".", field_access("0", "entry_path"), " < ", r("side_ord_p2"), ".", field_access("0", "entry_path")), ", or",
					],
					[
						"the ", r("entry_newer", "newer relation"), " on entries."
					]
				)),
				pinformative([
					"Let ", def_value("initial_entry"), " be the result of ", code(function_call(r("default_entry"), r("side_default_namespace_id"), r("side_default_subspace_id"), r("side_default_payload_digest")), ".")
				]),
				pinformative("Let ", def_value({id: "side_contents", singular: "contents"}), " be the concatenation of", lis(
					["The size of ", r("side_entries"), ", encoded as an unsigned, big-endian 64-bit integer, followed by"],
					[	"Each ", r("PossiblyAuthorisedEntry"), " of ",  r("side_entries"), " mapped to the concatenation of ", code("(", def_value({id: "side_encoded_entry", singular: "encoded_entry"}), ", ", def_value({id: "side_encoded_token", singular: "encoded_token"}), ", ", def_value({id: "side_payload", singular: "payload"}), ")"), " where ", def_value({id: "side_pauthorised", singular: "possibly_authorised_entry"}), " is the ", r("PossiblyAuthorisedEntry"), " being mapped, and", lis(
						[
							marginale(["And if ", code(r("side_pauthorised"), ".0"), " is the first entry, ", r("side_prior_entry"), " is ", r("initial_entry"), '.']),
							r("side_encoded_entry"), " is the result of ", code(function_call(r("encode_entry_relative_entry"), [r("side_pauthorised"), ".0"], r('side_prior_entry'), )), " where ", def_value({id: 'side_prior_entry', singular: "prior_entry"}), " is the <R n="Entry"/> prior to ", r("side_pauthorised"), " in ", r("side_entries"), ",",
						],
						[ " where ", r("side_encoded_token"), " is the result of ", code(function_call(r("sideload_encode_token"), [r("side_pauthorised"), ".1"])), ", and"],
						[
							marginale(["Partial payloads are not permitted as they cannot be verified by the ", link_name("data_model", "Willow Data Model"), "."]),
							 r("side_payload"), " is the complete <R n="Payload"/> of ", r("side_pauthorised"), "." ]
					)],
				),
				pinformative("Finally, let ", def_value({id: "side_drop", singular: "drop"}), " be the result of", code(function_call(r("encrypt"), r("side_contents"))), ".")),
				hsection("sideload_transport", "Transport", [
					"Once created, ", r("side_drop"), " can be transported by whatever means a single bytestring can be transferred, to be decrypted and the recovered ", r("side_contents"), " ingested by its intended recipient."
				]),

				pinformative(

				img(asset("sideload/sideload_emblem.png"), `A Sideloading emblem: A stylised drawing of tufty grass growing in between the cracks of paving stones, next to a graffiti-styled rendition of the word "Sideload".`)),
	 */
        }
      </PageTemplate>
    </File>
  </Dir>
);
