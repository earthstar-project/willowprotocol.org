import { join} from "https://deno.land/std@0.198.0/path/mod.ts";

import { Expression, Invocation, default_bu, forward_args, new_macro } from "./tsgen.ts";

// deno-lint-ignore no-explicit-any
export type FileState = Record<PropertyKey, any>;

export interface OutState {
    out_files: OutFile; // a tree of path fragments and the associated file state
    current_path: string[]; // stack of path fragments that make up the current path
}

export function out_initial_state(): OutState {
    return {
        out_files: {
            state: {},
            children: new Map(),
        },
        current_path: [],
    };
}

export type OutFile = {
    state: FileState,
    children: Map<string, OutFile /*directory*/> | null /*leaf*/,
}

export function out_directory<State extends OutState>(path_fragment: string, ...args: Expression<State>[]): Invocation<State> {
    let first_invocation = true;

    const macro = new_macro<State>(
        (args, state) => {
            console.log(1111111);
            
            if (first_invocation) {
                first_invocation = false;
                
                const current = resolve_path(state.out_files, state.current_path, 0);
    
                if (current.children === null) {
                    throw new Error(`Cannot create directory ${path_fragment} at ${state.current_path.join("/")}
    ${state.current_path.join("/")} is no directory.`);
                } else if (current.children.has(path_fragment)) {
                    throw new Error(`Cannot create directory ${path_fragment} at ${state.current_path.join("/")}
There already exists a file of this name.`);
                }
    
                current.children.set(path_fragment, { state: {}, children: new Map()});
                state.current_path.push(path_fragment);

                const path = join(...state.current_path);
                try {
                    Deno.removeSync(path, {recursive: true});
                } catch (err) {
                    if (!(err instanceof Deno.errors.NotFound)) {
                        throw err;
                    }
                }
                Deno.mkdirSync(path, {recursive: true});
            }

            return forward_args(args);
        },

        default_bu,

        (_is_final_invocation, state) => {
            console.log(`directory final ${_is_final_invocation}`);
            state.current_path.pop();
        }
    );

    return { macro, args };
}

export function out_file<State extends OutState>(path_fragment: string, ...args: Expression<State>[]): Invocation<State> {
    let first_invocation = true;

    const macro = new_macro<State>(
        (args, state) => {
            console.log(2222222);
            
            
            if (first_invocation) {
                first_invocation = false;
                
                const current = resolve_path(state.out_files, state.current_path, 0);
    
                if (current.children === null) {
                    throw new Error(`Cannot create file ${path_fragment} at ${state.current_path.join("/")}
        ${state.current_path.join("/")} is no directory.`);
                } else if (current.children.has(path_fragment)) {
                    throw new Error(`Cannot create file ${path_fragment} at ${state.current_path.join("/")}
    There already exists a file of this name.`);
                }
    
                current.children.set(path_fragment, { state: {}, children: null});
                state.current_path.push(path_fragment);

                const path = join(...state.current_path);
                
                try {
                    Deno.removeSync(path, {recursive: true});
                } catch (err) {
                    if (!(err instanceof Deno.errors.NotFound)) {
                        throw err;
                    }
                }
            }

            return forward_args(args);
        },

        (fully_expanded, state) => {
            console.log("kkkkkkkkkk");
            Deno.writeTextFileSync(join(...state.current_path), fully_expanded);
            return fully_expanded;
        },

        (_is_final_invocation, state) => {
            console.log(`file final ${_is_final_invocation}`);
            
            state.current_path.pop();
        }
    );

    return { macro, args };
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
