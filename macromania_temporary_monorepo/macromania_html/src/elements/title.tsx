import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [title element](https://html.spec.whatwg.org/multipage/semantics.html#the-title-element) represents the document's title or name. Authors should use titles that identify their documents even when they are used out of context, for example in a user's history or bookmarks, or in search results. The document's title is often different from its first heading, since the first heading does not have to stand alone when taken out of context.
 *
 * There must be no more than one [title element](https://html.spec.whatwg.org/multipage/semantics.html#the-title-element) per document.
 */
export function Title(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="title"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
