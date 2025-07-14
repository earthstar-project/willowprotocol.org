import { createHash } from "npm:sha256-uint8array";
import { evaluate, Expression, Invocation, new_macro } from "macro";
import { html5, html5_dependency_css } from "../html5.ts";
import {
  a,
  aside,
  div,
  footer,
  img,
  li,
  main,
  meta,
  nav,
  ol,
  p,
  span,
  table,
  tbody,
  td,
  th,
  thead,
  title,
  tr,
  ul,
  link as linktag,
} from "../h.ts";
import {
  asset,
  copy_file,
  copy_statics,
  out_directory,
  out_file,
  write_file_relative,
} from "../out.ts";
import { read_file } from "../input.ts";
import { marginale_inlineable } from "../marginalia.ts";
import { layout_marginalia, LayoutOptions } from "../layout_marginalia.ts";
import { hsection, table_of_contents } from "../hsection.ts";
import { link_name, set_root_directory } from "../linkname.ts";
import { Def, def_generic, def_generic$, enable_previews, preview_scope } from "../defref.ts";
import { data_model } from "./specs/data_model.ts";
import { meadowcap } from "./specs/meadowcap.ts";
import { sync } from "./specs/sync.ts";
import { resource_control } from "./specs/sync/resource_control.ts";
import { psi } from "./specs/sync/psi.ts";
import { range3d_based_set_reconciliation } from "./specs/sync/product_based_set_reconciliation.ts";
import { access_control } from "./specs/sync/access_control.ts";
import { timestamps_really } from "./specs/more/timestamps_really.ts";
import { specifications } from "./specs/specifications.ts";
import { encodings } from "./specs/encodings.ts";
import { grouping_entries } from "./specs/grouping_entries.ts";
import { e2e } from "./specs/e2e.ts";
import { more } from "./specs/more/more.ts";
import { why_willow } from "./specs/more/why_willow.ts";
import { threedstorage } from "./specs/more/3dstorage.ts";
import { changes } from "./specs/more/changes.ts";
import { build_rss_feeds } from "../rss.ts";
import { set_root_url } from "../root_url.ts";
import { projects_and_communities } from "./specs/more/projects_and_communities.ts";
import { spec_statuses } from "./specs/more/statuses.ts";
import { SpecStatus, specStatus } from "../spec_status.ts";
import { willow_compared } from "./specs/more/compare.ts";
import { about } from "./specs/more/about.ts";
import { sideloading } from "./specs/sideloading.ts";
import { es6_spec } from "./specs/earthstar/es6_spec.ts";

export function quotes(...contents: Expression[]) {
  const macro = new_macro(
    (args, _ctx) => ["“", args, "”"],
  );

  return new Invocation(macro, contents);
}

export function single_quotes(...contents: Expression[]) {
  const macro = new_macro(
    (args, _ctx) => ["‘", args, "’"],
  );

  return new Invocation(macro, contents);
}

export const apo = "’";

export interface Document {
  title: string;
  name: string; // globally unique name for the `name` macros
  heading?: Expression;
  status?: SpecStatus;
  status_date?: string;
}

