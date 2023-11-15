import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";
import {
  Context,
  ExpandedMacro,
  Expression,
  format_location,
  Invocation,
  new_macro,
} from "./tsgen.ts";
import { new_name, PerNameState, try_resolve_name } from "./names.ts";
import { Attributes, dfn, h1, h2, h3, h4, h5, h6 } from "./h.ts";
import { get_root_directory, link_name } from "./linkname.ts";
import { html5_dependency_js } from "./html5.ts";
import { out_file_absolute, write_file_absolute } from "./out.ts";

const previewkey = Symbol("Preview");

interface PreviewState {
  ids: Set<string> | null;
  currently_defining: boolean;
}

function preview_state(ctx: Context): PreviewState {
  const state = ctx.state.get(previewkey);

  if (state) {
    return <PreviewState> state;
  } else {
    ctx.state.set(previewkey, {
      ids: null,
      currently_defining: false,
    });
    return preview_state(ctx);
  }
}

export function add_preview_id(id: string, ctx: Context): boolean {
  const ids = preview_state(ctx).ids;

  if (ids) {
    ids.add(id);
    return true;
  } else {
    ctx.warn(
      `Did not create a preview for id ${style_def(id)} at ${
        format_location(ctx.stack.peek()!)
      }`,
    );
    ctx.warn(`    There was no containing preview scope.`);
    return false;
  }
}

export function preview_scope(...expressions: Expression[]): Invocation {
  let previous_scope: Set<string> | null = null;
  const my_scope = new Set<string>();

  const macro = new_macro(
    undefined,
    (expanded, ctx) => {
      const ids = preview_state(ctx).ids;

      if (ids != null) {
        for (const id of ids) {
          const regex = new RegExp(`\<(.*id=\"${id}\".*class=")(.*)(".*)>`);

          write_file_absolute(
            [...get_root_directory(ctx), "previews", `${id}.html`],
            expanded.replace(regex, `id="${id}" class="defined-here"`),
            ctx,
          );
        }
      }

      return expanded;
    },
    (ctx) => {
      const state = preview_state(ctx);
      previous_scope = state.ids;
      state.ids = my_scope;
    },
    (ctx) => {
      preview_state(ctx).ids = previous_scope;
    },
  );

  return new Invocation(macro, expressions);
}

export interface Def {
  id: string;
  singular?: string;
  plural?: string;
  Singular?: string;
  Plural?: string;
  clazz?: string;
}

const def_key = Symbol("Def");

export function get_def(name_state: PerNameState): Def {
  return name_state.get(def_key)!;
}

export function set_def(name_state: PerNameState, def: Def) {
  name_state.set(def_key, def);
}

export function def_generic(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_: Def = (typeof info === "string") ? { id: info } : info;

  const macro = new_macro(
    (args, ctx) => {
      if (!preview_state(ctx).currently_defining) {
        const state = new_name(info_.id, "def", ctx);
        if (state === null) {
          return "";
        } else {
          state?.set(def_key, info_);
        }
      }

      const attributes: Attributes = {
        id: info_.id,
        "data-preview": `/previews/${info_.id}.html`,
      };
      if (info_.clazz) {
        attributes.class = info_.clazz;
      }

      let manual_preview: Expression = "";
      if (!preview_state(ctx).currently_defining) {
        if (preview) {
          manual_preview = out_file_absolute([
            ...get_root_directory(ctx),
            "previews",
            `${info_.id}.html`,
          ], preview);
        } else {
          add_preview_id(info_.id, ctx);
        }
      }

      return [
        manual_preview,
        dfn(
          link_name(
            info_.id,
            attributes,
            text ? args[0] : get_singular(info_),
          ),
        ),
      ];
    },
    undefined,
    (ctx) => preview_state(ctx).currently_defining = true,
    (ctx) => preview_state(ctx).currently_defining = false,
  );

  return new Invocation(macro, [text ? text : "never used"]);
}

export function def(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "def" }
    : { ...info, clazz: "def" };
  return def_generic(info_, text, preview);
}

export function r(
  id: string,
  text?: Expression,
): Expression {
  return ref_invocation(get_singular, id, text);
}

export function rs(
  id: string,
  text?: Expression,
): Expression {
  return ref_invocation(get_plural, id, text);
}

export function R(
  id: string,
  text?: Expression,
): Expression {
  return ref_invocation(get_Singular, id, text);
}

export function Rs(
  id: string,
  text?: Expression,
): Expression {
  return ref_invocation(get_Plural, id, text);
}

function ref_invocation(
  noun_form: (d: Def) => string,
  id: string,
  text?: Expression,
): Expression {
  const macro = new_macro(
    (args, ctx) => {
      const name = try_resolve_name(id, "def", ctx);
      let the_link: Expression = "";
      const attributes = {
        class: "ref",
        "data-preview": `/previews/${id}.html`,
      };
      if (name) {
        const the_def = get_def(name);
        if (the_def.clazz) {
          attributes.class = `${attributes.class} ${the_def.clazz}`;
        }
        the_link = link_name(
          id,
          attributes,
          text ? args[0] : noun_form(the_def),
        );
      } else if (ctx.must_make_progress) {
        the_link = link_name(
          id,
          attributes,
          text ? args[0] : id,
        );
      } else {
        return null;
      }

      return [
        html5_dependency_js("/assets/floating-ui.core.min.js"),
        html5_dependency_js("/assets/floating-ui.dom.min.js"),
        html5_dependency_js("/assets/tooltips.js"),
        html5_dependency_js("/assets/previews.js"),
        the_link,
      ];
    },
    undefined,
    undefined,
    undefined,
    2,
  );

  return new Invocation(macro, [text ? text : "never used"]);
}

export function get_singular(d: Def): string {
  if (d.singular === undefined) {
    return d.id;
  } else {
    return d.singular;
  }
}

export function get_plural(d: Def): string {
  if (d.plural === undefined) {
    return `${get_singular(d)}s`;
  } else {
    return d.plural;
  }
}

export function get_Singular(d: Def): string {
  if (d.Singular === undefined) {
    return naive_capitalize(get_singular(d));
  } else {
    return d.Singular;
  }
}

export function get_Plural(d: Def): string {
  if (d.Plural === undefined) {
    return naive_capitalize(get_plural(d));
  } else {
    return d.Plural;
  }
}

function naive_capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function style_def(s: string): string {
  return Colors.green(s);
}
