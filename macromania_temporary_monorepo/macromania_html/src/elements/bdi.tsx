import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [bdi element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-bdi-element) represents a span of text that is to be isolated from its surroundings for the purposes of bidirectional text formatting. 
 */
export function Bdi(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="bdi"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
