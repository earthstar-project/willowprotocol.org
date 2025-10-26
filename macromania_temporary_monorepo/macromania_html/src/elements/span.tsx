import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [span element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-span-element) doesn't mean anything on its own, but can be useful when used together with the [global attributes](https://html.spec.whatwg.org/multipage/dom.html#global-attributes), e.g. [class](https://html.spec.whatwg.org/multipage/dom.html#classes), [lang](https://html.spec.whatwg.org/multipage/dom.html#attr-lang), or [dir](https://html.spec.whatwg.org/multipage/dom.html#attr-dir).
 */
export function Span(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="span"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
