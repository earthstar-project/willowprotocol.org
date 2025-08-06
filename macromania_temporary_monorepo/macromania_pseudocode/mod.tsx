import {
  Def,
  dependencyCss,
  dependencyJs,
  Div,
  PreviewScope,
  R,
} from "../mod.tsx";
import {
  Code,
  Config,
  ConfigWebserverRoot,
  Li,
  Ol,
  Span,
  styleAssetPath,
} from "./deps.ts";
import {
  absoluteOutFsPath,
  Cd,
  createConfigOptions,
  ScriptDependencyInfo,
  StylesheetDependencyInfo,
  TagProps,
} from "./deps.ts";
import {
  Colors,
  Context,
  createLogger,
  createSubstate,
  Expression,
  Expressions,
  File,
  Html5,
} from "./deps.ts";

const l = createLogger("LoggerPseudocode");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerPseudocode };

export type PseudocodeConfig = {
  /**
   * Whether to render line numbers. Defaults to `false`.
   */
  lineNumbering?: boolean;
  /**
   * Css dependencies to add to all pages with a `Pseudocode` macro.
   */
  cssDeps?: StylesheetDependencyInfo[];
  /**
   * JavaScript dependencies to add to all pages with a `Pseudocode` macro.
   */
  jsDeps?: ScriptDependencyInfo[];
  /**
   * How many colors to cycle through for rainbow delimiters.
   * Defaults to three.
   */
  colorsOfTheRainbow?: number;
};

const [
  getConfig,
  ConfigPseudocode,
] = createConfigOptions<PseudocodeConfig, PseudocodeConfig>(
  "ConfigPseudocode",
  () => ({
    lineNumbering: false,
    cssDeps: [],
    jsDeps: [],
    colorsOfTheRainbow: 3,
    delimiterStyle: "c",
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.lineNumbering !== undefined) {
      newValue.lineNumbering = update.lineNumbering;
    }
    if (update.cssDeps !== undefined) {
      newValue.cssDeps = update.cssDeps;
    }
    if (update.jsDeps !== undefined) {
      newValue.jsDeps = update.jsDeps;
    }
    if (update.colorsOfTheRainbow !== undefined) {
      newValue.colorsOfTheRainbow = update.colorsOfTheRainbow;
    }

    return newValue;
  },
);
export { ConfigPseudocode };

type State = {
  lineNumber: number;
  indentation: number;
  showLineNumbers: boolean;
  n: string;
  rainbowCount: number;
  fake: boolean;
};

const [getState, _setState] = createSubstate<State>(
  () => ({
    lineNumber: 1,
    indentation: 0,
    showLineNumbers: false, // Initial value is ignored, this is overwritten by every Pseudocode macro.
    n: "",
    rainbowCount: 0,
    fake: false,
  }),
);

export type PseudocodeProps = {
  /**
   * A unique name to refer to this codeblock via DefRef.
   * Also gets used as an html id.
   */
  n: string;
  /**
   * Whether to show line numbers or not. If `undefined`, defers to the `lineNumbering` config option,
   * which defaults to *not* showing line numbers.
   */
  lineNumbering?: boolean;
  /**
   * If `true`, this code block will not number its lines form 1, but instead continue where the previous block left off.
   */
  noLineNumberReset?: boolean;
  /**
   * The lines of could. Must be (directly or indirectly) an alternating sequence of `<StartLoc/>` and `<EndLoc/>` macros,
   * with the code to render in-between them.
   */
  children?: Expressions;
};

/**
 * Create a block of pseudocode.
 *
 * The children of this should all use the `<Loc/>` macro (directly or indirectly)
 * for the output to render sensibly.
 */
