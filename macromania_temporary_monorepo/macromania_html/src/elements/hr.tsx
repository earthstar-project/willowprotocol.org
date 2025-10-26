import { Expression } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderVoidElement } from "../renderUtils.tsx";

/**
 * The [hr element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-hr-element) represents a [paragraph](https://html.spec.whatwg.org/multipage/dom.html#paragraph)-level thematic break, e.g., a scene change in a story, or a transition to another topic within a section of a reference book; alternatively, it represents a separator between a set of options of a [select element](https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element).
 */
export function Hr(
  attrs: TagProps
): Expression {
  return (
    <RenderVoidElement
      name="hr"
      attrs={<RenderGlobalAttributes attrs={attrs} />}
    />
  );
}
