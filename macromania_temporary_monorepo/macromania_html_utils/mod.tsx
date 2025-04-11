import { posixPath } from "./deps.ts";

import { Html, Link, LinkProps, Script, getAssetDirPhysicalPath, styleFile } from "./deps.ts";
import { Body } from "./deps.ts";
import { Title } from "./deps.ts";
import { hrefTo } from "./deps.ts";
import { DebuggingInformation } from "./deps.ts";
import { AProps } from "./deps.ts";
import { Meta } from "./deps.ts";
import { Head } from "./deps.ts";
import { createSubstate } from "./deps.ts";
import {
  A,
  absoluteOutFsPath,
  Colors,
  Context,
  createLogger,
  Expression,
  Expressions,
  resolveAssetToOutFsPath,
  ScriptProps,
  styleAssetPath,
  styleDebuggingInformation,
  TagProps,
} from "./deps.ts";

const l = createLogger("LoggerHtmlUtils");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerHtmlUtils };

type PerDependencyInformation = {
  // As expected by `resolveAssetToOutFsPath`.
  path: string[];
  // Map a resolve path string to a tag to put into the `<head>`.
  render: (path: string) => Expression;
  // The macro that added this dependency.
  debug: DebuggingInformation;
  // An optional error message to display if the asset does not exist.
  debugMessage?: string;
};

type HtmlUtilsState = {
  // `null` when outside any `<Html5>` macro.
  // Otherwise maps `Json.stringify(path)` to the `PerDependencyInformation`.
  dependencies: Map<string, PerDependencyInformation> | null;
  // Dependencies that were fully processed (and hence can be deleted from the
  // `dependencies` array but should not be added again).
  processed: Set<string>;
};

const [getState, setState] = createSubstate<HtmlUtilsState>(() => ({
  dependencies: null,
  processed: new Set(),
}));

/**
 * Register an asset as a dependency. It will be added to the HTML only once,
 * no matter how often you add dependencies of equal `dep` arrays (compared by
 * value, not by reference).
 *
 * @param ctx Execution context.
 * @param dep The dependency, as expected by [`resolveAssetToOutFsPath`](https://github.com/worm-blossom/macromania_assets).
 * @param render Map a resolve path string to a tag to put into the `<head>`.
 * @param debugMessage An optional message to log if the asset does not exist.
 */
export function addHtmlDependency(
  ctx: Context,
  dep: string[],
  render: (path: string) => Expression,
  debugMessage?: string,
) {
  const state = getState(ctx);
  const asValue = JSON.stringify(dep);

  if (state.dependencies === null) {
    l.warn(
      ctx,
      `Trying to add a html-utils dependency while not rendering the body tag of the ${
        Colors.yellow(`<Html5>`)
      } macro. Not adding any dependency.`,
    );
    l.logGroup(ctx, () => {
      l.warn(ctx, `Dependency: ${styleAssetPath(dep)}`);
      l.at(ctx);
    });
  } else {
    if (state.processed.has(asValue)) {
      return;
    }

    state.dependencies.set(asValue, {
      path: dep,
      render,
      debug: ctx.getCurrentDebuggingInformation(),
      debugMessage,
    });
  }
}

/**
 * Everything you need to register a dependency on a stylesheet.
 */
export type StylesheetDependencyInfo = {
  /**
   * The dependency path, as expected by [`resolveAssetToOutFsPath`](https://github.com/worm-blossom/macromania_assets).
   */
  dep: string[];
  /**
   * Props for the `<Link>` macro that is used to add the stylesheet.
   */
  linkProps?: LinkProps;
  /**
   * An optional message to log if the asset `dep` does not exist.
   */
  debugMessage?: string;
};

/**
 * Register a stylesheet asset as a dependency.
 */
export function addHtmlDependencyStylesheet(
  ctx: Context,
  dep: StylesheetDependencyInfo,
) {
  return addHtmlDependency(ctx, dep.dep, (path) => {
    const props = dep.linkProps ?? {};
    props.href = path;
    props.rel = "stylesheet";
    return Link(props);
  }, dep.debugMessage);
}

/**
 * Register a stylesheet asset as a dependency.
 */
export function StylesheetDependency(
  props: StylesheetDependencyInfo,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        addHtmlDependencyStylesheet(ctx, props);
        return "";
      }}
    />
  );
}

/**
 * Everything you need to register a dependency on a script.
 */
export type ScriptDependencyInfo = {
  /**
   * The dependency path, as expected by [`resolveAssetToOutFsPath`](https://github.com/worm-blossom/macromania_assets).
   */
  dep: string[];
  /**
   * Props for the `<Script>` macro that is used to add the script.
   */
  scriptProps?: ScriptProps;
  /**
   * An optional message to log if the asset `dep` does not exist.
   */
  debugMessage?: string;
};

