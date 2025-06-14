import { Config, ConfigWebserverRoot, styleAssetPath } from "./deps.ts";
import {
  absoluteOutFsPath,
  Cd,
  createConfigOptions,
  ScriptDependencyInfo,
  StylesheetDependencyInfo,
  TagProps,
} from "./deps.ts";
import {
  addHtmlDependencyScript,
  addHtmlDependencyStylesheet,
  Colors,
  Context,
  createLogger,
  createSubstate,
  Expression,
  Expressions,
  File,
  Html5,
} from "./deps.ts";

const l = createLogger("LoggerPreviews");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerPreviews };

export type PreviewsConfig = {
  /**
   * Absolute path in the OutFs to the directory in which to place the preview
   * sites.
   */
  previewPath?: string[];
  /**
   * Css dependencies to add to all preview pages.
   */
  cssDeps?: StylesheetDependencyInfo[];
  /**
   * JavaScript dependencies to add to all preview pages.
   */
  jsDeps?: ScriptDependencyInfo[];
};

const [
  getConfig,
  ConfigPreviews,
] = createConfigOptions<PreviewsConfig, PreviewsConfig>(
  "ConfigPreviews",
  () => ({
    previewPath: undefined,
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.previewPath !== undefined) {
      newValue.previewPath = update.previewPath;
    }
    if (update.cssDeps !== undefined) {
      newValue.cssDeps = update.cssDeps;
    }
    if (update.jsDeps !== undefined) {
      newValue.jsDeps = update.jsDeps;
    }

    return newValue;
  },
);
export { ConfigPreviews };

type PreviewsState = {
  /**
   * A map of previews to create. The value is true for *weak* previews.
   * Weak previews do not conflict with being added multiple times.
   */
  previews: Map<PreviewInfo, boolean>;
  /**
   * Css dependencies to add to the previews.
   */
  cssDeps: StylesheetDependencyInfo[];
  /**
   * JavaScript dependencies to add to the previews.
   */
  jsDeps: ScriptDependencyInfo[];
};

type PreviewInfo = {
  /**
   * <name>.html becomes the name of the preview page.
   */
  name: string;
  /**
   * Css dependencies to add to this preview.
   */
  cssDeps?: StylesheetDependencyInfo[];
  /**
   * JavaScript dependencies to add to this preview.
   */
  jsDeps?: ScriptDependencyInfo[];
  /**
   * Props for the html tag, excluding children.
   */
  htmlProps?: TagProps;
  /**
   * Props for the head tag, excluding children.
   */
  headProps?: TagProps;
  /**
   * Props for the body tag, excluding children.
   */
  bodyProps?: TagProps;
};

const [getState, setState] = createSubstate<null | PreviewsState>(() => null);

/**
 * A stack of wrapper functions. When creating a preview page, pass the preview expression through the last function, the result throught the second-to-last, etc, to generated the final expression that yields the preview page.
 */
const [getStateWrapper, setStateWrapper] = createSubstate<
  ((ctx: Context, p: Expression, info: PreviewInfo) => Expression)[]
>(() => []);

/**
 * Create a preview scope.
 */
