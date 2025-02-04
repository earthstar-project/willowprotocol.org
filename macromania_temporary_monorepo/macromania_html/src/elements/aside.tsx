import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [aside element](https://html.spec.whatwg.org/multipage/sections.html#the-aside-element) represents a section of a page that consists of content that is tangentially related to the content around the [aside element](https://html.spec.whatwg.org/multipage/sections.html#the-aside-element), and which could be considered separate from that content. Such sections are often represented as sidebars in printed typography.

The element can be used for typographical effects like pull quotes or sidebars, for advertising, for groups of [nav elements](https://html.spec.whatwg.org/multipage/sections.html#the-nav-element), and for other content that is considered separate from the main content of the page.
 */
export function Aside(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="aside"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
