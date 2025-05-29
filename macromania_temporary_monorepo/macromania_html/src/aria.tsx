import { Expression } from "../deps.ts";
import {
  RenderBoolean,
  RenderBooleanOrEnum,
  RenderEnum,
  RenderExpression,
  RenderSpaceSeparatedList,
  RenderTrueFalse,
} from "./renderUtils.tsx";

/**
 * All the [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) [roles](https://www.w3.org/TR/wai-aria-1.2/#roles) and their [attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes).
 */
export type Aria = {};

/**
 * The [widget roles](https://www.w3.org/TR/wai-aria-1.2/#widget_roles).
 */
export type AriaWidget = {};

/**
 * [Global attributes](https://www.w3.org/TR/wai-aria-1.2/#global_states).
 */
export type GlobalAttributes = {
  /**
   * The [atomic attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-atomic) indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the `aria-relevant` attribute.
   */
  atomic?: boolean;
  /**
   * The [busy attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-busy) indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.
   */
  busy?: boolean;
  /**
   * The [controls attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-controls) identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  controls?: Expression[] | Expression;
  /**
   * The [current attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-current) indicates the element that represents the current item within a container or set of related elements.
   */
  current?:
    | /** Does or does not represent the current item within a set. */ boolean
    | /** Represents the current page within a set of pages. */ "page"
    | /** Represents the current step within a process. */ "step"
    | /** Represents the current location within an environment or context. */ "location"
    | /** Represents the current date within a collection of dates. */ "date"
    | /** Represents the current time within a set of times. */ "time";
  /**
   * The [describedby attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby) identifies the element (or elements) that describes the object.
   */
  describedby?: Expression[] | Expression;
  /**
   * The [details attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-details) identifies the element that provides a detailed, extended description for the object.
   */
  details?: Expression;
  /**
   * The [disabled attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled) indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   */
  disabled?: boolean;
  /**
   * The [errormessage attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage) identifies the element that provides an error message for an object.
   */
  errormessage?: Expression;
  /**
   * The [flowto attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-flowto) identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order.
   */
  flowto?: Expression[] | Expression;
  /**
   * The [haspopup attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup) indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
   *
   * `"menu"` is equivalent to `true`, so we only offer the latter.
   */
  haspopup?:
    /** `false` indicates the element does not have a popup, `true` indicates the popup is a menu. */
    | boolean
    /** Indicates the popup is a listbox. */
    | "listbox"
    /** Indicates the popup is a tree. */
    | "tree"
    /** Indicates the popup is a grid. */
    | "grid"
    /** Indicates the popup is a dialog. */
    | "dialog";
  /**
   * The [hidden attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden) indicates whether the element is exposed to an accessibility API.
   */
  hidden?: boolean;
  /**
   * The [invalid attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid) indicates the entered value does not conform to the format expected by the application.
   */
  invalid?:
    /** `false` indicates there are no detected errors in the value, `true` indicates that the value entered by the user has failed validation. */
    | boolean
    /** A grammatical error was detected. */
    | "grammar"
    /** A spelling error was detected. */
    | "spelling";
  /**
   * The [keyshortcuts attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-keyshortcuts) indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
   */
  keyshortcuts?: Expression;
  /**
   * The [label attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-label) defines a string value that labels the current element.
   */
  label?: Expression;
  /**
   * The [labelledby attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby) identifies the element (or elements) that labels the current element.
   */
  labelledby?: Expression[] | Expression;
  /**
   * The [live attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-live) indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
   */
  live?:
    /** Indicates that updates to the region should not be presented to the user unless the user is currently focused on that region. */
    | "off"
    /** Indicates that updates to the region should be presented at the next graceful opportunity, such as at the end of speaking the current sentence or when the user pauses typing. */
    | "polite"
    /** Indicates that updates to the region have the highest priority and should be presented the user immediately. */
    | "assertive";
  /**
   * The [owns attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-owns) identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
   */
  owns?: Expression[] | Expression;
  /**
   * The [relevant attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-relevant) indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
   */
  relevant?:
    /** Element nodes are added to the accessibility tree within the live region. */
    | "additions"
    /**  	Text content, a text alternative, or an element node within the live region is removed from the accessibility tree. */
    | "removals"
    /** Text content or a text alternative is added to any descendant in the accessibility tree of the live region. */
    | "text"
    | "additions removals"
    | "additions text"
    | "removals text"
    | "all";
  /**
   * The [roledescription attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription) defines a human-readable, author-localized description for the role of an element.
   */
  roledescription?: Expression;
};

function RenderGlobalAttributes(
  { attrs }: { attrs: GlobalAttributes },
): Expression {
  return (
    <>
      {attrs.atomic !== undefined
        ? <RenderBoolean attr="aria-atomic" value={attrs.atomic} />
        : ""}
      {attrs.busy !== undefined
        ? <RenderBoolean attr="aria-busy" value={attrs.busy} />
        : ""}
      {attrs.controls !== undefined
        ? (
          <RenderSpaceSeparatedList
            attr="aria-controls"
            value={attrs.controls}
          />
        )
        : ""}
      {attrs.current !== undefined
        ? <RenderBooleanOrEnum attr="aria-current" value={attrs.current} />
        : ""}
      {attrs.describedby !== undefined
        ? (
          <RenderSpaceSeparatedList
            attr="aria-describedby"
            value={attrs.describedby}
          />
        )
        : ""}
      {attrs.details !== undefined
        ? <RenderExpression attr="aria-details" value={attrs.details} />
        : ""}
      {attrs.disabled !== undefined
        ? <RenderBoolean attr="aria-disabled" value={attrs.disabled} />
        : ""}
      {attrs.errormessage !== undefined
        ? (
          <RenderExpression
            attr="aria-errormessage"
            value={attrs.errormessage}
          />
        )
        : ""}
      {attrs.flowto !== undefined
        ? (
          <RenderSpaceSeparatedList
            attr="aria-flowto"
            value={attrs.flowto}
          />
        )
        : ""}
      {attrs.haspopup !== undefined
        ? <RenderBooleanOrEnum attr="aria-haspopup" value={attrs.haspopup} />
        : ""}
      {attrs.hidden !== undefined
        ? <RenderTrueFalse attr="aria-hidden" value={attrs.hidden} />
        : ""}
      {attrs.invalid !== undefined
        ? <RenderBooleanOrEnum attr="aria-invalid" value={attrs.invalid} />
        : ""}
      {attrs.keyshortcuts !== undefined
        ? (
          <RenderExpression
            attr="aria-keyshortcuts"
            value={attrs.keyshortcuts}
          />
        )
        : ""}
      {attrs.label !== undefined
        ? <RenderExpression attr="aria-label" value={attrs.label} />
        : ""}
      {attrs.labelledby !== undefined
        ? (
          <RenderSpaceSeparatedList
            attr="aria-labelledby"
            value={attrs.labelledby}
          />
        )
        : ""}
      {attrs.live !== undefined
        ? <RenderEnum attr="aria-live" value={attrs.live} />
        : ""}
      {attrs.owns !== undefined
        ? (
          <RenderSpaceSeparatedList
            attr="aria-owns"
            value={attrs.owns}
          />
        )
        : ""}
      {attrs.relevant !== undefined
        ? <RenderEnum attr="aria-relevant" value={attrs.relevant} />
        : ""}
      {attrs.roledescription !== undefined
        ? (
          <RenderExpression
            attr="aria-roledescription"
            value={attrs.roledescription}
          />
        )
        : ""}
    </>
  );
}
