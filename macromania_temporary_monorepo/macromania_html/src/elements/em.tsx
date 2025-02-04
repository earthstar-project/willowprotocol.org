import { Expression, Expressions, LatexMacro, shouldEmitLatex } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [em element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-em-element) represents stress emphasis of its contents.
 */
export function Em(
  props: TagProps & { children?: Expressions },
): Expression {
  return <impure fun={(ctx) => {
    if (shouldEmitLatex(ctx)) {
      return <LatexMacro name="textit"><exps x={props.children}/></LatexMacro>
    } else {
      return (
        <RenderNonVoidElement
          name="em"
          attrs={<RenderGlobalAttributes attrs={props} />}
          children={props.children}
        />
      );
    }
  }}/>;
}
