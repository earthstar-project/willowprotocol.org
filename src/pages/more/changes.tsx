import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path, SkyBlue } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { A, Code, Em, Img, Li, P, Ul } from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  DefFunction,
  DefType,
  DefValue,
  StructDef,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";
import { RssFeed, RssItem } from "macromania-rss";
import { Expressions } from "macromania";
import { Time } from "macromania-html";

const time_format = new Intl.DateTimeFormat("en-GB");

function WillowRssItem(
  { children, title, name, date }: {
    children: Expressions;
    title: string;
    name: string;
    date: Date;
  },
) {
  return (
    <Li>
      <Hsection
        title={
          <>
            {title} <Time clazz="news-time">{time_format.format(date)}</Time>
          </>
        }
        n={`news_${name}`}
      >
        <RssItem title={title} name={name} pubDate={date}>
          {children}
        </RssItem>
      </Hsection>
    </Li>
  );
}

export const changes = (
  <Dir name="changes">
    <File name="index.html">
      <PageTemplate
        htmlTitle="News, Improvements, and Necessary Changes"
        headingId="changes"
        heading="News, Improvements, and Necessary Changes"
        toc
        parentId="more"
      >
        <P>
          Here, we maintain a changelog of breaking changes to our specs, and
          one of general site updates. Each section has their own RSS feed, and
          we also provide{" "}
          <A clazz="external" href="/rss_everything.xml">
            a single feed with everything here
          </A>.
        </P>

        <RssFeed
          title="Willow Updates and Spec Changes"
          description="A changelog of breaking changes to the Willow specs, and general site updates."
          name="willow_everything"
          path={{ relativity: 2, components: [`rss_everything.xml`] }}
        >
          <Hsection title="News and Updates" n="news_and_updates">
            <P>
              Here we’ll share bits of news relevant to the Willow protocol, as
              well as improvements to the site. For example, the completion of
              an implementation, or the addition of new explanatory text and
              drawings to the site. Updates will be occasional and meaningful.
            </P>

            <P>
              <A clazz="external" href="/rss_news.xml">
                RSS feed available here
              </A>.
            </P>

            <RssFeed
              title="Willow - News and Updates"
              description="Here we’ll share bits of news relevant to the Willow protocol, as well as improvements to the site. For example, the completion of an implementation, or the addition of new explanatory text and drawings to the site. Updates will be occasional and meaningful."
              name="willow_news"
              path={{ relativity: 2, components: [`rss_news.xml`] }}
            >
              <Ul>
                <WillowRssItem
                  title="Rust implementation of Meadowcap released"
                  name="meadowcap_rs_0_1_0"
                  date={new Date(2024, 7, 10)}
                >
                  <P>
                    Our own <Em>Rust</Em> implementation of <R n="meadowcap" />
                    {" "}
                    now conforms to the specification as of August 10th, 2024.
                    The source, can be found at{" "}
                    <A
                      clazz="external"
                      href="https://github.com/earthstar-project/willow-rs"
                    >
                      the willow-rs repository
                    </A>{" "}
                    and complete documentation can be found at{" "}
                    <A
                      clazz="external"
                      href="https://docs.rs/meadowcap/0.1.0/meadowcap/"
                    >
                      docs.rs
                    </A>.
                  </P>
                </WillowRssItem>

                <WillowRssItem
                  title="Willow General Purpose Sync specification status promoted to ‘Candidate’"
                  name="wgps_candidate"
                  date={new Date(2024, 5, 19)}
                >
                  <P>
                    With a working implementation of the <R n="sync" /> in{" "}
                    <A
                      clazz="external"
                      href="https://github.com/earthstar-project/willow-js"
                    >
                      willow-js
                    </A>{" "}
                    — and several other implementations now in progress — we
                    feel comfortable in promoting the specification's status to
                    {" "}
                    <SkyBlue>
                      <R n="status_candidate" />
                    </SkyBlue>.
                  </P>
                </WillowRssItem>

                <WillowRssItem
                  title="Sideloading in willow-js"
                  name="willow_js_0_5_0"
                  date={new Date(2024, 4, 29, 0)}
                >
                  <P>
                    Last week we published the{" "}
                    <R n="sideloading" />, and this week we have a working
                    implementation available via{" "}
                    <A
                      clazz="external"
                      href="https://github.com/earthstar-project/willow-js"
                    >
                      willow-js 0.5.0
                    </A>.
                  </P>
                  <P>
                    For more information on this implementation, please see the
                    documentation for{" "}
                    <A
                      clazz="external"
                      href="https://jsr.io/@earthstar/willow/doc/~/createDrop"
                    >
                      <Code>createDrop</Code>
                    </A>{" "}
                    and{" "}
                    <A
                      clazz="external"
                      href="https://jsr.io/@earthstar/willow/doc/~/ingestDrop"
                    >
                      <Code>ingestDrop</Code>
                    </A>.
                  </P>
                </WillowRssItem>

                <WillowRssItem
                  title="Willow Sideloading Protocol"
                  name="sideload_spec"
                  date={new Date(2024, 4, 23, 0)}
                >
                  <P>
                    A few months ago we published the{" "}
                    <R n="sync" />, a synchronisation specification for securely
                    and efficiently synchronising data over a network
                    connection. However, there are many contexts where
                    establishing such a connection is difficult, undesirable, or
                    outright impossible.
                  </P>

                  <P>
                    The <R n="sideloading" />{" "}
                    is a new protocol for securely delivering Willow data by
                    whatever means possible. We build upon the tradition of
                    sneakernets to introduce the concept of the{" "}
                    <R n="sidenet" />{" "}
                    the sporadically online and ad-hoc infrastructure users
                    already have.
                  </P>

                  <P>
                    This new protocol can be used in place of (or as a
                    complement to) the{" "}
                    <R n="sync" />, is relatively simple to implement, and has a
                    mercifully short specification.
                  </P>
                </WillowRssItem>

                <WillowRssItem
                  title="willow-js released"
                  name="willowjs_0_2_1"
                  date={new Date(2024, 4, 6, 0)}
                >
                  <P>
                    <A
                      clazz="external"
                      href="https://github.com/earthstar-project/willow-js"
                    >
                      willow-js
                    </A>, our own TypeScript implementation of the{" "}
                    <R n="data_model" /> and the <R n="sync" />{" "}
                    , now conforms to these specifications as of May 6th, 2024.
                    This module can be used to create, query, and sync{" "}
                    <Rs n="Entry" /> and their corresponding <Rs n="Payload" />
                    {" "}
                    in <Rs n="store" /> in the browser and Deno runtime.
                  </P>

                  <P>
                    The source, documentation, and usage instructions can be
                    found at the{" "}
                    <A
                      clazz="external"
                      href="https://github.com/earthstar-project/willow-js"
                    >
                      willow-js repository
                    </A>.
                  </P>
                </WillowRssItem>

                <WillowRssItem
                  title="meadowcap-js 0.2.0 released"
                  name="meadowcap_0_1_0"
                  date={new Date(2024, 0, 23, 0)}
                >
                  <P>
                    Our own TypeScript implementation of <R n="meadowcap" />
                    {" "}
                    now conforms to the specification as of January 23rd, 2024.
                    The source, documentation, and usage instructions can be
                    found at the{" "}
                    <A
                      clazz="external"
                      href="https://github.com/earthstar-project/meadowcap-js"
                    >
                      meadowcap-js repository
                    </A>.
                  </P>
                </WillowRssItem>
                <WillowRssItem
                  title="Welcome to willowprotocol.org!"
                  name="news_launch"
                  date={new Date(2024, 0, 17, 0)}
                >
                  <P>
                    The site for the Willow protocol has been officially
                    released to the public.
                  </P>
                </WillowRssItem>
              </Ul>
            </RssFeed>
          </Hsection>

          <Hsection title="Necessary changes" n="spec_changes">
            <RssFeed
              title="Willow - Necessary changes"
              description="A changelog of breaking changes to the Willow specs."
              name="willow_changelog"
              path={{
                relativity: 2,
                components: [`rss_changelog.xml`],
              }}
            >
              <P>
                Although we consider Willow’s specifications stable, unforeseen
                outcomes may force us to make amendments. Rather than making
                this a source of exciting surprises for implementors, we prefer
                to list those (hopefully few) changes here.
              </P>

              <P>
                <A clazz="external" href="/rss_changelog.xml">
                  RSS feed available here
                </A>.
              </P>

              <Ul>
                <WillowRssItem
                  title="Sync protocol tweaks"
                  name="prefingerprints_and_payload_transformations"
                  date={new Date(2024, 3, 26, 0)}
                >
                  <P>
                    We are progressing with implementing the Willow General
                    Purpose Sync Protocol (WGPS), and have discovered some
                    tweaks that make the protocol more powerful.
                  </P>

                  <P>
                    First, we have generalised the parameters for fingerprint
                    computation in range-based set reconciliation: the old type
                    of <Code>Fingerprints</Code> is now called{" "}
                    <Code>PreFingerprint</Code>. After computing a{" "}
                    <Code>PreFingerprint</Code>{" "}
                    but before sending it to the other peer for comparison, it
                    is transformed into an actual <Code>Fingerprint</Code>{" "}
                    with an arbitrary function. This allows using large
                    fingerprints with nice algebraic properties for the
                    computations, but compressing them with a conventional hash
                    function before transmission.
                  </P>

                  <P>
                    The second generalisation concerns payload transmission.
                    Instead of transmitting payloads verbatim, peers may now
                    transform the payloads into arbitrary other bytestrings, and
                    exchange those instead. This opens up features such as
                    streaming verification of partial payloads, or on-the-fly
                    compression.
                  </P>
                </WillowRssItem>
                <WillowRssItem
                  title="Willow specification published"
                  name="changelog_launch"
                  date={new Date(2024, 0, 17, 0)}
                >
                  <P>No changes yet!</P>
                </WillowRssItem>
              </Ul>
            </RssFeed>
          </Hsection>
        </RssFeed>
      </PageTemplate>
    </File>
  </Dir>
);
