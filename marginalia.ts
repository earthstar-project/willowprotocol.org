import { div, span } from "./h.ts";
import { Expression, Invocation,  new_macro, Context, State } from "./tsgen.ts";

// Placed inline on small screens, in the margins on larger screens.
export function inline_marginalia(...marginalia: Expression[]): Expression {
    const macro = new_macro(
      (args, _ctx) => {
        return span({class: "aside inline"}, ...args);
      }
    );
    
    return new Invocation(macro, marginalia);
}