import { Expression, Expressions } from "../../deps.ts";
import {
  RenderBoolean,
  RenderEnum,
  RenderNonVoidElement,
} from "../renderUtils.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";

/**
 * Props for the {@linkcode Template} macro.
 *
 * https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
 */
export type TemplateProps = {
  /**
   * The [shadowrootmode attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootmode) enables streaming declarative shadow roots.
   */
  shadowrootmode?: "open" | "closed";
  /**
   * The [shadowrootdelegatesfocus attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootdelegatesfocus) sets [delegates focus](https://dom.spec.whatwg.org/#shadowroot-delegates-focus) on a declarative shadow root.
   */
  shadowrootdelegatesfocus?: boolean;
  /**
   * The [shadowrootclonable attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootclonable) sets [clonable](https://dom.spec.whatwg.org/#shadowroot-clonable) on a declarative shadow root.
   */
  shadowrootclonable?: boolean;
} & TagProps;

/**
 * The [template element](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element) is used to declare fragments of HTML that can be cloned and inserted in the document by script.
 */
export function Template(
  props: TemplateProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="template"
      attrs={<RenderTemplateAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderTemplateAttributes(
  { attrs }: { attrs?: TemplateProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.shadowrootmode !== undefined
        ? <RenderEnum attr="shadowrootmode" value={attrs.shadowrootmode} />
        : ""}
      {attrs.shadowrootdelegatesfocus !== undefined
        ? (
          <RenderBoolean
            attr="shadowrootdelegatesfocus"
            value={attrs.shadowrootdelegatesfocus}
          />
        )
        : ""}
      {attrs.shadowrootclonable !== undefined
        ? (
          <RenderBoolean
            attr="shadowrootclonable"
            value={attrs.shadowrootclonable}
          />
        )
        : ""}
    </>
  );
}
