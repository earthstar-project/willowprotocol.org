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

const statekey = Symbol("Rss");

interface RssState {
    feeds: Map<string, RssItem[]>;
}

function rss_state(ctx: Context): RssState {
    const state = ctx.state.get(statekey);

    if (state) {
        return <RssState> state;
    } else {
        ctx.state.set(statekey, <RssState>{
        feeds: new Map(),
        });
        return rss_state(ctx);
    }
}

export function rss_add_item(feed_title: string, item: RssItem, ctx: Context) {
    const state = rss_state(ctx);

    const feed = state.feeds.get(feed_title);

    if (feed) {
        feed.push(item);
    } else {
        state.feeds.set(feed_title, [item]);
    }
}

export interface RssFeedConfig {
    // Absolute path at which to place the xml file (uses `write_file_absolute`).
    path: string[];
    // Sets the elements of the xml <channel> element. The title determines which of the items from prior `rss_add_item` calls get added to this feed.
    feed_info: RssFeed;
}

export function build_rss_feeds(feeds: RssFeedConfig[]): Expression {
    const macro = new_macro(
      (_args, ctx) => {
        const state = rss_state(ctx);

        const rendered_titles = new Set();

        const rendered_feeds: Expression[] = [];
        for (const feed of feeds) {
            rendered_titles.add(feed.feed_info.title);

            let items = state.feeds.get(feed.feed_info.title);
            if (!items) {
                items = [];
            }

            rendered_feeds.push(
                out_file_absolute(["build", ...feed.path], feed_to_xml(feed.feed_info, items)),
            );
        }

        for (const title of state.feeds.keys()) {
            if (!rendered_titles.has(title)) {
                ctx.error(`Created an item for an rss feed ${Colors.green(title)}, but no such feed was rendered.`);
                ctx.halt();
                return "";
            }
        }

        return rendered_feeds;
      }
    );
    
    return new Invocation(macro, []);
}

// According to https://www.rssboard.org/rss-specification
export interface RssFeed {
    /* mandatory */

    // The name of the channel. It's how people refer to your service. If you have an HTML website that contains the same information as your RSS file, the title of your channel should be the same as the title of your website.
    title: string;

    // The URL to the HTML website corresponding to the channel.
    link: string;

    // Phrase or sentence describing the channel.
    description: string;

    /* optional */

    // The language the channel is written in. This allows aggregators to group all Italian language sites, for example, on a single page. A list of allowable values for this element, as provided by Netscape, is [here](https://www.rssboard.org/rss-language-codes). You may also use values defined by the [W3C](https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes).
    language?: string;

    // Copyright notice for content in the channel.
    copyright?: string;

    // Email address for person responsible for editorial content.
    managingEditor?: string;

    // Email address for person responsible for technical issues relating to channel.
    webMaster?: string;

    /* Created automatically by the macros, set to the pubDate of the topmost item. */
    // The publication date for the content in the channel. For example, the New York Times publishes on a daily basis, the publication date flips once every 24 hours. That's when the pubDate of the channel changes. All date-times in RSS conform to the Date and Time Specification of [RFC 822](https://datatracker.ietf.org/doc/html/rfc822#section-5), with the exception that the year may be expressed with two characters or four characters (four preferred).
    // pubDate?: string;
    /* Created automatically by the macros, set to the pubDate of the topmost item. */

    /* Created automatically by the macros, set to the pubDate of the topmost item. */
    // The last time the content of the channel changed.
    // lastBuildDate?: string;
    /* Created automatically by the macros, set to the pubDate of the topmost item. */

    // Specify one or more categories that the channel belongs to. Follows the same rules as the <item>-level [category](https://www.rssboard.org/rss-specification#ltcategorygtSubelementOfLtitemgt) element. More [info](https://www.rssboard.org/rss-specification#syndic8).
    category?: RssCategory[];

    // A string indicating the program used to generate the channel.
    generator?: string;

    // A URL that points to the [documentation](https://www.rssboard.org/rss-specification) for the format used in the RSS file. It's probably a pointer to this page. It's for people who might stumble across an RSS file on a Web server 25 years from now and wonder what it is.
    docs?: string;

    // Allows processes to register with a cloud to be notified of updates to the channel, implementing a lightweight publish-subscribe protocol for RSS feeds. More info [here](https://www.rssboard.org/rss-specification#ltcloudgtSubelementOfLtchannelgt).
    cloud?: string;

    // ttl stands for time to live. It's a number of minutes that indicates how long a channel can be cached before refreshing from the source. More info [here](https://www.rssboard.org/rss-specification#ltttlgtSubelementOfLtchannelgt).
    ttl?: number;

    // Specifies a GIF, JPEG or PNG image that can be displayed with the channel. More info [here](https://www.rssboard.org/rss-specification#ltimagegtSubelementOfLtchannelgt).
    image?: RssImage;

