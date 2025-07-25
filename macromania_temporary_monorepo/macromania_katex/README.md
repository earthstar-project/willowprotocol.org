# Macromania Katex

Use [katex](https://katex.org/) from [Macromania](https://github.com/worm-blossom/macromania). This package provides `<M>` and `<MM>` for rendering katex (inline mode or display mode, respectively).

```tsx
Deno.test("simple tex rendering", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(<M>x</M>);
  assertEquals(got, `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span>`);
});
```

Unlike normal latex, you can arbitrarily nest the math mode macros, all but the outermost one will be ignored.

Katex has a long-standing [problem with line breaking directly before or after inline math](https://github.com/KaTeX/KaTeX/issues/1233), even if typographic conventions dictate otherwise (say, if the math is followed by a comma). As a workaround, the math macros take optional prefix and postfix arguments that get rendered such that there can be no linebreak bewteen the math and the prefix or postfix:

```tsx
<>My favorite formula, <M post=",">x^2</M> always stays positive.</>
// Renders a comma behind `x^2`, and prevents linebreaking between formula and comma.
```

The non-breakable text is in a span with class `normalText`, which should be styled to look like normal body text (rather than the katex `\text` output which is used to render it).

## Configuration

To set the [katex options](https://katex.org/docs/options), use the [macromania-config](https://github.com/worm-blossom/macromania-config) package with the `<ConfigKatex />` macro exported by macromania-katex. It faithfully reproduces [katex options](https://katex.org/docs/options), except for the following differences:

- The katex `throwOnError` option is renamed to `haltOnError` (and halts rather than throwing).
- The following default values are different:
  - `output` defaults to `"html"` (in katex, it is `"htmlAndMathml"`),
  - `strict` defaults to `false` (in katex, it is `true`), and
  - `trust` defaults to `true` (in katex, it is `false`).

## Package Interoperability

Other packages can query whether evaluation is currently processing the children of a math mode macro with the `isMathMode(ctx: Context) => boolean` function, they can further query for inline vs display mode with the `isDisplayMode(ctx: Context) => boolean` function.

## Caveats

As of now, style sheets and fonts have to be imported manually, and the `normalText` styling has to be applied manually.