import { Dir, File } from "macromania-outfs";
import { AE } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Li, P, Ul } from "macromania-html";
import { Hsection } from "macromania-hsection";
import { R } from "macromania-defref";

export const projects_and_communities = (
  <Dir name="projects_and_communities">
    <File name="index.html">
      <PageTemplate
        htmlTitle="Active Projects and Communities"
        headingId="projects_and_communities"
        heading="Active Projects and Communities"
      >
        <P>
          Below is an overview of active projects related to Willow, as well as
          some links to places where you can connect with other people
          interested in the project.
        </P>

        <Hsection n="willow_implementations" title="Implementations">
          <P>
            There are several funded, open source implementations of Willow
            being worked on.
          </P>

          <P>
            If you would like to implement Willow in your favourite language,
            we’ll gladly answer any questions you may have! Please see the{" "}
            <R n="community_and_contact">community and contact</R>{" "}
            section below for some ways of getting in touch.
          </P>

          <Hsection
            n="earthstar_project_implementations"
            title="Earthstar Project"
          >
            <P>
              Willow is brought to you by the{" "}
              <AE href="https://earthstar-project.org">Earthstar Project</AE>.
              We aim to provide implementations of Willow specifications in both
              TypeScript and Rust.
            </P>
          </Hsection>

          <P>
            We are currently working on{" "}
            <AE href="https://github.com/earthstar-project/willow-rs">
              Rust implementations of the Willow specifications
            </AE>, with our work funded by{" "}
            <AE href="https://nlnet.nl/core/">NGI Core</AE>. At the time of
            writing, we have released the following crates:
          </P>

          <Ul>
            <Li>
              <AE href="https://docs.rs/willow-data-model/0.1.0/willow_data_model/">
                willow-data-model
              </AE>
            </Li>
            <Li>
              <AE href="https://docs.rs/meadowcap/0.1.0/meadowcap/">
                meadowcap
              </AE>
            </Li>
          </Ul>

          <P>
            We have TypeScript implementations of older versions of Meadowcap
            and Willow (comprising the <R n="data_model">Willow Data Model</R>,
            {" "}
            <R n="sync">Willow General Purpose Sync protocol</R>, and{" "}
            <R n="sideloading">Willow Sideloading protocol</R>). These
            implementations have been funded by{" "}
            <AE href="https://nlnet.nl/assure/">NGI Assure</AE>, and we hope to
            be able to update them to the final state of the specifications
            soon:
          </P>

          <Ul>
            <Li>
              <AE href="https://github.com/earthstar-project/meadowcap-js">
                meadowcap-js
              </AE>
            </Li>
            <Li>
              <AE href="https://github.com/earthstar-project/willow-js">
                willow-js
              </AE>
            </Li>
          </Ul>
        </Hsection>

        <Hsection n="iroh_implementations" title="Iroh">
          <P>
            Iroh is an open-source framework for p2p applications adopting the
            {" "}
            <R n="data_model">Willow Data Model</R>,{" "}
            <R n="meadowcap">Meadowcap</R>, and the{" "}
            <R n="sync">Willow General Purpose Sync protocol</R>. They are users
            and contributors to our Rust implementations.
          </P>

          <Ul>
            <Li>
              <AE href="https://iroh.computer">Iroh website</AE>
            </Li>
            <Li>
              <AE href="https://github.com/n0-computer/iroh">Iroh repo</AE>
            </Li>
          </Ul>
        </Hsection>

        <Hsection n="community_and_contact" title="Community and Contact">
          <Ul>
            <Li>
              <AE href="mailto:mail@aljoscha-meyer.de,sam@gwil.garden">
                Email us
              </AE>
            </Li>
            <Li>
              <AE href="https://opencollective.com/earthstar">
                Earthstar Project Open Collective
              </AE>
            </Li>
            <Li>
              <AE href="https://discord.gg/6NtYzQC2G4">
                Earthstar Project Discord
              </AE>
            </Li>
            <Li>
              <AE href="https://post.lurk.org/@gwil">gwil on Mastodon</AE>
            </Li>
          </Ul>
        </Hsection>

        <Hsection n="this_website" title="This Site">
          <P>
            This website is also an active project. The repository for it can be
            found{" "}
            <AE href="https://github.com/earthstar-project/willowprotocol.org">
              here
            </AE>. We appreciate all feedback from typos, to stumbling blocks,
            or any errant American English spellings you find.
          </P>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
