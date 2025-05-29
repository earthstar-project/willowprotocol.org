import {
  ConfigWebserverRoot,
  hrefTo,
  serverMount,
  serverPath,
  ServerRoot,
  serverUrl,
} from "../mod.tsx";
import {
  Config,
  didWarnOrWorse,
  Dir,
  Expression,
  File,
  OutFsPath,
} from "../deps.ts";
import { Context } from "../deps.ts";
import { assertEquals, assertFs, join } from "../devDeps.ts";

type ExpectedNode = ExpectedDir | string;

type ExpectedDir = {
  name: string;
  node: ExpectedNode;
}[];

function assertFsNode(path: string, expected: ExpectedNode, del = true) {
  if (typeof expected === "string") {
    assertEquals(Deno.readTextFileSync(path), expected);
    if (del) {
      Deno.removeSync(path);
    }
  } else {
    assertEquals(Deno.statSync(path).isDirectory, true);
    for (const node of expected) {
      assertFsNode(join(path, node.name), node.node, del);
    }
    Deno.removeSync(path);
  }
}

Deno.test("webserver root basics", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <Dir name="aaa">
      <Dir name="bbb">
        <Dir name="ccc">
          <ServerRoot url="foo">
            <Dir name="ddd">
              <File name="txt">
                <impure
                  fun={(ctx) => {
                    return (
                      <>
                        {serverUrl(ctx)}::
                        {serverMount(ctx).join(",")}::
                        {serverPath(ctx).join(",")}
                      </>
                    );
                  }}
                />
              </File>
            </Dir>
          </ServerRoot>
        </Dir>
        <File name="txt2">
          <impure
            fun={(ctx) => {
              return (
                <>
                  {`${serverUrl(ctx)}`}::
                  {serverMount(ctx).join(",")}::
                  {serverPath(ctx).join(",")}
                </>
              );
            }}
          />
        </File>
      </Dir>
      <Dir name="zzz">
        <ServerRoot url="bar">
          <File name="txt">
            <impure
              fun={(ctx) => {
                return (
                  <>
                    {serverUrl(ctx)}::
                    {serverMount(ctx).join(",")}::
                    {serverPath(ctx).join(",")}
                  </>
                );
              }}
            />
          </File>
        </ServerRoot>
      </Dir>
    </Dir>,
  );
  assertEquals(got != null, true);

  const expected = [
    {
      name: "bbb",
      node: [
        {
          name: "ccc",
          node: [
            {
              name: "ddd",
              node: [
                {
                  name: "txt",
                  node: "foo::aaa,bbb,ccc::ddd",
                },
              ],
            },
          ],
        },
        {
          name: "txt2",
          node: `null::::aaa,bbb`,
        },
      ],
    },
    {
      name: "zzz",
      node: [
        {
          name: "txt",
          node: `bar::aaa,zzz::`,
        },
      ],
    },
  ];
  assertFsNode("aaa", expected);
});

Deno.test("nested webservers warn", async () => {
  const ctx = new Context();
  const got = await ctx.evaluate(
    <ServerRoot url="foo">
      <ServerRoot url="bar">
        this should warn
      </ServerRoot>
    </ServerRoot>,
  );
  assertEquals(got, "this should warn");
  assertEquals(didWarnOrWorse(ctx), true);
});

