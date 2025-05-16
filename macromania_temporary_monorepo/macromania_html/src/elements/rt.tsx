import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [rt element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-rt-element) marks the ruby text component of a ruby annotation. When it is the child of a [ruby element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element), it doesn't represent anything itself, but the [ruby element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element) uses it as part of determining what *it* represents.
 */
export function Rt(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="rt"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
