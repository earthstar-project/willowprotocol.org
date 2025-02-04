import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [thead element](https://html.spec.whatwg.org/multipage/tables.html#the-thead-element) represents the [block](https://html.spec.whatwg.org/multipage/tables.html#concept-row-group) of [rows](https://html.spec.whatwg.org/multipage/tables.html#concept-row) that consist of the column labels (headers) and any ancillary non-header cells for the parent [table element](https://html.spec.whatwg.org/multipage/tables.html#the-table-element), if the [thead element](https://html.spec.whatwg.org/multipage/tables.html#the-thead-element) has a parent and it is a [table](https://html.spec.whatwg.org/multipage/tables.html#the-table-element).
 */
export function Thead(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="thead"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
