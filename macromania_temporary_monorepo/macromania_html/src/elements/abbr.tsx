import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [abbr element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-abbr-element) represents an abbreviation or acronym, optionally with its expansion. The [title attribute](https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-abbr-title) may be used to provide an expansion of the abbreviation. The attribute, if specified, must contain an expansion of the abbreviation, and nothing else.
 */
export function Abbr(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="abbr"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
