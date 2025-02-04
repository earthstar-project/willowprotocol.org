import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [small element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-small-element) represents side comments such as small print.
 */
export function Small(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="small"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
