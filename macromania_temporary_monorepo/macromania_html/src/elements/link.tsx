import { Expression, Expressions } from "../../deps.ts";
import {
  EscapeHtml,
  RenderBoolean,
  RenderExpression,
  RenderSpaceSeparatedList,
  RenderVoidElement,
} from "../renderUtils.tsx";
import { FetchPriority, ReferrerPolicy } from "../shared.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderEnum } from "../renderUtils.tsx";
import { CrossOrigin, PossiblyBlockingToken } from "../shared.tsx";

/**
 * Props for the {@linkcode Link} macro.
 *
 * https://html.spec.whatwg.org/multipage/semantics.html#the-link-element
 */
export type LinkProps = {
  /**
   * The address of the link(s) is given by the [href attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-href). If the [href attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-href) is present, then its value must be a valid non-empty URL potentially surrounded by spaces. One or both of the [href](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-href) or [imagesrcset](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset) attributes must be present.
   */
  href?: Expression;
  /**
   * The [crossorigin attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-crossorigin) is a [CORS settings attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attribute). It is intended for use with [external resource links](https://html.spec.whatwg.org/multipage/links.html#external-resource-link).
   */
  crossorigin?: CrossOrigin;
  /**
   * The [rel attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel) indicates relationship between the document containing the hyperlink and the destination resource.
   */
  rel?: LinkLinkType; // TODO https://html.spec.whatwg.org/multipage/links.html#linkTypes
  /**
   * The [media attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-media) says which media the resource applies to. The value must be a valid [media query list](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-media-query-list).
   */
  media?: Expression;
  /**
   * The [integrity attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-integrity) represents the [integrity metadata](https://fetch.spec.whatwg.org/#concept-request-integrity-metadata) for requests which this element is responsible for. The attribute must only be specified on [link elements](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) that have a [rel attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel) that contains the [`stylesheet`](https://html.spec.whatwg.org/multipage/links.html#link-type-stylesheet), [`preload`](https://html.spec.whatwg.org/multipage/links.html#link-type-preload), or [`modulepreload`](https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload) keyword.
   */
  integrity?: Expression;
  /**
   * The [hreflang attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-hreflang), if present, gives the language of the linked resource. It is purely advisory. The value must be a valid [BCP 47 language tag](https://www.rfc-editor.org/info/bcp47). User agents must not consider this attribute authoritative — upon fetching the resource, user agents must use only language information associated with the resource to determine its language, not metadata included in the link to the resource.
   */
  hreflang?: Expression;
  /**
   * The [type attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-type) gives the [MIME type](https://mimesniff.spec.whatwg.org/#mime-type) of the linked resource. It is purely advisory. The value must be a [valid MIME type string](https://mimesniff.spec.whatwg.org/#valid-mime-type).
   *
   * For [external resource links](https://html.spec.whatwg.org/multipage/links.html#external-resource-link), the [type attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-type) is used as a hint to user agents so that they can avoid fetching resources they do not support.
   */
  type?: Expression;
  /**
   * The [referrerpolicy attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-referrerpolicy) is intended for use with [external resource links](https://html.spec.whatwg.org/multipage/links.html#external-resource-link), where it helps set the [referrer policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy) used when [fetching and processing the linked resource](https://html.spec.whatwg.org/multipage/semantics.html#fetch-and-process-the-linked-resource).
   */
  referrerpolicy?: ReferrerPolicy;
  /**
   * The [sizes attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-sizes) gives the sizes of icons for visual media. Its value, if present, is merely advisory. User agents may use the value to decide which icon(s) to use if multiple icons are available. The attribute must only be specified on [link elements](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) that have a [rel attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel) that specifies the [icon](https://html.spec.whatwg.org/multipage/links.html#rel-icon) keyword or the `apple-touch-icon` keyword (which is registered as an extension but not part of html proper).
   */
  sizes?: SizeEntry[] | SizeEntry;
  /**
   * The [imagesrcset attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset) indicates the images to use in different situations, e.g., high-resolution displays, small monitors, etc. (for [rel](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel)="[preload](https://html.spec.whatwg.org/multipage/links.html#link-type-preload)"). It is a [srcset attribute](https://html.spec.whatwg.org/multipage/images.html#srcset-attribute).
   */
  imagesrcset?: Expression;
  /**
   * If the [imagesrcset attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset) is present and has any [image candidate strings](https://html.spec.whatwg.org/multipage/images.html#image-candidate-string) using a [width descriptor](https://html.spec.whatwg.org/multipage/images.html#width-descriptor), the [imagesizes attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesizes) must also be present, and is a [sizes attribute](https://html.spec.whatwg.org/multipage/images.html#sizes-attribute). The [imagesizes attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesizes) contributes the [source size](https://html.spec.whatwg.org/multipage/images.html#source-size-2) to the [source set](https://html.spec.whatwg.org/multipage/images.html#source-set).
   */
  imagesizes?: Expression;
  /**
   * The [as attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-as) specifies the [potential destination](https://fetch.spec.whatwg.org/#concept-potential-destination) for a preload request for the resource given by the [href attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-href). It is an enumerated attribute. The attribute must be specified on [link elements](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) that have a [rel attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel) that contains the [preload](https://html.spec.whatwg.org/multipage/links.html#link-type-preload) keyword. It may be specified on [link elements](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) that have a [rel attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel) attribute that contains the [modulepreload](https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload) keyword; in such cases it must have a value which is a [script-like destination]. For other [link elements](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element), it must not be specified.
   */
  as?: PotentialDestination;
  /**
   * The [blocking attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-blocking) is used by link type [stylesheet](https://html.spec.whatwg.org/multipage/links.html#link-type-stylesheet), and it must only be specified on link elements that have a [rel attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel) containing that keyword.
   *
   * See https://html.spec.whatwg.org/multipage/urls-and-fetching.html#blocking-attribute
   */
  blocking?: PossiblyBlockingToken[] | PossiblyBlockingToken;
  /**
   * The [disabled attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-disabled) is a boolean attribute that is used with the [stylesheet](https://html.spec.whatwg.org/multipage/links.html#link-type-stylesheet) link type.
   */
  disabled?: boolean;
  /**
   * The [fetchpriority attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-fetchpriority) is intended for use with [external resource links](https://html.spec.whatwg.org/multipage/links.html#external-resource-link), where it is used to set the [priority](https://fetch.spec.whatwg.org/#request-priority) used when [fetching and processing the linked resource](https://html.spec.whatwg.org/multipage/semantics.html#fetch-and-process-the-linked-resource).
   */
  fetchpriority?: FetchPriority;
} & TagProps;

