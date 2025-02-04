import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [main element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-main-element) represents the dominant contents of the document.
 *
 * A document must not have more than one [main element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-main-element) that does not have the [hidden attribute](https://html.spec.whatwg.org/multipage/interaction.html#attr-hidden) specified.
 *
 * A [hierarchically correct](https://html.spec.whatwg.org/multipage/grouping-content.html#hierarchically-correct-main-element) [main element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-main-element) is one whose ancestor elements are limited to [html](https://html.spec.whatwg.org/multipage/semantics.html#the-html-element), [body](https://html.spec.whatwg.org/multipage/sections.html#the-body-element), [div](https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element), [form](https://html.spec.whatwg.org/multipage/forms.html#the-form-element) without an [accessible name](https://w3c.github.io/aria/#dfn-accessible-name), and [autonomous custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#autonomous-custom-element). Each [main element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-main-element) must be a [hierarchically correct](https://html.spec.whatwg.org/multipage/grouping-content.html#hierarchically-correct-main-element) [main element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-main-element).
 */
export function Main(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="main"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
