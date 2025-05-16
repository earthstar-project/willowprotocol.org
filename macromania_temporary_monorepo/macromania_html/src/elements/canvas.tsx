import { Expression, Expressions } from "../../deps.ts";
import {
  RenderBoolean,
  RenderEnum,
  RenderExpression,
  RenderNonVoidElement,
  RenderNumber,
} from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Canvas} macro.
 *
 * https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element
 */
export type CanvasProps = {
  /**
   * The [canvas element](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element) has two attributes to control the size of the element's bitmap: [width](https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-width) and [height](https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-height). These attributes, when specified, must have values that are valid non-negative integers.
   */
  width?: number;
  /**
   * The [canvas element](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element) has two attributes to control the size of the element's bitmap: [width](https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-width) and [height](https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-height). These attributes, when specified, must have values that are valid non-negative integers.
   */
  height?: number;
} & TagProps;

/**
 * The [canvas element](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element) provides scripts with a resolution-dependent bitmap canvas, which can be used for rendering graphs, game graphics, art, or other visual images on the fly.
 */
export function Canvas(
  props: CanvasProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="canvas"
      attrs={<RenderCanvasAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderCanvasAttributes(
  { attrs }: { attrs?: CanvasProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.width !== undefined
        ? <RenderNumber attr="width" value={attrs.width} />
        : ""}
      {attrs.height !== undefined
        ? <RenderNumber attr="height" value={attrs.height} />
        : ""}
    </>
  );
}
