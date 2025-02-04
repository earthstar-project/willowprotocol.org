// deno-lint-ignore-file no-explicit-any
import { renderMessagePrefix, styleDebuggingInformation } from "./deps.ts";
import { logGte } from "./deps.ts";
import { logLt } from "./deps.ts";
import {
  Context,
  createConfigOptions,
  createSubstate,
  Expression,
  Expressions,
  LogLevel,
} from "./deps.ts";

type GlobalLoggerConfig = {
  /**
   * The logging level to apply to all loggers whose level has not been
   * overwritten explicitly.
   */
  defaultLevel: LogLevel;
};

export type GlobalLoggerConfigUpdate = {
  /**
   * The logging level to apply to all loggers whose level has not been
   * overwritten explicitly.
   */
  defaultLevel: LogLevel;
};

const [
  getGlobalConfig,
  ConfigLoggers,
] = createConfigOptions<GlobalLoggerConfig, GlobalLoggerConfigUpdate>(
  "ConfigLoggers",
  () => ({
    defaultLevel: "warn",
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    newValue.defaultLevel = update.defaultLevel;
    return newValue;
  },
);
export { ConfigLoggers };

type GlobalState = {
  /**
   * True iff and only if at least one warning or error was logged.
   */
  didWarnOrWorse: boolean;
};

const [getGlobalState, setGlobalState] = createSubstate<GlobalState>(() => ({
  didWarnOrWorse: false,
}));

/**
 * Return `true` if at least one warning or error was logged by any logger.
 */
export function didWarnOrWorse(ctx: Context): boolean {
  return getGlobalState(ctx).didWarnOrWorse;
}

/**
 * Create a new logger. It can be configured independently from all other loggers.
 */
export function createLogger(setterName: string): Logger {
  const [getLocalState, _setLocalState] = createSubstate<LocalState>(() => ({
    groupLevel: 0,
  }));

  const [getLocalConfig, ConfigMacro] = createConfigOptions<
    LoggerOptions,
    LoggerOptions
  >(setterName, () => ({}), (_oldValue, update) => {
    const newValue = { ...update };
    return newValue;
  });

  function log(ctx: Context, level: LogLevel, ...msg: any[]) {
    const localState = getLocalState(ctx);
    const globalState = getGlobalState(ctx);
    const localConfig = getLocalConfig(ctx);
    const globalConfig = getGlobalConfig(ctx);

    if (logGte(level, "warn")) {
      globalState.didWarnOrWorse = true;
    }

    const threshold = localConfig.level ?? globalConfig.defaultLevel;

    if (logLt(level, threshold)) {
      return;
    }

    const rendered = renderMessagePrefix(level, localState.groupLevel);
    ctx.log(rendered, ...msg);
  }

  function Log(props: LogProps): Expression {
    return (
      <map
        fun={(evaled, ctx) => {
          log(ctx, props.level, evaled);
          return "";
        }}
      >
        {props.children}
      </map>
    );
  }

  function LogGroup(props: { children?: Expressions }): Expression {
    return (
      <lifecycle
        pre={logStartGroup}
        post={logEndGroup}
      >
        {props.children}
      </lifecycle>
    );
  }

  function logStartGroup(ctx: Context) {
    const localState = getLocalState(ctx);
    localState.groupLevel += 1;
  }

  function logEndGroup(ctx: Context) {
    const localState = getLocalState(ctx);
    localState.groupLevel -= 1;

    if (localState.groupLevel < 0) {
      throw new Error(
        "Called `logEndGroup` without a corresponding rpeceding call to `logStartGroup`",
      );
    }
  }

  function at(ctx: Context) {
    const localState = getLocalState(ctx);
    ctx.log(
      "       ",
      "    ".repeat(localState.groupLevel + 1),
      `at ${styleDebuggingInformation(ctx.getCurrentDebuggingInformation())}`,
    );
  }

  function At(): Expression {
    return <impure fun={(ctx) => {
      at(ctx);
      return "";
    }} />
  }

  return {
    ConfigMacro,
    Log,
    LogGroup,
    Debug: (props: { children?: Expressions }) =>
      Log({ ...props, level: "debug" }),
    Trace: (props: { children?: Expressions }) =>
      Log({ ...props, level: "trace" }),
    Info: (props: { children?: Expressions }) =>
      Log({ ...props, level: "info" }),
    Warn: (props: { children?: Expressions }) =>
      Log({ ...props, level: "warn" }),
    Error: (props: { children?: Expressions }) =>
      Log({ ...props, level: "error" }),
    log,
    logStartGroup,
    logEndGroup,
    logGroup: (ctx: Context, thunk: () => void) => {
      logStartGroup(ctx);
      thunk();
      logEndGroup(ctx);
    },
    debug: (ctx: Context, ...msg: any[]) => log(ctx, "debug", ...msg),
    trace: (ctx: Context, ...msg: any[]) => log(ctx, "trace", ...msg),
    info: (ctx: Context, ...msg: any[]) => log(ctx, "info", ...msg),
    warn: (ctx: Context, ...msg: any[]) => log(ctx, "warn", ...msg),
    error: (ctx: Context, ...msg: any[]) => log(ctx, "error", ...msg),
    at,
    At,
  };
}

/**
 * A logger, as created by the `createLogger` function.
 *
 * All internal state is encapsulated, the logger is simply a collection of
 * macros and functions for logging and for configuring the logger.
 *
 * Uppercase members are macros, lowercase members are regular functions.
 */
export type Logger = {
  /**
   * Set the logging level of this logger.
   */
  ConfigMacro: (props: LoggerOptions) => Expression;
  /**
   * Evaluate the children and log the result.
   * @param - level - The {@linkcode LogLevel} at which to log.
   */
  Log: (props: LogProps) => Expression;
  /**
   * Group together all logger calls happening inside this macro.
   */
  LogGroup: (props: { children?: Expressions }) => Expression;
  /**
   * Evaluate the children and log the result at level `"debug"`.
   */
  Debug: (props: { children?: Expressions }) => Expression;
  /**
   * Evaluate the children and log the result at level `"trace"`.
   */
  Trace: (props: { children?: Expressions }) => Expression;
  /**
   * Evaluate the children and log the result at level `"info"`.
   */
  Info: (props: { children?: Expressions }) => Expression;
  /**
   * Evaluate the children and log the result at level `"warn"`.
   */
  Warn: (props: { children?: Expressions }) => Expression;
  /**
   * Evaluate the children and log the result at level `"error"`.
   */
  Error: (props: { children?: Expressions }) => Expression;
  /**
   * Log the current top of the macro stack trace.
   */
  At: () => Expression;
  /**
   * Log a message at a given {@linkcode LogLevel}.
   * @param - level - The {@linkcode LogLevel} at which to log.
   * @param - msg - The message to log.
   */
  log: (ctx: Context, level: LogLevel, ...msg: any[]) => void;
  /**
   * Evaluate the given function in a context in which all logging is grouped.
   */
  logGroup: (ctx: Context, thunk: () => void) => void;
  /**
   * Start a level of grouping for all further logger calls. Should be paired
   * with a call to {@linkcode logEndGroup}.
   */
  logStartGroup: (ctx: Context) => void;
  /**
   * End a level of grouping for all further logger calls. Should be preceded
   * by a call to {@linkcode logStartGroup}.
   */
  logEndGroup: (ctx: Context) => void;
  /**
   * Log a message at level `"debug"`.
   */
  debug: (ctx: Context, ...msg: any[]) => void;
  /**
   * Log a message at level `"trace"`.
   */
  trace: (ctx: Context, ...msg: any[]) => void;
  /**
   * Log a message at level `"info"`.
   */
  info: (ctx: Context, ...msg: any[]) => void;
  /**
   * Log a message at level `"warn"`.
   */
  warn: (ctx: Context, ...msg: any[]) => void;
  /**
   * Log a message at level `"error"`.
   */
  error: (ctx: Context, ...msg: any[]) => void;
  /**
   * Log the current top of the macro stack trace.
   */
  at: (ctx: Context) => void;
};

/**
 * The configuration options for an individual logger.
 */
export type LoggerOptions = {
  /**
   * Set the logging level for this logger. Uses the global default level when
   * undefined.
   */
  level?: LogLevel;
};

/**
 * Props for the `Log` macro.
 */
type LogProps = {
  /**
   * The {@linkcode LogLevel} at which to log.
   */
  level: LogLevel;
  children?: Expressions;
};

type LocalState = {
  groupLevel: number;
};
