import { katex } from "./dependencies.ts";
import { html5_dependency_css } from "./html5.ts";

import {
  Expression,
  Invocation,
  new_macro,
} from "./tsgen.ts";

export function $(content: Expression): Invocation {
  const macro = new_macro(
    (args, _ctx) => {
      return [html5_dependency_css("/assets/katex.min.css"), ...args];
    },
    (expanded, ctx) => {
        try {
            return katex.default.renderToString(expanded, {
                displayMode: false,
                output: "html",
            });
        } catch (err) {
            ctx.error("Failed to render katex:");
            ctx.error(err);
            ctx.halt();
            return null;
        }
    }
  );

  return new Invocation(macro, [content]);
}
