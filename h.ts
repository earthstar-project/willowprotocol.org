import { Expression, Macro, Invocation, new_macro, forward_args, is_expression } from "./tsgen.ts";

export type Attributes = Record<PropertyKey, string>;

function mac<State>(tag_name: string, attributes: Attributes, is_non_void_element: boolean): Macro<State> {
    return new_macro(
        (number_args, _state) => {
            if (is_non_void_element) {
                return [`${tag_name} ${render_attributes()}>`, ...forward_args(number_args), `</${tag_name}>`];
            } else {
                return `<${tag_name} ${render_attributes()} />`;
            }
        }
    );

    function render_attributes(): string {
        const fragments: string[] = [];

        for (const name in attributes) {
            const value = attributes[name];
            if (value === "") {
                fragments.push(name);
            } else {
                fragments.push(`${name}="${value}"`);
            }
        }

        return fragments.join(" ");
    }
}

export function h<State>(tag_name: string, attributes: Attributes = {}, ...args: Expression<State>[]): Invocation<State> {
    return {
        macro: mac(tag_name, attributes, true),
        args,
    };
}

export function area<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("area", attributes, true),
        args: [],
    };
}

export function base<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("base", attributes, true),
        args: [],
    };
}

export function br<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("br", attributes, true),
        args: [],
    };
}

export function col<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("col", attributes, true),
        args: [],
    };
}

export function embed<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("embed", attributes, true),
        args: [],
    };
}

export function hr<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("hr", attributes, true),
        args: [],
    };
}

export function img<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("img", attributes, true),
        args: [],
    };
}

export function input<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("input", attributes, true),
        args: [],
    };
}

export function link<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("link", attributes, true),
        args: [],
    };
}

export function meta<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("meta", attributes, true),
        args: [],
    };
}

export function source<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("source", attributes, true),
        args: [],
    };
}

export function track<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("track", attributes, true),
        args: [],
    };
}

export function wbr<State>(attributes: Attributes = {}): Invocation<State> {
    return {
        macro: mac("wbr", attributes, true),
        args: [],
    };
}

export function a<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function a<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function a<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("a", attributes, ...macro_args);
    } else {
        return h("a", {}, ...args);
    }
}

export function abbr<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;   
export function abbr<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function abbr<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("abbr", attributes, ...macro_args);
    } else {
        return h("abbr", {}, ...args);
    }
}

export function address<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function address<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function address<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("address", attributes, ...macro_args);
    } else {
        return h("address", {}, ...args);
    }
}

export function article<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function article<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function article<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("article", attributes, ...macro_args);
    } else {
        return h("article", {}, ...args);
    }
}

export function aside<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function aside<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function aside<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("aside", attributes, ...macro_args);
    } else {
        return h("aside", {}, ...args);
    }
}

export function audio<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function audio<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function audio<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("audio", attributes, ...macro_args);
    } else {
        return h("audio", {}, ...args);
    }
}

export function b<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function b<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function b<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("b", attributes, ...macro_args);
    } else {
        return h("b", {}, ...args);
    }
}

export function bdi<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function bdi<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function bdi<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("bdi", attributes, ...macro_args);
    } else {
        return h("bdi", {}, ...args);
    }
}

export function bdo<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function bdo<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function bdo<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("bdo", attributes, ...macro_args);
    } else {
        return h("bdo", {}, ...args);
    }
}

export function blockquote<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function blockquote<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function blockquote<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("blockquote", attributes, ...macro_args);
    } else {
        return h("blockquote", {}, ...args);
    }
}

export function body_<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function body_<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function body_<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("body", attributes, ...macro_args);
    } else {
        return h("body", {}, ...args);
    }
}

export function button<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function button<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function button<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("button", attributes, ...macro_args);
    } else {
        return h("button", {}, ...args);
    }
}

export function canvas<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function canvas<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function canvas<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("canvas", attributes, ...macro_args);
    } else {
        return h("canvas", {}, ...args);
    }
}

export function caption<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function caption<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function caption<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("caption", attributes, ...macro_args);
    } else {
        return h("caption", {}, ...args);
    }
}

export function cite<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function cite<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function cite<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("cite", attributes, ...macro_args);
    } else {
        return h("cite", {}, ...args);
    }
}

export function code<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function code<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function code<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("code", attributes, ...macro_args);
    } else {
        return h("code", {}, ...args);
    }
}

export function colgroup<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function colgroup<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function colgroup<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("colgroup", attributes, ...macro_args);
    } else {
        return h("colgroup", {}, ...args);
    }
}

export function command<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function command<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function command<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("command", attributes, ...macro_args);
    } else {
        return h("command", {}, ...args);
    }
}

export function datalist<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function datalist<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function datalist<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("datalist", attributes, ...macro_args);
    } else {
        return h("datalist", {}, ...args);
    }
}

export function dd<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function dd<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function dd<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dd", attributes, ...macro_args);
    } else {
        return h("dd", {}, ...args);
    }
}

export function del<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function del<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function del<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("del", attributes, ...macro_args);
    } else {
        return h("del", {}, ...args);
    }
}

