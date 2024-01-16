import { Expression, Macro, Invocation, new_macro, is_expression } from "./tsgen.ts";

export type Attributes = Record<PropertyKey, Expression>;

function mac(tag_name: string, attributes: Attributes): Macro {
    return new_macro(
        (args, _state) => {
            return [`<${tag_name}`, render_attributes(attributes), `>`, ...args, `</${tag_name}>`];
        },
        undefined,
        undefined,
        undefined,
        3,
    );
}

function mac_void(tag_name: string, attributes: Attributes): Macro {
    return new_macro(
        (_args, _state) => {
            return [`<${tag_name}`, render_attributes(attributes), `/>`];
        },
        undefined,
        undefined,
        undefined,
        2,
    );
}

function render_attributes(attributes: Attributes): Expression {
    const fragments: Expression[][] = [];

    for (const name in attributes) {
        const value = attributes[name];
        if (value === "") {
            fragments.push([name]);
        } else {
            fragments.push([name, "=\"", value, "\""]);
        }
    }

    return fragments.map(f => {
        f.unshift(" ");
        return f;
    });
}

export function h(tag_name: string, attributes: Attributes = {}, ...args: Expression[]): Expression {
    return new Invocation(
        mac(tag_name, attributes),
        args,
    );
}

export function area(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("area", attributes), []);
}

export function base(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("base", attributes), []);
}

export function br(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("br", attributes), []);
}

export function col(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("col", attributes), []);
}

export function embed(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("embed", attributes), []);
}

export function hr(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("hr", attributes), []);
}

export function img(src: Expression, alt: Expression, attributes: Attributes = {}): Expression {
    const macro = new_macro(
        (args, _ctx) => {
            return [
                `<img src="`, args[0], `" alt="`, args[1], `"`, render_attributes(attributes), ">",
            ];
        },
    );
    return new Invocation(macro, [src, alt]);
}

export function input(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("input", attributes), []);
}

export function link(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("link", attributes), []);
}

export function meta(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("meta", attributes), []);
}

export function source(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("source", attributes), []);
}

export function track(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("track", attributes), []);
}

export function wbr(attributes: Attributes = {}): Expression {
    return new Invocation(mac_void("wbr", attributes), []);
}

export function a(attributes: Attributes, ...args: Expression[]): Expression;
export function a(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function a(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("a", attributes, ...macro_args);
    } else {
        return h("a", {}, ...args);
    }
}

export function abbr(attributes: Attributes, ...args: Expression[]): Expression;   
export function abbr(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function abbr(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("abbr", attributes, ...macro_args);
    } else {
        return h("abbr", {}, ...args);
    }
}

export function address(attributes: Attributes, ...args: Expression[]): Expression;
export function address(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function address(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("address", attributes, ...macro_args);
    } else {
        return h("address", {}, ...args);
    }
}

export function article(attributes: Attributes, ...args: Expression[]): Expression;
export function article(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function article(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("article", attributes, ...macro_args);
    } else {
        return h("article", {}, ...args);
    }
}

export function aside(attributes: Attributes, ...args: Expression[]): Expression;
export function aside(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function aside(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("aside", attributes, ...macro_args);
    } else {
        return h("aside", {}, ...args);
    }
}

export function audio(attributes: Attributes, ...args: Expression[]): Expression;
export function audio(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function audio(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("audio", attributes, ...macro_args);
    } else {
        return h("audio", {}, ...args);
    }
}

export function b(attributes: Attributes, ...args: Expression[]): Expression;
export function b(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function b(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("b", attributes, ...macro_args);
    } else {
        return h("b", {}, ...args);
    }
}

export function bdi(attributes: Attributes, ...args: Expression[]): Expression;
export function bdi(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function bdi(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("bdi", attributes, ...macro_args);
    } else {
        return h("bdi", {}, ...args);
    }
}

export function bdo(attributes: Attributes, ...args: Expression[]): Expression;
export function bdo(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function bdo(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("bdo", attributes, ...macro_args);
    } else {
        return h("bdo", {}, ...args);
    }
}

export function blockquote(attributes: Attributes, ...args: Expression[]): Expression;
export function blockquote(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function blockquote(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("blockquote", attributes, ...macro_args);
    } else {
        return h("blockquote", {}, ...args);
    }
}

