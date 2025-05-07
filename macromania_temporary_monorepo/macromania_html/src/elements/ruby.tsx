import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [ruby element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element) allows one or more spans of phrasing content to be marked with ruby annotations. Ruby annotations are short runs of text presented alongside base text, primarily used in East Asian typography as a guide for pronunciation or to include other annotations. In Japanese, this form of typography is also known as furigana.
 */
export function Ruby(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="ruby"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
