import { createLogger } from "./deps.ts";
import {
  Context,
  Expression,
  Expressions,
  expressions,
  fs,
  styleFile,
} from "./deps.ts";

const l = createLogger("LoggerFs");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerFs };

/**
 * Changes the permission of a specific file/directory of
 * specified path. Ignores the process's umask.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.chmod
 */
export async function chmod(ctx: Context, path: string | URL, mode: number) {
  try {
    await Deno.chmod(path, mode);
    l.trace(
      ctx,
      `Chmod-ed file ${styleFile(path.toString())} to the permissions 0o${
        mode.toString(8)
      }F.`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to chmod file ${
        styleFile(path.toString())
      } to the permissions 0o${mode.toString(8)}F.`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Changes the permission of a specific file/directory of
 * specified path. Ignores the process's umask.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.chmod
 *
 * @param path - The path to the file.
 * @param mode - The mode is a sequence of 3 octal numbers. The first/left-most number specifies the permissions for the owner. The second number specifies the permissions for the group. The last/right-most number specifies the permissions for others. For example, with a mode of 0o764, the owner (7) can read/write/execute, the group (6) can read/write and everyone else (4) can read only.
 *
 * @returns The empty string.
 */
export function Chmod(
  {
    path,
    mode,
  }: {
    path: string | URL;
    mode: number;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await chmod(ctx, path, mode);
        return "";
      }}
    />
  );
}

/**
 * Changes the owner of a regular file or directory.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.chown
 * @returns The empty string.
 */
export async function chown(
  ctx: Context,
  path: string | URL,
  uid?: number,
  gid?: number,
) {
  try {
    await Deno.chown(path, uid ?? null, gid ?? null);
    l.trace(ctx, `Chown-ed file ${styleFile(path.toString())}.`);
    l.logGroup(ctx, () => {
      if (uid != undefined) {
        l.trace(ctx, `User id: ${uid}`);
      }
      if (gid != undefined) {
        l.trace(ctx, `Group id: ${gid}`);
      }
    });
  } catch (err) {
    l.error(ctx, `Failed to chown file ${styleFile(path.toString())}`);
    l.logGroup(ctx, () => {
      if (uid != undefined) {
        l.error(ctx, `User id: ${uid}`);
      }
      if (gid != undefined) {
        l.error(ctx, `Group id: ${gid}`);
      }
      l.error(ctx, err);
    });
    ctx.halt();
  }
}

/**
 * Changes the owner of a regular file or directory.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.chown
 * @returns The empty string.
 */
export function Chown(
  { path, uid, gid }: { path: string | URL; uid?: number; gid?: number },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await chown(ctx, path, uid, gid);
        return "";
      }}
    />
  );
}

/**
 * Copies the contents and permissions of one file to another
 * specified path, by default creating a new file if needed, else overwriting.
 * Fails if target path is a directory or is unwritable.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.copyFile
 * @returns The empty string.
 */
export async function copyFile(
  ctx: Context,
  from: string | URL,
  to: string | URL,
) {
  try {
    await Deno.copyFile(from, to);
    l.trace(
      ctx,
      `Copied file from ${styleFile(from.toString())} to ${
        styleFile(to.toString())
      }`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to copy file from ${styleFile(from.toString())} to ${
        styleFile(to.toString())
      }`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Copies the contents and permissions of one file to another
 * specified path, by default creating a new file if needed, else overwriting.
 * Fails if target path is a directory or is unwritable.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.copyFile
 * @returns The empty string.
 */
export function CopyFile(
  { from, to }: { from: string | URL; to: string | URL },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await copyFile(ctx, from, to);
        return "";
      }}
    />
  );
}

/**
 * Creates `newpath` as a hard link to `oldpath`.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.link
 * @returns The empty string.
 */
