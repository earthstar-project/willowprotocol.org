import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [search element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-search-element) represents a part of a document or application that contains a set of form controls or other content related to performing a search or filtering operation. This could be a search of the web site or application; a way of searching or filtering search results on the current web page; or a global or Internet-wide search function.
 */
export function Search(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="search"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