export function body_(attributes: Attributes, ...args: Expression[]): Expression;
export function body_(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function body_(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("body", attributes, ...macro_args);
    } else {
        return h("body", {}, ...args);
    }
}

export function button(attributes: Attributes, ...args: Expression[]): Expression;
export function button(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function button(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("button", attributes, ...macro_args);
    } else {
        return h("button", {}, ...args);
    }
}

export function canvas(attributes: Attributes, ...args: Expression[]): Expression;
export function canvas(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function canvas(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("canvas", attributes, ...macro_args);
    } else {
        return h("canvas", {}, ...args);
    }
}

export function caption(attributes: Attributes, ...args: Expression[]): Expression;
export function caption(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function caption(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("caption", attributes, ...macro_args);
    } else {
        return h("caption", {}, ...args);
    }
}

export function cite(attributes: Attributes, ...args: Expression[]): Expression;
export function cite(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function cite(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("cite", attributes, ...macro_args);
    } else {
        return h("cite", {}, ...args);
    }
}

export function code(attributes: Attributes, ...args: Expression[]): Expression;
export function code(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function code(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("code", attributes, ...macro_args);
    } else {
        return h("code", {}, ...args);
    }
}

export function colgroup(attributes: Attributes, ...args: Expression[]): Expression;
export function colgroup(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function colgroup(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("colgroup", attributes, ...macro_args);
    } else {
        return h("colgroup", {}, ...args);
    }
}

export function command(attributes: Attributes, ...args: Expression[]): Expression;
export function command(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function command(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("command", attributes, ...macro_args);
    } else {
        return h("command", {}, ...args);
    }
}

export function datalist(attributes: Attributes, ...args: Expression[]): Expression;
export function datalist(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function datalist(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("datalist", attributes, ...macro_args);
    } else {
        return h("datalist", {}, ...args);
    }
}

export function dd(attributes: Attributes, ...args: Expression[]): Expression;
export function dd(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function dd(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dd", attributes, ...macro_args);
    } else {
        return h("dd", {}, ...args);
    }
}

export function del(attributes: Attributes, ...args: Expression[]): Expression;
export function del(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function del(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("del", attributes, ...macro_args);
    } else {
        return h("del", {}, ...args);
    }
}

export function details(attributes: Attributes, ...args: Expression[]): Expression;
export function details(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function details(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("details", attributes, ...macro_args);
    } else {
        return h("details", {}, ...args);
    }
}

export function dfn(attributes: Attributes, ...args: Expression[]): Expression;
export function dfn(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function dfn(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dfn", attributes, ...macro_args);
    } else {
        return h("dfn", {}, ...args);
    }
}

export function div(attributes: Attributes, ...args: Expression[]): Expression;
export function div(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function div(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("div", attributes, ...macro_args);
    } else {
        return h("div", {}, ...args);
    }
}

export function dl(attributes: Attributes, ...args: Expression[]): Expression;
export function dl(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function dl(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dl", attributes, ...macro_args);
    } else {
        return h("dl", {}, ...args);
    }
}

export function dt(attributes: Attributes, ...args: Expression[]): Expression;
export function dt(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function dt(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("dt", attributes, ...macro_args);
    } else {
        return h("dt", {}, ...args);
    }
}

export function em(attributes: Attributes, ...args: Expression[]): Expression;
export function em(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function em(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("em", attributes, ...macro_args);
    } else {
        return h("em", {}, ...args);
    }
}

export function fieldset(attributes: Attributes, ...args: Expression[]): Expression;
export function fieldset(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function fieldset(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("fieldset", attributes, ...macro_args);
    } else {
        return h("fieldset", {}, ...args);
    }
}

export function figcaption(attributes: Attributes, ...args: Expression[]): Expression;
export function figcaption(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function figcaption(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("figcaption", attributes, ...macro_args);
    } else {
        return h("figcaption", {}, ...args);
    }
}

export function figure(attributes: Attributes, ...args: Expression[]): Expression;
export function figure(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function figure(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("figure", attributes, ...macro_args);
    } else {
        return h("figure", {}, ...args);
    }
}

