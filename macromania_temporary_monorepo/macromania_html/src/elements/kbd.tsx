import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The {kbd element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-kbd-element) represents user input (typically keyboard input, although it may also be used to represent other input, such as voice commands).
 */
export function Kbd(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="kbd"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
