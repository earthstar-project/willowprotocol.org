// import { def_key } from "../defref.ts";
// import { a, li, span } from "../h.ts";
// import { get_root_directory } from "../linkname.ts";
// import { new_name } from "../names.ts";
// import { write_file_absolute } from "../out.ts";
// import { get_root_url } from "../root_url.ts";
// import { rss_add_item } from "../rss.ts";
// import {
//     Context,
//     Expression,
//     Invocation,
//     new_macro,
// } from "../tsgen.ts";

// import { createHash } from "npm:sha256-uint8array";

// export interface RssFeedItemMeta {
//     name: string,
//     title?: string,
//     pubDate: Date,
//     format?: Intl.DateTimeFormat,
// }

// export function create_rss_item(item: RssFeedItemMeta, description: Expression): Expression {
//     const macro = new_macro(
//       undefined,

//       (expanded, ctx) => {
//         rss_add_item("Willow Protocol Changelog", {
//             title: item.title,
//             link: build_url(item.name, ctx),
//             description: `<![CDATA[${expanded}]]>`,
//             pubDate: item.pubDate,
//             guid: {
//                 guid: build_url(item.name, ctx),
//                 isPermaLink: true,
//             },
//         }, ctx);

//         const state = new_name(item.name, "def", ctx);
//         if (state === null) {
//             return "";
//         } else {
//             state.set(def_key, {
//                 id: item.name,
//                 singular: item.title ? item.title : item.name,
//                 clazz: "rssItem",
//             });
//         }

//         const rendered = render_rss_feed_item(item, expanded);

//         write_file_absolute(
//             [...get_root_directory(ctx), "previews", `${item.name}.html`],
//             rendered,
//             ctx,
//           );

//           // Create etag.
//           const hash = createHash().update(rendered).digest("hex");

//           write_file_absolute(
//             [...get_root_directory(ctx), "previews", `${item.name}.etag`],
//             hash,
//             ctx,
//           );

//         return rendered;
//       }
//     );
    
//     return new Invocation(macro, [description]);
// }

// function build_url(id: string, ctx: Context): string {
//     return `${get_root_url(ctx)}more/changes/index.html#${id}`;
// }

// const default_format = new Intl.DateTimeFormat("en-GB");

// function render_rss_feed_item(item: RssFeedItemMeta, description: string): string {
//     const title = item.title ? item.title : item.name;
//     const format = item.format ? item.format : default_format;

//     return `<div class="rssItem">
//     <time>${format.format(item.pubDate)}</time>
//     <a class="render_rss_feed_itemTitle" id="${item.name}" href="#${item.name}">${title}</a>
//     <div class="render_rss_feed_itemDescription">${description}</div>        
// </div>`;
// }