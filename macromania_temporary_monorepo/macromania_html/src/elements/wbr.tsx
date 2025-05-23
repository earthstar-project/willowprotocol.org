import { Expression } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderVoidElement } from "../renderUtils.tsx";

/**
 * The [wbr element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-wbr-element) represents a line break opportunity.
 */
export function Wbr(
  attrs: TagProps
): Expression {
  return (
    <RenderVoidElement
      name="wbr"
      attrs={<RenderGlobalAttributes attrs={attrs} />}
    />
  );
}
