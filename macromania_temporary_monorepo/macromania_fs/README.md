# Macromania FS

Macros for [Macromania](https://github.com/worm-blossom/macromania) to manipulate the file system. These macros essentially
wrap the
[Deno file system API](https://deno.land/api@v1.40.3?unstable=true&s=Deno.chmod)
and some convenience functions from the
[Deno fs std library](https://deno.land/std@0.63.0/fs/mod.ts). When they encounter an
error, they log a helpful error message and halt evaluation.
