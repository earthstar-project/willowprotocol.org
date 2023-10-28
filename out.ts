import { join} from "https://deno.land/std@0.198.0/path/mod.ts";

import { Expression, Invocation,  new_macro, Context, State, location_of_callsite } from "./tsgen.ts";
import { getLocationsFromError } from "./get_current_line.ts";

export type PerFileState = State;

const statekey = Symbol();

interface OutState {
    out_files: OutFile; // a tree of path fragments and the associated file state
    current_path: string[]; // stack of path fragments that make up the current path
}

function out_state(ctx: Context): OutState {
    const state = ctx.state.get(statekey);

    if (state) {
        return <OutState>state;
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
    state: PerFileState,
    children: Map<string, OutFile /*directory*/> | null /*leaf*/,
}

export function out_directory(path_fragment: string, ...args: Expression[]): Invocation {
    let first_td = true;

    const macro = new_macro(
        undefined,
        
        (_, _ctx) => "",

        // td
        ctx => {
            if (first_td) {
                first_td = false;

                const current = resolve_path(out_state(ctx).out_files, out_state(ctx).current_path, 0);
    
                if (current.children === null) {
                    throw new Error(`Cannot create directory ${path_fragment} at ${out_state(ctx).current_path.join("/")}
    ${out_state(ctx).current_path.join("/")} is no directory.`);
                } else if (current.children.has(path_fragment)) {
                    throw new Error(`Cannot create directory ${path_fragment} at ${out_state(ctx).current_path.join("/")}
There already exists a file of this name.`);
                }

                current.children.set(path_fragment, { state: new Map(), children: new Map()});
                out_state(ctx).current_path.push(path_fragment);

                const path = join(...out_state(ctx).current_path);
                try {
                    Deno.removeSync(path, {recursive: true});
                } catch (err) {
                    if (!(err instanceof Deno.errors.NotFound)) {
                        throw err;
                    }
                }
                Deno.mkdirSync(path, {recursive: true});
            } else {
                out_state(ctx).current_path.push(path_fragment);
            }
        },

        // bu
        ctx => {
            out_state(ctx).current_path.pop();
        },
    );

    return new Invocation(macro, args, location_of_callsite());
}

export function out_file(path_fragment: string, ...args: Expression[]): Invocation {
    let first_td = true;

    const macro = new_macro(
        undefined,
        // (args, ctx) => {
        //     return args;
        // },

        (fully_expanded, ctx) => {
            Deno.writeTextFileSync(join(...out_state(ctx).current_path), fully_expanded);
            return "";
        },

        // td
        ctx => {
            if (first_td) {
                first_td = false;

                const current = resolve_path(out_state(ctx).out_files, out_state(ctx).current_path, 0);
    
                if (current.children === null) {
                    throw new Error(`Cannot create file ${path_fragment} at ${out_state(ctx).current_path.join("/")}
    ${out_state(ctx).current_path.join("/")} is no directory.`);
                } else if (current.children.has(path_fragment)) {
                    throw new Error(`Cannot create file ${path_fragment} at ${out_state(ctx).current_path.join("/")}
There already exists a file of this name.`);
                }
    
                current.children.set(path_fragment, { state: new Map(), children: null});
                out_state(ctx).current_path.push(path_fragment);

                const path = join(...out_state(ctx).current_path);
                
                try {
                    Deno.removeSync(path, {recursive: true});
                } catch (err) {
                    if (!(err instanceof Deno.errors.NotFound)) {
                        throw err;
                    }
                }
            } else {
                out_state(ctx).current_path.push(path_fragment);
            }
        },

        ctx => {
            out_state(ctx).current_path.pop();
        }
    );

    // ctx.register_invocation();
    // console.log(getLocationsFromError(new Error()));
    return new Invocation(macro, args, location_of_callsite());
}

export function curret_per_file_state(ctx: Context): PerFileState {
    return resolve_path(out_state(ctx).out_files, out_state(ctx).current_path, 0).state;
}

function resolve_path(out_file: OutFile, path: string[], offset: number): OutFile {
    if (path.length === offset) {
        return out_file;
    } else if (out_file.children === null) {
        throw new Error(`Failed to resolve path ${path.join("/")}
    ${path.slice(0, offset).join("/")} is no directory`);
    } else {
        const next_file = out_file.children.get(path[offset]);
        if (next_file ===  undefined) {
            throw new Error(`Failed to resolve path ${path.join("/")}
    ${path.slice(0, offset).join("/")} does not contain ${path[offset]}`);
        } else if (next_file === null) {
            throw new Error(`Failed to resolve path ${path.join("/")}
    ${path.slice(0, offset + 1).join("/")} is no directory`);
        } else {
            return resolve_path(next_file, path, offset + 1);
        }
    }
}