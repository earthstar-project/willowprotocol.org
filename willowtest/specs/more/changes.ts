import { Expression } from "macro";
import { lis, pinformative, site_template } from "../../main.ts";
import { em } from "../../../h.ts";

export const changes: Expression = site_template({
	name: "changes",
	title: "Changes we had to make"
}, [
	pinformative("The family of specifications that make up Willow is stable, and we do not expect their contents to substantially change. ", em("However"), ", sometimes an unforeseen outcome will force us to make amendments to the specification. Rather than making this a source of exciting surprises for implementors, we prefer to list those (hopefully few) changes here."),
	pinformative("You can subscribe to a RSS feed of these changes."),
	// The below should be some special RSS + HTML generating macro.
	lis(
		[
			pinformative("17th January 2024. The first publication of Willow!")
		]
	),
])

/*

The lis item above should also generate an RSS feed.

https://www.xul.fr/en-xml-rss.html#building-feed

the RSS feed can be hardcoded with:

- title
- feed URL
- site URL
- description (optional)

Each item in the feed will need to specify:

- title
- date
- content

The other required attributes for a RSS item can be derived:

- url (this page + an anchor heading)
- guid (could be the date, honestly)

*/