import { Expression, Invocation, default_bu, default_td, new_macro } from "./tsgen.ts";

import { body_, head, html, meta } from "./h.ts";
import { Macro } from "./element.ts";

export interface Html5State {
  html5_dependencies: Set<string>;
}

export function html5_initial_state(): Html5State {
  return {
    html5_dependencies: new Set(),
  };
}

export function html5_dependency<State extends Html5State>(dep: Expression<State>): Expression<State> {
    const macro = new_macro<State>(
      default_td,
      (fully_expanded, state) => {
        state.html5_dependencies.add(fully_expanded);
        return "";
      },
    );
    
    return { macro, args: [dep] };
}

export function html5_dependency_css<State extends Html5State>(path: Expression<State>): Expression<State> {
    return html5_dependency(`<link rel="stylesheet" href="${path}">`);
}

export function html5_dependency_js<State extends Html5State>(path: Expression<State>): Expression<State> {
    return html5_dependency(`<script type="module" src="${path}"></script>`);
}

export function html5<State extends Html5State>(
  header: Expression<State>,
  body: Expression<State>,
): Expression<State> {
  const macro = new_macro<State>(
    (args, _) => {
      let is_head_done = false;
      let is_body_done = false;

      return [
        `<!doctype html>`,
        html(
          head(
            meta({ charset: "utf-8" }),
            notify(
              _ => is_head_done = true,
              args[0],
            ),
            {
              macro: new_macro<State>(
                (_, state) => {
                  if (is_head_done && is_body_done) {
                    return Array.from(state.html5_dependencies).join("");
                  } else {
                    return -1;
                  }
                }
              ),
              args: [],
            },
          ),
          body_(
            notify(
              _ => is_body_done = true,
              args[1],
            ),
          ),
        ),
      ];
    },
  );

  return { macro, args: [header, body] };
}

// Behaves just like the given macro, except it also calls the callback with the expanded content of the given macro when it has fully expanded. 
export function notify<S>(cb: (expanded: string) => void, wrapped: Expression<S>): Expression<S> {
  const macro = new_macro<S>(
    (args, _) => args[0],
    (fully_expanded, _) => {
      cb(fully_expanded);
      return fully_expanded;
    },
  );

  return { macro, args: [wrapped] };
}