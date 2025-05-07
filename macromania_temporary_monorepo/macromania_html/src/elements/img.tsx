import { Expression, Expressions } from "../../deps.ts";
import {
  RenderBoolean,
  RenderEnum,
  RenderExpression,
  RenderNonVoidElement,
  RenderNumber,
  RenderVoidElement,
} from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { CrossOrigin, FetchPriority } from "../shared.tsx";

/**
 * Props for the {@linkcode Img} macro.
 *
 * https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element
 */
export type ImgProps = {
  /**
   * Replacement text for use when images are not available.
   *
   * The value of the [alt attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-alt) provides equivalent content for those who cannot process images or who have image loading disabled (i.e. it is the img element's [fallback content](https://html.spec.whatwg.org/multipage/dom.html#fallback-content)).
   */
  alt?: Expressions;
  /**
   * The [src attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-src) gives the address of the resource.
   */
  src?: Expressions;
  /**
   * The [srcset attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-srcset) indicates the images to use in different situations, e.g., high-resolution displays, small monitors, etc. (for [rel](https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel)="[preload](https://html.spec.whatwg.org/multipage/links.html#link-type-preload)"). It is a [srcset attribute](https://html.spec.whatwg.org/multipage/images.html#srcset-attribute).
   */
  srcset?: Expressions;
  /**
   * If the [srcset attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-srcset) is present and has any [image candidate strings](https://html.spec.whatwg.org/multipage/images.html#image-candidate-string) using a [width descriptor](https://html.spec.whatwg.org/multipage/images.html#width-descriptor), the [sizes attribute](hhttps://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-sizes) must also be present, and is a [sizes attribute](https://html.spec.whatwg.org/multipage/images.html#sizes-attribute). The [sizes attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-sizes) contributes the [source size](https://html.spec.whatwg.org/multipage/images.html#source-size-2) to the [source set](https://html.spec.whatwg.org/multipage/images.html#source-set) (if no [source element](https://html.spec.whatwg.org/multipage/embedded-content.html#the-source-element) was selected).
   */
  sizes?: Expressions;
  /**
   * The [crossorigin attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-crossorigin) is a [CORS settings attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attribute). Its purpose is to allow images from third-party sites that allow cross-origin access to be used with [canvas](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element).
   */
  crossorigin?: CrossOrigin;
  /**
   * The [usemap attribute](https://html.spec.whatwg.org/multipage/image-maps.html#attr-hyperlink-usemap) gives the name of an [image map](https://html.spec.whatwg.org/multipage/image-maps.html#image-map) to use.  It must be a valid [hash-name reference](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-hash-name-reference) to a [map element](https://html.spec.whatwg.org/multipage/image-maps.html#the-map-element).
   */
  usemap?: Expressions;
  /**
   * The [ismap attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-ismap), when used on an element that is a descendant of an [a element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element) with an [href attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href), indicates by its presence that the element provides access to a server-side image map. This affects how events are handled on the corresponding [a element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element).
   */
  ismap?: boolean;
  /**
   * The [width attribute](https://html.spec.whatwg.org/multipage/embedded-content-other.html#attr-dim-width) specifies the horizontal dimension. It is a [dimension attribute](https://html.spec.whatwg.org/multipage/embedded-content-other.html#dimension-attributes), i.e., a [valid non-negative integer](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer).
   */
  width?: number;
  /**
   * The [height attribute](https://html.spec.whatwg.org/multipage/embedded-content-other.html#attr-dim-height) specifies the vertical dimension. It is a [dimension attribute](https://html.spec.whatwg.org/multipage/embedded-content-other.html#dimension-attributes), i.e., a [valid non-negative integer](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer).
   */
  height?: number;
  /**
   * The [referrerpolicy attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-referrerpolicy) is a [referrer policy attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#referrer-policy-attribute). Its purpose is to set the [referrer policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy) used when [fetching](https://fetch.spec.whatwg.org/#concept-fetch) the image.
   */
  referrerpolicy?: ReferrerPolicy;
  /**
   * The [decoding attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-decoding) indicates the preferred method to [decode](https://html.spec.whatwg.org/multipage/images.html#img-decoding-process) this image. The attribute, if present, must be an [image decoding hint](https://html.spec.whatwg.org/multipage/images.html#image-decoding-hint). This attribute's [missing value default](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#missing-value-default) and [invalid value default](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#invalid-value-default) are both the [auto](https://html.spec.whatwg.org/multipage/images.html#attr-img-decoding-auto-state) state.
   */
  decoding?: "sync" | "async" | "auto";
  /**
   * The [loading attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-loading) is a [lazy loading attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attribute). Its purpose is to indicate the policy for loading images that are outside the viewport.
   */
  loading?: "lazy" | "eager";
  /**
   * The [fetchpriority attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-fetchpriority) is a [fetch priority attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#fetch-priority-attribute). Its purpose is to set the [priority](https://fetch.spec.whatwg.org/#request-priority) used when [fetching](https://fetch.spec.whatwg.org/#concept-fetch) the image.
   */
  fetchpriority?: FetchPriority;
} & TagProps;

/**
 * The [canvas element](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element) provides scripts with a resolution-dependent bitmap canvas, which can be used for rendering graphs, game graphics, art, or other visual images on the fly.
 */
export function Img(
  props: ImgProps & { children?: Expressions },
): Expression {
  return (
    <RenderVoidElement
      name="img"
      attrs={<RenderImgAttributes attrs={props} />}
    />
  );
}

function RenderImgAttributes(
  { attrs }: { attrs?: ImgProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.alt !== undefined
        ? <RenderExpression attr="alt" value={<exps x={attrs.alt} />} />
        : ""}
      {attrs.src !== undefined
        ? <RenderExpression attr="src" value={<exps x={attrs.src} />} />
        : ""}
      {attrs.srcset !== undefined
        ? <RenderExpression attr="srcset" value={<exps x={attrs.srcset} />} />
        : ""}
      {attrs.sizes !== undefined
        ? <RenderExpression attr="sizes" value={<exps x={attrs.sizes} />} />
        : ""}
      {attrs.crossorigin !== undefined
        ? <RenderEnum attr="crossorigin" value={attrs.crossorigin} />
        : ""}
      {attrs.usemap !== undefined
        ? <RenderExpression attr="usemap" value={<exps x={attrs.usemap} />} />
        : ""}
      {attrs.ismap !== undefined
        ? <RenderBoolean attr="ismap" value={attrs.ismap} />
        : ""}
      {attrs.width !== undefined
        ? <RenderNumber attr="width" value={attrs.width} />
        : ""}
      {attrs.height !== undefined
        ? <RenderNumber attr="height" value={attrs.height} />
        : ""}
      {attrs.referrerpolicy !== undefined
        ? <RenderEnum attr="referrerpolicy" value={attrs.referrerpolicy} />
        : ""}
      {attrs.decoding !== undefined
        ? <RenderEnum attr="decoding" value={attrs.decoding} />
        : ""}
      {attrs.loading !== undefined
        ? <RenderEnum attr="loading" value={attrs.loading} />
        : ""}
      {attrs.fetchpriority !== undefined
        ? <RenderEnum attr="fetchpriority" value={attrs.fetchpriority} />
        : ""}
    </>
  );
}
