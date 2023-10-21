import { Element, Macro, expand } from "./element.ts";
import { col } from "./h.ts";
import { area } from "./h.ts";

import { out_directory } from "./out.ts";

class BMacro<State> extends Macro<State> {
    rep: number;
    constructor(arrgs: Element<State>[], rep: number) {
        super(arrgs);
        this.rep = rep;
    }

    top_down(_state: State): Element<State> {
        const r: Element<State>[] = ["<b>"];

        for (let i = 0; i < this.rep; i++) {
            r.push(0);
        }

        r.push("</b>");

        return r;
    }

    bottom_up(evaluated_string: string, _state: State): string {
        return evaluated_string//.slice(2, 7);
    }
}

function b<State>(rep: number, e: Element<State>): BMacro<State> {
    return new BMacro([e], rep);
}

const yay = expand<null>([
    "hello ",
    "world, ", b(4, "what a nice day"), "bla"
], null);

// console.log(yay);

const tagnames = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "colgroup",
    "command",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "html",
    "i",
    "iframe",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "main",
    "map",
    "mark",
    "menu",
    "meter",
    "nav",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "section",
    "select",
    "small",
    "span",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "u",
    "ul",
    "var",
    "video",
];

for (const name of tagnames) {
//     console.log(`
// export function ${name}<State>(attributes: Attributes = {}, ...args: Element<State>[]): Html<State> {
//     return h("${name}", attributes, args);
// }`);

console.log(`
export function ${name}<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function ${name}<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function ${name}<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("${name}", attributes, ...macro_args);
    } else {
        return h("${name}", {}, ...args);
    }
}`);
    
}
