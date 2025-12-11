import {
  Context,
  createConfigOptions,
  createLogger,
  createSubstate,
  DebuggingInformation,
  Expression,
  Expressions,
  expressions,
  join,
  outCwd,
  outFilename,
  OutFsPath,
  relative,
  resolveRelativePath,
  styleDebuggingInformation,
} from "./deps.ts";

const l = createLogger("LoggerServerRoot");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerServerRoot };

export type WebserverRootConfig = {
  /**
   * Whether to always create relative links when possible, always create
   * absolute links, or to always choose the shorter link (default).
   */
  linkType: "relative" | "absolute" | "shorter";
  /**
   * Whether to include the domain even when creating a link within the same page. Defaults to false.
   */
  alwaysUseDomain?: boolean;
};

const [getConfig, ConfigWebserverRoot] = createConfigOptions<
  WebserverRootConfig,
  WebserverRootConfig
>(
  "ConfigWebserverRoot",
  () => ({ linkType: "shorter", alwaysUseDomain: false }),
  (old, update) => update,
);
export { ConfigWebserverRoot };

type Servers = {
  servers: Map<string, ServerInfo>;
};

type ServerInfo = {
  url: string;
  /**
   * Absolute path in the OutFs to the macro site.
   */
  mount: string[];
  definedAt: DebuggingInformation;
};

const [getState, setState] = createSubstate<Servers>(() => ({
  servers: new Map(),
}));

/**
 * Mark a directory in the OutFS as the root of a webserver.
 *
 * @param url - The url of the webserver.
 * @returns The rendered `children`.
 */
export function ServerRoot(
  { url, children }: { url: Expression; children?: Expressions },
): Expression {
  // First evaluate the url to a string, ...
  return <map fun={manageState}>{url}</map>;

  // ... then set the ServerInfo state.
  function manageState(evaledUrl: string, ctx: Context): Expression {
    const serverInfo: ServerInfo = {
      url: evaledUrl,
      mount: outCwd(ctx).components,
      definedAt: ctx.getCurrentDebuggingInformation(),
    };

    const state = getState(ctx);
    const asValue = JSON.stringify(outCwd(ctx).components);

    for (const [key, info] of state.servers.entries()) {
      const prefix = key.slice(0, -1);
      if (asValue.startsWith(prefix)) {
        l.warn(ctx, `Multiple <ServerRoot> macros for the same directory.`);
        l.logGroup(ctx, () => {
          l.at(ctx);
          l.warn(ctx, `Did not add the new server.`);
          l.warn(
            ctx,
            `Outer <ServerRoot> defined at ${
              styleDebuggingInformation(info.definedAt)
            }`,
          );
        });

        return <exps x={children} />;
      }
    }

    state.servers.set(asValue, serverInfo);

    // Evaluate children, with the ServerInfo corresponding to this macro
    // invocation.
    // Delay evaluation by one round, so that other servers get declared
    // before evaluating the children (needed to create correct hrefs
    // between servers).
    const round = ctx.getRound();
    return (
      <impure
        fun={(ctx) => {
          if (ctx.getRound() === round) {
            return null;
          }
          return <exps x={children} />;
        }}
      />
    );
  }
}

function getServerInfo(ctx: Context, path: OutFsPath): ServerInfo | null {
  const absolute = resolveRelativePath(ctx, path).components;
  const asValue = JSON.stringify(absolute);

  const state = getState(ctx);

  for (const [key, info] of state.servers.entries()) {
    const prefix = key.slice(0, -1);
    if (asValue.startsWith(prefix)) {
      return info;
    }
  }

  return null;
}

function getCurrentServerInfo(ctx: Context): ServerInfo | null {
  const absolute = outCwd(ctx).components;
  const asValue = JSON.stringify(absolute);

  const state = getState(ctx);

  for (const [key, info] of state.servers.entries()) {
    const prefix = key.slice(0, -1);
    if (asValue.startsWith(prefix)) {
      return info;
    }
  }

  return null;
}

function nullableInfoToUrl(info: ServerInfo | null): string | null {
  return info === null ? null : info.url;
}

function nullableInfoToMount(info: ServerInfo | null): string[] {
  return info === null ? [] : [...info.mount];
}

/**
 * Return the `url` of the current server, or `null` if no server was set.
 */
