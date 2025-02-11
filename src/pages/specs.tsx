import { File } from "macromania-outfs";
import { PageTemplate } from "../pageTemplate.tsx";
import { Img, Li, Nav, P, Ul } from "macromania-html";
import { Alj } from "../macros.tsx";
import { ResolveAsset } from "macromania-assets";
import { Marginale } from "macromania-marginalia";
import { R } from "macromania-defref";

export const specs = (
  <File name="index.html">
    <PageTemplate
      htmlTitle="Specifications"
      headingId="specifications"
      heading={"Specifications"}
    >
      <P>
        <Alj>aaarg link colouring!</Alj>
        <Marginale>
          <Img
            src={<ResolveAsset asset={["specs", "emblems.png"]} />}
            alt={`An illustration of the four emblems of Willow’s specifications laid out somewhat like playing cards.`}
          />
        </Marginale>
        Willow is a family of specifications:
      </P>

      <Ul>
        <Li>
          <R n="data_model">Data Model</R>: The fundamental data model, a system
          for giving structured names to bytestrings.
        </Li>
        <Li>
          <R n="meadowcap">Meadowcap</R>: A capability system for controlling
          access to Willow data.
        </Li>
        <Li>
          <R n="sync">Synchronisation</R>: A network protocol for efficiently
          and privately synchronising Willow data.
        </Li>
        <Li>
          <R n="sideloading">Sideloading</R>: A protocol for securely delivering
          Willow data by whatever means possible.
        </Li>
      </Ul>

      <P>
        These main specifications rely on several common concepts:
      </P>

      <Nav>
        <Ul>
          <Li>
            <R n="grouping_entries">Grouping Entries</R>
          </Li>
          <Li>
            <R n="encodings">On Encodings</R>
          </Li>
          <Li>
            <R n="e2e">Encrypting Entries</R>
          </Li>
          <Li>
            <R n="access_control">Access Control</R>
          </Li>
          <Li>
            <R n="private_interest_intersection">
              Private Interest Intersection
            </R>
          </Li>
          <Li>
            <R n="d3_range_based_set_reconciliation">
              3d Range-Based Set Reconciliation
            </R>
          </Li>
          <Li>
            <R n="lcmux">Multiplexing and Flow Control</R>
          </Li>
        </Ul>
      </Nav>

      <P>
        And until we build our own fancy cross-domain referencing system, this
        site is the temporary home for:
      </P>

      <Nav>
        <Ul>
          <Li>
            <R n="es6_spec">Earthstar</R>: a friendly set of parameters for the
            Willow protocol.
          </Li>
        </Ul>
      </Nav>
    </PageTemplate>
  </File>
);
