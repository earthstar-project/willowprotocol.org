// Functionality shared across many element types.

/**
 * https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attribute
 */
export type CrossOrigin =
  /** [Requests](https://fetch.spec.whatwg.org/#concept-request) for the element will have their [mode](https://fetch.spec.whatwg.org/#concept-request-mode) set to "`cors`" and their [credentials mode](https://fetch.spec.whatwg.org/#concept-request-credentials-mode) set to "`same-origin`". */
  | "anonymous"
  /** [Requests](https://fetch.spec.whatwg.org/#concept-request) for the element will have their [mode](https://fetch.spec.whatwg.org/#concept-request-mode) set to "`cors`" and their [credentials mode](https://fetch.spec.whatwg.org/#concept-request-credentials-mode) set to "`include`". */
  | "use-credentials";

/**
 * See https://html.spec.whatwg.org/multipage/urls-and-fetching.html#blocking-attribute
 */
export type PossiblyBlockingToken = "render";

/**
 * A [referrer policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy).
 *
 * The empty string is equivalent to not giving a referrer policy at all, so we don't allow it in the first place.
 */
export type ReferrerPolicy =
  /**
   * The simplest policy, which specifies that no referrer information is to be sent along with requests to any [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin). The header [Referer](https://datatracker.ietf.org/doc/html/rfc7231#section-5.5.2) will be omitted entirely.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-no-referrer
   */
  | "no-referrer"
  /**
   * Sends a request’s full referrerURL stripped for use as a referrer for requests:
   *
   * - whose referrerURL and current URL are both potentially trustworthy URLs, or
   * - whose referrerURL is a non-potentially trustworthy URL.
   *
   * Requests whose referrerURL is a potentially trustworthy URL and whose current URL is a non-potentially trustworthy URL on the other hand, will contain no referrer information. A Referer HTTP header will not be sent.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-no-referrer-when-downgrade
   */
  | "no-referrer-when-downgrade"
  /**
   * The "same-origin" policy specifies that a request’s full referrerURL is sent as referrer information when making same-origin-referrer requests.
   *
   * Cross-origin-referrer requests, on the other hand, will contain no referrer information. A Referer HTTP header will not be sent.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-same-origin
   */
  | "same-origin"
  /**
   * The "origin" policy specifies that only the ASCII serialization of the request’s referrerURL is sent as referrer information when making both same-origin-referrer requests and cross-origin-referrer requests.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-origin
   */
  | "origin"
  /**
   * The "strict-origin" policy sends the ASCII serialization of the origin of the referrerURL for requests:
   *
   * - whose referrerURL and current URL are both potentially trustworthy URLs, or
   * - whose referrerURL is a non-potentially trustworthy URL.
   *
   * Requests whose referrerURL is a potentially trustworthy URL and whose current URL is a non-potentially trustworthy URL on the other hand, will contain no referrer information. A Referer HTTP header will not be sent.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-strict-origin
   */
  | "strict-origin"
  /**
   * The "origin-when-cross-origin" policy specifies that a request’s full referrerURL is sent as referrer information when making same-origin-referrer requests, and only the ASCII serialization of the origin of the request’s referrerURL is sent as referrer information when making cross-origin-referrer requests.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-origin-when-cross-origin
   */
  | "origin-when-cross-origin"
  /**
   * The "strict-origin-when-cross-origin" policy specifies that a request’s full referrerURL is sent as referrer information when making same-origin-referrer requests, and only the ASCII serialization of the origin of the request’s referrerURL when making cross-origin-referrer requests:
   *
   * - whose referrerURL and current URL are both potentially trustworthy URLs, or
   * - whose referrerURL is a non-potentially trustworthy URL.
   *
   * Requests whose referrerURL is a potentially trustworthy URL and whose current URL is a non-potentially trustworthy URL on the other hand, will contain no referrer information. A Referer HTTP header will not be sent.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-strict-origin-when-cross-origin
   */
  | "strict-origin-when-cross-origin"
  /**
   * The "unsafe-url" policy specifies that a request’s full referrerURL is sent along for both same-origin-referrer requests and cross-origin-referrer requests.
   *
   * https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-strict-origin-when-cross-origin
   */
  | "unsafe-url";

/**
 * https://html.spec.whatwg.org/multipage/urls-and-fetching.html#fetch-priority-attribute
 */
export type FetchPriority =
  /**
   * Signals a high-priority fetch relative to other resources with the same destination.
   */
  | "high"
  /**
   * Signals a low-priority fetch relative to other resources with the same destination.
   */
  | "low"
  /**
   * Signals automatic determination of fetch priority relative to other resources with the same destination.
   */
  | "auto";
