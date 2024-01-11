import { Expression } from "macro";
import { pinformative, site_template } from "../../main.ts";
import { def, preview_scope, r } from "../../../defref.ts";
import { p } from "../../../h.ts";
import { link_name } from "../../../linkname.ts";

export const spec_statuses: Expression = site_template(
		{
				title: "Specification Statuses",
				name: "spec_statuses",
		},
		[
				preview_scope(
					p(def({id: 'status_final', singular: "Final"}, 'Final'), " means the specified concepts will not change anymore. You can safely implement this specification."),

					pinformative("Anyone — including us — wishing for changes will have to fork and create their own, derivative specification. We may still update the page with presentational and non-normative changes."),
				),

				preview_scope(
					p(def({id: 'status_candidate', singular: "Candidate"}, 'Candidate'), " means we have a complete design which we are confident will work, but we want to validate it first."),

					p("We may still change details as issues arise. In principle, we might even do fundamental changes, but we are optimistic this will not be necessary. We encourage implementation efforts and would love to hear about any stumbling blocks you encounter."),

					p("We keep a changelog and rss feed of all changes to ", r("status_candidate"), " specifications ", link_name("TODO", "here"), "."),
				),
		],
);