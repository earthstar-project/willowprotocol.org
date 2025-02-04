import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [figure element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element) represents some [flow content](https://html.spec.whatwg.org/multipage/dom.html#flow-content-2), optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document.
 */
export function Figure(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="figure"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
