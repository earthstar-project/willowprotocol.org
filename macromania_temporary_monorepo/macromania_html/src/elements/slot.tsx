import { Expression, Expressions } from "../../deps.ts";
import {
  RenderBoolean,
  RenderEnum,
  RenderExpression,
  RenderNonVoidElement,
} from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Slot} macro.
 *
 * https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element
 */
export type SlotProps = {
  /**
   * The [name attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-slot-name) may contain any string value. It represents a [slot](https://dom.spec.whatwg.org/#concept-slot)'s [name](https://dom.spec.whatwg.org/#slot-name).
   */
  name?: Expression;
} & TagProps;

/**
 * The [slot element](https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element) defines a [slot](https://dom.spec.whatwg.org/#concept-slot). It is typically used in a [shadow tree](https://dom.spec.whatwg.org/#concept-shadow-tree). A [slot element](https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element) represents its [assigned nodes](https://dom.spec.whatwg.org/#slot-assigned-nodes), if any, and its contents otherwise.
 */
export function Slot(
  props: SlotProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="slot"
      attrs={<RenderSlotAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderSlotAttributes(
  { attrs }: { attrs?: SlotProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.name !== undefined
        ? <RenderExpression attr="name" value={attrs.name} />
        : ""}
    </>
  );
}
