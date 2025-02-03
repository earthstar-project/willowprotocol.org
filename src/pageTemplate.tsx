import citationStyle from "macromania-bib/styles/din-1505-2.csl.json" with {
  type: "json",
};

// import citationStyle from "../../macromania_temporary_monorepo/macromania_bib/styles/acm-sig-proceedings.csl.json" with { type: "json" };
/*
The macromania_bib package reexports the citations styles from https://github.com/citation-style-language/styles as jsons trings that can be directly imported into typescript. Very convenient.
*/

import { bib } from "./bib.tsx";
import { AE, Alj } from "./macros.tsx";
import { Expression, Expressions } from "macromania";
import { Dir, File } from "macromania-outfs";
import { ConfigMarginalia, Marginale } from "macromania-marginalia";
import { Counter } from "macromania-counters";
import { BibScope } from "macromania-bib";
import { Config } from "macromania-config";
import { Html5 } from "macromania-html-utils";
import {
  A,
  Div,
  Footer,
  Img,
  Li,
  Link,
  Main,
  Meta,
  Nav,
  P,
  Script,
  Ul,
} from "macromania-html";
import { Hsection, TableOfContents } from "macromania-hsection";
import { R } from "macromania-defref";
import { ResolveAsset } from "macromania-assets";
import { CssDependency, JsDependency } from "macromania-previews";

export function Page(
  props: PageTemplateProps & { children?: Expressions; name: string },
): Expression {
  return (
    <Dir name={props.name}>
      <File name="index.html">
        {PageTemplate(props)}
      </File>
    </Dir>
  );
}

export type PageTemplateProps = {
  htmlTitle: Expressions;
  htmlDescription?: Expressions;
  headingId: string;
  heading: Expressions;
  status?: SpecStatus;
  statusDate?: Expressions;
  /**
   * Whether to render a table of contents on this page.
   */
  toc?: boolean;
};

export function PageTemplate(
  {
    htmlTitle,
    htmlDescription,
    headingId,
    heading,
    children,
    status,
    statusDate,
    toc,
  }: PageTemplateProps & {
    children?: Expressions;
  },
): Expression {
  const sidenoteCounter = new Counter("sidenote-counter", 0);

  return (
    <Config
      options={[
        <ConfigMarginalia sidenoteCounter={sidenoteCounter} />,
      ]}
    >
      <BibScope
        style={citationStyle} // The citationStyle variable is set in the first line of this file. Look there for more information.
        lang="en-GB" // Valid strings for specifying the locales are of the form `xx-YY` for which https://github.com/citation-style-language/locales contains a `locales-xx-YY.xml` file.
        forceLang // Ensure the locale you specified is used even if the citation style specifies a default locale.
        items={bib}
      >
        <Html5
          htmlProps={{ lang: "en-GB" }}
          bodyProps={{
            clazz: `${status === "proposal" ? "proposal" : "bg"}`,
          }}
          title={<>Willow Specifications - {<exps x={htmlTitle} />}</>}
          headContents={
            <>
              <Meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <Meta
                name="description"
                content={htmlDescription
                  ? <exps x={htmlDescription} />
                  : "Protocols for synchronisable data stores. The best parts? Fine-grained permissions, a keen approach to privacy, destructive edits, and a dainty bandwidth and memory footprint."}
              />
              <Script>let FF_FOUC_FIX;</Script>
              {/*to prevent Firefox FOUC, this must be here*/}
              <Link
                rel="alternate"
                type="application/rss+xml"
                href="/rss_news.xml"
                title="Willow News and Updates"
              />
              <Link
                rel="alternate"
                type="application/rss+xml"
                href="/rss_changelog.xml"
                title="Willow Specification Changelog"
              />
              <Link
                rel="icon"
                href="/assets/favicon.svg"
                type="image/svg+xml"
              />
              <Link rel="icon" href="/assets/favicon.png" type="image/png" />
              <Link
                rel="apple-touch-icon"
                href="/assets/apple-touch-icon.png"
              />
            </>
          }
        >
          <CssDependency dep={["index.css"]} />
          {toc
            ? (
              <JsDependency
                dep={["toc.js"]}
                scriptProps={{ defer: true }}
              />
            )
            : ""}

          <Div id="wrapContent">
            <Main>
              <Hsection title={<exps x={heading} />} n={headingId}>
                {toc ? <TableOfContents stopLevel={99} /> : ""}
                {status
                  ? (
                    <P>
                      <RenderSpecStatus status={status} /> {statusDate
                        ? (
                          <>
                            (as of <exps x={statusDate} />)
                          </>
                        )
                        : ""}
                    </P>
                  )
                  : ""}
                <exps x={children} />
              </Hsection>
            </Main>

            <Footer>
              <Nav>
                <Ul>
                  <Li>
                    <R n="willow">Home</R>
                  </Li>
                  <Li>
                    <R n="specifications">Specs</R>
                  </Li>
                  <Li>
                    <R n="news">News</R>
                  </Li>
                  <Li>
                    <R n="about">About Us</R>
                  </Li>
                  <Li>
                    <R n="projects_and_communities">Active Projects</R>
                  </Li>
                  <Li>
                    <R n="more">More</R>
                  </Li>
                </Ul>
              </Nav>

              <Div>
                <Marginale inlineable>
                  <A href="https://nlnet.nl" clazz="funder">
                    <Img
                      src={<ResolveAsset asset={["graphics", "nlnet.svg"]} />}
                      alt="The logo of the NLnet foundation."
                    />
                  </A>
                </Marginale>
                <P>
                  This project was funded through the NGI Assure Fund, a fund
                  established by NLnet with financial support from the European
                  Commission’s Next Generation Internet programme, under the
                  aegis of DG Communications Networks, Content and Technology
                  under grant agreement № 957073.
                </P>

                <Div clazz="clearRight" />

                <Marginale inlineable>
                  <A href="https://www.tu.berlin/" clazz="funder">
                    <Img
                      src={
                        <ResolveAsset asset={["graphics", "tu_berlin.svg"]} />
                      }
                      alt="The logo of the TU Berlin."
                    />
                  </A>
                </Marginale>
                <P>
                  <R n="aljoscha" /> has been employed at{" "}
                  <AE href="https://www.tu.berlin/">TU Berlin</AE>{" "}
                  while working on Willow.
                </P>

                <Div clazz="clearRight" />

                <Marginale inlineable>
                  <A href="https://iroh.computer" clazz="sponsor">
                    <Img
                      src={<ResolveAsset asset={["graphics", "iroh.svg"]} />}
                      alt="The logo of Iroh."
                    />
                  </A>
                </Marginale>
                <P>
                  We also thank our other sponsors for their support.
                </P>
              </Div>
            </Footer>
          </Div>
        </Html5>
      </BibScope>
    </Config>
  );
}

export type SpecStatus = "final" | "candidate" | "proposal";

function RenderSpecStatus(
  { status }: { status: SpecStatus },
): Expression {
  return (
    <>
      Status: <R n={`status_${status}`} />
    </>
  );
}
