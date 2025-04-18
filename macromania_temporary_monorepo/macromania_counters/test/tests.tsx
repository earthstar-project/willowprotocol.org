import { Counter, makeNumberingRenderer } from "../mod.tsx";
import { Context } from "../deps.ts";
import { assertEquals } from "../devDeps.ts";

Deno.test("counter examples", async () => {
  const ctx = new Context();
  const _ = await ctx.evaluate(
    <impure
      fun={(ctx) => {
        const counterA = new Counter("A", 1); // initial value
        assertEquals(counterA.getOwnValue(ctx), 1);
        counterA.increment(ctx);
        assertEquals(counterA.getOwnValue(ctx), 2);

        const counterB = new Counter("B", 1, counterA); // counterA becomes the parent of counterB
        counterB.getFullValue(ctx); // [2, 1] (parent first, self second)
        assertEquals(counterB.getFullValue(ctx), [2, 1]);
        counterB.increment(ctx);
        assertEquals(counterB.getOwnValue(ctx), 2);

        const counterC = new Counter("C", 0); // Different initial value, for demonstration
        counterC.setParent(counterB); // can set parents dynamically
        counterC.increment(ctx);
        assertEquals(counterC.getFullValue(ctx), [2, 2, 1]);
        counterC.getFullValue(ctx); // [2, 2, 1] (grandparent, parent, self)

        counterA.increment(ctx); // Incrementing a counter resets descendents to their initial value
        assertEquals(counterC.getFullValue(ctx), [3, 1, 0]);

        return "";
      }}
    />,
  );
});

Deno.test("counters halt when used across multiple evaluation rounds", async () => {
  const counterA = new Counter("A", 1);

  const ctx = new Context();
  const _ = await ctx.evaluate(
    <>
      <impure
        fun={(ctx) => {
          counterA.increment(ctx);
          return "";
        }}
      />;

      <impure
        fun={(ctx) => {
          if (ctx.getRound() < 1) {
            return null;
          } else {
            counterA.getFullValue(ctx);
            return "";
          }
        }}
      />
    </>,
  );
});

Deno.test("rendering defaults", async () => {
  const a = new Counter("A", 1);
  const b = new Counter("B", 2, a);
  const c = new Counter("C", 3, b);
  const d = new Counter("D", 4, c);

  const renderCounter = makeNumberingRenderer();

  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <impure
        fun={(ctx) => {
          assertEquals(d.getFullValue(ctx), [1, 2, 3, 4]);
          return "";
        }}
      />
      <impure fun={(ctx) => renderCounter(ctx, d.getFullValue(ctx))} />
    </>,
  );
  assertEquals(got, "1.2.3.4");
});

Deno.test("rendering custom", async () => {
  const a = new Counter("A", 1);
  const b = new Counter("B", 2, a);
  const c = new Counter("C", 3, b);
  const d = new Counter("D", 4, c);

  const renderCounter = makeNumberingRenderer(
    1,
    3,
    (ctx, num) => "z".repeat(num),
    (ctx, i) => `${i}`,
  );

  const ctx = new Context();
  const got = await ctx.evaluate(
    <>
      <impure
        fun={(ctx) => {
          assertEquals(d.getFullValue(ctx), [1, 2, 3, 4]);
          return "";
        }}
      />
      <impure fun={(ctx) => renderCounter(ctx, d.getFullValue(ctx))} />
    </>,
  );
  assertEquals(got, "zz1zzz");
});
