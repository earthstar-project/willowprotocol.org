import {
def_fn,
  def_value,
  link,
  lis,
  pinformative,
  quotes,
  site_template,
  sky_blue,
} from "../main.ts";
import {
  Attributes,
  code,
  div,
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
import { Rs, def, preview_scope, r, r$, rs } from "../../defref.ts";
import { asset } from "../../out.ts";
import { marginale, sidenote } from "../../marginalia.ts";
import { Expression, Invocation, new_macro } from "macro";
import { hsection, table_of_contents } from "../../hsection.ts";
import { def_type, field_access, function_call } from "../../pseudocode.ts";
import { $comma, $dot, $ } from "../../katex.ts";
import { surpress_output } from "../../tsgen.ts";
import { BitfieldRow, Bitfields, encodingdef } from "../encodingdef.ts";
import { link_name } from "../../linkname.ts";

export function small_img(
  src: Expression,
  alt: Expression,
  attributes: Attributes = {},
): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      const mergedStyle = attributes.style
        ? `height: 32px;${attributes.style}`
        : "height: 32px";

      return img(args[0], alt, { ...attributes, style: mergedStyle });
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
      unless ? "ignored, or " : "", "2-bit integer ", code("n"), " such that ", code("2^n"), " gives ", code(function_call(r("compact_width"), value_to_encode)),
    ],
  );
}

export function two_bit_int_explicit(start_bit: number, id: string): BitfieldRow {
  return new BitfieldRow(
    2,
    [
      div(
        `Bit ${start_bit} is `, code("1"), " ", r("iff"), " ", r(id), " is ", code("4"), " or ", code("8"), ".",
      ),
      div(
        `Bit ${start_bit + 1} is `, code("1"), " ", r("iff"), " ", r(id), " is ", code("2"), " or ", code("8"), ".",
      ),
    ],
  );
}

export function two_bit_int_def(start_bit: number, value_to_encode: Expression, unless?: Expression): Expression {
  return [
      unless ? [
        div(code("00"), " if ", unless, ", otherwise:"),
      ] : "",
      div(
        `Bit ${start_bit} is `, code("1"), " ", r("iff"), " ", code(function_call(r("compact_width"), value_to_encode)), " is ", code("4"), " or ", code("8"), ".",
      ),
      div(
        `Bit ${start_bit + 1} is `, code("1"), " ", r("iff"), " ", code(function_call(r("compact_width"), value_to_encode)), " is ", code("2"), " or ", code("8"), ".",
      ),
    ];
}

export function encode_two_bit_int(
  int_exp: Expression,
  exception?: Expression,
): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      return [
        args[0], ", encoded as an unsigned, big-endian ", code(function_call(r("compact_width"), args[0])), "-byte integer",
        args.length === 2
          ? [", or the empty string, if ", args[1]]
          : "",
      ];
    },
  );
  return new Invocation(macro, exception ? [int_exp, exception] : [int_exp]);
}

export function encode_int_width(
  int_exp: Expression,
  width_id: string,
  exception?: Expression,
): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      return [
        args[0], ", encoded as an unsigned, big-endian ", r(width_id), "-byte integer",
        args.length === 2
          ? [", or the empty string, if ", args[1]]
          : "",
      ];
    },
  );
  return new Invocation(macro, exception ? [int_exp, exception] : [int_exp]);
}

export function zero_bits(number_of_bits: number): BitfieldRow {
  return new BitfieldRow(
    number_of_bits,
    [
      "always ", code("0"),
    ],
  );
}

export function arbitrary_bits(number_of_bits: number): BitfieldRow {
  return new BitfieldRow(
    number_of_bits,
    [
      "arbitrary"
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

export function choose_width(
  def: Expression,
  min: Expression,
): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      return [args[0], " is 1, 2, 4, or 8, but at least ", code(function_call(r("compact_width"), args[1]))];
    },
  );
  return new Invocation(macro, [def, min]);
}

