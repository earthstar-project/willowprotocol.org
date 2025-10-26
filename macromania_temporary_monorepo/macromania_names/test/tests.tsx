import { createNamespace } from "../mod.tsx";
import { Context } from "../deps.ts";
import { assertEquals } from "../devDeps.ts";

Deno.test("happy case, static", async () => {
  const myNamespace = createNamespace<string>("MyNamespace");
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <impure
        fun={(ctx) => {
          myNamespace.addName(ctx, "a", "Value A");
          myNamespace.addName(ctx, "b", "Value B");
          return "";
        }}
      />
      <impure
        fun={(ctx) => {
          return myNamespace.getName(ctx, "a")!;
        }}
      />
      ;
      <impure
        fun={(ctx) => {
          return myNamespace.getName(ctx, "b")!;
        }}
      />
      ;
      <impure
        fun={(ctx) => {
          const got = myNamespace.getName(ctx, "nope");
          if (got === undefined) {
            return "yay";
          } else {
            return got;
          }
        }}
      />
    </>,
  );
  assertEquals(got, "Value A;Value B;yay");
});

Deno.test("duplicate adding halts when static", async () => {
  const myNamespace = createNamespace<string>("MyNamespace");
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <impure
        fun={(ctx) => {
          myNamespace.addName(ctx, "a", "Value A");
          myNamespace.addName(ctx, "a", "Value A");
          return "";
        }}
      />
      Hi!
    </>,
  );
  assertEquals(got, null);
});

Deno.test("duplicate adding works if dynamic", async () => {
  const myNamespace = createNamespace<string>("MyNamespace", true);
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <impure
        fun={(ctx) => {
          myNamespace.addName(ctx, "a", "1!");
          myNamespace.addName(ctx, "a", "2!");
          return "";
        }}
      />
      <impure
        fun={(ctx) => {
          return myNamespace.getName(ctx, "a")!;
        }}
      />
    </>,
  );
  assertEquals(got, "2!");
});

Deno.test("multiple namespaces are isolated", async () => {
  const myNamespace = createNamespace<string>("MyNamespace");
  const myOtherNamespace = createNamespace<string>("MyOtherNamespace");
  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <impure
        fun={(ctx) => {
          myNamespace.addName(ctx, "a", "Value A");
          myOtherNamespace.addName(ctx, "a", "Value A, but different");
          return "";
        }}
      />
      <impure
        fun={(ctx) => {
          return myNamespace.getName(ctx, "a")!;
        }}
      />
      ;
      <impure
        fun={(ctx) => {
          return myOtherNamespace.getName(ctx, "a")!;
        }}
      />
    </>,
  );
  assertEquals(got, "Value A;Value A, but different");
});
