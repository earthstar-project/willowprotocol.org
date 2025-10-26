import { Expression, Expressions } from "../../deps.ts";
import { RenderExpression, RenderNonVoidElement } from "../renderUtils.tsx";
import {
  NavigableTargetNameOrKeyword,
  RenderNavigableTargetNameOrKeyword,
} from "../aOrArea.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Base} macro.
 *
 * https://html.spec.whatwg.org/multipage/semantics.html#the-base-element
 */
export type BaseProps = {
  /**
   * The [href attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-base-href), if specified, must contain a valid URL potentially surrounded by spaces.
   *
   * A [base element](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element), if it has an [href attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-base-href), must come before any other elements in the tree that have attributes defined as taking URLs.
   */
  href?: Expression;
  /**
   * The [target attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-base-target), if specified, must contain a [valid navigable target name or keyword](https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword), which specifies which [navigable](https://html.spec.whatwg.org/multipage/document-sequences.html#navigable) is to be used as the default when [hyperlinks](https://html.spec.whatwg.org/multipage/links.html#hyperlink) and [forms](https://html.spec.whatwg.org/multipage/forms.html#the-form-element) in the Document cause [navigation](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigate).
   *
   * A [base element](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element), if it has a [target attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-base-target), must come before any elements in the tree that represent [hyperlinks](https://html.spec.whatwg.org/multipage/links.html#hyperlink).
   */
  target?: NavigableTargetNameOrKeyword;
} & TagProps;

/**
 * The [base element](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element) allows authors to specify the [document base URL](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url) for the purposes of parsing URLs, and the name of the default [navigable](https://html.spec.whatwg.org/multipage/document-sequences.html#navigable) for the purposes of [following hyperlinks](https://html.spec.whatwg.org/multipage/links.html#following-hyperlinks-2). The element does not represent any content beyond this information.
 *
 * There must be no more than one [base element](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element) per document.
 *
 * A [base element](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element) must have either an [href attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-base-href), a [target attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-base-target), or both.
 */
export function Base(
  props: BaseProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="base"
      attrs={<RenderBaseAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderBaseAttributes(
  { attrs }: { attrs?: BaseProps },
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
      {attrs.target !== undefined
        ? <RenderNavigableTargetNameOrKeyword target={attrs.target} />
        : ""}
    </>
  );
}
