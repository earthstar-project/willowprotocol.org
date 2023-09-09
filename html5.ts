import { Expression, Invocation, new_macro } from "./tsgen.ts";

import { html, head, meta, body_ } from "./h.ts";

export function html5<State>(header: Expression<State>, body: Expression<State>): Invocation<State> {
    const macro = new_macro<State>(
        (number_args, state) => {
            if (number_args != 2) {
                throw new Error(`html5 macro has exactly two arguments (the head and the body contents), not ${number_args}.`);
            }

            return [
                `<!doctype html>`,
                html(
                    head(
                        meta({charset: "utf-8"}),
                        0,
                    ),
                    body_(
                        1
                    ),
                ),
            ];
        },
    );

    return { macro, args: [header, body] };
}