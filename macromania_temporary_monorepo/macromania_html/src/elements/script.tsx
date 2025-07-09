import { Expression, Expressions } from "../../deps.ts";
import {
  EscapeHtml,
  RenderBoolean,
  RenderExpression,
  RenderNonVoidElement,
  RenderSpaceSeparatedList,
} from "../renderUtils.tsx";
import { PossiblyBlockingToken, ReferrerPolicy } from "../shared.tsx";
import { RenderGlobalAttributes, TagProps } from "../global.tsx";
import { RenderEnum } from "../renderUtils.tsx";
import { CrossOrigin, FetchPriority } from "../shared.tsx";

/**
 * Props for the {@linkcode Script} macro.
 *
 * https://html.spec.whatwg.org/multipage/scripting.html#the-script-element
 */
export type ScriptProps = {
  /**
   * [Classic scripts](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script) and [JavaScript module scripts](https://html.spec.whatwg.org/multipage/webappapis.html#javascript-module-script) can be embedded inline, or be imported from an external file using the [src attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src), which if specified gives the URL of the external script resource to use. If [src](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src) is specified, it must be a valid non-empty URL potentially surrounded by spaces.
   */
  src?: Expression;
  /**
   * The [type attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-type) allows customization of the type of script represented:
   *
   * - Omitting the attribute means that the script is a [classic script](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script).
   * - Setting the attribute to `"module"` means that the script is a [JavaScript module script](https://html.spec.whatwg.org/multipage/webappapis.html#javascript-module-script). Module scripts are not affected by the [defer attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer), but are affected by the [async attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async) (regardless of the state of the [src attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src)).
   * - Setting the attribute to `"importmap"` means that the script is an [import map](https://html.spec.whatwg.org/multipage/webappapis.html#import-map), containing JSON that will be used to control the behavior of module specifier resolution. Import maps can only be inline, i.e., the [src attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src) and most other attributes are meaningless and not to be used with them.
   * - Setting the attribute to any other value means that the script is a data block, which is not processed. None of the [script attributes](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element) (except [type](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-type) itself) have any effect on data blocks. Authors must use a valid MIME type string that is not a JavaScript MIME type essence match to denote data blocks.
   */
  type?: "module" | "importmap" | { data: Expression };
  /**
   * The [nomodule attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule) is a boolean attribute that prevents a script from being executed in user agents that support [module scripts](https://html.spec.whatwg.org/multipage/webappapis.html#module-script). This allows selective execution of [module scripts](https://html.spec.whatwg.org/multipage/webappapis.html#module-script) in modern user agents and [classic scripts](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script) in older user agents. The [nomodule attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule) must not be specified on module scripts (and will be ignored if it is).
   */
  nomodule?: boolean;
  /**
   * The [async](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async) and [defer](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer) attributes are boolean attributes that indicate how the script should be evaluated. [Classic scripts](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script) may specify [defer](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer) or [async](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async), but must not specify either unless the [src attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src) is present. [Module scripts](https://html.spec.whatwg.org/multipage/webappapis.html#module-script) may specify the [async attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async), but must not specify the [defer attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer).
   */
  async?: boolean;
  /**
   * The [async](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async) and [defer](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer) attributes are boolean attributes that indicate how the script should be evaluated. [Classic scripts](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script) may specify [defer](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer) or [async](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async), but must not specify either unless the [src attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src) is present. [Module scripts](https://html.spec.whatwg.org/multipage/webappapis.html#module-script) may specify the [async attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async), but must not specify the [defer attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer).
   */
  defer?: boolean;
  /**
   * The [crossorigin attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-crossorigin) is a [CORS settings attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attribute). For [classic scripts](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script), it controls whether error information will be exposed, when the script is obtained from other [origins](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin). For [module scripts](https://html.spec.whatwg.org/multipage/webappapis.html#module-script), it controls the [credentials mode](https://fetch.spec.whatwg.org/#concept-request-credentials-mode) used for cross-origin requests.
   */
  crossorigin?: CrossOrigin;
  /**
   * The [integrity attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-integrity) represents the [integrity metadata](https://fetch.spec.whatwg.org/#concept-request-integrity-metadata) for requests which this element is responsible for. The value is text. The [integrity attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-integrity) must not be specified when the [src attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src) is not specified.
   */
  integrity?: Expression;
  /**
   * The [referrerpolicy attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-referrerpolicy) is a [referrer policy attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#referrer-policy-attribute). Its purpose is to set the [referrer policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy) used when [fetching](https://fetch.spec.whatwg.org/#concept-fetch) the script, as well as any scripts imported from it.
   */
  referrerpolicy?: ReferrerPolicy;
  /**
   * The [blocking attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-blocking) is a blocking attribute.
   */
  blocking?: PossiblyBlockingToken[] | PossiblyBlockingToken;
  /**
   * The [fetchpriority attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-fetchpriority) sets the [priority](https://fetch.spec.whatwg.org/#request-priority) used when [fetching](https://fetch.spec.whatwg.org/#concept-fetch) the script.
   */
  fetchpriority?: FetchPriority;
} & TagProps;

/**
 * The [script element](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element) allows authors to include dynamic script and data blocks in their documents. The element does not represent content for the user.
 */
export function Script(
  props: ScriptProps & { children?: Expressions },
): Expression {
  return (
    <RenderNonVoidElement
      name="script"
      attrs={<RenderScriptAttributes attrs={props} />}
      children={props.children}
    />
  );
}

function RenderScriptAttributes(
  { attrs }: { attrs?: ScriptProps },
): Expression {
  if (attrs === undefined) {
    return "";
  }

  return (
    <>
      <RenderGlobalAttributes attrs={attrs} />
      {attrs.src !== undefined
        ? <RenderExpression attr="src" value={attrs.src} />
        : ""}
      {attrs.type !== undefined ? <RenderType type={attrs.type} /> : ""}
      {attrs.nomodule !== undefined
        ? <RenderBoolean attr="nomodule" value={attrs.nomodule} />
        : ""}
      {attrs.async !== undefined
        ? <RenderBoolean attr="async" value={attrs.async} />
        : ""}
      {attrs.defer !== undefined
        ? <RenderBoolean attr="defer" value={attrs.defer} />
        : ""}
      {attrs.crossorigin !== undefined
        ? <RenderEnum attr="crossorigin" value={attrs.crossorigin} />
        : ""}
      {attrs.integrity !== undefined
        ? <RenderExpression attr="integrity" value={attrs.integrity} />
        : ""}
      {attrs.referrerpolicy !== undefined
        ? <RenderEnum attr="referrerpolicy" value={attrs.referrerpolicy} />
        : ""}
      {attrs.blocking !== undefined
        ? <RenderSpaceSeparatedList attr="blocking" value={attrs.blocking} />
        : ""}
      {attrs.fetchpriority !== undefined
        ? <RenderEnum attr="fetchpriority" value={attrs.fetchpriority} />
        : ""}
    </>
  );
}

function RenderType(
  { type }: { type: "module" | "importmap" | { data: Expression } },
): Expression {
  if (typeof type === "string") {
    return <RenderEnum attr="type" value={type} />;
  } else {
    return <RenderExpression attr="type" value={type.data} />;
  }
}
