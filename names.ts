import { Context, State } from "./tsgen.ts";

export type PerNameState = State;

const statekey = Symbol();

interface NamesState {
  names: Map<string, PerNameState>;
}

function names_state(ctx: Context): NamesState {
  const state = ctx.state.get(statekey);

  if (state) {
      return <NamesState>state;
  } else {
      ctx.state.set(statekey, {
          names: new Map(),
      });
      return names_state(ctx);
  }
}

export function new_name(
  name: string,
  ctx: Context
): PerNameState {
  const names = names_state(ctx).names;
  if (names.has(name)) {
    throw new Error(
      `Cannot create name ${name}, there already exists a conflicting name.`,
    );
  }

  const per_name_state = new Map();
  names.set(name, per_name_state);
  return per_name_state;
}

export function try_resolve_name(
  name: string,
  ctx: Context
): PerNameState | undefined {
  return names_state(ctx).names.get(name);
}

export function resolve_name(
    name: string,
    ctx: Context
): PerNameState {
    const name_state = try_resolve_name(name, ctx);

    if (name_state === undefined) {
        throw new Error(
            `Could not resolve name ${name}.`,
          );
    } else {
        return name_state;
    }
}