export function site_template(metadata: Document, bodyexp: Expression): Invocation {
  const macro = new_macro(
    (args, _ctx) => {
      return html5(
        [
          meta({
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          }),
          meta({
            name: "description",
            content: "Protocols for synchronisable data stores. The best parts? Fine-grained permissions, a keen approach to privacy, destructive edits, and a dainty bandwidth and memory footprint."
          }),
          meta({
            name: 'language',
            content: 'en-GB'
          }),
          linktag({
            rel: "alternate",
            type: "application/rss+xml",
            href: "/rss_news.xml",
            title: "Willow News and Updates"
          }),
          linktag({
            rel: "alternate",
            type: "application/rss+xml",
            href: "/rss_news.xml",
            title: "Willow Specification Changelog"
          }),
          linktag({
            rel: "icon",
            href: "/named_assets/favicon.svg",
            type: "image/svg+xml"
          }),
          linktag({
            rel: "icon",
            href: "/named_assets/favicon.png",
            type: "image/png"
          }),
          linktag({
            rel: "apple-touch-icon",
            href: "/named_assets/apple-touch-icon.png"
          }),
          html5_dependency_css("/styles.css"),
          title(`Willow Specifications - ${metadata.title}`),
        ],
        [
          div(
            main(
              hsection(
                metadata.name,
                { wide: true },
                metadata.heading ? metadata.heading : metadata.title,
                metadata.status
                  ? pinformative(
                    specStatus(metadata.status),
                    metadata.status_date ? [" (as of ", metadata.status_date, ")"] : "",
                  )
                  : "",
                args[0],
              ),
            ),
            footer(
              nav(
                ul(
                  li(a({ href: "/", class: "internal" }, "Home")),
                  li(link_name("specifications", "Specs")),
                  li(link_name("changes", "News")),
                  li(link_name("about", "About us")),
                  li(link_name("projects_and_communities", "Active projects")),
                  li(link_name("more", "More")),
                ),
                div(
                  marginale_inlineable(
                    a(
                      { href: "https://nlnet.nl", class: "funder" },
                      img(asset("nlnet.svg"), "The logo of the NLnet foundation."),
                    ),
                  ),
                  pinformative(
                    "This project was funded through the NGI Assure Fund, a fund established by NLnet with financial support from the European Commission",
                    apo,
                    "s Next Generation Internet programme, under the aegis of DG Communications Networks, Content and Technology under grant agreement № 957073.",
                  ),
                  marginale_inlineable(
                    a(
                      { href: "https://iroh.computer", class: "sponsor" },
                      img(asset("iroh.svg"), "The logo of Iroh."),
                    ),
                  ),
                  pinformative(
                    "We also thank our other sponsors for their support.",
                  ),
                ),
              ),
            ),
          ),
        ],
      metadata.status && metadata.status === 'proposal' ? 'container_main proposal' : "container_main bg",
      );
    },
  );

  return new Invocation(macro, [bodyexp]);
}

export function def_parameter_type(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "param type" }
    : { ...info, clazz: "param type" };
  return def_generic(info_, false, text, preview);
}

export function def_fake_parameter_type(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "param type defined_here" }
    : { ...info, clazz: "param type defined_here" };
  return def_generic(info_, true, text, preview);
}

export function def_parameter_value(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "param value" }
    : { ...info, clazz: "param value" };
  return def_generic(info_, false, text, preview);
}

export function def_fake_parameter_value(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "param value defined_here" }
    : { ...info, clazz: "param value defined_here" };
  return def_generic(info_, true, text, preview);
}

export function def_parameter_fn(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "param fn" }
    : { ...info, clazz: "param fn" };
  return def_generic(info_, false, text, preview);
}

export function def_fake_parameter_fn(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "param fn defined_here" }
    : { ...info, clazz: "param fn defined_here" };
  return def_generic(info_, true, text, preview);
}

export function def_value(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "value" }
    : { ...info, clazz: "value" };
  return def_generic(info_, false, text, preview);
}

export function def_fake_value(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "value defined_here" }
    : { ...info, clazz: "value defined_here" };
  return def_generic(info_, true, text, preview);
}

export function def_fn(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "fn" }
    : { ...info, clazz: "fn" };
  return def_generic(info_, false, text, preview);
}

export function def_fake_fn(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "fn defined_here" }
    : { ...info, clazz: "fn defined_here" };
  return def_generic(info_, true, text, preview);
}

export function def_value$(
  info: string | Def,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "value" }
    : { ...info, clazz: "value" };
  return def_generic$(info_, false, preview);
}

export function def_fake_value$(
  info: string | Def,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "value" }
    : { ...info, clazz: "value" };
  return def_generic$(info_, true, preview);
}

function normative(
  ...body: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "normative" }, ...args),
  );
  return new Invocation(macro, body);
}

export function pnormative(
  ...body: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => p({ class: "normative" }, ...args),
  );
  return new Invocation(macro, body);
}

export function pinformative(
  ...body: Expression[]
): Expression {
  return p({ class: "informative" }, preview_scope(...body));
}

export function pintroductory(
  ...body: Expression[]
): Expression {
  return p({ class: "introductory" }, preview_scope(...body));
}

export function aside_block(
  ...body: Expression[]
): Expression {
  return aside({ class: "long" }, body);
}

export function orange(
  ...exps: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "orange" }, ...args),
  );
  return new Invocation(macro, exps);
}

export function sky_blue(
  ...exps: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "sky-blue" }, ...args),
  );
  return new Invocation(macro, exps);
}

export function green(
  ...exps: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "green" }, ...args),
  );
  return new Invocation(macro, exps);
}

export function yellow(
  ...exps: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "yellow" }, ...args),
  );
  return new Invocation(macro, exps);
}

export function blue(
  ...exps: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "blue" }, ...args),
  );
  return new Invocation(macro, exps);
}

