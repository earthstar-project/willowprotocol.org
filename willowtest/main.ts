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
  nav,
  ol,
  p,
  span,
  title,
  ul,
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
import { hsection } from "../hsection.ts";
import { link_name, set_root_directory } from "../linkname.ts";
import { Def, def_generic, def_generic$, preview_scope } from "../defref.ts";
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
}

export function site_template(meta: Document, body: Expression): Invocation {
  const macro = new_macro(
    (args, _ctx) => {
      return html5(
        [
          html5_dependency_css("/styles.css"),
          title(`Willow Specifications - ${meta.title}`),
        ],
        [
          div(
            { class: "container_main" },
            main(
              hsection(
                meta.name,
                { wide: true },
                meta.heading ? meta.heading : meta.title,
                args[0],
              ),
            ),
            footer(
              nav(
                ul(
                  li(a({ href: "/", class: "internal" }, "Home")),
                  li(link_name("specifications", "Specs")),
                  li(link_name("more", "More")),
                  li(
                    a(
                      { href: "mailto:mail@aljoscha-meyer.de,sam@gwil.garden", class: "internal" },
                      "Contact us",
                    ),
                  ),
                ),
                div(
                  marginale_inlineable(
                    a(
                      { href: "https://nlnet.nl", class: "funder" },
                      img(asset("nlnet.svg")),
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
                      img(asset("iroh.svg")),
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
      );
    },
  );

  return new Invocation(macro, [body]);
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

const layout_opts = new LayoutOptions();

evaluate([
  set_root_directory(["build"]),
  out_directory(
    "build",
    out_directory("previews"),
    out_file(
      "index.html",
      site_template(
        {
          title: "Willow",
          name: "willow",
          heading: img("emblem.png"),
        },
        [
          pintroductory(
            "A protocol specification for local-first data stores which sync. The best parts? Fine-grained permissions, destructive edits, and deletion without leaving metadata behind.",
          ),
          nav(
            lis(
              link_name("specifications", "The specifications"),
            ),
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/local-first.png")),
            ),
            "Data storage which never goes offline. You get local-first key value stores for arbitrary data (e.g. text, media). You can have as many of these stores as you want, keyed to different namespaces. When stores belong to the same namespace, they deterministically sync with each other.",
          ),
          
          pinformative(
            "Private and end-to-end encrypted. Other users can't find out what you’re interested in unless they already know about it themselves. After that, they still have to be able to decrypt synced data to make any sense of it."
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/prefix-pruning.png")),
            ),
            "Total erasure of data. Distributed systems use tombstones to communicate deletes, but even these leave metadata behind. Prefix pruning deletes many entries and all of their metadata in their entirety, leaving a single tombstone in their place.",
          ),
          

          pinformative(
            marginale_inlineable(
              img(asset("landing/capabilities.png")),
            ),
            "Fine grained capabilities. Restrict read and write access by semantically meaningful ranges of data, or time range. Use your favourite existing capability system, or try our Meadowcap system.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/partial-sync.png")),
            ),
            "Partial sync. Have a lot of data, but don't want to sync the whole thing to a particular device? Choose which data to replicate by what, when, or who.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/destructive-edits.png")),
            ),
            "Destructive edits. When you update a value, the old values and associated metadata are overwritten.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/forget-data.png")),
            ),
            "Locally delete data you don’t want to store, even if it was authored by someone else.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/ants.png")),
            ),
            "Peers can communicate resource budgets, so devices with very limited memory can sync too.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/parametrised.png")),
            ),
            "You choose the transport and cryptographic primitives suited to your use-case.",
          ),

          pinformative(
            marginale_inlineable(
              img(asset("landing/concurrent.png")),
            ),
            "Authors can write from multiple devices concurrently. Yay.",
          ),
        ],
      ),
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
    ]),
    copy_file("named_assets"),
    out_directory("specs", [
      out_file("index.html", specifications),
      out_index_directory("data-model", data_model),
      out_index_directory("encodings", encodings),
      out_index_directory("grouping_entries", grouping_entries),
      out_index_directory("e2e", e2e),
      out_index_directory("meadowcap", meadowcap),
      out_directory("sync", [
        out_file("index.html", create_etags(sync)),
        out_index_directory("psi", psi),
        out_index_directory("resource-control", resource_control),
        out_index_directory(
          "product-based-set-reconciliation",
          range3d_based_set_reconciliation,
        ),
        out_index_directory("access-control", access_control),
      ]),
    ]),
    out_directory("more", [
      out_file("index.html", more),
      out_index_directory("timestamps-really", timestamps_really),
    ]),
    copy_statics("assets"),
  ),
]);
