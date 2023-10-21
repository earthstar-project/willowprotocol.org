import { Expression, Invocation, new_macro, evaluate } from "../tsgen.ts";
import { html5, html5_dependency_css, html5_initial_state, Html5State } from "../html5.ts";
import {
  a,
  aside,
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
import { OutState, out_directory, out_file, out_initial_state } from "../out.ts";

interface Document {
  title: string;
}

export function spec_template<State extends Html5State>(
  meta: Document,
  body: Expression<State>,
): Expression<State> {
  return html5(
    [
      "jjjjjjjjjjj"
      // html5_dependency_css("/styles.css"),
      // title(`Willow Specifications - ${meta.title}`),
    ],
    [
      // main(
      //   h1(meta.title),
      //   div({ class: "mt-8" }, body),
      // ),
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
      //               "/nlnet.svg?__frsh_c=280495d91c19c7de830192b2962284a0fa8653ac",
      //           }),
      //         ),
      //       ),
      //       p("This project was funded through the NGI Assure Fund, a fund established by NLnet with financial support from the European Commission's Next Generation Internet programme, under the aegis of DG Communications Networks, Content and Technology under grant agreement № 957073."),
      //     ),
      //   ),
      // ),
    ],
  );
}



evaluate<OutState & Html5State>(
  out_directory("build", out_file("testspec.html",
    spec_template(
      {
        title: "TestSpec",
      },
      [
        p("Hello, world."),
      ]
    ),
  )),
  {
    ...out_initial_state(),
    ...html5_initial_state(),
  }
);