import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [s element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-s-element) represents contents that are no longer accurate or no longer relevant.
 */
export function S(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="s"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
