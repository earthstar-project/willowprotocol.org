import {
  Colors,
  Context,
  createLogger,
  createSubstate,
  DebuggingInformation,
  styleDebuggingInformation,
} from "./deps.ts";

/**
 * Create a new namespace: a mapping from strings (*names*) to values of some
 * type `T`.
 *
 * @param title - A human-readable title for the namespace. This title appears
 * in logged error messages, otherwise it does not influence any semantics.
 */
export function createNamespace<T>(
  title: string,
  isDynamic = false,
): Namespace<T> {
  const l = createLogger("never shown");

  const [getState, _setState] = createSubstate<NamespaceState<T>>(() => new Map());

  return {
    addName,
    getName,
    getNameAndDebug,
  };

  function addName(ctx: Context, name: string, value: T): void {
    const state = getState(ctx);
    const lookup = state.get(name);

    if (isDynamic || lookup === undefined) {
      state.set(name, [value, ctx.getCurrentDebuggingInformation()]);
    } else {
      l.error(
        ctx,
        `Failed to add name ${styleName(name)} in namespace ${
          styleTitle(title)
        }.`,
      );
      l.logGroup(ctx, () => {
        l.error(
          ctx,
          `Name was already bound at ${styleDebuggingInformation(lookup[1])}`,
        );
      });
      ctx.halt();
    }
  }

  function getName(ctx: Context, name: string): T | undefined {
    const state = getState(ctx);
    const lookup = state.get(name);

    if (lookup === undefined) {
      return undefined;
    } else {
      return lookup[0];
    }
  }

  function getNameAndDebug(
    ctx: Context,
    name: string,
  ): [T, DebuggingInformation] | undefined {
    const state = getState(ctx);
    const lookup = state.get(name);

    if (lookup === undefined) {
      return undefined;
    } else {
      return [lookup[0], lookup[1]];
    }
  }
}

/**
 * A mapping from strings (*names*) to values of some type `T`.
 */
export type Namespace<T> = {
  /**
   * Bind a value to an available name. Halts evaluation if the name was
   * already in use in this namespace.
   */
  addName: (ctx: Context, name: string, value: T) => void;
  /**
   * Retrieve the value bound to the given name, or return `undefined` if the
   * name was free in this namespace.
   */
  getName: (ctx: Context, name: string) => T | undefined;
  /**
   * Retrieve the value bound to the given name and the `DebuggingInformation`
   * about where it was bound, or return `undefined` if the name was free in
   * this namespace.
   */
  getNameAndDebug: (
    ctx: Context,
    name: string,
  ) => [T, DebuggingInformation] | undefined;
};

type NamespaceState<T> = Map<string, [T, DebuggingInformation]>;

export function styleName(name: string): string {
  return Colors.magenta(name);
}

function styleTitle(title: string): string {
  return Colors.green(title);
}
