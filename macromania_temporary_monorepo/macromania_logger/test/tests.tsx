import { LoggingTarget } from "../deps.ts";
import { Config, Context } from "../deps.ts";
import { renderMessagePrefix } from "../devDeps.ts";
import { assertEquals } from "../devDeps.ts";
import { ConfigLoggers } from "../mod.tsx";
import { createLogger, didWarnOrWorse } from "../mod.tsx";
import { LoggerBakeCookies, BakeSomeCookies } from "./cookies.tsx";

function newLoggingBackend(): [LoggingTarget, () => string] {
  let str = "";

  return [
    {
      // deno-lint-ignore no-explicit-any
      log: (...data: any) => str = `${str};${data}`,
    },
    () => str,
  ];
}

Deno.test("log function works", async () => {
  const loggerA = createLogger("LoggerOptionsA");
  const loggerB = createLogger("LoggerOptionsB");
  const loggerC = createLogger("LoggerOptionsC");

  const [loggingBackend, getLoggedData] = newLoggingBackend();
  const ctx = new Context(loggingBackend);
  const got = await ctx.evaluate(
    <Config
      options={[
        <ConfigLoggers defaultLevel="info" />,
        <loggerA.ConfigMacro level="trace" />,
        <loggerB.ConfigMacro level="warn" />,
      ]}
    >
      <impure
        fun={(ctx: Context) => {
          loggerA.log(ctx, "debug", "a");
          loggerA.log(ctx, "trace", "a");
          loggerA.log(ctx, "info", "a");
          loggerA.log(ctx, "warn", "a");
          loggerA.log(ctx, "error", "a");
          loggerB.log(ctx, "debug", "b");
          loggerB.log(ctx, "trace", "b");
          loggerB.log(ctx, "info", "b");
          loggerB.log(ctx, "warn", "b");
          loggerB.log(ctx, "error", "b");
          loggerC.log(ctx, "debug", "c");
          loggerC.log(ctx, "trace", "c");
          loggerC.log(ctx, "info", "c");
          loggerC.log(ctx, "warn", "c");
          loggerC.log(ctx, "error", "c");
          return "";
        }}
      />
    </Config>,
  );
  assertEquals(got, "");
  assertEquals(
    getLoggedData(),
    `;${renderMessagePrefix("trace", 0)},a;${
      renderMessagePrefix("info", 0)
    },a;${renderMessagePrefix("warn", 0)},a;${
      renderMessagePrefix("error", 0)
    },a;${renderMessagePrefix("warn", 0)},b;${
      renderMessagePrefix("error", 0)
    },b;${renderMessagePrefix("info", 0)},c;${
      renderMessagePrefix("warn", 0)
    },c;${renderMessagePrefix("error", 0)},c`,
  );
});

Deno.test("logLevel functions work", async () => {
  const loggerA = createLogger("LoggerOptionsA");
  const loggerB = createLogger("LoggerOptionsB");
  const loggerC = createLogger("LoggerOptionsC");

  const [loggingBackend, getLoggedData] = newLoggingBackend();
  const ctx = new Context(loggingBackend);
  const got = await ctx.evaluate(
    <Config
      options={[
        <ConfigLoggers defaultLevel="info" />,
        <loggerA.ConfigMacro level="trace" />,
        <loggerB.ConfigMacro level="warn" />,
      ]}
    >
      <impure
        fun={(ctx: Context) => {
          loggerA.debug(ctx, "a");
          loggerA.trace(ctx, "a");
          loggerA.info(ctx, "a");
          loggerA.warn(ctx, "a");
          loggerA.error(ctx, "a");
          loggerB.debug(ctx, "b");
          loggerB.trace(ctx, "b");
          loggerB.info(ctx, "b");
          loggerB.warn(ctx, "b");
          loggerB.error(ctx, "b");
          loggerC.debug(ctx, "c");
          loggerC.trace(ctx, "c");
          loggerC.info(ctx, "c");
          loggerC.warn(ctx, "c");
          loggerC.error(ctx, "c");
          return "";
        }}
      />
    </Config>,
  );
  assertEquals(got, "");
  assertEquals(
    getLoggedData(),
    `;${renderMessagePrefix("trace", 0)},a;${
      renderMessagePrefix("info", 0)
    },a;${renderMessagePrefix("warn", 0)},a;${
      renderMessagePrefix("error", 0)
    },a;${renderMessagePrefix("warn", 0)},b;${
      renderMessagePrefix("error", 0)
    },b;${renderMessagePrefix("info", 0)},c;${
      renderMessagePrefix("warn", 0)
    },c;${renderMessagePrefix("error", 0)},c`,
  );
});

