import { div, span } from "./h.ts";
import { current_per_file_state } from "./out.ts";
import { Expression, Invocation,  new_macro, Context, State } from "./tsgen.ts";

const sidenote_count_key = Symbol("SidenoteCount");

function get_sidenote_count(ctx: Context): number {
  const count = current_per_file_state(ctx).get(sidenote_count_key);

  if (count != undefined) {
      return <number>count;
  } else {
    return 1;
  }
}

function set_sidenote_count(ctx: Context, new_count: number) {
  current_per_file_state(ctx).set(sidenote_count_key, new_count);
}

// Placed inline on small screens, in the margins on larger screens.
export function marginale_inlineable(marginale: Expression): Expression {
    const macro = new_macro(
      (args, _ctx) => {
        return span({class: "aside inline"}, ...args);
        // return div({class: "aside inline"}, ...args);
      }
    );
    
    return new Invocation(macro, [marginale]);
}

// In the margins on larger screens, disappears on small screens.
export function marginale(marginale: Expression): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      return span({class: "aside"}, ...args);
      // return div({class: "aside"}, ...args);
    }
  );
  
  return new Invocation(macro, [marginale]);
}

// In the margins on larger screens, disappears on small screens.
// The first argument renders in the main text, the sidenote renders at the same height as the end of the first argument.
export function sidenote(anchor: Expression, note: Expression): Expression {
  const macro = new_macro(
    (args, ctx) => {
      const num = get_sidenote_count(ctx);
      set_sidenote_count(ctx, num + 1);

      return [
        span({class: "nowrap"}, [
          args[0],
          span({class: "aside_counter"}, `${num}`),
        ]),
        span({class: "aside"}, span({class: "aside_counter"}, `${num}`), args[1]),
        // div({class: "aside"}, span({class: "aside_counter"}, `${num}`), args[1]),
      ];
    }
  );
  
  return new Invocation(macro, [anchor, note]);
}