import { Context, Expression, Invocation, new_macro } from "./tsgen.ts";
import { new_name, PerNameState, try_resolve_name } from "./names.ts";
import { dfn, h1, h2, h3, h4, h5, h6 } from "./h.ts";
import { link_name } from "./linkname.ts";

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

      return dfn(
        link_name(
          info_.id,
          { id: info_.id },
          text ? args[0] : get_singular(info_),
        ),
      );
    },
  );

  return new Invocation(macro, [text ? text : "never used"]);
}

export function r(
  id: string,
  text?: Expression,
): Invocation {
    return ref_invocation(get_singular, id, text);
}

export function rs(
    id: string,
    text?: Expression,
  ): Invocation {
      return ref_invocation(get_plural, id, text);
  }

  export function R(
    id: string,
    text?: Expression,
  ): Invocation {
      return ref_invocation(get_Singular, id, text);
  }

  export function Rs(
    id: string,
    text?: Expression,
  ): Invocation {
      return ref_invocation(get_Plural, id, text);
  }

function ref_invocation(
    noun_form: (d: Def) => string,
    id: string,
    text?: Expression,
  ): Invocation {
    const macro = new_macro(
      (args, ctx) => {
        const name = try_resolve_name(id, "def", ctx);
        if (name) {
          return link_name(
            id,
            { class: "ref" },
            text ? args[0] : noun_form(get_def(name)),
          );
        } else if (ctx.must_make_progress) {
          return link_name(
            id,
            { class: "ref" },
            text ? args[0] : id,
          );
        } else {
          return null;
        }
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