export async function hardLink(
  ctx: Context,
  oldpath: string,
  newpath: string,
) {
  try {
    await Deno.link(oldpath, newpath);
    l.trace(
      ctx,
      `Created ${styleFile(newpath.toString())} as a hardlink to ${
        styleFile(oldpath.toString())
      }`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to create ${styleFile(newpath.toString())} as a hardlink to ${
        styleFile(oldpath.toString())
      }`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Creates `newpath` as a hard link to `oldpath`.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.link
 * @returns The empty string.
 */
export function HardLink(
  { oldpath, newpath }: { oldpath: string; newpath: string },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await hardLink(ctx, oldpath, newpath);
        return "";
      }}
    />
  );
}

/**
 * Creates a new temporary directory in the default directory for
 * temporary files, unless `dir` is specified. Other optional options include
 * prefixing and suffixing the directory name with `prefix` and `suffix`
 * respectively.
 *
 * It is the caller's responsibility to remove the directory when no longer
 * needed.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.makeTempDir
 * @returns The full path to the newly created directory.
 */
export async function makeTempDir(
  ctx: Context,
  options?: Deno.MakeTempOptions,
): Promise<string> {
  try {
    const path = await Deno.makeTempDir(options);

    l.trace(ctx, `Created temporary directory at ${path}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });

    return path;
  } catch (err) {
    l.error(ctx, `Failed to create temporary directory.`);
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    ctx.halt();
    return "";
  }
}

/**
 * Creates a new temporary directory in the default directory for
 * temporary files, unless `dir` is specified. Other optional options include
 * prefixing and suffixing the directory name with `prefix` and `suffix`
 * respectively.
 *
 * It is the caller's responsibility to remove the directory when no longer
 * needed.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.makeTempDir
 * @returns Evaluates to the full path to the newly created directory.
 */
export function MakeTempDir(
  { options }: { options?: Deno.MakeTempOptions },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        return await makeTempDir(ctx, options);
      }}
    />
  );
}

/**
 * Creates a new temporary file in the default directory for
 * temporary files, unless `dir` is specified. Other optional options include
 * prefixing and suffixing the file name with `prefix` and `suffix`
 * respectively.
 *
 * It is the caller's responsibility to remove the file when no longer needed.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.makeTempFile
 * @returns The full path to the newly created file.
 */
