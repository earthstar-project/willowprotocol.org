import { createSubstate, Expression } from "macromania";
import { createLogger } from "macromania-logger";
import { Cd, File } from "macromania-outfs";
import { serverPath, serverUrl } from "macromania-webserverroot";
import {
  RssCategory,
  RssEnclosure,
  RssFeed as IRssFeed,
  RssFeedProps,
  RssGuid,
  RssImage,
  RssItem as RssFeedItem,
  RssItemProps,
  RssSource,
  RssState,
} from "./types.ts";
import { join } from "@std/path";

const l = createLogger("LoggerRss");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerNamesId };

const [getRssState] = createSubstate<RssState>(() => ({
  activeFeeds: new Set(),
  feeds: new Map(),
  items: new Map(),
}));

// TODO: Make error messages *perfect*

export function RssFeed(
  { children, name, path, ...rest }: RssFeedProps,
): Expression {
  return (
    <lifecycle
      pre={(ctx) => {
        const state = getRssState(ctx);

        if (state.feeds.has(name)) {
          l.error(
            ctx,
            `RSS feed name used not unique: ${name}`,
          );
          return ctx.halt();
        }

        state.activeFeeds.add(name);
      }}
      post={(ctx) => {
        const state = getRssState(ctx);
        state.activeFeeds.delete(name);
      }}
    >
      <map
        fun={(evaledChildren, ctx) => {
          const serverRoot = serverUrl(ctx);

          if (serverRoot === null) {
            l.error(
              ctx,
              `"Could not determine a server root URL. Please use the <ServerRoot /> macro."`,
            );
            return ctx.halt();
          }

          const state = getRssState(ctx);

          const feedItems = state.feeds.get(name);

          if (!feedItems) {
            l.error(
              ctx,
              `"Weird error: RSS state for feed: ${name} not found. You may not have added any <RssItem>s yet.`,
            );
            return ctx.halt();
          }

          const items = [];

          for (const itemName of feedItems) {
            const item = state.items.get(itemName);

            if (!item) {
              l.error(
                ctx,
                `"Weird error: RSS state for item: ${itemName} not found!`,
              );
              return ctx.halt();
            }

            items.push(item);
          }

          const feed = feedXml({
            ...rest,
            link: `${serverUrl(ctx)}/${serverPath(ctx)}`,
          }, items);

          if (path.components.length === 0) {
            l.error(
              ctx,
              `"Path given for feed ${name} must not be empty.`,
            );
            return ctx.halt();
          }

          const dirComponents = path.components.slice(
            0,
            path.components.length - 2,
          );

          const dirPath = {
            relativity: path.relativity,
            components: dirComponents,
          };

          const fileName = path.components[path.components.length - 1];

          return (
            <>
              <omnomnom>
                <Cd path={dirPath}>
                  <File name={fileName} mode="assertive">{feed}</File>
                </Cd>
              </omnomnom>
              {evaledChildren}
            </>
          );
        }}
      >
        <exps x={children} />
      </map>
    </lifecycle>
  );
}

export function RssItem(
  { children, title, author, pubDate, name, link }: RssItemProps,
): Expression {
  return (
    <>
      <map
        fun={(evaledChildren, ctx) => {
          const url = link && URL.canParse(link)
            ? link
            : `${serverUrl(ctx) || ""}/${
              join(
                ...serverPath(ctx),
                link || "",
              )
            }`;

          const item: RssFeedItem = {
            title,
            author,
            pubDate,
            link,
            description: `<![CDATA[${evaledChildren}]]>`,
            guid: {
              guid: url,
              isPermaLink: true,
            },
          };

          const state = getRssState(ctx);

          if (state.items.has(name)) {
            l.warn(
              ctx,
              `"RSS item name used not unique: ${name}`,
            );
            //return ctx.halt();
          }

          state.items.set(name, item);

          for (const feedId of state.activeFeeds) {
            const feedItems = state.feeds.get(feedId);

            if (feedItems) {
              feedItems.add(name);
            } else {
              state.feeds.set(feedId, new Set([name]));
            }
          }

          return evaledChildren;
        }}
      >
        <exps x={children} />
      </map>
    </>
  );
}

