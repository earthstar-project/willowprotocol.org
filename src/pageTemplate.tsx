const citationStyle = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<style xmlns=\"http://purl.org/net/xbiblio/csl\" class=\"in-text\" version=\"1.0\" demote-non-dropping-particle=\"sort-only\" default-locale=\"de-DE\">\n  <info>\n    <title>DIN 1505-2 (author-date, Deutsch) - standard superseded by ISO-690</title>\n    <id>http://www.zotero.org/styles/din-1505-2</id>\n    <link href=\"http://www.zotero.org/styles/din-1505-2\" rel=\"self\"/>\n    <link href=\"http://www.bui.haw-hamburg.de/fileadmin/redaktion/diplom/Lorenzen__litverz.pdf\" rel=\"documentation\"/>\n    <link href=\"http://bibliothek.fh-potsdam.de/fileadmin/fhp_bib/dokumente/Schulungen/wissenschaftliches_Arbeiten/Zitieren_Lorenzen.pdf\" rel=\"documentation\"/>\n    <link href=\"http://www.uni-muenster.de/imperia/md/content/fachbereich_physik/didaktik_physik/materialien/materialschlichting/zitierregeln.pdf\" rel=\"documentation\"/>\n    <link href=\"http://forums.zotero.org/discussion/1857\" rel=\"documentation\"/>\n    <author>\n      <name>Sven Rothe</name>\n      <email>mmoole@googlemail.com</email>\n    </author>\n    <contributor>\n      <name>Julian Onions</name>\n      <email>julian.onions@gmail.com</email>\n    </contributor>\n    <category citation-format=\"author-date\"/>\n    <category field=\"generic-base\"/>\n    <summary>Style following DIN 1505-2, for other media types on additional standards \n      Hinweise zur Benutzung: \n      * Zitieren von Gesetzen: \n        - hier müssen manuell §, Abs und S. zur Seitenangabe beim Zitieren eingetragen werden \n        - im Kurzbeleg wird der Kurztitel verwendet, dafür keine Autoren eintragen! \n        - als Jahresangabe wird 'Datum des Inkrafttretens' herangezogen, Verwenden nur bei Verweis auf nicht z.Z. gültige Gesetze, z.B. (idF. v. 12.12.1972) \n       * Zitieren von Normen und Standards - nicht vollständig nach DIN 1505\n        - Nutzen Sie den Typ 'Bericht' - als Abhilfe, da es keinen Typ 'Standard' gibt.\n        - als Autor die Kurzbezeichnung inkl. Nummer und Jahr eingeben (z.B. VDI 2222-1997), Vorname leer, Jahr leer\n        - als Titel den ausführlichen Titel bei Bedarf (z.B. VDI Richtlinie 2222 Blatt 1 - Konstruktionsmethodik - Methodisches Entwickeln von Lösungsprinzipien)</summary>\n    <!--    This is just a beginning to try to have a DIN 1505 citation style,\n            Feel free to send me any comments, suggestions etc...\n            todo:\n            * basic media types (book, journal article, etc..)\n            * more media types (according DINxxx) audio video etc...\n            * fine tuning\n            * correcting errors\n            known bugs, help appreciated\n            * Abbreviations (Mitarb.) & (Hrsg. der Reihe) are missing (contributor, seriesEditor labels)\n            * \"contributor\" is not valid as a name variable , nevertheless it works but doesnt validate!\n            * author etc. first names should not be abbreviated\n            * reviewed author seems to be not available as variable (newspaper article)\n            * thesis type does notoffer a PLACE or FACULTY as variable!\n            how to show the place if it is not included in the University title!?!?\n            * thesis type: publisher (university), genre (type) dont seem to get through!?\n    -->\n    <!-- useful things:\n      non breaking space: &#160;\n      narrow no break space: uni202F / &#8239; - but this is not supported widely!\n      em dash: &#8212;\n      space:  &#032;\n      tab: &#009;\n\n    -->\n    <updated>2012-09-27T22:06:38+00:00</updated>\n    <rights license=\"http://creativecommons.org/licenses/by-sa/3.0/\">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>\n  </info>\n  <locale xml:lang=\"de\">\n    <terms>\n      <term name=\"anonymous\" form=\"short\">o.&#160;A.</term>\n      <term name=\"no date\" form=\"short\">o.&#160;J.</term>\n      <term name=\"collection-editor\" form=\"short\">Hrsg.</term>\n      <term name=\"retrieved\">abgerufen am</term>\n      <term name=\"composer\" form=\"short\">Komp.</term>\n      <term name=\"composer\" form=\"long\">Komponist</term>\n    </terms>\n  </locale>\n  <macro name=\"author\">\n    <names variable=\"author\" delimiter=\" ; \">\n      <name name-as-sort-order=\"all\" sort-separator=\", \" delimiter=\" ; \" delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n      <label form=\"short\" prefix=\" (\" suffix=\")\"/>\n    </names>\n  </macro>\n  <macro name=\"author-container\">\n    <names variable=\"container-author\" delimiter=\" ; \">\n      <name name-as-sort-order=\"all\" sort-separator=\", \" initialize-with=\". \" delimiter=\" ; \" delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n      <label form=\"short\" prefix=\" (\" suffix=\")\"/>\n    </names>\n  </macro>\n  <macro name=\"editor\">\n    <names variable=\"editor\" delimiter=\" ; \">\n      <name name-as-sort-order=\"all\" sort-separator=\", \" initialize-with=\". \" delimiter=\" ; \" delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n      <label form=\"short\" prefix=\" (\" suffix=\")\"/>\n      <!-- needed: Label should appear as suffix to EVERY name...!-->\n    </names>\n  </macro>\n  <macro name=\"editor-collection\">\n    <names variable=\"collection-editor\" delimiter=\" ; \">\n      <name name-as-sort-order=\"all\" sort-separator=\", \" initialize-with=\". \" delimiter=\" ; \" delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n      <label form=\"short\" prefix=\" (\" suffix=\")\"/>\n      <!-- needed: Label should appear as suffix to EVERY name...!-->\n    </names>\n  </macro>\n  <macro name=\"composer\">\n    <names variable=\"composer\" delimiter=\" ; \">\n      <name name-as-sort-order=\"all\" sort-separator=\", \" delimiter=\" ; \" delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n      <label form=\"long\" prefix=\" (\" suffix=\")\"/>\n      <!-- needed: Label should appear as suffix to EVERY name...!-->\n    </names>\n  </macro>\n  <!--  <macro name=\"contributor\">\n    <names variable=\" \" delimiter=\" ; \">\n    <name name-as-sort-order=\"all\" sort-separator=\", \" initialize-with=\". \" delimiter=\" ; \"\n    delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n    <label form=\"short\" prefix=\" (\" suffix=\")\"/>\n    </names>\n  </macro>-->\n  <macro name=\"translator\">\n    <names variable=\"translator\" delimiter=\" ; \">\n      <name name-as-sort-order=\"all\" sort-separator=\", \" initialize-with=\". \" delimiter=\" ; \" delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n      <label form=\"short\" prefix=\" (\" suffix=\")\"/>\n      <!-- needed: Label should appear as suffix to EVERY name...!-->\n    </names>\n  </macro>\n  <macro name=\"recipient\">\n    <names variable=\"recipient\" delimiter=\" ; \">\n      <name name-as-sort-order=\"all\" sort-separator=\", \" initialize-with=\". \" delimiter=\" ; \" delimiter-precedes-last=\"always\" font-variant=\"small-caps\"/>\n      <!--<label form=\"long\" prefix=\" (\" suffix=\")\"/>-->\n      <!-- needed: Label should appear as suffix to EVERY name...!-->\n    </names>\n  </macro>\n  <macro name=\"author-short\">\n    <names variable=\"author\">\n      <name form=\"short\" and=\"symbol\" delimiter=\", \" initialize-with=\". \" delimiter-precedes-last=\"never\" font-variant=\"small-caps\"/>\n      <et-al font-variant=\"normal\"/>\n      <substitute>\n        <names variable=\"editor\" font-variant=\"small-caps\"/>\n        <names variable=\"translator\" font-variant=\"small-caps\"/>\n        <choose>\n          <if type=\"bill book graphic legal_case  motion_picture report song\" match=\"any\">\n            <text variable=\"title\" form=\"short\" font-style=\"italic\"/>\n          </if>\n          <else-if type=\"bill legal_case legislation\" match=\"any\">\n            <text variable=\"title\" form=\"short\" font-style=\"normal\"/>\n          </else-if>\n          <else>\n            <text variable=\"title\" form=\"short\" quotes=\"true\"/>\n          </else>\n        </choose>\n      </substitute>\n    </names>\n  </macro>\n  <macro name=\"access\">\n    <group>\n      <text term=\"retrieved\" suffix=\" \"/>\n      <date variable=\"accessed\">\n        <date-part name=\"year\" form=\"long\" suffix=\"-\"/>\n        <date-part name=\"month\" form=\"numeric-leading-zeros\" suffix=\"-\"/>\n        <date-part name=\"day\" form=\"numeric-leading-zeros\"/>\n      </date>\n      <!--<date variable=\"accessed\" form=\"numeric\" date-parts=\"year-month-day\"/> // dd.mm.yyy -->\n    </group>\n  </macro>\n  <macro name=\"title\">\n    <choose>\n      <if type=\"bill legislation\" match=\"any\">\n        <group delimiter=\" &#8212; \">\n          <text variable=\"title-short\" font-style=\"normal\"/>\n          <text variable=\"title\"/>\n        </group>\n      </if>\n      <else-if type=\"book graphic legal_case motion_picture report song\" match=\"any\">\n        <text variable=\"title\" font-style=\"italic\"/>\n      </else-if>\n      <else>\n        <text variable=\"title\"/>\n      </else>\n    </choose>\n  </macro>\n  <macro name=\"genre\">\n    <choose>\n      <if type=\"report thesis manuscript map\" match=\"any\">\n        <group>\n          <text variable=\"genre\"/>\n          <!--<text term=\"number\" form=\"short\" suffix=\" \"/>-->\n          <text variable=\"number\" prefix=\" Nr. \"/>\n        </group>\n      </if>\n    </choose>\n  </macro>\n  <macro name=\"volumes\">\n    <group delimiter=\" \">\n      <text term=\"volume\" form=\"short\" plural=\"false\"/>\n      <number variable=\"volume\" form=\"numeric\"/>\n      <number variable=\"number-of-volumes\" form=\"numeric\" prefix=\"v. \"/>\n    </group>\n  </macro>\n  <macro name=\"edition\">\n    <choose>\n      <if is-numeric=\"edition\">\n        <group delimiter=\" \">\n          <number variable=\"edition\" form=\"numeric\" suffix=\". \"/>\n          <text term=\"edition\" form=\"short\" plural=\"false\"/>\n        </group>\n      </if>\n      <else>\n        <text variable=\"edition\" suffix=\".\"/>\n      </else>\n    </choose>\n  </macro>\n  <macro name=\"pages\">\n    <choose>\n      <if type=\"chapter paper-conference article-journal\" match=\"any\">\n        <label variable=\"page\" form=\"short\" suffix=\"&#160;\"/>\n        <text variable=\"page\"/>\n      </if>\n    </choose>\n  </macro>\n  <macro name=\"dimensions\">\n    <group>\n      <text variable=\"dimensions\"/>\n    </group>\n  </macro>\n  <macro name=\"medium\">\n    <group>\n      <text variable=\"medium\"/>\n    </group>\n  </macro>\n  <macro name=\"scale\">\n    <group>\n      <text term=\"scale\"/>\n      <text prefix=\" \" variable=\"scale\"/>\n    </group>\n  </macro>\n  <macro name=\"recipient-show\">\n    <choose>\n      <if type=\"personal_communication\">\n        <choose>\n          <if variable=\"genre\">\n            <text variable=\"genre\" text-case=\"capitalize-first\"/>\n          </if>\n          <else>\n            <text term=\"letter\" text-case=\"capitalize-first\"/>\n          </else>\n        </choose>\n      </if>\n    </choose>\n    <text macro=\"recipient\" prefix=\", \"/>\n  </macro>\n  <macro name=\"cite-year\">\n    <group>\n      <date variable=\"issued\">\n        <date-part name=\"year\"/>\n      </date>\n      <text variable=\"year-suffix\"/>\n    </group>\n  </macro>\n  <macro name=\"bibliography-year\">\n    <date variable=\"issued\" form=\"numeric\" date-parts=\"year\"/>\n    <text variable=\"year-suffix\"/>\n  </macro>\n  <macro name=\"locator\">\n    <group>\n      <choose>\n        <if type=\"bill legislation\" match=\"any\">\n          <text variable=\"locator\" prefix=\" \"/>\n        </if>\n        <else>\n          <label variable=\"locator\" form=\"short\" prefix=\", \"/>\n          <text variable=\"locator\" prefix=\" \"/>\n        </else>\n      </choose>\n    </group>\n  </macro>\n  <citation et-al-min=\"3\" et-al-use-first=\"1\" disambiguate-add-year-suffix=\"true\" disambiguate-add-names=\"false\" disambiguate-add-givenname=\"false\" collapse=\"year\">\n    <sort>\n      <key macro=\"author\"/>\n      <key variable=\"issued\"/>\n    </sort>\n    <layout prefix=\"(\" suffix=\")\" delimiter=\"; \">\n      <choose>\n        <if type=\"bill legislation\" match=\"any\">\n          <group delimiter=\" \">\n            <text macro=\"author-short\"/>\n            <group delimiter=\", \">\n              <group>\n                <date variable=\"issued\" prefix=\" (\" suffix=\")\">\n                  <date-part name=\"year\" prefix=\"idF. v. \"/>\n                </date>\n                <text variable=\"year-suffix\"/>\n              </group>\n              <text macro=\"locator\"/>\n            </group>\n          </group>\n        </if>\n        <else>\n          <group delimiter=\", \">\n            <text macro=\"author-short\"/>\n            <text macro=\"cite-year\"/>\n            <text macro=\"locator\"/>\n          </group>\n          <text variable=\"year-suffix\"/>\n        </else>\n      </choose>\n    </layout>\n  </citation>\n  <bibliography hanging-indent=\"true\" et-al-min=\"9\" et-al-use-first=\"8\">\n    <sort>\n      <key macro=\"author\"/>\n      <key variable=\"issued\"/>\n      <key variable=\"title\"/>\n    </sort>\n    <layout>\n      <group delimiter=\" ; \" suffix=\":\">\n        <text macro=\"author\"/>\n        <choose>\n          <if type=\"bill book graphic legal_case legislation manuscript map motion_picture report song thesis webpage\" match=\"any\">\n            <!-- except type=\"chapter article \" etc.... -->\n            <text macro=\"editor\"/>\n            <text macro=\"editor-collection\"/>\n            <text macro=\"composer\"/>\n          </if>\n        </choose>\n        <!-- <text macro=\"contributor\"/> -->\n        <text macro=\"translator\"/>\n      </group>\n      <choose>\n        <!-- Tabelle 1 aus litverz.ps -->\n        <if type=\"bill book broadcast graphic legal_case legislation manuscript map motion_picture report song\" match=\"any\">\n          <text prefix=\" \" macro=\"title\"/>\n          <text prefix=\", \" variable=\"collection-title\" font-style=\"italic\"/>\n          <!--Reihe-->\n          <text prefix=\" (\" macro=\"genre\" suffix=\")\"/>\n          <text prefix=\". \" macro=\"volumes\"/>\n          <text prefix=\". \" macro=\"edition\"/>\n          <text prefix=\". \" macro=\"medium\"/>\n          <text prefix=\". \" macro=\"dimensions\"/>\n          <text prefix=\". \" variable=\"publisher-place\"/>\n          <text prefix=\"&#160;: \" variable=\"publisher\"/>\n          <text macro=\"bibliography-year\" prefix=\", \"/>\n          <!-- \" (1. Gesamttitel mit Zählung)\"\n            \" (2. Gesamttitel mit Zählung)\" -->\n          <text prefix=\" &#8211;&#160;\" macro=\"scale\"/>\n          <text prefix=\". &#8212;&#160;\" variable=\"note\"/>\n          <text prefix=\" &#8212;&#160;ISBN&#160;\" variable=\"ISBN\"/>\n        </if>\n        <!-- Tabelle 3 aus litverz.ps -->\n        <else-if type=\"chapter paper-conference\" match=\"any\">\n          <text prefix=\" \" macro=\"title\" suffix=\".\"/>\n          <text prefix=\". \" term=\"in\" text-case=\"capitalize-all\" suffix=\": \"/>\n          <!-- verfahre nach Tabelle 1... -->\n          <group delimiter=\" ; \" suffix=\": \">\n            <text macro=\"author-container\"/>\n            <text macro=\"editor\"/>\n            <text macro=\"editor-collection\"/>\n          </group>\n          <text variable=\"container-title\" font-style=\"italic\"/>\n          <text prefix=\", \" variable=\"collection-title\" font-style=\"italic\"/>\n          <!-- Reihe -->\n          <text prefix=\". \" macro=\"volumes\"/>\n          <!-- <text prefix=\" : \" variable=\"title of volumes\"/> what is this? -->\n          <text prefix=\". \" macro=\"edition\"/>\n          <text prefix=\". \" variable=\"publisher-place\"/>\n          <text prefix=\"&#160;: \" variable=\"publisher\"/>\n          <text macro=\"bibliography-year\" prefix=\", \"/>\n          <!-- \" (1. Gesamttitel mit Zählung)\"\n            \" (2. Gesamttitel mit Zählung)\" -->\n          <text prefix=\". &#8212;&#160;\" variable=\"note\"/>\n          <text prefix=\" &#8212;&#160;ISBN&#160;\" variable=\"ISBN\"/>\n          <text prefix=\", \" macro=\"pages\"/>\n        </else-if>\n        <!-- Tabelle 5 aus litverz.ps - Hochschulschriften\n          (Diplomarbeiten, Dissertationen, Master-A., unverö. Studienarbeiten -->\n        <else-if type=\"thesis\" match=\"any\">\n          <text prefix=\" \" macro=\"title\" font-style=\"italic\"/>\n          <text prefix=\". \" macro=\"edition\"/>\n          <text prefix=\". \" variable=\"publisher-place\"/>\n          <text prefix=\", \" variable=\"publisher\" form=\"long\"/>\n          <!-- <text prefix=\", \" variable=\"faculty\"/> -->\n          <text prefix=\", \" macro=\"genre\"/>\n          <text macro=\"bibliography-year\" prefix=\", \"/>\n          <text prefix=\". &#8212;&#160;\" variable=\"note\"/>\n        </else-if>\n        <else-if type=\"webpage post post-weblog\" match=\"any\">\n          <text prefix=\" \" macro=\"title\" suffix=\". \" font-style=\"italic\"/>\n          <text prefix=\"URL \" variable=\"URL\"/>\n          <text prefix=\". - \" macro=\"access\"/>\n          <text prefix=\". &#8212;&#160;\" variable=\"container-title\"/>\n          <text prefix=\". &#8212;&#160;\" variable=\"note\"/>\n        </else-if>\n        <!-- Tabelle 2 aus litverz.ps UND -->\n        <!-- Tabelle 4 aus litverz.ps - Schriften von Tagungen, Konferenzen, Symposien, ...-->\n        <else-if type=\"article article-journal article-magazine article-newspaper\" match=\"any\">\n          <text prefix=\" \" variable=\"title\"/>\n          <!-- \" : Zusatz zum Sachtitel\"\n            \". Angabe des Teils\"\n            \" (Gesamttitelangabe)\" -->\n          <group>\n            <text prefix=\". \" term=\"in\" text-case=\"capitalize-first\" suffix=\": \"/>\n            <text macro=\"editor\" suffix=\" \"/>\n            <text variable=\"container-title\" font-style=\"italic\"/>\n            <text prefix=\", \" variable=\"collection-title\" font-style=\"italic\" suffix=\".\"/>\n            <!--\", unterreihe der zeitschrift/zeitung\" -->\n          </group>\n          <text prefix=\" \" macro=\"volumes\"/>\n          <text prefix=\". \" variable=\"publisher-place\"/>\n          <text prefix=\", \" variable=\"publisher\" form=\"long\"/>\n          <text macro=\"bibliography-year\" prefix=\" (\" suffix=\")\"/>\n          <text prefix=\", Nr.&#160;\" variable=\"issue\"/>\n          <text prefix=\", \" macro=\"pages\"/>\n          <text prefix=\". &#8212;&#160;\" variable=\"note\"/>\n          <text prefix=\" &#8212;&#160;ISBN&#160;\" variable=\"ISBN\"/>\n        </else-if>\n        <!-- keiner der oben genannten fälle -->\n        <else>\n          <group suffix=\".\">\n            <text prefix=\" \" macro=\"title\"/>\n            <text prefix=\", \" macro=\"editor\"/>\n            <text prefix=\". \" macro=\"recipient-show\"/>\n          </group>\n          <group prefix=\" \" suffix=\".\">\n            <text variable=\"container-title\" font-style=\"italic\"/>\n            <group prefix=\", \">\n              <text variable=\"volume\" font-style=\"italic\"/>\n              <text variable=\"issue\" prefix=\"(\" suffix=\")\"/>\n            </group>\n            <text prefix=\", \" macro=\"pages\"/>\n          </group>\n        </else>\n      </choose>\n    </layout>\n  </bibliography>\n</style>\n";

// import citationStyle from "../../macromania_temporary_monorepo/macromania_bib/styles/acm-sig-proceedings.csl.json" with { type: "json" };
/*
The macromania_bib package reexports the citations styles from https://github.com/citation-style-language/styles as jsons trings that can be directly imported into typescript. Very convenient.
*/

import { bib } from "./bib.tsx";
import { AE } from "./macros.tsx";
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
