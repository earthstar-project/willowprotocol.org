import { hrefTo } from "../mod.tsx";
import { posixPath } from "./deps.ts";
import {
  Colors,
  Context,
  copyFile,
  createLogger,
  createSubstate,
  ensureDir,
  Expression,
  outCwd,
  outMount,
  path,
} from "./deps.ts";

const l = createLogger("LoggerAssets");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerAssets };

type AssetsState = {
  /**
   * A map from leaf-file-paths in the AssetTree (as obtained by
   * `posixPath.join`-ing the path components) that got processed to the
   * components of the absolute path in the OutFs to which the output was
   * written.
   */
  processed: Map<string, string[]>;
  /**
   * The physical file system path to the asset directory.
   */
  realDir: string;
};

const [getState, _setState] = createSubstate<AssetsState>(() => ({
  processed: new Map(),
  realDir: "asset directory not yet set",
}));

/**
 * Get the filesystem path where Macromania will try to locate assets.
 */
export function getAssetDirPhysicalPath(ctx: Context) {
  return getState(ctx).realDir;
}

/**
 * Given a sequence of names in the `assets` of the `Assets` macro, returns
 * `null` if no asset under this name has been processed by a transformation,
 * but otherwise returns the absolute path in the OutFs to which its
 * transformation wrote its output file.
 */
export function resolveAssetToOutFsPath(
  ctx: Context,
  asset: string[],
): string[] | null {
  const processed = getState(ctx).processed;
  const key = posixPath.join(...asset);
  const lookup = processed.get(key);

  if (lookup === undefined) {
    return null;
  } else {
    return lookup;
  }
}

/**
 * Render a path to the (possibly transformed and renamed) asset that was located in the asset directory at the given path.
 */
export function ResolveAsset({ asset }: { asset: string[] }): Expression {
  return (
    <impure
      fun={(ctx) => {
        const resolved = resolveAssetToOutFsPath(ctx, asset);
        if (resolved === null) {
          l.error(
            ctx,
            `Asset at path ${
              styleAssetPath(asset)
            } does not resolve to any output path.`,
          );
          l.logGroup(ctx, () => {
            l.error(ctx, `There was no such input asset.`);
          });
          return ctx.halt();
        } else {
          return hrefTo(ctx, { relativity: -1, components: resolved });
        }
      }}
    />
  );
}

/**
 * Configure how to copy and transform assets from some directory into an
 * output directory.
 *
 * Evaluates to the empty string.
 *
 * @param input - The components of a relative path from the current working
 * directory of the process to the asset directory.
 * @param assets - A declarative specification of which assets to ignore and
 * which to process (and how).
 */
