import { Context } from "macromaniajsx/jsx-runtime";
import { PathInfo } from "macromania-assets";
import { path } from "./deps.ts";
import { ensureDir, readFile, writeFile } from "macromania-fs";

import { encodeHex } from "jsr:@std/encoding/hex";

/**
 * Copy the input file to the output directory, BUT change its name to a secure hash of its contents, followed by the original extension.
 */
export async function contentAddress(
  ctx: Context,
  pathInfo: PathInfo,
): Promise<string[]> {
  const allButLast = pathInfo.fileInAssets.slice(0, -1);
  const outDir = path.join(pathInfo.outRoot, ...allButLast);
  await ensureDir(ctx, outDir);

  const inputFile = path.join(pathInfo.assetsRoot, ...pathInfo.fileInAssets);
  const extension = path.extname(inputFile);

  const inputFileBuffer = await readFile(ctx, inputFile);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    inputFileBuffer,
  );
  const hash = encodeHex(hashBuffer);

  const newLocation = [
    ...pathInfo.fileInAssets.slice(0, -1),
    `${hash}${extension}`,
  ];

  const outputFile = path.join(
    pathInfo.outRoot,
    ...newLocation,
  );

  await writeFile(ctx, outputFile, inputFileBuffer);

  return [...newLocation];
}
