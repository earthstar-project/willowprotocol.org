import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";
import { join } from "https://deno.land/std@0.198.0/path/mod.ts";
import {
  Context,
  ExpandedMacro,
  Expression,
  format_location,
  Invocation,
  new_macro,
  style_file,
} from "./tsgen.ts";
import { new_name, PerNameState, resolve_name, try_resolve_name } from "./names.ts";
import { Attributes, dfn, h1, h2, h3, h4, h5, h6 } from "./h.ts";
import {
  build_actual_link_url,
  get_root_directory,
  link_name,
} from "./linkname.ts";
import { html5_dependency_js } from "./html5.ts";
import { out_file_absolute, out_state, write_file_absolute } from "./out.ts";
import { createHash } from "npm:sha256-uint8array";

const global_preview_state_key = Symbol("GlobalPreviews");

interface GlobalPreviewState {
  // paths of all output files that contain previews
  files: Set<string>;
  // all previews to create
  previews: Map<string /* id */, string /* preview text */>,
}

function global_preview_state(ctx: Context): GlobalPreviewState {
  const state = ctx.state.get(global_preview_state_key);

  if (state) {
    return <GlobalPreviewState> state;
  } else {
    ctx.state.set(
      global_preview_state_key,
      <GlobalPreviewState> {
        files: new Set(),
        previews: new Map(),
      },
    );
    return global_preview_state(ctx);
  }
}

function id_to_preview_data(id: string): string {
  return `ßä§${id}üÖö`;
}