/**
 * Register a js asset as a dependency.
 */
export function addHtmlDependencyScript(
  ctx: Context,
  dep: ScriptDependencyInfo,
) {
  return addHtmlDependency(ctx, dep.dep, (path) => {
    const props = dep.scriptProps ?? {};
    props.src = path;
    return Script(props);
  }, dep.debugMessage);
}

/**
 * Register a js asset as a dependency.
 */
export function ScriptDependency(
  props: ScriptDependencyInfo,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        addHtmlDependencyScript(ctx, props);
        return "";
      }}
    />
  );
}

/**
 * Props for the `<Html5>` macro.
 */
export type Html5Props = {
  /**
   * Props for the html tag, excluding children.
   */
  htmlProps?: TagProps;
  /**
   * Props for the head tag, excluding children.
   */
  headProps?: TagProps;
  /**
   * Expressions to add at the end of the `<head>` tag.
   */
  headContents?: Expressions;
  /**
   * Props for the body tag, excluding children.
   */
  bodyProps?: TagProps;
  /**
   * The body of the `<title>` tag, if any.
   */
  title?: Expressions;
};

/**
 * Create a minimal HTML5 document, with a head and a body.
 */
export function Html5(
  props: Html5Props & { children?: Expressions },
): Expression {
  const htmlPropsTmp = props.htmlProps ?? {};
  const headPropsTmp = props.headProps ?? {};
  const bodyPropsTmp = props.bodyProps ?? {};

  let prevState: HtmlUtilsState = undefined as unknown as HtmlUtilsState;
  const myState: HtmlUtilsState = {
    dependencies: new Map(),
    processed: new Set(),
  };

  return (
    <lifecycle pre={preBody} post={postBody}>
      <map fun={mapBody}>
        {props.children}
      </map>
    </lifecycle>
  );

  function preBody(ctx: Context) {
    prevState = getState(ctx);
    setState(ctx, myState);
  }

  function postBody(ctx: Context) {
    setState(ctx, prevState);
  }

  function mapBody(evaled: string, ctx: Context): Expression {
    return (
      <>
        {`<!doctype html>`}
        {Html({
          ...htmlPropsTmp,
          children: [
            Head({
              ...headPropsTmp,
              children: [
                <Meta charset="utf-8" />,
                props.title === undefined ? "" : <Title>{props.title}</Title>,
                renderDependencies(),
                <exps x={props.headContents} />,
              ],
            }),
            Body({ ...bodyPropsTmp, children: evaled }),
          ],
        })}
      </>
    );
  }

  function renderDependencies(): Expression {
    const resolvedDeps: Expression[] = [];

    return (
      <impure
        fun={(ctx) => {
          const state = getState(ctx);

          for (const [key, info] of state.dependencies!.entries()) {
            const resolved = resolveAssetToOutFsPath(ctx, info.path);

            if (resolved === null) {
              if (ctx.mustMakeProgress()) {
                const realDir = getAssetDirPhysicalPath(ctx);
                l.warn(ctx, `Failed to resolve an html-utils dependency:`);
                l.logGroup(ctx, () => {
                  l.warn(ctx, `Dependency: ${styleAssetPath(info.path)}`);
                  l.warn(
                    ctx,
                    `Dependency registered at ${
                      styleDebuggingInformation(info.debug)
                    }`,
                  );
                  if (info.debugMessage) {
                    l.warn(ctx, info.debugMessage);
                  }
                  l.warn(ctx, `The asset directory is located at ${styleFile(realDir)} and assets are looked up relative to there.`);
                  l.warn(ctx, `Your dependency was expected at ${styleFile(posixPath.join(realDir, ...info.path))}`);
                  l.warn(ctx, `If that file actually exists yet this errors, you probably need to modify ${Colors.yellow("assets")} prop of the ${Colors.yellow("Assets")} macro. Explaining that is out of scope for this warning, you'll need to look up how that one works elsewhere <3.`);
                  l.at(ctx);
                });
              } else {
                return null;
              }
            } else {
              resolvedDeps.push(
                info.render(hrefTo(ctx, absoluteOutFsPath(resolved))),
              );
              state.processed.add(key);
            }
          }

          for (const key of state.processed) {
            state.dependencies!.delete(key);
          }

          return state.dependencies!.size === 0 || ctx.mustMakeProgress()
            ? <exps x={resolvedDeps} />
            : null;
        }}
      />
    );
  }
}

/**
 * Create a hyperlink. First child is the display text, second child the url.
 */
export function Href(
  { aProps, children }: { aProps?: AProps; children: [Expression, Expression] },
): Expression {
  const aPropsTmp = aProps ?? {};
  aPropsTmp.href = children[1];
  return A({ ...aPropsTmp, children: children[0] });
}
