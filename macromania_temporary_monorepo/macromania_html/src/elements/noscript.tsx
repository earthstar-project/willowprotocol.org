import { Expression, Expressions } from "../../deps.ts";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderNonVoidElement } from "../renderUtils.tsx";

/**
 * The [noscript element](https://html.spec.whatwg.org/multipage/scripting.html#the-noscript-element) represents nothing if [scripting is enabled](https://html.spec.whatwg.org/multipage/webappapis.html#concept-n-script), and represents its children if [scripting is disabled](https://html.spec.whatwg.org/multipage/webappapis.html#concept-n-noscript). It is used to present different markup to user agents that support scripting and those that don't support scripting, by affecting how the document is parsed.
 */
export function Noscript(
  props: TagProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="noscript"
      attrs={<RenderGlobalAttributes attrs={props} />}
      children={props.children}
    />
  );
}
