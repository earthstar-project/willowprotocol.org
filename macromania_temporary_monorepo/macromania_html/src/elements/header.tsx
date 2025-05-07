import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [header element](https://html.spec.whatwg.org/multipage/sections.html#the-header-element) represents a group of introductory or navigational aids.
 */
export function Header(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="header"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
