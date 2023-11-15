import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";
import { basename, join } from "https://deno.land/std@0.198.0/path/mod.ts";
import { copySync } from "https://deno.land/std@0.204.0/fs/copy.ts";

import {
  Context,
  Expression,
  format_location,
  Invocation,
  new_macro,
  State,
  style_file,
} from "./tsgen.ts";
import { Stack } from "./stack.ts";
import { Location } from "./get_current_line.ts";

export type PerFileState = State;

const statekey = Symbol("Out");

const location_key = Symbol("CreationLocation");

interface OutState {
  out_files: OutFile; // a tree of path fragments and the associated file state
  current_path: string[]; // stack of path fragments that make up the current path
}

function out_state(ctx: Context): OutState {
  const state = ctx.state.get(statekey);

  if (state) {
    return <OutState> state;
  } else {
    ctx.state.set(statekey, {
      out_files: {
        state: {},
        children: new Map(),
      },
      current_path: [],
    });
    return out_state(ctx);
  }
}

export type OutFile = {
  state: PerFileState;
  children: Map<string, OutFile /*directory*/> | null /*leaf*/;
};

export function out_directory(
  path_fragment: string,
  ...args: Expression[]
): Invocation {
  let first_td = true;

  const macro = new_macro(
    undefined,
    (_, _ctx) => "",
    // td
    (ctx) => {
      if (first_td) {
        first_td = false;

        const current = resolve_path(
          out_state(ctx).out_files,
          out_state(ctx).current_path,
          0,
          ctx,
        );
        if (current === null) {
          return;
        }

        if (current.children === null) {
          ctx.error(
            `Cannot create output directory ${
              style_output_file(path_fragment)
            } at ${style_output_file(out_state(ctx).current_path.join("/"))}`,
          );
          ctx.error(
            `    ${
              style_output_file(out_state(ctx).current_path.join("/"))
            } is no output directory.`,
          );
          ctx.halt();
        } else if (current.children.has(path_fragment)) {
          ctx.error(
            `Cannot create output directory ${
              style_output_file(path_fragment)
            } at ${style_output_file(out_state(ctx).current_path.join("/"))}`,
          );
          ctx.error("    There already exists an output file of this name.");
          ctx.error(
            `    It was created by ${
              format_location(
                (<Stack<Location>> current.children.get(path_fragment)!.state
                  .get(location_key)!).peek()!,
              )
            }`,
          );
          ctx.halt();
        } else {
          const per_file_state = new Map();
          per_file_state.set(location_key, ctx.stack);

          current.children.set(path_fragment, {
            state: per_file_state,
            children: new Map(),
          });
          out_state(ctx).current_path.push(path_fragment);

          const path = join(...out_state(ctx).current_path);
          try {
            Deno.removeSync(path, { recursive: true });
          } catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
              ctx.error(
                `Could not clear (that is, delete) directory at ${
                  style_file(out_state(ctx).current_path.join("/"))
                }`,
              );
              ctx.error(err);
              ctx.halt();
              return "";
            }
          }

          try {
            Deno.mkdirSync(path, { recursive: true });
          } catch (err) {
            ctx.error(
              `Could not create directory at ${
                style_file(out_state(ctx).current_path.join("/"))
              }`,
            );
            ctx.error(err);
            ctx.halt();
          }
        }
      } else {
        out_state(ctx).current_path.push(path_fragment);
      }
    },
    // bu
    (ctx) => {
      out_state(ctx).current_path.pop();
    },
  );

  return new Invocation(macro, args);
}

