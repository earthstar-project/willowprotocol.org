# Macromania Logger

A logging framework for [Macromania](https://github.com/worm-blossom/macromania)
macros. Users can [configure](https://github.com/worm-blossom/macromania-config)
a global logging level, and they can configure individual packages with
different logging levels.

```tsx
<Config
    options={[
    <ConfigLoggers defaultLevel="info" />, {/* "warn" if left unspecified */}
    <LoggerBakeCookies level="trace" />,
    <LoggerFeedCat level="warn" />,
    ]}
>
    <CleanRoom /> {/* uses default logging level: logs info, warn, and error messages */}
    <BakeSomeCookies /> {/* logs trace, info, warn, and error messages */}
    <FeedTheCat /> {/* logs warn, and error messages */}
</Config>
```

For macro developers, this package offers a single function: `createLogger` returns a `Logger`, which is a collection of functions and macros for logging at different logging levels. Configuration of these loggers is handled transparently by macromania-logger.

Here is a demonstration of how macro authors obtain and use loggers.

```tsx
// The argument is the name of the config macro for this logger, as it will
// appear in stack traces.
const logger = createLogger("LoggerBakeCookies");

// export the config macro.
const LoggerBakeCookies = logger.ConfigMacro;
export {LoggerBakeCookies};

// A macro that uses the freshly created logger.
export function BakeSomeCookies(): Expression {
    return <>
        <logger.Trace>Preheating oven.</logger.Trace>
        <logger.Warn>Reaching critical temperature.</logger.Warn>
        {/* Can also log with dynamically selected logging level. */}
        <logger.Log level="error">The cookies are burnt.</logger.Log>
        {/* All logging inside this will be grouped via indentation. */}
        <logger.LogGroup>
            <logger.Error>To prevent burning the cookies:</logger.Error>
            <logger.Error>How about setting an alarm, young novice?</logger.Error>
        </logger.LogGroup>

        {/* The logger also provides functions for logging */}
        <impure fun={(ctx: Context) => {
            logger.info(ctx, "Do try again though.");
            logger.log(ctx, "info", "Cookies are great, after all.");
            logger.logGroup(ctx, () => {
                logger.info(ctx, "Everything in this closure is indented.");
                logger.logGroup(ctx, () => {
                    logger.info(ctx, "You can nest groupings, by the way.");
                    logger.info(ctx, "Obviously.");
                });
                logger.trace(ctx, "Back to less indentation");
            });
            return "";
        }} />
    </>;
}
```

The `<BakeSomeCookies />` macro then produces the following log:

```
[trace] Preheating oven.
[warn]  Reaching critical temperature.
[error] The cookies are burnt.
[error]     To prevent burning the cookies:
[error]     How about setting an alarm, young novice?
[info]  Do try again though.
[info]  Cookies are great, after all.
[info]      Everything in this closure is indented.
[info]          You can nest groupings, by the way.
[info]          Obviously.
[trace]     Back to less indentation
```