import { Expression, Invocation, new_macro } from "./tsgen.ts";

import { body_, head, html, meta } from "./h.ts";

export interface Html5State {
  html5_dependencies: Set<string>;
}

export function html5_initial_state(): Html5State {
  return {
    html5_dependencies: new Set(),
  };
}

export function html5_dependency<State extends Html5State>(dep: string): Expression<State> {
    const macro = new_macro<State>(
        (number_args, state) => {
          if (number_args != 1) {
            throw new Error(
              `html5_dependency macro expects exactly one arguments (the dependency string), not ${number_args}.`,
            );
          }

          state.html5_dependencies.add(dep);
    
          return [];
        },
      );
    
    return { macro, args: [dep] };
}

export function html5_dependency_css<State extends Html5State>(path: string): Expression<State> {
    return html5_dependency(`<link rel="stylesheet" href="${path}">`);
}

export function html5_dependency_js<State extends Html5State>(path: string): Expression<State> {
    return html5_dependency(`<script type="module" src="${path}"></script>`);
}

export function html5<State extends Html5State>(
  header: Expression<State>,
  body: Expression<State>,
): Expression<State> {
  const macro = new_macro<State>(
    (number_args, state) => {
      if (number_args != 2) {
        throw new Error(
          `html5 macro expects exactly two arguments (the head and the body contents), not ${number_args}.`,
        );
      }

      return [
        `<!doctype html>`,
        html(
          head(
            meta({ charset: "utf-8" }),
            0,
            Array.from(state.html5_dependencies),
          ),
          body_(
            "hi",
          ),
        ),
      ];
    },
  );

  return { macro, args: [header, body] };
}
