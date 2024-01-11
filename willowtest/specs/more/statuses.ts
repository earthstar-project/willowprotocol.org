import { Expression } from "macro";
import { pinformative, site_template } from "../../main.ts";
import { def } from "../../../defref.ts";

export const spec_statuses: Expression = site_template(
		{
				title: "Specification Statuses",
				name: "spec_statuses",
		},
		[
				pinformative(def({
					id: 'status_final',
					singular: "Final",
				}, 'Final'), " means it’s really done."),
				
				pinformative(def({
					id: 'status_candidate',
					singular: "Candidate",
				}, 'Candidate'), " means we have a complete design which we're confident will work, but we want to validate it first."),
		],
);