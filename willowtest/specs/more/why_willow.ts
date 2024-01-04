import { Expression } from "macro";
import { link, pinformative, site_template } from "../../main.ts";
import { em, p } from "../../../h.ts";
import { sidenote } from "../../../marginalia.ts";

export const why_willow: Expression = site_template(
		{
				title: "Why did we make Willow?",
				name: "why_willow",
		},
		[
				pinformative(
					"There are many kinds of ", sidenote("data network", "By ‘data network’ we mean the protocols, people, and physical infrastructure which help people share data with each other."), " in use today. What problems do existing networks cause, or fail to address?"
				),
				pinformative(
					"The most problematic and ubiquitous networks today are those run by commercial entities. It’s abundantly clear that these commercial networks are both harmful ", em("and"), " unreliable."
				),
				pinformative(
					"Their economic incentive has led to the invasive surveillance of a captive group of users who increasingly have labour and rent extracted from them."),
					
					pinformative("Naturally, there’s no money in ", em("protecting"), " users, which on a small scale has led to the unfettered harassment of individuals, and on a large scale led to social networks playing a “determining role” in ", sidenote("genocide", [
						
							[link("U.N. investigators cite Facebook role in Myanmar crisis", "https://www.reuters.com/article/us-myanmar-rohingya-facebook/u-n-investigators-cite-facebook-role-in-myanmar-crisis-idUSKCN1GO2PN/"), " Reuters, 12th March 2018. "]
						,
						[link("Meta in Myanmar", "https://erinkissane.com/meta-in-myanmar-part-i-the-setup"), " Erin Kissane, 28th September 2023."]
					]), "."
				),
				pinformative(
					"The dominant form of data network is also the most frail. These networks are housed in enormous data centres which require ", sidenote("exponentially", [
						link("Energy Consumption of Datacenters", "https://media.ccc.de/v/37c3-11796-energy_consumption_of_datacenters"), " Thomas Fricke, 27th December 2023."
					]), " increasing amounts of electricity and (often potable) water to operate. These facilities are brittle in the face of resource shortages, climate disaster, and are easily seized in times of political upheaval. They consume resources without moderation while an increasingly uncertain future comes into being around us."
				),
				pinformative(
					"Removing commercial interest from a network drastically improves things. Federated networks (‘the fediverse’) offer a compelling alternative. But the architecture of federated servers puts pressure on (largely unpaid) volunteers to provide social and technical labour as server administrators. These always-online servers also rely on the same fragile infrastructure the commercial networks do."
				),
				pinformative(
					"Further atomising the network brings us to peer-to-peer networking, where the burden of providing a network’s infrastructure is divided among its own users and their devices."
				),
				pinformative(
					"Unfortunately, this arrangement is far more complicated than querying a single source of truth. In a bid to wrangle this complexity, many peer-to-peer protocol designers traded away basic features like editing and deletion, demurred on privacy, and employed data structures which are only capable of growing larger and larger. There is also an apparent preoccupation with global-scale networks to the exclusion of smaller, private ones."
				),
				pinformative(
					"This is the problem space we wanted to reckon with."
		), pinformative("We want Willow to be a credible solution to digital networking in an uncertain era. We wanted a protocol which could make running a network together a sustainable practice. We wanted a protocol resilient to inevitable change, and respectful of the resources we have."
				),
		],
);