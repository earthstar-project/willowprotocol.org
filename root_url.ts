import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";

import {
  Context,
  Expression,
  Invocation,
  is_expression,
  new_macro,
} from "./tsgen.ts";
import { out_file_absolute, write_file_absolute } from "./out.ts";

/*
General principle of creating rss feeds: use the `rss_add_item` function to add an item to some feed identified by a title (this system supports multiple feeds generated in the same build process).
Later, use the `build_rss_feeds` macro (exactly once) to aggregate all items into one xml document per feed (title).
*/

const statekey = Symbol("RootUrl");

interface RootUrlState {
    url: string;
}

export function set_root_url(url: string): Expression {
    const macro = new_macro(
        (_args, ctx) => {
            const state = ctx.state.get(statekey);

            if (state) {
                ctx.error("Tried to set root url multiple times.");
                ctx.halt();
                return "";
            } else {
                ctx.state.set(statekey, <RootUrlState> {
                    url,
                });
                return "";
            }
        }
    );
      
    return new Invocation(macro, []);
}

export function get_root_url(ctx: Context): string {
    const state = <RootUrlState> ctx.state.get(statekey);
    if (state) {
        return state.url;
    } else {
        ctx.error("Tried to access root url without setting it first.");
        ctx.halt();
        return "root url was not set";
    }
}
