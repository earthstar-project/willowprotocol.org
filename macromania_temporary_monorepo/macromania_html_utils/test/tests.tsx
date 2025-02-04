import { ConfigDefref, Def, R, Rb, Rc, Rcb, Rs, Rsb } from "../mod.tsx";
import {
  Config,
  Context,
  Dir,
  Expression,
  File,
  H1,
  M,
  ServerRoot,
} from "../deps.ts";
import { assertEquals } from "../devDeps.ts";
import { didWarnOrWorse } from "../deps.ts";

Deno.test("simple Def", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x" />
    </File>,
  );
  assertEquals(got, `<dfn id="x"><a href="#x">x</a></dfn>`);
});

Deno.test("simple R", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" />
      </omnomnom>
      <R n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">x</a>`);
});

Deno.test("simple Rb", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" />
      </omnomnom>
      <Rb n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">X</a>`);
});

Deno.test("explicit R", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" r="y" />
      </omnomnom>
      <R n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">y</a>`);
});

Deno.test("explicit R then Rb", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" r="y" />
      </omnomnom>
      <Rb n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">Y</a>`);
});

Deno.test("referencing nonexisting name", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <R n="x" />
    </File>,
  );
  assertEquals(got !== null, true);
  assertEquals(didWarnOrWorse(ctx), true);
});

Deno.test("explicit Rb", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" rb="y" />
      </omnomnom>
      <Rb n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">y</a>`);
});

Deno.test("configure default Rb", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Config options={[<ConfigDefref defaultRb={(_, _r) => "z"} />]}>
      <File name="tmp">
        <omnomnom>
          <Def n="x" />
        </omnomnom>
        <Rb n="x" />
      </File>
    </Config>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">z</a>`);
});

Deno.test("configure default Rb null", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Config options={[<ConfigDefref defaultRb={null} />]}>
      <File name="tmp">
        <omnomnom>
          <Def n="x" />
        </omnomnom>
        <Rb n="x" />
      </File>
    </Config>,
  );
  assertEquals(got !== null, true);
  assertEquals(didWarnOrWorse(ctx), true);
});

Deno.test("simple Rs without defining a plural", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" />
      </omnomnom>
      <Rs n="x" />
    </File>,
  );
  assertEquals(got !== null, true);
  assertEquals(didWarnOrWorse(ctx), true);
});

Deno.test("configure default Rs", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Config options={[<ConfigDefref defaultRs={(_, _r) => "z"} />]}>
      <File name="tmp">
        <omnomnom>
          <Def n="x" />
        </omnomnom>
        <Rs n="x" />
      </File>
    </Config>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">z</a>`);
});

Deno.test("explicit Rs", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" rs="y" />
      </omnomnom>
      <Rs n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">y</a>`);
});

Deno.test("explicit Rsb", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" rsb="y" />
      </omnomnom>
      <Rsb n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">y</a>`);
});

Deno.test("implicit Rsb", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" rs="y" />
      </omnomnom>
      <Rsb n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">Y</a>`);
});

Deno.test("simple Def and Ref arbitrary text", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x">hi</Def>
      <R n="x" />
      <R n="x">bla</R>
    </File>,
  );
  assertEquals(
    got,
    `<dfn id="x"><a href="#x">hi</a></dfn><a data-ref="x" href="#x">x</a><a data-ref="x" href="#x">bla</a>`,
  );
});

Deno.test("custom id", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x" id="z" />
      <R n="x" />
    </File>,
  );
  assertEquals(
    got,
    `<dfn id="z"><a href="#z">x</a></dfn><a data-ref="x" href="#z">x</a>`,
  );
});

Deno.test("defClass", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x" defClass="a" />
      <R n="x" />
    </File>,
  );
  assertEquals(
    got,
    `<dfn id="x"><a class="a" href="#x">x</a></dfn><a data-ref="x" href="#x">x</a>`,
  );
});

Deno.test("refClass", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x" refClass="a" />
      <R n="x" />
    </File>,
  );
  assertEquals(
    got,
    `<dfn id="x"><a href="#x">x</a></dfn><a class="a" data-ref="x" href="#x">x</a>`,
  );
});

Deno.test("defData", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x" defData={{ foo: "a" }} />
      <R n="x" />
    </File>,
  );
  assertEquals(
    got,
    `<dfn id="x"><a data-foo="a" href="#x">x</a></dfn><a data-ref="x" href="#x">x</a>`,
  );
});

Deno.test("refData", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x" refData={{ foo: "a" }} />
      <R n="x" />
    </File>,
  );
  assertEquals(
    got,
    `<dfn id="x"><a href="#x">x</a></dfn><a data-foo="a" data-ref="x" href="#x">x</a>`,
  );
});

