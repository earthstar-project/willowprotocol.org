import { Expression, Expressions } from "../../deps.ts";
import { RenderExpression, RenderNonVoidElement } from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderSpaceSeparatedList } from "../renderUtils.tsx";
import { PossiblyBlockingToken } from "../shared.tsx";

/**
 * Props for the {@linkcode Style} macro.
 *
 * https://html.spec.whatwg.org/multipage/semantics.html#the-style-element
 */
export type StyleProps = {
  /**
   * The [media attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-style-media) says which media the styles apply to. The value must be a [valid media query list](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-media-query-list). The user agent must apply the styles when the [media attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-style-media)'s value [matches the environment](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#matches-the-environment) and the other relevant conditions apply, and must not apply them otherwise.
   */
  media?: Expression;
  /**
   * The [blocking attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-style-blocking).
   */
  blocking?: PossiblyBlockingToken[] | PossiblyBlockingToken;
} & TagProps;

/**
 * The [style element](https://html.spec.whatwg.org/multipage/semantics.html#the-style-element) allows authors to embed CSS style sheets in their documents. The element does not represent content for the user.
 */
export function Style(
  props: StyleProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="style"
      attrs={<RenderStyleAttributes attrs={props} />}
    >
      <exps x={props.children} />
    </RenderNonVoidElement>
  );
}

function RenderStyleAttributes(
  { attrs }: { attrs?: StyleProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.media !== undefined
        ? <RenderExpression attr="media" value={attrs.media} />
        : ""}
      {attrs.blocking !== undefined
        ? <RenderSpaceSeparatedList attr="blocking" value={attrs.blocking} />
        : ""}
    </>
  );
}
