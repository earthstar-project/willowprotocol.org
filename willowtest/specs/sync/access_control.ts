import { def, preview_scope } from "../../../defref.ts";
import { p } from "../../../h.ts";
import { Expression } from "../../../tsgen.ts";
import { site_template } from "../../main.ts";

export const access_control: Expression = site_template(
    {
        title: "Access Control",
        name: "access_control",
    },
    [
        p("wip"),
        def({ id: "granted_product", singular: "granted product"}),
        def({ id: "read_authentication", singular: "read authentication"}),
        def({ id: "commitment_scheme", singular: "commitment scheme"}),
    ],
);