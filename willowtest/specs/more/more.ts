import { nav } from "../../../h.ts";
import { link_name } from "../../../linkname.ts";
import { Expression } from "macro";
import { lis, pinformative, site_template } from "../../main.ts";

export const more: Expression = site_template(
  {
    title: "More information",
    name: "more",
  },
  [
    pinformative(
      "Information which you might want to know but doesn't really belong anywhere else, starting with a very frequently asked question:",
    ),
    nav(
      lis(
        link_name("timestamps_really", "Timestamps, really?"),
      ),
    ),
  ],
);
