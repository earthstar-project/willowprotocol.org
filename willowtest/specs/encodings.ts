import {
bitfield_doc,
def_fn,
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
  li,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
  ul,
} from "../../h.ts";
import { def, preview_scope, r, r$, rs } from "../../defref.ts";
import { asset } from "../../out.ts";
import { marginale, sidenote } from "../../marginalia.ts";
import { Expression, Invocation, new_macro } from "macro";
import { hsection } from "../../hsection.ts";
import { Struct, def_type, field_access, function_call, hl_builtin, pseudocode } from "../../pseudocode.ts";
import { $comma, $dot, $ } from "../../katex.ts";
import { surpress_output } from "../../tsgen.ts";
import { BitfieldRow, Bitfields, encodingdef } from "../encodingdef.ts";

const apo = "’";

export function small_img(
  src: Expression,
  attributes: Attributes = {},
): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      const mergedStyle = attributes.style
        ? `height: 32px;${attributes.style}`
        : "height: 32px";

      return img(args[0], { ...attributes, style: mergedStyle });
    },
  );
  return new Invocation(macro, [src]);
}

export const encodings: Expression = site_template({
  name: "encodings",
  title: "On Encodings",
}, [
  pinformative(
    "A perhaps curious feature of the Willow data model is that its specifications rarely talk about encodings. ",
    sidenote("We", ["Let’ be honest: ", em("Aljoscha")]),
    " strongly believe that specifications should concern themselves with purely logical data types as long as possible, treating encodings as a minor and ultimately interchangeable detail. When specifications define concepts in terms of their encodings, results usually end up miserably underspecified (see ", link("JSON", "https://en.wikipedia.org/wiki/JSON#Interoperability"), ") or full of incidental complexity (see ", link("XML", "https://en.wikipedia.org/wiki/XML"), ").",
  ),

  pinformative(
    "Nevertheless, protocols that deal with persistent storage and network transmissions eventually have to serialise data. In this document, we give both some generic definitions around arbitrary encodings, and some specific encodings that recur throughout the Willow family of specifications.",
  ),

  hsection("encodings_what", "Encodings, In Detail", [
    pinformative(
      "The Willow protocols are generic over user-supplied parameters. Invariably, some values of the user-supplied types need to be encoded, so there also have to be user-supplied definitions of how to encode things. But not every function that turns values into byte strings defines an encoding.",
    ),

    pinformative(
      "Hence, we formally define what we mean by encodings. We first give a succinct, rather mathematical definition, followed by a more accessible English explanation.",
    ),

    pinformative(
      "An ", def({ id: "encoding_function", singular: "encoding function" }), " ", def_fn({id: "encode_s", math: "encode\\_s"}), " for a set ", def_type({id: "encS", singular: "S"}), " is a function from ", r("encS"), " to the set of bytestrings, such that there exists a function ", def_fn({id: "decode_s", math: "decode\\_s"}), " such that:", lis(
        [
          "for every ", def_value({id: "enc_s", singular: "s"}), " in ", r("encS"), " and every bytestring ", def_value({id: "enc_b", singular: "b"}), " that starts with ", function_call(r("encode_s"), r("enc_s")), ", we have ", $comma([r$("decode_s"), "(", r$("enc_b"), ") = ", r$("enc_s"), ""]), " and",
        ],
        [
          "for every ", def_value({id: "enc_s2", singular: "s"}), " in ", r("encS"), " and every bytestring ", def_value({id: "enc_b2", singular: "b"}), " that does not start with ", function_call(r("encode_s"), r("enc_s")), ", we have ", $dot([r$("decode_s"), "(", r$("enc_b2"), ") \\neq ", r$("enc_s2"), ""]),
        ],
      ),
    ),

    pinformative("In plain language:"),

    surpress_output(def_fn({id: "encode_animal", math: "encode\\_animal"}, "encode_animal", ["A hypothetical ", r("encoding_function"), " for animals."])),
    surpress_output(def_fn({id: "decode_animal", math: "decode\\_animal"}, "ecode_animal", ["A hypothetical function for decoding the outputs of the ", r("encode_animal"), " ", r("encoding_function"), "."])),

    lis(
      [
        r(`encode_s`), " must deterministically map any value of type ", r(`encS`), " to exactly one bytestring.",

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
                td(small_img(asset("encoding/turtle.png"))),
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/checkmark.png"))),
              ),
            ),
            tbody(
              tr(
                td(small_img(asset("encoding/turtle.png"))),
                td(code(quotes("turtle"), " | ", quotes("tortoise"))),
                td(small_img(asset("encoding/cross.png"))),
              ),
            ),
            tbody(
              tr(
                td(small_img(asset("encoding/turtle.png"))),
                td(small_img(asset("encoding/questionmark.png"))),
                td(small_img(asset("encoding/cross.png"))),
              ),
            ),
          ),
          figcaption("Desired behaviour for ", r("encode_animal"), "."),
        ),
      ],
      [
        "Further, there must be a corresponding decoding function ", r(`decode_s`), ". This function must map valid encodings back to values of type ", r(`encS`), ", and it must report a decoding error for any input string that does not start with a valid encoding of any value of type ", r("encS"), ".",

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
                td(small_img(asset("encoding/turtle.png"))),
                td(
                  { rowspan: "2" },
                  small_img(asset("encoding/checkmark.png")),
                ),
              ),
              tr(
                td(code(quotes("tortoise"))),
                td(small_img(asset("encoding/questionmark.png"))),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("encoding/cross.png"))),
              ),
              tr(
                td(code(quotes("tortoise"))),
                td(small_img(asset("encoding/turtle.png"))),
              ),
            ),
          ),
          figcaption("Desired behaviour for ", r("decode_animal"), "."),
        ),
      ],
      [
        "And finally, appending arbitrary bytes to a valid encoding must not cause any change in the return value of ", r(`decode_s`), ".",
        marginale([
          "This requirement makes it so we can encode sequences of multiple values by simply concatenating their encodings, without running the risk that the resulting string would be a valid encoding of a different value as well.",
        ]),

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
                td(small_img(asset("encoding/turtle.png"))),
                td(
                  { rowspan: "2" },
                  small_img(asset("encoding/checkmark.png")),
                ),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("encoding/turtle.png"))),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("encoding/cross.png"))),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("encoding/questionmark.png"))),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/turtle.png"))),
                td({ rowspan: "2" }, small_img(asset("encoding/cross.png"))),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("encoding/turtleneck.png"))),
              ),
            ),
          ),
          figcaption("Desired behaviour for ", r(`decode_animal`), "."),
        ),
      ],
    ),
  ]),

  hsection("specific_encodings", "Specific Encodings", [
    pinformative(
      "In this section, we propose some specific encodings for several datatypes of Willow.",
    ),

    pinformative(
      "When designing encodings, there rarely exists a single ", em("best"), " solution. Different scenarios might warrant different trade-offs between encoding and decoding time, encoding size, or simplicity. Furthermore, additional context can often enable more efficient encodings than general-purpose solutions. For example, a database that groups ", rs("Entry"), " by ", r("entry_namespace_id"), " would not need to encode the ", r("entry_namespace_id"), " of every individual ", r("Entry"), ".",
    ),

    pinformative(
      "For these reasons, we encourage you to take the following suggested encodings with a grain of salt, and to look for contextual information that you could leverage to obtain even more efficient encodings for your specific use cases.",
    ),

    hsection("encodings_data_model", "Data Model Encodings", [
      pinformative(
        "When encoding ", rs("Path"), ", we want to use fixed-width unsigned integers of minimal width. Hence, we define:",
      ),

      pinformative(
        def_value({id: "path_length_power", math: "path\\_length\\_power"}), " is the least natural number such that ",
        $dot(["256^{", r$("path_length_power"), "} \\geq ", r$("max_component_length")]),
        " We can represent the length of any ", r("Component"), " in ", r("path_length_power"),
        " bytes. ", def_type("UPathLengthPower"), " denotes the type of numbers between zero (inclusive) and ",
        $(["256^{", r$("path_length_power"), "}"]),
        " (exclusive).",
      ),

      pinformative(
        def_value({id: "path_count_power", math: "path\\_count\\_power"}), " is the least natural number such that ",
        $dot(["256^{", r$("path_count_power"), "} \\geq ", r$("max_component_count")]),
        " We can represent the number of ", rs("Component"), " of any ", r("Path"), " in ", r("path_count_power"),
        " bytes. ", def_type("UPathCountPower"), " denotes the type of numbers between zero (inclusive) and ",
        $(["256^{", r$("path_count_power"), "}"]),
        " (exclusive).",
      ),

      pinformative(
        "To encode a ", r("Path"), " ", def_value({ id: "enc_path_p", singular: "p" }), ", we define ", function_call(def_fn({id: "encode_path", math: "encode\\_path"}), r("enc_path_p")), " as the concatenation of", lis(
          [
            "the number of ", rs("Component"), " of ", r("enc_path_p"), ", encoded as a big-endian ", r("UPathCountPower"), ",",
          ],
          [
            "for each ", r("Component"), " of ", r("enc_path_p"), ",",
            lis(
              [
                "the length of the ", r("Component"), ", encoded as a big-endian ", r("UPathLengthPower"), ", followed by the bytes of the ", r("Component"), ".",
              ],
            ),
          ],
        ),
      ),

      pinformative(
        "To encode an ", r("Entry"), " ", def_value({ id: "enc_entry_e", singular: "e" }), ", let ",
        def_fn({id: "encode_namespace_id", math: "encode\\_namespace\\_id"}), " be an ", r("encoding_function"), " for ", r("NamespaceId"), ", let ",
        def_fn({id: "encode_subspace_id", math: "encode\\_subspace\\_id"}), " be an ", r("encoding_function"), " for ", r("SubspaceId"), ", and let ",
        def_fn({id: "encode_payload_digest", math: "encode\\_payload\\_digest"}), " be an ", r("encoding_function"), " for ", r("PayloadDigest"),
        ". We then define ",
        function_call(def_fn({id: "encode_entry", math: "encode\\_entry"}), r("enc_entry_e")),
        " as the concatenation of", lis(
          [
            function_call(
              r("encode_namespace_id"),
              field_access(r("enc_entry_e"), "entry_namespace_id"),
            ),
            ",",
          ],
          [
            function_call(
              r("encode_subspace_id"),
              field_access(r("enc_entry_e"), "entry_subspace_id"),
            ),
            ",",
          ],
          [
            function_call(
              r("encode_path"),
              field_access(r("enc_entry_e"), "entry_path"),
            ),
            ",",
          ],
          [
            field_access(r("enc_entry_e"), "entry_timestamp"),
            ", encoded as a big-endian ", r("U64"), ",",
          ],
          [
            field_access(r("enc_entry_e"), "entry_payload_length"),
            ", encoded as a big-endian ", r("U64"), ",",
          ],
          [
            function_call(
              r("encode_payload_digest"),
              field_access(r("enc_entry_e"), "entry_payload_digest"),
            ),
            ".",
          ],
        ),
      ),

      pinformative(
        "To encode small numbers with fewer bytes than large numbers, we define for any ", r("U64"), " ",
        def_value({ id: "compact_width_n", singular: "n" }), " the value ",
        function_call(def_fn({id: "compact_width", math: "compact\\_width"}), r("compact_width_n")),
        " as", lis(
          [$comma("1"), " if ", $comma([r$("compact_width_n"), " < 256"]), " or"],
          [$comma("2"), " if ", $comma([r$("compact_width_n"), " < 256^2"]), " or"],
          [$comma("4"), " if ", $comma([r$("compact_width_n"), " < 256^4"]), " or"],
          [$comma("8"), " otherwise."],
        ),
      ),
    ]),

    hsection("relativity", "Relativity", [
      pinformative(
        "When encoding Willow objects, we can often achieve smaller encoding sizes by encoding how some object differs from another. In this section, we define several such relative encodings.",
      ),

      pinformative(
        "To encode a ", r("Path"), " ",
        def_value({ id: "relative_path_primary", singular: "primary" }),
        " relative to another ", r("Path"), " ",
        def_value({ id: "relative_path_reference", singular: "reference" }),
        ", we define ",
        function_call(
          def_fn({id: "encode_path_relative", math: "encode\\_path\\_relative"}),
          r("relative_path_primary"),
          r("relative_path_reference"),
        ),
        " as the concatenation of", lis(
          [
            "the length of the longest common ", r("path_prefix"), " of ", r("relative_path_primary"), " and ", r("relative_path_reference"),
            ", encoded as a ", r("UPathCountPower"), ",",
          ],
          [
            r("encode_path"), " of the ", r("Path"), " obtained by removing that longest common prefix from ", r("relative_path_primary"), ".",
          ],
        ),
      ),

      pinformative(
        "In all subsequent definitions, whenever the value ", r("range_open"), " is part of a numeric computation or comparison, it should be treated as a very large number, say, ", $dot("2^9999"),
        " The definitions all ensure that the resulting values never have to be encoded.",
      ),

      pinformative(
        preview_scope(
          "To encode an ", r("Area"), " ", def_value({ id: "area_in_area_inner", singular: "inner" }), " that is ", r("area_include_area", "included"), " in another ", r("Area"), " ", def_value({ id: "area_in_area_outer", singular: "outer" }), ", we first define ", def_value({ id: "aia_start", singular: "start_diff" }), " as the minimum of ",
          code(
            field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
            " - ",
            field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart"),
          ),
          " and ",
          code(
            field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
            " - ",
            field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
          ),
          ", and we define ", def_value({ id: "aia_end", singular: "end_diff" }), " as the minimum of ",
          code(
            field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"),
            " - ",
            field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
          ),
          " and ",
          code(
            field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
            " - ",
            field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"),
          ),
        ),
        ". We then define ",
        function_call(def_fn({id: "encode_area_in_area", math: "encode\\_area\\_in\\_area"}), r("area_in_area_inner"), r("area_in_area_outer")), " as the concatenation of",
        lis(
          [
            "a byte whose bits are set as follows (bit 0 is the most significant bit, bit 7 the least significant):",
            bitfield_doc(
              [
                "0",
                [
                  "Set to ", code("1"), " if ",
                code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")),
                " and to ", code("0"), " otherwise.",
                ],
                [
                  "This flag indicates whether the main encoding has to include the ", r("end_value"), " of ", field_access(r("area_in_area_inner"), "AreaTime"), ".",
                ],
              ],
              [
                "1",
                [
                  "Set to ", code("1"), " if ",
                  code(field_access(r("area_in_area_inner"), "AreaSubspace"), " != ", field_access(r("area_in_area_outer"), "AreaSubspace")),
                  " and to ", code("0"), " otherwise.",
                ],
                [
                  "This flag indicates whether the main encoding has to include ", field_access(r("area_in_area_inner"), "AreaSubspace"), ".",
                ]
              ],
              [
                "2",
                [
                  "Set to ", code("1"), " if ",
                  code(r("aia_start"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
                  " - ", field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart")),
                  " and to ", code("0"), " otherwise.",
                ],
                [
                  "This flag indicates whether the encoding of ", r("aia_start"), " must be added to ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart"),
                  " or subtracted from ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
                  ".",
                ]
              ],
              [
                "3",
                [
                  "Set to ", code("1"), " if ",
                  code(r("aia_end"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"),
                  " - ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart")),
                  " and to ", code("0"), " otherwise.",
                ],
                [
                  "This flag indicates whether the encoding of ", r("aia_end"), " must be added to ",
                  field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
                  " or subtracted from ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
                  ".",
                ],
              ],
              [
                "4, 5",
                [
                  "Bit 4 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_start")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise. Bit 5 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_start")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise.",
                ],
                [
                  "Bits 4 and 5 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " for the ", r("TimeRange"), " ", r("start_value"), ".",
                ],
              ],
              [
                "6, 7",
                [
                  "Bit 6 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_end")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise. Bit 7 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_end")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise.",
                ],
                [
                  "Bit 6 and 7 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " for the ", r("TimeRange"), " ", r("end_value"), ".",
                ],
              ],
            ),
            ul(
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the main encoding has to include the ", r("end_value"), " of ", field_access(r("area_in_area_inner"), "AreaTime"), ".",
                ]),
                "Bit 0 is set to ", code("1"), " if ",
                code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")),
                " and to ", code("0"), " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the main encoding has to include ", field_access(r("area_in_area_inner"), "AreaSubspace"), ".",
                ]),
                "Bit 1 is set to ", code("1"), " if ",
                code(field_access(r("area_in_area_inner"), "AreaSubspace"), " != ", field_access(r("area_in_area_outer"), "AreaSubspace")),
                " and to ", code("0"), " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the encoding of ", r("aia_start"), " must be added to ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart"),
                  " or subtracted from ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
                  ".",
                ]),
                "Bit 2 is set to ", code("1"), " if ",
                code(r("aia_start"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
                  " - ", field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart")),
                " and to ", code("0"), " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the encoding of ", r("aia_end"), " must be added to ",
                  field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
                  " or subtracted from ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
                  ".",
                ]),
                "Bit 3 is set to ", code("1"), " if ",
                code(r("aia_end"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"),
                  " - ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart")),
                " and to ", code("0"), " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "Bits 4 and 5 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " for the ", r("TimeRange"), " ", r("start_value"), ".",
                ]),
                "Bit 4 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_start")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
              ),
              li(
                "Bit 5 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_start")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "Bit 6 and 7 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " for the ", r("TimeRange"), " ", r("end_value"), ".",
                ]),
                "Bit 6 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_end")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
              ),
              li(
                "Bit 7 is set to ", code("1"), " if ", function_call(r("compact_width"), r("aia_end")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
              ),
            ),
          ],
          [
            r("aia_start"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), r("aia_start")), "-byte integer,",
          ],
          [
            r("aia_end"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), r("aia_end")), "-byte integer, or the empty string, if ",
            code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")), ",",
          ],
          [
            function_call(
              r("encode_path_relative"),
              field_access(r("area_in_area_inner"), "AreaPath"),
              field_access(r("area_in_area_outer"), "AreaPath"),
            ), ",",
          ],
          [
            function_call(
              r("encode_subspace_id"),
              field_access(r("area_in_area_inner"), "AreaSubspace"),
            ), ",  or the empty string, if ",
            code(field_access(r("area_in_area_inner"), "AreaSubspace"), " == ", field_access(r("area_in_area_outer"), "AreaSubspace")), ".",
          ],
        ),
      ),

      pinformative("To encode an ", r("Entry"), " ", def_value({ id: "entry_rel_entry_primary", singular: "primary" }), " relative to another ", r("Entry"), " ", def_value({ id: "entry_rel_entry_reference", singular: "reference" }), ", we first define ", def_value({id: "erele_time_difference", singular: "time_diff"}), " as the absolute value of ", code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " - ", field_access(r("entry_rel_entry_reference"), "entry_timestamp")), ". We then define ",
      function_call(def_fn({id: "encode_entry_relative_entry", math: "encode\\_entry\\_relative\\_entry"}), r("entry_rel_entry_primary"), r("entry_rel_entry_reference")), " as the concatenation of",
      lis(
        [
          "a byte whose bits are set as follows (bit 0 is the most significant bit, bit 7 the least significant):",
          ul(
            li(
              { style: "clear: right;" },
              marginale([
                "This flag indicates whether the main encoding has to include ", field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), ".",
              ]),
              "Bit 0 is set to ", code("1"), " if ",
              code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")),
              " and to ", code("0"), " otherwise,",
            ),
            li(
              { style: "clear: right;" },
              marginale([
                "This flag indicates whether the main encoding has to include ", field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), ".",
              ]),
              "Bit 1 is set to ", code("1"), " if ",
              code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")),
              " and to ", code("0"), " otherwise,",
            ),
            li(
              { style: "clear: right;" },
              marginale([
                "This flag indicates whether ", r("erele_time_difference"), " must be added to or subtracted from ", field_access(r("entry_rel_entry_reference"), "entry_timestamp"), ".",
              ]),
              "Bit 2 is set to ", code("1"), " if ",
              code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " - ", field_access(r("entry_rel_entry_reference"), "entry_timestamp"), " > 0"),
              " and to ", code("0"), " otherwise,",
            ),
            li(
              { style: "clear: right;" },
              "Bit 3 is always set to ", code("0"), "",
            ),
            li(
              { style: "clear: right;" },
              marginale([
                "Bits 4 and 5 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " of ", r("erele_time_difference"), ".",
              ]),
              "Bit 4 is set to ", code("1"), " if ", function_call(r("compact_width"), r("erele_time_difference")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
            ),
            li(
              "Bit 5 is set to ", code("1"), " if ", function_call(r("compact_width"), r("erele_time_difference")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
            ),
            li(
              { style: "clear: right;" },
              marginale([
                "Bit 6 and 7 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " of ", field_access(r("entry_rel_entry_primary"), "entry_payload_length"), ".",
              ]),
              "Bit 6 is set to ", code("1"), " if ", function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
            ),
            li(
              "Bit 7 is set to ", code("1"), " if ", function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise,",
            ),
          ),
        ],
        [
          function_call(
            r("encode_namespace_id"),
            field_access(r("entry_rel_entry_primary"), "entry_namespace_id"),
          ), ",  or the empty string, if ",
          code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")), ",",
        ],
        [
          function_call(
            r("encode_subspace_id"),
            field_access(r("entry_rel_entry_primary"), "entry_subspace_id"),
          ), ",  or the empty string, if ",
          code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")), ",",
        ],
        [
          function_call(
            r("encode_path_relative"),
            field_access(r("entry_rel_entry_primary"), "entry_path"),
            field_access(r("entry_rel_entry_reference"), "entry_path"),
          ), ",",
        ],
        [
          r("erele_time_difference"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), r("erele_time_difference")), "-byte integer,",
        ],
        [
          field_access(r("entry_rel_entry_primary"), "entry_payload_length"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length")), "-byte integer,",
        ],
        [
          function_call(
            r("encode_payload_digest"),
            field_access(r("entry_rel_entry_primary"), "entry_payload_digest"),
          ),
          ".",
        ],
      )),

      encodingdef(
        new Bitfields(
          new BitfieldRow(
            1,
            [
              "Set to ", code("1"), " if ",
              code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")),
              " and to ", code("0"), " otherwise.",
            ],
            [
              "This flag indicates whether the main encoding has to include ", field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), ".",
            ],
          ),
          new BitfieldRow(
            1,
            [
              "Set to ", code("1"), " if ",
              code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")),
              " and to ", code("0"), " otherwise.",
            ],
            [
              "This flag indicates whether the main encoding has to include ", field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), ".",
            ],
          ),
          new BitfieldRow(
            1,
            [
              "Set to ", code("1"), " if ",
              code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " - ", field_access(r("entry_rel_entry_reference"), "entry_timestamp"), " > 0"),
              " and to ", code("0"), " otherwise.",
            ],
            [
              "This flag indicates whether ", r("erele_time_difference"), " must be added to or subtracted from ", field_access(r("entry_rel_entry_reference"), "entry_timestamp"), ".",
            ],
          ),
          new BitfieldRow(
            1,
            [
              "Always set to ", code("0"), ".",
            ],
          ),
          new BitfieldRow(
            2,
            [
              "Bit 4 is set to ", code("1"), " if ", function_call(r("compact_width"), r("erele_time_difference")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise. Bit 5 is set to ", code("1"), " if ", function_call(r("compact_width"), r("erele_time_difference")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise."
            ],
            [
              "Bits 4 and 5 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " of ", r("erele_time_difference"), ".",
            ],
          ),
          new BitfieldRow(
            2,
            [
              "Bit 6 is set to ", code("1"), " if ", function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length")), " is ", code("4"), " or ", code("8"), ", and to ", code("0"), " otherwise. Bit 7 is set to ", code("1"), " if ", function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length")), " is ", code("2"), " or ", code("8"), ", and to ", code("0"), " otherwise.",
            ],
            [
              "Bit 6 and 7 form a 2-bit integer ", code("n"), " such that ", code("2^n"), " is the ", r("compact_width"), " of ", field_access(r("entry_rel_entry_primary"), "entry_payload_length"), ".",
            ],
          ),
        ),
        [
          [
            function_call(
              r("encode_namespace_id"),
              field_access(r("entry_rel_entry_primary"), "entry_namespace_id"),
            ), ",  or the empty string, if ",
            code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")), ",",
          ],
        ],
        [
          [
            function_call(
              r("encode_subspace_id"),
              field_access(r("entry_rel_entry_primary"), "entry_subspace_id"),
            ), ",  or the empty string, if ",
            code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")), ",",
          ],
        ],
        [
          [
            function_call(
              r("encode_path_relative"),
              field_access(r("entry_rel_entry_primary"), "entry_path"),
              field_access(r("entry_rel_entry_reference"), "entry_path"),
            ), ",",
          ],
        ],
        [
          [
            r("erele_time_difference"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), r("erele_time_difference")), "-byte integer,",
          ],
        ],
        [
          [
            field_access(r("entry_rel_entry_primary"), "entry_payload_length"), ", encoded as an unsigned, big-endian ", function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length")), "-byte integer,",
          ],
        ],
        [
          [
            function_call(
              r("encode_payload_digest"),
              field_access(r("entry_rel_entry_primary"), "entry_payload_digest"),
            ),
            ".",
          ],
        ],
      ),

      pinformative("Above is a real encoding. Have a fake one for styling purposes below:"),

      encodingdef(
        new Bitfields(
          new BitfieldRow(
            1,
            "Some definition, lorem ipsum dolor sit est I wonder how many people have actually memorized the full, original lorem ipsum text. Probably quite a few. Those poor souls...",
            "Short remark."
          ),
          new BitfieldRow(
            2,
            "Short definition",
            "A longer remark that probably needs breaking into several lines. It also perpares you for the harsh truth that the next row will not have any remark. Bla, bla, bla.",
          ),
          new BitfieldRow(
            5,
            "A definition with no accompanying remark. Rather rare for bitfields."
          ),
        ),
        [
          "A bunch more bytes go here. These kinds of instructions can again have a remark, how great. Bgwg herher ffef  er hrth  qwqwqwfqwfqw.",
          "Short remark."
        ],
        [
          "Short def",
          "But a looooooooong, long, loooong, long, loooooong, long, looong, remark, again. So many words, much linewrap!"
        ],
        [
          "A definition without a remark. This is probably the most common case."
        ],
      ),

  pseudocode(
    
  //   new Struct({
  //     id: "EntryInRange",
  //     comment: ["Describes a target ", r("Entry"), " ", code("t"), " in a reference ", r("namespace"), " ", code("n"), " and a reference ", r("3d_range"), " ", code("r"), " that ", rs("3d_range_include"), " ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "EntryInRangeNamespace",
  //           name: "namespace_id",
  //           comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from ", code("n"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInRangeSubspace",
  //           name: "subspace_id",
  //           comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInRangePathPrefix",
  //           name: "prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("path"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("path_range"), " of ", code("r"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "EntryInRangePathSuffix",
  //           name: "suffix",
  //           comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "EntryInRangeTimeDifference",
  //           name: "time_difference",
  //           comment: ["The (numeric) difference between the ", r("timestamp"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInRangePayloadLength",
  //           name: "payload_length",
  //           comment: ["The ", r("payload_length"), " of ", code("t"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInRangePayloadHash",
  //           name: "payload_hash",
  //           comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
  //           rhs: r("Digest"),
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "EntryInArea",
  //     comment: ["Describes a target ", r("Entry"), " ", code("t"), " in a reference ", r("namespace"), " ", code("n"), " and a reference ", r("area"), " ", code("a"), " that ", rs("area_include"), " ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "EntryInAreaNamespace",
  //           name: "namespace_id",
  //           comment: ["The ", r("namespace_id"), " of ", code("t"), " if it differs from ", code("n"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("NamespaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInAreaSubspace",
  //           name: "subspace_id",
  //           comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("a"), " (or if ", code("a"), " does not have one), otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
  //         },
  //         {
  //           id: "EntryInAreaPathPrefix",
  //           name: "prefix_length",
  //           comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("a"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "EntryInAreaPathSuffix",
  //           name: "suffix",
  //           comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "EntryInAreaTimeDifference",
  //           name: "time_difference",
  //           comment: ["The (numeric) difference between the ", r("timestamp"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("a"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInAreaPayloadLength",
  //           name: "payload_length",
  //           comment: ["The ", r("payload_length"), " of ", code("t"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "EntryInAreaPayloadHash",
  //           name: "payload_hash",
  //           comment: ["The ", r("payload_hash"), " of ", code("t"), "."],
  //           rhs: r("Digest"),
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "RangeRelativeRange",
  //     comment: ["Describes a target ", r("3d_range"), " ", code("t"), " relative to a reference ", r("3d_range"), " ", code("r"), "."],
  //     fields: [
  //         {
  //           id: "RangeRelativeRangeSubspaceStart",
  //           name: "subspace_id_start",
  //           comment: [hl_builtin("start"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("end"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("r"), ", otherwise the ", r("subspace_id"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("start"), " | ", hl_builtin("end")],
  //         },
  //         {
  //           id: "RangeRelativeRangeSubspaceEnd",
  //           name: "subspace_id_end",
  //           comment: [hl_builtin("start"), " if the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("end"), " if the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("r"), ", ", hl_builtin("open"), ", if the ", r("subspace_range"), " of ", code("t"), " is ", r("range_open", "open"), ", otherwise the ", r("subspace_id"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("start"), " | ", hl_builtin("end"), " | ", hl_builtin("open")],
  //         },
  //         {
  //           id: "RangeRelativeRangePathStartRelativeTo",
  //           name: "path_start_relative_to",
  //           comment: ["Whether the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " is encoded relative to the ", r("start_value"), " (", hl_builtin("start"), ") or ", r("end_value"), " (", hl_builtin("end"), ") of the ", r("path_range"), " of ", code("r"), "."],
  //           rhs: [hl_builtin("start"), " | ", hl_builtin("end")],
  //         },
  //         {
  //           id: "RangeRelativeRangePathPrefixStart",
  //           name: "start_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " and the value indicated by ", r("RangeRelativeRangePathStartRelativeTo"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeRelativeRangePathSuffixStart",
  //           name: "start_suffix",
  //           comment: ["The ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeRelativeRangePathPrefixStart"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeRelativeRangePathEndRelativeTo",
  //           name: "path_end_relative_to",
  //           comment: ["Whether the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " is encoded relative to the ", r("start_value"), " (", hl_builtin("start"), ") or to the ", r("end_value"), " (", hl_builtin("end"), ") of the ", r("path_range"), " of ", code("r"), ", or relative to the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " (", hl_builtin("self"), "), or whether the ", r("path_range"), " of ", code("t"), " is ", r("range_open", "open"), " (", hl_builtin("open"), ")."],
  //           rhs: [hl_builtin("start"), " | ", hl_builtin("end"), " | ", hl_builtin("self"), " | ", hl_builtin("open")],
  //         },
  //         {
  //           id: "RangeRelativeRangePathPrefixEnd",
  //           name: "end_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " and the value indicated by ", r("RangeRelativeRangePathEndRelativeTo"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeRelativeRangePathSuffixEnd",
  //           name: "end_suffix",
  //           comment: ["The ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeRelativeRangePathPrefixEnd"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeRelativeRangeTimeStartRelativeTo",
  //           name: "time_start_relative_to",
  //           comment: ["Whether the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), by subtracting a value from the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_minus"), "), by adding a value to the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), " | ", hl_builtin("start_minus"), " | ", hl_builtin("end_plus"), " | ", hl_builtin("end_minus")],
  //         },
  //         {
  //             id: "RangeRelativeRangeTimeStart",
  //             name: "time_start_difference",
  //             comment: ["The value to use according to ", r("RangeRelativeRangeTimeStartRelativeTo"), " to compute the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), "."],
  //             rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "RangeRelativeRangeTimeEndRelativeTo",
  //           name: "time_end_relative_to",
  //           comment: ["Whether the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), " (", hl_builtin("none"), "), or whether ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), by subtracting a value from the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_minus"), "), by adding a value to the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), " | ", hl_builtin("start_minus"), " | ", hl_builtin("end_plus"), " | ", hl_builtin("end_minus"), " | ", hl_builtin("none")],
  //         },
  //         {
  //             id: "RangeRelativeRangeTimeEnd",
  //             name: "time_end_difference",
  //             comment: ["The value to use according to ", r("RangeRelativeRangeTimeEndRelativeTo"), " to compute the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or ", hl_builtin("none"), " if the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), "."],
  //             rhs: [hl_builtin("u64"), " | ", hl_builtin("none")],
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "RangeInArea",
  //     comment: ["Describes a target ", r("3d_range"), " ", code("t"), " in a reference ", r("area"), " ", code("r"), " which fully contains ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "RangeInAreaSubspaceStart",
  //           name: "subspace_id_start",
  //           comment: [hl_builtin("none"), " if the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), " is equal to the ", r("subspace_id"), " of ", code("r"), ", ", hl_builtin("end"), ", otherwise the ", r("start_value"), " of the ", r("subspace_range"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("none"),],
  //         },
  //         {
  //           id: "RangeInAreaSubspaceEnd",
  //           name: "subspace_id_end",
  //           comment: [hl_builtin("none"), " if the ", r("subspace_range"), " of ", code("t"), " is ", r("open_range", "open"), ", otherwise the ", r("end_value"), " of the ", r("subspace_range"), " of ", code("t"), "."],
  //           rhs: [r("SubspaceId"), " | ", hl_builtin("none"),],
  //         },
  //         {
  //           id: "RangeInAreaPathPrefixStart",
  //           name: "start_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " and the ", r("path"), " of ", code("r"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeInAreaPathSuffixStart",
  //           name: "start_suffix",
  //           comment: ["The ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeInAreaPathPrefixStart"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeInAreaPathPrefixEnd",
  //           name: "end_prefix_length",
  //           comment: ["The length of the longest common prefix of the ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("path_range"), " of ", code("t"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "RangeInAreaPathSuffixEnd",
  //           name: "end_suffix",
  //           comment: ["The ", r("end_value"), " of the ", r("path_range"), " of ", code("t"), " without the first ", r("RangeInAreaPathPrefixEnd"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "RangeInAreaTimeStartRelativeTo",
  //           name: "time_start_relative_to",
  //           comment: ["Whether the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "), or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), " | ", hl_builtin("end_minus")],
  //         },
  //         {
  //             id: "RangeInAreaTimeStart",
  //             name: "time_start_difference",
  //             comment: ["The value to use according to ", r("RangeInAreaTimeStartRelativeTo"), " to compute the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), "."],
  //             rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "RangeInAreaTimeEndRelativeTo",
  //           name: "time_end_relative_to",
  //           comment: ["Whether the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), " (", hl_builtin("none"), "), or whether ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), " is obtained by adding a value to the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("start_plus"), "),  or by subtracting a value from the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " (", hl_builtin("end_minus"), ")."],
  //           rhs: [hl_builtin("start_plus"), hl_builtin("end_minus"), " | ", hl_builtin("none")],
  //         },
  //         {
  //             id: "RangeInAreaTimeEnd",
  //             name: "time_end_difference",
  //             comment: ["The value to use according to ", r("RangeInAreaTimeEndRelativeTo"), " to compute the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or ", hl_builtin("none"), " if the ", r("time_range"), " of ", code("t"), " is ", r("open_range", "open"), "."],
  //             rhs: [hl_builtin("u64"), " | ", hl_builtin("none")],
  //         },
  //     ],
  //   }),

  //   new Struct({
  //     id: "AreaInArea",
  //     comment: ["Describes a target ", r("area"), " ", code("t"), " in a reference ", r("area"), " ", code("r"), " which fully ", rs("area_include_area"), " ", code("t"), "."],
  //     fields: [
  //         {
  //           id: "AreaInAreaSubspace",
  //           name: "subspace_id",
  //           comment: ["The ", r("subspace_id"), " of ", code("t"), " if it differs from that of ", code("r"), ", otherwise nothing."],
  //           rhs: [hl_builtin("Option"), "<", r("SubspaceId"), ">"],
  //         },
  //         {
  //           id: "AreaInAreaPathPrefix",
  //           name: "prefix_length",
  //           comment: ["The length of the longest common prefix of the ", rs("path"), " of ", code("t"), " and ", code("r"), "."],
  //           rhs: [hl_builtin(r("ub"))],
  //         },
  //         {
  //           id: "AreaInAreaPathSuffix",
  //           name: "suffix",
  //           comment: ["The ", r("path"), " of ", code("t"), " without the first ", r("EntryRelativeEntryPathPrefix"), " bytes."],
  //           rhs: ["[", hl_builtin("u8"), "]"],
  //         },
  //         {
  //           id: "AreaInAreaTimeStartDifference",
  //           name: "time_start_difference",
  //           comment: ["The (numeric) difference between the ", r("start_value"), " of the ", r("time_range"), " of ", code("t"), " and the ", r("start_value"), " of the ", r("time_range"), " of ", code("r"), "."],
  //           rhs: hl_builtin("u64"),
  //         },
  //         {
  //           id: "AreaInAreaTimeEndDifference",
  //           name: "time_end_difference",
  //           comment: ["If ", code("r"), " has a ", r("closed_range", "closed"), " ", r("time_range"), ", this is the (numeric) difference between the ", r("end_value"), " of the ", r("time_range"), " of ", code("r"), " and the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ". If ", code("r"), " has an ", r("open_range", "open"), " ", r("time_range"), ", this is the ", r("end_value"), " of the ", r("time_range"), " of ", code("t"), ", or nothing if ", code("t"), " has an ", r("open_range", "open"), " ", r("time_range"), " as well."],
  //           rhs: [hl_builtin("Option"), "<", hl_builtin("u64"), ">"],
  //         },
  //     ],
  //   }),




  ),

    ]),
  ]),
]);