export async function makeTempFile(
  ctx: Context,
  options?: Deno.MakeTempOptions,
): Promise<string> {
  try {
    const path = await Deno.makeTempFile(options);

    l.trace(ctx, `Created temporary file at ${path}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });

    return path;
  } catch (err) {
    l.error(ctx, `Failed to create temporary file.`);
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    ctx.halt();
    return "";
  }
}

/**
 * Creates a new temporary file in the default directory for
 * temporary files, unless `dir` is specified. Other optional options include
 * prefixing and suffixing the file name with `prefix` and `suffix`
 * respectively.
 *
 * It is the caller's responsibility to remove the file when no longer needed.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.makeTempFile
 * @returns Evaluates to the full path to the newly created file.
 */
export function MakeTempFile(
  { options }: { options?: Deno.MakeTempOptions },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        return await makeTempFile(ctx, options);
      }}
    />
  );
}

/**
 * Creates a new directory with the specified path.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.mkdir
 */
export async function mkdir(
  ctx: Context,
  path: string | URL,
  options?: Deno.MkdirOptions,
) {
  try {
    await Deno.mkdir(path, options);
    l.trace(ctx, `Create directory ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });
  } catch (err) {
    l.error(ctx, `Failed to create directory ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    ctx.halt();
  }
}

/**
 * Creates a new directory with the specified path.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.mkdir
 * @returns The empty string.
 */
export function Mkdir(
  { path, options }: { path: string | URL; options?: Deno.MkdirOptions },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await mkdir(ctx, path, options);
        return "";
      }}
    />
  );
}

/**
 * Returns the full path destination of the named symbolic link.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.readLink
 * @returns The full path destination of the named symbolic link.
 */
export async function readLink(
  ctx: Context,
  path: string | URL,
): Promise<string> {
  try {
    const ret = await Deno.readLink(path);
    l.trace(ctx, `Read link ${path.toString()}: ${ret}`);
    return ret;
  } catch (err) {
    l.error(ctx, `Failed to read link ${path.toString()}`);
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
    return "";
  }
}

/**
 * Returns the full path destination of the named symbolic link.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.readLink
 * @returns Evaluates to the full path destination of the named symbolic link.
 */
export function ReadLink(
  { path }: { path: string | URL },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        return await readLink(ctx, path);
      }}
    />
  );
}

/**
 * Reads and returns the entire contents of a file as a byte buffer.
 * Reading a directory throws an error.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.readFile
 * @returns The file contents.
 */
export async function readFile(
  ctx: Context,
  path: string | URL,
): Promise<Uint8Array<ArrayBuffer>> {
  try {
    const ret = await Deno.readFile(path);
    l.trace(ctx, `Read text file ${path.toString()}`);
    return ret;
  } catch (err) {
    l.error(ctx, `Failed to read text file ${path.toString()}`);
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
    return new Uint8Array();
  }
}

/**
 * Reads and returns the entire contents of a file as an UTF-8 decoded string.
 * Reading a directory throws an error.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.readTextFile
 * @returns The file contents.
 */
export async function readTextFile(
  ctx: Context,
  path: string | URL,
): Promise<string> {
  try {
    const ret = await Deno.readTextFile(path);
    l.trace(ctx, `Read text file ${path.toString()}`);
    return ret;
  } catch (err) {
    l.error(ctx, `Failed to read text file ${path.toString()}`);
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
    return "";
  }
}

/**
 * Reads and returns the entire contents of a file as an UTF-8 decoded string.
 * Reading a directory throws an error.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.readTextFile
 * @returns Evaluates to the file contents.
 */
export function ReadTextFile(
  { path }: { path: string | URL },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        return await readTextFile(ctx, path);
      }}
    />
  );
}

/**
 * Returns the absolute normalized path, with symbolic links
 * resolved.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.realPath
 * @returns The absolute normalized path, with symbolic links resolved.
 */
export async function realPath(
  ctx: Context,
  path: string | URL,
): Promise<string> {
  try {
    const ret = await Deno.realPath(path);
    l.trace(ctx, `Got real path for ${path.toString()}: ${ret}`);
    return ret;
  } catch (err) {
    l.error(ctx, `Failed to get real path for ${path.toString()}`);
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
    return "";
  }
}

/**
 * Returns the absolute normalized path, with symbolic links
 * resolved.
 *
 * https://deno.land/api@v1.40.3?unstable=true&s=Deno.realPath
 * @returns Evaluates to the absolute normalized path, with symbolic links
 * resolved.
 */
export function RealPath(
  { path }: { path: string | URL },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        return await realPath(ctx, path);
      }}
    />
  );
}

/**
 * Removes the named file or directory.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.remove
 */
export async function remove(
  ctx: Context,
  path: string | URL,
  options?: Deno.RemoveOptions,
) {
  try {
    await Deno.remove(path, options);
    l.trace(ctx, `Removed ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });
  } catch (err) {
    l.error(ctx, `Failed to remove ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    ctx.halt();
  }
}

/**
 * Removes the named file or directory.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.remove
 * @returns The empty string.
 */
export function Remove(
  { path, options }: { path: string | URL; options?: Deno.RemoveOptions },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await remove(ctx, path, options);
        return "";
      }}
    />
  );
}

/**
 * Renames (moves) `oldpath` to `newpath`. Paths may be files or directories.
 * If `newpath` already exists and is not a directory, Rename replaces
 * it. OS-specific restrictions may apply when `oldpath` and `newpath` are in
 * different directories.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.rename
 */
export async function rename(
  ctx: Context,
  oldpath: string,
  newpath: string,
) {
  try {
    await Deno.rename(oldpath, newpath);
    l.trace(
      ctx,
      `Renamed (moved) ${styleFile(oldpath.toString())} to ${
        styleFile(newpath.toString())
      }`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to rename (move) ${styleFile(oldpath.toString())} to ${
        styleFile(newpath.toString())
      }`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Renames (moves) `oldpath` to `newpath`. Paths may be files or directories.
 * If `newpath` already exists and is not a directory, Rename replaces
 * it. OS-specific restrictions may apply when `oldpath` and `newpath` are in
 * different directories.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.rename
 * @returns The empty string.
 */
export function Rename(
  { oldpath, newpath }: { oldpath: string; newpath: string },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await rename(ctx, oldpath, newpath);
        return "";
      }}
    />
  );
}