    // The [PICS](https://www.w3.org/PICS/) rating for the channel.
    rating?: string;

    //	Specifies a text input box that can be displayed with the channel. More info [here](https://www.rssboard.org/rss-specification#lttextinputgtSubelementOfLtchannelgt).
    textInput?: RssTextInput;

    // A hint for aggregators telling them which hours they can skip. This element contains up to 24 <hour> sub-elements whose value is a number between 0 and 23, representing a time in GMT, when aggregators, if they support the feature, may not read the channel on hours listed in the <skipHours> element. The hour beginning at midnight is hour zero.
    skipHours?: number[];

    // A hint for aggregators telling them which days they can skip. This element contains up to seven <day> sub-elements whose value is Monday, Tuesday, Wednesday, Thursday, Friday, Saturday or Sunday. Aggregators may not read the channel during days listed in the <skipDays> element.
    skipDays?: Day[];
}

interface RssCategory {
    // A string that identifies a categorization taxonomy.
    domain?: string;
    // The value of the element is a forward-slash-separated string that identifies a hierarchic location in the indicated taxonomy. Processors may establish conventions for the interpretation of categories.
    category: string;
}

interface RssImage {
    // Is the URL of a GIF, JPEG or PNG image that represents the channel.
    url: string;
    // Describes the image, it's used in the ALT attribute of the HTML <img> tag when the channel is rendered in HTML.
    title: string;
    // Is the URL of the site, when the channel is rendered, the image is a link to the site. (Note, in practice the image <title> and <link> should have the same value as the channel's <title> and <link>.
    link: string;
    // Number, indicating the width of the image in pixels.
    width?: number;
    // Number, indicating the height of the image in pixels.
    height?: number;
    // Contains text that is included in the TITLE attribute of the link formed around the image in the HTML rendering.
    description?: string;
}

// A channel may optionally contain a <textInput> sub-element, which contains four required sub-elements.
//
// The purpose of the <textInput> element is something of a mystery. You can use it to specify a search engine box. Or to allow a reader to provide feedback. Most aggregators ignore it.
interface RssTextInput {
    // The label of the Submit button in the text input area.
    title: string;
    // Explains the text input area.
    description: string;
    // The name of the text object in the text input area.
    name: string;
    // The URL of the CGI script that processes text input requests.
    link: string;
}

enum Day {
    Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday,
}

// A channel may contain any number of <item>s. An item may represent a "story" -- much like a story in a newspaper or magazine; if so its description is a synopsis of the story, and the link points to the full story. An item may also be complete in itself, if so, the description contains the text (entity-encoded HTML is allowed; see [examples](https://www.rssboard.org/rss-encoding-examples)), and the link and title may be omitted. All elements of an item are optional, however at least one of title or description must be present.
interface RssItem {
    // The title of the item.
    title?: string;

    // The URL of the item.
    link?: string;

    // The item synopsis.
    description?: string;

    // Email address of the author of the item.
    //
    // It's the email address of the author of the item. For newspapers and magazines syndicating via RSS, the author is the person who wrote the article that the <item> describes. For collaborative weblogs, the author of the item might be different from the managing editor or webmaster. For a weblog authored by a single individual it would make sense to omit the <author> element.
    author?: string;

    // Includes the item in one or more categories.
    categories?: RssCategory[];

    // URL of a page for comments relating to the item. More about comments [here](https://www.rssboard.org/rss-weblog-comments-use-case).
    comments?: string;

    // Describes a media object that is attached to the item.
    enclosure?: RssEnclosure;

    // A string that uniquely identifies the item.
    guid?: RssGuid;

    // Indicates when the item was published.
    // Its value is a [date]((https://datatracker.ietf.org/doc/html/rfc822#section-5)), indicating when the item was published. If it's a date in the future, aggregators may choose to not display the item until that date.
    pubDate?: string;

    // The RSS channel that the item came from. 
    source?: RssSource;
}

// Describes a media object that is attached to an item.
interface RssEnclosure {
    // says where the enclosure is located, must be an http url
    url: string;

    // says how big it is in bytes
    length: number;

    // says what its type is, a standard MIME type
    type: string;
}

// Guid stands for globally unique identifier. It's a string that uniquely identifies the item. When present, an aggregator may choose to use this string to determine if an item is new.
interface RssGuid {
    // There are no rules for the syntax of a guid. Aggregators must view them as a string. It's up to the source of the feed to establish the uniqueness of the string.
    guid: string;

    // If the guid element has an attribute named isPermaLink with a value of true, the reader may assume that it is a permalink to the item, that is, a url that can be opened in a Web browser, that points to the full item described by the <item> element.
    isPermaLink: boolean;
}

