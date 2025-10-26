import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [head element](https://html.spec.whatwg.org/multipage/semantics.html#the-head-element) represents a collection of metadata for the Document.
 */
export function Head(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="head"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
