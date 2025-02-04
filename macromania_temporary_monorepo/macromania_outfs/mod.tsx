import {
  Context,
  createLogger,
  createSubstate,
  DebuggingInformation,
  Expression,
  Expressions,
  expressions,
  styleDebuggingInformation,
} from "./deps.ts";
import { EmptyDir, EnsureDir, EnsureNot, WriteTextFile } from "./deps.ts";
import { Colors, join } from "./deps.ts";

const l = createLogger("LoggerOutFs");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerOutFs };

/**
 * The outfs macros an in-memory hierarchy of paths, the *OutFs*.
 * Each Node in the OutFs is a directory, or a leaf file (we do not store the
 * contents in memory).
 * For each node, we track the macro that created it for debugging purposes.
 */
type OutFsNode = {
  source: DebuggingInformation;
  node: OutFsNode_;
};

type OutFsNode_ =
  | OutFile
  | OutDir;

/**
 * We store no data with files in the OutFs, we merrely track their existence.
 */
type OutFile = null;
function isOutFile(n: OutFsNode_): n is OutFile {
  return n === null;
}

/**
 * A directory is a collection of OutFsNodes, each with a name.
 */
type OutDir = Map<string, OutFsNode>;
function isOutDir(n: OutFsNode_): n is OutDir {
  return n !== null;
}

/**
 * The macros further maintain a notion of a cwd in the OutFs, and track
 * the name of the currently evaluated `File`, if any.
 */
type OutShell = {
  root: OutDir;
  cwd: string[];
  filename: string | null;
};

/**
 * A path in the OutFS.
 */
export type OutFsPath = {
  /**
   * `-1` for an absolute path, otherwise the number of `..` at the start of
   * the path.
   */
  relativity: number;
  /**
   * The path components.
   */
  components: string[];
};

/**
 * Create an absolute path in the OutFs.
 */
export function absoluteOutFsPath(components: string[]): OutFsPath {
  return { relativity: -1, components };
}

/**
 * Create a relative path in the OutFs. The optional second argument is the
 * number of `..` at the start, defaulting to zero.
 */
export function relativeOutFsPath(components: string[], up = 0): OutFsPath {
  return { relativity: up, components };
}

/**
 * Renders an {@linkcode OutFsPath} into a unix-style path string.
 *
 * Some examples:
 *
 * - `{relativity: 0, components ["foo", "bar"]}` becomes `"foo/bar"`
 * - `{relativity: -1, components ["foo", "bar"]}` becomes `"/foo/bar"`
 * - `{relativity: 2, components ["foo"]}` becomes `"../../foo"`
 * - `{relativity: 0, components []}` becomes `"."`
 */
export function renderOutFsPath(p: OutFsPath): string {
  if (p.relativity === 0 && p.components.length === 0) {
    return ".";
  }

  if (p.relativity === -1) {
    return `/${p.components.join("/")}`;
  }

  const dots: string[] = new Array(p.relativity);
  dots.fill("..");
  const parents = dots.join("/");

  return `${parents}${p.relativity > 0 && p.components.length > 0 ? "/" : ""}${
    p.components.join("/")
  }`;
}

/**
 * Like {@linkcode renderOutFsPath}, but with ansi escape styling for terminal
 * output.
 */
export function styleOutFsPath(p: OutFsPath): string {
  return Colors.cyan(renderOutFsPath(p));
}

/**
 * Clone an {@linkcode OutFsPath} into a completely separate object.
 */
export function cloneOutFsPath(p: OutFsPath): OutFsPath {
  return {
    relativity: p.relativity,
    components: [...p.components],
  };
}

function singletonPath(component: string): OutFsPath {
  return relativeOutFsPath([component]);
}

/**
 * Resolve `path` to an absolute path, by applying it to the current working
 * directory. Halts if the resolution process involves leaving the root.
 *
 * Does not check whether files actually exist, this is purely syntactic path
 * manipulation.
 *
 * If `path` is absolute, simply returns it directly.
 */
export function resolveRelativePath(
  ctx: Context,
  path: OutFsPath,
): OutFsPath {
  if (path.relativity === -1) {
    return path;
  }

  const shell = getState(ctx).shell;
  const startPath = [...shell.cwd];

  // We resolve the path by iteratively resolving the first path component.
  let currentPath = [...startPath];

  let relativity = path.relativity;
  while (relativity > 0) {
    if (currentPath.length > 0) {
      relativity -= 1;
      currentPath = currentPath.slice(1);
    } else {
      const dotdot = styleOutFsPath({ relativity: 1, components: [] });
      logResolveFailure(ctx, path, absoluteOutFsPath(startPath));
      l.logGroup(ctx, () => {
        l.error(
          ctx,
          `Reached the root of the out fs after processing ${
            path.relativity - relativity
          } many ${dotdot}`,
        );
        l.error(
          ctx,
          `But the remaining path has ${path.relativity} more ${dotdot}:`,
        );
        l.error(ctx, `${styleOutFsPath(path)}`);
      });
      ctx.halt();
    }
  }

  return absoluteOutFsPath([...currentPath, ...path.components]);
}

