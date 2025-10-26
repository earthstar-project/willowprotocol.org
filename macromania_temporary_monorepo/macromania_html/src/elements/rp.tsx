import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [rp element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-rp-element) can be used to provide parentheses or other content around a ruby text component of a ruby annotation, to be shown by user agents that don't support ruby annotations.
 */
export function Rp(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="rp"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
