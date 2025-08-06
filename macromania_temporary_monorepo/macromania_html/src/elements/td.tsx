import { Expression, Expressions } from "../../deps.ts";
import {
  RenderBoolean,
  RenderEnum,
  RenderExpression,
  RenderNonVoidElement,
  RenderNumber,
  RenderSpaceSeparatedList,
} from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Td} macro.
 *
 * https://html.spec.whatwg.org/multipage/tables.html#the-td-element
 */
export type TdProps = {
  /**
   *  Number of columns that the cell is to span.
   */
  colspan?: number;
  /**
   *  Number of rows that the cell is to span.
   */
  rowspan?: number;
  /**
   * The header cells for this cell. When given as an array, the arrays are joined by spaces.
   */
  headers?: Expressions;
} & TagProps;

/**
 * The [td element](https://html.spec.whatwg.org/multipage/tables.html#the-td-element) represents a data [cell](https://html.spec.whatwg.org/multipage/tables.html#concept-cell) in a table.
 */
export function Td(
  props: TdProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="td"
      attrs={<RenderTdAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderTdAttributes(
  { attrs }: { attrs?: TdProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.colspan !== undefined
        ? <RenderNumber attr="colspan" value={attrs.colspan} />
        : ""}
      {attrs.rowspan !== undefined
        ? <RenderNumber attr="rowspan" value={attrs.rowspan} />
        : ""}
      {attrs.headers !== undefined
        ? <RenderSpaceSeparatedList attr="headers" value={attrs.headers} />
        : ""}
    </>
  );
}
