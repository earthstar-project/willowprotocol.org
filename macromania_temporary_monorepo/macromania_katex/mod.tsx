import { Colors } from "./deps.ts";
import { dependencyCss } from "./deps.ts";
import {
  Context,
  createConfigOptions,
  createLogger,
  createSubstate,
  Expression,
  Expressions,
  expressions,
  katex,
} from "./deps.ts";

const l = createLogger("LoggerKatex");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerKatex };

export type KatexConfig = {
  /**
   * Asset path to use as an argument to the
   * [macromania-html-utils](https://github.com/worm-blossom/macromania_html_utils)
   * `addHtmlDependencyStylesheet` function to add the katex stylesheet
   */
  stylesheet?: string[] | null;
  /**
   * Katex options.
   */
  options?: KatexOptions;
};

/**
 * Options to pass to katex, see https://katex.org/docs/options for details.
 */
export type KatexOptions = {
  /**
   * Default is `"html"`, unlike in katex.
   */
  output?: "html" | "mathml" | "htmlAndMathml";
  leqno?: boolean;
  fleqn?: boolean;
  /**
   * Maps to the `throwOnError` katex option.
   */
  haltOnError?: boolean;
  errorColor?: string;
  /**
   * Discouraged, prefer Macromania macros instead.
   */
  // deno-lint-ignore no-explicit-any
  macros?: Record<string, any>;
  minRuleThickness?: number;
  colorIsTextColor?: boolean;
  maxSize?: number;
  maxExpand?: number;
  /**
   * Default is `false`, unlike in katex.
   */
  // deno-lint-ignore no-explicit-any
  strict?: boolean | any;
  /**
   * Defalt is `true`, unlike in katex.
   */
  // deno-lint-ignore no-explicit-any
  trust?: boolean | any;
  globalGroup?: boolean;
};

const [
  getConfig,
  ConfigKatex,
] = createConfigOptions<KatexConfig, KatexConfig>(
  "ConfigKatex",
  () => ({
    stylesheet: null,
    options: {
      output: "html",
      leqno: false,
      fleqn: false,
      haltOnError: true,
      errorColor: "#cc0000",
      macros: {},
      minRuleThickness: undefined,
      colorIsTextColor: false,
      maxSize: Infinity,
      maxExpand: 1000,
      strict: false,
      trust: true,
      globalGroup: false,
    },
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.stylesheet !== undefined) {
      newValue.stylesheet = update.stylesheet;
    }

    if (update.options !== undefined) {
      if (update.options.output !== undefined) {
        newValue.options!.output = update.options.output;
      }
      if (update.options.leqno !== undefined) {
        newValue.options!.leqno = update.options.leqno;
      }
      if (update.options.fleqn !== undefined) {
        newValue.options!.fleqn = update.options.fleqn;
      }
      if (update.options.haltOnError !== undefined) {
        newValue.options!.haltOnError = update.options.haltOnError;
      }
      if (update.options.errorColor !== undefined) {
        newValue.options!.errorColor = update.options.errorColor;
      }
      if (update.options.macros !== undefined) {
        newValue.options!.macros = update.options.macros;
      }
      if (update.options.minRuleThickness !== undefined) {
        newValue.options!.minRuleThickness = update.options.minRuleThickness;
      }
      if (update.options.colorIsTextColor !== undefined) {
        newValue.options!.colorIsTextColor = update.options.colorIsTextColor;
      }
      if (update.options.maxSize !== undefined) {
        newValue.options!.maxSize = update.options.maxSize;
      }
      if (update.options.maxExpand !== undefined) {
        newValue.options!.maxExpand = update.options.maxExpand;
      }
      if (update.options.strict !== undefined) {
        newValue.options!.strict = update.options.strict;
      }
      if (update.options.trust !== undefined) {
        newValue.options!.trust = update.options.trust;
      }
      if (update.options.globalGroup !== undefined) {
        newValue.options!.globalGroup = update.options.globalGroup;
      }
    }

    return newValue;
  },
);
export { ConfigKatex };

/**
 * Map a `KatexConfig` and a display mode to options that can be passed to
 * katex.
 */
function configToOptions(
  config: KatexOptions,
  displayMode: boolean,
  // deno-lint-ignore no-explicit-any
): Record<string, any> {
  // deno-lint-ignore no-explicit-any
  const opts: Record<string, any> = { ...config };
  opts.displayMode = displayMode;
  opts.throwOnError = config.haltOnError;
  return opts;
}

type KatexState = {
  inMathMode: "no" | "fresh" | "stale";
  displayMode: boolean;
};

const [getState, setState] = createSubstate<KatexState>(() => ({
  inMathMode: "no",
  displayMode: false,
}));

/**
 * Return true if we are currently evaluating a descendant of a math mode macro.
 */
