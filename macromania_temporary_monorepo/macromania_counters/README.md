# Macromania Counters

Hierarchical counters for
[Macromania](https://github.com/worm-blossom/macromania), somewhat similar to
[those of LaTeX](https://www.overleaf.com/learn/latex/Counters).

To prevent reading outdated counter values, all modification of and access to a
single counter has to occur in the same round of macro evaluation. 

```tsx
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
/>
```

In addition to counter management, this package provides a helper function for
rendering the results of calling `Counter.getFullValue` :

```tsx
/**
 * Create a function for rendering the full values of counters.
 * @param sliceStart Skip rendering the first `sliceStart` numbers.
 * @param sliceEnd Stop rendering numbers after `sliceEnd` many. Ignored when
 * `undefined`.
 * @param renderNumber How to render a number. Defaults to base 10.
 * @param renderBetween What to render between number `i` and `i + 1`.
 * Defaults to a dot.
 * @returns A function that takes a `Context` and an array of numbers as
 * returned by `Counter.getFullValue()`, and renders them into an `Expression`.
 */
export function makeNumberingRenderer(
  sliceStart = 0,
  sliceEnd?: number,
  renderNumber = (ctx: Context, num: number): Expression => `${num}`,
  renderBetween = (ctx: Context, i: number): Expression => ".",
): (ctx: Context, numbering: number[]) => Expression {
  // Implementation omitted.
}

Deno.test("rendering defaults", async () => {
  const a = new Counter("A", 1);
  const b = new Counter("B", 2, a);
  const c = new Counter("C", 3, b);
  const d = new Counter("D", 4, c);

  const renderCounter = makeNumberingRenderer();

  const ctx = new Context();
  const got = await ctx.evaluate(
    <impure fun={(ctx) => renderCounter(ctx, d.getFullValue())} />,
  );
  assertEquals(got, "1.2.3.4");
});

Deno.test("rendering custom", async () => {
  const a = new Counter("A", 1);
  const b = new Counter("B", 2, a);
  const c = new Counter("C", 3, b);
  const d = new Counter("D", 4, c);

  const renderCounter = makeNumberingRenderer(1, 3, (ctx, num) => "z".repeat(num), (ctx, i) => `${i}`);

  const ctx = new Context();
  const got = await ctx.evaluate(
    <impure fun={(ctx) => renderCounter(ctx, d.getFullValue())} />,
  );
  assertEquals(got, "zz1zzz");
});
```