export function footer(attributes: Attributes, ...args: Expression[]): Expression;
export function footer(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function footer(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("footer", attributes, ...macro_args);
    } else {
        return h("footer", {}, ...args);
    }
}

export function form(attributes: Attributes, ...args: Expression[]): Expression;
export function form(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function form(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("form", attributes, ...macro_args);
    } else {
        return h("form", {}, ...args);
    }
}

export function h1(attributes: Attributes, ...args: Expression[]): Expression;
export function h1(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function h1(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h1", attributes, ...macro_args);
    } else {
        return h("h1", {}, ...args);
    }
}

export function h2(attributes: Attributes, ...args: Expression[]): Expression;
export function h2(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function h2(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h2", attributes, ...macro_args);
    } else {
        return h("h2", {}, ...args);
    }
}

export function h3(attributes: Attributes, ...args: Expression[]): Expression;
export function h3(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function h3(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h3", attributes, ...macro_args);
    } else {
        return h("h3", {}, ...args);
    }
}

export function h4(attributes: Attributes, ...args: Expression[]): Expression;
export function h4(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function h4(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h4", attributes, ...macro_args);
    } else {
        return h("h4", {}, ...args);
    }
}

export function h5(attributes: Attributes, ...args: Expression[]): Expression;
export function h5(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function h5(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h5", attributes, ...macro_args);
    } else {
        return h("h5", {}, ...args);
    }
}

export function h6(attributes: Attributes, ...args: Expression[]): Expression;
export function h6(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function h6(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("h6", attributes, ...macro_args);
    } else {
        return h("h6", {}, ...args);
    }
}

export function head(attributes: Attributes, ...args: Expression[]): Expression;
export function head(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function head(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("head", attributes, ...macro_args);
    } else {
        return h("head", {}, ...args);
    }
}

export function header(attributes: Attributes, ...args: Expression[]): Expression;
export function header(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function header(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("header", attributes, ...macro_args);
    } else {
        return h("header", {}, ...args);
    }
}

export function html(attributes: Attributes, ...args: Expression[]): Expression;
export function html(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function html(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("html", attributes, ...macro_args);
    } else {
        return h("html", {}, ...args);
    }
}

export function i(attributes: Attributes, ...args: Expression[]): Expression;
export function i(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function i(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("i", attributes, ...macro_args);
    } else {
        return h("i", {}, ...args);
    }
}

export function iframe(attributes: Attributes, ...args: Expression[]): Expression;
export function iframe(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function iframe(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("iframe", attributes, ...macro_args);
    } else {
        return h("iframe", {}, ...args);
    }
}

export function ins(attributes: Attributes, ...args: Expression[]): Expression;
export function ins(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function ins(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ins", attributes, ...macro_args);
    } else {
        return h("ins", {}, ...args);
    }
}

export function kbd(attributes: Attributes, ...args: Expression[]): Expression;
export function kbd(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function kbd(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("kbd", attributes, ...macro_args);
    } else {
        return h("kbd", {}, ...args);
    }
}

export function keygen(attributes: Attributes, ...args: Expression[]): Expression;
export function keygen(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function keygen(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("keygen", attributes, ...macro_args);
    } else {
        return h("keygen", {}, ...args);
    }
}

export function label(attributes: Attributes, ...args: Expression[]): Expression;
export function label(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function label(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("label", attributes, ...macro_args);
    } else {
        return h("label", {}, ...args);
    }
}

export function legend(attributes: Attributes, ...args: Expression[]): Expression;
export function legend(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function legend(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("legend", attributes, ...macro_args);
    } else {
        return h("legend", {}, ...args);
    }
}

export function li(attributes: Attributes, ...args: Expression[]): Expression;
export function li(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function li(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("li", attributes, ...macro_args);
    } else {
        return h("li", {}, ...args);
    }
}

export function main(attributes: Attributes, ...args: Expression[]): Expression;
export function main(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function main(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("main", attributes, ...macro_args);
    } else {
        return h("main", {}, ...args);
    }
}

export function map(attributes: Attributes, ...args: Expression[]): Expression;
export function map(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function map(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("map", attributes, ...macro_args);
    } else {
        return h("map", {}, ...args);
    }
}

