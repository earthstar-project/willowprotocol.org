import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";

import getCurrentLine, { Location } from "./get_current_line.ts";
import { Stack, new_stack } from "./stack.ts";

// deno-lint-ignore no-explicit-any
export type State = Map<symbol, any>;

export type Expression =
  | string // to become part of the output verbatim
  | Argument // an argument
  | Expression[] // process in order and concatenate the results
  | Invocation // apply the macro to the arguments
  | ExpandedMacro;

export class Argument {
  exp: Expression;

  constructor(exp: Expression) {
    this.exp = exp;
  }
}

export class Invocation {
  macro: Macro;
  args: Expression[];

  constructor(macro: Macro, args: Expression[]) {
    this.macro = macro;
    this.args = args; 
  }
}

export class ExpandedMacro {
  macro: Macro;
  expanded: Expression;

  constructor(macro: Macro, expanded: Expression) {
    this.macro = macro;
    this.expanded = expanded;
  }
}

export class Macro {
  expand: (args: Argument[], ctx: Context) => Expression | null;
  top_down: (ctx: Context) => void;
  bottom_up: (ctx: Context) => void;
  finalize: (expanded: string, ctx: Context) => string | null;
  location?: Location;

  constructor(
    expand: (args: Argument[], ctx: Context) => Expression | null,
    top_down: (ctx: Context) => void,
    bottom_up: (ctx: Context) => void,
    finalize: (expanded: string, ctx: Context) => string | null,
    location?: Location,
  ) {
    this.expand = expand;
    this.top_down = top_down;
    this.bottom_up = bottom_up;
    this.finalize = finalize;
    this.location = location;
  }
}

export class Context {
  public state: State;
  public stack: Stack<Location>;
  public must_make_progress: boolean;
  public round: number;
  private halted: boolean;
  private console: Console;

  constructor(state: State, console_?: Console) {
    this.state = state;
    this.stack = new_stack();
    this.must_make_progress = false;
    this.round = -1;
    this.halted = false;
    this.console = console_ ? console_ : console /*the global one*/;
  }

  // deno-lint-ignore no-explicit-any
  public warn(...data: any[]): void {
    this.console.warn(Colors.yellow("[warn]"), ...data);
  }

  // deno-lint-ignore no-explicit-any
  public error(...data: any[]): void {
    this.console.error(Colors.red("[err]"), ...data);
  }

  // Terminate macro expansion.
  public halt(): void {
    this.halted = true;
    this.log_trace(this.stack);
  }

  // Returns whether macro expansion was halted prematurely.
  public did_halt(): boolean {
    return this.halted;
  }

  log_trace(stack_: Stack<Location>) {
    this.console.group("");
    let stack = stack_;
    while (!stack.is_empty()) {
      this.console.log("at", format_location(stack.peek()!));
      stack = stack.pop();
    }
    this.console.groupEnd();
  }
}

export function format_location(location: Location): string {
  return `${Colors.bold(Colors.italic(location.method))} in ${style_file(location.file)}${Colors.yellow(`:${location.line}:${location.char}`)}`;
}

export function style_file(s: string): string {
  return Colors.cyan(s);
}

let currently_evaluating = false;

export function evaluate(expression: Expression, console_?: Console): string | Context {
  currently_evaluating = true;  
  const ctx = new Context(new Map(), console_);
  let exp = expression;

  while (!ctx.did_halt()) {
    ctx.round += 1;
    const [evaluated, made_progress] = do_evaluate(exp, ctx, []);
    if (typeof evaluated === "string") {
      currently_evaluating = false;
      return evaluated;
    } else if (!made_progress) {
      if (ctx.must_make_progress) {
        currently_evaluating = false;
        ctx.error("Macro expansion did not terminate.");
        // TODO log the leaf macros
        return ctx;
      } else {
        // Continue evaluating but set the must_make_progress flag.
        ctx.must_make_progress = true;
        exp = evaluated;
      }      
    } else {
      // Continue evaluating and reset the must_make_progress flag.
      exp = evaluated;
      ctx.must_make_progress = false;
    }
  }

  return ctx;
}

