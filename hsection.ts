import { Context, Expression, Invocation, new_macro } from "./tsgen.ts";
import { new_name } from "./names.ts";
import { a, Attributes, h1, h2, h3, h4, h5, h6 } from "./h.ts";

const statekey = Symbol("HSection");

interface HSectionState {
  level: number;
}

function hsection_state(ctx: Context): HSectionState {
  const state = ctx.state.get(statekey);

  if (state) {
    return <HSectionState> state;
  } else {
    ctx.state.set(statekey, {
      level: 0,
    });
    return hsection_state(ctx);
  }
}

export interface HSectionOptions {
  wide: boolean;
}

const default_options = {
  wide: false,
};

export function hsection(
  id: string,
  title: Expression,
  ...contents: Expression[]
): Invocation;

export function hsection(
  id: string,
  options: HSectionOptions,
  title: Expression,
  ...contents: Expression[]
): Invocation;

export function hsection(
  id: string,
  ...other: any[]
): Invocation {
  if (other.length === 0) {
    return hsection(id, default_options, []);
  } else if (other.length === 1 && other[0].wide !== undefined) {
    return hsection_(id, other[0], [], []);
  } else if (other.length === 1 && other[0].wide === undefined) {
    return hsection_(id, default_options, [], []);
  } else if (other[0].wide === undefined) {
    const [title, ...contents] = other;
    return hsection_(id, default_options, title, ...contents);
  } else if (other.length === 2) {
    return hsection_(id, other[0], other[1]);
  } else {
    const [title, ...contents] = other.slice(1);
    return hsection_(id, other[0], title, ...contents);
  }
}

export function hsection_(
  id: string,
  options: HSectionOptions,
  title: Expression,
  ...contents: Expression[]
): Invocation {
  const macro = new_macro(
    (args, ctx) => {
      new_name(id, "hsection", ctx);
      const level = hsection_state(ctx).level + 1;

      if (level >= 7) {
        ctx.error(`Cannot nest hsections ${level} times.`);
        ctx.halt();
        return null;
      } else {
        let header_macro;
        switch (level) {
          case 1:
            header_macro = h1;
            break;
          case 2:
            header_macro = h2;
            break;
          case 3:
            header_macro = h3;
            break;
          case 4:
            header_macro = h4;
            break;
          case 5:
            header_macro = h5;
            break;
          default:
            header_macro = h6;
            break;
        }
        const [title, ...contents] = args;
        const header_attributes: Attributes = { id };
        if (options.wide) {
          header_attributes.class = "wide";
        }
        return [
          header_macro(header_attributes, a({ href: `#${id}` }, title)),
          // header_macro(header_attributes, title),
          ...contents,
        ];
      }
    },
    undefined,
    // td
    (ctx) => {
      hsection_state(ctx).level += 1;
    },
    // bu
    (ctx) => {
      hsection_state(ctx).level -= 1;
    },
    2,
  );

  return new Invocation(macro, [title, ...contents]);
}
