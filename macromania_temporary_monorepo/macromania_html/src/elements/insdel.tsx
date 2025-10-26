import { Expression, Expressions } from "../../deps.ts";
import {
  EscapeHtml,
  RenderBoolean,
  RenderExpression,
  RenderNonVoidElement,
  RenderSpaceSeparatedList,
} from "../renderUtils.tsx";

import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderEnum } from "../renderUtils.tsx";
import { CrossOrigin } from "../shared.tsx";

/**
 * Props for the {@linkcode Ins} and {@linkcode Del} macro.
 *
 * https://html.spec.whatwg.org/multipage/edits.html#attr-mod-cite
 */
export type InsDelProps = {
  /**
   * The [cite attribute](https://html.spec.whatwg.org/multipage/edits.html#attr-mod-cite) may be used to specify the URL of a document that explains the change. When that document is long, for instance the minutes of a meeting, authors are encouraged to include a [fragment](https://url.spec.whatwg.org/#concept-url-fragment) pointing to the specific part of that document that discusses the change.
   *
   * If the [cite attribute](https://html.spec.whatwg.org/multipage/edits.html#attr-mod-cite) is present, it must be a valid URL potentially surrounded by spaces. To obtain the corresponding citation link, the value of the attribute must be [parsed](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#encoding-parsing-a-url) relative to the element's [node document](https://dom.spec.whatwg.org/#concept-node-document). User agents may allow users to follow such citation links, but they are primarily intended for private use (e.g., by server-side scripts collecting statistics about a site's use of quotations), not for readers.
   */
  cite?: Expression;
  /**
   * The [datetime attribute](https://html.spec.whatwg.org/multipage/edits.html#attr-mod-datetime) may be used to specify the time and date of the change.
   * 
   * If present, the [datetime attribute](https://html.spec.whatwg.org/multipage/edits.html#attr-mod-datetime)'s value must be a [valid date string with optional time](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string-with-optional-time).
   */
  datetime?: Expression;
} & TagProps;

/**
 * The [ins element](https://html.spec.whatwg.org/multipage/edits.html#the-ins-element) represents an addition to the document.
 */
export function Ins(
  props: InsDelProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="ins"
      attrs={<RenderInsDelAttributes attrs={props} />}
      children={props.children}
    />
  );
}

/**
 * The [del element](https://html.spec.whatwg.org/multipage/edits.html#the-del-element) represents a removal from the document.
 */
export function Del(
    props: InsDelProps & { children?: Expressions },
  ): Expression {
    return (
      <RenderNonVoidElement
        name="del"
        attrs={<RenderInsDelAttributes attrs={props} />}
        children={props.children}
      />
    );
  }

function RenderInsDelAttributes(
  { attrs }: { attrs?: InsDelProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.cite !== undefined
        ? <RenderExpression attr="cite" value={attrs.cite} />
        : ""}
        {attrs.datetime !== undefined
        ? <RenderExpression attr="datetime" value={attrs.datetime} />
        : ""}
    </>
  );
}
