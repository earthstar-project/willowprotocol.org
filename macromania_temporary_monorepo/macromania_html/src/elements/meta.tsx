import { Expression, Expressions } from "../../deps.ts";
import {
  EscapeHtml,
  RenderBoolean,
  RenderExpression,
  RenderSpaceSeparatedList,
  RenderVoidElement,
} from "../renderUtils.tsx";

import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderEnum } from "../renderUtils.tsx";
import { CrossOrigin } from "../shared.tsx";

/**
 * Props for the {@linkcode Meta} macro.
 *
 * https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
 */
export type MetaProps = {
  /**
   * If a [meta element](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element) has a [name attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-name), it sets document metadata. Document metadata is expressed in terms of name-value pairs, the [name attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-name) on the [meta element](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element) giving the name, and the [content attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-content) on the same element giving the value. The name specifies what aspect of metadata is being set; valid names and the meaning of their values are described in the following sections. If a [meta element](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element) has no [content attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-content), then the value part of the metadata name-value pair is the empty string.
   */
  name?:
    | "application-name"
    | "author"
    | "description"
    | "generator"
    | "keywords"
    | "referrer"
    | "theme-color"
    | "color-scheme"
    | "viewport";
  /**
   * When the [http-equiv attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv) is specified on a [meta element](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element), the element is a pragma directive.
   */
  httpEquiv?:
    | "content-type"
    | "default-style"
    | "refresh"
    | "x-ua-compatible"
    | "content-security-policy";
  /**
   * The [content attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-content) gives the value of the document metadata or pragma directive when the element is used for those purposes. The allowed values depend on the exact context.
   */
  content?: Expression;
  /**
   * The [charset attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-charset) specifies the [character encoding](https://encoding.spec.whatwg.org/#encoding) used by the document. This is a [character encoding declaration](https://html.spec.whatwg.org/multipage/semantics.html#character-encoding-declaration). If the attribute is present, its value must be an ASCII case-insensitive match for the string `"utf-8"`.
   */
  charset?: "utf-8";
  /**
   * The [media attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-media) says which media the metadata applies to. The value must be a [valid media query list](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-media-query-list). Unless the [name](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-name) is `"theme-color"`, the [media attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-media) has no effect on the processing model and must not be used by authors.
   */
  media?: Expression;
} & TagProps;

/**
 * The [meta element](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element) represents various kinds of metadata that cannot be expressed using the [title](https://html.spec.whatwg.org/multipage/semantics.html#the-title-element), [base](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element), [link](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element), [style](https://html.spec.whatwg.org/multipage/semantics.html#the-style-element), and [script](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element) elements.
 */
export function Meta(
  props: MetaProps,
): Expression {
  return (
    <RenderVoidElement
      name="meta"
      attrs={<RenderMetaAttributes attrs={props} />}
    />
  );
}

function RenderMetaAttributes(
  { attrs }: { attrs?: MetaProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.name !== undefined
        ? <RenderEnum attr="name" value={attrs.name} />
        : ""}
      {attrs.httpEquiv !== undefined
        ? <RenderEnum attr="http-equiv" value={attrs.httpEquiv} />
        : ""}
      {attrs.content !== undefined
        ? <RenderExpression attr="content" value={attrs.content} />
        : ""}
      {attrs.charset !== undefined
        ? <RenderEnum attr="charset" value={attrs.charset} />
        : ""}
      {attrs.media !== undefined
        ? <RenderExpression attr="media" value={attrs.media} />
        : ""}
    </>
  );
}
