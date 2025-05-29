# Macromania Config

A framework for consistent, scoped configuration management for [Macromania](https://github.com/worm-blossom/macromania) macros.

Imagine a macro `<FavoriteWord />` whose output should be a configurable word, optionally in uppercase. When implemented with macromania-config, the user-facing configuration API works like this:

```tsx
<Config options={
  <ConfigFavoriteWord word="chouette" upperCase/>
  {/* Config for further modules can go here as well. */}
}>
  <FavoriteWord />{/* Evaluates to "CHOUETTE". */}

  {/* You can locally override configuration options. */}
  <Config options={<ConfigFavoriteWord word="pneu"/>}>
    <FavoriteWord />{/* Evaluates to "PNEU". */}
  </Config>

  {/* The override was purely local. */}
  <FavoriteWord />{/* Evaluates to "CHOUETTE". */}
</Config>
```

The implementation of the `favorite-word` package uses the `createConfigOptions` function provided by `macromania-config`:

```tsx
import { createConfigOptions } from "./macromania-config";

/**
 * Internal config state for the macro.
 */
type FavoriteWordOptions = {
  word: string;
  upperCase: boolean;
};

/**
 * User-facing type to describe changes to the config state.
 * Note how we made the props optional.
 */
type FavoriteWordChanges = {
  word?: string;
  upperCase?: boolean;
};

// Obtain setter macro and getter function
const [
  getter,
  ConfigFavoriteWord,
] = createConfigOptions<FavoriteWordOptions, FavoriteWordChanges>(
  // name of the setter macro, as it should appear in debug information.
  "ConfigFavoriteWord", 
  // Initial config state (of type `FavoriteWordOptions`).
  () => ({
    word: "default",
    upperCase: false,
  }),
  // How to apply a config change to the prior config value to obtain a new one.
  // Must return an entirely new value, not mutate the old one.
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.word !== undefined) {
      newValue.word = update.word;
    }
    if (update.upperCase !== undefined) {
      newValue.upperCase = update.upperCase;
    }
    return newValue;
  },
);
export { ConfigFavoriteWord };

export function FavoriteWord(): Expression {
  return <impure fun={(ctx) => {
    const word = getter(ctx).word!;
    return getter(ctx).upperCase! ? word.toUpperCase() : word;
  }} />;
}
```

That demonstrates the complete API.

`createConfigOptions<S, U>(default: S, applyUpdate: (old: S, update: U) => S)` returns a macro for setting the config options, and a function for getting them.

The `<Config>` macro is used by the user to set configuration options via the setter macros returned by various calls to `createConfigOptions`. These setters error when used outside the `options` prop of the `<Config>` macro.