export function out_file(
  path_fragment: string,
  ...args: Expression[]
): Invocation {
  let first_td = true;

  const macro = new_macro(
    undefined,
    (fully_expanded, ctx) => {
      try {
        Deno.writeTextFileSync(
          join(...out_state(ctx).current_path),
          fully_expanded,
        );
      } catch (err) {
        ctx.error(
          `Could not write file at ${
            style_file(out_state(ctx).current_path.join("/"))
          }`,
        );
        ctx.error(err);
        ctx.halt();
      }
      return "";
    },
    // td
    (ctx) => {
      if (first_td) {
        first_td = false;

        const current = resolve_path(
          out_state(ctx).out_files,
          out_state(ctx).current_path,
          0,
          ctx,
        );
        if (current === null) {
          return;
        }

        if (current.children === null) {
          ctx.error(
            `Cannot create output file ${style_output_file(path_fragment)} at ${
              style_output_file(out_state(ctx).current_path.join("/"))
            }`,
          );
          ctx.error(
            `    ${
              style_output_file(out_state(ctx).current_path.join("/"))
            } is no output directory.`,
          );
          ctx.halt();
        } else if (current.children.has(path_fragment)) {
          ctx.error(
            `Cannot create output file ${style_output_file(path_fragment)} at ${
              style_output_file(out_state(ctx).current_path.join("/"))
            }`,
          );
          ctx.error("    There already exists an output file of this name.");
          ctx.error(
            `    It was created by ${
              format_location(
                (<Stack<Location>> current.children.get(path_fragment)!.state
                  .get(location_key)!).peek()!,
              )
            }`,
          );
          ctx.halt();
        } else {
          const per_file_state = new Map();
          per_file_state.set(location_key, ctx.stack);

          current.children.set(path_fragment, {
            state: per_file_state,
            children: null,
          });
          out_state(ctx).current_path.push(path_fragment);

          const path = join(...out_state(ctx).current_path);

          try {
            Deno.removeSync(path, { recursive: true });
          } catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
              ctx.error(
                `Could not clear (that is, delete) file at ${
                  style_file(out_state(ctx).current_path.join("/"))
                }`,
              );
              ctx.error(err);
              ctx.halt();
              return "";
            }
          }
        }
      } else {
        out_state(ctx).current_path.push(path_fragment);
      }
    },
    (ctx) => {
      out_state(ctx).current_path.pop();
    },
  );

  return new Invocation(macro, args);
}

export function out_file_absolute(
  path_fragments: string[],
  ...args: Expression[]
): Invocation {
  const the_path = join(...path_fragments);

  let first_td = true;

  const macro = new_macro(
    undefined,
    (fully_expanded, ctx) => {
      try {
        Deno.writeTextFileSync(
          the_path,
          fully_expanded,
        );
      } catch (err) {
        ctx.error(
          `Could not write file at ${style_file(the_path)}`,
        );
        ctx.error(err);
        ctx.halt();
      }
      return "";
    },
    // td
    (ctx) => {
      if (first_td) {
        first_td = false;
        try {
          Deno.removeSync(the_path, { recursive: true });
        } catch (err) {
          if (!(err instanceof Deno.errors.NotFound)) {
            ctx.error(
              `Could not clear (that is, delete) file at ${the_path}`,
            );
            ctx.error(err);
            ctx.halt();
            return "";
          }
        }
      }
    },
  );

  return new Invocation(macro, args);
}

export function copy_file(path_fragment: string): Invocation {
  let first_td = true;

  const filename = basename(path_fragment);

  const macro = new_macro(
    undefined,
    (_, _ctx) => "",
    // td
    (ctx) => {
      if (first_td) {
        first_td = false;

        const current = resolve_path(
          out_state(ctx).out_files,
          out_state(ctx).current_path,
          0,
          ctx,
        );
        if (current === null) {
          return;
        }

        if (current.children === null) {
          ctx.error(
            `Cannot copy file ${style_file(path_fragment)} to ${
              style_output_file(out_state(ctx).current_path.join("/"))
            }`,
          );
          ctx.error(
            `    ${
              style_output_file(out_state(ctx).current_path.join("/"))
            } is no output directory.`,
          );
          ctx.halt();
        } else if (current.children.has(filename)) {
          ctx.error(
            `Cannot copy file ${style_file(path_fragment)} to ${
              style_output_file(out_state(ctx).current_path.join("/"))
            }`,
          );
          ctx.error(
            `    There already exists an output file of name ${
              style_output_file(
                `${out_state(ctx).current_path.join("/")}/${filename}`,
              )
            }`,
          );
          ctx.error(
            `    It was created by ${
              format_location(
                (<Stack<Location>> current.children.get(filename)!.state.get(
                  location_key,
                )!).peek()!,
              )
            }`,
          );
          ctx.halt();
        } else {
          const per_file_state = new Map();
          per_file_state.set(location_key, ctx.stack);

          current.children.set(filename, {
            state: per_file_state,
            children: new Map(),
          });
          out_state(ctx).current_path.push(filename);

          const path = join(...out_state(ctx).current_path);
          try {
            Deno.removeSync(path, { recursive: true });
          } catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
              ctx.error(
                `Could not clear (that is, delete) directory at ${
                  style_file(out_state(ctx).current_path.join("/"))
                }`,
              );
              ctx.error(err);
              ctx.halt();
              return "";
            }
          }

          try {
            copySync(path_fragment, path);
          } catch (err) {
            ctx.error(
              `Could not copy file from ${style_file(path_fragment)} to ${
                style_file(out_state(ctx).current_path.join("/"))
              }`,
            );
            ctx.error(err);
            ctx.halt();
          }
        }
      } else {
        out_state(ctx).current_path.push(filename);
      }
    },
    // bu
    (ctx) => {
      out_state(ctx).current_path.pop();
    },
  );

  return new Invocation(macro, []);
}

