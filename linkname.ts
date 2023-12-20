import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";
import { basename, join, relative } from "https://deno.land/std@0.198.0/path/mod.ts";

import {
  Context,
  Expression,
  format_location,
  Invocation,
  is_expression,
  new_macro,
  style_file,
} from "./tsgen.ts";
import {
  get_output_file,
  PerNameState,
  style_name,
  try_resolve_name,
  try_resolve_name_any,
} from "./names.ts";
import { a, Attributes } from "./h.ts";

const statekey = Symbol("HSection");

interface LinkNameState {
  root: string[];
}

function link_name_state(ctx: Context): LinkNameState {
  const state = ctx.state.get(statekey);

  if (state) {
    return <LinkNameState> state;
  } else {
    ctx.state.set(statekey, {
      root: [],
    });
    return link_name_state(ctx);
  }
}

export function set_root_directory(logical_dir: string[]): Invocation {
  const macro = new_macro(
    (_args, ctx) => {
      link_name_state(ctx).root = logical_dir;
      return "";
    },
  );

  return new Invocation(macro, []);
}

export function get_root_directory(ctx: Context): string[] {
  return link_name_state(ctx).root;
}

export function link_name(
  id: string,
  attributes: Attributes,
  ...contents: Expression[]
): Invocation;
export function link_name(
  id: string,
  ...contents: Expression[]
): Invocation;

export function link_name(
  id: string,
  ...the_args: any[]
): Invocation {
  if (the_args.length > 0 && !is_expression(the_args[0])) {
    const [attributes, ...macro_args] = the_args;
    return link_name_(id, attributes, ...macro_args);
  } else {
    return link_name_(id, {}, ...the_args);
  }
}

function link_name_(
  id: string,
  attributes: Attributes,
  ...contents: Expression[]
): Invocation {
  const macro = new_macro(
    (args, ctx) => {
      const resolved = try_resolve_name_any(id, ctx);

      if (resolved === undefined) {
        if (ctx.must_make_progress) {
          ctx.warn(
            `Tried to create a link to undefined name ${style_name(id)} at ${
              style_file(format_location(ctx.stack.peek()!))
            }`,
          );
          return a(attributes, contents.length > 0 ? contents : id);
        } else {
          return null;
        }
      } else {
        const link = build_actual_link_url(id, resolved, ctx);

        const attributes_ = {
          ...attributes,
          href: link,
        };
        return a(attributes_, args);
      }
    },
    undefined,
    undefined,
    undefined,
    2,
  );

  return new Invocation(macro, contents);
}

export function build_actual_link_url(id: string, resolved: PerNameState, ctx: Context) {
  return `/${
    relative(
      link_name_state(ctx).root.join("/"),
      get_output_file(resolved).join("/"),
    )
  }#${id}`;
}

export function link_name_kind(
  id: string,
  kind: string,
  attributes: Attributes,
  ...contents: Expression[]
): Invocation;
export function link_name_kind(
  id: string,
  kind: string,
  ...contents: Expression[]
): Invocation;

export function link_name_kind(
  id: string,
  kind: string,
  ...the_args: any[]
): Invocation {
  if (the_args.length > 0 && !is_expression(the_args[0])) {
    const [attributes, ...macro_args] = the_args;
    return link_name_kind_(id, kind, attributes, ...macro_args);
  } else {
    return link_name_kind_(id, kind, {}, ...the_args);
  }
}

function link_name_kind_(
  id: string,
  kind: string,
  attributes: Attributes,
  ...contents: Expression[]
): Invocation {
  const macro = new_macro(
    (args, ctx) => {
      const resolved = try_resolve_name(id, kind, ctx);

      if (resolved === undefined) {
        if (ctx.must_make_progress) {
          ctx.warn(
            `Tried to create a link to undefined name ${style_name(id)} at ${
              style_file(format_location(ctx.stack.peek()!))
            }`,
          );
          return a(attributes, id);
        } else {
          return null;
        }
      } else {
        const link = `/${
          relative(
            link_name_state(ctx).root.join("/"),
            get_output_file(resolved).join("/"),
          )
        }#${id}`;

        const attributes_ = {
          ...attributes,
          href: link,
        };
        return a(attributes_, args);
      }
    },
    undefined,
    undefined,
    undefined,
    2,
  );

  return new Invocation(macro, contents);
}
