import { Expression, Invocation, evaluate, new_macro } from "../tsgen.ts";
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
  title,
  ul,
} from "../h.ts";
import { copy_file, out_directory, out_file } from "../out.ts";
import { read_file } from "../input.ts";
import { marginale, marginale_inlineable, sidenote } from "../marginalia.ts";
import { LayoutOptions, layout_marginalia } from "../layout_marginalia.ts";

interface Document {
  title: string;
}

export function spec_template(
  meta: Document,
  body: Expression,
): Expression {
  return html5(
    [
      html5_dependency_css("/styles.css"),
      title(`Willow Specifications - ${meta.title}`),
    ],
    [
      div(
        { class: "container_main"},
        main(
          h1(meta.title),
          div({ class: "mt-8" }, body),
        ),
        // footer(
        //   nav(
        //     ul(
        //       li(a({ href: "/" }, "Home")),
        //       li(a({ href: "/specs" }, "Specifications")),
        //       li(
        //         a(
        //           { href: "mailto:mail@aljoscha-meyer.de,sam@gwil.garden" },
        //           "Contact us",
        //         ),
        //       ),
        //     ),
        //     p(), // really, gwil? =P
        //     div(
        //       aside(
        //         a(
        //           { href: "https://nlnet.nl" },
        //           img({
        //             src:
        //               "/nlnet.svg",
        //           }),
        //         ),
        //       ),
        //       p("This project was funded through the NGI Assure Fund, a fund established by NLnet with financial support from the European Commission's Next Generation Internet programme, under the aegis of DG Communications Networks, Content and Technology under grant agreement № 957073."),
        //     ),
        //   ),
        // ),
      ),
    ],
  );
}

export function foo(
  body: Expression,
): Invocation {
  const macro = new_macro(
    (args, _ctx) => div(p(args[0])),
  );
  return new Invocation(macro, [body]);
}

// evaluate(
//   out_directory(
//     "build",
//     out_file("testspec.html",
//       foo("Hi!"),
//     ),
//     out_file("testspec.html", "This will not work because it is an out_file with a duplicate name."),
//   )
// );

const layout_opts = new LayoutOptions();

evaluate(
  out_directory(
    "build",
    out_file("testspec.html",
      spec_template(
        {
          title: "TestSpec",
        },
        [
          p("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Condimentum mattis pellentesque id nibh tortor id aliquet lectus. Proin sed libero enim sed faucibus turpis. In dictum non consectetur a erat nam at. Nam libero justo laoreet sit amet cursus. Non arcu risus quis varius quam quisque id. In fermentum et sollicitudin ac orci. Convallis tellus id interdum velit laoreet. Dui accumsan sit amet nulla facilisi morbi. At tempor commodo ullamcorper a lacus vestibulum. Nibh sed pulvinar proin gravida. Consequat ac felis donec et odio pellentesque diam volutpat commodo. Amet nisl suscipit adipiscing bibendum est ultricies. Amet nisl purus in mollis nunc sed id."),
          marginale_inlineable("This marginale is so important, it is displayed inline if screen space becomes too small."),
          p(
            "Justo donec enim diam vulputate ut. Orci a scelerisque purus semper eget duis at tellus at. Odio eu feugiat pretium nibh ipsum consequat nisl. Elementum integer enim neque volutpat ac tincidunt vitae. Posuere ac ut consequat semper viverra. Ut venenatis tellus in metus vulputate eu scelerisque felis imperdiet. Eget mauris",
            marginale("A rude marginale interrupting a peaceful paragraph. At least it has the courtesy of disappearing when the screen becomes too small."),
            " pharetra et ultrices neque ornare aenean euismod elementum. Quis risus sed vulputate odio ut. Accumsan tortor ",
            sidenote("posuere", "A sidenote. Sidenotes are numbered automatically."),
            " ac ut consequat semper viverra nam libero. Gravida arcu ac tortor dignissim convallis aenean et. Pellentesque pulvinar pellentesque ",
            sidenote("habitant", [
              "Like regular marginals, sidenotes disappear if the viewport is too narrow. By the way, notice how the wide paragraph below automatically dodges this overly long sidenote. That paragraph simply has a ",
              code("wide"),
              "class applied to it. That class can be applied to any block element in the main column."
            ]),
            " morbi tristique senectus et netus et. Convallis convallis tellus id interdum velit laoreet id.",
          ),
          p({class: "wide"}, "Ut eu sem integer vitae justo eget. Cursus risus at ultrices mi tempus imperdiet. Id aliquet risus feugiat in ante metus. Tincidunt eget nullam non nisi est sit amet facilisis magna. In dictum non consectetur a erat nam at lectus. Arcu non sodales neque sodales ut etiam. Facilisis volutpat est velit egestas dui id ornare. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. Laoreet sit amet cursus sit amet dictum sit amet justo. Volutpat commodo sed egestas egestas fringilla phasellus. Id semper risus in hendrerit gravida rutrum quisque non. Scelerisque varius morbi enim nunc faucibus a pellentesque sit. Lorem dolor sed viverra ipsum nunc aliquet bibendum enim. Nulla porttitor massa id neque aliquam. Sed turpis tincidunt id aliquet risus feugiat in. Nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Posuere morbi leo urna molestie at elementum eu facilisis. Quis hendrerit dolor magna eget est lorem ipsum dolor sit."),
        ],
      ),
    ),
    out_file("styles.css", [
      layout_marginalia(layout_opts),
      "\n",
      // read_file("layout.css"),
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
  )
);