export function details<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function details<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function details<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("details", attributes, ...macro_args);
    } else {
        return h("details", {}, ...args);
    }
}

export function dfn<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function dfn<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function dfn<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dfn", attributes, ...macro_args);
    } else {
        return h("dfn", {}, ...args);
    }
}

export function div<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function div<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function div<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("div", attributes, ...macro_args);
    } else {
        return h("div", {}, ...args);
    }
}

export function dl<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function dl<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function dl<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dl", attributes, ...macro_args);
    } else {
        return h("dl", {}, ...args);
    }
}

export function dt<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function dt<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function dt<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dt", attributes, ...macro_args);
    } else {
        return h("dt", {}, ...args);
    }
}

export function em<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function em<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function em<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("em", attributes, ...macro_args);
    } else {
        return h("em", {}, ...args);
    }
}

export function fieldset<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function fieldset<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function fieldset<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("fieldset", attributes, ...macro_args);
    } else {
        return h("fieldset", {}, ...args);
    }
}

export function figcaption<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function figcaption<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function figcaption<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("figcaption", attributes, ...macro_args);
    } else {
        return h("figcaption", {}, ...args);
    }
}

export function figure<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function figure<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function figure<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("figure", attributes, ...macro_args);
    } else {
        return h("figure", {}, ...args);
    }
}

export function footer<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function footer<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function footer<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("footer", attributes, ...macro_args);
    } else {
        return h("footer", {}, ...args);
    }
}

export function form<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function form<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function form<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("form", attributes, ...macro_args);
    } else {
        return h("form", {}, ...args);
    }
}

export function h1<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function h1<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function h1<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h1", attributes, ...macro_args);
    } else {
        return h("h1", {}, ...args);
    }
}

export function h2<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function h2<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function h2<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h2", attributes, ...macro_args);
    } else {
        return h("h2", {}, ...args);
    }
}

export function h3<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function h3<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function h3<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h3", attributes, ...macro_args);
    } else {
        return h("h3", {}, ...args);
    }
}

export function h4<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function h4<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function h4<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h4", attributes, ...macro_args);
    } else {
        return h("h4", {}, ...args);
    }
}

export function h5<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function h5<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function h5<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h5", attributes, ...macro_args);
    } else {
        return h("h5", {}, ...args);
    }
}

export function h6<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function h6<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function h6<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h6", attributes, ...macro_args);
    } else {
        return h("h6", {}, ...args);
    }
}

export function head<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function head<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function head<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("head", attributes, ...macro_args);
    } else {
        return h("head", {}, ...args);
    }
}

export function header<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function header<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function header<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("header", attributes, ...macro_args);
    } else {
        return h("header", {}, ...args);
    }
}

export function html<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function html<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function html<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("html", attributes, ...macro_args);
    } else {
        return h("html", {}, ...args);
    }
}

export function i<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function i<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function i<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("i", attributes, ...macro_args);
    } else {
        return h("i", {}, ...args);
    }
}

export function iframe<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function iframe<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function iframe<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("iframe", attributes, ...macro_args);
    } else {
        return h("iframe", {}, ...args);
    }
}

export function ins<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function ins<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function ins<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ins", attributes, ...macro_args);
    } else {
        return h("ins", {}, ...args);
    }
}

export function kbd<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function kbd<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function kbd<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("kbd", attributes, ...macro_args);
    } else {
        return h("kbd", {}, ...args);
    }
}

export function keygen<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function keygen<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function keygen<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("keygen", attributes, ...macro_args);
    } else {
        return h("keygen", {}, ...args);
    }
}

export function label<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function label<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function label<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("label", attributes, ...macro_args);
    } else {
        return h("label", {}, ...args);
    }
}

export function legend<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function legend<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function legend<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("legend", attributes, ...macro_args);
    } else {
        return h("legend", {}, ...args);
    }
}

export function li<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function li<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function li<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("li", attributes, ...macro_args);
    } else {
        return h("li", {}, ...args);
    }
}

export function main<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function main<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function main<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("main", attributes, ...macro_args);
    } else {
        return h("main", {}, ...args);
    }
}

export function map<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function map<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function map<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("map", attributes, ...macro_args);
    } else {
        return h("map", {}, ...args);
    }
}

export function mark<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function mark<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function mark<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("mark", attributes, ...macro_args);
    } else {
        return h("mark", {}, ...args);
    }
}

export function menu<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function menu<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function menu<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("menu", attributes, ...macro_args);
    } else {
        return h("menu", {}, ...args);
    }
}

export function meter<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function meter<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function meter<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("meter", attributes, ...macro_args);
    } else {
        return h("meter", {}, ...args);
    }
}

export function nav<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function nav<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function nav<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("nav", attributes, ...macro_args);
    } else {
        return h("nav", {}, ...args);
    }
}

export function object<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function object<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function object<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("object", attributes, ...macro_args);
    } else {
        return h("object", {}, ...args);
    }
}

export function ol<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function ol<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function ol<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ol", attributes, ...macro_args);
    } else {
        return h("ol", {}, ...args);
    }
}

