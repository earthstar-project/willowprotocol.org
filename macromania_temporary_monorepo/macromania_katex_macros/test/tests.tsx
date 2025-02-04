import { MId, MClass, MData, MHref } from "../mod.tsx";
import { Context } from "../deps.ts";
import { assertEquals } from "../devDeps.ts";

Deno.test("href", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <MHref url="https://example.org">y</MHref>
  );
  assertEquals(got, `\\href{https://example.org}{y}`);
});

Deno.test("htmlId", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <MId id="x">y</MId>
  );
  assertEquals(got, `\\htmlId{x}{y}`);
});

Deno.test("htmlClass", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <MClass clazz="x">y</MClass>
  );
  assertEquals(got, `\\htmlClass{x}{y}`);
});

Deno.test("htmlClass many", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <MClass clazz={["a", "b", "c"]}>y</MClass>
  );
  assertEquals(got, `\\htmlClass{a b c}{y}`);
});

Deno.test("htmlData", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <MData data={{a: "A", b: "B"}}>y</MData>
  );
  assertEquals(got, `\\htmlData{a=A b=B}{y}`);
});