export function purple(
  ...exps: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "purple" }, ...args),
  );
  return new Invocation(macro, exps);
}

export function vermillion(
  ...exps: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => span({ class: "vermillion" }, ...args),
  );
  return new Invocation(macro, exps);
}

export function path(
  ...components: Expression[]
): Expression {
  const macro = new_macro(
    (args, _ctx) => {
      const e: Expression[] = [];
      for (let i = 0; i < args.length; i++) {
        e.push(
          span(
            { class: "path_segment" },
            span({ class: "path_segment_txt" }, args[i]),
          ),
        );
      }

      return span({ class: "path" }, e);
    },
  );

  return new Invocation(macro, components);
}

export function lis(
  ...items: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) =>
      ul(
        ...(args.map((item) => li(item))),
      ),
  );
  return new Invocation(macro, items);
}

export function ols(
  ...items: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) =>
      ol(
        ...(args.map((item) => li(item))),
      ),
  );
  return new Invocation(macro, items);
}

export function link(
  display: Expression,
  href: string,
): Invocation {
  const macro = new_macro(
    (args, _ctx) => a({ href, class: "external" }, args[0]),
  );
  return new Invocation(macro, [display]);
}

function create_etags(...contents: Expression[]) {
  const macro = new_macro(
    undefined,
    (expanded, ctx) => {
      const hash = createHash().update(expanded).digest("hex");

      write_file_relative(["..", "etag"], hash, ctx);

      return expanded;
    },
  );

  return new Invocation(macro, contents);
}

export function out_index_directory(
  path_fragment: string,
  ...contents: Expression[]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => {
      return out_directory(
        path_fragment,
        out_file("index.html", create_etags(...args)),
      );
    },
  );
  return new Invocation(macro, contents);
}

export function bitfield_doc(
  ...rows: [Expression, Expression, Expression][]
): Invocation {
  const macro = new_macro(
    (args, _ctx) => {
      const the_rows: Expression[] = [];
      for (let i = 0; i < rows.length * 3; i += 3) {
        the_rows.push([
          div({class: "bitfields_bits"}, args[i]),
          div({class: "bitfields_def"}, args[i + 1]),
          div({class: "bitfields_remark"}, args[i + 2]),
        ]);
      }
      return div(
        {class: "bitfields wide"},
        the_rows,
      );
    },
  );
  return new Invocation(macro, rows.flat(1));
}

const layout_opts = new LayoutOptions();