export function Assets(
  { input, assets }: {
    input: string[];
    assets: AssetDir;
  },
): Expression {
  // Track which known files actually  existed, so we can later report
  // inconsistencies with the AssetTree.
  // Strings are like in the `processed` field of the macro state.
  const knownAndProcessed: Set<string> = new Set();

  return (
    <impure
      fun={async (ctx: Context) => {
        const state = getState(ctx);

        // Cache the outCwd so that later changes to it dont do anything funky.
        const currentOutCwd = outCwd(ctx);

        const cwd = Deno.cwd();
        const realDir = path.join(cwd, ...input);
        state.realDir = realDir;
        const realOutDir = path.join(
          outMount(ctx),
          ...currentOutCwd.components,
        );

        if (assets.transformation === undefined) {
          assets.transformation = transformCopy;
        }

        await processAssetDir(assets, {
          assetsRoot: realDir,
          fileInAssets: [],
          outRoot: realOutDir,
        });

        // Now we iterate through all declared assets and check whether any of them
        // are missing from the file system.
        didWeHandleEverythingInThisAssetDir(assets, "");

        return "";

        /**
         * Register that the asset at path `asset` (relative to the directory specified
         * in the `Assets macro`) got transformed and then output at path `output` in
         * the OutFs (relative to the current out directory).
         *
         * Copies `output` before storing it.
         */
        function registerTransformedAsset(
          asset: string[],
          output: string[],
        ) {
          const processed = getState(ctx).processed;
          const key = posixPath.join(...asset);
          processed.set(key, [...currentOutCwd.components, ...output]);
        }

        /*
         * Invariant: tree.transformation must not be undefined. Parent calls must set
         * it to their own transformation when they encounter a child with undefined
         * transformation. The initial transformation is `transformCopy` ("ignore"
         * would make more sense, but would lead to plenty of confused users...).
         */
        async function processAssetDir(
          tree: AssetDir,
          info: PathInfo,
        ) {
          const realPathToThis = path.join(
            info.assetsRoot,
            ...info.fileInAssets,
          );

          // We iterate the real file system, then look up what to do in the tree.

          for await (const entry of Deno.readDir(realPathToThis)) {
            const realPathToChild = path.join(realPathToThis, entry.name);

            if (entry.isSymlink) {
              l.error(ctx, `Assets may not be symlinks`);
              l.logGroup(ctx, () => {
                l.error(ctx, `${realPathToChild}`);
                l.error(
                  ctx,
                  `Feel free to contribute some code to change this, though =)`,
                );
              });
              ctx.halt();
              return;
            } else {
              const childPathInfo: PathInfo = {
                assetsRoot: info.assetsRoot,
                fileInAssets: [...info.fileInAssets, entry.name],
                outRoot: info.outRoot,
              };

              // Do we know about this name?
              const subtree = tree.children !== undefined
                ? tree.children[entry.name]
                : undefined;

              if (entry.isFile) {
                // Apply a transform or not, depending on what we knew about this.

                if (subtree === undefined) {
                  // We did not know about this name, so simply apply our transform.
                  if (tree.transformation !== "ignore") {
                    const outputLocation = await tree.transformation!(
                      ctx,
                      childPathInfo,
                    );
                    registerTransformedAsset(
                      childPathInfo.fileInAssets,
                      outputLocation,
                    );
                  }
                } else if (subtree === "ignore") {
                  // We knew about this file, and it should be ignored. Easily done!
                  // Mark file as processed.
                  knownAndProcessed.add(
                    posixPath.join(...childPathInfo.fileInAssets),
                  );
                } else if (isAssetTransform(subtree)) {
                  // We knew about this file, it has a specific transform in mind.
                  const outputLocation = await subtree(ctx, childPathInfo);
                  registerTransformedAsset(
                    childPathInfo.fileInAssets,
                    outputLocation,
                  );

                  // Mark file as processed.
                  knownAndProcessed.add(
                    posixPath.join(...childPathInfo.fileInAssets),
                  );
                } else {
                  // We knew about this file, but we expected a directory. Sad times.
                  l.error(ctx, `Expected a directory at ${realPathToChild}`);
                  return ctx.halt();
                }
              } else {
                // Dealing with a directory

                if (subtree === undefined) {
                  // An unknown directory, keep processing it with the same transform.
                  await processAssetDir(
                    { transformation: tree.transformation, children: {} },
                    childPathInfo,
                  );
                } else if (subtree === "ignore" || isAssetTransform(subtree)) {
                  // We knew about this directory, but we expected a leaf file :(
                  l.error(
                    ctx,
                    `Expected a non-directory file at ${realPathToChild}`,
                  );
                  return ctx.halt();
                } else {
                  // A known directory, process it with its transform, or our own
                  // transform if the child directory does not specify its own one.
                  await processAssetDir(
                    {
                      transformation: subtree.transformation === undefined
                        ? tree.transformation
                        : subtree.transformation,
                      children: subtree.children,
                    },
                    childPathInfo,
                  );

                  // Mark file as processed.
                  knownAndProcessed.add(
                    posixPath.join(...childPathInfo.fileInAssets),
                  );
                }
              }
            }
          }
        }

        function didWeHandleEverythingInThisAssetDir(
          dir: AssetDir,
          pathToDir: string,
        ) {
          for (const key in dir.children) {
            const child = dir.children[key];
            const childPath = posixPath.join(pathToDir, key);

            if (child === "ignore" || isAssetTransform(child)) {
              // Leaf child.
              if (!knownAndProcessed.has(childPath)) {
                l.error(
                  ctx,
                  `Asset declaration specified a transform for a file, but there was no such file in the real file system.`,
                );
                l.logGroup(ctx, () => {
                  l.error(ctx, `Path to file in the assets dir: ${childPath}`);
                });
                ctx.halt();
              }
            } else {
              // Directory child.
              if (!knownAndProcessed.has(childPath)) {
                l.error(
                  ctx,
                  `Asset declaration specified a transform for a directory, but there was no such directory in the real file system.`,
                );
                l.logGroup(ctx, () => {
                  l.error(
                    ctx,
                    `Path to directory in the assets dir: ${childPath}`,
                  );
                });
                ctx.halt();
              } else {
                // Directory was processed, now recursively check its contents.
                didWeHandleEverythingInThisAssetDir(child, childPath);
              }
            }
          }
        }
      }}
    />
  );
}