function mel(el: string, value: string | undefined): string {
  return value ? `<${el}>${value}</${el}>` : "";
}

function mlines(...lines: string[]): string {
  return lines.filter((line) => line !== "").join("\n");
}

function feedXml(feed: IRssFeed, items: RssFeedItem[]): string {
  return mlines(
    `<?xml version="1.0" encoding="UTF-8" ?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `<channel>`,
    `<title>${(feed.title)}</title>`,
    `<link>${feed.link}</link>`,
    `<description>${feed.description}</description>`,
    feed.atomSelf
      ? `\n<atom:link href="${feed.atomSelf}" rel="self" type="application/rss+xml" />`
      : "",
    mel("language", feed.language),
    mel("copyright", feed.copyright),
    mel("managingEditor", feed.managingEditor),
    items.length > 0 && items[0].pubDate
      ? `<pubDate>${formatDateRfc822(items[0].pubDate)}</pubDate>`
      : "",
    items.length > 0 && items[0].pubDate
      ? `<lastBuildDate>${formatDateRfc822(items[0].pubDate)}</lastBuildDate>`
      : "",
    feed.category ? `${feed.category.map(categoryXml).join("\n")}` : "",
    mel("generator", feed.generator),
    mel("docs", feed.docs),
    mel("cloud", feed.cloud),
    mel("ttl", feed.ttl ? `${feed.ttl}` : undefined),
    feed.image ? imageXml(feed.image) : "",
    mel("rating", feed.rating),
    mel(
      "skiphours",
      feed.skipHours?.map((hour) => `<hour>${hour}</hour>`).join("\n"),
    ),
    mel(
      "skipDays",
      feed.skipDays?.map((day) => `<day>${day}</day>`).join("\n"),
    ),
    items.map((item) => itemXml(item)).join("\n"),
    "</channel>",
    "</rss>",
  );
}

function itemXml(item: RssFeedItem): string {
  return mlines(
    `<item>`,
    mel("title", item.title),
    mel("link", item.link),
    mel("description", item.description),
    mel("author", item.author),
    mel("categories", item.categories?.map(categoryXml).join("\n") || ""),
    mel("comments", item.comments),
    item.enclosure ? enclosureXml(item.enclosure) : "",
    item.guid ? guidXml(item.guid) : "",
    mel("pubDate", formatDateRfc822(item.pubDate!)),
    item.source ? sourceXml(item.source) : "",
    `</item>`,
  );
}

function imageXml(image: RssImage): string {
  return `<image>
<url>${image.url}</url>
<title>${image.title}</title>
<link>${image.link}</link>${
    image.width ? `\n<width>${image.width}</width>` : ""
  }${image.height ? `\n<height>${image.height}</height>` : ""}${
    image.description ? `\n<description>${image.description}</description>` : ""
  }
</image>`;
}

function categoryXml(category: RssCategory): string {
  return `<category${
    category.domain ? ` domain="${category.domain}"` : ""
  }>${category.category}</category>`;
}

function enclosureXml(enclosure: RssEnclosure): string {
  return `<enclosure>
<url>${enclosure.url}</url>
<length>${enclosure.length}</length>
<type>${enclosure.type}</type>
</enclosure>`;
}

function guidXml(category: RssGuid): string {
  return `<guid ${
    category.isPermaLink ? `isPermaLink="true"` : `isPermaLink="false"`
  }>${category.guid}</guid>`;
}

function sourceXml(source: RssSource): string {
  return `<source url="${source.url}">${source.source}</source>`;
}

function formatDateRfc822(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-gb", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(date);
  const getPart = getDatePart(parts);

  return `${getPart("weekday")}, ${getPart("day")} ${getPart("month")} ${
    getPart("year")
  } ${getPart("hour")}:${getPart("minute")}:${getPart("second")} ${
    getPart("timeZoneName")
  }`;
}

function getDatePart(parts: Intl.DateTimeFormatPart[]) {
  return (name: string) => parts.find((part) => part.type === name)?.value;
}
