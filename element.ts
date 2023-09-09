export type Element<State> = string // to become part of the output verbatim
    | number // an argument
    | Element<State>[] // process in order and concatenate the results
    | Macro<State>;

export class Macro<State> {
    args: Element<State>[];

    constructor(args: Element<State>[]) {
        this.args = args;
    }

    // Return `-1` to delay to next evaluation round.
    top_down(_state: State): Element<State> {
        return this.forward_args();
    }

    bottom_up(evaluated_element: Element<State>, _state: State): Element<State> {
        return evaluated_element;
    }

    protected forward_args(): number[] {
        return this.args.map((_, i) => i);
    }
}

function evaluate<State>(e: Element<State>, state: State, args: Element<State>[]): Element<State> {
    if (typeof e === "string") {
        return e;
    } else if (typeof e === "number") {
        return evaluate(args[e], state, args);
    } else if (Array.isArray(e)) {
        const r: Element<State>[] = [];

        for (const sub_element of e) {
            const evaluated = evaluate(sub_element, state, args);
            if ((typeof evaluated === "string") && r.length > 0 && (typeof r[r.length - 1] === "string")) {
                r[r.length - 1] = `${r[r.length - 1]}${evaluated}`;
            } else {
                r.push(evaluated);
            }
        }

        return r.length === 1 ? r[0] : r;
    } else {
        const td = e.top_down(state);

        if (td === -1) {
            return e;
        } else {
            const expanded = evaluate(td, state, e.args);
            return e.bottom_up(expanded, state);
            // if (typeof expanded === "string") {
            //     return e.bottom_up(expanded, state);
            // } else {
            //     return evaluate(expanded, state, e.args);
            // }
        }
    }
}

export function expand<State>(e: Element<State>, state: State, max_iterations = 8): string {
    let expanded = e;

    for (let i = 0; i < max_iterations; i++) {
        expanded = evaluate(expanded, state, []);

        if (typeof expanded === "string") {
            return expanded;
        }
    }

    throw expanded;
}