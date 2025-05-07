import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [hgroup element](https://html.spec.whatwg.org/multipage/sections.html#the-hgroup-element) represents a heading and related content. The element may be used to group an [h1–h6 element](https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements) with one or more [p elements](https://html.spec.whatwg.org/multipage/grouping-content.html#the-p-element) containing content representing a subheading, alternative title, or tagline.
 */
export function Hgroup(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="hgroup"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