export function optgroup<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function optgroup<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function optgroup<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("optgroup", attributes, ...macro_args);
    } else {
        return h("optgroup", {}, ...args);
    }
}

export function option<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function option<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function option<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("option", attributes, ...macro_args);
    } else {
        return h("option", {}, ...args);
    }
}

export function output<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function output<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function output<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("output", attributes, ...macro_args);
    } else {
        return h("output", {}, ...args);
    }
}

export function p<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function p<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function p<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("p", attributes, ...macro_args);
    } else {
        return h("p", {}, ...args);
    }
}

export function param<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function param<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function param<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("param", attributes, ...macro_args);
    } else {
        return h("param", {}, ...args);
    }
}

export function pre<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function pre<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function pre<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("pre", attributes, ...macro_args);
    } else {
        return h("pre", {}, ...args);
    }
}

export function progress<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function progress<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function progress<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("progress", attributes, ...macro_args);
    } else {
        return h("progress", {}, ...args);
    }
}

export function q<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function q<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function q<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("q", attributes, ...macro_args);
    } else {
        return h("q", {}, ...args);
    }
}

export function rp<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function rp<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function rp<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("rp", attributes, ...macro_args);
    } else {
        return h("rp", {}, ...args);
    }
}

export function rt<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function rt<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function rt<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("rt", attributes, ...macro_args);
    } else {
        return h("rt", {}, ...args);
    }
}

export function ruby<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function ruby<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function ruby<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ruby", attributes, ...macro_args);
    } else {
        return h("ruby", {}, ...args);
    }
}

export function s<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function s<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function s<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("s", attributes, ...macro_args);
    } else {
        return h("s", {}, ...args);
    }
}

export function samp<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function samp<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function samp<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("samp", attributes, ...macro_args);
    } else {
        return h("samp", {}, ...args);
    }
}

export function section<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function section<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function section<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("section", attributes, ...macro_args);
    } else {
        return h("section", {}, ...args);
    }
}

export function select<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function select<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function select<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("select", attributes, ...macro_args);
    } else {
        return h("select", {}, ...args);
    }
}

export function small<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function small<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function small<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("small", attributes, ...macro_args);
    } else {
        return h("small", {}, ...args);
    }
}

export function span<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function span<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function span<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("span", attributes, ...macro_args);
    } else {
        return h("span", {}, ...args);
    }
}

export function strong<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function strong<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function strong<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("strong", attributes, ...macro_args);
    } else {
        return h("strong", {}, ...args);
    }
}

export function sub<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function sub<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function sub<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("sub", attributes, ...macro_args);
    } else {
        return h("sub", {}, ...args);
    }
}

export function summary<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function summary<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function summary<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("summary", attributes, ...macro_args);
    } else {
        return h("summary", {}, ...args);
    }
}

export function sup<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function sup<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function sup<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("sup", attributes, ...macro_args);
    } else {
        return h("sup", {}, ...args);
    }
}

export function table<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function table<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function table<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("table", attributes, ...macro_args);
    } else {
        return h("table", {}, ...args);
    }
}

export function tbody<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function tbody<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function tbody<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("tbody", attributes, ...macro_args);
    } else {
        return h("tbody", {}, ...args);
    }
}

export function td<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function td<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function td<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("td", attributes, ...macro_args);
    } else {
        return h("td", {}, ...args);
    }
}

export function textarea<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function textarea<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function textarea<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("textarea", attributes, ...macro_args);
    } else {
        return h("textarea", {}, ...args);
    }
}

export function tfoot<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function tfoot<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function tfoot<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("tfoot", attributes, ...macro_args);
    } else {
        return h("tfoot", {}, ...args);
    }
}

export function th<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function th<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function th<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("th", attributes, ...macro_args);
    } else {
        return h("th", {}, ...args);
    }
}

export function thead<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function thead<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function thead<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("thead", attributes, ...macro_args);
    } else {
        return h("thead", {}, ...args);
    }
}

export function time<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function time<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function time<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("time", attributes, ...macro_args);
    } else {
        return h("time", {}, ...args);
    }
}

export function tr<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function tr<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function tr<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("tr", attributes, ...macro_args);
    } else {
        return h("tr", {}, ...args);
    }
}

export function u<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function u<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function u<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("u", attributes, ...macro_args);
    } else {
        return h("u", {}, ...args);
    }
}

export function ul<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function ul<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function ul<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ul", attributes, ...macro_args);
    } else {
        return h("ul", {}, ...args);
    }
}

export function var_<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function var_<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function var_<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("var", attributes, ...macro_args);
    } else {
        return h("var", {}, ...args);
    }
}

export function video<State>(attributes: Attributes, ...args: Expression<State>[]): Invocation<State>;
export function video<State>(...args: Expression<State>[]): Invocation<State>;
// deno-lint-ignore no-explicit-any
export function video<State>(...args: any[]): Invocation<State> {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("video", attributes, ...macro_args);
    } else {
        return h("video", {}, ...args);
    }
}