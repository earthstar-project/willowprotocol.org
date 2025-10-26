import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [h1 element](https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements) represents a heading for its section.
 *
 * See also https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines
 */
export function H1(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="h1"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}

/**
 * The [h2 element](https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements) represents a heading for its section.
 *
 * See also https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines
 */
export function H2(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="h2"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}

/**
 * The [h3 element](https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements) represents a heading for its section.
 *
 * See also https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines
 */
export function H3(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="h3"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}

/**
 * The [h4 element](https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements) represents a heading for its section.
 *
 * See also https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines
 */
export function H4(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="h4"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}

/**
 * The [h5 element](https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements) represents a heading for its section.
 *
 * See also https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines
 */
export function H5(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="h5"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}

/**
 * The [h6 element](https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements) represents a heading for its section.
 *
 * See also https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines
 */
export function H6(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="h6"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
