import { Expression } from "macro";
import { link, path, pinformative, quotes, site_template } from "../../main.ts";
import { code, em, hr } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { r, rs } from "../../../defref.ts";
import { marginale, sidenote } from "../../../marginalia.ts";
import { link_name } from "../../../linkname.ts";

export const why_willow: Expression = site_template(
		{
				title: "Why Did We Make Willow?",
				name: "why_willow",
		},
		[
				pinformative("With so many existing protocols for data networks out there, why would we make Willow?"),
				pinformative("We believe we’ve found a novel combination of techniques which allows Willow to satisfy many vital — and competing — criteria all at once."),
				pinformative("We made Willow to make running a network ", em("together"), " a sustainable practice. A protocol which enables a plurality of small, private networks alongside big, public ones. A protocol where the burden of running infrastructure is divided among its users, with no need for volunteer server admins."),
				pinformative("We made Willow to be a credible solution to digital networking in an uncertain era. It must be resilient in the times we’re ", em("forced"), " to scale down, whether that’s due to a temporary loss of signal, natural disaster, or war. It must be respectful of the resources we’re left with, and able to run on low-spec hardware and on low-bandwidth networks."),
				pinformative("We made Willow to be private, so that it’s possible to find people with common interests without broadcasting those interests to the world, and so that it’s possible to let others distribute data on your behalf without letting them know what that data ", em("is"), "."),
				pinformative("We made Willow to reconcile peer-to-peer networks with social realities. Wrangling the complexity of distributed systems shouldn’t mean we trade away basic features like deletion, or accept data structures which can only grow without limit."),
				pinformative("We made Willow to do something to the best of our ability, and in the light of the kind of world we’d like to see."),

				hr(),

				pinformative("For more detailed comparisons to various other protocols, see ", link_name("willow_compared", "here"), "."),
		],
);
