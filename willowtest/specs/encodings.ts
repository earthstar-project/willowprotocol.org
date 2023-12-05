import {
  def_value,
  link,
  lis,
  pinformative,
  quotes,
  site_template,
} from "../main.ts";
import {
Attributes,
  code,
  em,
  figcaption,
  figure,
  img,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from "../../h.ts";
import { r, def, rs } from "../../defref.ts";
import { asset } from "../../out.ts";
import { marginale, marginale_inlineable, sidenote } from "../../marginalia.ts";
import { Expression, Invocation, new_macro } from "../../tsgen.ts";
import { hsection } from "../../hsection.ts";
import { $ } from "../../katex.ts";
import { def_type, field_access, function_call } from "../../pseudocode.ts";

const apo = "’";

export function small_img(src: Expression, attributes: Attributes = {}): Expression {
  const macro = new_macro(
      (args, _ctx) => {
          return img(args[0], {...attributes, style: "height: 32px;"});
      },
  );
  return new Invocation(macro, [src]);
}

export const encodings: Expression = site_template({
  name: "encodings",
  title: "On Encodings",
}, [
  pinformative("A perhaps curious feature of the Willow data model is that its specifications never talks about encodings. ", sidenote("We", ["Let", apo, " be honest: ", em("Aljoscha")]), " strongly believe that specifications should concern themselves with purely logical data types as long as possible, treating encodings as a minor and ultimately interchangeable detail. When specifications define concepts in terms of their encodings, results usually end up miserably underspecified (see ", link("JSON", "https://en.wikipedia.org/wiki/JSON#Interoperability"), ") or full of incidental complexity (see ", link("XML", "https://en.wikipedia.org/wiki/XML"), ")."),

  pinformative("Nevertheless, protocols that deal with persistent storage and network transmissions eventually have to serialize data. In this document, we give both some generic definitions around arbitrary encodings, and some specific encodings that recur throughout the Willow family of specifications."),

  hsection("encodings_what", "Encodings, In Detail", [
    pinformative("The Willow protocols are generic over user-supplied parameters. Invariably, some values of the user-supply types need to be encoded, so there also have to be user-supplied definitions of how to encode things. But not every function that turns values into byte strings defines an encoding."),

    pinformative("Hence, we formally define what we mean by encodings. We first give a succinct, rather mathematical definition, followed by a more accessible English explanation."),

    pinformative(
      "An ", def({id: "encoding_function", singular: "encoding function"}), " ", code(`encode_s`), " for a set ", code(`S`), " is a function from ", code(`S`), " to the set of bytestrings, such that there exists a function ", code(`decode_s`), " such that:",

      lis(
        [
          "for every ", code(`s`), " in ", code(`S`), " and every bytestring ", code(`b`), " that starts with ", code("encode_s(s)"), " we have ", code("decode_s(b) = s"), ", and",
        ],
        [
          "for every ", code(`s`), " in ", code(`S`), " and every bytestring ", code(`b`), " that does not start with ", code(`encode_s(s)`), " we have ", code(`decode_s(b) != s`), ".",
        ],
      ),
    ),

    pinformative("In plain language:"),

    lis(
      [
        code(`encode_s`), " must deterministically map any value of type ", code(`S`), " to exactly one bytestring.",

        figure(
          table(
            thead(
              tr(
                th("Input"),
                th("Output"),
                th("Correctness"),
              ),
            ),
            tbody(
              tr(
                td(small_img(asset("meadowcap/turtle.png"))),
                td(code(quotes("turtle"))),
                td(small_img(asset("meadowcap/checkmark.png"))),
              ),
            ),
            tbody(
              tr(
                td(small_img(asset("meadowcap/turtle.png"))),
                td(code(quotes("turtle"), " | ", quotes("tortoise"))),
                td(small_img(asset("meadowcap/cross.png"))),
              ),
            ),
            tbody(
              tr(
                td(small_img(asset("meadowcap/turtle.png"))),
                td(small_img(asset("meadowcap/questionmark.png"))),
                td(small_img(asset("meadowcap/cross.png"))),
              ),
            ),
          ),
          figcaption("Desired behaviour for ", code("encode_animal"), "."),
        ),
      ],

      [
        "Further, there must be a corresponding decoding function ", code(`decode_s`), ". This function must map valid encodings back to values of type ", code(`S`), ", and it must report an encoding error for any input string that does not start with a valid encoding of anything.",

        figure(
          table(
            thead(
              tr(
                th("Input"),
                th("Output"),
                th("Correctness"),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("meadowcap/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("meadowcap/checkmark.png"))),
              ),
              tr(
                td(code(quotes("tortoise"))),
                td(small_img(asset("meadowcap/questionmark.png"))),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("meadowcap/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("meadowcap/cross.png"))),
              ),
              tr(
                td(code(quotes("tortoise"))),
                td(small_img(asset("meadowcap/turtle.png"))),
              ),
            ),
          ),
          figcaption("Desired behaviour for ", code("decode_animal"), "."),
        ),
      ],

      [
        "And finally, appending arbitrary bytes to a valid encoding must not cause any change in the return value of ", code(`decode_s`),
        ".",
        marginale(["This requirement makes it so we can encode sequences of multiple values by simply concatenating their encodings, without running the risk that the resulting string would be a valid encoding of a different value as well."]),

        figure(
          table(
            thead(
              tr(
                th("Input"),
                th("Output"),
                th("Correctness"),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("meadowcap/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("meadowcap/checkmark.png"))),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("meadowcap/turtle.png"))),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("meadowcap/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("meadowcap/cross.png"))),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("meadowcap/questionmark.png"))),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("meadowcap/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("meadowcap/cross.png"))),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("meadowcap/turtleneck.png"))),
              ),
            ),
          ),
          figcaption("Desired behaviour for ", code(`decode_animal`), "."),
        ),
      ],
    ),

  ]),

  hsection("specific_encodings", "Specific Encodings", [
    pinformative("In this section, we propose some specific encodings for several datatypes of Willow."),

    pinformative("When designing encodings, there rarely exists a single ", em("best"), " solution. Different scenarios might warrant different trade-offs between encoding and decoding time, encoding size, or simplicity. Furthermore, additional context can often enable more efficient encodings than general-purpose solutions. For example, a database that groups ", rs("Entry"), " by ", r("entry_namespace_id"), " would not need to encode the ", r("entry_namespace_id"), " of every individual ", r("Entry"), "."),

    pinformative("For these reasons, we encourage you to take the following suggested encodings with a grain of salt, and to look for contextual information that you could leverage to obtain even more efficient encodings for your specific use cases."),

    hsection("encodings_data_model", "Data Model Encodings", [
      pinformative("When encoding ", rs("Path"), ", we want to use fixed-width unsigned integers of minimal width. Hence, we define:"),

      pinformative(def_value("path_length_power"), " is the least natural number such that ", code("256^", r("path_length_power"), " >= ", r("max_component_length")), ". We can represent the length of any ", r("Path"), " component in ", r("path_length_power"), " bytes. ", def_type("UPathLengthPower"), " denotes the type of numbers between zero (inclusive) and ", code("256^", r("path_length_power")), " (exclusive)."),

      pinformative(def_value("path_count_power"), " is the least natural number such that ", code("256^", r("path_count_power"), " >= ", r("max_component_count")), ". We can represent the number of components of any ", r("Path"), " in ", r("path_count_power"), " bytes. ", def_type("UPathCountPower"), " denotes the type of numbers between zero (inclusive) and ", code("256^", r("path_count_power")), " (exclusive)."),

      pinformative("To encode a ", r("Path"), " ", def_value({id: "enc_path_p", singular: "p"}), ", we define ", function_call(def_value("encode_path"), r("enc_path_p")), " as the concatenation of", lis(
        ["the number of components of ", r("enc_path_p"), ", encoded as an unsigned, big-endian ", r("path_count_power"), "-byte integer,"],
        ["for each component of ", r("enc_path_p"), ",", lis(
          ["the length of the component, encoded as an unsigned, big-endian ", r("path_length_power"), "-byte integer, followed by the bytes of the component."],
        )],
      )),

      pinformative("To encode an ", r("Entry"), " ", def_value({id: "enc_entry_e", singular: "e"}), ", let ", def_value("encode_namespace_id"), " be an ", r("encoding_function"), " for ", r("NamespaceId"), ", let ", def_value("encode_subspace_id"), " be an ", r("encoding_function"), " for ", r("SubspaceId"), ", and let ", def_value("encode_payload_digest"), " be an ", r("encoding_function"), " for ", r("PayloadDigest"), ". We then define ", function_call(def_value("encode_entry"), r("enc_entry_e")), " as the concatenation of", lis(
        [function_call(r("encode_namespace_id"), field_access(r("enc_entry_e"), "entry_namespace_id")), ","],
        [function_call(r("encode_subspace_id"), field_access(r("enc_entry_e"), "entry_subspace_id")), ","],
        [function_call(r("encode_path"), field_access(r("enc_entry_e"), "entry_path")), ","],
        [field_access(r("enc_entry_e"), "entry_timestamp"), ", encoded as an unsigned, big-endian 64-bit integer,"],
        [field_access(r("enc_entry_e"), "entry_payload_length"), ", encoded as an unsigned, big-endian 64-bit integer,"],
        [function_call(r("encode_payload_digest"), field_access(r("enc_entry_e"), "entry_payload_digest")), "."],
      )),

      pinformative("To encode small numbers with fewer bytes than large numbers, we define the for any number ", def_value({id: "compact_width_n", singular: "n"}), " between zero (inclusive) and ", code("2^64"), " (exclusive) the value ", function_call(def_value("compact_width"), r("compact_width_n")), " as", lis(
        [code("1"), ", if ", code(r("compact_width_n"), " < 256"), ", or"],
        [code("2"), ", if ", code(r("compact_width_n"), " < 256^2"), ", or"],
        [code("4"), ", if ", code(r("compact_width_n"), " < 256^4"), ", or"],
        [code("8"), ", otherwise."],
      )),

    ]),

    hsection("relativity", "Relativity", [
      pinformative("When encoding several Willow objects, we can often achieve smaller outputs by encoding only how some object differs from another. In this section, we define several such relative encodings."),

      pinformative("To encode a ", r("Path"), " ", def_value({id: "relative_path_primary", singular: "primary"}), " relative to another ", r("Path"), " ", def_value({id: "relative_path_reference", singular: "reference"}), ", we define ", function_call(def_value("encode_path_relative"), r("relative_path_primary"), r("relative_path_reference")), " as the concatenation of", lis(
        ["the length of the longest common ", r("path_prefix"), " of ", r("relative_path_primary"), " and ", r("relative_path_reference"), ", encoded as an unsigned, big-endian ", r("path_count_power"), "-byte integer,"],
        [r("encode_path"), " of the ", r("Path"), " obtained by removing that longest common prefix from ", r("relative_path_primary"), "."],
      )),

      pinformative("In all subsequent definitions, whenever the value ", r("range_open"), " is part of a numeric computation or comparison, it should be treated as a very large number, say, ", code("2^9999"), ". The definitions all ensure that the resulting values never have to be encoded."),

      pinformative("To encode an ", r("Area"), " ", def_value({id: "area_in_area_inner", singular: "inner"}), " that is ", r("area_include_area", "included"), " in another ", r("Area"), " ", def_value({id: "area_in_area_outer", singular: "outer"}), ", we first define ", def_value({id: "aia_start", singular: "start_diff"}), " as the minimum of ", code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"), " - ", field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart")), " and ", code(field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"), " - ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart")), ", and we define ", def_value({id: "aia_end", singular: "end_diff"}), " as the minimum of ", code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " - ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart")), " and ", code(field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"), " - ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd")), ". We then define ", function_call(def_value("encode_area_in_area"), r("area_in_area_inner"), r("area_in_area_outer")), " as the concatenation of", lis(
        ["a byte whose bits are set as follows (bit 0 is the most significant bit, bit 7 the least significant):", lis(
          ["Bit 0 is set to ", code("1"), " if ", code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")), " and to ", code("0"), " otherwise,"],
          ["Bit 1 is set to ", code("1"), " if ", code(field_access(r("area_in_area_inner"), "AreaSubspace"), " != ", field_access(r("area_in_area_outer"), "AreaSubspace")), marginale(["Because ", r("area_in_area_outer"), " ", rs("area_include_area"), " ", r("area_in_area_inner"), ", this only happens when ", field_access(r("area_in_area_outer"), "AreaSubspace"), " is ", r("area_any"), " but ", field_access(r("area_in_area_outer"), "AreaSubspace"), " is not."]), " and to ", code("0"), " otherwise,"],
          ["Bit 2 is set to ", code("1"), " if ", code(r("aia_start"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"), " - ", field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart")), " and to ", code("0"), " otherwise,"],
          ["Bit 3 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_start")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise,"],
          ["Bit 4 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_start")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise,"],
          ["Bit 5 is set to ", code("1"), " if ", code(r("aia_end"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " - ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart")), " and to ", code("0"), " otherwise,"],
          ["Bit 6 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_end")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise,"],
          ["Bit 7 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_end")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise,"],
        )],

        [r("aia_start"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), r("aia_start")), "-byte integer,"],
        [r("aia_end"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), r("aia_end")), "-byte integer, or the empty string, if ", code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")), ","],
        [function_call(r("encode_path_relative"), field_access(r("area_in_area_inner"), "AreaPath"), field_access(r("area_in_area_outer"), "AreaPath")), ","],
        [function_call(r("encode_subspace_id"), field_access(r("area_in_area_inner"), "AreaSubspace")), ",  or the empty string, if ", code(field_access(r("area_in_area_inner"), "AreaSubspace"), " == ", field_access(r("area_in_area_outer"), "AreaSubspace")), "."],
      )),

    ]),

  ]),

]);

/*

*/