export function Pseudocode(
  { children, n, lineNumbering, noLineNumberReset }: PseudocodeProps,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        const config = getConfig(ctx);

        const doNumber = lineNumbering === undefined
          ? getConfig(ctx).lineNumbering!
          : lineNumbering;

        const state = getState(ctx);
        const fake = state.fake;
        if (!fake) {
          state.showLineNumbers = doNumber;
        }

        if (!noLineNumberReset && !fake) {
          state.lineNumber = 1;
        }

        if (!fake) {
          state.n = n;
        }

        return (
          <PreviewScope>
            <omnomnom>
              {fake
                ? ""
                : <Def n={n} noHighlight refData={{ pseudocode: n }} />}
            </omnomnom>
            <impure
              fun={(ctx) => {
                for (const dep of config.cssDeps ?? []) {
                  dependencyCss(ctx, dep);
                }
                for (const dep of config.jsDeps ?? []) {
                  dependencyJs(ctx, dep);
                }
                return "";
              }}
            />
            <Code
              id={n}
              clazz={`pseudocode${
                state.showLineNumbers ? "" : " noLineNumbers"
              }`}
            >
              <exps x={children} />
            </Code>
          </PreviewScope>
        );
      }}
    />
  );
}

/**
 * Causes any inner Pseudocode macro to not mutate certain state. In particular, it creates no new Def for inner pseudocode blocks, and inner pseudocode blocks do not increment the internal line number counter.
 */
export function FakePseudocode(
  { children }: { children?: Expressions },
): Expression {
  let wasFakeBefore = false;
  return (
    <lifecycle
      pre={(ctx) => {
        const state = getState(ctx);
        wasFakeBefore = state.fake;
        state.fake = true;
      }}
      post={(ctx) => {
        const state = getState(ctx);
        state.fake = wasFakeBefore;
      }}
    >
      <exps x={children} />
    </lifecycle>
  );
}

/**
 * Begin a new line of code. It has to be closed with the `<EndLoc/>` macro.
 */
function StartLoc(): Expression {
  return (
    <impure
      fun={(ctx) => {
        const state = getState(ctx);

        const gutter = (
          <Div
            clazz="locGutter"
            id={lineId(state.n, state.lineNumber)}
            data={{ l: `${state.lineNumber}`, i: `${state.indentation}` }}
          >
            <Div clazz="lineNumber">
              <RefLoc n={state.n} lines={state.lineNumber} noPreview>
                {`${state.lineNumber}`}
              </RefLoc>
            </Div>
            <Div clazz="fold" />
          </Div>
        );
        if (!state.fake) {
          state.lineNumber += 1;
        }

        const indents: Expression[] = [];
        for (let i = 0; i < state.indentation; i++) {
          indents.push(<Div clazz="indent">&nbsp;</Div>);
        }

        return (
          <>
            {gutter}
            {`<div class="locContent"><div>`}
            <exps x={indents} />
          </>
        );
      }}
    />
  );
}

/**
 * Terminate a line of code that was opened with the `<StartLoc/>` macro.
 */
function EndLoc(
  { comment, fullLineComment }: {
    comment?: Expressions;
    fullLineComment?: boolean;
  },
): Expression {
  return (
    <>
      {"</div>"}
      {comment === undefined
        ? ""
        : (
          <Div clazz={fullLineComment ? "lineComment" : "comment"}>
            <exps x={comment} />
          </Div>
        )}
      {`</div>`}
    </>
  );
}

export type LocProps = {
  /**
   * The content of the line of code.
   */
  children?: Expressions;
  /**
   * An optional comment for the line.
   */
  comment?: Expressions;
  /**
   * Whether the comment is the only content of the line.
   */
  fullLineComment?: boolean;
};

/**
 * Create a self-contained line of code in a `Pseudocode` block.
 */
export function Loc(
  { children, comment, fullLineComment }: LocProps,
): Expression {
  return (
    <>
      <StartLoc />
      <exps x={children} />
      <EndLoc comment={comment} fullLineComment={fullLineComment} />
    </>
  );
}

/**
 * Splice up a `<Loc>`, allowing you to add new lines "inside".
 * Everything up to this macro becomes a line, and everything after this macro becomes a line.
 *
 * If you supply a comment, it belongs to the line prior to what is spliced in.
 */
