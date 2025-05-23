import { Hsection } from "../mod.tsx";
import {
  Config,
  Context,
  File,
  makeNumberingRenderer,
  P,
  Rc,
} from "../deps.ts";
import { assertEquals } from "../devDeps.ts";
import { ConfigHsection } from "../mod.tsx";

Deno.test("simple example", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Hsection n="foo" title="Foo">
        <P>Lorem ipsum etc.</P>
        <Hsection n="bar" title="Bar">
          Bla <Rc n="baz" />.
        </Hsection>
        <Hsection n="baz" title="Baz">Bla again.</Hsection>
      </Hsection>
    </File>,
  );
  assertEquals(
    got,
    `<h1 id="foo"><a href="#foo">Foo</a></h1><p>Lorem ipsum etc.</p><h2 id="bar"><a href="#bar">Bar</a></h2>Bla <a class="hsection" data-hsection-level="1" data-ref="baz" href="#baz">Section 2</a>.<h2 id="baz"><a href="#baz">Baz</a></h2>Bla again.`,
  );
});

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