const preview_data_regex = /(data-preview=")(ßä§)([^"]*)(üÖö)(")/g;

function replace_all_preview_data(source: string, ctx: Context): string {
  return source.replaceAll(
    preview_data_regex,
    (
      _match,
      preamble,
      _marker_prefix,
      id,
      _marker_postfix,
      postamble
    ) => {
      const name = resolve_name(id, "def", ctx)!;
      const hash = get_hash(name);
      return `${preamble}/previews/${hash}.html${postamble}`;
    }
  );
}

function tsgenReadTextFile(path: string, ctx: Context): string | undefined {
   try {
    const content = Deno.readTextFileSync(path);
    return content;
  } catch (err) {
    ctx.error(`Could not read file ${style_file(path)}`);
    ctx.error(err);
    ctx.halt();
    return undefined;
  }
}

function tsgenWriteTextFile(path: string, content: string, ctx: Context): boolean {
  try {
    Deno.writeTextFileSync(path, content);
    return true;
  } catch (err) {
    ctx.error(`Could not write file ${style_file(path)}`);
    ctx.error(err);
    ctx.halt();
    return false;
  }
}

// All macros that use defref must be descendents of an invocation of this.
// Postprocesses all preview-data to contain content-determined links,
// and processes and renames the preview files to work with these links.
export function enable_previews(...expressions: Expression[]): Invocation {const macro = new_macro(
    undefined,
    (expanded, ctx) => {
      const preview_state = global_preview_state(ctx);

      // Write all previews to the file system.
      for (const [id, preview_content] of preview_state.previews) {
        const name = resolve_name(id, "def", ctx)!;
        const hash = get_hash(name);

        const replaced_preview_content = replace_all_preview_data(preview_content, ctx);

        if (!tsgenWriteTextFile(join(...preview_path(hash, ctx)), replaced_preview_content, ctx)) {
          return "";
        }
      }      

      // In all files containing defref invocations, replace the preview-data with a hash-based preview url
      for (const path of preview_state.files) {
        const content = tsgenReadTextFile(path, ctx);
        if (!content) {
          return "";
        }

        const replaced = replace_all_preview_data(content, ctx);

        if (!tsgenWriteTextFile(path, replaced, ctx)) {
          return "";
        }
      }

      return expanded;
    },
  );

  return new Invocation(macro, expressions);
}

export function previewable_link(
  is_def: boolean,
  name: PerNameState,
  is_tex: boolean,
  surpress_preview: boolean,
  display_text: Expression,
): Expression {
  const macro = new_macro(
    (args, ctx) => {
      // get some metadata for rendering
      const the_def = get_def(name);
      const id = the_def.id;
      const clazz = the_def.clazz;
      const preview_data = id_to_preview_data(id);

      // Register the current output file as containing previewable links.
      const current_path = out_state(ctx).current_path;
      global_preview_state(ctx).files.add(join(...current_path));
      

      if (is_tex) {
        const link_url = build_actual_link_url(id, name, ctx);
        const link_tex =
          `\\href{${link_url}}{${
            <string>display_text // all calls of previewable_link with is_tex = true must set display_text to a string
          }}`;
        const data_tex = surpress_preview ? link_tex : `\\htmlData{preview=${preview_data}}{${link_tex}}`;
        const id_tex = is_def ? `\\htmlId{${id}}{${data_tex}}` : data_tex;
        const classy_tex = `\\htmlClass{normal_text${
          clazz ? ` ${clazz}` : ""
        }}{${id_tex}}`;

        const katexRegex = new RegExp(
          `(class="enclosing normal_text[^"]*)("><span class="enclosing" data-preview="ßä§${id}üÖö">)`,
        );

        return [
          html5_dependency_js("/named_assets/floating-ui.core.min.js"),
          html5_dependency_js("/named_assets/floating-ui.dom.min.js"),
          html5_dependency_js("/named_assets/tooltips.js"),
          html5_dependency_js("/named_assets/previews.js"),
          classy_tex,
        ];
      } else {
        const attributes: Attributes = {};

        if (is_def) {
          attributes.id = id;
        }

        if (!surpress_preview) {
          attributes["data-preview"] = preview_data;
        }

        if (clazz && !is_def) {
          attributes.class = `ref ${clazz}`;
        } else if (!is_def) {
          attributes.class = "ref";
        } else if (clazz) {
          attributes.class = clazz;
        }

        const the_link = link_name(
          id,
          attributes,
          args[0],
        );
        const the_final_thingy = is_def ? dfn(the_link) : the_link;

        return [
          html5_dependency_js("/named_assets/floating-ui.core.min.js"),
          html5_dependency_js("/named_assets/floating-ui.dom.min.js"),
          html5_dependency_js("/named_assets/tooltips.js"),
          html5_dependency_js("/named_assets/previews.js"),
          the_final_thingy,
        ];
      }
    },
  );

  return new Invocation(macro, [display_text]);
}

const previewkey = Symbol("Preview");

interface PreviewState {
  ids: Set<string> | null;
}

function preview_state(ctx: Context): PreviewState {
  const state = ctx.state.get(previewkey);

  if (state) {
    return <PreviewState> state;
  } else {
    ctx.state.set(previewkey, {
      ids: null,
    });
    return preview_state(ctx);
  }
}

export function add_preview_id_to_preview_scope(id: string, ctx: Context): boolean {
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

export function preview_path(basename: string, ctx: Context): string[] {
  return [...get_root_directory(ctx), "previews", `${basename}.html`];
}

export function create_preview_from_string(id: string, content: string, ctx: Context) {
  global_preview_state(ctx).previews.set(id, content);

  const name = resolve_name(id, "def", ctx)!;
  const hash = createHash().update(content).digest("hex");
  set_hash(name, hash);
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
          const regex = new RegExp(
            `(<a[^>]*id="${id}"[^>]*class=")([^"]*)("{1}[^>]*>)`,
          );

          const withDefinedHereClassAlmost = expanded.replace(
            regex,
            `$1$2 defined_here$3`,
          );

          const katexRegex = new RegExp(
            `(class="enclosing normal_text[^"]*)("><span class="enclosing" id="${id}"><span class="enclosing" data-preview="ßä§${id}üÖö">)`
          );

          const withDefinedHereClass = withDefinedHereClassAlmost.replace(
            katexRegex,
            `$1 defined_here$2`,
          );

          create_preview_from_string(id, withDefinedHereClass, ctx);
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
  math?: string;
  clazz?: string;
}

export const def_key = Symbol("Def");

export function get_def(name_state: PerNameState): Def {
  return name_state.get(def_key)!;
}

export function set_def(name_state: PerNameState, def: Def) {
  name_state.set(def_key, def);
}

// store a content-derived hash with each name
export const hash_key = Symbol("PreviewHash");

export function get_hash(name_state: PerNameState): string {
  return name_state.get(hash_key)!;
}

export function set_hash(name_state: PerNameState, hash: string) {
  name_state.set(hash_key, hash);
}

export function create_manual_preview(id: string, preview?: Expression): Expression {
  const macro = new_macro(
    undefined,
    (expanded, ctx) => {
      global_preview_state(ctx).previews.set(id, expanded);

      const name = resolve_name(id, "def", ctx)!;
      const hash = createHash().update(expanded).digest("hex");
      set_hash(name, hash);

      return "";
    }
  );

  return preview ? new Invocation(macro, [preview]) : "";
}

export function def_truly_generic(
  is_tex: boolean,
  info: string | Def,
  is_fake: boolean,
  add_to_preview_scope: boolean,
  surpress_preview: boolean,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_: Def = (typeof info === "string") ? { id: info } : info;

  const macro = new_macro(
    (args, ctx) => {
      const name = is_fake ? try_resolve_name(info_.id, "def", ctx) : new_name(info_.id, "def", ctx);
      if (!name) {
        return "";
      } else if (!is_fake) {
        name.set(def_key, info_);

        
      }

      const link = previewable_link(
        true,
        name,
        is_tex,
        surpress_preview,
        text ? args[0] : (is_tex ? get_math(info_) : get_singular(info_)),
      );

      if (add_to_preview_scope && !is_fake && !preview) {
        add_preview_id_to_preview_scope(info_.id, ctx);
      }

      return [
        create_manual_preview(info_.id, preview),
        link,
      ];
    },
    undefined,
    undefined,
    undefined,
    3,
  );

  return new Invocation(macro, [text ? text : "never used"]);
}

export function def_generic(
  info: string | Def,
  is_fake: boolean,
  text?: Expression,
  preview?: Expression,
): Expression {
  return def_truly_generic(false, info, is_fake, true, false, text, preview);
}

export function def_generic$(
  info: string | Def,
  is_fake: boolean,
  preview?: Expression,
): Expression {
  return def_truly_generic(true, info, is_fake, true, false, undefined, preview);
}

export function def(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "def" }
    : { ...info, clazz: "def" };
  return def_generic(info_, false, text, preview);
}

export function def_fake(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "def defined_here" }
    : { ...info, clazz: "def defined_here" };
  return def_generic(info_, true, text, preview);
}

