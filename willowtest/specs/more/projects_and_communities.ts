import { Expression } from "macro";
import { link, lis, pinformative, site_template } from "../../main.ts";
import { hsection } from "../../../hsection.ts";
import { r } from "../../../defref.ts";
import { link_name } from "../../../linkname.ts";
import { hr } from "../../../h.ts";

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
					pinformative("Willow is brought to you by the ", link("Earthstar Project", "https://earthstar-project.org"), ". We aim to provide implementations of Willow specifications in both TypeScript and Rust."),
					pinformative("We have complete TypeScript implementations of Meadowcap and Willow (comprising the ", link_name("data_model", "Willow Data Model"), ", ", link_name("sync", "Willow General Purpose Sync protocol"), ", and ", link_name("sideloading", "Willow Sideloading protocol"), "). These implementations have been funded by ", link("NGI Assure", "https://nlnet.nl/assure/"), ":"),
					lis(
						link("meadowcap-js", "https://github.com/earthstar-project/meadowcap-js"),
						link("willow-js", "https://github.com/earthstar-project/willow-js"),		
					),
					
					pinformative("We are currently working on ", link("Rust implementations of the Willow specifications", "https://github.com/earthstar-project/willow-rs"), ", with our work funded by ", link("NGI Core", "https://nlnet.nl/core/"), ". As the time of writing, we have released the following crates:"),
					lis(
						link("willow-data-model", "https://docs.rs/willow-data-model/0.1.0/willow_data_model/"),
						link("meadowcap", "https://docs.rs/meadowcap/0.1.0/meadowcap/")
					),
				]),
				
				hsection("iroh_implementations", "Iroh", [
					pinformative("Iroh is an open-source framework for p2p applications adopting the ", link_name("data_model", "Willow Data Model"), ", ", link_name("meadowcap", "Meadowcap"), ", and the ", link_name("sync", "Willow General Purpose Sync protocol"), ". They are users and contributors to our Rust implementations."),
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