/**
 * The substate for this family of macros.
 */
type OutFS = {
  /**
   * A directory hierarchy and a cwd in that hierarchy.
   */
  shell: OutShell;
  /**
   * The (platform-dependent) path to where the roor PretendDir is "mounted" in
   * the real file system.
   * Set to the cwd when this file gets loaded, and never changed again.
   */
  mount: string;
};

const [getState, _setState] = createSubstate<OutFS>(() => ({
  shell: {
    root: new Map(),
    cwd: [],
    filename: null,
  },
  mount: Deno.cwd(),
}));

/**
 * Get the mount point of the OutFs as a platform-dependent absolute path.
 */
export function outMount(ctx: Context): string {
  return getState(ctx).mount;
}

/**
 * Get the current out directory as an `OutFsPath`.
 *
 * The returned path is always an absolute path (i.e., its `relatvity` is -1).
 */
export function outCwd(ctx: Context): OutFsPath {
  return absoluteOutFsPath([...getState(ctx).shell.cwd]);
}

/**
 * Get the name of the current file, or `null` if called outside of any `File`
 * macro invocation.
 */
export function outFilename(ctx: Context): string | null {
  return getState(ctx).shell.filename;
}

export function outFullPath(ctx: Context): OutFsPath {
  const filename = outFilename(ctx);
  const cwd = outCwd(ctx);

  if (filename === null) {
    return cwd;
  } else {
    const ret = cloneOutFsPath(cwd);
    ret.components.push(filename);
    return ret;
  }
}

/**
 * Change the current out directory for the children of this macro.
 *
 * @param path - An {@linkcode OutFsPath} to resolve from the current out
 * directory.
 * @param create - Whether to create missing parent directories (`true`) or
 * error on missing parent directories (`false`). Defaults to `false`.
 * @param children - Expressions to evaluate in a changed current out
 * directory.
 * @returns The evaluated children.
 */
export function Cd({ children: children_, path: path_, create = false }: {
  path: OutFsPath;
  create?: boolean;
  children?: Expressions;
}): Expression {
  const children = expressions(children_);
  const path = cloneOutFsPath(path_);

  // Some state to let `pre` and `post` cooperate in changing the current
  // out dir and later undoing the change.
  let priorOutDirectory: string[] = [];

  // Reset the current out dir to what they where before this macro.
  const post = (ctx: Context) => {
    const state = getState(ctx);
    state.shell.cwd = priorOutDirectory;
  };

  // Remember the prior out dir to the current one, then update the
  // actual state to the new ones.
  const pre = (ctx: Context) => {
    const initialCwd = outCwd(ctx);
    const shell = getState(ctx).shell;
    // Remember the old cwd.
    priorOutDirectory = [...shell.cwd];

    /* Now we set the new cwd */

    if (path.relativity === -1) {
      // We cd to an absolute path by setting the cwd to the root directory
      // and then treating the path like a relative one.
      shell.cwd = [];
      path.relativity = 0;
    }

    // Move upwards for any `..`.
    while (path.relativity > 0) {
      if (shell.cwd.length > 0) {
        shell.cwd.pop();
      } else {
        const dotdot = styleOutFsPath({ relativity: 1, components: [] });
        logResolveFailure(ctx, path_, initialCwd);
        l.logGroup(ctx, () => {
          l.error(
            ctx,
            `Reached the root of the out fs after processing ${
              path_.relativity - path.relativity
            } many ${dotdot}`,
          );
          l.error(
            ctx,
            `But the remaining path has ${path.relativity} more ${dotdot}:`,
          );
          l.error(ctx, `${styleOutFsPath(path)}`);
        });
        return ctx.halt();
      }

      path.relativity -= 1;
    }

    // Done processing the `..`, can concat the path components to the cwd.
    shell.cwd = shell.cwd.concat(path.components);

    // Trigger an error if the resulting cwd is invalid for any reason.
    const node = resolveCwd(ctx, create, path_, initialCwd);
    const _ = ensureOutNodeIsDir(ctx, node, path_, initialCwd, outCwd(ctx));
  };

  return (
    <lifecycle pre={pre} post={post}>
      <fragment exps={children} />
    </lifecycle>
  );
}

