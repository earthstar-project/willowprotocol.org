import { Context } from "macromania";
import { Shiki } from "../mod.tsx";

Deno.test("just test it", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Shiki path={["test", "test_sample.rs"]} lang="rust" theme="dracula" />,
  );

  console.log(got);
});
