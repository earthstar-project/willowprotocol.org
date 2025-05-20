// I'm so sorry I just cannot deal with the typescript module system. The only way I managed to use `path` in `./assetTransforms.tsx` was to reexport it like this in a different file. :(
// (And for clarity, this was obviously written by Aljoscha, hoping that Gwil will save him!)
export * as path from "https://deno.land/std@0.216.0/path/mod.ts";
export * as posixPath from "https://deno.land/std@0.216.0/path/posix/mod.ts";