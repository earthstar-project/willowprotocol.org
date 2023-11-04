import {
  Context,
  Expression,
  Invocation,
  is_expression,
  new_macro,
} from "./tsgen.ts";

import { body_, head, html, meta } from "./h.ts";

const statekey = Symbol();

interface Html5State {
  html5_dependencies: Set<string>;
}

function html5_state(ctx: Context): Html5State {
  const state = ctx.state.get(statekey);

  if (state) {
    return <Html5State> state;
  } else {
    ctx.state.set(statekey, {
      html5_dependencies: new Set(),
    });
    return html5_state(ctx);
  }
}

export function html5_dependency(dep: Expression): Expression {
  const macro = new_macro(
    undefined,
    (fully_expanded, ctx) => {
      html5_state(ctx).html5_dependencies.add(fully_expanded);
      return "";
    },
  );

  return new Invocation(macro, [dep]);
}

export function html5_dependency_css(path: Expression): Expression {
  return html5_dependency(`<link rel="stylesheet" href="${path}">`);
}

export function html5_dependency_js(path: Expression): Expression {
  return html5_dependency(`<script type="module" src="${path}"></script>`);
}

export function html5(
  header: Expression,
  body: Expression,
): Expression {
  const macro = new_macro(
    (args, _) => {
      let is_head_done = false;
      let is_body_done = false;

      return [
        `<!doctype html>`,
        html(
          head(
            meta({ charset: "utf-8" }),
            notify(
              (_) => is_head_done = true,
              args[0],
            ),
            new Invocation(
              new_macro(
                (_, ctx) => {
                  if (is_head_done && is_body_done) {
                    return Array.from(html5_state(ctx).html5_dependencies).join(
                      "",
                    );
                  } else {
                    return null;
                  }
                },
              ),
              [],
            ),
          ),
          body_(
            notify(
              (_) => is_body_done = true,
              args[1],
            ),
          ),
        ),
      ];
    },
  );

  return new Invocation(macro, [header, body]);
}

// Behaves just like the given macro, except it also calls the callback with the expanded content of the given macro when it has fully expanded.
export function notify(
  cb: (expanded: string) => void,
  wrapped: Expression,
): Expression {
  const macro = new_macro(
    (args, _) => args[0],
    (fully_expanded, _) => {
      cb(fully_expanded);
      return fully_expanded;
    },
  );

  return new Invocation(macro, [wrapped]);
}
