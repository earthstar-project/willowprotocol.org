import {
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
import { def_type, field_access, function_call } from "../../pseudocode.ts";
import { $comma, $dot, $ } from "../../katex.ts";
import { surpress_output } from "../../tsgen.ts";

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
          "To encode an ", r("Area"), " ",
          def_value({ id: "area_in_area_inner", singular: "inner" }),
          " that is ", r("area_include_area", "included"), " in another ", r("Area"),
          " ",
          def_value({ id: "area_in_area_outer", singular: "outer" }),
          ", we first define ",
          def_value({ id: "aia_start", singular: "start_diff" }),
          " as the minimum of ",
          code(
            field_access(
              field_access(r("area_in_area_inner"), "AreaTime"),
              "TimeRangeStart",
            ),
            " - ",
            field_access(
              field_access(r("area_in_area_outer"), "AreaTime"),
              "TimeRangeStart",
            ),
          ),
          " and ",
          code(
            field_access(
              field_access(r("area_in_area_outer"), "AreaTime"),
              "TimeRangeEnd",
            ),
            " - ",
            field_access(
              field_access(r("area_in_area_inner"), "AreaTime"),
              "TimeRangeStart",
            ),
          ),
          ", and we define ",
          def_value({ id: "aia_end", singular: "end_diff" }),
          " as the minimum of ",
          code(
            field_access(
              field_access(r("area_in_area_inner"), "AreaTime"),
              "TimeRangeEnd",
            ),
            " - ",
            field_access(
              field_access(r("area_in_area_inner"), "AreaTime"),
              "TimeRangeStart",
            ),
          ),
          " and ",
          code(
            field_access(
              field_access(r("area_in_area_outer"), "AreaTime"),
              "TimeRangeEnd",
            ),
            " - ",
            field_access(
              field_access(r("area_in_area_inner"), "AreaTime"),
              "TimeRangeEnd",
            ),
          ),
        ),
        ". We then define ",
        function_call(
          def_fn({id: "encode_area_in_area", math: "encode\\_area\\_in\\_area"}),
          r("area_in_area_inner"),
          r("area_in_area_outer"),
        ),
        " as the concatenation of",
        lis(
          [
            "a byte whose bits are set as follows (bit 0 is the most significant bit, bit 7 the least significant):",
            ul(
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the main encoding has to include the ",
                  r("end_value"),
                  " of ",
                  field_access(r("area_in_area_inner"), "AreaTime"),
                  ".",
                ]),
                "Bit 0 is set to ",
                code("1"),
                " if ",
                code(
                  field_access(
                    field_access(r("area_in_area_inner"), "AreaTime"),
                    "TimeRangeEnd",
                  ),
                  " == ",
                  r("range_open"),
                ),
                " and to ",
                code("0"),
                " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the main encoding has to include ",
                  field_access(r("area_in_area_inner"), "AreaSubspace"),
                  ".",
                ]),
                "Bit 1 is set to ",
                code("1"),
                " if ",
                code(
                  field_access(r("area_in_area_inner"), "AreaSubspace"),
                  " != ",
                  field_access(r("area_in_area_outer"), "AreaSubspace"),
                ),
                " and to ",
                code("0"),
                " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the encoding of ",
                  r("aia_start"),
                  " must be added to ",
                  field_access(
                    field_access(r("area_in_area_outer"), "AreaTime"),
                    "TimeRangeStart",
                  ),
                  " or subtracted from ",
                  field_access(
                    field_access(r("area_in_area_outer"), "AreaTime"),
                    "TimeRangeEnd",
                  ),
                  ".",
                ]),
                "Bit 2 is set to ",
                code("1"),
                " if ",
                code(
                  r("aia_start"),
                  " == ",
                  field_access(
                    field_access(r("area_in_area_inner"), "AreaTime"),
                    "TimeRangeStart",
                  ),
                  " - ",
                  field_access(
                    field_access(r("area_in_area_outer"), "AreaTime"),
                    "TimeRangeStart",
                  ),
                ),
                " and to ",
                code("0"),
                " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "This flag indicates whether the encoding of ",
                  r("aia_end"),
                  " must be added to ",
                  field_access(
                    field_access(r("area_in_area_inner"), "AreaTime"),
                    "TimeRangeStart",
                  ),
                  " or subtracted from ",
                  field_access(
                    field_access(r("area_in_area_outer"), "AreaTime"),
                    "TimeRangeEnd",
                  ),
                  ".",
                ]),
                "Bit 3 is set to ",
                code("1"),
                " if ",
                code(
                  r("aia_end"),
                  " == ",
                  field_access(
                    field_access(r("area_in_area_inner"), "AreaTime"),
                    "TimeRangeEnd",
                  ),
                  " - ",
                  field_access(
                    field_access(r("area_in_area_inner"), "AreaTime"),
                    "TimeRangeStart",
                  ),
                ),
                " and to ",
                code("0"),
                " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "Bits 4 and 5 form a 2-bit integer ",
                  code("n"),
                  " such that ",
                  code("2^n"),
                  " is the ",
                  r("compact_width"),
                  " for the ",
                  r("TimeRange"),
                  " ",
                  r("start_value"),
                  ".",
                ]),
                "Bit 4 is set to ",
                code("1"),
                " if ",
                function_call(r("compact_width"), r("aia_start")),
                " is ",
                code("4"),
                " or ",
                code("8"),
                ", and to ",
                code("0"),
                " otherwise,",
              ),
              li(
                "Bit 5 is set to ",
                code("1"),
                " if ",
                function_call(r("compact_width"), r("aia_start")),
                " is ",
                code("2"),
                " or ",
                code("8"),
                ", and to ",
                code("0"),
                " otherwise,",
              ),
              li(
                { style: "clear: right;" },
                marginale([
                  "Bit 6 and 7 form a 2-bit integer ",
                  code("n"),
                  " such that ",
                  code("2^n"),
                  " is the ",
                  r("compact_width"),
                  " for the ",
                  r("TimeRange"),
                  " ",
                  r("end_value"),
                  ".",
                ]),
                "Bit 6 is set to ",
                code("1"),
                " if ",
                function_call(r("compact_width"), r("aia_end")),
                " is ",
                code("4"),
                " or ",
                code("8"),
                ", and to ",
                code("0"),
                " otherwise,",
              ),
              li(
                "Bit 7 is set to ",
                code("1"),
                " if ",
                function_call(r("compact_width"), r("aia_end")),
                " is ",
                code("2"),
                " or ",
                code("8"),
                ", and to ",
                code("0"),
                " otherwise,",
              ),
            ),
          ],
          [
            r("aia_start"),
            ", encoded as an unsigned, big-endian ",
            function_call(r("compact_width"), r("aia_start")),
            "-byte integer,",
          ],
          [
            r("aia_end"),
            ", encoded as an unsigned, big-endian ",
            function_call(r("compact_width"), r("aia_end")),
            "-byte integer, or the empty string, if ",
            code(
              field_access(
                field_access(r("area_in_area_inner"), "AreaTime"),
                "TimeRangeEnd",
              ),
              " == ",
              r("range_open"),
            ),
            ",",
          ],
          [
            function_call(
              r("encode_path_relative"),
              field_access(r("area_in_area_inner"), "AreaPath"),
              field_access(r("area_in_area_outer"), "AreaPath"),
            ),
            ",",
          ],
          [
            function_call(
              r("encode_subspace_id"),
              field_access(r("area_in_area_inner"), "AreaSubspace"),
            ),
            ",  or the empty string, if ",
            code(
              field_access(r("area_in_area_inner"), "AreaSubspace"),
              " == ",
              field_access(r("area_in_area_outer"), "AreaSubspace"),
            ),
            ".",
          ],
        ),
      ),
    ]),
  ]),
]);

/*

*/