Deno.test("Log macro works", async () => {
  const loggerA = createLogger("LoggerOptionsA");
  const loggerB = createLogger("LoggerOptionsB");
  const loggerC = createLogger("LoggerOptionsC");

  const [loggingBackend, getLoggedData] = newLoggingBackend();
  const ctx = new Context(loggingBackend);
  const got = await ctx.evaluate(
    <Config
      options={[
        <ConfigLoggers defaultLevel="info" />,
        <loggerA.ConfigMacro level="trace" />,
        <loggerB.ConfigMacro level="warn" />,
      ]}
    >
      <impure
        fun={(ctx: Context) => {
          return (
            <>
              <loggerA.Log level="debug">a</loggerA.Log>
              <loggerA.Log level="trace">a</loggerA.Log>
              <loggerA.Log level="info">a</loggerA.Log>
              <loggerA.Log level="warn">a</loggerA.Log>
              <loggerA.Log level="error">a</loggerA.Log>
              <loggerB.Log level="debug">b</loggerB.Log>
              <loggerB.Log level="trace">b</loggerB.Log>
              <loggerB.Log level="info">b</loggerB.Log>
              <loggerB.Log level="warn">b</loggerB.Log>
              <loggerB.Log level="error">b</loggerB.Log>
              <loggerC.Log level="debug">c</loggerC.Log>
              <loggerC.Log level="trace">c</loggerC.Log>
              <loggerC.Log level="info">c</loggerC.Log>
              <loggerC.Log level="warn">c</loggerC.Log>
              <loggerC.Log level="error">c</loggerC.Log>
            </>
          );
        }}
      />
    </Config>,
  );
  assertEquals(got, "");
  assertEquals(
    getLoggedData(),
    `;${renderMessagePrefix("trace", 0)},a;${
      renderMessagePrefix("info", 0)
    },a;${renderMessagePrefix("warn", 0)},a;${
      renderMessagePrefix("error", 0)
    },a;${renderMessagePrefix("warn", 0)},b;${
      renderMessagePrefix("error", 0)
    },b;${renderMessagePrefix("info", 0)},c;${
      renderMessagePrefix("warn", 0)
    },c;${renderMessagePrefix("error", 0)},c`,
  );
});

Deno.test("LogLevel macros work", async () => {
  const loggerA = createLogger("LoggerOptionsA");
  const loggerB = createLogger("LoggerOptionsB");
  const loggerC = createLogger("LoggerOptionsC");

  const [loggingBackend, getLoggedData] = newLoggingBackend();
  const ctx = new Context(loggingBackend);
  const got = await ctx.evaluate(
    <Config
      options={[
        <ConfigLoggers defaultLevel="info" />,
        <loggerA.ConfigMacro level="trace" />,
        <loggerB.ConfigMacro level="warn" />,
      ]}
    >
      <impure
        fun={(ctx: Context) => {
          return (
            <>
              <loggerA.Debug>a</loggerA.Debug>
              <loggerA.Trace>a</loggerA.Trace>
              <loggerA.Info>a</loggerA.Info>
              <loggerA.Warn>a</loggerA.Warn>
              <loggerA.Error>a</loggerA.Error>
              <loggerB.Debug>b</loggerB.Debug>
              <loggerB.Trace>b</loggerB.Trace>
              <loggerB.Info>b</loggerB.Info>
              <loggerB.Warn>b</loggerB.Warn>
              <loggerB.Error>b</loggerB.Error>
              <loggerC.Debug>c</loggerC.Debug>
              <loggerC.Trace>c</loggerC.Trace>
              <loggerC.Info>c</loggerC.Info>
              <loggerC.Warn>c</loggerC.Warn>
              <loggerC.Error>c</loggerC.Error>
            </>
          );
        }}
      />
    </Config>,
  );
  assertEquals(got, "");
  assertEquals(
    getLoggedData(),
    `;${renderMessagePrefix("trace", 0)},a;${
      renderMessagePrefix("info", 0)
    },a;${renderMessagePrefix("warn", 0)},a;${
      renderMessagePrefix("error", 0)
    },a;${renderMessagePrefix("warn", 0)},b;${
      renderMessagePrefix("error", 0)
    },b;${renderMessagePrefix("info", 0)},c;${
      renderMessagePrefix("warn", 0)
    },c;${renderMessagePrefix("error", 0)},c`,
  );
});

Deno.test("default level is warn", async () => {
  const loggerA = createLogger("LoggerOptionsA");

  const [loggingBackend, getLoggedData] = newLoggingBackend();
  const ctx = new Context(loggingBackend);
  const got = await ctx.evaluate(
    <Config
      options={[]}
    >
      <impure
        fun={(ctx: Context) => {
          loggerA.debug(ctx, "a");
          loggerA.trace(ctx, "a");
          loggerA.info(ctx, "a");
          loggerA.warn(ctx, "a");
          loggerA.error(ctx, "a");
          return "";
        }}
      />
    </Config>,
  );
  assertEquals(got, "");
  assertEquals(
    getLoggedData(),
    `;${renderMessagePrefix("warn", 0)},a;${renderMessagePrefix("error", 0)},a`,
  );
});

