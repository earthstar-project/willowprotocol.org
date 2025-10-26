import { Expression, Expressions } from "../../deps.ts";
import { RenderExpression, RenderNonVoidElement } from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Time} macro.
 *
 * https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element
 */
export type TimeProps = {
  /**
   * The [datetime attribute](https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-time-datetime) may be present. If present, its value must be a representation of the element's contents in a machine-readable format.
   */
  datetime?: Expression;
} & TagProps;

/**
 * The [time element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element) represents its contents, along with a machine-readable form of those contents in the [datetime attribute](https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-time-datetime). The kind of content is limited to various kinds of dates, times, time-zone offsets, and durations.
 */
export function Time(
  props: TimeProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="time"
      attrs={<RenderTimeAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderTimeAttributes(
  { attrs }: { attrs?: TimeProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.datetime !== undefined
        ? <RenderExpression attr="datetime" value={attrs.datetime} />
        : ""}
    </>
  );
}
