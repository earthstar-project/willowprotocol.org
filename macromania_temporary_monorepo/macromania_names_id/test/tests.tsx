import { addName, IdA } from "../mod.tsx";
import {
  ConfigWebserverRoot,
  Context,
  Dir,
  Expression,
  File,
  H1,
  ServerRoot,
} from "../deps.ts";
import { assertEquals, assertFs, Config } from "../devDeps.ts";

function IdH1({ name }: { name: string }): Expression {
  return (
    <impure
      fun={(ctx) => {
        addName(ctx, name);
        return <H1 id={name}>{name}</H1>;
      }}
    />
  );
}

Deno.test("links without any servers", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Dir name="test1">
      <Dir name="aaa">
        <File name="A">
          <IdH1 name="a" />
          <IdA name="a">aa</IdA>
          <IdA name="b">bb</IdA>
          <IdA name="c">cc</IdA>
          <IdA name="d">dd</IdA>
        </File>
        <Dir name="bbb">
          <File name="B">
            <IdH1 name="b" />
            <IdA name="a">aa</IdA>
            <IdA name="b">bb</IdA>
            <IdA name="c">cc</IdA>
            <IdA name="d">dd</IdA>
          </File>
          <Dir name="ccc">
            <File name="C">
              <IdH1 name="c" />
              <IdA name="a">aa</IdA>
              <IdA name="b">bb</IdA>
              <IdA name="c">cc</IdA>
              <IdA name="d">dd</IdA>
            </File>
            <Dir name="dddddddddddddddddddd">
              <File name="D">
                <IdH1 name="d" />
                <IdA name="a">aa</IdA>
                <IdA name="b">bb</IdA>
                <IdA name="c">cc</IdA>
                <IdA name="d">dd</IdA>
              </File>
              <Dir name="ee">
                <Dir name="ff">
                  <Dir name="gg">
                    <Dir name="hh">
                      <Dir name="ii">
                        <File name="I">
                          <IdH1 name="i" />
                          <IdA name="a">aa</IdA>
                          <IdA name="i">ii</IdA>
                        </File>
                      </Dir>
                    </Dir>
                  </Dir>
                </Dir>
              </Dir>
            </Dir>
          </Dir>
        </Dir>
      </Dir>
    </Dir>,
  );

  assertEquals(got !== null, true);
  await assertFs("test1", "expected1");
});

Deno.test("links without any servers - absolute", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Config options={[<ConfigWebserverRoot linkType="absolute" />]}>
      <Dir name="test2">
        <Dir name="aaa">
          <File name="A">
            <IdH1 name="a" />
            <IdA name="a">aa</IdA>
            <IdA name="b">bb</IdA>
            <IdA name="c">cc</IdA>
            <IdA name="d">dd</IdA>
          </File>
          <Dir name="bbb">
            <File name="B">
              <IdH1 name="b" />
              <IdA name="a">aa</IdA>
              <IdA name="b">bb</IdA>
              <IdA name="c">cc</IdA>
              <IdA name="d">dd</IdA>
            </File>
            <Dir name="ccc">
              <File name="C">
                <IdH1 name="c" />
                <IdA name="a">aa</IdA>
                <IdA name="b">bb</IdA>
                <IdA name="c">cc</IdA>
                <IdA name="d">dd</IdA>
              </File>
              <Dir name="dddddddddddddddddddd">
                <File name="D">
                  <IdH1 name="d" />
                  <IdA name="a">aa</IdA>
                  <IdA name="b">bb</IdA>
                  <IdA name="c">cc</IdA>
                  <IdA name="d">dd</IdA>
                </File>
                <Dir name="ee">
                  <Dir name="ff">
                    <Dir name="gg">
                      <Dir name="hh">
                        <Dir name="ii">
                          <File name="I">
                            <IdH1 name="i" />
                            <IdA name="a">aa</IdA>
                            <IdA name="i">ii</IdA>
                          </File>
                        </Dir>
                      </Dir>
                    </Dir>
                  </Dir>
                </Dir>
              </Dir>
            </Dir>
          </Dir>
        </Dir>
      </Dir>
    </Config>,
  );

  assertEquals(got !== null, true);
  await assertFs("test2", "expected2");
});

Deno.test("links without any servers - relative", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Config options={[<ConfigWebserverRoot linkType="relative" />]}>
      <Dir name="test3">
        <Dir name="aaa">
          <File name="A">
            <IdH1 name="a" />
            <IdA name="a">aa</IdA>
            <IdA name="b">bb</IdA>
            <IdA name="c">cc</IdA>
            <IdA name="d">dd</IdA>
          </File>
          <Dir name="bbb">
            <File name="B">
              <IdH1 name="b" />
              <IdA name="a">aa</IdA>
              <IdA name="b">bb</IdA>
              <IdA name="c">cc</IdA>
              <IdA name="d">dd</IdA>
            </File>
            <Dir name="ccc">
              <File name="C">
                <IdH1 name="c" />
                <IdA name="a">aa</IdA>
                <IdA name="b">bb</IdA>
                <IdA name="c">cc</IdA>
                <IdA name="d">dd</IdA>
              </File>
              <Dir name="dddddddddddddddddddd">
                <File name="D">
                  <IdH1 name="d" />
                  <IdA name="a">aa</IdA>
                  <IdA name="b">bb</IdA>
                  <IdA name="c">cc</IdA>
                  <IdA name="d">dd</IdA>
                </File>
                <Dir name="ee">
                  <Dir name="ff">
                    <Dir name="gg">
                      <Dir name="hh">
                        <Dir name="ii">
                          <File name="I">
                            <IdH1 name="i" />
                            <IdA name="a">aa</IdA>
                            <IdA name="i">ii</IdA>
                          </File>
                        </Dir>
                      </Dir>
                    </Dir>
                  </Dir>
                </Dir>
              </Dir>
            </Dir>
          </Dir>
        </Dir>
      </Dir>
    </Config>,
  );

  assertEquals(got !== null, true);
  await assertFs("test3", "expected3");
});

Deno.test("links with servers", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Dir name="test4">
      <Dir name="aaa">
        <ServerRoot url="https://a.org">
          <File name="A">
            <IdH1 name="a1" />
            <IdA name="a1">a1</IdA>
            <IdA name="b1">b1</IdA>
            <IdA name="a2">a2</IdA>
            <IdA name="b2">b2</IdA>
          </File>
          <Dir name="bbb">
            <File name="B">
              <IdH1 name="b1" />
              <IdA name="a1">a1</IdA>
              <IdA name="b1">b1</IdA>
              <IdA name="a2">a2</IdA>
              <IdA name="b2">b2</IdA>
            </File>
          </Dir>
        </ServerRoot>
      </Dir>
      <Dir name="aaa2">
        <ServerRoot url="https://a2.org/">
          <File name="A">
            <IdH1 name="a2" />
            <IdA name="a1">a1</IdA>
            <IdA name="b1">b1</IdA>
            <IdA name="a2">a2</IdA>
            <IdA name="b2">b2</IdA>
          </File>
          <Dir name="bbb">
            <File name="B">
              <IdH1 name="b2" />
              <IdA name="a1">a1</IdA>
              <IdA name="b1">b1</IdA>
              <IdA name="a2">a2</IdA>
              <IdA name="b2">b2</IdA>
            </File>
          </Dir>
        </ServerRoot>
      </Dir>
    </Dir>,
  );

  assertEquals(got !== null, true);
  await assertFs("test4", "expected4");
});
