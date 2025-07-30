// Common code for `<a>` and `<area>` elements, see https://html.spec.whatwg.org/multipage/links.html#links-created-by-a-and-area-elements

import { Expression } from "../deps.ts";
import {
  RenderEnum,
  RenderExpression,
  RenderSpaceSeparatedList,
} from "./renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "./global.tsx";
import { ReferrerPolicy } from "./shared.tsx";

/**
 * A [valid navigable target name or keyword](https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword) is any string that is either a [valid navigable target name](https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name) or that is an ASCII case-insensitive match for one of: `_blank`, `_self`, `_parent`, or `_top`.
 */
export type NavigableTargetNameOrKeyword =
  | "_blank"
  | "_self"
  | "_parent"
  | "_top"
  | { name: Expression };

/**
 * A [link type](https://html.spec.whatwg.org/multipage/links.html#linkTypes) that is allowed on [a](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element) and [area](https://html.spec.whatwg.org/multipage/image-maps.html#the-area-element) elements.
 */
export type AOrAreaLinkType =
  | "alternate"
  | "author"
  | "bookmark"
  | "external"
  | "help"
  | "license"
  | "next"
  | "nofollow"
  | "noopener"
  | "noreferrer"
  | "opener"
  | "prev"
  | "privacy-policy"
  | "search"
  | "tag"
  | "terms-of-service";

/**
 * Link-related props for both `<a>` and `<area>` elements, see https://html.spec.whatwg.org/multipage/links.html#links-created-by-a-and-area-elements
 *
 * Note: this does not include the [hreflang attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-hreflang) (as it is not used with `<area>` elements), nor the [type attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-type) (same reason).
 */
export type AOrAreaLinkProps = {
  /**
   * The [href attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href).
   */
  href?: Expression;
  /**
   * The [target attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-target), if present, gives the name of the [navigable](https://html.spec.whatwg.org/multipage/document-sequences.html#navigable) that will be used. User agents use this name when [following hyperlinks](https://html.spec.whatwg.org/multipage/links.html#following-hyperlinks-2).
   */
  target?: NavigableTargetNameOrKeyword;
  /**
   * The [download attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-download), if present, indicates that the author intends the hyperlink to be used for [downloading a resource](https://html.spec.whatwg.org/multipage/links.html#downloading-hyperlinks). The attribute may have a value; the value, if any, specifies the default filename that the author recommends for use in labeling the resource in a local file system. There are no restrictions on allowed values, but authors are cautioned that most file systems have limitations with regard to what punctuation is supported in filenames, and user agents are likely to adjust filenames accordingly.
   */
  download?: Expression;
  /**
   * The [ping attribute](https://html.spec.whatwg.org/multipage/links.html#ping), if present, gives the URLs of the resources that are interested in being notified if the user follows the hyperlink. The value must be a set of space-separated tokens, each of which must be a valid non-empty URL whose scheme is an HTTP(S) scheme. The value is used by the user agent for [hyperlink auditing](https://html.spec.whatwg.org/multipage/links.html#hyperlink-auditing).
   */
  ping?: Expression[] | Expression;
  /**
   * The [rel attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-rel) on [a](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element) and [area](https://html.spec.whatwg.org/multipage/image-maps.html#the-area-element) elements controls what kinds of links the elements create.
   */
  rel?: AOrAreaLinkType;
  /**
   * The [referrerpolicy attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-referrerpolicy) sets the [referrer policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy) used when [following hyperlinks](https://html.spec.whatwg.org/multipage/links.html#following-hyperlinks-2).
   */
  referrerpolicy?: ReferrerPolicy;
} & TagProps;

export function RenderAOrAreaAttributes(
  { attrs }: { attrs?: AOrAreaLinkProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.download !== undefined
        ? <RenderExpression attr="download" value={attrs.download} />
        : ""}
      {attrs.href !== undefined
        ? <RenderExpression attr="href" value={attrs.href} />
        : ""}
      {attrs.ping !== undefined
        ? <RenderSpaceSeparatedList attr="ping" value={attrs.ping} />
        : ""}
      {attrs.referrerpolicy !== undefined
        ? <RenderEnum attr="referrerpolicy" value={attrs.referrerpolicy} />
        : ""}
      {attrs.rel !== undefined
        ? <RenderEnum attr="rel" value={attrs.rel} />
        : ""}
      {attrs.target !== undefined
        ? <RenderNavigableTargetNameOrKeyword target={attrs.target} />
        : ""}
    </>
  );
}

export function RenderNavigableTargetNameOrKeyword(
  { target }: { target: NavigableTargetNameOrKeyword },
): Expression {
  if (typeof target === "string") {
    return <RenderEnum attr="target" value={target} />;
  } else {
    return <RenderExpression attr="target" value={target.name} />;
  }
}
