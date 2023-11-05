import { def, preview_scope } from "../../../defref.ts";
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
        preview_scope(p("A ", def({ id: "resource_handle", singular: "resource handle"}), " is an important concept. Also, previews are working.")),
        p("Every ", def({ id: "logical_channel", singular: "logical channel"}, "logical channel", ["This tooltip was defined explicitly, rather than using the containing preview scope for the preview contents. It is the definition of a ", def({ id: "logical_channel", singular: "logical channel"}, "logical channel"), "."]), " is fun"),
        
        
        def({ id: "handle_type", singular: "handle type"}),
    ],
);