export function SpliceLoc(
  { children, comment }: LocProps,
): Expression {
  return (
    <>
      <EndLoc comment={comment} />
      <exps x={children} />
      <StartLoc />
    </>
  );
}

/**
 * An inline comment.
 */
export function InlineComment(
  { children }: { children: Expressions },
): Expression {
  return (
    <Span clazz="inlineComment">
      <exps x={children} />
    </Span>
  );
}

/**
 * Increment the level of indentation of all lines of code within this macro.
 */
export function Indent({ children }: { children?: Expressions }): Expression {
  return (
    <lifecycle
      pre={(ctx) => {
        const state = getState(ctx);
        state.indentation += 1;
      }}
      post={(ctx) => {
        const state = getState(ctx);
        state.indentation -= 1;
      }}
    >
      <exps x={children} />
    </lifecycle>
  );
}

/**
 * The different ways of specifying lines of code to highlight: a single line, a range of lines (both ends inclusive), and a sequenece of any of the prior.
 */
export type Lines = number | [number, number] | {
  many: (number | [number, number])[];
};

function linesValidateAndFindFirst(ctx: Context, lines: Lines): number {
  if (typeof lines === "number") {
    return lines;
  } else if (Array.isArray(lines)) {
    if (lines[0] > lines[1]) {
      l.error(
        ctx,
        `In a range of lines, the second line must be greater than or equal to the first line, but got [${
          lines[0]
        }, ${lines[1]}]`,
      );
      ctx.halt();
      return -1; // never reached, `ctx.halt()` throws. But the compiler doesn't know that.
    } else {
      return lines[0];
    }
  } else {
    const theLines = lines.many;

    if (theLines.length === 0) {
      l.error(ctx, `Must highlight at least one line`);
      ctx.halt();
    }

    let min = Infinity;
    for (const innerLines of theLines) {
      min = Math.min(min, linesValidateAndFindFirst(ctx, innerLines));
    }

    return min;
  }
}

/**
 * Encode lines as a string that can be used as a url parameter.
 * The encoding is simple: if there are many lines, separate them with `.` characters.
 * Encode an individual line as a decimal int, and a sequence as two decimal ints, separated by the `-` character.
 */
function encodeLines(lines: Lines): string {
  if (typeof lines === "number") {
    return `${lines}`;
  } else if (Array.isArray(lines)) {
    return `${lines[0]}-${lines[1]}`;
  } else {
    const innerEncoded = lines.many.map(encodeLines);
    return innerEncoded.join(".");
  }
}

export type RefLocProps = {
  /**
   * The code block to reference.
   */
  n: string;
  /**
   * The line(s) of code to reference.
   */
  lines: Lines;
  /**
   * If true, do not show a preview when hovering over the reference.
   */
  noPreview?: boolean;
  /**
   * The text to render as the reference.
   * Must be supplied.
   */
  children: Expressions;
};

/**
 * Reference specific lines of code.
 */
export function RefLoc(
  { children, n, lines, noPreview }: RefLocProps,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        const firstLine = linesValidateAndFindFirst(ctx, lines);
        const encodedLines = encodeLines(lines);
        const paramString: [string, string] = ["hlLines", encodedLines];

        return (
          <R
            n={n}
            replacementId={lineId(n, firstLine)}
            queryParams={[paramString, ["hlPseudocode", n]]}
            noPreview={noPreview}
            extraData={{ hllines: encodedLines }}
          >
            <exps x={children} />
          </R>
        );
      }}
    />
  );
}

function lineId(n: string, line: number): string {
  return `${n}L${line}`;
}

/**
 * Return which css and js dependencies should be added to every html page with pseudocode.
 */
export function exposeCssAndJsDependencies(
  ctx: Context,
): [StylesheetDependencyInfo[], ScriptDependencyInfo[]] {
  const config = getConfig(ctx);
  return [config.cssDeps ?? [], config.jsDeps ?? []];
}