export function mark(attributes: Attributes, ...args: Expression[]): Expression;
export function mark(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function mark(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("mark", attributes, ...macro_args);
    } else {
        return h("mark", {}, ...args);
    }
}

export function menu(attributes: Attributes, ...args: Expression[]): Expression;
export function menu(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function menu(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("menu", attributes, ...macro_args);
    } else {
        return h("menu", {}, ...args);
    }
}

export function meter(attributes: Attributes, ...args: Expression[]): Expression;
export function meter(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function meter(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("meter", attributes, ...macro_args);
    } else {
        return h("meter", {}, ...args);
    }
}

export function nav(attributes: Attributes, ...args: Expression[]): Expression;
export function nav(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function nav(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("nav", attributes, ...macro_args);
    } else {
        return h("nav", {}, ...args);
    }
}

export function object(attributes: Attributes, ...args: Expression[]): Expression;
export function object(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function object(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("object", attributes, ...macro_args);
    } else {
        return h("object", {}, ...args);
    }
}

export function ol(attributes: Attributes, ...args: Expression[]): Expression;
export function ol(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function ol(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ol", attributes, ...macro_args);
    } else {
        return h("ol", {}, ...args);
    }
}

export function optgroup(attributes: Attributes, ...args: Expression[]): Expression;
export function optgroup(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function optgroup(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("optgroup", attributes, ...macro_args);
    } else {
        return h("optgroup", {}, ...args);
    }
}

export function option(attributes: Attributes, ...args: Expression[]): Expression;
export function option(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function option(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("option", attributes, ...macro_args);
    } else {
        return h("option", {}, ...args);
    }
}

export function output(attributes: Attributes, ...args: Expression[]): Expression;
export function output(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function output(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("output", attributes, ...macro_args);
    } else {
        return h("output", {}, ...args);
    }
}

export function p(attributes: Attributes, ...args: Expression[]): Expression;
export function p(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function p(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("p", attributes, ...macro_args);
    } else {
        return h("p", {}, ...args);
    }
}

export function param(attributes: Attributes, ...args: Expression[]): Expression;
export function param(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function param(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("param", attributes, ...macro_args);
    } else {
        return h("param", {}, ...args);
    }
}

export function pre(attributes: Attributes, ...args: Expression[]): Expression;
export function pre(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function pre(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("pre", attributes, ...macro_args);
    } else {
        return h("pre", {}, ...args);
    }
}

export function progress(attributes: Attributes, ...args: Expression[]): Expression;
export function progress(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function progress(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("progress", attributes, ...macro_args);
    } else {
        return h("progress", {}, ...args);
    }
}

export function q(attributes: Attributes, ...args: Expression[]): Expression;
export function q(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function q(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("q", attributes, ...macro_args);
    } else {
        return h("q", {}, ...args);
    }
}

export function rp(attributes: Attributes, ...args: Expression[]): Expression;
export function rp(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function rp(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("rp", attributes, ...macro_args);
    } else {
        return h("rp", {}, ...args);
    }
}

export function rt(attributes: Attributes, ...args: Expression[]): Expression;
export function rt(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function rt(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("rt", attributes, ...macro_args);
    } else {
        return h("rt", {}, ...args);
    }
}

export function ruby(attributes: Attributes, ...args: Expression[]): Expression;
export function ruby(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function ruby(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ruby", attributes, ...macro_args);
    } else {
        return h("ruby", {}, ...args);
    }
}

export function s(attributes: Attributes, ...args: Expression[]): Expression;
export function s(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function s(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("s", attributes, ...macro_args);
    } else {
        return h("s", {}, ...args);
    }
}

export function samp(attributes: Attributes, ...args: Expression[]): Expression;
export function samp(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function samp(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("samp", attributes, ...macro_args);
    } else {
        return h("samp", {}, ...args);
    }
}

export function section(attributes: Attributes, ...args: Expression[]): Expression;
export function section(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function section(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("section", attributes, ...macro_args);
    } else {
        return h("section", {}, ...args);
    }
}

export function select(attributes: Attributes, ...args: Expression[]): Expression;
export function select(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function select(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("select", attributes, ...macro_args);
    } else {
        return h("select", {}, ...args);
    }
}

