# Macromania Assets

Asset loading for [Macromania](https://github.com/worm-blossom/macromania). This
package helps you to get assets from some source directory into an output
directory. The assets can be transformed by arbitrary _transformation
functions_. These could, for example, do compilation or bundling of source code.
This package itself only implements two general-purpose transformation: the
transformation that simply copies a file from the input directory into the
output directory, and the transformation which ignores its input file.

You specify an input directory of assets with the `<Assets />` macro, together
with some configuration information on which transforms to apply on a
per-directory or per-file basis. The macro then instructs the transformations to
place their output in the _current out directory_ of the
[OutFs](https://github.com/worm-blossom/macromania-outfs).

```tsx
import { Assets, transformCopy } from "./deps.tsx";

<Assets
  input={["assets"] /* path components from the process' cwd to the asset input directory. */}
  assets={{
    transformation: "ignore", /* Do not process anything, unless explicitly specified otherwise. */
    children: {
      "a.txt": transformCopy, /* Do not ignore `./assets/a.txt`, but copy it to the output. */
      "nested": {
        transformation: transformCopy, /* Copy everything in `./assets/nested` to the output. */
        children: {}, /* The latest `transformation` applies to all files/subdirectories
                         that are not explicitly listed here (i.e., all of them). */
      },
    },
  }}
/>;
```

The default top-level transformation is to copy files. For example, to simply
copy everything from `./assets` to `./build/assets`:

```tsx
import { Assets, transformCopy, Dir } from "./deps.tsx";

<Dir name="build">
  <Dir name="assets">
    <Assets
      input={["assets"]}
      assets={{children: {}}}
    />;
  </Dir>
</Dir>
```

For more examples, see [`./test/tests.tsx`](./test/tests.tsx).

## Working With Transformations

An asset transformation is an async function that takes a path to an input file
and some metadata about the asset directory and the output directory, and which
then reads the input file, performs arbitrary computations, writes an output
file, and returns to where it wrote the output.

```tsx
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
) => Promise<string>;

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
```

For example, the `transformCopy` function has the following implementation:

```tsx
/**
 * Copy the input file to the output directory.
 */
export async function transformCopy(
  ctx: Context,
  pathInfo: PathInfo,
): Promise<string> {
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
```

Other packages can query the paths to which any transformations wrote their
output with the `resolveAssetToOutFsPath` function. The intention is that
other macros can reference inputs via their path in the input assets directory
rather than the path to the transformation result. This is necessary, for
example, with transformations that derive output names from a hash function.

```tsx
import { Assets, transformCopy, Dir } from "./deps.tsx";

<Dir name="build">
  <Dir name="assets">
    <Assets
      input={["assets"]}
      assets={{children: {}}}
    />;
  </Dir>
</Dir>

/* later */
assertEquals(
  resolveAssetToOutFsPath(ctx, ["assets", "foo.txt"]),
  ["build", "assets", "foo.txt"],
);
```

To obtain a link from the current file to the transformed location of an asset, use the `ResolveAsset` macro:

```tsx
import { Assets, transformCopy, Dir } from "./deps.tsx";

<Dir name="build">
  <Dir name="assets">
    <Assets
      input={["assets"]}
      assets={{children: {}}}
    />;
  </Dir>
</Dir>

/* later */
<ResolveAsset asset={["assets", "foo.png"]}/> // "/assets/foo.png", for example
```