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
 * Props for the {@linkcode Colgroup} macro.
 *
 * https://html.spec.whatwg.org/multipage/tables.html#the-colgroup-element
 */
export type ColgroupProps = {
  /**
   *  Number of columns spanned by the element.
   */
  span?: number;
} & TagProps;

/**
 * The [colgroup element](https://html.spec.whatwg.org/multipage/tables.html#the-colgroup-element) represents a [group](https://html.spec.whatwg.org/multipage/tables.html#concept-column-group) of one or more [columns](https://html.spec.whatwg.org/multipage/tables.html#concept-column) in the [table](https://html.spec.whatwg.org/multipage/tables.html#the-table-element) that is its parent, if it has a parent and that is a [table](https://html.spec.whatwg.org/multipage/tables.html#the-table-element) element.
 */
export function Colgroup(
  props: ColgroupProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="colgroup"
      attrs={<RenderColgroupAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderColgroupAttributes(
  { attrs }: { attrs?: ColgroupProps },
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