export function small(attributes: Attributes, ...args: Expression[]): Expression;
export function small(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function small(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("small", attributes, ...macro_args);
    } else {
        return h("small", {}, ...args);
    }
}

export function span(attributes: Attributes, ...args: Expression[]): Expression;
export function span(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function span(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("span", attributes, ...macro_args);
    } else {
        return h("span", {}, ...args);
    }
}

export function strong(attributes: Attributes, ...args: Expression[]): Expression;
export function strong(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function strong(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("strong", attributes, ...macro_args);
    } else {
        return h("strong", {}, ...args);
    }
}

export function sub(attributes: Attributes, ...args: Expression[]): Expression;
export function sub(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function sub(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("sub", attributes, ...macro_args);
    } else {
        return h("sub", {}, ...args);
    }
}

export function summary(attributes: Attributes, ...args: Expression[]): Expression;
export function summary(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function summary(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("summary", attributes, ...macro_args);
    } else {
        return h("summary", {}, ...args);
    }
}

export function sup(attributes: Attributes, ...args: Expression[]): Expression;
export function sup(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function sup(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("sup", attributes, ...macro_args);
    } else {
        return h("sup", {}, ...args);
    }
}

export function table(attributes: Attributes, ...args: Expression[]): Expression;
export function table(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function table(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("table", attributes, ...macro_args);
    } else {
        return h("table", {}, ...args);
    }
}

export function tbody(attributes: Attributes, ...args: Expression[]): Expression;
export function tbody(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function tbody(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("tbody", attributes, ...macro_args);
    } else {
        return h("tbody", {}, ...args);
    }
}

export function td(attributes: Attributes, ...args: Expression[]): Expression;
export function td(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function td(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("td", attributes, ...macro_args);
    } else {
        return h("td", {}, ...args);
    }
}

export function textarea(attributes: Attributes, ...args: Expression[]): Expression;
export function textarea(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function textarea(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("textarea", attributes, ...macro_args);
    } else {
        return h("textarea", {}, ...args);
    }
}

export function tfoot(attributes: Attributes, ...args: Expression[]): Expression;
export function tfoot(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function tfoot(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("tfoot", attributes, ...macro_args);
    } else {
        return h("tfoot", {}, ...args);
    }
}

export function th(attributes: Attributes, ...args: Expression[]): Expression;
export function th(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function th(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("th", attributes, ...macro_args);
    } else {
        return h("th", {}, ...args);
    }
}

export function thead(attributes: Attributes, ...args: Expression[]): Expression;
export function thead(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function thead(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("thead", attributes, ...macro_args);
    } else {
        return h("thead", {}, ...args);
    }
}

export function time(attributes: Attributes, ...args: Expression[]): Expression;
export function time(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function time(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("time", attributes, ...macro_args);
    } else {
        return h("time", {}, ...args);
    }
}

export function title(attributes: Attributes, ...args: Expression[]): Expression;
export function title(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function title(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("title", attributes, ...macro_args);
    } else {
        return h("title", {}, ...args);
    }
}

export function tr(attributes: Attributes, ...args: Expression[]): Expression;
export function tr(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function tr(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("tr", attributes, ...macro_args);
    } else {
        return h("tr", {}, ...args);
    }
}

export function u(attributes: Attributes, ...args: Expression[]): Expression;
export function u(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function u(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("u", attributes, ...macro_args);
    } else {
        return h("u", {}, ...args);
    }
}

export function ul(attributes: Attributes, ...args: Expression[]): Expression;
export function ul(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function ul(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("ul", attributes, ...macro_args);
    } else {
        return h("ul", {}, ...args);
    }
}

export function var_(attributes: Attributes, ...args: Expression[]): Expression;
export function var_(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function var_(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("var", attributes, ...macro_args);
    } else {
        return h("var", {}, ...args);
    }
}

export function video(attributes: Attributes, ...args: Expression[]): Expression;
export function video(...args: Expression[]): Expression;
// deno-lint-ignore no-explicit-any
export function video(...args: any[]): Expression {
    if (args.length > 0 && !is_expression(args[0])) {
        const [attributes, ...macro_args] = args;
        return h("video", attributes, ...macro_args);
    } else {
        return h("video", {}, ...args);
    }
}