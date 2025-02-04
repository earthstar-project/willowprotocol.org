import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [tfoot element](https://html.spec.whatwg.org/multipage/tables.html#the-tfoot-element) represents the [block](https://html.spec.whatwg.org/multipage/tables.html#concept-row-group) of [rows](https://html.spec.whatwg.org/multipage/tables.html#concept-row) that consist of the column summaries (footers) for the parent [table element](https://html.spec.whatwg.org/multipage/tables.html#the-table-element), if the [tfoot element](https://html.spec.whatwg.org/multipage/tables.html#the-tfoot-element) has a parent and it is a [table](https://html.spec.whatwg.org/multipage/tables.html#the-table-element).
 */
export function Tfoot(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="tfoot"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
