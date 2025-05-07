import { Expression, Expressions } from "../../deps.ts";
import { AOrAreaLinkProps, RenderAOrAreaAttributes } from "../aOrArea.tsx";
import { RenderExpression, RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * Props for the {@linkcode A} macro.
 *
 * https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element
 */
export type AProps = AOrAreaLinkProps & {
  /**
   *  The [hreflang attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-hreflang) on [a](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element) elements that create [hyperlinks](https://html.spec.whatwg.org/multipage/links.html#hyperlink), if present, gives the language of the linked resource. It is purely advisory. The value must be a valid [BCP 47 language tag](https://www.rfc-editor.org/info/bcp47). User agents must not consider this attribute authoritative — upon fetching the resource, user agents must use only language information associated with the resource to determine its language, not metadata included in the link to the resource.
   */
  hreflang?: Expression;
  /**
   * The [type attribute](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-type), if present, gives the [MIME type](https://mimesniff.spec.whatwg.org/#mime-type) of the linked resource. It is purely advisory. The value must be a [valid MIME type string](https://mimesniff.spec.whatwg.org/#valid-mime-type). User agents must not consider the type attribute authoritative — upon fetching the resource, user agents must not use metadata included in the link to the resource to determine its type.
   */
  type?: Expression;
};

/**
 * The [a element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element).
 */
export function A(
  props: AProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="a"
      attrs={<RenderAAttributes attrs={props} />}
      children={props.children}
    />
  );
}

export function RenderAAttributes(
  { attrs }: { attrs?: AProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderAOrAreaAttributes attrs={attrs} />
      {attrs.hreflang !== undefined
        ? <RenderExpression attr="hreflang" value={attrs.hreflang} />
        : ""}
      {attrs.type !== undefined
        ? <RenderExpression attr="type" value={attrs.type} />
        : ""}
    </>
  );
}
