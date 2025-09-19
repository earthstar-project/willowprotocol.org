import { Context } from "macromania";
import { createDefs, DefsDocsRs } from "./mod.tsx";
import { assert } from "@std/assert";

Deno.test("createDefs", async () => {
  const jsonString = await Deno.readTextFile("./docs.json");
  const json = JSON.parse(jsonString);

  const defs = createDefs("willow-data-model", json);

  for (const [_id, { url }] of Object.entries(defs)) {
    const res = await fetch(url);
    await res.body?.cancel();
    assert(res.status === 200);
  }
});

Deno.test.ignore("DefsDocsRs", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <DefsDocsRs crate="clap" />
    </>,
  );

  console.log(got);
});