Deno.test("custom defTag", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def
        n="x"
        defTag={(inner: Expression, id: Expression) => {
          return H1({ id, children: inner });
        }}
      />
    </File>,
  );
  assertEquals(got, `<h1 id="x"><a href="#x">x</a></h1>`);
});

Deno.test("switch to katex in math mode", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="y" />
      </omnomnom>
      <M>
        <R n="y" />
      </M>
    </File>,
  );
  assertEquals(
    got,
    `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="enclosing" data-ref="y"><a href="#y"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></a></span></span></span></span>`,
  );
});

Deno.test("math prop", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" math="y" />
      </omnomnom>
      <M>
        <R n="x" />
      </M>
    </File>,
  );
  assertEquals(
    got,
    `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="enclosing" data-ref="x"><a href="#x"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></a></span></span></span></span>`,
  );
});

Deno.test("specifying math prop in math mode gives warning", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <M>
          <Def n="y" math="x" />
        </M>
      </omnomnom>
      <M>
        <R n="y" />
      </M>
    </File>,
  );
  assertEquals(
    got,
    `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="enclosing" data-ref="y"><a href="#y"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></a></span></span></span></span>`,
  );
  assertEquals(didWarnOrWorse(ctx), true);
});

Deno.test("def in math", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <M>
        <Def n="x" />
      </M>
    </File>,
  );
  assertEquals(
    got,
    `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="enclosing" id="x"><a href="#x"><span class="mord mathnormal">x</span></a></span></span></span></span>`,
  );
});

Deno.test("def in math mode turns references into math mode", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <M>
          <Def n="y" />
        </M>
      </omnomnom>
      <R n="y" />
    </File>,
  );
  assertEquals(
    got,
    `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="enclosing" data-ref="y"><a href="#y"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></a></span></span></span></span>`,
  );
});

Deno.test("undefined numbering reference fails", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <Def n="x" />
      <Rc n="x" />
    </File>,
  );
  assertEquals(got, null);
});

Deno.test("numbering but normal R", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def
          n="x"
          numbering={{
            numbering: [2, 1],
            info: {
              r: "section",
              rb: "Section",
              rs: "sections",
              rsb: "Sections",
              render: (ctx, numbering) => numbering.join("."),
            },
          }}
        />
      </omnomnom>
      <R n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">x</a>`);
});

Deno.test("simple Rc", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def
          n="x"
          numbering={{
            numbering: [2, 1],
            info: {
              r: "section",
              rb: "Section",
              rs: "sections",
              rsb: "Sections",
              render: (ctx, numbering) => numbering.join("."),
            },
          }}
        />
      </omnomnom>
      <Rc n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">section 2.1</a>`);
});

Deno.test("simple Rcb", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def
          n="x"
          numbering={{
            numbering: [2, 1],
            info: {
              r: "section",
              rb: "Section",
              rs: "sections",
              rsb: "Sections",
              render: (ctx, numbering) => numbering.join("."),
            },
          }}
        />
      </omnomnom>
      <Rcb n="x" />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">Section 2.1</a>`);
});

Deno.test("Rc custom render", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def
          n="x"
          numbering={{
            numbering: [2, 1],
            info: {
              r: "section",
              rb: "Section",
              rs: "sections",
              rsb: "Sections",
              render: (ctx, numbering) => numbering.join("."),
            },
          }}
        />
      </omnomnom>
      <Rc n="x" render={(ctx, numbering) => "fff"} />
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">section fff</a>`);
});

Deno.test("Rc children", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def
          n="x"
          numbering={{
            numbering: [2, 1],
            info: {
              r: "section",
              rb: "Section",
              rs: "sections",
              rsb: "Sections",
              render: (ctx, numbering) => numbering.join("."),
            },
          }}
        />
      </omnomnom>
      <Rc n="x">aaa</Rc>
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">aaa 2.1</a>`);
});

Deno.test("Rc custom render and children", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def
          n="x"
          numbering={{
            numbering: [2, 1],
            info: {
              r: "section",
              rb: "Section",
              rs: "sections",
              rsb: "Sections",
              render: (ctx, numbering) => numbering.join("."),
            },
          }}
        />
      </omnomnom>
      <Rc n="x" render={(ctx, numbering) => "fff"}>aaa</Rc>
    </File>,
  );
  assertEquals(got, `<a data-ref="x" href="#x">aaa fff</a>`);
});

Deno.test("gracefully handle unknown Rc", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <File name="tmp">
      <omnomnom>
        <Def n="x" />
      </omnomnom>
      <Rc n="nope" />
    </File>,
  );
  assertEquals(got !== null, true);
  assertEquals(didWarnOrWorse(ctx), true);
});