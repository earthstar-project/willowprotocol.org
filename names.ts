import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";

import { Stack } from "./stack.ts";
import { Context, format_location, State } from "./tsgen.ts";
import { Location } from "./get_current_line.ts";
import { current_path } from "./out.ts";

export type PerNameState = State;

const statekey = Symbol("Names");

const location_key = Symbol("CreationLocation");
const kind_key = Symbol("Kind");
const output_file_key = Symbol("OutputFile");

interface NamesState {
  names: Map<string, PerNameState>;
}

function names_state(ctx: Context): NamesState {
  const state = ctx.state.get(statekey);

  if (state) {
    return <NamesState> state;
  } else {
    ctx.state.set(statekey, {
      names: new Map(),
    });
    return names_state(ctx);
  }
}

export function get_name_location(pns: PerNameState): Stack<Location> {
  return <Stack<Location>> pns.get(location_key)!;
}

export function get_name_kind(pns: PerNameState): string {
  return <string> pns.get(kind_key)!;
}

export function get_output_file(pns: PerNameState): string[] {
  return <string[]> pns.get(output_file_key)!;
}

export function new_name(
  name: string,
  kind: string,
  ctx: Context,
  is_unsafe_name?: boolean,
): PerNameState | null {
  const safe_name_regex = /^[A-Za-z][A-Za-z0-9_]*$/;
  if (!is_unsafe_name && !safe_name_regex.test(name)) {
    ctx.error(`Invalid name ${style_name(name)} at ${format_location(ctx.stack.peek()!)}`);
    ctx.error("    Names must match regex /^[A-Za-z][A-Za-z0-9_]*$/");
    ctx.halt();
    return null;
  }

  const names = names_state(ctx).names;

  const existing_name = names.get(name);
  if (existing_name != undefined) {
    ctx.error(
      `Cannot create name ${
        style_name(name)
      }, there already exists a conflicting name.`,
    );
    ctx.error(
      `    The conflicting name was created by ${
        format_location(get_name_location(existing_name).peek()!)
      }`,
    );
    ctx.halt();
    return null;
  }

  const per_name_state = new Map();
  names.set(name, per_name_state);

  per_name_state.set(location_key, ctx.stack);
  per_name_state.set(kind_key, kind);
  per_name_state.set(output_file_key, [...current_path(ctx)]);

  return per_name_state;
}

export function try_resolve_name(
  name: string,
  expected_kind: string,
  ctx: Context,
): PerNameState | undefined {
  const name_state = try_resolve_name_any(name, ctx);
  if (name_state) {
    const kind = get_name_kind(name_state);
    if (kind === expected_kind) {
      return name_state;
    } else {
      ctx.error(`Expected name ${style_name(name)} to be of kind ${style_name_kind(expected_kind)}, but it was of kind ${style_name_kind(kind)}.`);
      ctx.error(`    The name was created by ${format_location(get_name_location(name_state).peek()!)}`);
      ctx.halt();
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function resolve_name(
  name: string,
  expected_kind: string,
  ctx: Context,
): PerNameState | null {
  const name_state = try_resolve_name(name, expected_kind, ctx);

  if (name_state === undefined) {
    if (!ctx.did_halt()) {
      ctx.error(`Name ${style_name(name)} is undefined.`);
      ctx.halt();
    }
    return null;
  } else {
    return name_state;
  }
}

export function try_resolve_name_any(
  name: string,
  ctx: Context,
): PerNameState | undefined {
  return names_state(ctx).names.get(name);
}

export function resolve_name_any(
  name: string,
  ctx: Context,
): PerNameState | null {
  const name_state = try_resolve_name_any(name, ctx);

  if (name_state === undefined) {
    ctx.error(`Name ${style_name(name)} is undefined.`);
    ctx.halt();
    return null;
  } else {
    return name_state;
  }
}

export function style_name(s: string): string {
  return Colors.cyan(s);
}

export function style_name_kind(s: string): string {
  return Colors.magenta(s);
}
