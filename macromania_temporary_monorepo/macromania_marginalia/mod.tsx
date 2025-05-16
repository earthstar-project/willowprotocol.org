import { Context } from "macromaniajsx/jsx-runtime";
import { Colors, createConfigOptions, createLogger, TagProps } from "./deps.ts";
import {
  Counter,
  Expression,
  Expressions,
  makeNumberingRenderer,
  Span,
} from "./deps.ts";
import { Div } from "./deps.ts";

const l = createLogger("LoggerMarginalia");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerMarginalia };

export type MarginaliaConfig = {
  /**
   * The HTML element to wrap to use for marginales.
   *
   * Defaults to `span`.
   */
  tag?: (props: TagProps & { children?: Expressions }) => Expression;
  /**
   * Html class(es) to apply to marginales.
   *
   * Defaults to `marginale`.
   */
  clazz?: Expressions;
  /**
   * The sidenote counter.
   */
  sidenoteCounter?: Counter;
  /**
   * How to render a sidenote counter value. See {@link https://github.com/worm-blossom/macromania-counters}
   */
  renderSidenoteCounter?: (ctx: Context, numbering: number[]) => Expression;
};

const [
  getConfig,
  ConfigMarginalia,
] = createConfigOptions<MarginaliaConfig, MarginaliaConfig>(
  "ConfigMarginalia",
  () => ({
    tag: Span,
    clazz: "marginale",
    sidenoteCounter: undefined,
    renderSidenoteCounter: makeNumberingRenderer(),
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.tag !== undefined) {
      newValue.tag = update.tag;
    }
    if (update.clazz !== undefined) {
      newValue.clazz = update.clazz;
    }
    if (update.sidenoteCounter !== undefined) {
      newValue.sidenoteCounter = update.sidenoteCounter;
    }
    if (update.renderSidenoteCounter !== undefined) {
      newValue.renderSidenoteCounter = update.renderSidenoteCounter;
    }

    return newValue;
  },
);
export { ConfigMarginalia };

export type MarginaleProps = {
  /**
   * Additional class(es) for this marginale.
   */
  extraClasses?: Expressions;
  /**
   * Whether the marginale should be inlined into the main body if the viewport us too small.
   */
  inlineable?: boolean;
};

/**
 * Create the correct props (excluding `children`) for the marginalia wrapper,
 * considering config and MarginaliaProps.
 */
function wrapperProps(ctx: Context, mp: MarginaleProps): TagProps {
  const config = getConfig(ctx);
  let clazz = config.clazz === undefined
    ? []
    : (Array.isArray(config.clazz) ? config.clazz : [config.clazz]);

  if (mp.extraClasses !== undefined) {
    clazz = clazz.concat(
      Array.isArray(mp.extraClasses) ? mp.extraClasses : [mp.extraClasses],
    );
  }

  if (mp.inlineable) {
    clazz = clazz.concat(["inlineable"]);
  }

  return { clazz };
}

/**
 * Elements to be placed in the right margin.
 */
export function Marginale(props: MarginaleProps & { children?: Expressions }) {
  return (
    <impure
      fun={(ctx) => {
        const config = getConfig(ctx);
        const Wrapper = config.tag!;
        const wProps: TagProps & { children?: Expressions } = wrapperProps(
          ctx,
          props,
        );
        wProps.children = props.children;
        return Wrapper(wProps);
      }}
    />
  );
}

/**
 * Elements to be placed in the right margin, with a number in the text indicating the sidenote.
 *
 * @param note - The elements to place in the margin.
 * @param children - The elements to which to anchor the note.
 */
export function Sidenote(
  props: MarginaleProps & { children?: Expressions; note: Expressions },
) {
  const newProps = { ...props, notes: [props.note] };
  return Sidenotes(newProps);
}

/**
 * Several sidenotes, all anchored to the same element.
 *
 * @param note - The elements to place in the margin.
 * @param children - The elements to which to anchor the note.
 */
export function Sidenotes(
  props: MarginaleProps & { children?: Expressions; notes: Expressions[] },
) {
  return (
    <impure
      fun={(ctx) => {
        const config = getConfig(ctx);
        const counter = config.sidenoteCounter;

        if (counter === undefined) {
          l.error(
            ctx,
            `Must set a figure counter via the ${
              Colors.yellow(`<Config/>`)
            } macro before using the ${`<Figure>`} macro.`,
          );
          l.logGroup(ctx, () => {
            l.error(
              ctx,
              `More specifically, in the ${
                Colors.yellow(`options`)
              } prop of the ${Colors.yellow(`<Config/>`)}, use the ${
                Colors.yellow(
                  `<ConfigMarginalia sidenoteCounter={someCounter}/>`,
                )
              }.`,
            );
          });
          return ctx.halt();
        }

        const counters: Expression[] = [];
        const theNotes: Expression[] = [];

        const { children, notes } = props;

        for (let i = 0; i < notes.length; i++) {
          counter.increment(ctx);

          counters.push(
            config.renderSidenoteCounter!(ctx, counter.getFullValue(ctx)),
          );
          theNotes.push(
            Marginale({
              ...props,
              children: (
                <>
                  <Span clazz="sidenoteCounter">
                    {counters[counters.length - 1]}
                  </Span>
                  <exps x={notes[i]} />
                </>
              ),
            }),
          );

          if (i + 1 < notes.length) {
            counters.push(",");
          }
        }

        return (
          <>
            <Span clazz="nowrap">
              <exps x={children} />
              <Span clazz="sidenoteCounter">
                <exps x={counters} />
              </Span>
            </Span>
            <exps x={theNotes} />
          </>
        );
      }}
    />
  );
}

export function WaitForMarginales(): Expression {
  return <Div clazz="clearRight"></Div>;
}
