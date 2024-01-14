import { Context, Expression, Invocation, new_macro } from "./tsgen.ts";
import { new_name, resolve_name } from "./names.ts";
import { a, Attributes, div, h1, h2, h3, h4, h5, h6, ol, span } from "./h.ts";
import { link_name } from "./linkname.ts";
import { html5_dependency_js } from "./html5.ts";

const statekey = Symbol("HSection");

interface HSectionState {
  // heading level of the current hsection
  level: number;
  // sequence of indexes to locate the current hsection in the `structure`
  // only useful for building the SectionStructure during first invocation of each hsection macro,
  // contains garbage in further expansion attempts
  finger: number[];
  // virtual level 0 structure, containing all level 1 headings
  structure: SectionStructure;
  // hierarchy of ids leading to the current section. Unlike finger, this s always accurate
  current_breadcrumbs: string[],
}

interface SectionStructure {
  id: string;
  level: number;
  children: SectionStructure[];
  child_id_to_index: Map<string, number>;
}

function new_section_structure(id: string, level: number): SectionStructure {
  return {
    id,
    level,
    children: [],
    child_id_to_index: new Map(),
  };
}

function hsection_state(ctx: Context): HSectionState {
  const state = ctx.state.get(statekey);

  if (state) {
    return <HSectionState> state;
  } else {
    ctx.state.set(statekey, <HSectionState> {
      level: 0,
      finger: [0], // next hsection will be child 0 of level 0
      structure: new_section_structure("", 0),
      current_breadcrumbs: [],
    });
    return hsection_state(ctx);
  }
}

// Add the rendered heading to the name state of each section's id
const rendered_title_key = Symbol("RenderedTitle");

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
): Expression;

export function hsection(
  id: string,
  options: HSectionOptions,
  title: Expression,
  ...contents: Expression[]
): Expression;

export function hsection(
  id: string,
  ...other: any[]
): Expression {
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
): Expression {
  let first = true;

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
          header_macro(header_attributes, a({ href: `#${id}` }, render_title_and_register_it(id, title))),
          // header_macro(header_attributes, title),
          ...contents,
        ];
      }
    },
    undefined,
    // td
    (ctx) => {
      const state = hsection_state(ctx);

      state.level += 1;
      
      if (first) {
        let structure = state.structure;
        for (let level = 0; level + 1 < state.finger.length; level++) {
          structure = structure.children[state.finger[level]];
        }

        structure.children.push(new_section_structure(id, state.level));
        structure.child_id_to_index.set(id, structure.children.length - 1);
        
        state.finger.push(0);
      }

      state.current_breadcrumbs.push(id);
    },
    // bu
    (ctx) => {
      const state = hsection_state(ctx);

      state.level -= 1;
      
      if (first) {
        state.finger.pop();
        state.finger[state.finger.length - 1] = state.finger[state.finger.length - 1] + 1;

        first = false;
      }

      state.current_breadcrumbs.pop();
    },
    2,
  );

  return new Invocation(macro, [title, ...contents]);
}

export function render_title_and_register_it(id: string, title: Expression): Expression {
  const macro = new_macro(
    undefined,
    (expanded, ctx) => {
      resolve_name(id, "hsection", ctx)!.set(rendered_title_key, expanded);
      return expanded;
    }
  );

  return new Invocation(macro, [title]);
}

export function table_of_contents(max_depth: number): Expression {
  let first = true;

  const macro = new_macro(
    (_args, ctx) => {
      if (first) {
        first = false;
        return null;
      }

      const state = hsection_state(ctx);
      let structure = state.structure;
      for (const crumb of state.current_breadcrumbs) {
        structure = structure.children[structure.child_id_to_index.get(crumb)!];
      }

      return [
        html5_dependency_js("/named_assets/active_toc.js"),
        render_structure(structure, state.level, max_depth, true),
      ];
    },
  );

  return new Invocation(macro, []);
}

export function render_structure(structure: SectionStructure, current_level: number, max_depth: number, is_toplevel: boolean): Expression {
  const macro = new_macro(
    (_args, ctx) => {
      const rendered_title = resolve_name(structure.id, "hsection", ctx)!.get(rendered_title_key);

      if (rendered_title === undefined) {
        return null;
      } else {
        const toc_heading_attributes: Attributes = {
          class: `toc_heading toc${current_level}`
        };
        toc_heading_attributes["data-hsection"] = structure.id;

        return div(
          {class: `toc_section${is_toplevel ? " toc" : ""}`},
          span(toc_heading_attributes, link_name(structure.id, rendered_title)),
          ol(
            {class: "toc_children"},
            structure.children.map(child => render_structure(child, current_level + 1, max_depth, false)),
          ),
        );
      }
    },
  );

  return new Invocation(macro, []);
}