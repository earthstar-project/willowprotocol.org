import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [sub element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-sub-and-sup-elements) represents a subscript.
 */
export function Sub(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="sub"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