function logResolveFailure(ctx: Context, path: OutFsPath, from: OutFsPath) {
  l.error(ctx, `Failed to resolve OutFsPath to a directory.`);
  l.logGroup(ctx, () => {
    l.error(ctx, `path: ${styleOutFsPath(path)}`);
    l.error(ctx, `from out-cwd: ${styleOutFsPath(from)}`);
  });
}

/**
 * Internal function: resolves the pwd of the shell to an OutFsNode. Halts if
 * impossible.
 * @param ctx - The context whose shell should be resolved to a node.
 * @param create - Whether to create missing parent directories (`true`) or
 * error on missing parent directories (`false`).
 * @param path - The path to originally resolve, for better error messages.
 * @param from - The path from where to originally resolve, for better error
 * messages.
 */
function resolveCwd(
  ctx: Context,
  create: boolean,
  path: OutFsPath,
  from: OutFsPath,
): OutFsNode {
  const shell = getState(ctx).shell;

  const startPath = [...shell.cwd];

  // We resolve the path by iteratively resolving the first path component.
  let currentPath = [...startPath];
  // The components that have already been resolved.
  // The algorithm maintains concat(resolved, currentPath) == shell.cwd
  let resolved: string[] = [];
  // While resolving the path, this variable stores the successive directories.
  let currentNode: OutFsNode = { source: {}, node: shell.root };

  while (currentPath.length > 0) {
    const [fst, ...rest] = currentPath;

    if (isOutFile(currentNode.node)) {
      // We have reached a leaf file, yet the path still has more components.
      // Time to error out.
      logResolveFailure(ctx, path, from);
      l.logGroup(ctx, () => {
        l.error(
          ctx,
          `${
            styleOutFsPath(absoluteOutFsPath(currentPath))
          } is not a directory.`,
        );
        l.error(
          ctx,
          `The non-directory was created at ${
            styleDebuggingInformation(currentNode.source)
          }`,
        );
      });
      ctx.halt();
      throw "just halted";
    }

    // Neither leaf file nor symlink, so we are in a directory.
    // Look up the next path component.
    let nextNode = currentNode.node.get(fst);
    if (nextNode === undefined) {
      // Path component not found. Should we create the directory?
      if (create) {
        // Yes, create the directory and act like it always was there.
        nextNode = {
          source: ctx.getCurrentDebuggingInformation(),
          node: new Map(),
        };
        currentNode.node.set(fst, nextNode);
        Deno.mkdirSync(join(getState(ctx).mount, ...resolved, fst));
      } else {
        // No, error instead of creating missing components.
        logResolveFailure(ctx, path, from);
        l.error(
          ctx,
          `  no file ${styleOutFsPath(singletonPath(fst))} in ${
            styleOutFsPath(absoluteOutFsPath(resolved))
          }`,
        );
        ctx.halt();
        throw "just halted";
      }
    }

    // Successfully looked up the directory, so we successfully handled the
    // first path component. Continue the loop with the next component.
    currentPath = rest;
    resolved = [...resolved, fst];
    currentNode = nextNode;
  }

  return currentNode;
}

/**
 * Error if the given node is not a directory.
 */
function ensureOutNodeIsDir(
  ctx: Context,
  node: OutFsNode,
  path: OutFsPath,
  from: OutFsPath,
  resolved: OutFsPath,
): OutDir {
  if (isOutDir(node.node)) {
    return node.node;
  } else {
    logResolveFailure(ctx, path, from);
    l.logGroup(ctx, () => {
      l.error(ctx, `The path resolved not to a directory but to a file:`);
      l.error(ctx, `${styleOutFsPath(resolved)}`);
      l.error(ctx, `File created at ${styleDebuggingInformation(node.source)}`);
    });
    ctx.halt();
    throw "just halted";
  }
}

/**
 * To be used when somethings requires path arguments for error reporting
 * but we know it cannot fail.
 */
const dummyPath = relativeOutFsPath([]);

/**
 * Describes what to do if there is already a file of some name.
 *   - `"timid"`: Log error and halt.
 *   - `"placid"`: Do nothing if there is already a file/directory of this name.
 *   - `"assertive"`: Create a new empty directory at this name, no matter what.
 */
export type Mode = "timid" | "placid" | "assertive";

/**
 * Create a directory in the current out directory, and `cd` there.
 *
 * @param name - The name of the directory to create.
 * @param mode - What to do if there is already a file at this name. defaults
 * to `"timid"`.
 * @param clean - Whether to initially clean out the contents of the directory
 * on the file system. Defaults to **`true`**.
 * @param children - Expressions to evaluate in the new directory.
 * @returns The evaluated children.
 */
