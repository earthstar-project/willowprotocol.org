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
        link_name("willow_compared", "Comparison to Other Protocols"),
        link_name("timestamps_really", "Timestamps, really?"),
        link_name("d3storage", "Three-Dimensional Data Storage"),
        link_name("projects_and_communities", "Active Projects and Communities"),
        link_name("changes", "News and Necessary Changes"),
        link_name("about", "About Us"),
      ),
    ),
  ],
);
