import { Expression } from "macro";
import { link, lis, pinformative, site_template } from "../../main.ts";
import { hsection } from "../../../hsection.ts";
import { r } from "../../../defref.ts";
import { link_name } from "../../../linkname.ts";

export const projects_and_communities: Expression = site_template(
		{
				title: "Active Projects and Communities",
				name: "projects_and_communities",
		},
		[
			pinformative("Below is an overview of active projects related to Willow, as well as some links to places where you can connect with other people interested in the project."),
			hsection('willow_implementations', "Implementations", [
				pinformative("There are several funded, open source implementations of Willow being worked on."),
				pinformative("If you would like to implement Willow in your favourite language, we’ll gladly answer any questions you may have! Please see the ", link_name("community_and_contact", "community and contact"), " section below for some ways of getting in touch."),
				
				hsection("earthstar_project_implementations", "Earthstar Project", [
					pinformative("Willow is brought to you by the Earthstar Project. We are working on implementations of Willow in both TypeScript and Rust."),
					pinformative("We are close to being finished with the TypeScript implementations of Meadowcap and Willow. These implementations have been funded by ", link("NGI Assure", "https://nlnet.nl/assure/"), "."),
					lis(
						link("meadowcap-js", "https://github.com/earthstar-project/meadowcap-js"),
						link("willow-js", "https://github.com/earthstar-project/willow-js"),		
					),
					pinformative("Once the Typescript implementations are done, Earthstar will become a Willow protocol sometime in the first half of 2024."),
					lis(
						link("Earthstar website", "https://earthstar-project.org"),
						link("Earthstar repo", "https://github.com/earthstar-project/earthstar"),
					),
					pinformative("In the first half of 2024 we will begin working on a Rust implementation funded by ", link("NGI Core", "https://nlnet.nl/core/"), ". This will include Meadowcap, the Willow Data Model, and the Willow General Sync Protocol.")
				]),
				
				hsection("iroh_implementations", "Iroh", [
					pinformative("Iroh is a sync protocol using the Willow data model. It has a high-performance Rust implementation, and is open source."),
					lis(
						link("Iroh website", "https://iroh.computer"),
						link("Iroh repo", "https://github.com/n0-computer/iroh")
					)
				])
			]),
			hsection("community_and_contact", "Community and Contact", [
				lis(
					link("Email us",  "mailto:mail@aljoscha-meyer.de,sam@gwil.garden"),
					link("Earthstar Project Open Collective", "https://opencollective.com/earthstar"),
					link("Earthstar Project Discord", "https://discord.gg/6NtYzQC2G4"),
					link("gwil on Mastodon", "https://post.lurk.org/@gwil"),
				)
			]),
			hsection("this_website", "This site", [
				pinformative("This website is also an active project. The repository for it can be found ", link("here", "https://github.com/earthstar-project/willowprotocol.org"), ". We appreciate all feedback from typos, to stumbling blocks, or any errant American English spellings you find.")
			])
		],
);