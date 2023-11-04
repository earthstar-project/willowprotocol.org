import { def } from "../../../defref.ts";
import { p } from "../../../h.ts";
import { Expression } from "../../../tsgen.ts";
import { site_template } from "../../main.ts";

export const resource_control: Expression = site_template(
    {
        title: "Resource Management",
        name: "resource_control",
    },
    [
        p("wip"),
        def({ id: "logical_channel", singular: "logical channel"}),
        def({ id: "resource_handle", singular: "resource handle"}),
        def({ id: "handle_type", singular: "handle type"}),
    ],
);