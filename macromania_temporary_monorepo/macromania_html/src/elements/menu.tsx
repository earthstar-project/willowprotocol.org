import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [menu element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-menu-element) represents a toolbar consisting of its contents, in the form of an unordered list of items (represented by [li elements](https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element)), each of which represents a command that the user can perform or activate.
 */
export function Menu(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="menu"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