/**
 * Creates `newpath` as a symbolic link to `oldpath`.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.symlink
 */
export async function symlink(
  ctx: Context,
  oldpath: string,
  newpath: string,
  options?: Deno.SymlinkOptions,
) {
  try {
    await Deno.symlink(oldpath, newpath, options);
    l.trace(
      ctx,
      `Created ${styleFile(newpath.toString())} as a symlinklink to ${
        styleFile(oldpath.toString())
      }`,
    );
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });
  } catch (err) {
    l.error(
      ctx,
      `Failed to create ${styleFile(newpath.toString())} as a symlinklink to ${
        styleFile(oldpath.toString())
      }`,
    );
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    ctx.halt();
  }
}

/**
 * Creates `newpath` as a symbolic link to `oldpath`.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.symlink
 * @returns The empty string.
 */
export function Symlink(
  { oldpath, newpath, options }: {
    oldpath: string;
    newpath: string;
    options?: Deno.SymlinkOptions;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await symlink(ctx, oldpath, newpath, options);
        return "";
      }}
    />
  );
}

/**
 * Truncates (or extends) the specified file, to reach the specified `len`.
 * If `len` is not specified then the entire file contents are truncated.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.truncate
 */
export async function truncate(
  ctx: Context,
  path: string,
  len?: number,
) {
  try {
    await Deno.truncate(path, len);
    l.trace(
      ctx,
      `Truncated ${path} to length ${len === undefined ? 0 : len}.`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to truncate ${path} to length ${len === undefined ? 0 : len}.`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Truncates (or extends) the specified file, to reach the specified `len`.
 * If `len` is not specified then the entire file contents are truncated.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.truncate
 * @returns The empty string.
 */
export function Truncate(
  { path, len }: { path: string; len?: number },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await truncate(ctx, path, len);
        return "";
      }}
    />
  );
}

/**
 * Changes the access (`atime`) and modification (`mtime`) times of a file
 * system object referenced by `path`. Given times are either in seconds
 * (UNIX epoch time) or as `Date` objects.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.utime
 */
export async function utime(
  ctx: Context,
  path: string | URL,
  atime: number | Date,
  mtime: number | Date,
) {
  try {
    await Deno.utime(path, atime, mtime);
    l.trace(
      ctx,
      `Changed access time and modification time of ${path.toString()} to ${atime} and ${mtime} respectively.`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to change access time and modification time of ${path.toString()} to ${atime} and ${mtime} respectively.`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Changes the access (`atime`) and modification (`mtime`) times of a file
 * system object referenced by `path`. Given times are either in seconds
 * (UNIX epoch time) or as `Date` objects.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.utime
 * @returns The empty string.
 */
export function Utime(
  { path, atime, mtime }: {
    path: string | URL;
    atime: number | Date;
    mtime: number | Date;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await utime(ctx, path, atime, mtime);
        return "";
      }}
    />
  );
}

/**
 * Write the content byte buffer to the given `path`, by default creating a new file
 * if needed, else overwriting.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.writeFile
 */
export async function writeFile(
  ctx: Context,
  path: string | URL,
  content: Uint8Array,
  options?: Deno.WriteFileOptions,
) {
  try {
    await Deno.writeFile(path, content, options);
    l.trace(ctx, `Wrote file ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });
  } catch (err) {
    l.error(ctx, `Failed to write file ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    return ctx.halt();
  }
}

/**
 * Write the content string to the given `path`, by default creating a new file
 * if needed, else overwriting.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.writeTextFile
 */
export async function writeTextFile(
  ctx: Context,
  path: string | URL,
  content: string,
  options?: Deno.WriteFileOptions,
) {
  try {
    await Deno.writeTextFile(path, content, options);
    l.trace(ctx, `Wrote file ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });
  } catch (err) {
    l.error(ctx, `Failed to write file ${path.toString()}`);
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    return ctx.halt();
  }
}

/**
 * Write the expanded child to the given `path`, by default creating a new file
 * if needed, else overwriting.
 *
 * See https://deno.land/api@v1.40.3?unstable=true&s=Deno.writeTextFile
 * @returns The expanded child.
 */
export function WriteTextFile(
  { path, options, children }: {
    path: string | URL;
    options?: Deno.WriteFileOptions;
    children?: Expressions;
  },
): Expression {
  return (
    <map
      fun={async (evaled, ctx) => {
        await writeTextFile(ctx, path, evaled, options);
        return evaled;
      }}
    >
      {expressions(children)}
    </map>
  );
}

/**
 * Copies a file or directory. The directory can have contents. Like `cp -r`.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=copy
 */
export async function copy(
  ctx: Context,
  src: string,
  dest: string,
  options?: fs.CopyOptions,
) {
  try {
    await fs.copy(src, dest, options);
    l.trace(
      ctx,
      `Copied ${styleFile(src.toString())} to ${styleFile(dest.toString())}`,
    );
    l.logGroup(ctx, () => {
      if (options) {
        l.trace(ctx, `Options: ${JSON.stringify(options)}`);
      }
    });
  } catch (err) {
    l.error(
      ctx,
      `Failed to copy ${styleFile(src.toString())} to ${
        styleFile(dest.toString())
      }`,
    );
    l.logGroup(ctx, () => {
      if (options) {
        l.error(ctx, `Options: ${JSON.stringify(options)}`);
      }
      l.error(ctx, err);
    });
    ctx.halt();
  }
}

/**
 * Copies a file or directory. The directory can have contents. Like `cp -r`.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=copy
 * @returns The empty string.
 */
export function Copy(
  { src, dest, options }: {
    src: string;
    dest: string;
    options?: fs.CopyOptions;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await copy(ctx, src, dest, options);
        return "";
      }}
    />
  );
}

/**
 * Ensures that a directory is empty. Deletes directory contents if the
 * directory is not empty. If the directory does not exist, it is created. The
 * directory itself is not deleted.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=emptyDir
 */
export async function emptyDir(
  ctx: Context,
  dir: string,
) {
  try {
    await fs.emptyDir(dir);
    l.trace(
      ctx,
      `Ensured an empty directory at ${styleFile(dir)}`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to ensure an empty directory at ${styleFile(dir)}`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Ensures that a directory is empty. Deletes directory contents if the
 * directory is not empty. If the directory does not exist, it is created. The
 * directory itself is not deleted.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=emptyDir
 * @returns The empty string.
 */
export function EmptyDir(
  { dir }: {
    dir: string;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await emptyDir(ctx, dir);
        return "";
      }}
    />
  );
}

/**
 * Ensures that the directory exists. If the directory structure does not
 * exist, it is created. Like `mkdir -p`.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureDir
 */
export async function ensureDir(
  ctx: Context,
  path: string,
) {
  try {
    await fs.ensureDir(path);
    l.trace(
      ctx,
      `Ensured that a directory exists at ${styleFile(path)}`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to ensure that a directory exists at ${styleFile(path)}`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Ensures that the directory exists. If the directory structure does not
 * exist, it is created. Like `mkdir -p`.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureDir
 * @returns The empty string.
 */
export function EnsureDir(
  { path }: {
    path: string;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await ensureDir(ctx, path);
        return "";
      }}
    />
  );
}

/**
 * Ensures that the file exists. If the file that is requested to be created is
 * in directories that do not exist, these directories are created. If the file
 * already exists, it is NOT MODIFIED.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureFile
 */
export async function ensureFile(
  ctx: Context,
  path: string,
) {
  try {
    await fs.ensureFile(path);
    l.trace(
      ctx,
      `Ensured that a file exists at ${styleFile(path)}`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to ensure that a file exists at ${styleFile(path)}`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Ensures that the file exists. If the file that is requested to be created is
 * in directories that do not exist, these directories are created. If the file
 * already exists, it is NOT MODIFIED.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureFile
 * @returns The empty string.
 */
export function EnsureFile(
  { path }: {
    path: string;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await ensureFile(ctx, path);
        return "";
      }}
    />
  );
}

/**
 * Ensures that the hard link exists. If the directory structure does not
 * exist, it is created.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureLink
 */
export async function ensureLink(
  ctx: Context,
  src: string,
  dest: string,
) {
  try {
    await fs.ensureLink(src, dest);
    l.trace(
      ctx,
      `Ensured that a link exists at ${styleFile(dest)} to ${styleFile(src)}`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to ensure that a link exists at ${styleFile(dest)} to ${
        styleFile(src)
      }`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Ensures that the hard link exists. If the directory structure does not
 * exist, it is created.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureLink
 * @returns The empty string.
 */
export function EnsureLink(
  { src, dest }: {
    src: string;
    dest: string;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await ensureLink(ctx, src, dest);
        return "";
      }}
    />
  );
}

/**
 * Ensures that the symlink exists. If the directory structure does not
 * exist, it is created.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureSymlink
 */
export async function ensureSymlink(
  ctx: Context,
  src: string,
  dest: string,
) {
  try {
    await fs.ensureSymlink(src, dest);
    l.trace(
      ctx,
      `Ensured that a symlink exists at ${styleFile(dest)} to ${
        styleFile(src)
      }`,
    );
  } catch (err) {
    l.error(
      ctx,
      `Failed to ensure that a symlink exists at ${styleFile(dest)} to ${
        styleFile(src)
      }`,
    );
    l.logGroup(ctx, () => l.error(ctx, err));
    ctx.halt();
  }
}

/**
 * Ensures that the symlink exists. If the directory structure does not
 * exist, it is created.
 *
 * See https://deno.land/std@0.63.0/fs/mod.ts?s=ensureSymlink
 * @returns The empty string.
 */
export function EnsureSymlink(
  { src, dest }: {
    src: string;
    dest: string;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await ensureSymlink(ctx, src, dest);
        return "";
      }}
    />
  );
}

/**
 * Ensures that the file does not exist.
 */
export async function ensureNot(
  ctx: Context,
  path: string,
) {
  try {
    await Deno.remove(path, { recursive: true });
    l.trace(
      ctx,
      `Ensured that there is no file (or directory) at ${styleFile(path)}`,
    );
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      l.trace(
        ctx,
        `Ensured that there is no file (or directory) at ${styleFile(path)}`,
      );
    } else {
      l.error(
        ctx,
        `Failed to ensure that there is no file (or directory) at ${
          styleFile(path)
        }`,
      );
      l.logGroup(ctx, () => l.error(ctx, err));
      ctx.halt();
    }
  }
}

/**
 * Ensures that the file does not exist.
 *
 * @returns The empty string.
 */
export function EnsureNot(
  { path }: {
    path: string;
  },
): Expression {
  return (
    <impure
      fun={async (ctx) => {
        await ensureNot(ctx, path);
        return "";
      }}
    />
  );
}
