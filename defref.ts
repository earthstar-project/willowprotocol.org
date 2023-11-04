import { Context, Expression, Invocation, new_macro } from "./tsgen.ts";
import { new_name, PerNameState, try_resolve_name } from "./names.ts";
import { dfn, h1, h2, h3, h4, h5, h6 } from "./h.ts";
import { get_root_directory, link_name } from "./linkname.ts";
import { html5_dependency_js } from "./html5.ts";
import { out_file_absolute } from "./out.ts";

export interface Def {
  id: string;
  singular?: string;
  plural?: string;
  Singular?: string;
  Plural?: string;
}

const def_key = Symbol("Def");

export function get_def(name_state: PerNameState): Def {
  return name_state.get(def_key)!;
}

export function def(
  info: string | Def,
  text?: Expression,
): Invocation {
  const info_: Def = (typeof info === "string") ? { id: info } : info;

  const macro = new_macro(
    (args, ctx) => {
      const state = new_name(info_.id, "def", ctx);
      state?.set(def_key, info_);

      return [
        dfn(
          link_name(
            info_.id,
            { id: info_.id },
            text ? args[0] : get_singular(info_),
          ),
        ),
        out_file_absolute([...get_root_directory(ctx), "previews", `${info_.id}.html`], "<p>I'm a preview oooooooooooo oooooooooo ooooooooooo ooooooooooo oooooooooo ooooooooooo oooooooooo oooooooooo oooooooo</p>"),
      ];
    },
  );

  return new Invocation(macro, [text ? text : "never used"]);
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
          the_link = link_name(
            id,
            attributes,
            text ? args[0] : noun_form(get_def(name)),
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