// The purpose of this element is to propagate credit for links, to publicize the sources of news items. It can be used in the Post command of an aggregator. It should be generated automatically when forwarding an item from an aggregator to a weblog authoring tool.
interface RssSource {
    // The name of the RSS channel that the item came from, derived from its <title>.
    source: string;

    // Links to the XMLization of the source.
    url: string;
}

// Yes, this code is extremely simplistic and could be made more compact. 
function feed_to_xml(feed: RssFeed, items: RssItem[]): string {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>${feed.title}</title>
<link>${feed.link}</link>
<description>${feed.description}</description>${feed.language ? `\n<language>${feed.language}</language>` : ""}${feed.copyright ? `\n<copyright>${feed.copyright}</copyright>` : ""}${feed.managingEditor ? `\n<managingEditor>${feed.managingEditor}</managingEditor>` : ""}${feed.webMaster ? `\n<webMaster>${feed.webMaster}</webMaster>` : ""}${items.length > 0 && items[0].pubDate ? `\n<pubDate>${items[0].pubDate}</pubDate>` : ""}${items.length > 0 && items[0].pubDate ? `\n<lastBuildDate>${items[0].pubDate}</lastBuildDate>` : ""}${feed.category ? `\n<category>${feed.category.map(category_to_xml).join("\n")}</category>` : ""}${feed.generator ? `\n<generator>${feed.generator}</generator>` : ""}${feed.docs ? `\n<docs>${feed.docs}</docs>` : ""}${feed.cloud ? `\n<cloud>${feed.cloud}</cloud>` : ""}${feed.ttl != undefined ? `\n<ttl>${feed.ttl}</ttl>` : ""}${feed.image ? `\n<image>${image_to_xml(feed.image)}</image>` : ""}${feed.rating ? `\n<rating>${feed.rating}</rating>` : ""}${feed.textInput ? `\n<textInput>${feed.textInput}</textInput>` : ""}${feed.skipHours ? `\n<skipHours>${feed.skipHours.map(hour => `<hour>${hour}</hour>`)}</skipHours>` : ""}${feed.skipDays ? `\n<skipDays>${feed.skipDays.map(day_to_xml)}</skipDay>` : ""}
${items.map(item => `${item_to_xml(item)}\n`)}</channel>
</rss>`;
}

function category_to_xml(category: RssCategory): string {
    return `<category${category.domain ? ` domain="${category.domain}"` : ""}>${category.category}</category>`;
}

function image_to_xml(image: RssImage): string {
    return `<image>
<url>${image.url}</url>
<title>${image.title}</title>
<link>${image.link}</link>${image.width ? `\n<width>${image.width}</width>` : ""}${image.height ? `\n<height>${image.height}</height>` : ""}${image.description ? `\n<description>${image.description}</description>` : ""}
</image>`;
}

function day_to_xml(day: Day): string {
    let day_string = "Monday";
    if (day === Day.Tuesday) {
        day_string = "Tuesday";
    } else if (day === Day.Wednesday) {
        day_string = "Wednesday";
    } else if (day === Day.Thursday) {
        day_string = "Thursday";
    } else if (day === Day.Friday) {
        day_string = "Friday";
    } else if (day === Day.Saturday) {
        day_string = "Saturday";
    } else if (day === Day.Sunday) {
        day_string = "Sunday";
    }

    return `<day>${day_string}</day>`;
}

function item_to_xml(item: RssItem): string {
    return `<item>${item.title ? `\n<title>${item.title}</title>` : ""}${item.link ? `\n<link>${item.link}</link>` : ""}${item.description ? `\n<description>${item.description}</description>` : ""}${item.author ? `\n<author>${item.author}</author>` : ""}${item.categories ? `\n<categories>${item.categories.map(category_to_xml).join("\n")}</categories>` : ""}${item.comments ? `\n<comments>${item.comments}</comments>` : ""}${item.enclosure ? `\n<enclosure>${enclosure_to_xml(item.enclosure)}</enclosure>` : ""}${item.guid ? `\n<guid>${guid_to_xml(item.guid)}</guid>` : ""}${item.pubDate ? `\n<pubDate>${item.pubDate}</pubDate>` : ""}${item.source ? `\n<source>${source_to_xml(item.source)}</source>` : ""}
</item>`;
}

function enclosure_to_xml(enclosure: RssEnclosure): string {
    return `<enclosure>
<url>${enclosure.url}</url>
<length>${enclosure.length}</length>
<type>${enclosure.type}</type>
</enclosure>`;
}

function guid_to_xml(category: RssGuid): string {
    return `<guid ${category.isPermaLink ? `isPermaLink="true"` : `isPermaLink="false"`}>${category.guid}</guid>`;
}

function source_to_xml(source: RssSource): string {
    return `<source url="${source.url}">${source.source}</source>`;
}