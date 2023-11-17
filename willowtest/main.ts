import { createHash } from "npm:sha256-uint8array";
import { evaluate, Expression, Invocation, new_macro } from "../tsgen.ts";
import { html5, html5_dependency_css } from "../html5.ts";
import {
  a,
  aside,
  code,
  div,
  em,
  footer,
  h1,
  img,
  li,
  main,
  nav,
  p,
  span,
  title,
  ul,
} from "../h.ts";
import {
  copy_file,
  out_directory,
  out_file,
  write_file_relative,
} from "../out.ts";
import { read_file } from "../input.ts";
import { marginale, marginale_inlineable, sidenote } from "../marginalia.ts";
import { layout_marginalia, LayoutOptions } from "../layout_marginalia.ts";
import { hsection } from "../hsection.ts";
import { link_name, set_root_directory } from "../linkname.ts";
import { Def, def, def_generic, preview_scope, r, rs } from "../defref.ts";
import { data_model } from "./specs/data_model.ts";
import { meadowcap } from "./specs/meadowcap.ts";
import { sync } from "./specs/sync.ts";
import { resource_control } from "./specs/sync/resource_control.ts";
import { psi } from "./specs/sync/psi.ts";
import { product_based_set_reconciliation } from "./specs/sync/product_based_set_reconciliation.ts";
import { access_control } from "./specs/sync/access_control.ts";
import { timestamps_really } from "./specs/more/timestamps_really.ts";

