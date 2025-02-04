import { shouldEmitLatex, LatexMacro } from "../../../mod.tsx";
import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [dfn element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element) represents the defining instance of a term. The [paragraph](https://html.spec.whatwg.org/multipage/dom.html#paragraph), [description list group](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element), or [section](https://html.spec.whatwg.org/multipage/dom.html#sectioning-content-2) that is the nearest ancestor of the [dfn element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element) must also contain the definition(s) for the [term](https://html.spec.whatwg.org/multipage/text-level-semantics.html#defining-term) given by the [dfn element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element).
 */
export function Dfn(
  props: TagProps & { children?: Expressions },
): Expression {
  return <impure fun={(ctx) => {
    if (shouldEmitLatex(ctx)) {
      return <LatexMacro name="textit"><exps x={props.children}/></LatexMacro>
    } else {
      return (
        <RenderNonVoidElement
          name="dfn"
          attrs={<RenderGlobalAttributes attrs={props} />}
          children={props.children}
        />
      );
    }
  }}/>;
}
