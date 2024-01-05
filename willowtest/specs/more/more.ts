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
      "Information which you might want to know but that goes beyond purely technical specifications:",
    ),
    nav(
      lis(
        link_name("why_willow", "Why did we make Willow?"),
      ),
      lis(
        link_name("timestamps_really", "Timestamps, really?"),
      ),
      lis(
        link_name("3dstorage", "Three-Dimensional Data Storage"),
      ),
      lis(
        link_name("changes", "Changes we had to make")
      )
    ),
  ],
);
