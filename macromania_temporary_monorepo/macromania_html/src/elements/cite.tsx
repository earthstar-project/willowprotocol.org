import { shouldEmitLatex, LatexMacro } from "../../../mod.tsx";
import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [cite element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-cite-element) represents the title of a work (e.g. a book, a paper, an essay, a poem, a score, a song, a script, a film, a TV show, a game, a sculpture, a painting, a theatre production, a play, an opera, a musical, an exhibition, a legal case report, a computer program, etc.). This can be a work that is being quoted or referenced in detail (i.e., a citation), or it can just be a work that is mentioned in passing.
 */
export function Cite(
  props: TagProps & { children?: Expressions },
): Expression {
  return <impure fun={(ctx) => {
    if (shouldEmitLatex(ctx)) {
      return <LatexMacro name="textit"><exps x={props.children}/></LatexMacro>
    } else {
      return (
        <RenderNonVoidElement
          name="cite"
          attrs={<RenderGlobalAttributes attrs={props} />}
          children={props.children}
        />
      );
    }
  }}/>;
}