evaluate(enable_previews([
  set_root_url("https://willowprotocol.org/"),
  set_root_directory(["build"]),
  out_directory(
    "build",
    out_directory("previews"),
    out_file(
      "index.html",
      create_etags(site_template(
        {
          title: "Willow",
          name: "willow",
          heading: img("emblem.png", "A Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word \"Willow\"."),
        },
        [
          pintroductory(
            "Protocols for synchronisable data stores. The best parts? Fine-grained permissions, a keen approach to privacy, destructive edits, and a dainty bandwidth and memory footprint.",
          ),
          nav(
            lis(
              link_name("why_willow", "Why did we make Willow?"),
              link_name("data_model", "If you read only one specification, let it be this one"),
              link_name("specifications", "All of the specifications"),
              link_name('changes', "News and updates")
            ),
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/local-first.png"), "An anthropomorphic computer smiles and shrugs while a series of comical connectivity issues threaten its ethernet cable: a mouse nibbles through the cable, an axe chops it up, and an anvil falls toward it at high velocity."),
            ),
            "Data storage which never goes offline. You get always-available storage for arbitrary data (e.g. text, media). You can have as many of these stores as you want, keyed to different namespaces. When stores from different devices belong to the same namespace, they deterministically sync with each other.",
          ),
          
          pinformative(
            marginale_inlineable(
              img(asset("landing/privacy.png"), "A cartoonish troll tries to spy on a person enjoying themselves with a paper airplane, but a solid brick wall blocks the troll’s line of sight. The troll is deeply unhappy about this circumstance."),
            ),
            "Private and end-to-end encrypted. Other users can't find out what you’re interested in unless they already know about it themselves. And if they get that far, they still have to be able to decrypt synced data to make any sense of it."
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/prefix-pruning.png"), "Three stylised paper files hang off a tree branch. The branch is being cut off near its base by a pair of hedge clippers, in a way that all files will be pruned of the tree."),
            ),
            "Total erasure of data. Distributed systems use tombstones to communicate deletes, but even these leave metadata behind. Prefix pruning deletes many entries and all of their metadata in their entirety, leaving a single tombstone in their place.",
          ),
          

          pinformative(
            marginale_inlineable(
              img(asset("landing/capabilities.png"), `Two stylised admission tickets. One says "Admin", the other says "Aug 1st to Sep 3rd".`),
            ),
            "Fine-grained capabilities. Restrict read and write access by semantically meaningful ranges of data, or time range. Use your favourite existing capability system, or try our Meadowcap system.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/partial-sync.png"), "A cake with a single slice being removed. The selected slice has a strawberry on top. Hmm, strawberry cake..."),
            ),
            "Partial sync. Have a lot of data, but don't want to sync the whole thing to a particular device? Choose which data to replicate by what, when, or who.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/destructive-edits.png"), "A pencil overwriting a sequence of bits (zeros and ones), leaving no trace of the overwritten bits."),
            ),
            "Destructive edits. When you update a value, the old values and associated metadata are overwritten.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/forget-data.png"), "A cartoon foot cartoonishly kicking a cartoon file out of a cartoon door."),
            ),
            "Locally delete data you don’t want to store, even if it was authored by someone else.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/ants.png"), "Five ants carry zeros and ones off to the right. The numbers are about as large as the hard-working insects."),
            ),
            "Peers can communicate resource budgets, so devices with very limited memory can sync too.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/parametrised.png"), `The pronoun "I", followed by a heart, followed by two crossed-out names of hash functions ("MD5" and "SHA256), followed by the hash function of choice: "BLAKE3".`),
            ),
            "You choose the transport and cryptographic primitives suited to your use-case.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/concurrent.png"), "A happy little smiley face holding a laptop in one hand and a phone in the other hand. Yay."),
            ),
            "Authors can write from multiple devices concurrently. Yay.",
          ),
        ],
      )),
    ),
    out_file("styles.css", [
      layout_marginalia(layout_opts),
      "\n",
      read_file("design.css"),
      "\n",
      read_file("typography.css"),
      "\n",
      read_file("misc.css"),
      "\n",
      `@media (min-width: ${layout_opts.max_width_main}rem) {
  body {
    font-size: 1.2em;
  }
}`,
  "\n",
    ]),
    copy_file("named_assets"),
    out_directory("specs", [
      out_file("index.html", specifications),
      out_index_directory("data-model", data_model),
      out_index_directory("encodings", encodings),
      out_index_directory("grouping-entries", grouping_entries),
      out_index_directory("e2e", e2e),
      out_index_directory("meadowcap", meadowcap),
      out_index_directory("sync", sync),
      out_index_directory("pai", psi),
      out_index_directory("resource-control", resource_control),
      out_index_directory(
        "3d-range-based-set-reconciliation",
        range3d_based_set_reconciliation,
      ),
      out_index_directory("access-control", access_control),
      out_index_directory("sideloading", sideloading)
    ]),
    out_directory("more", [
      out_file("index.html", more),
      out_index_directory("why", why_willow),
      out_index_directory("compare", willow_compared),
      out_index_directory("timestamps-really", timestamps_really),
      out_index_directory("3dstorage", threedstorage),
      out_index_directory("projects-and-communities", projects_and_communities),
      out_index_directory("spec-statuses", spec_statuses),
      out_index_directory("changes", changes),
      out_index_directory("about-us", about),
    ]),
    out_directory("earthstar", [
      // out_file("index.html", more),
      out_index_directory("spec", es6_spec),
    ]),
    copy_statics("assets"),
  ),

  build_rss_feeds([{
    path: ["rss_changelog.xml"],
    feed_info: {
      title: "Willow Specification Changelog",
      link: "https://willowprotocol.org/more/changes/index.html#spec_changes",
      description: "Although we consider Willow’s specifications stable, unforeseen outcomes may force us to make amendments. Rather than making this a source of exciting surprises for implementors, we prefer to list those (hopefully few) changes here.",
      atomSelf: "https://willowprotocol.org/rss_changelog.xml",
      language: "en-gb",
    },
  },
  {
    path: ["rss_news.xml"],
    feed_info: {
      title: "Willow News and Updates",
      link: "https://willowprotocol.org/more/changes/index.html#news_and_updates",
      description: "Here we’ll share bits of news relevant to the Willow protocol, as well as improvements to the site. For example, the completion of an implementation, or the addition of new explanatory text and drawings to the site. Updates will be occasional and meaningful.",
      atomSelf: "https://willowprotocol.org/rss_changelog.xml",
      language: "en-gb",
    },
  }]),
]));
