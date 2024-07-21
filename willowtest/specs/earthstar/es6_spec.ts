import { Expression } from "macro";
import { link, path, pinformative, quotes, site_template } from "../../main.ts";
import { br, code, em, img, pre } from "../../../h.ts";
import { hsection, table_of_contents } from "../../../hsection.ts";
import { r, rs, R } from "../../../defref.ts";
import { marginale } from "../../../marginalia.ts";
import { link_name } from "../../../linkname.ts";
import { def } from "../../../defref.ts";
import { def_parameter_value, def_value, lis, def_fn } from "../../main.ts";
import { field_access, function_call } from "../../../pseudocode.ts";
import { encode_two_bit_int } from "../encodings.ts";
import { asset } from "../../../out.ts";

export const es6_spec: Expression = site_template(
		{
				title: "Earthstar Specification",
				name: "es6_spec",
				status: "proposal",
				status_date: "03.06.2024",
		},
		[
			table_of_contents(7),

			pinformative(
				"This document specifies version 6 of the ", link("Earthstar protocol", "https://earthstar-project.org/"), ". The protocol behind Earthstar is an instantiation of ", link_name("willow", "Willow"), ": the Earthstar data model is a particular instantiation of the ", link_name("data_model", "Willow data model"), ", using an instantiation of ", link_name("meadowcap", "Meadowcap"), " for access control, and synchronising data with the ", link_name("sync", "WGPS"), "."
			),

			pinformative(
				"We assume familiarity with Willow and specify Earthstar by giving instantiations of all of Willow's protocol parameters."
			),

			hsection("es6_preliminaries", "Preliminaries", [
				pinformative("Some up-front definitions before we can dive into the protocol parameters."),

				hsection("es6_cinn25519", "Cinn25519", [
					pinformative(
						"Earthstar uses non-standard signature schemes that augment each public key with a human-readable string to aid in identifying keys. These schemes are parameterised by a minimum and maximum length of the string."
					),

					pinformative(
						"The ", def("cinn25519"), " ", r("signature_scheme"), " of a given ", def_parameter_value({id: "cinn_min", singular: "min_length"}), " and ", def_parameter_value({id: "cinn_max", singular: "max_length"}), " (both are natural numbers, with ", code(r("cinn_min"), " <= ", r("cinn_max")), ") — also written as ", r("cinn25519"), "<", r("cinn_min"), ", ", r("cinn_max"), "> — is a signature scheme based off ", link("ed25519", "https://ed25519.cr.yp.to/"), ".",
					),

					pinformative(
						"A ", r("dss_sk"), " of ", r("cinn25519"), "<", r("cinn_min"), ", ", r("cinn_max"), "> is a pair of an ed25519 secret key, called the ", def({id: "cinn_sksk", singular: "underlying secret key"}), ", and a sequence of at least ", r("cinn_min"), " and at most ", r("cinn_max"), " characters from the ASCII ranges ", code("0x30"), " to ", code("0x39"), " inclusive (", code("0123456789"), ") and ", code("0x61"), " to ", code("0x7a"), " inclusive (", code("abcdefghijklmnopqrstuvwxyz"), ") that does not start with a numeric character, called the ", def({id: "cinn_shortname", singular: "shortname"}), ". A ", r("correspond", "corresponding"), " ", r("dss_pk"), " is a pair of a ", r("correspond", "corresponding"), " ed25519 public key (called the ", def({id: "cinn_pk_pk", singular: "underlying public key"}), ") and the same ", r("cinn_shortname"), ".", 
					),

					pinformative(
						"The type of ", rs("dss_signature"), " is the same as for ed25519, but the signing algorithm differs: to ", r("dss_sign"), " a bytestring ", def_value({id: "cinn_b", singular: "b"}), ", compute the ed25519 signature over the concatenation of the following strings:", lis(
							["The ", r("cinn_shortname"), ", encoded as ascii,"],
							["If ", code(r("cinn_min"), " < ", r("cinn_max")), " the byte ", code("0x00"), ", otherwise the empty string, and"],
							[r("cinn_b"), "."],
						), 
					),

					pinformative("Accordingly, you ", r("dss_verify"), " a signature by calling the ed25519 verification function for the same concatenation."),

					pinformative("We define ", def_fn("encode_cinn_pk"), " as the function that maps a ", r("cinn25519"), "<", r("cinn_min"), ", ", r("cinn_max"), "> public key to the concatenation of ", lis(
						["The ", r("cinn_shortname"), ", encoded as ascii,"],
						["If ", code(r("cinn_min"), " < ", r("cinn_max")), " the byte ", code("0x00"), ", otherwise the empty string, and"],
						["the ", r("cinn_pk_pk"), " (which is a sequence of bytes)."],
					)),
				]),

				hsection("es6_ids", "Identifiers", [
					pinformative("Two concepts in Earthstar use ", r("cinn25519"), " as identifiers."),

					pinformative("An ", def({id: "es6_identity", singular: "identity identifier"}), " is a ", r("cinn25519"), "<4, 4> public key."),

					pinformative("A ", def({id: "es6_namespace", singular: "namespace identifier"}), " is a ", r("cinn25519"), "<1, 15> public key."),
					
					hsection("es6_id_tags", "Tag encodings", [
						
						pinformative("Identifiers have (optional) ", def({
							id: "tag_encoding",
							singular: "tag encoding",
							plural: "tag encodings"
						}, 'tag encodings'), ', which encode identifiers as more legible strings, e.g. ', code("@suzy.b3kxcquuxuckzqcovqhtk32ncj6aiixk46zg6pkfocdkhpst4selq"), "."),
						
						pinformative("To encode an identifier to a ", r('tag_encoding', 'tag,'), 
							lis(
								["let ", def_value('tag_sigil', "sigil"), ' be ', 
									lis(
										[code('@'), ' if the identifier is a ', r('es6_identity'), ', or,'], 
										[code('+'), ' if the identifier is a ', r("es6_namespace"), " for a ", r("communal_namespace"), ', or,'], 
										[code("-"), " if the identifier is a ", r("es6_namespace"), " for an ", r("owned_namespace"),]
									),
								],
								[
									"let ", def_value('tag_shortname', "shortname"), " be the the identifier's ", r("cinn_shortname"), ","
								],
								[
									"let ", def_value('tag_b32_pub_key', "b32_pub_key"), " be the identifier's ", r("cinn_pk_pk"), ", encoded as a ", link("RFC4648 Base32 string", "https://www.rfc-editor.org/rfc/rfc4648#section-6"),  em(" without padding characters and prepended by the character", code('b')), "."
								],
								[
									"And interpolate them into a single string of the format",
									br(),
									code(
										"{",
										r("tag_sigil", "sigil"),
										"}{",
										r("tag_shortname", 'shortname'),
										"}.{",
										r("tag_b32_pub_key", 'b32_pub_key'),
										"}"
									)
								]
							), 
						),					
					])
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
					"The ", r("max_component_length"), " is 64, the ", r("max_component_count"), " is 16, and the ", r("max_path_length"), " is 1024."),

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
					"The ", r("encode_namespace_pk"), " function is ", r("encode_cinn_pk"), "."
				),

				pinformative(
					"The ", r("encode_namespace_sig"), " function maps a ", r("namespace_signature_scheme"), " signature (which is just an ed25519 signature, which is just a sequence of bytes) to itself."
				),

				pinformative(
					"The ", r("user_signature_scheme"), " is ", r("cinn25519"), "<4, 4>."
				),

				pinformative(
					"The ", r("encode_user_pk"), " function is ", r("encode_cinn_pk"), "."
				),

				pinformative(
					"The ", r("encode_user_sig"), " function maps a ", r("user_signature_scheme"), " signature (which is just an ed25519 signature, which is just a sequence of bytes) to itself."
				),

				pinformative(
					"The ", r("is_communal"), " function maps a ", r("es6_namespace"), " to ", code("true"), " if and only if the least significant bit of its ", r("cinn_pk_pk"), " is ", code("0"), "."
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
						"The type ", r("PsiGroup"), " is the type of curve points of Edwards25519, i.e., the twisted Edwards curve used by ", link("ed25519", "https://datatracker.ietf.org/doc/html/rfc8032#section-5.1"), "."
					),

					pinformative(
						"The type ", r("PsiScalar"), " is the type of Ed25519 scalars."
					),

					pinformative(
						"The ", r("psi_scalar_multiplication"), " function is scalar multiplication in Edwards25519."
					),

					pinformative(
						"The ", r("hash_into_group"), " function encodes a ", r("fragment"), " using the ", r("encode_fragment"), " function that we define below, then uses the encoding as input to ", link("edwards25519_XMD:SHA-512_ELL2_RO_", "https://www.rfc-editor.org/rfc/rfc9380#name-suites-for-curve25519-and-e"), " with the ascii encoding of the string ", code("earthstar6i"), " as the ", link("domain separation tag", "https://www.rfc-editor.org/rfc/rfc9380#name-domain-separation-requireme"), "."
					),

					pinformative("We define the ", def_fn({id: "encode_fragment", singular: "encode_fragment"}), " function as follows:", lis(
						["Encode a ", r("fragment"), " ", code("(", def_value({id: "es6_fragment2_namespace", singular: "namespace"}), ", ", def_value({id: "es6_fragment2_prefix", singular: "pre"}), ")"), " as the concatenation of", lis(
							[function_call(r("encode_cinn_pk"), r("es6_fragment2_namespace")), ", and"],
							[function_call(r("encode_path"), r("es6_fragment2_prefix")), "."],
						)],
						["Encode a ", r("fragment"), " ", code("(", def_value({id: "es6_fragment3_namespace", singular: "namespace"}), ", ", def_value({id: "es6_fragment3_subspace_id", singular: "subspace_id"}), ", ", def_value({id: "es6_fragment3_prefix", singular: "pre"}), ")"), " as the concatenation of", lis(
							[function_call(r("encode_cinn_pk"), r("es6_fragment3_namespace")), ","],
							[function_call(r("encode_user_pk"), r("es6_fragment3_subspace_id")), " as defined in the parameterisation of Meadowcap, and"],
							[function_call(r("encode_path"), r("es6_fragment3_prefix")), "."],
						)],
					)),

					pinformative(
						"The type ", r("SubspaceCapability"), " is the type of ", rs("McSubspaceCapability"), " for our instantiation of Meadowcap. So in particular, the type ", r("sync_subspace_receiver"), " is that of ", rs("es6_identity"), ", and the type ", r("sync_subspace_signature"), " is that of ", r("user_signature_scheme"), " signatures."
					),
				]),

				hsection("es6_wgps_reconciliation", "3d Range-Based Set Reconciliation", [
					pinformative(
						"The type ", r("Fingerprint"), " is the type of 32 byte arrays that are valid ", link("encodings of Edwards25519 curve points", "https://datatracker.ietf.org/doc/html/rfc8032#section-5.1.2"), ", the type ", r("PreFingerprint"), " is the type of Edwards25519 curve points with ", quotes(link("cleared cofactor", "https://www.rfc-editor.org/rfc/rfc9380#name-clearing-the-cofactor")), " (i.e., the codomain of ", link("edwards25519_XMD:SHA-512_ELL2_RO_", "https://www.rfc-editor.org/rfc/rfc9380#name-suites-for-curve25519-and-e"), "), and the ", r("fingerprint_finalise"), " function encodes a curve point according to ", link("RFC 8032", "https://datatracker.ietf.org/doc/html/rfc8032#section-5.1.2"), ".",
					),

					pinformative(
						"The ", r("fingerprint_singleton"), " function encodes a ", r("LengthyEntry"), " using the ", r("es6_encode_le"), " function that we define below, then uses the encoding as input to ", link("edwards25519_XMD:SHA-512_ELL2_RO_", "https://www.rfc-editor.org/rfc/rfc9380#name-suites-for-curve25519-and-e"), " with the ascii encoding of the string ", code("earthstar6u"), " as the ", link("domain separation tag", "https://www.rfc-editor.org/rfc/rfc9380#name-domain-separation-requireme"), "."
					),

					pinformative("We define the ", def_fn({id: "es6_encode_le", singular: "encode_lengthy_entry"}), " function as mapping a ", r("LengthyEntry"), " ", def_value({id: "es6_le", singular: "le"}), " to the concatenation of:", lis(
						[encode_two_bit_int(field_access(r("es6_le"), "lengthy_entry_available")),],
						[function_call(r("encode_entry"), field_access(r("es6_le"), "lengthy_entry_entry")), "."],
					)),

					pinformative(
						"The ", r("fingerprint_combine"), " function is addition of curve points of the Edwards25519 curve.",
					),

					pinformative(
						"The ", r("fingerprint_neutral"), " value is the neutral element of the Edwards25519 curve.",
					),
				]),

				hsection("es6_wgps_other", "Other Parameters", [
					pinformative(
						"The decomposition of ", rs("AuthorisationToken"), " into ", r("StaticToken"), " and ", r("DynamicToken"), " is as recommended for Meadowcap in the WGPS: ", r("StaticToken"), " is the type ", r("Capability"), ", and ", r("DynamicToken"), " is the type of ", r("user_signature_scheme"), " signatures."
					),

					pinformative(
						"The ", r("transform_payload"), " algorithm deterministically maps each ", r("Payload"), " to its ", link("Bao Combined Encoding", "https://github.com/oconnor663/bao/blob/master/docs/spec.md#combined-encoding-format"), ", excluding the first eight bytes of the combined encoding (which would encode the length)."
					),

					pinformative(
						"The ", r("sync_default_namespace_id"), " is the ", r("es6_namespace"), " whose ", r("cinn_shortname"), " is ", code("a"), " and whose ", r("cinn_pk_pk"), " consists of zero-bytes only.",
					),

					pinformative(
						"The ", r("sync_default_subspace_id"), " is the ", r("es6_identity"), " whose ", r("cinn_shortname"), " is ", code("a000"), " and whose ", r("cinn_pk_pk"), " consists of zero-bytes only.",
					),

					pinformative(
						"The ", r("sync_default_payload_digest"), " is the sequence of 256 zero bits.",
					),
				]),

				hsection("es6_wgps_encoding", "Encoding Parameters", [
					pinformative("Whenever any encoding function needs to encode a ", r("cinn25519"), "public key, use ", r("encode_cinn_pk"), ". Whenever any encoding function needs to encode a signature or a digest, just use the signature or the digest itself (they already are sequences of bytes)."),

					pinformative(
						"The ", r("encode_group_member"), " function encodes each ", r("PsiGroup"), " member (i.e., each Edwards25519 curve point) ", link("according to RFC8032", "https://datatracker.ietf.org/doc/html/rfc8032#section-5.1.2"), "."
					),

					pinformative(
						"The ", r("encode_subspace_capability"), " function is ", r("encode_mc_subspace_capability"), ", except you omit encoding the ", r("subspace_cap_namespace"), "."
					),

					pinformative(
						"The ", r("encode_sync_subspace_signature"), " function maps each ", r("sync_subspace_signature"), " (i.e., each ed25519 signature, which is already a sequence of bytes) to itself."
					),

					pinformative(
						"The ", r("encode_read_capability"), " function is ", r("encode_mc_capability"), ", except you omit encoding the ", r("communal_cap_namespace"), "."
					),

					pinformative(
						"The ", r("encode_sync_signature"), " function maps each ", r("sync_signature"), " (i.e., each ed25519 signature, which is already a sequence of bytes) to itself."
					),

					pinformative(
						"The total order on ", r("SubspaceId"), " (i.e., on ", r("es6_identity"), ") orders by ", r("cinn_shortname"), " first (lexicographically), and by ", r("cinn_pk_pk"), " second (again lexicographically). This ordering fulfils the necessary properties, and ", r("sync_default_subspace_id"), " is indeed the unique least element.",
					),

					pinformative(
						"The ", r("encode_static_token"), " function is ", r("encode_mc_capability"), ", encoding relative to the ", r("full_area"), "."
					),

					pinformative(
						"The ", r("encode_dynamic_token"), " function maps each ", r("DynamicToken"), " (i.e., each ed25519 signature, which is already a sequence of bytes) to itself."
					),

					pinformative(
						"The ", r("encode_fingerprint"), " function maps each ", r("Fingerprint"), " (which is already a sequence of bytes) to itself."
					),
				]),

				hsection("es6_wgps_bao", "Bao Integration", [
					pinformative("In addition to these parameters, Earthstar integrates ", link("Bao", "https://github.com/oconnor663/bao/blob/master/docs/spec.md"), " verified streaming in a way that slightly stretches the intended semantics of the WGPS. The WGPS has several messages that require peers to specify an offset in a payload as an unsigned integer. Earthstar changes the semantics of that integer: instead of a payload offset, those messages give an offset into the depth-first numbering of the Blake3 tree of the payload. This offset must then be converted into an offset of the Bao ", link("combined encoding", "https://github.com/oconnor663/bao/blob/master/docs/spec.md#combined-encoding-format"), ", to determine where in the transformed payload (i.e., the combined encoding of the payload sans the first eight length-bytes) to resume transmission."),

					pinformative("Consider the example from the Bao spec for a payload of 2049 zero bytes (two full chunks and a third chunk with just one byte):"),

					pre(`root parent node  |left parent node  |first chunk|second chunk|last chunk
a04fc7...c37466...|91715a...f0eef3...|000000...  |000000...   |00`),

					pinformative(
						marginale(["We will add offset conversion formulae here once we get to implementing this ourselves. Right now, the Earthstar implementation is a beta version that performs no payload transformations. If you want to implement Bao support for Earthstar/Willow, whether in an implementation of your own or in the reference implementation, please reach out."]),
						"A pre-order offset of ", code("0"), " corresponds to byte zero (the start of the root parent node), a pre-order offset of ", code("1"), " corresponds to byte 64 (the start of the left parent node), a pre-order offset of ", code("2"), " corresponds to byte 128 (the start of the first chunk), a pre-order offset of ", code("3"), " corresponds to byte 1152 (the start of the second chunk), and a pre-order offset of ", code("4"), " corresponds to byte 3176 (the start of the last chunk). It is impossible to specify positions ", em("inside"), " a parent node or chunk.", 
					),

					pinformative("The following fields of messages use pre-order-offset semantics instead of payload-byte-offset semantics in earthstar:", lis(
						[R("DataSendEntry"), ": ", r("DataSendEntryOffset"), ", and"],
						[R("DataBindPayloadRequest"), ": ", r("DataBindPayloadRequestOffset"), "."],
					)),

				]),
				
			]),
			
			hsection("es6_friendly_paths", "Friendly paths", [
				pinformative("While Willow's ", rs("Path"), " are defined as sequences of bytestrings, Earthstar defines a subset of these as human-readable ", def({
					id: "es6_friendly_path",
					singular: "friendly path",
					plural: "friendly paths",
				}, "friendly paths"), "."),
				pinformative("A path is considered ", r("es6_friendly_path", 'friendly'), " if every byte of its bytestrings belong to the set of ascii encodings of the following characters: ", code("-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_"), ", that is, alphanumerics and ", code("-"), ", ", code("."), ", and ", code("_"), "."),
				pinformative("This makes it possible to provide legible encodings of paths, e.g. ", path('blog', 'recipes', 'chocolate_pizza'), ", and to input paths using a keyboard.")
			]),
			
			img(asset("earthstar/emblem.png"), `An Earthstar emblem: A stylised drawing of three Earthstars (a type of mushroom) sitting on a mossy knoll, with a silhoette of a rabbit in the background, all next to a hand-lettered cursive of the word "Meadowcap".`),
		],
);