export function write_file_relative(
  path_fragments: string[],
  content: string,
  ctx: Context,
): boolean {
  const the_path = join(...out_state(ctx).current_path, ...path_fragments);

  try {
    Deno.writeTextFileSync(
      the_path,
      content,
    );
    return true;
  } catch (err) {
    ctx.error(
      `Could not write file at ${style_file(the_path)}`,
    );
    ctx.error(err);
    ctx.halt();
    return false;
  }
}

export function write_file_absolute(
  path_fragments: string[],
  content: string,
  ctx: Context,
): boolean {
  const the_path = join(...path_fragments);

  try {
    Deno.writeTextFileSync(
      the_path,
      content,
    );
    return true;
  } catch (err) {
    ctx.error(
      `Could not write file at ${style_file(the_path)}`,
    );
    ctx.error(err);
    ctx.halt();
    return false;
  }
}

export function clear_file_absolute(
  path_fragments: string[],
  ctx: Context,
): boolean {
  const the_path = join(...path_fragments);

  try {
    Deno.removeSync(the_path, { recursive: true });
    return true;
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      ctx.error(
        `Could not clear (that is, delete) file at ${the_path}`,
      );
      ctx.error(err);
      ctx.halt();
      return false;
    } else {
      return true;
    }
  }
}

export function current_per_file_state(ctx: Context): PerFileState {
  return resolve_path(
    out_state(ctx).out_files,
    out_state(ctx).current_path,
    0,
    ctx,
  )!.state;
}

export function current_path(ctx: Context): string[] {
  return out_state(ctx).current_path;
}

function resolve_path(
  out_file: OutFile,
  path: string[],
  offset: number,
  ctx: Context,
): OutFile | null {
  if (path.length === offset) {
    return out_file;
  } else if (out_file.children === null) {
    ctx.error(
      `Failed to resolve output path ${style_output_file(path.join("/"))}`,
    );
    ctx.error(
      `    ${
        style_output_file(path.slice(0, offset).join("/"))
      } is no output directory created by the out_directory macro`,
    );
    ctx.halt();
    return null;
  } else {
    const next_file = out_file.children.get(path[offset]);
    if (next_file === undefined) {
      ctx.error(
        `Failed to resolve output path ${style_output_file(path.join("/"))}`,
      );
      ctx.error(
        `    ${
          style_output_file(path.slice(0, offset).join("/"))
        } does not contain ${
          style_output_file(path[offset])
        } (not created by either the out_directory or the out_file macro)`,
      );
      ctx.halt();
      return null;
    } else if (next_file === null) {
      ctx.error(
        `Failed to resolve output path ${style_output_file(path.join("/"))}`,
      );
      ctx.error(
        `    ${
          style_output_file(path.slice(0, offset + 1).join("/"))
        } is no output directory created by the out_directory macro`,
      );
      ctx.halt();
      return null;
    } else {
      return resolve_path(next_file, path, offset + 1, ctx);
    }
  }
}

export function style_output_file(s: string): string {
  return Colors.blue(s);
}
