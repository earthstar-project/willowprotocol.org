import { Expression } from "macro";
import { lis, pinformative, site_template } from "../../main.ts";
import { em, ul } from "../../../h.ts";
import { RssFeed } from "../../../rss.ts";
import { changelog_entry } from "../../rss_changelog.ts";

export const changes: Expression = site_template({
	name: "changes",
	title: "Changes we had to make"
}, [
	pinformative("The family of specifications that make up Willow is stable, and we do not expect their contents to substantially change. ", em("However"), ", unforeseen outcomes might force us to make amendments to the specification. Rather than making this a source of exciting surprises for implementors, we prefer to list those (hopefully few) changes here."),

	pinformative("You can subscribe to a RSS feed of these changes. TODO: tell them how!"),
	
	ul(
		changelog_entry(
			{ title: "Test", pubDate: "18 JAN 24"},
			["This is a test update, to be deleted before publishing any of this. ", em("The description of changelog entries can use macros"), ", title and pubDate cannot."],
		),

		changelog_entry(
			{ title: "Launch", pubDate: "17 JAN 24"},
			["The first publication of Willow!"],
		),
	),
])
