# Macromania Hierarchical Sections

[Macromania](https://github.com/worm-blossom/macromania) macros for defining hierarchical (i.e., nested) sections with HTML output. Sections have headings, and can be referenced via [DefRef](https://github.com/worm-blossom/macromania_defref).

## Defining Sections

The `<HSection>` macro defines a section; nesting macro calls creates a hierarchy. At minimum, each call must supply a name `n` to use for DefRef, and the content of the heading for the section via the `title` prop.

```tsx
<Hsection n="foo" title="Foo">
  <P>Lorem ipsum etc.</P>
  <Hsection n="bar" title="Bar">Bla <Rc n="baz"/>.</Hsection>
  <Hsection n="baz" title="Baz">Bla again.</Hsection>
</Hsection>
```

This evaluates roughly to:

---

## Foo

Lorem ipsum etc.

### Bar

Bla [Section 1.2](./baz).

### Baz

Bla again.

---

You can nest sections up to six levels deep. The `<Hsection>` macro accepts all the props of DefRef's `<Def/>` macro, to customize referencing behavior.

Packages can access the [`Counters`](https://github.com/worm-blossom/macromania-counters) for the six section levels via the `getHsectionCounter(ctx: Context, level: number): Counter` function.

### Configuration

You can ue the [macromania-config package](https://github.com/worm-blossom/macromania_config) to configure some aspects of the `<Hsection>` macro.

The `titleRenderPre` and `titleRenderPost` config options let you specify prefixes and postfixes for the rendered heading depending on the numbering of the section:

```tsx
Deno.test("title prefixes and postfixes", async () => {
  /* from https://github.com/worm-blossom/macromania-counters */
  const numberingRenderer = makeNumberingRenderer(1);

  const ctx = new Context();
  const got = await ctx.evaluate(
    <Config
      options={[
        <ConfigHsection
          titleRenderPre={(ctx, numbering) => {
            if (numbering.length <= 1) {
              return "";
            } else {
              return numberingRenderer(ctx, numbering);
            }
          }}
          titleRenderPost={makeNumberingRenderer(0)}
        />,
      ]}
    >
      <File name="tmp">
        <Hsection n="foo" title="Foo">
          <P>Lorem ipsum etc.</P>
          <Hsection n="bar" title="Bar">
            Bla <Rc n="baz" />.
          </Hsection>
          <Hsection n="baz" title="Baz">Bla again.</Hsection>
        </Hsection>
      </File>
    </Config>,
  );
  assertEquals(
    got,
    `<h1 id="foo"><a href="#foo">Foo1</a></h1><p>Lorem ipsum etc.</p><h2 id="bar"><a href="#bar">1Bar1.1</a></h2>Bla <a class="hsection" data-hsection-level="1" data-ref="baz" href="#baz">Section 2</a>.<h2 id="baz"><a href="#baz">2Baz1.2</a></h2>Bla again.`,
  );
});
```

Use the config options `level1NumberingInfo`, `level2NumberingInfo`, ..., `level6NumberingInfo` to control the `NumberingInfo` for the [DefRef](https://github.com/worm-blossom/macromania_defref) macros for referencing sections. Setting an option to `null` means that the sections of that level cannot be referenced with the `<Rc>` macro.

```tsx
Deno.test("numbering info", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Config
      options={[
        <ConfigHsection
          level1NumberingInfo={{
            r: "foo",
            rb: "Foo",
            rs: "foos",
            rsb: "Foos",
            render: (ctx, numbering) => "X",
          }}
        />,
      ]}
    >
      <File name="tmp">
        <Hsection n="foo" title="Foo">
          <Rc n="foo" />
        </Hsection>
      </File>
    </Config>,
  );
  assertEquals(
    got,
    `<h1 id="foo"><a href="#foo">Foo</a></h1><a class="hsection" data-hsection-level="0" data-ref="foo" href="#foo">foo X</a>`,
  );
});
```

<!-- ## Tables of Contents

The `<Toc/>` macro genereates a table of contents. You can customize the output through the following configuration options:

TODO -->