export type DelimiterProps = {
  /**
   * The opening and the closing delimiter.
   */
  delims: [Expressions, Expressions];
  /**
   * Exclude the delimiters from rainbowowing, i.e., do not color them according to nesting depth.
   */
  noRainbow?: boolean;
  /**
   * The content to wrap in the delimiters.
   */
  children?: Expressions;
};

/**
 * Wrap the children between two delimiters.
 */
export function Delimiters(
  { delims, children, noRainbow }: DelimiterProps,
): Expression {
  if (noRainbow) {
    return (
      <>
        <Span clazz={["open"]}>
          <exps x={delims[0]} />
        </Span>
        <exps x={children} />
        <Span clazz={["close"]}>
          <exps x={delims[1]} />
        </Span>
      </>
    );
  }

  return (
    <lifecycle
      pre={(ctx) => {
        const state = getState(ctx);
        const config = getConfig(ctx);

        state.rainbowCount = (state.rainbowCount + 1) %
          config.colorsOfTheRainbow!;
        if (state.rainbowCount < 0) {
          state.rainbowCount += config.colorsOfTheRainbow!;
        }
      }}
      post={(ctx) => {
        const state = getState(ctx);
        const config = getConfig(ctx);

        state.rainbowCount = (state.rainbowCount - 1) %
          config.colorsOfTheRainbow!;
        if (state.rainbowCount < 0) {
          state.rainbowCount += config.colorsOfTheRainbow!;
        }
      }}
    >
      <impure
        fun={(ctx) => {
          const state = getState(ctx);

          const clazz = `rb${state.rainbowCount}`;

          return (
            <>
              <Span clazz={[clazz, "open"]}>
                <exps x={delims[0]} />
              </Span>
              <exps x={children} />
              <Span clazz={[clazz, "close"]}>
                <exps x={delims[1]} />
              </Span>
            </>
          );
        }}
      />
    </lifecycle>
  );
}

/**
 * Information about optionally adding a comment to a segment of code.
 *
 * Generic about how exactly the segment of code is described.
 */
export type MaybeCommented<T> = T | {
  commented: {
    segment: T;
    comment: Expressions;
    /**
     * If rendered as multiline, should the comment receive its own line?
     */
    dedicatedLine?: boolean;
  };
};

/**
 * Map an array of `MaybeCommented<From>` to an array of `MaybeCommented<To>` by transforming the code segments of type `From` into code segments of type `To` via the `fun` function.
 */
export function mapMaybeCommented<From, To>(
  arr: MaybeCommented<From>[],
  fun: (original: From) => To,
): MaybeCommented<To>[] {
  return arr.map((item) => {
    if (typeof item === "object" && item !== null && "commented" in item) {
      return {
        commented: { ...item.commented, segment: fun(item.commented.segment) },
      };
    } else {
      return fun(item);
    }
  });
}

/**
 * Props for the `Delimited` macro.
 */
export type DelimitedProps = {
  /**
   * The default delimiters, as rendered in C-style pseudocode.
   */
  delims: [Expressions, Expressions];
  /**
   * The code to place between the delimiters.
   */
  content: MaybeCommented<Expressions>[];
  /**
   * Render the content Expressions in their own line each, or within a single, shared line of code.
   */
  multiline?: boolean | "emptyLines";
  /**
   * Optional separator to place between the content Expressions.
   */
  separator?: Expressions;
  /**
   * Separator to replace the separator that gets placed after the final piece of content (ignored in single-line rendering).
   */
  finalSeparator?: Expressions;
  /**
   * Exclude the delimiters from rainbowowing, i.e., do not color them according to nesting depth.
   */
  noRainbow?: boolean;
  /**
   * Map every idividual element of `content` after rendering it.
   */
  mapContentIndividual?: (ctx: Context, exps: Expressions) => Expression;
  /**
   * Map the full `content` after rendering it.
   */
  mapContentCollective?: (ctx: Context, exps: Expressions) => Expression;
};

