import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [bdo element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-bdo-element) represents explicit text directionality formatting control for its children. It allows authors to override the Unicode bidirectional algorithm by explicitly specifying a direction override.
 * 
 * Authors must specify the [dir attribute](https://html.spec.whatwg.org/multipage/dom.html#attr-dir) on this element, with the value `ltr` to specify a left-to-right override and with the value `rtl` to specify a right-to-left override. The `auto` value must not be specified.
 */
export function Bdo(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="bdo"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
