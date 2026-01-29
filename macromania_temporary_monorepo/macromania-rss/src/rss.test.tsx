import { Context } from "macromania";
import { Cd, Dir, File, relativeOutFsPath } from "macromania-outfs";
import { ServerRoot } from "macromania-webserverroot";
import { RssFeed, RssItem } from "./rss.tsx";

Deno.test("Test", async () => {
	const ctx = new Context();

	await ctx.evaluate(
		<ServerRoot url="https://gwil.link">
			<Cd create={true} path={relativeOutFsPath(["test"])}>
				<File name="index.txt">
					Hello
					<RssFeed
						title="Outer"
						description="my outermost feed"
						name="outer"
						path={{ relativity: 0, components: ["outer.xml"] }}
					>
						Not a feed item
						<RssItem name="fst" title="First" pubDate={new Date()}>
							First feed item.
						</RssItem>
						Also not a feed item.
						<RssFeed
							title="Inner"
							description="my innermost feed"
							name="inner"
							path={{ relativity: 0, components: ["inner.xml"] }}
						>
							<RssItem name="snd" title="snd" pubDate={new Date()}>
								<File name="inner.txt">
									Second feed item.
								</File>
							</RssItem>
							Still not a feed item.
						</RssFeed>
					</RssFeed>
				</File>
			</Cd>
		</ServerRoot>,
	);
});