export function serverUrl(ctx: Context): string | null {
  const state = getCurrentServerInfo(ctx);
  return nullableInfoToUrl(state);
}

/**
 * Return the components of the absolute OutFs path at which the server was
 * created. Returns the empty array if no server was set.
 */
export function serverMount(ctx: Context): string[] {
  const state = getCurrentServerInfo(ctx);
  return nullableInfoToMount(state);
}

/**
 * Return the components of the absolute OutFs path from the root of the
 * current server to the OutFs cwd. If no server was set, uses the root of the
 * OutFs instead.
 */
export function serverPath(ctx: Context): string[] {
  const state = getCurrentServerInfo(ctx);
  const outFsComponents = outCwd(ctx).components;
  return outFsComponents.slice(state === null ? 0 : state.mount.length);
}

/**
 * Create a URL suitable for hyperlinking or otherwise referencing the `target`
 * path from the current file.
 */
export function hrefTo(ctx: Context, target: OutFsPath): string {
  const config = getConfig(ctx);
  let linkType = config.linkType;

  const currentServerUrl = serverUrl(ctx);
  const currentAbsolutePath = outCwd(ctx).components;

  const fileName = outFilename(ctx);

  if (fileName === null) {
    // Make sure we produce a URL that does not care where it is placed.
    linkType = "absolute";
  } else {
    currentAbsolutePath.push(fileName);
  }

  const targetInfo = getServerInfo(ctx, target);
  const targetAbsolutePath = resolveRelativePath(ctx, target).components;

  if (
    currentServerUrl === nullableInfoToUrl(targetInfo) &&
    JSON.stringify(currentAbsolutePath) ===
      JSON.stringify(targetAbsolutePath)
  ) {
    return ``;
  }

  if (linkType === "absolute" || !!config.alwaysUseDomain) {
    return absoluteHref(
      targetInfo,
      targetAbsolutePath,
      currentServerUrl,
      !!config.alwaysUseDomain,
    );
  } else if (linkType === "relative") {
    return relativeHref(
      targetInfo,
      targetAbsolutePath,
      currentServerUrl,
      currentAbsolutePath,
      !!config.alwaysUseDomain,
    );
  } else {
    const absolute = absoluteHref(
      targetInfo,
      targetAbsolutePath,
      currentServerUrl,
      !!config.alwaysUseDomain,
    );
    const relative = relativeHref(
      targetInfo,
      targetAbsolutePath,
      currentServerUrl,
      currentAbsolutePath,
      !!config.alwaysUseDomain,
    );

    return absolute.length < relative.length ? absolute : relative;
  }
}

function absoluteHref(
  targetInfo: ServerInfo | null,
  targetAbsolutePath: string[],
  currentServerUrl: string | null,
  alwaysUseDomain: boolean,
): string {
  const targetUrl = nullableInfoToUrl(targetInfo);

  const sliced = targetInfo
    ? targetAbsolutePath.slice(targetInfo.mount.length)
    : targetAbsolutePath;

  if (
    (targetUrl === currentServerUrl && !alwaysUseDomain) || targetUrl === null
  ) {
    return `${join("/", ...sliced)}`;
  } else {
    if (targetInfo) {
      const urlPath = join(...sliced);
      return `${targetUrl}${targetUrl.endsWith("/") ? "" : "/"}${
        urlPath === "." ? "" : urlPath
      }`;
    } else {
      return `${targetUrl}${targetUrl.endsWith("/") ? "" : "/"}${
        join(...sliced)
      }`;
    }
  }
}

/**
 * Return a relative url if possible, otherwise an absolute one.
 */
function relativeHref(
  targetInfo: ServerInfo | null,
  targetAbsolutePath: string[],
  currentServerUrl: string | null,
  currentAbsolutePath: string[],
  alwaysUseDomain: boolean,
): string {
  const targetUrl = nullableInfoToUrl(targetInfo);

  if (targetUrl !== currentServerUrl) {
    return absoluteHref(
      targetInfo,
      targetAbsolutePath,
      currentServerUrl,
      alwaysUseDomain,
    );
  }

  return `${
    relative(
      join(...currentAbsolutePath.slice(0, -1)),
      join(...targetAbsolutePath),
    )
  }`;
}
