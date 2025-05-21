import { Context } from "macromaniajsx/jsx-runtime";
import { PathInfo } from "macromania-assets";
import { extname, join } from "@std/path";
import { join as posixJoin } from "@std/path/posix";
import { ensureDir, readFile, writeFile } from "macromania-fs";

import { encodeHex } from "jsr:@std/encoding/hex";
import { addContentAddressedFile } from "./serverOptimisations.tsx";

/**
 * Copy the input file to the output directory, BUT change its name to a secure hash of its contents, followed by the original extension.
 */
export async function contentAddress(
  ctx: Context,
  pathInfo: PathInfo,
): Promise<string[]> {
  const allButLast = pathInfo.fileInAssets.slice(0, -1);
  const outDir = join(pathInfo.outRoot, ...allButLast);
  await ensureDir(ctx, outDir);

  const inputFile = join(pathInfo.assetsRoot, ...pathInfo.fileInAssets);
  const extension = extname(inputFile);

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

  const outputFile = join(
    pathInfo.outRoot,
    ...newLocation,
  );

  await writeFile(ctx, outputFile, inputFileBuffer);

  addContentAddressedFile(ctx, `/assets/${posixJoin(...newLocation)}`);

  return [...newLocation];
}
