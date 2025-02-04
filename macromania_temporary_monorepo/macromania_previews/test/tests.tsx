import { Assets, resolveAssetToOutFsPath, transformCopy } from "../mod.tsx";
import { Context, Dir, posixPath } from "../deps.ts";
import { assertEquals, assertFs } from "../devDeps.ts";

function assertMapping(ctx: Context, mapping: [string[], string[] | null][]) {
  for (const [assetPath, expectedPath] of mapping) {
    assertEquals(resolveAssetToOutFsPath(ctx, assetPath), expectedPath);
  }
}

Deno.test("copy all", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Dir name="got00">
      <Assets input={["testInputDir"]} assets={{ children: {} }} />
    </Dir>,
  );
  assertEquals(got, "");
  await assertFs("./got00", "./expected00");

  assertMapping(ctx, [
    [["a.txt"], ["got00", "a.txt"]],
    [["b.txt"], ["got00", "b.txt"]],
    [["nested"], null],
    [["nested", "c.txt"], ["got00", "nested", "c.txt"]],
    [["nested", "d.txt"], ["got00", "nested", "d.txt"]],
    [["nested", "nestedAgain"], null],
    [["nested", "nestedAgain", "e.txt"], [
      "got00",
      "nested",
      "nestedAgain",
      "e.txt",
    ]],
    [["nested", "nestedAgain", "f.txt"], [
      "got00",
      "nested",
      "nestedAgain",
      "f.txt",
    ]],
  ]);
});

Deno.test("skip all", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Dir name="got01">
      <Assets
        input={["testInputDir"]}
        assets={{ transformation: "ignore", children: {} }}
      />
    </Dir>,
  );
  assertEquals(got, "");
  await assertFs("./got01", "./expected01");

  assertMapping(ctx, [
    [["a.txt"], null],
    [["b.txt"], null],
    [["nested"], null],
    [["nested", "c.txt"], null],
    [["nested", "d.txt"], null],
    [["nested", "nestedAgain"], null],
    [["nested", "nestedAgain", "e.txt"], null],
    [["nested", "nestedAgain", "f.txt"], null],
  ]);
});

Deno.test("skip all but some exceptions", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Dir name="got02">
      <Assets
        input={["testInputDir"]}
        assets={{
          transformation: "ignore",
          children: {
            "a.txt": transformCopy,
            nested: {
              transformation: transformCopy,
              children: {},
            },
          },
        }}
      />
    </Dir>,
  );
  assertEquals(got, "");
  await assertFs("./got02", "./expected02");

  assertMapping(ctx, [
    [["a.txt"], ["got02", "a.txt"]],
    [["b.txt"], null],
    [["nested"], null],
    [["nested", "c.txt"], ["got02", "nested", "c.txt"]],
    [["nested", "d.txt"], ["got02", "nested", "d.txt"]],
    [["nested", "nestedAgain"], null],
    [["nested", "nestedAgain", "e.txt"], [
      "got02",
      "nested",
      "nestedAgain",
      "e.txt",
    ]],
    [["nested", "nestedAgain", "f.txt"], [
      "got02",
      "nested",
      "nestedAgain",
      "f.txt",
    ]],
  ]);
});

Deno.test("inherit from parent", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Dir name="got03">
      <Assets
        input={["testInputDir"]}
        assets={{
          transformation: "ignore",
          children: {
            "a.txt": transformCopy,
            nested: {
              transformation: transformCopy,
              children: {
                "c.txt": "ignore",
                nestedAgain: {
                  children: {},
                },
              },
            },
          },
        }}
      />
    </Dir>,
  );
  assertEquals(got, "");
  await assertFs("./got03", "./expected03");

  assertMapping(ctx, [
    [["a.txt"], ["got03", "a.txt"]],
    [["b.txt"], null],
    [["nested"], null],
    [["nested", "c.txt"], null],
    [["nested", "d.txt"], ["got03", "nested", "d.txt"]],
    [["nested", "nestedAgain"], null],
    [["nested", "nestedAgain", "e.txt"], [
      "got03",
      "nested",
      "nestedAgain",
      "e.txt",
    ]],
    [["nested", "nestedAgain", "f.txt"], [
      "got03",
      "nested",
      "nestedAgain",
      "f.txt",
    ]],
  ]);
});
