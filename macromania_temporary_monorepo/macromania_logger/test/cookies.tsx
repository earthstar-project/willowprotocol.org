import { Expression, Context } from "../deps.ts";
import { createLogger } from "../mod.tsx";

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