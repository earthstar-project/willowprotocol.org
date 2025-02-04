import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [dl element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element) represents an association list consisting of zero or more name-value groups (a description list). A name-value group consists of one or more names ([dt elements](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dt-element), possibly as children of a [div element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element) child) followed by one or more values (dd elements, possibly as children of a [div element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element) child), ignoring any nodes other than [dt](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dt-element) and [dd element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dd-element) children, and [dt](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dt-element) and [dd elements](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dd-element) that are children of [div element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element) children. Within a single [dl element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element), there should not be more than one [dt element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dt-element) for each name.
 */
export function Dl(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="dl"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