Deno.test("reset logger level to default level", async () => {
  const loggerA = createLogger("LoggerOptionsA");

  const [loggingBackend, getLoggedData] = newLoggingBackend();
  const ctx = new Context(loggingBackend);
  const got = await ctx.evaluate(
    <Config
      options={[
        <ConfigLoggers defaultLevel="error" />,
        <loggerA.ConfigMacro level="warn" />,
      ]}
    >
      <impure
        fun={(ctx: Context) => {
          loggerA.debug(ctx, "a");
          loggerA.trace(ctx, "a");
          loggerA.info(ctx, "a");
          loggerA.warn(ctx, "a");
          loggerA.error(ctx, "a");
          return "";
        }}
      />
      <Config options={[<loggerA.ConfigMacro />]}>
        <impure
          fun={(ctx: Context) => {
            loggerA.debug(ctx, "a");
            loggerA.trace(ctx, "a");
            loggerA.info(ctx, "a");
            loggerA.warn(ctx, "a");
            loggerA.error(ctx, "a");
            return "";
          }}
        />
      </Config>
    </Config>,
  );
  assertEquals(got, "");
  assertEquals(
    getLoggedData(),
    `;${renderMessagePrefix("warn", 0)},a;${
      renderMessagePrefix("error", 0)
    },a;${renderMessagePrefix("error", 0)},a`,
  );
});

Deno.test("readme example", async () => {
  const [loggingBackend, getLoggedData] = newLoggingBackend();
  const ctx = new Context(loggingBackend);
  const got = await ctx.evaluate(
    <Config
      options={[
        <LoggerBakeCookies level="debug" />,
      ]}
    >
      <BakeSomeCookies />
    </Config>,
  );
  assertEquals(got, "");
  assertEquals(
    getLoggedData(),
    `;${renderMessagePrefix("trace", 0)},Preheating oven.;${
      renderMessagePrefix("warn", 0)
    },Reaching critical temperature.;${
      renderMessagePrefix("error", 0)
    },The cookies are burnt.;${
      renderMessagePrefix("error", 1)
    },To prevent burning the cookies:;${
      renderMessagePrefix("error", 1)
    },How about setting an alarm, young novice?;${
      renderMessagePrefix("info", 0)
    },Do try again though.;${
      renderMessagePrefix("info", 0)
    },Cookies are great, after all.;${
      renderMessagePrefix("info", 1)
    },Everything in this closure is indented.;${
      renderMessagePrefix("info", 2)
    },You can nest groupings, by the way.;${
      renderMessagePrefix("info", 2)
    },Obviously.;${renderMessagePrefix("trace", 1)},Back to less indentation`,
  );
});

Deno.test("didWarnOrWorse", async () => {
  await (async () => {
    const loggerA = createLogger("LoggerOptionsA");

    const [loggingBackend, getLoggedData] = newLoggingBackend();
    const ctx = new Context(loggingBackend);
    const got = await ctx.evaluate(
      <Config
        options={[
          <LoggerBakeCookies level="debug" />,
        ]}
      >
        <impure fun={(ctx) => <loggerA.Info></loggerA.Info>} />
      </Config>,
    );
    assertEquals(got, "");
    assertEquals(didWarnOrWorse(ctx), false);
  })();

  await (async () => {
    const loggerA = createLogger("LoggerOptionsA");

    const [loggingBackend, getLoggedData] = newLoggingBackend();
    const ctx = new Context(loggingBackend);
    const got = await ctx.evaluate(
      <Config
        options={[
          <LoggerBakeCookies level="debug" />,
        ]}
      >
        <impure fun={(ctx) => <loggerA.Warn></loggerA.Warn>} />
      </Config>,
    );
    assertEquals(got, "");
    assertEquals(didWarnOrWorse(ctx), true);
  })();

  await (async () => {
    const loggerA = createLogger("LoggerOptionsA");

    const [loggingBackend, getLoggedData] = newLoggingBackend();
    const ctx = new Context(loggingBackend);
    const got = await ctx.evaluate(
      <Config
        options={[
          <LoggerBakeCookies level="debug" />,
        ]}
      >
        <impure fun={(ctx) => <loggerA.Error></loggerA.Error>} />
      </Config>,
    );
    assertEquals(got, "");
    assertEquals(didWarnOrWorse(ctx), true);
  })();

  await (async () => {
    const loggerA = createLogger("LoggerOptionsA");

    const [loggingBackend, getLoggedData] = newLoggingBackend();
    const ctx = new Context(loggingBackend);
    const got = await ctx.evaluate(
      <Config
        options={[
          <LoggerBakeCookies level="error" />,
        ]}
      >
        <impure fun={(ctx) => <loggerA.Warn></loggerA.Warn>} />
      </Config>,
    );
    assertEquals(got, "");
    assertEquals(didWarnOrWorse(ctx), true);
  })();

  await (async () => {
    const loggerA = createLogger("LoggerOptionsA");

    const [loggingBackend, getLoggedData] = newLoggingBackend();
    const ctx = new Context(loggingBackend);
    const got = await ctx.evaluate(
      <Config
        options={[
          <LoggerBakeCookies level="error" />,
        ]}
      >
        <impure fun={(ctx) => <loggerA.Error></loggerA.Error>} />
      </Config>,
    );
    assertEquals(got, "");
    assertEquals(didWarnOrWorse(ctx), true);
  })();
});
