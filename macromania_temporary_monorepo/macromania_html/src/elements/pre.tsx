import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [pre element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element) represents a block of preformatted text, in which structure is represented by typographic conventions rather than by elements.
 */
export function Pre(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="pre"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
