import { Expression } from "macro";
import { pinformative, site_template } from "../../main.ts";
import { em, ul } from "../../../h.ts";
import { create_rss_item } from "../../../rss.ts";
import { r } from "../../../defref.ts";

export const changes: Expression = site_template({
	name: "changes",
	title: "Changes we had to make"
}, [
	pinformative("The family of specifications that make up Willow is stable, and we do not expect their contents to substantially change. ", em("However"), ", unforeseen outcomes might force us to make amendments to the specification. Rather than making this a source of exciting surprises for implementors, we prefer to list those (hopefully few) changes here."),

	pinformative("You can subscribe to a RSS feed of these changes. TODO: tell them how!"),
	
	ul(
		create_rss_item(
			{ name: "rss_test_name", title: "Test Display Name", pubDate: new Date(2024, 0, 18, 0)},
			["This is a test update, to be deleted before publishing any of this. ", em("The description of changelog entries can use macros"), ", title, name and pubDate cannot."],
		),

		create_rss_item(
			{ name: "rss_launch", title: "Launch", pubDate: new Date(2024, 0, 17, 0)},
			["The first publication of Willow!"],
		),
	),

	pinformative("Can we reference rss feed items? We sure can: ", r("rss_launch"), " and ", r("rss_test_name"), "!"),
])