/**
 * Render some content Expressions: wrapped in configurable delimiters,
 * optionally separated, and optionally rendered in their own line each.
 */
export function Delimited(
  {
    content,
    multiline,
    separator,
    finalSeparator,
    delims,
    noRainbow,
    mapContentIndividual = (ctx, exps) => <exps x={exps} />,
    mapContentCollective = (ctx, exps) => <exps x={exps} />,
  }: DelimitedProps,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        const config = getConfig(ctx);

        const open = delims[0];
        const close = delims[1];

        const separatedContent: Expressions = [];
        for (let i = 0; i < content.length; i++) {
          let exps: Expressions;
          let comment: Expressions | undefined = undefined;
          let commentDedicatedLine = false;

          const currentContent = content[i];
          if (
            typeof currentContent === "object" && "commented" in currentContent
          ) {
            exps = currentContent.commented.segment;
            comment = currentContent.commented.comment;
            commentDedicatedLine = !!currentContent.commented.dedicatedLine;
          } else {
            exps = currentContent;
          }

          const addSeparator = (separator !== undefined) &&
            (multiline || (i + 1 < content.length));

          const stuffToRender: Expression[] = [<exps x={exps} />];

          if (!multiline && comment !== undefined) {
            stuffToRender.push(
              <>
                {" "}
                <InlineComment>
                  <exps x={comment} />
                </InlineComment>
              </>,
            );
          }

          if (addSeparator) {
            stuffToRender.push(
              <>
                <Deemph>
                  <exps
                    x={i === content.length - 1 && finalSeparator !== undefined
                      ? finalSeparator
                      : separator}
                  />
                </Deemph>
                {multiline ? "" : " "}
              </>,
            );
          }

          if (multiline) {
            let commentAndContent: Expression = "";
            if (comment !== undefined && commentDedicatedLine) {
              commentAndContent = (
                <CommentLine>
                  <exps x={comment} />
                </CommentLine>
              );
            }

            commentAndContent = (
              <>
                {commentAndContent}
                <Loc
                  comment={comment !== undefined && !commentDedicatedLine
                    ? comment
                    : undefined}
                >
                  <exps x={stuffToRender} />
                </Loc>
              </>
            );

            separatedContent.push(mapContentIndividual(ctx, commentAndContent));
          } else {
            separatedContent.push(
              mapContentIndividual(ctx, <exps x={stuffToRender} />),
            );
          }

          if (i !== content.length - 1 && multiline === "emptyLines") {
            separatedContent.push(<Loc />);
          }
        }

        const betweenDelimiters = multiline
          ? (
            <SpliceLoc>
              <Indent>
                {mapContentCollective(ctx, <exps x={separatedContent} />)}
              </Indent>
            </SpliceLoc>
          )
          : mapContentCollective(ctx, <exps x={separatedContent} />);

        return (
          <Delimiters delims={[open, close]} noRainbow={noRainbow}>
            {betweenDelimiters}
          </Delimiters>
        );
      }}
    />
  );
}

/**
 * Render a full-line comment.
 * Provides its own `<Loc>` invocation.
 */
export function CommentLine(
  { children }: { children?: Expressions },
): Expression {
  return <Loc comment={<exps x={children} />} fullLineComment />;
}

/**
 * Render a keyword.
 */
export function Keyword(
  { children }: { children: Expressions },
): Expression {
  return (
    <Span clazz="kw">
      <exps x={children} />
    </Span>
  );
}

/**
 * Render a keyword, but with different styling than normal keywords.
 */
export function Keyword2(
  { children }: { children: Expressions },
): Expression {
  return (
    <Span clazz="kw2">
      <exps x={children} />
    </Span>
  );
}

/**
 * Visually deemphasize a part of some pseudocode.
 */
export function Deemph(
  { children }: { children: Expressions },
): Expression {
  return (
    <Span clazz="deemph">
      <exps x={children} />
    </Span>
  );
}
