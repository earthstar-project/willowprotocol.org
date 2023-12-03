import {
  def_parameter,
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
import { r, def } from "../../defref.ts";
import { asset } from "../../out.ts";
import { marginale, marginale_inlineable, sidenote } from "../../marginalia.ts";
import { Expression, Invocation, new_macro } from "../../tsgen.ts";
import { hsection } from "../../hsection.ts";

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
    
  ]),

]);

/*

*/
