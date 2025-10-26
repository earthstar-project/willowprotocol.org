import { Expression, Expressions } from "../../deps.ts";
import {
  RenderBoolean,
  RenderExpression,
  RenderNonVoidElement,
} from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Details} macro.
 *
 * https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element
 */
export type DetailsProps = {
  /**
   * The [name content attribute](https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-name) gives the name of the group of related details elements that the element is a member of. Opening one member of this group causes other members of the group to close. If the attribute is specified, its value must not be the empty string.
   */
  name?: Expression;
  /**
   * The [open content attribute](https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-open), if present, indicates that both the summary and the additional information is to be shown to the user. If the attribute is absent, only the summary is to be shown.
   */
  open?: boolean;
} & TagProps;

/**
 * The [details element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element) represents a disclosure widget from which the user can obtain additional information or controls.
 */
export function Details(
  props: DetailsProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="details"
      attrs={<RenderDetailsAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderDetailsAttributes(
  { attrs }: { attrs?: DetailsProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.name !== undefined
        ? <RenderExpression attr="name" value={attrs.name} />
        : ""}
      {attrs.open !== undefined
        ? <RenderBoolean attr="open" value={attrs.open} />
        : ""}
    </>
  );
}
