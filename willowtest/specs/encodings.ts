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
  div,
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

export function two_bit_int(start_bit: number, value_to_encode: Expression, unless?: Expression): BitfieldRow {
  return new BitfieldRow(
    2,
    [
      unless ? [
        div(code("00"), " if ", unless, ", otherwise:"),
      ] : "",
      div(
        `Bit ${start_bit} is `, code("1"), " ", r("iff"), " ", code(function_call(r("compact_width"), value_to_encode)), " is ", code("4"), " or ", code("8"), ".",
      ),
      div(
        `Bit ${start_bit + 1} is `, code("1"), " ", r("iff"), " ", code(function_call(r("compact_width"), value_to_encode)), " is ", code("2"), " or ", code("8"), ".",
      ),
    ],
    [
      "2-bit integer ", code("n"), " such that ", code("2^n"), " gives ", code(function_call(r("compact_width"), value_to_encode)),
    ],
  );
}

export function zero_bits(number_of_bits: number): BitfieldRow {
  return new BitfieldRow(
    number_of_bits,
    [
      "always ", code("0"),
    ],
  );
}

export function inclusion_flag_remark(
  value_to_include: Expression,
): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      return ["Encode ", args[0], "?"];
    },
  );
  return new Invocation(macro, [value_to_include]);
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
          "for every ", def_value({id: "enc_s", singular: "s"}), " in ", r("encS"), " and every bytestring ", def_value({id: "enc_b", singular: "b"}), " that starts with ", code(function_call(r("encode_s"), r("enc_s"))), ", we have ", $comma([r$("decode_s"), "(", r$("enc_b"), ") = ", r$("enc_s"), ""]), " and",
        ],
        [
          "for every ", def_value({id: "enc_s2", singular: "s"}), " in ", r("encS"), " and every bytestring ", def_value({id: "enc_b2", singular: "b"}), " that does not start with ", code(function_call(r("encode_s"), r("enc_s"))), ", we have ", $dot([r$("decode_s"), "(", r$("enc_b2"), ") \\neq ", r$("enc_s2"), ""]),
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

    pinformative(
      "To encode small numbers with fewer bytes than large numbers, we define for any ", r("U64"), " ",
      def_value({ id: "compact_width_n", singular: "n" }), " the value ",
      code(function_call(def_fn({id: "compact_width", math: "compact\\_width"}), r("compact_width_n"))),
      " as", lis(
        [$comma("1"), " if ", $comma([r$("compact_width_n"), " < 256"]), " or"],
        [$comma("2"), " if ", $comma([r$("compact_width_n"), " < 256^2"]), " or"],
        [$comma("4"), " if ", $comma([r$("compact_width_n"), " < 256^4"]), " or"],
        [$comma("8"), " otherwise."],
      ),
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

      hsection("enc_path", code("encode_path"), [
        pinformative(
          "To encode a ", r("Path"), " ", def_value({ id: "enc_path_p", singular: "p" }), ", we define ", code(function_call(def_fn({id: "encode_path", math: "encode\\_path"}), r("enc_path_p"))), " as the concatenation of", lis(
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
      ]),

      hsection("enc_entry", code("encode_entry"), [
        pinformative(
          "To encode an ", r("Entry"), " ", def_value({ id: "enc_entry_e", singular: "e" }), ", let ",
          def_fn({id: "encode_namespace_id", math: "encode\\_namespace\\_id"}), " be an ", r("encoding_function"), " for ", r("NamespaceId"), ", let ",
          def_fn({id: "encode_subspace_id", math: "encode\\_subspace\\_id"}), " be an ", r("encoding_function"), " for ", r("SubspaceId"), ", and let ",
          def_fn({id: "encode_payload_digest", math: "encode\\_payload\\_digest"}), " be an ", r("encoding_function"), " for ", r("PayloadDigest"),
          ". We then define ",
          code(function_call(def_fn({id: "encode_entry", math: "encode\\_entry"}), r("enc_entry_e"))),
          " as the concatenation of:",
          
          encodingdef(
            [[
              code(function_call(
                r("encode_namespace_id"),
                field_access(r("enc_entry_e"), "entry_namespace_id"),
              )),
            ]],
            [[
              code(function_call(
                r("encode_subspace_id"),
                field_access(r("enc_entry_e"), "entry_subspace_id"),
              )),
            ]],
            [[
              code(function_call(
                r("encode_path"),
                field_access(r("enc_entry_e"), "entry_path"),
              )),
            ]],
            [[
              field_access(r("enc_entry_e"), "entry_timestamp"), ", encoded as a big-endian ", r("U64"),
            ]],
            [[
              field_access(r("enc_entry_e"), "entry_payload_length"), ", encoded as a big-endian ", r("U64"),
            ]],
            [[
              code(function_call(
                r("encode_payload_digest"),
                field_access(r("enc_entry_e"), "entry_payload_digest"),
              )),
            ]],
          ),
        ),
      ]),

    ]),

    hsection("relativity", "Relativity", [
      pinformative(
        "When encoding Willow objects, we can often achieve smaller encoding sizes by encoding how some object differs from another. In this section, we define several such relative encodings.",
      ),

      pinformative(
        "In all subsequent definitions, whenever the value ", r("range_open"), " is part of a numeric computation or comparison, it should be treated as a very large number, say, ", $dot("2^{9999}"),
        " The definitions all ensure that the resulting values never have to be encoded.",
      ),

      hsection("enc_path_relative", code("encode_path_relative"), [
        pinformative(
          "To encode a ", r("Path"), " ",
          def_value({ id: "relative_path_primary", singular: "p" }),
          " relative to a reference ", r("Path"), " ",
          def_value({ id: "relative_path_reference", singular: "ref" }),
          ", we define ",
          code(function_call(
            def_fn({id: "encode_path_relative", math: "encode\\_path\\_relative"}),
            r("relative_path_primary"),
            r("relative_path_reference"),
          )),
          " as the concatenation of:",
          
          encodingdef(
            [[
              "The length of the longest common ", r("path_prefix"), " of ", r("relative_path_primary"), " and ", r("relative_path_reference"),
              ", encoded as a ", r("UPathCountPower"), "."
            ]],
            [[
              r("encode_path"), " of the ", r("Path"), " obtained by removing that longest common prefix from ", r("relative_path_primary"), ".",
            ]],
          ),
        ),
          
      ]),

      hsection("enc_etry_relative_entry", code("encode_entry_relative_entry"), [
        pinformative("To encode an ", r("Entry"), " ", def_value({ id: "entry_rel_entry_primary", singular: "e" }), " relative to a reference ", r("Entry"), " ", def_value({ id: "entry_rel_entry_reference", singular: "ref" }), ", we first define ", def_value({id: "erele_time_difference", singular: "time_diff"}), " as the absolute value of ", code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " - ", field_access(r("entry_rel_entry_reference"), "entry_timestamp")), ". We then define ",
        code(function_call(def_fn({id: "encode_entry_relative_entry", math: "encode\\_entry\\_relative\\_entry"}), r("entry_rel_entry_primary"), r("entry_rel_entry_reference"))), " as the concatenation of:",

          encodingdef(
            new Bitfields(
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")),
                ],
                [
                  inclusion_flag_remark(field_access(r("entry_rel_entry_primary"), "entry_namespace_id")),
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")),
                ],
                [
                  inclusion_flag_remark(field_access(r("entry_rel_entry_primary"), "entry_subspace_id")),
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " - ", field_access(r("entry_rel_entry_reference"), "entry_timestamp"), " > 0"),
                ],
                [
                  "Add or subtract ", r("erele_time_difference"), " from ", field_access(r("entry_rel_entry_reference"), "entry_timestamp"), "?",
                ],
              ),
              zero_bits(1),
              two_bit_int(4, r("erele_time_difference")),
              two_bit_int(6, field_access(r("entry_rel_entry_primary"), "entry_payload_length")),
            ),
            [
              [
                code(function_call(
                  r("encode_namespace_id"),
                  field_access(r("entry_rel_entry_primary"), "entry_namespace_id"),
                )), ",  or the empty string, if ",
                code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")),
              ],
            ],
            [
              [
                code(function_call(
                  r("encode_subspace_id"),
                  field_access(r("entry_rel_entry_primary"), "entry_subspace_id"),
                )), ",  or the empty string, if ",
                code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")),
              ],
            ],
            [
              [
                code(function_call(
                  r("encode_path_relative"),
                  field_access(r("entry_rel_entry_primary"), "entry_path"),
                  field_access(r("entry_rel_entry_reference"), "entry_path"),
                )),
              ],
            ],
            [
              [
                r("erele_time_difference"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), r("erele_time_difference"))), "-byte integer",
              ],
            ],
            [
              [
                field_access(r("entry_rel_entry_primary"), "entry_payload_length"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length"))), "-byte integer",
              ],
            ],
            [
              [
                code(function_call(
                  r("encode_payload_digest"),
                  field_access(r("entry_rel_entry_primary"), "entry_payload_digest"),
                )),
              ],
            ],
          ),      
        ),
      ]),

      hsection("enc_entry_in_namespace_area", code("encode_entry_in_namespace_area"), [
        pinformative(
          preview_scope(
            "To encode an ", r("Entry"), " ", def_value({ id: "eia_inner", singular: "e" }), " that is ", r("area_include", "included"), " in an outer ", r("Area"), " ", def_value({ id: "eia_outer", singular: "out" }), " in a ", r("namespace"), " of ", r("NamespaceId"), " ", def_value({id: "eia_namespace_id", singular: "namespace_id"}), ", we first define ", def_value({ id: "eia_time", singular: "time_diff" }), " as the minimum of ",
            code(
              field_access(r("eia_inner"), "entry_timestamp"),
              " - ",
              field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
            ),
            " and ",
            code(
              field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
              " - ",
              field_access(r("eia_inner"), "entry_timestamp"),
            ),
            ". We then define ",
            code(function_call(def_fn({id: "encode_entry_in_namespace_area", math: "encode\\_enrty\\_in\\_namespace\\_area"}), r("eia_inner"), r("eia_outer"), r("eia_namespace_id"))), " as the concatenation of:",

            encodingdef(
              new Bitfields(
                new BitfieldRow(
                  1,
                  [
                    code("1"), " ", r("iff"), " ",
                    code(field_access(r("eia_outer"), "AreaSubspace"), " == ", r("area_any")),
                  ],
                  [
                    inclusion_flag_remark(field_access(r("eia_inner"), "entry_subspace_id")),
                  ],
                ),
                new BitfieldRow(
                  1,
                  [
                    code("1"), " ", r("iff"), " ",
                    code(
                      field_access(r("eia_inner"), "entry_timestamp"),
                      " - ",
                      field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
                      " <= ",
                      field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeEnd"),
                      " - ",
                      field_access(r("eia_inner"), "entry_timestamp"),
                    ),
                  ],
                  [
                    "Add ", r("eia_time"), " to ",
                    field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
                    ", or subtract from ",
                    field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeEnd"),
                    "?",
                  ],
                ),
                two_bit_int(2, r("eia_time")),
                two_bit_int(4, field_access(r("eia_inner"), "entry_payload_length")),
                zero_bits(2),
              ),
              [[
                code(function_call(
                  r("encode_subspace_id"),
                  field_access(r("eia_inner"), "entry_subspace_id"),
                )), ",  or the empty string, if ",
                code(field_access(r("eia_outer"), "AreaSubspace"), " != ", r("area_any")),
              ]],
              [[
                code(function_call(
                  r("encode_path_relative"),
                  field_access(r("eia_inner"), "entry_path"),
                  field_access(r("eia_outer"), "AreaPath"),
                )),
              ]],
              [[
                r("eia_time"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), r("eia_time"))), "-byte integer",
              ]],
              [[
                field_access(r("eia_inner"), "entry_payload_length"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("eia_inner"), "entry_payload_length"))), "-byte integer",
              ]],
              [[
                code(function_call(
                  r("encode_payload_digest"),
                  field_access(r("eia_inner"), "entry_payload_digest"),
                )),
              ]],
            ),
          ),
        ),
      ]),

      hsection("enc_entry_in_namespace_3drange", code("encode_entry_in_namespace_3drange"), [
        pinformative(
          preview_scope(
            "To encode an ", r("Entry"), " ", def_value({ id: "eir_inner", singular: "e" }), " that is ", r("3d_range_include", "included"), " in a ", r("3dRange"), " ", def_value({ id: "eir_outer", singular: "out" }), " in a ", r("namespace"), " of ", r("NamespaceId"), " ", def_value({id: "eir_namespace_id", singular: "namespace_id"}), ", we first define ", def_value({ id: "eir_time", singular: "time_diff" }), " as the minimum absolute value of ",
            code(
              field_access(r("eir_inner"), "entry_timestamp"),
              " - ",
              field_access(field_access(r("eir_outer"), "3dRangeTime"), "TimeRangeStart"),
            ),
            " and ",
            code(
              field_access(r("eir_inner"), "entry_timestamp"),
              " - ",
              field_access(field_access(r("eir_outer"), "3dRangeTime"), "TimeRangeEnd"),
            ),
            ". We then define ",
            code(function_call(def_fn({id: "encode_entry_in_namespace_3drange", math: "encode\\_enrty\\_in\\_namespace\\_3drange"}), r("eir_inner"), r("eir_outer"), r("eir_namespace_id"))), " as the concatenation of:",

            encodingdef(
              new Bitfields(
                new BitfieldRow(
                  1,
                  [
                    code("1"), " ", r("iff"), " ",
                    code(field_access(r("eir_inner"), "entry_subspace_id"), " == ", field_access(field_access(r("eir_outer"), "3dRangeSubspace"), "SubspaceRangeStart")),
                  ],
                  [
                    inclusion_flag_remark(field_access(r("eir_inner"), "entry_subspace_id")),
                  ],
                ),
                new BitfieldRow(
                  1,
                  [
                    code("1"), " ", r("iff"), " the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeEnd"),
                  ],
                  [
                    "Encode ", field_access(r("eir_inner"), "entry_path"), " relative to ", field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeStart"), " or to ", field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeEnd"), "?",
                  ],
                ),
                new BitfieldRow(
                  1,
                  [
                    code("1"), " ", r("iff"), " ",
                    code(r("eir_time"), " == ", function_call("abs", [
                      field_access(r("eir_inner"), "entry_timestamp"),
                      " - ",
                      field_access(field_access(r("eir_outer"), "3dRangeTime"), "TimeRangeStart"),
                  ])),
                  ],
                  [
                    "Combine ", r("eir_time"), " with ",
                    field_access(field_access(r("eir_outer"), "3dRangeTime"), "TimeRangeStart"),
                    ", or with ",
                    field_access(field_access(r("eir_outer"), "3dRangeTime"), "TimeRangeEnd"),
                    "?",
                  ],
                ),
                new BitfieldRow(
                  1,
                  [
                    code("1"), " ", r("iff"), "  bit 2 is ", code("1"), " and ", code(field_access(r("eir_inner"), "entry_timestamp"), " >= ", field_access(field_access(r("eir_outer"), "3dRangeTime"), "TimeRangeStart")), ", or ",
                    " bit 2 is ", code("0"), " and ", code(field_access(r("eir_inner"), "entry_timestamp"), " <= ", field_access(field_access(r("eir_outer"), "3dRangeTime"), "TimeRangeEnd")), ".",
                  ],
                  [
                    "Add or subtract ", r("eir_time"), "?",
                  ],
                ),
                two_bit_int(4, r("eir_time")),
                two_bit_int(6, field_access(r("eir_inner"), "entry_payload_length")),
              ),
              [[
                code(function_call(
                  r("encode_subspace_id"),
                  field_access(r("eir_inner"), "entry_subspace_id"),
                )), ",  or the empty string, if ",
                code(field_access(r("eir_inner"), "entry_subspace_id"), " == ", field_access(field_access(r("eir_outer"), "3dRangeSubspace"), "SubspaceRangeStart"))
              ]],
              [[
                code(function_call(
                  r("encode_path_relative"),
                  field_access(r("eir_inner"), "entry_path"),
                  field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeStart"),
                  )),
                " if the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeEnd"), ", otherwise ",
                code(function_call(
                  r("encode_path_relative"),
                  field_access(r("eir_inner"), "entry_path"),
                  field_access(field_access(r("eir_outer"), "3dRangePath"), "PathRangeEnd"),
                )),
              ]],
              [[
                r("eir_time"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), r("eir_time"))), "-byte integer",
              ]],
              [[
                field_access(r("eir_inner"), "entry_payload_length"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), field_access(r("eir_inner"), "entry_payload_length"))), "-byte integer",
              ]],
              [[
                code(function_call(
                  r("encode_payload_digest"),
                  field_access(r("eir_inner"), "entry_payload_digest"),
                )),
              ]],
            ),
          ),
        ),
      ]),

      hsection("enc_area_in_area", code("encode_area_in_area"), [
        pinformative(
          preview_scope(
            "To encode an ", r("Area"), " ", def_value({ id: "area_in_area_inner", singular: "a" }), " that is ", r("area_include_area", "included"), " in an outer ", r("Area"), " ", def_value({ id: "area_in_area_outer", singular: "out" }), ", we first define ", def_value({ id: "aia_start", singular: "start_diff" }), " as the minimum of ",
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
              field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart"),
            ),
            " and ",
            code(
              field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
              " - ",
              field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"),
            ),
          ),
          ". We then define ",
          code(function_call(def_fn({id: "encode_area_in_area", math: "encode\\_area\\_in\\_area"}), r("area_in_area_inner"), r("area_in_area_outer"))), " as the concatenation of:",

          encodingdef(
            new Bitfields(
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(field_access(r("area_in_area_inner"), "AreaSubspace"), " != ", field_access(r("area_in_area_outer"), "AreaSubspace")),
                ],
                [
                  inclusion_flag_remark(field_access(r("area_in_area_inner"), "AreaSubspace")),
                ]
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")),
                ],
                [
                  inclusion_flag_remark([r("end_value"), " of ", field_access(r("area_in_area_inner"), "AreaTime")]),
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(r("aia_start"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart"),
                  " - ", field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart")),
                ],
                [
                  "Add ", r("aia_start"), " to ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart"),
                  ", or subtract from ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
                  "?",
                ]
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(r("aia_end"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"),
                  " - ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeStart")),
                ],
                [
                  "Add ", r("aia_end"), " to ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart"),
                  ", or subtract from ",
                  field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
                  "?",
                ],
              ),
              two_bit_int(4, r("aia_start")),
              two_bit_int(6, r("aia_end")),
            ),
            [[
              code(function_call(
                r("encode_subspace_id"),
                field_access(r("area_in_area_inner"), "AreaSubspace"),
                )), ",  or the empty string, if ",
                code(field_access(r("area_in_area_inner"), "AreaSubspace"), " == ", field_access(r("area_in_area_outer"), "AreaSubspace")),
              ]],
            [[
              code(function_call(
                r("encode_path_relative"),
                field_access(r("area_in_area_inner"), "AreaPath"),
                field_access(r("area_in_area_outer"), "AreaPath"),
              )),
            ]],
            [[
              r("aia_start"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), r("aia_start"))), "-byte integer",
            ]],
            [[
              r("aia_end"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), r("aia_end"))), "-byte integer, or the empty string, if ",
              code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")),
            ]],
          ),
        ),
      ]),

      hsection("enc_3d_range_relative_3d_range", code("encode_3drange_relative_3drange"), [
        pinformative(
          preview_scope(
            "To encode a ", r("3dRange"), " ", def_value({ id: "3dr3d_primary", singular: "r" }), " relative to a reference ", r("3dRange"), " ", def_value({ id: "3dr3d_reference", singular: "ref" }), ", we first define ", lis(
              [def_value({ id: "3dr3d_s2s", singular: "start_to_start" }), " as the absolute value of ", code(
                field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeStart"),
                " - ",
                field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeStart"),
              ), ","],
              [def_value({ id: "3dr3d_s2e", singular: "start_to_end" }), " as the absolute value of ", code(
                field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeStart"),
                " - ",
                field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeEnd"),
              ), ","],
              [def_value({ id: "3dr3d_e2s", singular: "end_to_start" }), " as the absolute value of ", code(
                field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"),
                " - ",
                field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeStart"),
              ), ","],
              [def_value({ id: "3dr3d_e2e", singular: "end_to_end" }), " as the absolute value of ", code(
                field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"),
                " - ",
                field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeEnd"),
              ), ","],
              [def_value({ id: "3dr3d_start_diff", singular: "start_time_diff" }), " as the minimum of ", r("3dr3d_s2s"), " and ", r("3dr3d_s2e"), ", and"],
              [def_value({ id: "3dr3d_end_diff", singular: "end_time_diff" }), " as the minimum of ", r("3dr3d_e2s"), " and ", r("3dr3d_e2e"), "."],
            ),
          ),
          "We then define ",
          code(function_call(def_fn({id: "encode_3drange_relative_3drange", math: "encode\\_3drange\\_relative\\_3drangearea"}), r("3dr3d_primary"), r("3dr3d_reference"))), " as the concatenation of:",

          encodingdef(
            new Bitfields(
              new BitfieldRow(
                2,
                [
                  div(
                    code("01"), " if ",
                    code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeStart")), ",",
                  ),
                  div(
                    code("10"), " if ",
                    code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeEnd")), ",",
                  ),
                  div(
                    code("11"), " otherwise.",
                  ),
                ],
                [
                  "Encode ", field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeStart"), "?"
                ],
              ),
              new BitfieldRow(
                2,
                [
                  div(
                    code("00"), " if ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"), " == ", r("range_open")), ", and else "
                  ),
                  div(
                    code("01"), " if ",
                    code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeStart")), ",",
                  ),
                  div(
                    code("10"), " if ",
                    code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeEnd")), ",",
                  ),
                  div(
                    code("10"), " otherwise.",
                  ),
                ],
                [
                  "Encode ", field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"), "?"
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeStart"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeStart"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"),
                ],
                [
                  "Encode ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeStart"), " relative to ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"), " or to ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"), "?",
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ", code(field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " == ", r("range_open")),
                ],
              ),
              new BitfieldRow(
                1,
                [
                  div(
                    code("0"), " if ", code(field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " == ", r("range_open")), ", otherwise "
                  ),
                  div(
                    code("1"), " ", r("iff"), " the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"),
                  ),
                ],
                [
                  "Encode ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " relative to ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"), " or to ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"), " (if at all)?",
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"), " == ", r("range_open")),
                ],
              ),  
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(r("3dr3d_s2s"), " <= ", r("3dr3d_s2e")),
                ],
                [
                  "Encode ", field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeStart"), " relative to ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeStart"), " or ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeEnd"), "?",
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " bit 8 is ", code("1"), " and ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeStart"), " >= ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeStart")), ", or ",
                  " bit 8 is ", code("0"), " and ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeStart"), " >= ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeEnd")), ".",
                ],
                [
                  "Add or subtract ", r("3dr3d_start_diff"), "?",
                ],
              ),
              two_bit_int(10, r("3dr3d_start_diff")),
              new BitfieldRow(
                1,
                [
                  div(
                    code("0"), " if ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"), " == ", r("range_open")), ", otherwise "
                  ),
                  div(
                    code("1"), " ", r("iff"), " ",
                    code(r("3dr3d_e2s"), " <= ", r("3dr3d_e2e")),
                  ),
                ],
                [
                  "Encode ", field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"), " relative to ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeStart"), " or ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeEnd"), " (if at all)?",
                ],
              ),
              new BitfieldRow(
                1,
                [
                  div(
                    code("0"), " if ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"), " == ", r("range_open")), ", otherwise "
                  ),
                  div(
                    code("1"), " ", r("iff"), " bit 12 is ", code("1"), " and ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"), " >= ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeStart")), ", or ",
                    " bit 12 is ", code("0"), " and ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"), " >= ", field_access(field_access(r("3dr3d_reference"), "3dRangeTime"), "TimeRangeEnd")), ".",
                  ),
                ],
                [
                  "Add or subtract ", r("3dr3d_end_diff"), " (if encoding it at all)?",
                ],
              ),
              two_bit_int(14, r("3dr3d_end_diff"), code(field_access(field_access(r("3dr3d_primary"), "3dRangeTime"), "TimeRangeEnd"), " == ", r("range_open"))),
            ),
            [[
              code(function_call(r("encode_subspace_id"), field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeStart"))),
              ", or the empty string if ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeStart")),
              " or ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeEnd")),
            ]],
            [[
              code(function_call(r("encode_subspace_id"), field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"))),
              ", or the empty string if ",
              code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"), " == ", r("range_open")),
              ", ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeStart")),
              " or ", code(field_access(field_access(r("3dr3d_primary"), "3dRangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("3dr3d_reference"), "3dRangeSubspace"), "SubspaceRangeEnd")),
            ]],
            [[
              code(function_call(
                r("encode_path_relative"),
                field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeStart"),
                field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"),
              )),
              " if the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeStart"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeStart"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"), ", otherwise ",
              code(function_call(
                r("encode_path_relative"),
                field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeStart"),
                field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"),
                )),
            ]],
            [[
              div(
                "the empty string if ", code(field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " == ", r("range_open")), ", otherwise:",
              ),
              div(
                code(function_call(
                  r("encode_path_relative"),
                  field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"),
                  field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"),
                )),
                " if the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"), ", otherwise ",
                code(function_call(
                  r("encode_path_relative"),
                  field_access(field_access(r("3dr3d_primary"), "3dRangePath"), "PathRangeEnd"),
                  field_access(field_access(r("3dr3d_reference"), "3dRangePath"), "PathRangeEnd"),
                )),
              ),
            ]],
            [[
              r("3dr3d_start_diff"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), r("3dr3d_start_diff"))), "-byte integer",
            ]],
            [[
              r("3dr3d_end_diff"), ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), r("3dr3d_end_diff"))), "-byte integer, or the empty string, if ",
              code(field_access(field_access(r("3dr3d_end_diff"), "3dRangeTime"), "TimeRangeEnd"), " == ", r("range_open")),
            ]],
          ),
        ),
      ]),

    ]),
  ]),
]);
