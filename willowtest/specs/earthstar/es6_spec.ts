import { Expression } from "macro";
import { link, path, pinformative, quotes, site_template } from "../../main.ts";
import { code, em, hr } from "../../../h.ts";
import { hsection, table_of_contents } from "../../../hsection.ts";
import { r, rs } from "../../../defref.ts";
import { marginale, sidenote } from "../../../marginalia.ts";
import { link_name } from "../../../linkname.ts";
import { def } from "../../../defref.ts";
import { def_parameter_value, def_value, lis, def_fn } from "../../main.ts";
import { function_call } from "../../../pseudocode.ts";

export const es6_spec: Expression = site_template(
		{
				title: "Earthstar Specification",
				name: "es6_spec",
		},
		[
			table_of_contents(7),

			pinformative(
				"This document specifies version 6 of the ", link("Earthstar protocol", "https://earthstar-project.org/"), ". The protocol behind Earthstar is simply an instantiation of ", link_name("willow", "Willow"), ": the Earthstar data model is a particular instantiation of the ", link_name("data_model", "Willow data model"), ", using an instantiation of ", link_name("meadowcap", "Meadowcap"), " for access control, and synchronising data with the ", link_name("sync", "WGPS"), "."
			),
			pinformative(
				"We assume familiarity with Willow and specifies Earthstar by giving instantiations of all of Willow's protocol parameters."
			),

			hsection("es6_preliminaries", "Preliminaries", [
				pinformative("Some up-front definitions before we can dive into the protocol parameters."),

				hsection("es6_cinn25519", "Cinn25519", [
					pinformative(
						"Earthstar uses a non-standard signature scheme that augments each public key with a human-readable string to aid in identifying keys. These schemes are parameterised by a minimum and maximum length of the string."
					),

					pinformative(
						"The ", def("cinn25519"), " ", r("signature_scheme"), " of a given ", def_parameter_value({id: "cinn_min", singular: "min_length"}), " and ", def_parameter_value({id: "cinn_max", singular: "max_length"}), " (both are natural numbers, with ", code(r("cinn_min"), " <= ", r("cinn_max")), ") — also written as ", r("cinn25519"), "<", r("cinn_min"), ", ", r("cinn_max"), "> — is a signature scheme based off ", link("ed25519", "https://ed25519.cr.yp.to/"), ".",
					),

					pinformative(
						"A ", r("dss_sk"), " of ", r("cinn25519"), "<", r("cinn_min"), ", ", r("cinn_max"), "> is a pair of an ed25519 secret key, called the ", def({id: "cinn_sksk", singular: "underlying secret key"}), ", and a sequence of at least ", r("cinn_min"), " and at most ", r("cinn_max"), " characters from the ASCII ranges ", code("0x30"), " to ", code("0x39"), " inclusive (", code("0123456789"), ") and ", code("0x61"), " to ", code("0x7a"), " inclusive (", code("abcdefghijklmnopqrstuvwxyz"), ") that does not start with a numeric character, called the ", def("cinn_shortname"), ". A ", r("correspond", "corresponding"), " ", r("dss_pk"), " is a pair of a ", r("correspond", "corresponding"), " ed25519 public key (called the ", def({id: "cinn_pk_pk", singular: "underlying public key"}), ") and the same ", r("cinn_shortname"), ".", 
					),

					pinformative(
						"The type of ", rs("dss_signature"), " is the same as for ed25519, but the signing algorithm differs: to ", r("dss_sign"), " a bytestring ", def_value({id: "cinn_b", singular: "b"}), ", compute the ed25519 signature over the concatenation of the following strings:", lis(
							["The ", r("cinn_shortname"), ", encoded as ascii,"],
							["If ", code(r("cinn_min"), " <= ", r("cinn_max")), " the byte ", code("0x00"), ", otherwise the empty string, and"],
							[r("cinn_b"), "."],
						), 
					),

					pinformative("Accordingly, you ", r("dss_verify"), " a signature by calling the ed25519 verification function for the same concatenation."),
				]),

				hsection("es6_ids", "Identifiers", [
					pinformative("Various concepts in Earthstar use ", r("cinn25519"), " as identifiers."),

					pinformative("An ", def({id: "es6_identity", singular: "identity identifier"}), " is a ", r("cinn25519"), "<4, 4> public key."),

					pinformative("A ", def({id: "es6_namespace", singular: "namespace identifier"}), " is a ", r("cinn25519"), "<1, 15> public key."),
				]),
			]),

			hsection("es6_datamodel", "Data Model", [
				pinformative(
					"The Earthstar data model is ", link_name("data_model", "that of Willow"), ", with the following choices of protocol parameters."
				),

				pinformative(
					"The type ", r("NamespaceId"), " is the type of ", rs("es6_namespace"), "."
				),

				pinformative(
					"The type ", r("SubspaceId"), " is the type of ", rs("es6_identity"), "."
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
				pinformative(
					"The ", r("namespace_signature_scheme"), " is ", r("cinn25519"), "<1, 15>."
				),

				pinformative(
					"The ", r("encode_namespace_pk"), " function maps a ", r("es6_namespace"), " to the concatenation of its ", r("cinn_shortname"), " (encoded as ascii), the byte ", code("0x00"), ", and the ", r("cinn_pk_pk"), "."
				),

				pinformative(
					"The ", r("encode_namespace_sig"), " function maps a ", r("namespace_signature_scheme"), " signature (which is just an ed25519 signature, which is just a sequence of bytes) to itself."
				),

				pinformative(
					"The ", r("user_signature_scheme"), " is ", r("cinn25519"), "<4, 4>."
				),

				pinformative(
					"The ", r("encode_user_pk"), " function maps an ", r("es6_identity"), " to the concatenation of its ", r("cinn_shortname"), " (encoded as ascii), and the ", r("cinn_pk_pk"), "."
				),

				pinformative(
					"The ", r("encode_user_sig"), " function maps a ", r("user_signature_scheme"), " signature (which is just an ed25519 signature, which is just a sequence of bytes) to itself."
				),

				pinformative(
					"The choices for the Meadowcap ", r("mc_max_component_length"), ", ", r("mc_max_component_count"), ", and ", r("mc_max_path_length"), " are the same as those for the data model ", r("max_component_length"), ", ", r("max_component_count"), ", and ", r("max_path_length"), "."
				),

				pinformative(
					"These choices of parameters make the Meadowcap instantiation ", r("mc_compatible"), " with the data model instantiation."
				),
			]),

			hsection("es6_wgps", "WGPS", [
				pinformative("Protocol parameters of the WGPS."),

				hsection("es6_wgps_access_control", "Access Control", [
					pinformative(
						"The type ", r("ReadCapability"), " is the type of ", rs("Capability"), " — as instantiated above — with an ", r("cap_mode"), " of ", r("access_read"), ". Consequently, the type ", r("sync_receiver"), " is ", r("es6_identity"), ", and the type ", r("sync_signature"), " is that of ", r("cinn25519"), "<4, 4> signatures."
					),
	
					pinformative("The ", r("challenge_length"), " is 16 (yielding 128 bit for each ", r("access_challenge"), ")."),
	
					pinformative("The ", r("challenge_hash_length"), " is 32 (yielding 256 bit digests), the ", r("challenge_hash"), " function is BLAKE3, with a digest length of 256 bits."),
				]),

				hsection("es6_wgps_pai", "Private Area Intersection", [
					pinformative(
						"The type ", r("PsiGroup"), " is the type of ed25519 public keys."
					),

					pinformative(
						"The type ", r("PsiScalar"), " is the type of ed25519 secret keys."
					),

					pinformative(
						"The ", r("psi_scalar_multiplication"), " function is scalar multiplication in the group used by ed25519 (", link("Curve25519", "https://en.wikipedia.org/wiki/Curve25519"), ")."
					),

					pinformative(
						"The ", r("hash_into_group"), " function encodes a ", r("fragment"), " using the ", r("encode_fragment"), " function that we define below, then computes the Blake3 digest of 256 bits for the encoding, and uses the resulting 256 bits as input to the ", link("ed25519 key generation algorithm", "https://datatracker.ietf.org/doc/html/rfc8032#section-5.1.5"), ")."
					),

					pinformative("We define the ", def_fn({id: "encode_fragment", singular: "encode_fragment"}), " function as follows:", lis(
						["Encode a ", r("fragment"), " ", code("(", def_value({id: "es6_fragment2_namespace", singular: "namespace"}), ", ", def_value({id: "es6_fragment2_prefix", singular: "pre"}), ")"), " as the concatenation of", lis(
							[function_call(r("encode_namespace_pk"), r("es6_fragment2_namespace")), " as defined in the parameterisation of Meadowcap, and"],
							[function_call(r("encode_path"), r("es6_fragment2_prefix")), "."],
						)],
						["Encode a ", r("fragment"), " ", code("(", def_value({id: "es6_fragment3_namespace", singular: "namespace"}), ", ", def_value({id: "es6_fragment3_subspace_id", singular: "subspace_id"}), ", ", def_value({id: "es6_fragment3_prefix", singular: "pre"}), ")"), " as the concatenation of", lis(
							[function_call(r("encode_namespace_pk"), r("es6_fragment3_namespace")), " as defined in the parameterisation of Meadowcap,"],
							[function_call(r("encode_user_pk"), r("es6_fragment3_subspace_id")), " as defined in the parameterisation of Meadowcap, and"],
							[function_call(r("encode_path"), r("es6_fragment3_prefix")), "."],
						)],
					)),

					pinformative(
						"The type ", r("SubspaceCapability"), " is the type of ", rs("McSubspaceCapability"), " for out instantiation of Meadowcap. So in particular, the type ", r("sync_subspace_receiver"), " is that of ", rs("es6_identity"), ", and the type ", r("sync_subspace_signature"), " is that of ", r("user_signature_scheme"), " signatures."
					),
				]),
				
			]),
		],
);
