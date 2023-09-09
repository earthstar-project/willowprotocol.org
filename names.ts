// deno-lint-ignore no-explicit-any
export type NameState = Record<PropertyKey, any>;

export interface NamesState {
  names: Map<string, NameState>;
}

export function new_name<State extends NamesState>(
  name: string,
  state: State,
): NameState {
  if (state.names.has(name)) {
    throw new Error(
      `Cannot create name ${name}, there already exists a conflicting name.`,
    );
  }

  const name_state = {};
  state.names.set(name, name_state);
  return name_state;
}

export function resolve_name<State extends NamesState>(
    name: string,
    state: State,
): NameState | undefined {
    const name_state = state.names.get(name);

    if (name_state === undefined) {
        throw new Error(
            `Could not resolve name ${name}.`,
          );
    } else {
        return name_state;
    }
}
