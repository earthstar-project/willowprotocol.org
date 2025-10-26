import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [html element](https://html.spec.whatwg.org/multipage/semantics.html#the-html-element) represents the root of an HTML document.
 * 
 * Authors are encouraged to specify a [lang attribute](https://html.spec.whatwg.org/multipage/dom.html#attr-lang) on the root [html element](https://html.spec.whatwg.org/multipage/semantics.html#the-html-element), giving the document's language. This aids speech synthesis tools to determine what pronunciations to use, translation tools to determine what rules to use, and so forth.
 */
export function Html(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="html"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
