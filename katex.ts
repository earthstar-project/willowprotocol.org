import { katex } from "./dependencies.ts";
import { html5_dependency_css } from "./html5.ts";

import {
  Expression,
  Invocation,
  is_expression,
  new_macro,
} from "./tsgen.ts";

export function $(fst: Expression, snd?: Expression, third?: Expression) : Expression {
  const macro = new_macro(
    (args, _ctx) => {
      let pre = null;
      let math = args[0];
      let post = null;

      if (args.length === 3) {
        pre = args[0];
        math = args[1];
        post = args[2];
      } else if (args.length === 2) {
        post = args[1];
      }

      return [html5_dependency_css("/named_assets/katex.min.css"), [
        pre ? ["\\htmlClass{normal_text}{\\text{", pre, "}}"] : "",
        math,
        post ? ["\\htmlClass{normal_text}{\\text{", post, "}}"] : "",
      ]];
    },
    (expanded, ctx) => {
        try {
            return katex.default.renderToString(expanded, {
                displayMode: false,
                throwOnError: true,
                output: "html",
                strict: false,
                trust: true,
            });
        } catch (err) {
            ctx.error("Failed to render katex:");
            ctx.error(err);
            ctx.halt();
            return null;
        }
    }
  );

  if (third) {
    return new Invocation(macro, [fst, snd!, third]);
  } else if (snd) {
    return new Invocation(macro, [fst, snd]);
  } else {
    return new Invocation(macro, [fst]);
  }
}

export function $dot(content: Expression): Expression {
  return $(content, ".");
}

export function $comma(content: Expression): Expression {
  return $(content, ",");
}
