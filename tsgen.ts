export type Expression<S> =
  | string // to become part of the output verbatim
  | 0 // an argument
  | Expression<S>[] // process in order and concatenate the results
  | Invocation<S>; // apply the macro to the arguments

export type Invocation<S> = {
  macro: Macro<S>;
  args: Expression<S>[];
};

export interface Macro<S> {
  top_down(number_args: number, state: S): Expression<S>;
  bottom_up(fully_expanded: string, state: S): string;
  cleanup(is_final_invocation: boolean, state: S): void;
}

export function evaluate<S>(expression: Expression<S>, state: S): string {
  let exp = expression;
  while (true) {
    const [evaluated, made_progress] = do_evaluate(exp, state, []);

    if (typeof evaluated === "string") {
      return evaluated;
    } else if (!made_progress) {
      throw new Error(JSON.stringify(evaluated, undefined, 2));
    } else {
      exp = evaluated;
    }
  }
}

export function do_evaluate<S>(
  expression: Expression<S>,
  state: S,
  args: Expression<S>[],
): [Expression<S>, boolean] {
  if (typeof expression === "string") {
    return [expression, false];
  } else if (typeof expression === "number") {
    return do_evaluate(args[expression], state, args);
  } else if (Array.isArray(expression)) {
    let made_progress = false;
    let only_strings = true;
    const all_evaluated: Expression<S> = [];

    expression.forEach((exp) => {
      const [evaluated, did_make_progress] = do_evaluate(exp, state, args);
      made_progress = made_progress || did_make_progress;
      only_strings = only_strings && (typeof evaluated === "string");
      all_evaluated.push(evaluated);
    });

    if (only_strings) {
      return [all_evaluated.join(""), made_progress];
    } else {
      return [all_evaluated, made_progress];
    }
  } else {
    const { macro, args } = expression;
    const td = macro.top_down(args.length, state);

    if (td === -1) {
      return [expression, false];
    } else {
      const [expanded, _] = do_evaluate(td, state, args);
      if (typeof expanded === "string") {
        const bu = macro.bottom_up(expanded, state);
        macro.cleanup(true, state);
        return [bu, true];
      } else {
        macro.cleanup(false, state);
        return [expanded, true];
      }
    }
  }
}

export function new_macro<S>(
  td?: (number_args: number, state: S) => Expression<S>,
  bu?: (fully_expanded: string, state: S) => string,
  cu?: (is_final_invocation: boolean, state: S) => void,
): Macro<S> {
  return {
    top_down: td ? td : default_td,
    bottom_up: bu ? bu : default_bu,
    cleanup: cu ? cu : (_final, _state) => {},
  };
}

export function default_td<S>(number_args: number, _state: S): Expression<S> {
  return forward_args(number_args);
}

export function default_bu<S>(fully_expanded: string, _state: S): string {
  return fully_expanded;
}

export function forward_args(number_args: number): number[] {
    const r = [];
    for (let i = 0; i < number_args; i++) {
      r.push(i);
    }
    return r;
  }

  // Considers every array as an expression
  // deno-lint-ignore no-explicit-any
  export function is_expression(x: any): boolean {
    if (typeof x === "number") {
      return true;
    } else if (typeof x === "string") {
      return true;
    } else if (Array.isArray(x)) {
      return true;
    } else if (typeof x === "object" && x != null) {
      return Object.hasOwn(x, "macro") && Object.hasOwn(x, "args");
    } else {
      return false;
    }
  }