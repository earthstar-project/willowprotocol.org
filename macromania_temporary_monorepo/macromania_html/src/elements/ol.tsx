import { Expression, Expressions } from "../../deps.ts";
import {
  EscapeHtml,
  RenderBoolean,
  RenderExpression,
  RenderNonVoidElement,
  RenderNumber,
  RenderSpaceSeparatedList,
} from "../renderUtils.tsx";

import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderEnum } from "../renderUtils.tsx";
import { CrossOrigin } from "../shared.tsx";
import { LatexBeginEnd, shouldEmitLatex } from "../../deps.ts";

/**
 * Props for the {@linkcode Ol} macro.
 *
 * https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element
 */
export type OlProps = {
  /**
   * The [reversed attribute](https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-reversed) indicates that the list is a descending list (..., 3, 2, 1). If the attribute is omitted, the list is an ascending list (1, 2, 3, ...).
   */
  reversed?: boolean;
  /**
   * The [start attribute](https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-start), if present, must be a [valid integer](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-integer). It is used to determine the [starting value](https://html.spec.whatwg.org/multipage/grouping-content.html#concept-ol-start) of the list.
   */
  start?: number;
  /**
   * The [type attribute](https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type) can be used to specify the kind of marker to use in the list, in the cases where that matters (e.g. because items are to be referenced by their number/letter).
   */
  type?:
    /**
     * Decimal numbers.
     */
    | "1"
    /**
     * Lowercase latin alphabet.
     */
    | "a"
    /**
     * Uppercase latin alphabet.
     */
    | "A"
    /**
     * Lowercase roman numerals.
     */
    | "i"
    /**
     * Uppercase roman numerals.
     */
    | "I";
} & TagProps;

/**
 * The [ol element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element) represents a list of items, where the items have been intentionally ordered, such that changing the order would change the meaning of the document.
 *
 * The items of the list are the [li element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element) child nodes of the [ol element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element), in tree order.
 */
export function Ol(
  props: OlProps & { children?: Expressions },
): Expression {
  return <impure fun={(ctx) => {
    if (shouldEmitLatex(ctx)) {
      return <LatexBeginEnd name="enumerate">
        <exps x={props.children}/>
      </LatexBeginEnd>
    } else {
      return (
        <RenderNonVoidElement
          name="ol"
          attrs={<RenderOlAttributes attrs={props} />}
          children={props.children}
        />
      );
    }
  }}/>;
}

function RenderOlAttributes(
  { attrs }: { attrs?: OlProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.reversed !== undefined
        ? <RenderBoolean attr="reversed" value={attrs.reversed} />
        : ""}
      {attrs.start !== undefined
        ? <RenderNumber attr="start" value={attrs.start} />
        : ""}
      {attrs.type !== undefined
        ? <RenderEnum attr="type" value={attrs.type} />
        : ""}
    </>
  );
}
