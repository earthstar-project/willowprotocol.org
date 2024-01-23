import { Expression } from "macro";
import { link, lis, pinformative, site_template } from "../../main.ts";
import { create_changelog_item } from "../../../rss.ts";
import { hsection } from "../../../hsection.ts";
import { link_name } from "../../../linkname.ts";

export const changes: Expression = site_template({
	name: "changes",
	title: "News, improvements, and Necessary Changes"
}, [
	pinformative("Here, we maintain a changelog of breaking changes, and one of general site updates. You can subscribe to either via RSS."),

	hsection(
		'spec_changes', 'Necessary Changes',
		[
			pinformative("Although we consider Willow’s specifications stable, unforeseen outcomes may force us to make amendments. Rather than making this a source of exciting surprises for implementors, we prefer to list those (hopefully few) changes here. "),
			pinformative(link("RSS feed available here", "/rss_changelog.xml"), "."),
			lis(
				create_changelog_item(
					{ name: "changelog_launch", title: "Willow specification published", pubDate: new Date(2024, 0, 17, 0)},
					[pinformative("No changes yet!")],
				),
			)
		]
	),
	
	hsection(
		'news_and_updates', 'News and Updates',
		[
			pinformative("Here we’ll share bits of news relevant to the Willow protocol, as well as improvements to the site. For example, the completion of an implementation, or the addition of new explanatory text and drawings to the site. Updates will be occasional and meaningful."),
			pinformative(link("RSS feed available here", "/rss_news.xml"), "."),
			lis(
				create_changelog_item(
					{ name: "meadowcap_0_1_0", title: "meadowcap-js 0.2.0 released", pubDate: new Date(2024, 0, 23, 0)}, [
						pinformative("Our own TypeScript implementation of ", link_name("meadowcap", "Meadowcap"), " now conforms to the specification as of January 23rd, 2024. The source, documentation, and usage instructions can be found at the ", link("meadowcap-js repository", "https://github.com/earthstar-project/meadowcap-js"), ".")
					]
				),
				create_changelog_item(
					{ name: "news_launch", title: "Welcome to willowprotocol.org!", pubDate: new Date(2024, 0, 17, 0)},
					[pinformative("The site for the Willow protocol has been officially released to the public.")],
				),
			)
		]
	),
])