/** Refer to a definition using its singular label. */
export function r(
  id: string,
  text?: Expression,
): Expression {
  return ref_invocation(get_singular, id, text);
}

/** Refer to a definition in its plural label. */
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

function ref_invocation_generic(
  is_tex: boolean,
  noun_form: (d: Def) => string,
  id: string,
  text?: Expression,
): Expression {
  const macro = new_macro(
    (args, ctx) => {
      const name = try_resolve_name(id, "def", ctx);
      if (name) {
        return [
          html5_dependency_js("/named_assets/floating-ui.core.min.js"),
          html5_dependency_js("/named_assets/floating-ui.dom.min.js"),
          html5_dependency_js("/named_assets/tooltips.js"),
          html5_dependency_js("/named_assets/previews.js"),
          previewable_link(
            false,
            name,
            is_tex,
            false,
            text ? args[0] : noun_form(get_def(name)),
          ),
        ];
      } else if (ctx.must_make_progress) {
        return "UndefinedReference";
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

function ref_invocation(
  noun_form: (d: Def) => string,
  id: string,
  text?: Expression,
): Expression {
  return ref_invocation_generic(false, noun_form, id, text);
}

export function r$(
  id: string,
): Expression {
  return ref_invocation_generic(true, get_math, id);
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

export function get_math(d: Def): string {
  if (d.math === undefined) {
    return `\\text{${get_singular(d)}}`;
  } else {
    return d.math;
  }
}

function naive_capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function style_def(s: string): string {
  return Colors.green(s);
}