export function isMathMode(ctx: Context): boolean {
  return getState(ctx).inMathMode !== "no";
}

/**
 * Return true if we are currently evaluating a descendant of a math mode macro,
 * and the outermost math mode macro is in display mode.
 */
export function isDisplayMode(ctx: Context): boolean {
  return getState(ctx).displayMode;
}

/**
 * Evaluate the children, and then pass them to katex (with `displayMode: false`,
 * and all other options derived from the `ConfigKatex`).
 *
 * @param pre - Text to be placed before the rendered math such that browsers
 * will not insert a line break between this text and the math. This is a
 * workaround for https://github.com/KaTeX/KaTeX/issues/1233
 *
 * @param post - Text to be placed after the rendered math such that browsers
 * will not insert a line break between this text and the math. This is a
 * workaround for https://github.com/KaTeX/KaTeX/issues/1233
 *
 * Both `prefix` and `postfix` work by adding a text span with the class
 * `normalText` to the katex input. Stylesheets should style this text as if it
 * was body text, not math text.
 */
export function M(
  { children, pre, post }: {
    children?: Expressions;
    pre?: Expressions;
    post?: Expressions;
  },
): Expression {
  return (
    <KatexMacro
      pre={pre}
      post={post}
      displayMode={false}
      children={children}
    />
  );
}

/**
 * Evaluate the children, and then pass them to katex (with `displayMode: true`,
 * and all other options derived from the `ConfigKatex`).
 *
 * @param pre - Text to be placed before the rendered math such that browsers
 * will not insert a line break between this text and the math. This is a
 * workaround for https://github.com/KaTeX/KaTeX/issues/1233
 *
 * @param post - Text to be placed after the rendered math such that browsers
 * will not insert a line break between this text and the math. This is a
 * workaround for https://github.com/KaTeX/KaTeX/issues/1233
 *
 * Both `prefix` and `postfix` work by adding a text span with the class
 * `normalText` to the katex input. Stylesheets should style this text as if it
 * was body text, not math text.
 */
export function MM(
  { children, pre, post }: {
    children?: Expressions;
    pre?: Expressions;
    post?: Expressions;
  },
): Expression {
  return (
    <KatexMacro
      pre={pre}
      post={post}
      displayMode={true}
      children={children}
    />
  );
}

// Shared implementation of the user-facing math macros.
function KatexMacro(
  { displayMode, children, pre, post }: {
    displayMode: boolean;
    children?: Expressions;
    pre?: Expressions;
    post?: Expressions;
  },
): Expression {
  let oldState: KatexState = {
    inMathMode: "no",
    displayMode: false,
  };

  const prefixExps: Expression[] = pre
    ? [
      "\\htmlClass{normalText}{\\text{",
      <fragment exps={expressions(pre)} />,
      "}}",
    ]
    : [];

  const postfixExps: Expression[] = post
    ? [
      "\\htmlClass{normalText}{\\text{",
      <fragment exps={expressions(post)} />,
      "}}",
    ]
    : [];

  return (
    // Update the `KatexState` for the inner expressions.
    <lifecycle pre={lifecyclePre} post={lifecyclePost}>
      <map fun={map}>
        <fragment
          exps={[...prefixExps, ...expressions(children), ...postfixExps]}
        />
      </map>
    </lifecycle>
  );

  function lifecyclePre(ctx: Context) {
    oldState = { ...getState(ctx) };
    const newState: KatexState = {
      inMathMode: oldState.inMathMode === "no" ? "fresh" : "stale",
      displayMode: oldState.inMathMode === "no"
        ? displayMode
        : oldState.displayMode,
    };
    setState(ctx, newState);
  }

  function lifecyclePost(ctx: Context) {
    setState(ctx, oldState);
  }

  function map(evaled: string, ctx: Context): Expression {
    const state = getState(ctx);

    const config = getConfig(ctx);
    if (config.stylesheet !== null) {
      dependencyCss(ctx, {
        dep: config.stylesheet!,
        debugMessage: `Trying to add a katex stylesheet because you used the ${
          Colors.yellow(displayMode ? `<MM>` : `<M>`)
        } macro and configured the macromania_katex package to use this path for the depedency.`,
      });
    }

    if (state.inMathMode === "fresh") {
      // Render `evaled` with katex.
      const config = getConfig(ctx);
      const opts = configToOptions(config.options!, displayMode);

      try {
        return katex.default.renderToString(evaled, opts);
      } catch (err) {
        l.error(ctx, "Failed to render katex:");
        l.error(ctx, err);
        l.error(ctx, "The input that was given to katex:");
        l.error(ctx, evaled);
        return ctx.halt();
      }
    } else {
      // An outer math macro will do the rendering.
      return evaled;
    }
  }
}
