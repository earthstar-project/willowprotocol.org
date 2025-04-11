import {
  Def,
  dependencyCss,
  dependencyJs,
  Div,
  Marginale,
  PreviewScope,
  PreviewScopePushWrapper,
  R,
  ResolveAsset,
  Span,
} from "../mod.tsx";
import { Config } from "./deps.ts";
import { createConfigOptions } from "./deps.ts";
import {
  Context,
  createLogger,
  createSubstate,
  Expression,
  Expressions,
} from "./deps.ts";

import { A, addName, hrefToName, Li, Ul } from "../mod.tsx";

const l = createLogger("LoggerWip");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerWip };

type State = {
  /**
   * Did we already print a warning that there are WIP annotations being rendered?
   */
  didWarnAlready: boolean;
  nextId: number;
  // maps numeric todo ids to the fully rendered todo
  renderedTodos: Map<number, string>;
};

const [getState, setState] = createSubstate<State>(
  () => ({
    didWarnAlready: false,
    nextId: 0,
    renderedTodos: new Map(),
  }),
);

export type WipConfig = {
  /**
   * Whether to hide WIP annotations (and not warn when there are any).
   */
  hideWIP?: boolean;
};

const [
  getConfig,
  ConfigWip,
] = createConfigOptions<WipConfig, WipConfig>(
  "ConfigWip",
  () => ({
    hideWIP: false,
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.hideWIP !== undefined) {
      newValue.hideWIP = update.hideWIP;
    }

    return newValue;
  },
);
export { ConfigWip };

export type WipProps = {
  /**
   * Render not in the margin but inline.
   */
  inline?: boolean;
  /**
   * A css color to determine the foreground color of the annotation.
   */
  fg?: Expressions;
  /**
   * A css color to determine the background color of the annotation.
   */
  bg?: Expressions;
  /**
   * Transform the annoation content.
   */
  wrap?: (ctx: Context, epx: Expression) => Expression;
  /**
   * The annotation content.
   */
  children?: Expressions;
};

/**
 * Render a WIP annotation, either in the margin (default) or inline.
 */
export function Wip(
  {
    inline,
    fg = "#3e71e0",
    bg = "inherit",
    wrap = (ctx, exp) => exp,
    children,
  }: WipProps,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        const config = getConfig(ctx);

        if (config.hideWIP) {
          // Do nothing if configured that way.
          return "";
        }

        // Otherwise, print a warning if this is the first WIP annotation being processed.
        const state = getState(ctx);
        if (!state.didWarnAlready) {
          l.warn(ctx, `Rendering at least one work-in-progress annotation.`);
          l.at(ctx);
          state.didWarnAlready = true;
        }
        state.nextId += 1;

        // Render the annotation.
        const clazz: string[] = [];
        if (inline) {
          clazz.push("inline");
        }

        const theId = id(state.nextId);
        addName(ctx, theId);

        const ret = (
          <map
            fun={(evaled, _ctx) => {
              state.renderedTodos.set(state.nextId, evaled);
              return evaled;
            }}
          >
            (
            <Span
              clazz={clazz}
              id={theId}
              style={
                <>
                  font-family: var(--font-mono); font-size: 0.85em; color:{" "}
                  <exps x={fg} />; background-color: <exps x={bg} />;
                  {inline ? "margin: 0 0.1em;" : ""};padding: 0.2em
                  0.1em;border-radius: 4px;box-decoration-break: clone;
                </>
              }
            >
              {wrap(ctx, <exps x={children} />)}
            </Span>
            )
          </map>
        );

        if (inline) {
          return ret;
        } else {
          return <Marginale>{ret}</Marginale>;
        }
      }}
    />
  );
}

/**
 * Renders a list of all WIP notes created up to this point.
 */
export function RenderAllWips(): Expression {
  return (
    <impure
      fun={(ctx) => {
        const state = getState(ctx);

        const lis: Expression[] = [];
        state.renderedTodos.forEach((rendered, numId) => {
          lis.push(
            <Li>
              <A href={hrefToName(ctx, id(numId))!}>{rendered}</A>
            </Li>,
          );
        });

        return (
          <Ul>
            <exps x={lis} />
          </Ul>
        );
      }}
    />
  );
}

function id(numId: number): string {
  return `todo${numId}gkengkeagrn`;
}
