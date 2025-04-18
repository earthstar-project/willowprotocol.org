import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [footer element](https://html.spec.whatwg.org/multipage/sections.html#the-footer-element) represents a footer for its nearest ancestor [sectioning content](https://html.spec.whatwg.org/multipage/dom.html#sectioning-content-2) element, or for the [body element](https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2) if there is no such ancestor. A footer typically contains information about its section such as who wrote it, links to related documents, copyright data, and the like.
 * 
 * When the [footer element](https://html.spec.whatwg.org/multipage/sections.html#the-footer-element) contains entire sections, they represent appendices, indices, long colophons, verbose license agreements, and other such content.
 */
export function Footer(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="footer"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