export function PreviewScope(
  { children, cssDeps, jsDeps }: {
    children?: Expressions;
    cssDeps?: StylesheetDependencyInfo[];
    jsDeps?: ScriptDependencyInfo[];
  },
): Expression {
  let previousState: null | PreviewsState = null;

  const myState: PreviewsState = {
    previews: new Map(),
    cssDeps: cssDeps ?? [],
    jsDeps: jsDeps ?? [],
  };

  function pre(ctx: Context) {
    previousState = getState(ctx);
    setState(ctx, myState);
  }

  function post(ctx: Context) {
    setState(ctx, previousState);

    // Any css and js dependencies that got registered in this preview scope should also be registered in the parent scope (which will transitievly extend to all ancestors).
    for (const cssDep of myState.cssDeps) {
      if (previousState && previousState.cssDeps.indexOf(cssDep) === -1) {
        previousState.cssDeps.push(cssDep);
      }
    }
    for (const jsDep of myState.jsDeps) {
      if (previousState && previousState.jsDeps.indexOf(jsDep) === -1) {
        previousState.jsDeps.push(jsDep);
      }
    }
  }

  function createPreviews(evaled: string, ctx: Context): Expression {
    const previewsState: PreviewsState = getState(ctx)!;
    const config = getConfig(ctx);

    if (config.previewPath === undefined) {
      l.error(
        ctx,
        `Tried to create a preview page, but no output directory was configured.`,
      );
      l.logGroup(ctx, () => {
        l.error(
          ctx,
          `Use the ${
            Colors.yellow(`<ConfigPreviews previewPath={["some", "path"]}/>`)
          } config macro.`,
        );
      });
      return ctx.halt();
    }

    const exps: Expression[] = [evaled];

    for (const [p, weak] of previewsState.previews) {
      const htmlPropsTmp = p.htmlProps ?? {};
      const headPropsTmp = p.headProps ?? {};
      const bodyPropsTmp = { ...p.bodyProps };
      if (bodyPropsTmp.clazz === undefined) {
        bodyPropsTmp.clazz = "isPreview";
      } else if (Array.isArray(bodyPropsTmp.clazz)) {
        bodyPropsTmp.clazz = [...bodyPropsTmp.clazz, "isPreview"];
      } else {
        bodyPropsTmp.clazz = [bodyPropsTmp.clazz, "isPreview"];
      }

      const fileName = `${p.name}.html`;

      const wrappers = getStateWrapper(ctx);
      let finalPreview: Expression = evaled;
      for (let i = wrappers.length - 1; i >= 0; i--) {
        finalPreview = wrappers[i](ctx, finalPreview, p);
      }

      exps.push(
        <omnomnom>
          <Cd path={absoluteOutFsPath(config.previewPath)} create>
            <File name={fileName} mode={weak ? "placid" : "timid"}>
              <Html5
                htmlProps={htmlPropsTmp}
                headProps={headPropsTmp}
                bodyProps={bodyPropsTmp}
                title={`Preview ${p.name}`}
              >
                <impure
                  fun={(ctx) => {
                    for (const dep of config.cssDeps ?? []) {
                      addHtmlDependencyStylesheet(ctx, dep);
                    }
                    for (const dep of config.jsDeps ?? []) {
                      addHtmlDependencyScript(ctx, dep);
                    }

                    for (const dep of previewsState.cssDeps) {
                      addHtmlDependencyStylesheet(ctx, dep);
                    }
                    for (const dep of previewsState.jsDeps) {
                      addHtmlDependencyScript(ctx, dep);
                    }

                    for (const dep of p.cssDeps ?? []) {
                      addHtmlDependencyStylesheet(ctx, dep);
                    }
                    for (const dep of p.jsDeps ?? []) {
                      addHtmlDependencyScript(ctx, dep);
                    }

                    return "";
                  }}
                />
                {finalPreview}
              </Html5>
            </File>
          </Cd>
        </omnomnom>,
      );
    }

    return <exps x={exps} />;
  }

  return (
    <lifecycle pre={pre} post={post}>
      <Config options={[<ConfigWebserverRoot linkType="absolute" />]}>
        <map fun={createPreviews}>
          <exps x={children} />
        </map>
      </Config>
    </lifecycle>
  );
}

/**
 * Register a preview for within the current preview scope.
 * Warns if there is no current preview scope.
 *
 * If `weak` is true (it defaults to false), this does nothing if a preview of
 * this name had already been created.
 */
export function registerPreview(ctx: Context, p: PreviewInfo, weak = false) {
  const state = getState(ctx);

  if (state === null) {
    l.warn(
      ctx,
      `Tried to create a preview ${
        stylePreviewName(p.name)
      }, but there was no surrounding preview scope.`,
    );
    l.at(ctx);
  } else {
    state.previews.set(p, weak);
  }
}

/**
 * Register a preview for within the current preview scope, return whether
 * there was a surrounding preview scope. Does not log anything.
 *
 * If `weak` is true (it defaults to false), this does nothing if a preview of
 * this name had already been created.
 */
export function tryRegisterPreview(
  ctx: Context,
  p: PreviewInfo,
  weak = false,
): boolean {
  const state = getState(ctx);

  if (state !== null) {
    state.previews.set(p, weak);
    return true;
  } else {
    return false;
  }
}

/**
 * A drop-in replacement for {@linkcode addHtmlDependencyStylesheet} that also
 * adds the dependency to any previews that include the call.
 */
export function dependencyCss(
  ctx: Context,
  dep: StylesheetDependencyInfo,
) {
  const state = getState(ctx);

  if (state !== null) {
    state.cssDeps.push(dep);
  }

  return addHtmlDependencyStylesheet(ctx, dep);
}

