import { M, MM } from "../mod.tsx";
import { Context } from "../deps.ts";
import { assertEquals } from "../devDeps.ts";

Deno.test("simple tex rendering", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(<M>x</M>);
  assertEquals(got, `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span>`);
});

Deno.test("displayMode rendering", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(<MM>x</MM>);
  assertEquals(got, `<span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>`);
});

Deno.test("nested tex rendering", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(<M>x</M>);
  const ctx2 = new Context();
  const got2 = await ctx2.evaluate(
    <M>
      <M>x</M>
    </M>,
  );
  assertEquals(got2, got);
});

Deno.test("catching errors", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(<M>{"{"}</M>);
  assertEquals(got, null);
});