interface Document {
  title: string;
  name: string; // globally unique name for the `name` macros
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
              hsection(meta.name, { wide: true }, meta.title, args[0]),
            ),
            footer(
              nav(
                ul(
                  li(a({ href: "/" }, "Home")),
                  li(a({ href: "/specs" }, "Specifications")),
                  li(
                    a(
                      { href: "mailto:mail@aljoscha-meyer.de,sam@gwil.garden" },
                      "Contact us",
                    ),
                  ),
                ),
                div(
                  marginale_inlineable(
                    a(
                      { href: "https://nlnet.nl" },
                      img({
                        src: "/assets/nlnet.svg",
                      }),
                    ),
                  ),
                  p("This project was funded through the NGI Assure Fund, a fund established by NLnet with financial support from the European Commission's Next Generation Internet programme, under the aegis of DG Communications Networks, Content and Technology under grant agreement № 957073."),
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

export function def_parameter(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "param" }
    : { ...info, clazz: "param" };
  return def_generic(info_, text, preview);
}

export function def_value(
  info: string | Def,
  text?: Expression,
  preview?: Expression,
): Expression {
  const info_ = typeof info === "string"
    ? { id: info, clazz: "value" }
    : { ...info, clazz: "value" };
  return def_generic(info_, text, preview);
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
      "anotherfile.html",
      site_template({ title: "Hi", name: "testfoo" }, [
        link_name("my_favorite_section", "Linking to another document."),
      ]),
    ),
    out_file(
      "index.html",
      site_template(
        {
          title: "TestSpec",
          name: "testbar",
        },
        [
          nav(
            ul(
              li(link_name("data_model", "Data Model")),
              li(link_name("meadowcap", "Meadowcap")),
              li(link_name("sync", "Sync")),
              li(link_name("resource_control", "Resource Management")),
            ),
          ),
          p([
            "This paragraph was marked neither as informative nor as normative. It will talk about ",
            rs("cow"),
            " and ",
            rs("duck"),
            ". I see four options: we can explicitly mark only the normative or only the informative paragraphs, we can explicitly mark every paragraph. Or we use only inline markup for normative content. ",
            normative(
              "This is an example of inline normative content. A ",
              def("cow"),
              " is a horse that produces chocolate.",
            ),
            " There would be no definitions in an unmarked parargaph, except in inline normative content, or if everything was normative by default. In the latter case, a ",
            def("duck"),
            " is a chicken that rides on a ",
            r("cow"),
            ". ",
            normative("Every ", r("cow"), " is a ", r("duck"), " itself."),
          ]),
          pinformative([
            "This paragraph was explicitly marked as informative. While it might reference predefined concepts such as ",
            rs("duck"),
            ", it should contain neither definitions nor inline normative content.",
          ]),
          pnormative([
            "This paragraph however is normative. Not only can it reference ",
            rs("cow"),
            ", it can also define its own notions. Did you know, for example, that a ",
            def("chicken"),
            " is a ",
            r("duck"),
            " that despises chocolate? It is truth now, such is the power of normative paragraphs and the definitions therein. ",
          ]),
          hsection("s1_0", "What a beautiful day", [
            "What a beautiful day it is to do some...",
            hsection("s2_0", "Bird Watching?", ["I guess."]),
            hsection("my_favorite_section", "Macro Writing?", [
              "It's all the rage!",
            ]),
          ]),
          // link_name("my_favorite_section", "Bloep bloep bloep."),
          p("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Condimentum mattis pellentesque id nibh tortor id aliquet lectus. Proin sed libero enim sed faucibus turpis. In dictum non consectetur a erat nam at. Nam libero justo laoreet sit amet cursus. Non arcu risus quis varius quam quisque id. In fermentum et sollicitudin ac orci. Convallis tellus id interdum velit laoreet. Dui accumsan sit amet nulla facilisi morbi. At tempor commodo ullamcorper a lacus vestibulum. Nibh sed pulvinar proin gravida. Consequat ac felis donec et odio pellentesque diam volutpat commodo. Amet nisl suscipit adipiscing bibendum est ultricies. Amet nisl purus in mollis nunc sed id."),
          marginale_inlineable(
            "This marginale is so important, it is displayed inline if screen space becomes too small.",
          ),
          p(
            "Justo donec enim diam vulputate ut. Orci a scelerisque purus semper eget duis at tellus at. Odio eu feugiat pretium nibh ipsum consequat nisl. Elementum integer enim neque volutpat ac tincidunt vitae. Posuere ac ut consequat semper viverra. Ut venenatis tellus in metus vulputate eu scelerisque felis imperdiet. Eget mauris",
            marginale(
              "A rude marginale interrupting a peaceful paragraph. At least it has the courtesy of disappearing when the screen becomes too small.",
            ),
            " pharetra et ultrices neque ornare aenean euismod elementum. Quis risus sed vulputate odio ut. Accumsan tortor ",
            sidenote(
              "posuere",
              "A sidenote. Sidenotes are numbered automatically.",
            ),
            " ac ut consequat semper viverra nam libero. Gravida arcu ac tortor dignissim convallis aenean et. Pellentesque pulvinar pellentesque ",
            sidenote("habitant", [
              "Like regular marginals, sidenotes disappear if the viewport is too narrow. By the way, notice how the wide paragraph below automatically dodges this overly long sidenote. That paragraph simply has a ",
              code("wide"),
              "class applied to it. That class can be applied to any block element in the main column.",
            ]),
            " morbi tristique senectus et netus et. Convallis convallis tellus id interdum velit laoreet id.",
          ),
          p(
            { class: "wide" },
            "Ut eu sem integer vitae justo eget. Cursus risus at ultrices mi tempus imperdiet. Id aliquet risus feugiat in ante metus. Tincidunt eget nullam non nisi est sit amet facilisis magna. In dictum non consectetur a erat nam at lectus. Arcu non sodales neque sodales ut etiam. Facilisis volutpat est velit egestas dui id ornare. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. Laoreet sit amet cursus sit amet dictum sit amet justo. Volutpat commodo sed egestas egestas fringilla phasellus. Id semper risus in hendrerit gravida rutrum quisque non. Scelerisque varius morbi enim nunc faucibus a pellentesque sit. Lorem dolor sed viverra ipsum nunc aliquet bibendum enim. Nulla porttitor massa id neque aliquam. Sed turpis tincidunt id aliquet risus feugiat in. Nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Posuere morbi leo urna molestie at elementum eu facilisis. Quis hendrerit dolor magna eget est lorem ipsum dolor sit.",
          ),
          p(
            "Ut eu sem integer vitae justo eget. Cursus risus at ultrices mi tempus imperdiet. Id aliquet risus feugiat in ante metus. Tincidunt eget nullam non nisi est sit amet facilisis magna. In dictum non consectetur a erat nam at lectus. Arcu non sodales neque sodales ut etiam. Facilisis volutpat est velit egestas dui id ornare. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. Laoreet sit amet cursus sit amet dictum sit amet justo. Volutpat commodo sed egestas egestas fringilla phasellus. Id semper risus in hendrerit gravida rutrum quisque non. Scelerisque varius morbi enim nunc faucibus a pellentesque sit. Lorem dolor sed viverra ipsum nunc aliquet bibendum enim. Nulla porttitor massa id neque aliquam. Sed turpis tincidunt id aliquet risus feugiat in. Nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Posuere morbi leo urna molestie at elementum eu facilisis. Quis hendrerit dolor magna eget est lorem ipsum dolor sit.",
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
    copy_file("assets"),
    out_directory("specs", [
      out_index_directory("data-model", data_model),
      out_index_directory("meadowcap", meadowcap),
      out_directory("sync", [
        out_file("index.html", create_etags(sync)),
        out_index_directory("psi", psi),
        out_index_directory("resource-control", resource_control),
        out_index_directory(
          "product-based-set-reconciliation",
          product_based_set_reconciliation,
        ),
        out_index_directory("access-control", access_control),
      ]),
    ]),
    out_directory("more", [
      out_index_directory("timestamps-really", timestamps_really),
    ]),
  ),
]);