export function Dir({ name, children: children_, mode = "timid", clean = true }: {
  name: string;
  mode?: Mode;
  clean?: boolean;
  children?: Expressions;
}): Expression {
  const children = expressions(children_);

  // First, create the directory both in the OutFS and on the real fs.
  const createTheDir = (
    <impure
      fun={(ctx: Context) => {
        const state = getState(ctx);

        // Get the current directory (cannot fail).
        const node = resolveCwd(ctx, false, dummyPath, dummyPath);
        const outDir = ensureOutNodeIsDir(
          ctx,
          node,
          dummyPath,
          dummyPath,
          outCwd(ctx),
        );

        if (shouldAddNode(ctx, outDir, mode, name)) {
          // Time to create an empty directory:
          // in the logical OutFs...
          outDir.set(name, {
            source: ctx.getCurrentDebuggingInformation(),
            node: new Map(),
          });
          // ... and on the real file system.
          const path = join(state.mount, ...state.shell.cwd, name);
          return clean ? <EmptyDir dir={path} /> : <EnsureDir path={path} />;
        } else {
          return (
            <EnsureDir path={join(state.mount, ...state.shell.cwd, name)}>
            </EnsureDir>
          );
        }
      }}
    />
  );

  return (
    <map
      fun={(_: string, _ctx: Context) => {
        return (
          <Cd path={singletonPath(name)}>
            <fragment exps={children} />
          </Cd>
        );
      }}
    >
      {createTheDir}
    </map>
  );
}

/**
 * Create a file in current out directory, write the evaluated children there.
 *
 * @param name - The name of the file to create.
 * @param mode - What to do if there is already a file at this name. Defaults to
 * `"timid"`.
 * @param children - Expressions to evaluate to form the file contents.
 * @returns The evaluated children.
 */
export function File({ name, children: children_, mode = "timid" }: {
  name: string;
  mode?: Mode;
  children?: Expressions;
}): Expression {
  const children = expressions(children_);

  let createNewFile = true;

  // First, create the file in the OutFS.
  const createTheFile = (
    <impure
      fun={(ctx: Context) => {
        const state = getState(ctx);

        // Get the current directory (cannot fail).
        const node = resolveCwd(ctx, false, dummyPath, dummyPath);
        const outDir = ensureOutNodeIsDir(
          ctx,
          node,
          dummyPath,
          dummyPath,
          outCwd(ctx),
        );

        createNewFile = shouldAddNode(ctx, outDir, mode, name);

        if (createNewFile) {
          // Create the file in the logical OutFs.
          outDir.set(name, {
            source: ctx.getCurrentDebuggingInformation(),
            node: null,
          });
          // Delete any prior version of the file from the real fs.
          return (
            <>
              <EnsureNot path={join(state.mount, ...state.shell.cwd, name)} />
              <fragment exps={children} />
            </>
          );
        } else {
          return <fragment exps={children} />;
        }
      }}
    />
  );

  let priorFilename: string | null = "";

  return (
    <lifecycle
      pre={(ctx) => {
        const shell = getState(ctx).shell;
        priorFilename = shell.filename;
        shell.filename = name;
      }}
      post={(ctx) => {
        getState(ctx).shell.filename = priorFilename;
      }}
    >
      <map
        fun={(evaled: string, ctx: Context) => {
          if (createNewFile) {
            const state = getState(ctx);
            return (
              <WriteTextFile path={join(state.mount, ...state.shell.cwd, name)}>
                {evaled}
              </WriteTextFile>
            );
          } else {
            return evaled;
          }
        }}
      >
        {createTheFile}
      </map>
    </lifecycle>
  );
}

function shouldAddNode(
  ctx: Context,
  outDir: OutDir,
  mode: Mode,
  name: string,
): boolean {
  // Add a new directory to the current directory.
  if (outDir.has(name)) {
    // We already have a node at this name.

    if (mode === "timid") {
      // Immediately error out.
      l.error(
        ctx,
        `Cannot create ${styleOutFsPath(singletonPath(name))} in ${
          styleOutFsPath(outCwd(ctx))
        }`,
      );
      l.logGroup(ctx, () => {
        l.error(
          ctx,
          `File ${styleOutFsPath(singletonPath(name))} already exists.`,
        );
        l.error(
          ctx,
          `Created at ${styleDebuggingInformation(outDir.get(name)!.source)}`,
        );
      });
      ctx.halt();
      throw "unreachable";
    } else if (mode === "placid") {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}