/**
 * A drop-in replacement for {@linkcode StylesheetDependency} that also
 * adds the dependency to any previews that include the call.
 */
export function CssDependency(
  props: StylesheetDependencyInfo,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        dependencyCss(ctx, props);
        return "";
      }}
    />
  );
}

/**
 * A drop-in replacement for {@linkcode addHtmlDependencyScript} that also
 * adds the dependency to any previews that include the call.
 */
export function dependencyJs(
  ctx: Context,
  dep: ScriptDependencyInfo,
) {
  const state = getState(ctx);

  if (state !== null) {
    state.jsDeps.push(dep);
  }

  return addHtmlDependencyScript(ctx, dep);
}

/**
 * A drop-in replacement for {@linkcode ScriptDependency} that also
 * adds the dependency to any previews that include the call.
 */
export function JsDependency(
  props: ScriptDependencyInfo,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        dependencyJs(ctx, props);
        return "";
      }}
    />
  );
}

/**
 * Add a css dependency to all preview pages in the current scope.
 */
export function previewScopeDependencyCss(
  ctx: Context,
  dep: StylesheetDependencyInfo,
  noWarnIfNoScope = false,
) {
  const state = getState(ctx);

  if (state === null) {
    if (!noWarnIfNoScope) {
      l.warn(
        ctx,
        `Tried to add a css dependency ${
          styleAssetPath(dep.dep)
        } to the surrounding preview scope, but there was no surrounding preview scope.`,
      );
      l.at(ctx);
    }
  } else {
    state.cssDeps.push(dep);
  }
}

/**
 * Add a js dependency to all preview pages in the current scope.
 */
export function previewScopeDependencyJs(
  ctx: Context,
  dep: ScriptDependencyInfo,
  noWarnIfNoScope = false,
) {
  const state = getState(ctx);

  if (state === null) {
    if (!noWarnIfNoScope) {
      l.warn(
        ctx,
        `Tried to add a js dependency ${
          styleAssetPath(dep.dep)
        } to the surrounding preview scope, but there was no surrounding preview scope.`,
      );
      l.at(ctx);
    }
  } else {
    state.jsDeps.push(dep);
  }
}

/**
 * All previews created as children of this macro apply the wrapper function to determine the final preview page.
 */
export function PreviewScopePushWrapper(
  { wrapper, children }: {
    wrapper: (ctx: Context, exp: Expression, info: PreviewInfo) => Expression;
    children?: Expressions;
  },
): Expression {
  return (
    <lifecycle
      pre={(ctx) => {
        const wrappers = getStateWrapper(ctx);
        wrappers.push(wrapper);
      }}
      post={(ctx) => {
        const wrappers = getStateWrapper(ctx);
        wrappers.pop();
      }}
    >
      <exps x={children} />
    </lifecycle>
  );
}

/**
 * All previews created as children of this macro pop the most recently added wrapper function.
 */
export function PreviewScopePopWrapper(
  { children }: {
    children?: Expressions;
  },
): Expression {
  let old:
    | ((ctx: Context, exp: Expression, info: PreviewInfo) => Expression)
    | undefined = undefined;
  return (
    <lifecycle
      pre={(ctx) => {
        const wrappers = getStateWrapper(ctx);
        old = wrappers.pop();
      }}
      post={(ctx) => {
        const wrappers = getStateWrapper(ctx);
        if (old !== undefined) {
          wrappers.push(old);
        }
      }}
    >
      <exps x={children} />
    </lifecycle>
  );
}

export function stylePreviewName(name: string): string {
  return Colors.brightYellow(name);
}

/**
 * Retrieve the value of the `previewPath` config option, return null if none was set.
 */
export function tryGetPreviewPath(ctx: Context): string[] | null {
  const config = getConfig(ctx);

  return config.previewPath === undefined ? null : [...config.previewPath];
}

/**
 * Retrieve the value of the `previewPath` config option, error if none was set.
 */
export function getPreviewPath(ctx: Context): string[] {
  const config = getConfig(ctx);

  if (config.previewPath === undefined) {
    l.error(
      ctx,
      `Tried to obtain the path for previews, but no output directory was configured.`,
    );
    l.logGroup(ctx, () => {
      l.error(
        ctx,
        `Use the ${
          Colors.yellow(`<ConfigPreviews previewPath={["some", "path"]}/>`)
        } config macro.`,
      );
    });
    ctx.halt();
  }

  return [...config.previewPath!];
}