function Link({ path }: { path: string[] }): Expression {
  return (
    <impure
      fun={(ctx) => {
        return hrefTo(ctx, { relativity: -1, components: path });
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
          <Link path={["test1", "aaa"]} />:
          <Link path={["test1", "aaa", "bbb"]} />:
          <Link path={["test1", "aaa", "bbb", "ccc"]} />:
          <Link path={["test1", "aaa", "bbb", "ccc", "dddddddddddddddddddd"]} />
        </File>
        <Dir name="bbb">
          <File name="B">
            <Link path={["test1", "aaa"]} />:
            <Link path={["test1", "aaa", "bbb"]} />:
            <Link path={["test1", "aaa", "bbb", "ccc"]} />:
            <Link
              path={["test1", "aaa", "bbb", "ccc", "dddddddddddddddddddd"]}
            />
          </File>
          <Dir name="ccc">
            <File name="C">
              <Link path={["test1", "aaa"]} />:
              <Link path={["test1", "aaa", "bbb"]} />:
              <Link path={["test1", "aaa", "bbb", "ccc"]} />:
              <Link
                path={["test1", "aaa", "bbb", "ccc", "dddddddddddddddddddd"]}
              />
            </File>
            <Dir name="dddddddddddddddddddd">
              <File name="D">
                <Link path={["test1", "aaa"]} />:
                <Link path={["test1", "aaa", "bbb"]} />:
                <Link path={["test1", "aaa", "bbb", "ccc"]} />:
                <Link
                  path={["test1", "aaa", "bbb", "ccc", "dddddddddddddddddddd"]}
                />
              </File>
              <Dir name="ee">
                <Dir name="ff">
                  <Dir name="gg">
                    <Dir name="hh">
                      <Dir name="ii">
                        <File name="I">
                          <Link path={["test1", "aaa"]} />:
                          <Link path={["test1", "aaa", "bbb"]} />:
                          <Link path={["test1", "aaa", "bbb", "ccc"]} />:
                          <Link
                            path={[
                              "test1",
                              "aaa",
                              "bbb",
                              "ccc",
                              "dddddddddddddddddddd",
                            ]}
                          />
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
            <Link path={["test2", "aaa"]} />:
            <Link path={["test2", "aaa", "bbb"]} />:
            <Link path={["test2", "aaa", "bbb", "ccc"]} />:
            <Link
              path={["test2", "aaa", "bbb", "ccc", "dddddddddddddddddddd"]}
            />
          </File>
          <Dir name="bbb">
            <File name="B">
              <Link path={["test2", "aaa"]} />:
              <Link path={["test2", "aaa", "bbb"]} />:
              <Link path={["test2", "aaa", "bbb", "ccc"]} />:
              <Link
                path={["test2", "aaa", "bbb", "ccc", "dddddddddddddddddddd"]}
              />
            </File>
            <Dir name="ccc">
              <File name="C">
                <Link path={["test2", "aaa"]} />:
                <Link path={["test2", "aaa", "bbb"]} />:
                <Link path={["test2", "aaa", "bbb", "ccc"]} />:
                <Link
                  path={["test2", "aaa", "bbb", "ccc", "dddddddddddddddddddd"]}
                />
              </File>
              <Dir name="dddddddddddddddddddd">
                <File name="D">
                  <Link path={["test2", "aaa"]} />:
                  <Link path={["test2", "aaa", "bbb"]} />:
                  <Link path={["test2", "aaa", "bbb", "ccc"]} />:
                  <Link
                    path={[
                      "test2",
                      "aaa",
                      "bbb",
                      "ccc",
                      "dddddddddddddddddddd",
                    ]}
                  />
                </File>
                <Dir name="ee">
                  <Dir name="ff">
                    <Dir name="gg">
                      <Dir name="hh">
                        <Dir name="ii">
                          <File name="I">
                            <Link path={["test2", "aaa"]} />:
                            <Link path={["test2", "aaa", "bbb"]} />:
                            <Link path={["test2", "aaa", "bbb", "ccc"]} />:
                            <Link
                              path={[
                                "test2",
                                "aaa",
                                "bbb",
                                "ccc",
                                "dddddddddddddddddddd",
                              ]}
                            />
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
            <Link path={["test3", "aaa"]} />:
            <Link path={["test3", "aaa", "bbb"]} />:
            <Link path={["test3", "aaa", "bbb", "ccc"]} />:
            <Link path={["test3", "aaa", "bbb", "ccc", "ddd"]} />
          </File>
          <Dir name="bbb">
            <File name="B">
              <Link path={["test3", "aaa"]} />:
              <Link path={["test3", "aaa", "bbb"]} />:
              <Link path={["test3", "aaa", "bbb", "ccc"]} />:
              <Link path={["test3", "aaa", "bbb", "ccc", "ddd"]} />
            </File>
            <Dir name="ccc">
              <File name="C">
                <Link path={["test3", "aaa"]} />:
                <Link path={["test3", "aaa", "bbb"]} />:
                <Link path={["test3", "aaa", "bbb", "ccc"]} />:
                <Link path={["test3", "aaa", "bbb", "ccc", "ddd"]} />
              </File>
              <Dir name="dddddddddddddddddddd">
                <File name="D">
                  <Link path={["test3", "aaa"]} />:
                  <Link path={["test3", "aaa", "bbb"]} />:
                  <Link path={["test3", "aaa", "bbb", "ccc"]} />:
                  <Link path={["test3", "aaa", "bbb", "ccc", "ddd"]} />
                </File>
                <Dir name="ee">
                  <Dir name="ff">
                    <Dir name="gg">
                      <Dir name="hh">
                        <Dir name="ii">
                          <File name="I">
                            <Link path={["test3", "aaa"]} />:
                            <Link path={["test3", "aaa", "bbb"]} />:
                            <Link path={["test3", "aaa", "bbb", "ccc"]} />:
                            <Link
                              path={["test3", "aaa", "bbb", "ccc", "ddd"]}
                            />
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
            <Link path={["test4", "aaa"]} />;
            <Link path={["test4", "aaa", "bbb"]} />;
            <Link path={["test4", "aaa2"]} />;
            <Link path={["test4", "aaa2", "bbb"]} />
          </File>
          <Dir name="bbb">
            <File name="B">
              <Link path={["test4", "aaa"]} />;
              <Link path={["test4", "aaa", "bbb"]} />;
              <Link path={["test4", "aaa2"]} />;
              <Link path={["test4", "aaa2", "bbb"]} />
            </File>
          </Dir>
        </ServerRoot>
      </Dir>
      <Dir name="aaa2">
        <ServerRoot url="https://a2.org/">
          <File name="A">
            <Link path={["test4", "aaa"]} />;
            <Link path={["test4", "aaa", "bbb"]} />;
            <Link path={["test4", "aaa2"]} />;
            <Link path={["test4", "aaa2", "bbb"]} />
          </File>
          <Dir name="bbb">
            <File name="B">
              <Link path={["test4", "aaa"]} />;
              <Link path={["test4", "aaa", "bbb"]} />;
              <Link path={["test4", "aaa2"]} />;
              <Link path={["test4", "aaa2", "bbb"]} />
            </File>
          </Dir>
        </ServerRoot>
      </Dir>
    </Dir>,
  );

  assertEquals(got !== null, true);
  await assertFs("test4", "expected4");
});
