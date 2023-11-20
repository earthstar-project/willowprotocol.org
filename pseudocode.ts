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
import {
  Attributes,
  code,
  dfn,
  div,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
} from "./h.ts";
import { get_root_directory, link_name } from "./linkname.ts";
import { html5_dependency_css, html5_dependency_js } from "./html5.ts";
import { asset, out_file_absolute, write_file_absolute } from "./out.ts";
import { set_def } from "./defref.ts";

const pseudocodekey = Symbol("Pseudocode");

interface PseudocodeState {
  indentation: number;
  fields: Map<string, /*id*/ string /*rendered field*/>;
  variants: Map<string, /*id*/ string /*rendered variant*/>;
}

function pseudocode_state(ctx: Context): PseudocodeState {
  const state = ctx.state.get(pseudocodekey);

  if (state) {
    return <PseudocodeState> state;
  } else {
    ctx.state.set(
      pseudocodekey,
      <PseudocodeState> {
        indentation: 0,
      },
    );
    return pseudocode_state(ctx);
  }
}

export interface Field {
  id: string;
  comment?: Expression;
  name?: string;
  rhs: Expression;
}

export interface Struct_ {
  id: string;
  comment?: Expression;
  name?: string;
  fields: Field[];
}

export class Struct {
  id: string;
  comment?: Expression;
  name?: string;
  fields: Field[];

  constructor(struct: Struct_) {
    this.id = struct.id;
    this.comment = struct.comment;
    this.name = struct.name;
    this.fields = struct.fields;
  }
}

export interface SimpleEnumVariant {
  id: string;
  comment?: Expression;
  name?: string;
}

export interface SimpleEnum_ {
  id: string;
  comment?: Expression;
  name?: string;
  variants: SimpleEnumVariant[];
}

export class SimpleEnum {
  id: string;
  comment?: Expression;
  name?: string;
  variants: SimpleEnumVariant[];

  constructor(enum_: SimpleEnum_) {
    this.id = enum_.id;
    this.comment = enum_.comment;
    this.name = enum_.name;
    this.variants = enum_.variants;
  }
}

function item_spacing(): Expression {
  return div({class: "item_spacing"});
}

function render_line(...exps: Expression[]): Expression {
  const macro = new_macro(
    (args, ctx) => {
      return div(
        { class: "loc" },
        div({
          style: `margin-left: ${2 * pseudocode_state(ctx).indentation}rem;`,
        }, ...args),
      );
    },
  );

  return new Invocation(macro, exps);
}

function indent(...exps: Expression[]): Expression {
  const macro = new_macro(
    undefined,
    undefined,
    (ctx) => pseudocode_state(ctx).indentation += 1,
    (ctx) => pseudocode_state(ctx).indentation -= 1,
  );

  return new Invocation(macro, exps);
}

function hl_punctuation(...exps: Expression[]): Expression {
  return span({ class: "hl_punct" }, ...exps);
}

function hl_kw(...exps: Expression[]): Expression {
  return span({ class: "hl_kw" }, ...exps);
}

export function hl_builtin(...exps: Expression[]): Expression {
  return span({ class: "hl_bi" }, ...exps);
}

function render_doc_comment(...exps: Expression[]): Expression {
  return render_line(div({ class: "hl_doccom" }, ...exps));
}

function render_field(field: Field): Expression {
  const field_name = field.name ? field.name : field.id;

  const macro = new_macro(
    (_args, ctx) => {
      const state = new_name(field.id, "def", ctx);
      if (state === null) {
        return "";
      } else {
        set_def(state, { id: field.id, clazz: "member", singular: field_name });
      }

      let comment: Expression = "";
      if (field.comment) {
        comment = render_doc_comment(field.comment);
      }

      const attributes: Attributes = {
        id: field.id,
      };
      attributes.class = "member";

      const member_name = dfn(
        link_name(
          field.id,
          attributes,
          field_name,
        ),
      );

      const field_line = render_line(
        member_name,
        hl_punctuation(":"),
        " ",
        field.rhs,
      );

      return [
        comment,
        field_line,
      ];
    },
    (expanded, ctx) => {
      pseudocode_state(ctx).fields.set(field.id, expanded);
      return expanded;
    },
  );

  return new Invocation(macro, []);
}

