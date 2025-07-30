import { Expression } from "macromania";
import { readTextFile } from "macromania-fs";
import { join } from "@std/path";
import {
  BundledLanguage,
  bundledLanguages,
  BundledTheme,
  bundledThemes,
  CodeToHastOptions,
  createHighlighter,
} from "npm:shiki@^3.6.0";

const highlighter = await createHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
});

export type ShikiProps = {
  /** Where the code is imported from */
  path: string[];
} & CodeToHastOptions<BundledLanguage, BundledTheme>;

export function Shiki({ path, ...rest }: ShikiProps): Expression {
  return (
    <impure
      fun={async (ctx) => {
        const cwd = Deno.cwd();
        const realPath = join(cwd, ...path);
        const code = await readTextFile(ctx, realPath);
        const html = highlighter.codeToHtml(code, rest);

        return html;
      }}
    />
  );
}