export const encodings: Expression = site_template({
  name: "encodings",
  title: "On Encodings",
  status: "proposal",
  status_date: "17.01.2024",
}, [
  em("Those encodings referenced from the ", link_name("meadowcap", "Meadowcap specification"), " have status ", sky_blue(r("status_candidate")), "."),

  pinformative(
    "A perhaps curious feature of the Willow data model is that its specifications rarely talk about encodings. ",
    sidenote("We", ["Let’s be honest: ", r("Aljoscha")]),
    " strongly believe that specifications should concern themselves with purely logical data types as long as possible, treating encodings as a minor and ultimately interchangeable detail. When specifications define concepts in terms of their encodings, results usually end up miserably underspecified (see ", link("JSON", "https://en.wikipedia.org/wiki/JSON#Interoperability"), ") or full of incidental complexity (see ", link("XML", "https://en.wikipedia.org/wiki/XML"), ").",
  ),

  pinformative(
    "Nevertheless, protocols that deal with persistent storage and network transmissions eventually have to serialise data. In this document, we give both some generic definitions around arbitrary encodings, and some specific encodings that recur throughout the Willow family of specifications.",
  ),
  
  table_of_contents(7),

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
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/checkmark.png"), "An affirmative checkmark.")),
              ),
            ),
            tbody(
              tr(
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td(code(quotes("turtle"), " | ", quotes("tortoise"))),
                td(small_img(asset("encoding/cross.png"), "A rejective cross.")),
              ),
            ),
            tbody(
              tr(
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td(small_img(asset("encoding/questionmark.png"), "An undecided questionmark.")),
                td(small_img(asset("encoding/cross.png"), "A rejective cross.")),
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
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td(
                  { rowspan: "2" },
                  small_img(asset("encoding/checkmark.png"), "An affirmative checkmark."),
                ),
              ),
              tr(
                td(code(quotes("tortoise"))),
                td(small_img(asset("encoding/questionmark.png"), "An undecided questionmark.")),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td({ rowspan: "2" }, small_img(asset("encoding/cross.png"), "A rejective cross.")),
              ),
              tr(
                td(code(quotes("tortoise"))),
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
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
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td(
                  { rowspan: "2" },
                  small_img(asset("encoding/checkmark.png"), "An affirmative checkmark."),
                ),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td({ rowspan: "2" }, small_img(asset("encoding/cross.png"), "A rejective cross.")),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("encoding/questionmark.png"), "An undecided questionmark.")),
              ),
            ),
            tbody(
              tr(
                td(code(quotes("turtle"))),
                td(small_img(asset("encoding/turtle.png"), "A turtle.")),
                td({ rowspan: "2" }, small_img(asset("encoding/cross.png"), "A rejective cross.")),
              ),
              tr(
                td(code(quotes("turtleneck"))),
                td(small_img(asset("encoding/turtleneck.png"), "A cosy turtleneck sweater. Not the neck of a turtle."),),
              ),
            ),
          ),
          figcaption("Desired behaviour for ", r(`decode_animal`), "."),
        ),
      ],
    ),

    pinformative(
      Rs("encoding_function"), " enforce a one-to-one mapping between values and their encodings. Sometimes, this strict requirement can hinder performance: when there are several natural ways of encoding values, then forcing a decoder to reject all but one of those ways causes extra overhead. For these situations, we define the notion of an ", r("encoding_relation"), ":"
    ),

    pinformative(
      "An ", def({ id: "encoding_relation", singular: "encoding relation" }), " is a ", link("binary relation", "https://en.wikipedia.org/wiki/Binary_relation"), " on some set ", def_type({id: "relS", singular: "S"}), " and the set of bytestrings, such that:", lis(
        [
          "for every ", def_value({id: "rel_s", singular: "s"}), " in ", r("relS"), ", there is at least one bytestring in relation with ", r("rel_s"), ", and",
        ],
        [
          "no bytestring in the relation is a prefix of another bytestring in the relation."
        ],
      ),
    ),

    pinformative(
      "We usually define an ", r("encoding_relation"), " first, and then deine a specific subset of it that is an ", r("encoding_functions"), ". Even in places where we use the ", em("relation"), ", we recommend that implementations of encoders use the corresponding ", em("function"), ". The decoders in those places, however, must be able to decode any possible encoding from the ", r("encoding_relation"), "."
    ),
  ]),

  hsection("specific_encodings", "Encoding Techniques", [
    pinformative(
      "We now prepare to define some specific encodings for several datatypes of Willow.",
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
  ]),

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

    hsection("enc_path", {short_title: "path"}, code("encode_path"), [
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

    hsection("enc_entry", {short_title: "entry"}, code("encode_entry"), [
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

    hsection("enc_path_relative", {short_title: "path_relative_path"}, code("encode_path_relative_path"), [
      pinformative(
        "To encode a ", r("Path"), " ",
        def_value({ id: "relative_path_primary", singular: "p" }),
        " relative to a reference ", r("Path"), " ",
        def_value({ id: "relative_path_reference", singular: "ref" }),
        ", we define ",
        code(function_call(
          def_fn({id: "encode_path_relative_path", math: "encode\\_path\\_relative"}),
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

    hsection("enc_etry_relative_entry", {short_title: "entry_relative_entry"}, code("encode_entry_relative_entry"), [
      pinformative(
        "We define an ", r("encoding_relation"), " ", def_type("EntryRelativeEntry"), " for encoding an ", r("Entry"), " ", def_value({ id: "entry_rel_entry_primary", singular: "e" }), " relative to a reference ", r("Entry"), " ", def_value({ id: "entry_rel_entry_reference", singular: "ref" }), ". First, define ", def_value({id: "erele_time_difference", singular: "time_diff"}), " as the absolute value of ", code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " - ", field_access(r("entry_rel_entry_reference"), "entry_timestamp")), ". The encodings then vary based on the following choices made by the encoder:", lis(
          [
            def_value({id: "ere_encode_nsid", singular: "encode_namespace_id"}), " is a ", r("Bool"), " that must be ", code("true"), " if ", code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")), ",",
          ],
          [
            def_value({id: "ere_encode_ssid", singular: "encode_subspace_id"}), " is a ", r("Bool"), " that must be ", code("true"), " if ", code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " != ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")), ",",
          ],
          [
            def_value({id: "ere_ts_add", singular: "timestamp_add"}), " is a ", r("Bool"), " that must be ", code("true"), " if ", code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " > ", field_access(r("entry_rel_entry_reference"), "entry_timestamp")), ", that must be ", code("false"), " if ", code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " < ", field_access(r("entry_rel_entry_reference"), "entry_timestamp")), ", and that can be chosen freely if ", code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " == ", field_access(r("entry_rel_entry_reference"), "entry_timestamp")), ","
          ],
          [
            choose_width(def_value({id: "ere_time_width", singular: "time_diff_width"}), r("erele_time_difference")),
          ],
          [
            choose_width(def_value({id: "ere_payload_length_width", singular: "payload_length_width"}), field_access(r("entry_rel_entry_primary"), "entry_payload_length")),
          ],
        ),
      ),

      pinformative(
        "Then, the following bitstrings are in ", r("EntryRelativeEntry"), " for encoding ", r("entry_rel_entry_primary"), " relative to ", r("entry_rel_entry_reference"), ":"
      ),

      encodingdef(
        new Bitfields(
          new BitfieldRow(
            1,
            [
              code("1"), " ", r("iff"), " ", r("ere_encode_nsid"),
            ],
          ),
          new BitfieldRow(
            1,
            [
              code("1"), " ", r("iff"), " ", r("ere_encode_ssid"),
            ],
          ),
          new BitfieldRow(
            1,
            [
              code("1"), " ", r("iff"), " ", r("ere_ts_add"),
            ],
            [
              "Whether to add or subtract ", r("erele_time_difference"), ".",
            ],
          ),
          arbitrary_bits(1),
          two_bit_int_explicit(4, "ere_time_width"),
          two_bit_int_explicit(6, "ere_payload_length_width"),
        ),
        [
          [
            code(function_call(
              r("encode_namespace_id"),
              field_access(r("entry_rel_entry_primary"), "entry_namespace_id"),
            )), " if ", r("ere_encode_nsid"), ", or the empty string, otherwise",
          ],
        ],
        [
          [
            code(function_call(
              r("encode_subspace_id"),
              field_access(r("entry_rel_entry_primary"), "entry_subspace_id"),
            )), " if ", r("ere_encode_ssid"), ",  or the empty string, otherwise",
          ],
        ],
        [
          [
            code(function_call(
              r("encode_path_relative_path"),
              field_access(r("entry_rel_entry_primary"), "entry_path"),
              field_access(r("entry_rel_entry_reference"), "entry_path"),
            )),
          ],
        ],
        [
          [
            encode_int_width(r("erele_time_difference"), "ere_time_width"),
          ],
        ],
        [
          [
            encode_int_width(field_access(r("entry_rel_entry_primary"), "entry_payload_length"), "ere_payload_length_width"),
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

      pinformative(
        "Finally, we define the ", r("encoding_function"), " ", code(function_call(def_fn({id: "can_ere", singular: "encode_entry_relative_entry", math: "encode\\_entry\\_relative\\_entry"}), r("entry_rel_entry_primary"), r("entry_rel_entry_reference"))), " as producing the encoding obtained when ", lis(
          [
            r("ere_encode_nsid"), " is ", code("false"), " if ", code(field_access(r("entry_rel_entry_primary"), "entry_namespace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_namespace_id")), ",",
          ],
          [
            r("ere_encode_ssid"), " is ", code("false"), " if ", code(field_access(r("entry_rel_entry_primary"), "entry_subspace_id"), " == ", field_access(r("entry_rel_entry_reference"), "entry_subspace_id")), ",",
          ],
          [
            r("ere_ts_add"), " is ", code("false"), " if ", code(field_access(r("entry_rel_entry_primary"), "entry_timestamp"), " == ", field_access(r("entry_rel_entry_reference"), "entry_timestamp")), ",",
          ],
          [
            "the third bit of the encoding is zero",
          ],
          [
            r("ere_time_width"), " is ", code(function_call(r("compact_width"), r("erele_time_difference"))), ", and"
          ],
          [
            r("ere_payload_length_width"), " is ", code(function_call(r("compact_width"), field_access(r("entry_rel_entry_primary"), "entry_payload_length"))), "."
          ],
        ),
      ),
    ]),

    hsection("enc_entry_in_namespace_area", {short_title: "entry_in_area"}, code("encode_entry_in_namespace_area"), [
      pinformative(
        "We define an ", r("encoding_relation"), " ", def_type("EntryInArea"), " for encoding an ", r("Entry"), " ", def_value({ id: "eia_inner", singular: "e" }), " that is ", r("area_include", "included"), " in an outer ", r("Area"), " ", def_value({ id: "eia_outer", singular: "out" }), " in a ", r("namespace"), " of ", r("NamespaceId"), " ", def_value({id: "eia_namespace_id", singular: "namespace_id"}), ". The encodings then vary based on the following choices made by the encoder:", lis(
          [
            def_value({id: "eia_encode_ssid", singular: "encode_subspace_id"}), " is a ", r("Bool"), " that must be ", code("true"), " if ", code(field_access(r("eia_outer"), "AreaSubspace"), " == ", r("area_any")), ",",
          ],
          [
            def_value({id: "eia_time_difference", singular: "time_diff"}), " is either ",
            code(
              field_access(r("eia_inner"), "entry_timestamp"),
              " - ",
              field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
            ),
            " or ",
            code(
              field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
              " - ",
              field_access(r("eia_inner"), "entry_timestamp"),
            ), ",",
          ],
          [
            def_value({id: "eia_ts_add", singular: "timestamp_add"}), " is a ", r("Bool"), " that can be chosen freely if ",
            code(
              field_access(r("eia_inner"), "entry_timestamp"),
              " - ",
              field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
              " == ",
              field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
              " - ",
              field_access(r("eia_inner"), "entry_timestamp"),
            ), ", and that otherwise must be ", code("true"), " if ", code(r("eia_time_difference"), " == ", field_access(r("eia_inner"), "entry_timestamp"),
            " - ",
            field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),), ", and ", code("false"), " otherwise."
          ],
          [
            choose_width(def_value({id: "eia_time_width", singular: "time_diff_width"}), r("eia_time_difference")),
          ],
          [
            choose_width(def_value({id: "eia_payload_length_width", singular: "payload_length_width"}), field_access(r("eia_inner"), "entry_payload_length")),
          ],
        ),
      ),

      pinformative(
        "Then, the following bitstrings are in ", r("EntryInArea"), " for encoding ", r("eia_inner"), " in ", r("eia_outer"), " and a ", r("namespace"), " of ", r("NamespaceId"), " ", r("eia_namespace_id"), ":"
      ),

      encodingdef(
        new Bitfields(
          new BitfieldRow(
            1,
            [
              code("1"), " ", r("iff"), " ", r("eia_encode_ssid"),
            ],
          ),
          new BitfieldRow(
            1,
            [
              code("1"), " ", r("iff"), " ", r("eia_ts_add"),
            ],
            [
              "Whether to add ", r("eia_time_difference"), " to ", field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
              ", or subtract from ",
              field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeEnd"), ".",
            ],
          ),
          two_bit_int_explicit(2, "eia_time_width"),
          two_bit_int_explicit(4, "eia_payload_length_width"),
          arbitrary_bits(2),
        ),
        [
          [
            code(function_call(
              r("encode_subspace_id"),
              field_access(r("eia_inner"), "entry_subspace_id"),
            )), " if ", r("eia_encode_ssid"), ",  or the empty string, otherwise",
          ],
        ],
        [
          [
            code(function_call(
              r("encode_path_relative_path"),
              field_access(r("eia_inner"), "entry_path"),
              field_access(r("eia_outer"), "AreaPath"),
            )),
          ],
        ],
        [
          [
            encode_int_width(r("eia_time_difference"), "eia_time_width"),
          ],
        ],
        [
          [
            encode_int_width(field_access(r("eia_inner"), "entry_payload_length"), "eia_payload_length_width"),
          ],
        ],
        [
          [
            code(function_call(
              r("encode_payload_digest"),
              field_access(r("eia_inner"), "entry_payload_digest"),
            )),
          ],
        ],
      ),

      pinformative(
        "Finally, we define the ", r("encoding_function"), " ", code(function_call(def_fn({id: "can_eia", singular: "encode_entry_in_area", math: "encode\\_entry\\_in\\_area"}), r("eia_inner"), r("eia_outer"))), " as producing the encoding obtained when ", lis(
          [
            r("eia_encode_ssid"), " is ", code("false"), " if ", code(field_access(r("eia_inner"), "entry_subspace_id"), " == ", field_access(r("eia_outer"), "entry_subspace_id")), ",",
          ],
          [
            r("eia_time_difference"), " is the minimum of ",
            code(
              field_access(r("eia_inner"), "entry_timestamp"),
              " - ",
              field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
            ),
            " or ",
            code(
              field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
              " - ",
              field_access(r("eia_inner"), "entry_timestamp"),
            ), ",",
          ],
          [
            r("eia_ts_add"), " is ", code("false"), " if ", code(
              field_access(r("eia_inner"), "entry_timestamp"),
              " - ",
              field_access(field_access(r("eia_outer"), "AreaTime"), "TimeRangeStart"),
              " == ",
              field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeEnd"),
              " - ",
              field_access(r("eia_inner"), "entry_timestamp"),
            ), ",",
          ],
          [
            r("eia_time_width"), " is ", code(function_call(r("compact_width"), r("eia_time_difference"))), ", and"
          ],
          [
            r("eia_payload_length_width"), " is ", code(function_call(r("compact_width"), field_access(r("eia_inner"), "entry_payload_length"))), "."
          ],
          [
            "bits six and seven of the encoding are zero",
          ],
        ),
      ),
    ]),

    hsection("enc_entry_in_namespace_3drange", {short_title: "entry_in_range"}, code("encode_entry_in_namespace_3drange"), [
      pinformative(
        preview_scope(
          "To encode an ", r("Entry"), " ", def_value({ id: "eir_inner", singular: "e" }), " that is ", r("d3_range_include", "included"), " in a ", r("D3Range"), " ", def_value({ id: "eir_outer", singular: "out" }), " in a ", r("namespace"), " of ", r("NamespaceId"), " ", def_value({id: "eir_namespace_id", singular: "namespace_id"}), ", we first define ", def_value({ id: "eir_time", singular: "time_diff" }), " as the minimum absolute value of ",
          code(
            field_access(r("eir_inner"), "entry_timestamp"),
            " - ",
            field_access(field_access(r("eir_outer"), "D3RangeTime"), "TimeRangeStart"),
          ),
          " and ",
          code(
            field_access(r("eir_inner"), "entry_timestamp"),
            " - ",
            field_access(field_access(r("eir_outer"), "D3RangeTime"), "TimeRangeEnd"),
          ),
          ". We then define ",
          code(function_call(def_fn({id: "encode_entry_in_namespace_3drange", math: "encode\\_enrty\\_in\\_namespace\\_3drange"}), r("eir_inner"), r("eir_outer"), r("eir_namespace_id"))), " as the concatenation of:",

          encodingdef(
            new Bitfields(
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(field_access(r("eir_inner"), "entry_subspace_id"), " != ", field_access(field_access(r("eir_outer"), "D3RangeSubspace"), "SubspaceRangeStart")),
                ],
                [
                  inclusion_flag_remark(field_access(r("eir_inner"), "entry_subspace_id")),
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeEnd"),
                ],
                [
                  "Encode ", field_access(r("eir_inner"), "entry_path"), " relative to ", field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeStart"), " or to ", field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeEnd"), "?",
                ],
              ),
              new BitfieldRow(
                1,
                [
                  code("1"), " ", r("iff"), " ",
                  code(r("eir_time"), " == ", function_call("abs", [
                    field_access(r("eir_inner"), "entry_timestamp"),
                    " - ",
                    field_access(field_access(r("eir_outer"), "D3RangeTime"), "TimeRangeStart"),
                ])),
                ],
                [
                  "Add ", r("eir_time"), " to ",
                  field_access(field_access(r("eir_outer"), "D3RangeTime"), "TimeRangeStart"),
                  ", or subtract it from ",
                  field_access(field_access(r("eir_outer"), "D3RangeTime"), "TimeRangeEnd"),
                  "?",
                ],
              ),
              zero_bits(1),
              two_bit_int(4, r("eir_time")),
              two_bit_int(6, field_access(r("eir_inner"), "entry_payload_length")),
            ),
            [[
              code(function_call(
                r("encode_subspace_id"),
                field_access(r("eir_inner"), "entry_subspace_id"),
              )), ",  or the empty string, if ",
              code(field_access(r("eir_inner"), "entry_subspace_id"), " == ", field_access(field_access(r("eir_outer"), "D3RangeSubspace"), "SubspaceRangeStart"))
            ]],
            [[
              code(function_call(
                r("encode_path_relative_path"),
                field_access(r("eir_inner"), "entry_path"),
                field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeStart"),
                )),
              " if the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(r("eir_inner"), "entry_path"), " and ", field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeEnd"), ", otherwise ",
              code(function_call(
                r("encode_path_relative_path"),
                field_access(r("eir_inner"), "entry_path"),
                field_access(field_access(r("eir_outer"), "D3RangePath"), "PathRangeEnd"),
              )),
            ]],
            [[
              encode_two_bit_int(r("eir_time")),
            ]],
            [[
              encode_two_bit_int(field_access(r("eir_inner"), "entry_payload_length")),
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

    hsection("enc_area_in_area", {short_title: "area_in_area"}, code("encode_area_in_area"), [
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
                code("0"), " if ", code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open")), ", otherwise ", code("1"), " ", r("iff"), " ",
                code(r("aia_end"), " == ", field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"),
                " - ", field_access(field_access(r("area_in_area_outer"), "AreaTime"), "TimeRangeStart")),
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
              r("encode_path_relative_path"),
              field_access(r("area_in_area_inner"), "AreaPath"),
              field_access(r("area_in_area_outer"), "AreaPath"),
            )),
          ]],
          [[
            encode_two_bit_int(r("aia_start")),
          ]],
          [[
            encode_two_bit_int(r("aia_end"), code(field_access(field_access(r("area_in_area_inner"), "AreaTime"), "TimeRangeEnd"), " == ", r("range_open"))),
          ]],
        ),
      ),
    ]),

    hsection("enc_3d_range_relative_3d_range", {short_title: "3drange_relative_3drange"}, code("encode_3drange_relative_3drange"), [
      pinformative(
        preview_scope(
          "To encode a ", r("D3Range"), " ", def_value({ id: "threed3d_primary", singular: "ran" }), " relative to a reference ", r("D3Range"), " ", def_value({ id: "threedr3d_reference", singular: "ref" }), ", we first define ", lis(
            [def_value({ id: "threedr3d_s2s", singular: "start_to_start" }), " as the absolute value of ", code(
              field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeStart"),
              " - ",
              field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeStart"),
            ), ","],
            [def_value({ id: "threedr3d_s2e", singular: "start_to_end" }), " as the absolute value of ", code(
              field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeStart"),
              " - ",
              field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeEnd"),
            ), ","],
            [def_value({ id: "threedr3d_e2s", singular: "end_to_start" }), " as the absolute value of ", code(
              field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"),
              " - ",
              field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeStart"),
            ), ","],
            [def_value({ id: "threedr3d_e2e", singular: "end_to_end" }), " as the absolute value of ", code(
              field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"),
              " - ",
              field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeEnd"),
            ), ","],
            [def_value({ id: "threedr3d_start_diff", singular: "start_time_diff" }), " as the minimum of ", r("threedr3d_s2s"), " and ", r("threedr3d_s2e"), ", and"],
            [def_value({ id: "threedr3d_end_diff", singular: "end_time_diff" }), " as the minimum of ", r("threedr3d_e2s"), " and ", r("threedr3d_e2e"), "."],
          ),
        ),
        "We then define ",
        code(function_call(def_fn({id: "encode_3drange_relative_3drange", math: "encode\\_3drange\\_relative\\_3drangearea"}), r("threed3d_primary"), r("threedr3d_reference"))), " as the concatenation of:",

        encodingdef(
          new Bitfields(
            new BitfieldRow(
              2,
              [
                div(
                  code("01"), " if ",
                  code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeStart")), ",",
                ),
                div(
                  code("10"), " if ",
                  code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeEnd")), ",",
                ),
                div(
                  code("11"), " otherwise.",
                ),
              ],
              [
                "Encode ", field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeStart"), "?"
              ],
            ),
            new BitfieldRow(
              2,
              [
                div(
                  code("00"), " if ", code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"), " == ", r("range_open")), ", and else "
                ),
                div(
                  code("01"), " if ",
                  code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeStart")), ",",
                ),
                div(
                  code("10"), " if ",
                  code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeEnd")), ",",
                ),
                div(
                  code("11"), " otherwise.",
                ),
              ],
              [
                "Encode ", field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"), "?"
              ],
            ),
            new BitfieldRow(
              1,
              [
                code("1"), " ", r("iff"), " the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeStart"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeStart"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"),
              ],
              [
                "Encode ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeStart"), " relative to ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"), " or to ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"), "?",
              ],
            ),
            new BitfieldRow(
              1,
              [
                code("1"), " ", r("iff"), " ", code(field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " == ", r("range_open")),
              ],
            ),
            new BitfieldRow(
              1,
              [
                div(
                  code("0"), " if ", code(field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " == ", r("range_open")), ", otherwise "
                ),
                div(
                  code("1"), " ", r("iff"), " the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"),
                ),
              ],
              [
                "Encode ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " relative to ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"), " or to ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"), " (if at all)?",
              ],
            ),
            new BitfieldRow(
              1,
              [
                code("1"), " ", r("iff"), " ", code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"), " == ", r("range_open")),
              ],
            ),  
            new BitfieldRow(
              1,
              [
                code("1"), " ", r("iff"), " ",
                code(r("threedr3d_s2s"), " <= ", r("threedr3d_s2e")),
              ],
              [
                "Encode ", field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeStart"), " relative to ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeStart"), " or ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeEnd"), "?",
              ],
            ),
            new BitfieldRow(
              1,
              [
                code("1"), " ", r("iff"), " bit 8 is ", code("1"), " and ", code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeStart"), " >= ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeStart")), ", or ",
                " bit 8 is ", code("0"), " and ", code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeStart"), " >= ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeEnd")), ".",
              ],
              [
                "Add or subtract ", r("threedr3d_start_diff"), "?",
              ],
            ),
            two_bit_int(10, r("threedr3d_start_diff")),
            new BitfieldRow(
              1,
              [
                div(
                  code("0"), " if ", code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"), " == ", r("range_open")), ", otherwise "
                ),
                div(
                  code("1"), " ", r("iff"), " ",
                  code(r("threedr3d_e2s"), " <= ", r("threedr3d_e2e")),
                ),
              ],
              [
                "Encode ", field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"), " relative to ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeStart"), " or ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeEnd"), " (if at all)?",
              ],
            ),
            new BitfieldRow(
              1,
              [
                div(
                  code("0"), " if ", code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"), " == ", r("range_open")), ", otherwise "
                ),
                div(
                  code("1"), " ", r("iff"), " bit 12 is ", code("1"), " and ", code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"), " >= ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeStart")), ", or ",
                  " bit 12 is ", code("0"), " and ", code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"), " >= ", field_access(field_access(r("threedr3d_reference"), "D3RangeTime"), "TimeRangeEnd")), ".",
                ),
              ],
              [
                "Add or subtract ", r("threedr3d_end_diff"), " (if encoding it at all)?",
              ],
            ),
            two_bit_int(14, r("threedr3d_end_diff"), code(field_access(field_access(r("threed3d_primary"), "D3RangeTime"), "TimeRangeEnd"), " == ", r("range_open"))),
          ),
          [[
            code(function_call(r("encode_subspace_id"), field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeStart"))),
            ", or the empty string if ", code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeStart")),
            " or ", code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeStart"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeEnd")),
          ]],
          [[
            code(function_call(r("encode_subspace_id"), field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"))),
            ", or the empty string if ",
            code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"), " == ", r("range_open")),
            ", ", code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeStart")),
            " or ", code(field_access(field_access(r("threed3d_primary"), "D3RangeSubspace"), "SubspaceRangeEnd"), " == ", field_access(field_access(r("threedr3d_reference"), "D3RangeSubspace"), "SubspaceRangeEnd")),
          ]],
          [[
            code(function_call(
              r("encode_path_relative_path"),
              field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeStart"),
              field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"),
            )),
            " if the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeStart"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeStart"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"), ", otherwise ",
            code(function_call(
              r("encode_path_relative_path"),
              field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeStart"),
              field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"),
              )),
          ]],
          [[
            div(
              "the empty string if ", code(field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " == ", r("range_open")), ", otherwise:",
            ),
            div(
              code(function_call(
                r("encode_path_relative_path"),
                field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"),
                field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"),
              )),
              " if the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeStart"), " is at least as long as the longest common ", r("path_prefix"), " of ", field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"), " and ", field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"), ", otherwise ",
              code(function_call(
                r("encode_path_relative_path"),
                field_access(field_access(r("threed3d_primary"), "D3RangePath"), "PathRangeEnd"),
                field_access(field_access(r("threedr3d_reference"), "D3RangePath"), "PathRangeEnd"),
              )),
            ),
          ]],
          [[
            encode_two_bit_int(r("threedr3d_start_diff")),
          ]],
          [[
            encode_two_bit_int(r("threedr3d_end_diff"), code(field_access(field_access(r("threedr3d_end_diff"), "D3RangeTime"), "TimeRangeEnd"), " == ", r("range_open"))),
          ]],
        ),
      ),
    ]),

  ]),

  hsection("enc_capabilitites", "Capabilities", [

    pinformative("Encodings for ", link_name("meadowcap", "Meadowcap"), " and ", rs("McSubspaceCapability"), "."),

    hsection("enc_subspace_capability", {short_title: "subspace_capability"}, code("encode_subspace_capability"), [
      pinformative(
        "To encode a ", r("McSubspaceCapability"), " ", def_value({ id: "enc_sc_cap", singular: "c" }), ", we define ",
        code(function_call(def_fn({id: "encode_mc_subspace_capability", math: "encode\\_mc\\_subspace\\_capability"}), r("enc_sc_cap"))), " as the concatenation of:",

        encodingdef(
          new Bitfields(
            new BitfieldRow(
              8,
              [
                div(
                  code("11111111"), " if the length of ", field_access(r("enc_sc_cap"), "subspace_cap_delegations"), " is greater or equal to 2^32,"
                ),
                div(
                  code("11111110"), " if the length of ", field_access(r("enc_sc_cap"), "subspace_cap_delegations"), " is greater or equal to 2^16,"
                ),
                div(
                  code("11111101"), " if the length of ", field_access(r("enc_sc_cap"), "subspace_cap_delegations"), " is greater or equal to 256,"
                ),
                div(
                  code("11111100"), " if the length of ", field_access(r("enc_sc_cap"), "subspace_cap_delegations"), " is greater or equal to 252, or"
                ),
                div(
                  "the length of ", field_access(r("enc_sc_cap"), "subspace_cap_delegations"), " otherwise."
                ),
              ],
            ),
          ),
          [[
            code(function_call(
              r("encode_namespace_pk"),
              field_access(r("enc_sc_cap"), "subspace_cap_namespace"),
            )),
          ]],
          [[
            code(function_call(
              r("encode_user_pk"),
              field_access(r("enc_sc_cap"), "subspace_cap_user"),
            )),
          ]],
          [[
            code(function_call(
              r("encode_namespace_sig"),
              field_access(r("enc_sc_cap"), "subspace_cap_initial_authorisation"),
            )),
          ]],
          [[
            encode_two_bit_int(["the length of ", field_access(r("enc_sc_cap"), "subspace_cap_delegations")], ["the length of ", field_access(r("enc_sc_cap"), "subspace_cap_delegations"), " is less than or equal to 251"]),
          ]],
          [[
            "for each pair ", code("(", def_value({id: "enc_subspace_cap_del_pk", singular: "pk"}), ", ", def_value({id: "enc_subspace_cap_del_sig", singular: "sig"}), ")"), " in ", field_access(r("enc_sc_cap"), "subspace_cap_delegations"), " the concatenation of:", lis(
              [
                code(function_call(
                  r("encode_user_pk"),
                  r("enc_subspace_cap_del_pk"),
                )),
              ],
              [
                code(function_call(
                  r("encode_user_sig"),
                  r("enc_subspace_cap_del_sig"),
                )),
              ],
            ),
          ]],
        ),
      ),
    ]),

    hsection("enc_mc_capability", {short_title: "mc_capability"}, code("encode_mc_capability"), [
      pinformative(
        "To encode a ", r("Capability"), " ", def_value({ id: "enc_mc_cap", singular: "c" }), " whose ", r("granted_area"), " is know to be ", r("area_include_area", "included"), " in ", sidenote("some", [
          "If no smaller containing ", r("Area"), " is known from context, use the ", r("full_area"), "."
        ]), " ", r("Area"), " ", def_value({ id: "enc_mc_outer", singular: "out" }), ", we define ",
        code(function_call(def_fn({id: "encode_mc_capability", math: "encode\\_mc\\_capability"}), r("enc_mc_cap"))), " depending on whether ", field_access(r("enc_mc_cap"), "capability_inner"), " is a ", r("CommunalCapability"), " or an ", r("OwnedCapability"), ".",
      ),

      pinformative(
        "If ", field_access(r("enc_mc_cap"), "capability_inner"), " is a ", r("CommunalCapability"), ", then ", code(function_call(r("encode_mc_capability"), r("enc_mc_cap"))), " is the concatenation of:",
        encodingdef(
          new Bitfields(
            new BitfieldRow(
              2,
              [
                div(
                  code("00"), ", if ", code(field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_access_mode"), " == ", r("access_read")), ","
                ),
                div(
                  code("01"), " otherwise."
                ),
              ],
            ),
            new BitfieldRow(
              6,
              [
                div(
                  code("111111"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations"), " is greater or equal to 2^32,"
                ),
                div(
                  code("111110"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations"), " is greater or equal to 2^16,"
                ),
                div(
                  code("111101"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations"), " is greater or equal to 256,"
                ),
                div(
                  code("111100"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations"), " is greater or equal to 60, or"
                ),
                div(
                  "the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations"), " otherwise."
                ),
              ],
            ),
          ),
          [[
            code(function_call(
              r("encode_namespace_pk"),
              field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_namespace"),
            )),
          ]],
          [[
            code(function_call(
              r("encode_user_pk"),
              field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_user"),
            )),
          ]],
          [[
            encode_two_bit_int(["the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations")], ["the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations"), " is less than or equal to 59"]),
          ]],
          [[
            "for each triplet ", code("(", def_value({id: "enc_com_cap_del_area", singular: "area"}), ", ", def_value({id: "enc_com_cap_del_pk", singular: "pk"}), ", ", def_value({id: "enc_com_cap_del_sig", singular: "sig"}), ")"), " in ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "communal_cap_delegations"), " the concatenation of:", lis(
              [
                code(function_call(
                  r("encode_area_in_area"),
                  r("enc_com_cap_del_area"),
                  r("enc_com_cap_del_prev_area"),
                )),
                ", where ", def_value({id: "enc_com_cap_del_prev_area", singular: "prev_area"}), " is the ", r("enc_com_cap_del_area"), " of the previous triplet, or ", r("enc_mc_outer"), " for the first triplet.",
              ],
              [
                code(function_call(
                  r("encode_user_pk"),
                  r("enc_com_cap_del_pk"),
                )),
              ],
              [
                code(function_call(
                  r("encode_user_sig"),
                  r("enc_com_cap_del_sig"),
                )),
              ],
            ),
          ]],
        ),
      ),

      pinformative(
        "If ", field_access(r("enc_mc_cap"), "capability_inner"), " is an ", r("OwnedCapability"), ", then ", code(function_call(r("encode_mc_capability"), r("enc_mc_cap"))), " is the concatenation of:",
        encodingdef(
          new Bitfields(
            new BitfieldRow(
              2,
              [
                div(
                  code("10"), ", if ", code(field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_access_mode"), " == ", r("access_read")), ","
                ),
                div(
                  code("11"), " otherwise."
                ),
              ],
            ),
            new BitfieldRow(
              6,
              [
                div(
                  code("111111"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations"), " is greater or equal to 2^32,"
                ),
                div(
                  code("111110"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations"), " is greater or equal to 2^16,"
                ),
                div(
                  code("111101"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations"), " is greater or equal to 256,"
                ),
                div(
                  code("111100"), " if the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations"), " is greater or equal to 60, or"
                ),
                div(
                  "the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations"), " otherwise."
                ),
              ],
            ),
          ),
          [[
            code(function_call(
              r("encode_namespace_pk"),
              field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_namespace"),
            )),
          ]],
          [[
            code(function_call(
              r("encode_user_pk"),
              field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_user"),
            )),
          ]],
          [[
            code(function_call(
              r("encode_namespace_sig"),
              field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_initial_authorisation"),
            )),
          ]],
          [[
            encode_two_bit_int(["the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations")], ["the length of ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations"), " is less than or equal to 59"]),
          ]],
          [[
            "for each triplet ", code("(", def_value({id: "enc_own_cap_del_area", singular: "area"}), ", ", def_value({id: "enc_own_cap_del_pk", singular: "pk"}), ", ", def_value({id: "enc_own_cap_del_sig", singular: "sig"}), ")"), " in ", field_access(field_access(r("enc_mc_cap"), "capability_inner"), "owned_cap_delegations"), " the concatenation of:", lis(
              [
                code(function_call(
                  r("encode_area_in_area"),
                  r("enc_own_cap_del_area"),
                  r("enc_own_cap_del_prev_area"),
                )),
                ", where ", def_value({id: "enc_own_cap_del_prev_area", singular: "prev_area"}), " is the ", r("enc_own_cap_del_area"), " of the previous triplet, or ", r("enc_mc_outer"), " for the first triplet.",
              ],
              [
                code(function_call(
                  r("encode_user_pk"),
                  r("enc_own_cap_del_pk"),
                )),
              ],
              [
                code(function_call(
                  r("encode_user_sig"),
                  r("enc_own_cap_del_sig"),
                )),
              ],
            ),
          ]],
        ),
      ),
    ]),

  ]),
]);
