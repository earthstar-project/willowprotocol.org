import {
  def_parameter,
  def_value,
  lis,
  pinformative,
  quotes,
  site_template,
} from "../main.ts";
import {
Attributes,
  code,
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
import { marginale_inlineable } from "../../marginalia.ts";
import { Expression, Invocation, new_macro } from "../../tsgen.ts";

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
  title: "Encodings",
}, [
  pinformative("wip, the current version of this page was transferred verbatim from an older version of Meadowcap. The definitions are correct, but the presentation needs some reworking."),

  pinformative(
    "In order to digitally sign the logical values of Willow and Meadowcap (entries, capabilities, etc.), these logical values must first be converted to bytestrings. Entries and capabilities contain smaller values such as hashes or signatures. Meadowcap does not assume a fixed hash function or signature scheme, so the instructions on how to encode these values as bytestrings have to be supplied as protocol parameters. For things to work correctly, Meadowcap requires certain properties of the encoding function. We first give a succinct, mathematical definition of valid encoding functions, followed by a more accessible, English explanation.",
  ),

  pinformative(
    "An ",
    def({id: "encoding_function", singular: "encoding function"}),
    " ",
    def_value(`encode_s`),
    " for a set ",
    def_parameter(`S`),
    " is a function from ",
    r(`S`),
    " to the set of bytestrings, such that there exists a function ",
    r(`decode_s`),
    " such that:",
  ),

  lis(
    [
      "for every ",
      def_value(`s`),
      " in ",
      r(`S`),
      " and every bytestring ",
      def_value(`b`),
      " that starts with ",
      code("encode_s(s)"),
      " we have ",
      code("decode_s(b) = s"),
      ", and",
    ],
    [
      "for every ",
      r(`s`),
      " in ",
      r(`S`),
      " and every bytestring ",
      r(`b`),
      " that does not start with ",
      code(`encode_s(s)`),
      " we have ",
      code(`decode_s(b) != s`),
      ".",
    ],
  ),

  pinformative(
    "In plain language: ",
    r(`encode_s`),
    " must deterministically map any value of type ",
    r(`S`),
    " to exactly one bytestring.",
  ),

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

  pinformative(
    "Further, there must be a corresponding decoding function ",
    def_value(`decode_s`),
    ". This function must map valid encodings back to values of type ",
    r(`S`),
    ", and it must report an encoding error for any input string that does not start with a valid encoding of anything.",
  ),

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
    pinformative(
      "And finally, appending arbitrary bytes to a valid encoding must not cause any change in the return value of ",
      r(`decode_s`),
      ".",
      marginale_inlineable(
        "This requirement makes it so we can encode sequences of multiple values by simply concatenating their encodings, without running the risk that the resulting string would be a valid encoding of a different value as well.",
      ),
    ),
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
  ),
]);

/*

*/
