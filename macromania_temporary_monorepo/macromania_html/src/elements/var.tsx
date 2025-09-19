import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [var element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-var-element) represents a variable. This could be an actual variable in a mathematical expression or programming context, an identifier representing a constant, a symbol identifying a physical quantity, a function parameter, or just be a term used as a placeholder in prose.
 */
export function Var(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="var"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
