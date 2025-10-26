import { Expression, Expressions } from "../../deps.ts";
import { RenderExpression, RenderNonVoidElement } from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Data} macro.
 *
 * https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-q-element
 */
export type DataProps = {
  /**
   * The [value attribute](https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-data-value) must be present. Its value must be a representation of the element's contents in a machine-readable format.
   */
  value: Expression;
} & TagProps;

/**
 * The [data element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-data-element) represents its contents, along with a machine-readable form of those contents in the [value attribute](https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-data-value).
 */
export function Data(
  props: DataProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="data"
      attrs={<RenderDataAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderDataAttributes(
  { attrs }: { attrs?: DataProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      <RenderExpression attr="value" value={attrs.value} />
    </>
  );
}
