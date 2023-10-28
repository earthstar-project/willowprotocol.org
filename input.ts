import { Expression, Invocation,  new_macro } from "./tsgen.ts";

export function read_file(filepath: Expression): Expression {
    const macro = new_macro(
      undefined,
      (fully_expanded, _ctx) => {
        const contents = Deno.readTextFileSync(fully_expanded);
        return contents;
      },
    );
    
    return new Invocation(macro, [filepath]);
}