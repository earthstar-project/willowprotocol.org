import { Expression, Expressions, shouldEmitLatex } from "../../deps.ts";
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

/**
 * Props for the {@linkcode Li} macro.
 *
 * https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element
 */
export type LiProps = {
  /**
   * The [value attribute](https://html.spec.whatwg.org/multipage/grouping-content.html#attr-li-value), if present, must be a [valid integer](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-integer). It is used to determine the [ordinal value](https://html.spec.whatwg.org/multipage/grouping-content.html#ordinal-value) of the list item, when the [li](https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element)'s [list owner](https://html.spec.whatwg.org/multipage/grouping-content.html#list-owner) is an [ol element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element).
   */
  value?: number;
} & TagProps;

/**
 * The [li element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element) represents a list item. If its parent element is an [ol](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element), [ul](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element), or [menu](https://html.spec.whatwg.org/multipage/grouping-content.html#the-menu-element) element, then the element is an item of the parent element's list, as defined for those elements. Otherwise, the list item has no defined list-related relationship to any other [li element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element).
 */
export function Li(
  props: LiProps & { children?: Expressions },
): Expression {
  return <impure fun={(ctx) => {
    if (shouldEmitLatex(ctx)) {
      return <>\item <exps x={props.children}/></>
    } else {
      return (
        <RenderNonVoidElement
          name="li"
          attrs={<RenderLiAttributes attrs={props} />}
          children={props.children}
        />
      );
    }
  }}/>;
}

function RenderLiAttributes(
  { attrs }: { attrs?: LiProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.value !== undefined
        ? <RenderNumber attr="value" value={attrs.value} />
        : ""}
    </>
  );
}
