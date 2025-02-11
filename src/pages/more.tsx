import { File } from "macromania-outfs";
import { PageTemplate } from "../pageTemplate.tsx";
import { P } from "macromania-html";
import { Alj } from "../macros.tsx";

export const more = (
  <File name="index.html">
    <PageTemplate
      htmlTitle="More Information"
      headingId="more"
      heading={"More Information"}
    >
      <P>
        <Alj inline>TODO</Alj>
      </P>

      {/* pinformative(
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
  ], */}
    </PageTemplate>
  </File>
);