export function do_evaluate(
  expression: Expression,
  ctx: Context,
  args: Expression[],
): [Expression, boolean] {
  if (ctx.did_halt()) {
    return [expression, false];
  }

  if (typeof expression === "string") {
    return [expression, false];
  } else if (expression instanceof Argument) {
    return do_evaluate(expression.exp, ctx, args);
  } else if (Array.isArray(expression)) {
    let made_progress = false;
    let only_strings = true;
    const all_evaluated: Expression = [];

    expression.forEach((exp) => {
      const [evaluated, did_make_progress] = do_evaluate(exp, ctx, args);
      made_progress = made_progress || did_make_progress;
      only_strings = only_strings && (typeof evaluated === "string");
      all_evaluated.push(evaluated);
    });

    if (only_strings) {
      return [all_evaluated.join(""), made_progress];
    } else {
      return [all_evaluated, made_progress];
    }
  } else if (expression instanceof Invocation) {
    const { macro, args } = expression;

    if (macro.location) {
      ctx.stack = ctx.stack.push(macro.location!);
    }

    const args_to_expand = args.map((_, i) => new Argument(args[i]));
    const expanded = macro.expand(args_to_expand, ctx);
    if (ctx.did_halt()) {
      return [expression, false];
    }

    if (macro.location) {
      ctx.stack = ctx.stack.pop();
    }

    if (expanded === null) {
      return [expression, false];
    } else {
      const [expanded_expanded, _] = do_evaluate(new ExpandedMacro(macro, expanded), ctx, args);
      return [expanded_expanded, true];
    }
  } else if (expression instanceof ExpandedMacro) {
    const macro = expression.macro;
    const expanded = expression.expanded;

    if (macro.location) {
      ctx.stack = ctx.stack.push(macro.location!);
    }
    
    macro.top_down(ctx);
    if (ctx.did_halt()) {
      return [expression, false];
    }

    const [expanded_expanded, made_progress] = do_evaluate(expanded, ctx, args);
    if (ctx.did_halt()) {
      return [expression, false];
    }
    
    if (typeof expanded_expanded === "string") {
      const finalized = macro.finalize(expanded_expanded, ctx);
      if (ctx.did_halt()) {
        return [expression, false];
      }

      macro.bottom_up(ctx);
      if (ctx.did_halt()) {
        return [expression, false];
      }

      if (macro.location) {
        ctx.stack = ctx.stack.pop();
      }

      if (finalized === null) {
        return [expanded_expanded, false];
      } else {
        return [finalized, true];
      }
    } else {
      macro.bottom_up(ctx);
      if (ctx.did_halt()) {
        return [expression, false];
      }
      
      if (macro.location) {
        ctx.stack = ctx.stack.pop();
      }
      return [new ExpandedMacro(macro, expanded_expanded), made_progress];
    }
  } else {
    console.error(expression);
    throw new Error("unreachable, or so they thought...");
  }
}

export function new_macro(
  expand: (args: Argument[], ctx: Context) => (Expression | null) = default_expand,
  finalize: (expanded: string, ctx: Context) => (string | null) = default_finalize,
  td: (ctx: Context) => void = default_td,
  bu: (ctx: Context) => void = default_bu,
  offset = 1,
): Macro {
  if (!currently_evaluating) {
    const macro_def = getCurrentLine({frames: 1 + offset});
    const callsite = getCurrentLine({frames: 2 + offset});
    callsite.method = macro_def.method;
    return new Macro(expand, td, bu, finalize, callsite);
  } else {
    return new Macro(expand, td, bu, finalize, undefined);
  }  
}

export function default_expand(args: Argument[], _ctx: Context): Expression {
  return args;
}

export function default_td(_ctx: Context) {
  return;
}

export function default_bu(_ctx: Context) {
  return;
}

export function default_finalize(expanded: string, _ctx: Context): string {
  return expanded;
}

// Considers every array as an expression
// deno-lint-ignore no-explicit-any
export function is_expression(x: any): boolean {
  if (typeof x === "function") {
    return true;
  } else if (x === -1) {
    return true;
  } else if (typeof x === "string") {
    return true;
  } else if (Array.isArray(x)) {
    return true;
  } else if (x instanceof Invocation || x instanceof ExpandedMacro || x instanceof Argument) {
    return true;
  } else {
    return false;
  }
}

export function surpress_output(
  ...exps: Expression[]
): Expression {
  const macro = new_macro(
    undefined,
    (_, _ctx) => "",
  );
  
  return new Invocation(macro, exps);
}