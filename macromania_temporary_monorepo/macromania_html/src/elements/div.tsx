import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [div element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element) has no special meaning at all. It represents its children.
 */
export function Div(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="div"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
