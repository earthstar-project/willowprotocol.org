import { a, li, span } from "../h.ts";
import { get_root_url } from "../root_url.ts";
import { rss_add_item } from "../rss.ts";
import {
    Context,
    Expression,
    Invocation,
    new_macro,
} from "../tsgen.ts";

export interface ChangelogEntryMetadata {
    title: string;
    pubDate: Date;
}

function build_url(id: string, ctx: Context): string {
    return `${get_root_url(ctx)}more/changes/index.html#${id}`;
}

export function changelog_entry(meta: ChangelogEntryMetadata, description: Expression): Expression {
    const id = date_to_id(meta.pubDate);

    const macro = new_macro(
      undefined,

      (expanded, ctx) => {
        rss_add_item("Willow Protocol Changelog", {
            title: meta.title,
            link: build_url(id, ctx),
            description: `<![CDATA[${expanded}]]>`,
            pubDate: meta.pubDate,
            guid: {
                guid: build_url(id, ctx),
                isPermaLink: true,
            },
        }, ctx);

        return `<li class="changelogEntry">
    <time>${meta.pubDate}</time>
    <a class="changelogTitle" id="${id}" href="#${id}">${meta.title}</a>
    <span class="changelogDescription">${expanded}</span>        
</li>`;
      }
    );
    
    return new Invocation(macro, [description]);
}

function date_to_id(date: Date): string {
    return `${date.toUTCString().replace(/ /g, '')}`;
}