function render_struct(struct: Struct): Expression {
  const struct_name = struct.name ? struct.name : struct.id;

  let previous_fields: Map<string, string> | null = null;
  const my_fields = new Map<string, string>();

  const macro = new_macro(
    (_args, ctx) => {
      pseudocode_state(ctx).fields = my_fields;

      const state = new_name(struct.id, "def", ctx);
      if (state === null) {
        return "";
      } else {
        set_def(state, { id: struct.id, clazz: "type", singular: struct_name });
      }

      const attributes: Attributes = {
        id: struct.id,
        "data-preview": `/previews/${struct.id}.html`,
        class: "type",
      };

      const type_name = dfn(
        link_name(
          struct.id,
          attributes,
          struct_name,
        ),
      );

      let comment: Expression = "";
      if (struct.comment) {
        comment = render_doc_comment(struct.comment);
      }

      return [
        comment,
        render_line(
          hl_kw(span({ id: struct.id }, "struct")),
          " ",
          type_name,
        ),
        indent(
          struct.fields.map(render_field),
        ),
      ];
    },
    (expanded, ctx) => {
      write_file_absolute(
        [...get_root_directory(ctx), "previews", `${struct.id}.html`],
        `<code class="pseudocode">${expanded}</code>`,
        ctx,
      );

      for (const [field_id, rendered_field] of pseudocode_state(ctx).fields) {
        write_file_absolute(
          [...get_root_directory(ctx), "previews", `${field_id}.html`],
          `<code class="pseudocode">${rendered_field}</code><div>Field of <a class="ref type" data-preview="/previews/${struct.id}.html" href="/specs/sync/index.html#${struct.id}">${struct_name}</a></div>`,
          ctx,
        );
      }

      return expanded;
    },
    (ctx) => {
      const state = pseudocode_state(ctx);
      previous_fields = state.fields;
      state.fields = my_fields;
    },
    (ctx) => {
      pseudocode_state(ctx).fields = <Map<string, string>>previous_fields;
    },
  );

  return new Invocation(macro, []);
}

function render_simple_enum_variant(variant: SimpleEnumVariant): Expression {
  const variant_name = variant.name ? variant.name : variant.id;

  const macro = new_macro(
    (_args, ctx) => {
      const state = new_name(variant.id, "def", ctx);
      if (state === null) {
        return "";
      } else {
        set_def(state, { id: variant.id, clazz: "variant", singular: variant_name });
      }

      let comment: Expression = "";
      if (variant.comment) {
        comment = render_doc_comment(variant.comment);
      }

      const attributes: Attributes = {
        id: variant.id,
      };
      attributes.class = "variant";

      const member_name = dfn(
        link_name(
          variant.id,
          attributes,
          variant_name,
        ),
      );

      return [
        comment,
        render_line(member_name),
      ];
    },
    (expanded, ctx) => {
      pseudocode_state(ctx).variants.set(variant.id, expanded);
      return expanded;
    },
  );

  return new Invocation(macro, []);
}

function render_simple_enum(simple_enum: SimpleEnum): Expression {
  const enum_name = simple_enum.name ? simple_enum.name : simple_enum.id;

  let previous_variants: Map<string, string> | null = null;
  const my_variants = new Map<string, string>();

  const macro = new_macro(
    (_args, ctx) => {
      const state = new_name(simple_enum.id, "def", ctx);
      if (state === null) {
        return "";
      } else {
        set_def(state, { id: simple_enum.id, clazz: "type", singular: enum_name });
      }

      const attributes: Attributes = {
        id: simple_enum.id,
        "data-preview": `/previews/${simple_enum.id}.html`,
        class: "type",
      };

      const type_name = dfn(
        link_name(
          simple_enum.id,
          attributes,
          enum_name,
        ),
      );

      let comment: Expression = "";
      if (simple_enum.comment) {
        comment = render_doc_comment(simple_enum.comment);
      }

      return [
        comment,
        render_line(
          hl_kw(span({ id: simple_enum.id }, "enum")),
          " ",
          type_name,
        ),
        indent(
          simple_enum.variants.map(render_simple_enum_variant),
        ),
      ];
    },
    (expanded, ctx) => {
      write_file_absolute(
        [...get_root_directory(ctx), "previews", `${simple_enum.id}.html`],
        `<code class="pseudocode">${expanded}</code>`,
        ctx,
      );

      for (const [variant_id, rendered_variant] of pseudocode_state(ctx).variants) {
        write_file_absolute(
          [...get_root_directory(ctx), "previews", `${variant_id}.html`],
          `<code class="pseudocode">${rendered_variant}</code><div>Enum variant of <a class="ref type" data-preview="/previews/${simple_enum.id}.html" href="/specs/sync/index.html#${simple_enum.id}">${enum_name}</a></div>`,
          ctx,
        );
      }

      return expanded;
    },
    (ctx) => {
      const state = pseudocode_state(ctx);
      previous_variants = state.variants;
      state.variants = my_variants;
    },
    (ctx) => {
      pseudocode_state(ctx).variants = <Map<string, string>>previous_variants;
    },
  );

  return new Invocation(macro, []);
}

export type Toplevel = Struct | SimpleEnum;

function render_toplevel(tl: Toplevel): Expression {
  let item: Expression = "";

  if (tl instanceof Struct) {
    item = render_struct(tl);
  } else {
    item = render_simple_enum(tl);
  }

  return [item_spacing(), item];
}

export function pseudocode(...toplevels: Toplevel[]): Expression {
  const macro = new_macro(
    (_args, _ctx) => {
      return [
        html5_dependency_css("/named_assets/code.css"),
        code({ class: "pseudocode" }, ...toplevels.map(render_toplevel)),
      ];
    },
  );

  return new Invocation(macro, []);
}
