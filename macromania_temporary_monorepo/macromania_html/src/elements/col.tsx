import { Expression, Expressions } from "../../deps.ts";
import {
  RenderBoolean,
  RenderEnum,
  RenderExpression,
  RenderNonVoidElement,
  RenderNumber,
} from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Col} macro.
 *
 * https://html.spec.whatwg.org/multipage/tables.html#the-col-element
 */
export type ColProps = {
  /**
   *  Number of columns spanned by the element.
   */
  span?: number;
} & TagProps;

/**
 * If a [col element](https://html.spec.whatwg.org/multipage/tables.html#the-col-element) has a parent and that is a [colgroup element](https://html.spec.whatwg.org/multipage/tables.html#the-colgroup-element) that itself has a parent that is a [table element](https://html.spec.whatwg.org/multipage/tables.html#the-table-element), then the [col element](https://html.spec.whatwg.org/multipage/tables.html#the-col-element) represents one or more [columns](https://html.spec.whatwg.org/multipage/tables.html#concept-column) in the [column group](https://html.spec.whatwg.org/multipage/tables.html#concept-column-group) represented by that [colgroup](https://html.spec.whatwg.org/multipage/tables.html#the-colgroup-element).
 */
export function Col(
  props: ColProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="col"
      attrs={<RenderColAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderColAttributes(
  { attrs }: { attrs?: ColProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.span !== undefined
        ? <RenderNumber attr="span" value={attrs.span} />
        : ""}
    </>
  );
}
