import { Config } from "../mod.tsx";
import { Context } from "../deps.ts";
import { assertEquals } from "../devDeps.ts";
import { FavoriteWord, ConfigFavoriteWord } from "./favoriteWord.tsx";

Deno.test("favorite name example", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <FavoriteWord />
      <Config options={<ConfigFavoriteWord word="chouette" />}>
        <FavoriteWord />
        <Config options={<ConfigFavoriteWord word="pneu" />}>
          <FavoriteWord />
        </Config>
        <FavoriteWord />
      </Config>
      <FavoriteWord />
    </>,
  );
  assertEquals(got, `defaultchouettepneuchouettedefault`);
});

Deno.test("setting multiple times in same options", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <FavoriteWord />
      <Config options={<ConfigFavoriteWord word="chouette" />}>
        <FavoriteWord />
        <Config
          options={[
            <ConfigFavoriteWord word="foo" />,
            <ConfigFavoriteWord word="pneu" />,
          ]}
        >
          <FavoriteWord />
        </Config>
        <FavoriteWord />
      </Config>
      <FavoriteWord />
    </>,
  );
  assertEquals(got, `defaultchouettepneuchouettedefault`);
});

Deno.test("error when using setter outside Config options", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <FavoriteWord />
      <Config options={<ConfigFavoriteWord word="chouette" />}>
        <FavoriteWord />
        <Config
          options={<ConfigFavoriteWord word="pneu" />}
        >
          <ConfigFavoriteWord word="foo" />
          <FavoriteWord />
        </Config>
        <FavoriteWord />
      </Config>
      <FavoriteWord />
    </>,
  );
  assertEquals(got, null);
});

Deno.test("delayed invocation", async () => {
  function A() {
    let i = 0;
    return (
      <impure
        fun={(ctx) => {
          if (i < 3) {
            i += 1;
            return null;
          } else {
            return "";
          }
        }}
      />
    );
  }

  function B() {
    let i = 0;
    return (
      <impure
        fun={(ctx) => {
          if (i < 2) {
            i += 1;
            return null;
          } else {
            return "";
          }
        }}
      />
    );
  }

  function C() {
    let i = 0;
    return (
      <impure
        fun={(ctx) => {
          if (i < 1) {
            i += 1;
            return null;
          } else {
            return "";
          }
        }}
      />
    );
  }
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <FavoriteWord />
      <C />
      <Config options={<ConfigFavoriteWord word="chouette" />}>
        <B />
        <FavoriteWord />
        <Config
          options={[
            <ConfigFavoriteWord word="foo" />,
            <ConfigFavoriteWord word="pneu" />,
          ]}
        >
          <A />
          <FavoriteWord />
        </Config>
        <FavoriteWord />
      </Config>
      <FavoriteWord />
    </>,
  );
  assertEquals(got, `defaultchouettepneuchouettedefault`);
});

Deno.test("omitting options", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <FavoriteWord />
      <Config options={<ConfigFavoriteWord word="chouette" upperCase />}>
        <FavoriteWord />
        <Config
          options={[
            <ConfigFavoriteWord word="foo" />,
            <ConfigFavoriteWord word="pneu" />,
          ]}
        >
          <FavoriteWord />
        </Config>
        <FavoriteWord />
      </Config>
      <FavoriteWord />
    </>,
  );
  assertEquals(got, `defaultCHOUETTEPNEUCHOUETTEdefault`);
});
