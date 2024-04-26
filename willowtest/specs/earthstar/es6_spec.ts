import { Expression } from "macro";
import { link, path, pinformative, quotes, site_template } from "../../main.ts";
import { code, em, hr } from "../../../h.ts";
import { hsection, table_of_contents } from "../../../hsection.ts";
import { r, rs } from "../../../defref.ts";
import { marginale, sidenote } from "../../../marginalia.ts";
import { link_name } from "../../../linkname.ts";

export const es6_spec: Expression = site_template(
		{
				title: "Earthstar 6 Specification",
				name: "es6_spec",
		},
		[
				table_of_contents(7),

				pinformative(
					"This page specifies version 6 of the ", link("Earthstar protocol", "https://earthstar-project.org/"), ". The protocol behind Earthstar is simply an instantiation of Willow: the Earthstar data model is a particular instantiation of the ", link_name("data_model", "Willow data model"), ", using an instantiation of ", link_name("meadowcap", "Meadowcap"), " for access control, and synchronising data with the ", link_name("sync", "WGPS"), "."
				),
				pinformative(
					"This document assumes familiarity with Willow and specifies Earthstar by giving instantiations of all of Willow's protocol parameters."
				),

				hsection("es6_datamodel", "Data Model", [
					pinformative(
						"The Earthstar 6 data model is ", link_name("data_model", "that of Willow"), ", with the following choices of protocol parameters."
					),

					pinformative(
						"The type ", r("NamespaceId"), " is TODO."
					),

					pinformative(
						"The type ", r("SubspaceId"), " is TODO."
					),

					pinformative(
						"The ", r("max_component_length"), " is TODO, the ", r("max_component_count"), " is TODO, and the ", r("max_path_length"), " is TODO."
					),

					pinformative(
						"The type ", r("PayloadDigest"), " is the type of unsigned 256-bit integers, the total order we use is the numeric one."
					),

					pinformative(
						"The ", r("hash_payload"), " function is ", link("BLAKE3", "https://github.com/BLAKE3-team/BLAKE3"), ", with a digest length of 256 bits."
					),

					pinformative(
						"The type ", r("AuthorisationToken"), " and the ", r("is_authorised_write"), " function are ", link_name("mc_writing_entries", "determined by Meadowcap"), ", whose instantiation we describe in the ", link_name("es6_meadowcap", "next section"), "."
					),
				]),

				hsection("es6_meadowcap", "Meadowcap", [

				]),
		],
);