/**
 * The [link element](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) allows authors to link their document to other resources.
 */
export function Link(
  props: LinkProps,
): Expression {
  return (
    <RenderVoidElement
      name="link"
      attrs={<RenderLinkAttributes attrs={props} />}
    />
  );
}

function RenderLinkAttributes(
  { attrs }: { attrs?: LinkProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.href !== undefined
        ? <RenderExpression attr="href" value={attrs.href} />
        : ""}
      {attrs.rel !== undefined
        ? <RenderEnum attr="rel" value={attrs.rel} />
        : ""}
      {attrs.media !== undefined
        ? <RenderExpression attr="media" value={attrs.media} />
        : ""}
      {attrs.integrity !== undefined
        ? <RenderExpression attr="integrity" value={attrs.integrity} />
        : ""}
      {attrs.hreflang !== undefined
        ? <RenderExpression attr="hreflang" value={attrs.hreflang} />
        : ""}
      {attrs.type !== undefined
        ? <RenderExpression attr="type" value={attrs.type} />
        : ""}
      {attrs.referrerpolicy !== undefined
        ? <RenderEnum attr="referrerpolicy" value={attrs.referrerpolicy} />
        : ""}
      {attrs.crossorigin !== undefined
        ? <RenderEnum attr="crossorigin" value={attrs.crossorigin} />
        : ""}
      {attrs.sizes !== undefined ? <RenderSizes sizes={attrs.sizes} /> : ""}
      {attrs.imagesrcset !== undefined
        ? <RenderExpression attr="imagesrcset" value={attrs.imagesrcset} />
        : ""}
      {attrs.imagesizes !== undefined
        ? <RenderExpression attr="imagesizes" value={attrs.imagesizes} />
        : ""}
      {attrs.as !== undefined ? <RenderEnum attr="as" value={attrs.as} /> : ""}
      {attrs.blocking !== undefined
        ? <RenderSpaceSeparatedList attr="blocking" value={attrs.blocking} />
        : ""}
      {attrs.disabled !== undefined
        ? <RenderBoolean attr="disabled" value={attrs.disabled} />
        : ""}
      {attrs.fetchpriority !== undefined
        ? <RenderEnum attr="fetchpriority" value={attrs.fetchpriority} />
        : ""}
    </>
  );
}

/**
 * https://fetch.spec.whatwg.org/#concept-potential-destination
 */
export type PotentialDestination =
  | "fetch"
  | Destination;

/**
 * https://fetch.spec.whatwg.org/#concept-request-destination
 */
export type Destination =
  | ""
  | "audio"
  | "audioworklet"
  | "document"
  | "embed"
  | "font"
  | "frame"
  | "iframe"
  | "image"
  | "json"
  | "manifest"
  | "object"
  | "paintworklet"
  | "report"
  | "script"
  | "serviceworker"
  | "sharedworker"
  | "style"
  | "track"
  | "video"
  | "webidentity"
  | "worker"
  | "xslt";

/**
 * See https://html.spec.whatwg.org/multipage/semantics.html#attr-link-sizes
 */
export type SizeEntry = "any" | { width: number; height: number };

function RenderSizes(
  { sizes }: { sizes: SizeEntry[] | SizeEntry },
): Expression {
  const exps: Expression[] = [];

  const sizes_ = Array.isArray(sizes) ? sizes : [sizes];

  let first = true;
  for (const part of sizes_) {
    if (!first) {
      exps.push(" ");
    }

    if (typeof part === "string") {
      exps.push(<EscapeHtml>{part}</EscapeHtml>);
    } else {
      exps.push(<EscapeHtml>{`${part.width}`}</EscapeHtml>);
      exps.push("x");
      exps.push(<EscapeHtml>{`${part.height}`}</EscapeHtml>);
    }

    first = false;
  }

  return <>{" "}sizes="{<fragment exps={exps} />}"</>;
}

/**
 * A [link type](https://html.spec.whatwg.org/multipage/links.html#linkTypes) that is allowed on [link elements](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element).
 */
export type LinkLinkType =
  | "alternate"
  | "canonical"
  | "author"
  | "dns-prefetch"
  | "help"
  | "icon"
  | "manifest"
  | "modulepreload"
  | "license"
  | "next"
  | "pingback"
  | "preconnect"
  | "prefetch"
  | "preload"
  | "prev"
  | "privacy-policy"
  | "search"
  | "stylesheet"
  | "terms-of-service"
  | "apple-touch-icon";
