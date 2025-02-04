import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [tbody element](https://html.spec.whatwg.org/multipage/tables.html#the-tbody-element) represents a [block](https://html.spec.whatwg.org/multipage/tables.html#concept-row-group) of [rows](https://html.spec.whatwg.org/multipage/tables.html#concept-row) that consist of a body of data for the parent [table element](https://html.spec.whatwg.org/multipage/tables.html#the-table-element), if the [tbody element](https://html.spec.whatwg.org/multipage/tables.html#the-tbody-element) has a parent and it is a [table](https://html.spec.whatwg.org/multipage/tables.html#the-table-element).
 */
export function Tbody(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="tbody"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
