import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [table element](https://html.spec.whatwg.org/multipage/tables.html#the-table-element) represents data with more than one dimension, in the form of a [table](https://html.spec.whatwg.org/multipage/tables.html#concept-table).

The [table element](https://html.spec.whatwg.org/multipage/tables.html#the-table-element) takes part in the [table model](https://html.spec.whatwg.org/multipage/tables.html#table-model). Tables have rows, columns, and cells given by their descendants. The rows and columns form a grid; a table's cells must completely cover that grid without overlap.
 */
export function Table(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="table"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
