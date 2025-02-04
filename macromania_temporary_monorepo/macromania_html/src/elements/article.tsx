import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [article element](https://html.spec.whatwg.org/multipage/sections.html#the-article-element) represents a complete, or self-contained, composition in a document, page, application, or site and that is, in principle, independently distributable or reusable, e.g. in syndication. This could be a forum post, a magazine or newspaper article, a blog entry, a user-submitted comment, an interactive widget or gadget, or any other independent item of content.

When [article elements](https://html.spec.whatwg.org/multipage/sections.html#the-article-element) are nested, the inner [article elements](https://html.spec.whatwg.org/multipage/sections.html#the-article-element) represent articles that are in principle related to the contents of the outer article. For instance, a blog entry on a site that accepts user-submitted comments could represent the comments as [article elements](https://html.spec.whatwg.org/multipage/sections.html#the-article-element) nested within the [article element](https://html.spec.whatwg.org/multipage/sections.html#the-article-element) for the blog entry.
 */
export function Article(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="article"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
