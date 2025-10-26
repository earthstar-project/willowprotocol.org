import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [figcaption element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figcaption-element) represents a caption or legend for the rest of the contents of the [figcaption element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figcaption-element's parent [figure element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element), if any.
 */
export function Figcaption(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="figcaption"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
