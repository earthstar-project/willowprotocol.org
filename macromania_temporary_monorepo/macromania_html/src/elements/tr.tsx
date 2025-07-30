import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [tr element](https://html.spec.whatwg.org/multipage/tables.html#the-tr-element) represents a [row](https://html.spec.whatwg.org/multipage/tables.html#concept-row) of [cells](https://html.spec.whatwg.org/multipage/tables.html#concept-cell) in a [table](https://html.spec.whatwg.org/multipage/tables.html#concept-table).
 */
export function Tr(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="tr"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
