import { createConfigOptions } from "../mod.tsx";
import { Expression } from "../deps.ts";

type FavoriteWordOptions = {
  word: string;
  upperCase: boolean;
};

type FavoriteWordChanges = {
  /**
   * This shows as docs on the `word` prop of the `ConfigFavoriteWord` macro.
   */
  word?: string;
  upperCase?: boolean;
};

const [
  getter,
  ConfigFavoriteWord,
] = createConfigOptions<FavoriteWordOptions, FavoriteWordChanges>(
  "ConfigFavoriteWord",
  () => ({
    word: "default",
    upperCase: false,
  }),
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
  return (
    <impure
      fun={(ctx) => {
        const word = getter(ctx).word!;
        return getter(ctx).upperCase! ? word.toUpperCase() : word;
      }}
    />
  );
}