/**
 * A description of which transformations to apply to which files.
 *
 * The `transformation` property selects the transformation to apply to the
 * (non-directory) files in this directory (unless overwritten by more specific
 * configuration information). `"ignore"` means that the files in this
 * directory will not be processed at all. If `transformation` is `undefined`,
 * then the transformation of the parent directory is used in this directory.
 *
 * The `children` allow to overwrite transformations for specific files or
 * directories. Mapping some name to `"ignore"` or an {@linkcode AssetTransform}
 * indicates that there should be a file of the given name in this directory,
 * and it should be ignored or transformed with the given transform
 * respectively. Files in this directory that do not appear in the `children`
 * are processed with the `transformation` of the directory.
 *
 * Mapping a name to another `AssetDir` indicates a nested directory, which can
 * be configured in the same way (its `transformation`, if specified,
 * overwriting that of its parent).
 */
export type AssetDir = {
  transformation?: "ignore" | AssetTransform;
  children?: Record<string, AssetDir | ("ignore" | AssetTransform)>;
};

/**
 * A function for transforming assets, reading them from an asset directory, and
 * placing the result in the OutFs.
 *
 * The function returns the components of the relative (to the current out
 * directory) OutFs path to which it wrote its output.
 *
 * Invoked for leaf files only, not for directories.
 */
export type AssetTransform = (
  ctx: Context,
  pathInfo: PathInfo,
) => Promise<string[]>;

function isAssetTransform(
  // deno-lint-ignore no-explicit-any
  x: any,
): x is AssetTransform {
  return typeof x === "function";
}

/**
 * Information about an asset: where the input resides, and where the output
 * should be placed.
 */
export type PathInfo = {
  /**
   * Platform-specific absolute path of the assets directory.
   */
  assetsRoot: string;
  /**
   * Path components of the relative path from the `assetsRoot` to the file in
   * question.
   */
  fileInAssets: string[];
  /**
   * Platform-specific absolute path to the output directory for assets.
   */
  outRoot: string;
};

/**
 * Copy the input file to the output directory.
 */
export async function transformCopy(
  ctx: Context,
  pathInfo: PathInfo,
): Promise<string[]> {
  // Ensure the directory where we need to place the output exists.
  const allButLast = pathInfo.fileInAssets.slice(0, -1);
  const outDir = path.join(pathInfo.outRoot, ...allButLast);
  await ensureDir(ctx, outDir);

  // Determine the actual location of the input file in the file system.
  const inputFile = path.join(pathInfo.assetsRoot, ...pathInfo.fileInAssets);

  // Copy the input file into the output directory.
  const outputFile = path.join(pathInfo.outRoot, ...pathInfo.fileInAssets);
  await copyFile(
    ctx,
    inputFile,
    outputFile,
  );

  // Return the path components where in the current out dir we wrote the
  // output to. A more interesting transform might change the file extension,
  // for example.
  return [...pathInfo.fileInAssets];
}

/**
 * Pretty-print the asset path components as expected by
 * `resolveAssetToOutFsPath`.
 */
export function styleAssetPath(path: string[]): string {
  return Colors.brightYellow(JSON.stringify(path));
}
