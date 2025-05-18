import { File } from "macromania-outfs";
import { PageTemplate } from "../pageTemplate.tsx";
import { Img, Li, Nav, P, Ul } from "macromania-html";
import { Alj } from "../macros.tsx";
import { R } from "macromania-defref";
import { ResolveAsset } from "macromania-assets";
import { Marginale } from "macromania-marginalia";

export const more = (
  <File name="index.html">
    <PageTemplate
      htmlTitle="More Information"
      headingId="more"
      heading={"More Information"}
    >
      <P>
        <Marginale>
          <Img
            src={<ResolveAsset asset={["more", "more.png"]} />}
            alt="Dalton gets ready to tuck into a triple mint chocolate ice cream slathered in chocolate sauce."
          />
        </Marginale>
        Information which you might want to know but that goes beyond purely
        technical specifications:
      </P>

      <Nav>
        <Ul>
          <Li>
            <R n="why_willow">Why did we make Willow?</R>
          </Li>
          <Li>
            <R n="willow_compared">Comparison to Other Protocols</R>
          </Li>
          <Li>
            <R n="timestamps_really">Timestamps, really?</R>
          </Li>
          <Li>
            <R n="d3storage">
              Three-Dimensional Data Storage
            </R>
          </Li>
          <Li>
            <R n="projects_and_communities">
              Active Projects and Communities
            </R>
          </Li>
          <Li>
            <R n="changes">News and Necessary Changes</R>
          </Li>
          <Li>
            <R n="about">About Us</R>
          </Li>
        </Ul>
      </Nav>
    </PageTemplate>
  </File>
);
