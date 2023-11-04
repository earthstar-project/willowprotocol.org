import { p } from "../../h.ts";
import { Expression } from "../../tsgen.ts";
import { site_template } from "../main.ts";

export const meadowcap: Expression = site_template(
    {
        title: "Meadowcap",
        name: "meadowcap",
    },
    [
        p("wip"),
    ],
);