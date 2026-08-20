import { Expression, Expressions } from "macromania";
import { Wip } from "macromania-wip";
import {
  A,
  Aside,
  Code,
  Details,
  Div,
  Img,
  Li,
  Span,
  Summary,
  Ul,
} from "macromania-html";
import { M } from "macromania-katex";
import { Def } from "macromania-defref";
import { Shiki, ShikiProps } from "macromania-shiki";

////////////////////////
// Comments and TODOs //
////////////////////////

export function Alj(
  { children, inline }: { children?: Expressions; inline?: boolean },
): Expression {
  return (
    <Wip
      fg="#6804cc"
      bg="#ecdbfc"
      wrap={(_ctx, inner) => <>alj: {inner}</>}
      children={children}
      inline={inline}
    />
  );
}

export function Gwil(
  { children, inline }: { children?: Expressions; inline?: boolean },
): Expression {
  return (
    <Wip
      fg="#cc7504"
      bg="#fceedb"
      wrap={(_ctx, inner) => <>gwil: {inner}</>}
      children={children}
      inline={inline}
    />
  );
}

/////////////////////////////
// General Purpose Writing //
/////////////////////////////

export function NoWrap({ children }: { children: Expressions }): Expression {
  return (
    <Span clazz="nowrap">
      <exps x={children} />
    </Span>
  );
}

export function Quotes({ children }: { children: Expressions }): Expression {
  return (
    <>
      “<exps x={children} />”
    </>
  );
}

//////////////////////////
// General-Purpose Math //
//////////////////////////

export function MCeil(
  { children }: { base?: Expressions; children?: Expressions },
): Expression {
  return (
    <M>
      \lceil<exps x={children} />\rceil
    </M>
  );
}

export function MFloor(
  { children }: { base?: Expressions; children?: Expressions },
): Expression {
  return (
    <M>
      \lfloor<exps x={children} />\rfloor
    </M>
  );
}

export function MLog(
  { children, base }: { base?: Expressions; children?: Expressions },
): Expression {
  return (
    <M>
      \log{base
        ? (
          <>
            _<Curly>
              <exps x={base} />
            </Curly>
          </>
        )
        : ""}(<exps x={children} />)
    </M>
  );
}

export function Mathcal({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      \mathcal<Curly>
        <exps x={children} />
      </Curly>
    </M>
  );
}

export function MAligned({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      \begin<Curly>aligned</Curly>
      <exps x={children} />
      \end<Curly>aligned</Curly>
    </M>
  );
}

export function MParen({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      \left(<exps x={children} />\right)
    </M>
  );
}

export function Sum(
  { sub, sup, children }: {
    sub?: Expressions;
    sup?: Expressions;
    children?: Expressions;
  },
): Expression {
  return (
    <M>
      \sum
      {sub
        ? (
          <>
            _<Curly>
              <exps x={sub} />
            </Curly>
          </>
        )
        : ""}
      {sup
        ? (
          <>
            ^<Curly>
              <exps x={sup} />
            </Curly>
          </>
        )
        : ""}
      <exps x={children} />
    </M>
  );
}

export function Exp(
  { sup, children }: { sup?: boolean; children?: Expressions },
): Expression {
  return (
    <M>
      {sup
        ? (
          <>
            e^<Curly>
              <exps x={children} />
            </Curly>
          </>
        )
        : (
          <>
            \exp\left(<exps x={children} />\right)
          </>
        )}
    </M>
  );
}

export function Mathfrak({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      \mathfrak<Curly>
        <exps x={children} />
      </Curly>
    </M>
  );
}

export function MFrac(
  { num, de }: { num: Expressions; de: Expressions },
): Expression {
  return (
    <M>
      \frac<Curly>
        <exps x={num} />
      </Curly>
      <Curly>
        <exps x={de} />
      </Curly>
    </M>
  );
}

export function Curly({ children }: { children?: Expressions }): Expression {
  return (
    <>
      {"{"}
      <exps x={children} />
      {"}"}
    </>
  );
}

export function MSet({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      {"\\{"}
      <exps x={children} />
      {"\\}"}
    </M>
  );
}

export function BigO({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      <Mathcal>O</Mathcal>(<exps x={children} />)
    </M>
  );
}

export function Pr({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      ℙ \left(<exps x={children} />\right)
    </M>
  );
}

export function E({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      𝔼 \left(<exps x={children} />\right)
    </M>
  );
}

export function BigTheta({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      \Theta
      {"("}
      <exps x={children} />
      {")"}
    </M>
  );
}

export function BigOmega({ children }: { children?: Expressions }): Expression {
  return (
    <M>
      \Omega
      {"("}
      <exps x={children} />
      {")"}
    </M>
  );
}

/**
 * \Nat^{+}
 */
export function Np(): Expression {
  return <M>\N^{`{+}`}</M>;
}

/**
 * Render a string as an operator name.
 */
export function OpName({ children }: { children: Expressions }): Expression {
  return (
    <M>
      \mathrm{"{"}
      <exps x={children} />
      {"}"}
    </M>
  );
}

/**
 * Mathy function name and optional type. Creates a DefRef def for the function. Children are the rendered name of the function.
 */
export function MFunDef(
  { n, preview, dom, co, sub, children }: {
    n: string;
    preview?: Expression;
    dom: Expressions;
    co: Expressions;
    sub?: Expressions;
    children: Expressions;
  },
): Expression {
  return (
    <M>
      <Def
        n={n}
        preview={preview}
        r={
          <OpName>
            <exps x={children} />
          </OpName>
        }
      />
      {sub
        ? (
          <>
            _{"{"}
            <exps x={sub} />
            {"}"}
          </>
        )
        : ""}
      {dom && co
        ? (
          <>
            {":"} <exps x={dom} /> \rightarrow <exps x={co} />
          </>
        )
        : ""}
    </M>
  );
}

///////////////////////////////
// Specific to this project. //
///////////////////////////////

export function AE(
  { children, href }: { children: Expressions; href: Expressions },
): Expression {
  return (
    <A clazz="external" href={<exps x={href} />}>
      <exps x={children} />
    </A>
  );
}

export function Orange({ children }: { children: Expressions }): Expression {
  return (
    <Span clazz="orange">
      <exps x={children} />
    </Span>
  );
}

export function SkyBlue({ children }: { children: Expressions }): Expression {
  return (
    <Span clazz="sky-blue">
      <exps x={children} />
    </Span>
  );
}

export function Green({ children }: { children: Expressions }): Expression {
  return (
    <Span clazz="green">
      <exps x={children} />
    </Span>
  );
}

export function Yellow({ children }: { children: Expressions }): Expression {
  return (
    <Span clazz="yellow">
      <exps x={children} />
    </Span>
  );
}

export function Blue({ children }: { children: Expressions }): Expression {
  return (
    <Span clazz="blue">
      <exps x={children} />
    </Span>
  );
}

export function Purple({ children }: { children: Expressions }): Expression {
  return (
    <Span clazz="purple">
      <exps x={children} />
    </Span>
  );
}

export function Vermillion(
  { children }: { children: Expressions },
): Expression {
  return (
    <Span clazz="vermillion">
      <exps x={children} />
    </Span>
  );
}

export function Path({ components }: { components: Expression[] }): Expression {
  return (
    <Span clazz="path">
      <exps
        x={components.map((comp, i) => (
          <Span clazz="path_segment">
            <Span clazz="path_segment_txt">{comp}</Span>
          </Span>
        ))}
      />
    </Span>
  );
}

export function An(
  { an, capitalise }: { an?: boolean; capitalise?: boolean },
): Expression {
  if (capitalise) {
    return an ? "An" : "A";
  } else {
    return an ? "an" : "a";
  }
}

/**
 * Like `Figcaption`, but it works in marginalia.
 */
export function MarginCaption(
  { children }: { children: Expressions },
): Expression {
  return (
    <Span clazz="margincaption">
      <exps x={children} />
    </Span>
  );
}

/**
 * A long aside that goes in the main block
 */
export function AsideBlock(
  { children }: { children: Expressions },
): Expression {
  return (
    <Aside clazz="long">
      <exps x={children} />
    </Aside>
  );
}

/**
 * A Rust code sample
 */
export function RustSample(
  { path, decorations }: {
    path: string[];
    decorations?: ShikiProps["decorations"];
  },
): Expression {
  return (
    <Div clazz="wide code_sample">
      <Shiki
        path={path}
        lang="rust"
        theme="rose-pine-dawn"
        decorations={decorations}
      />
    </Div>
  );
}

export function TerminalInput(
  { children }: { children: Expression },
): Expression {
  return <Code clazz="terminal-input">{children}</Code>;
}

/**
 * Presentation used for terminal output
 */
export function TerminalOutput(
  { path, decorations }: {
    path: string[];
    decorations?: ShikiProps["decorations"];
  },
): Expression {
  return (
    <Div clazz="wide code_sample">
      <Shiki
        path={path}
        lang="text"
        theme="rose-pine-moon"
        decorations={decorations}
      />
    </Div>
  );
}

/**
 * Megabar!!!
 */
export type MegabarLocation =
  | "worm-blossom"
  | "willow"
  | "bab"
  | "sneakerweb"
  | "ufotofu"
  | "openCollective";

type MegabarProject = {
  name: string;
  colour: string;
  description: string;
  url: string;
};

const megabarProjects: Record<MegabarLocation, MegabarProject> = {
  "worm-blossom": {
    name: "worm-blossom.org",
    colour: "pink",
    description: "is a lovely blog",
    url: "https://worm-blossom.org",
  },
  "willow": {
    name: "Willow",
    colour: "yellow",
    description: "is a thoughtful p2p protocol",
    url: "http://willowprotocol.org",
  },
  "bab": {
    name: "Bab",
    colour: "rgb(242, 203, 198)",
    description: "is a verifiable streaming hash function",
    url: "https://bab-hash.org",
  },
  "sneakerweb": {
    name: "sneakerweb",
    colour: "white",
    description: "is a parallel web transported by physical media",
    url: "https://sneakerweb.org",
  },
  "ufotofu": {
    name: "ufotofu",
    colour: "rgb(119, 181, 213)",
    description: "is symmetric sinks and streams for Rust",
    url: "https://worm-blossom.org/ufotofu/",
  },
  "openCollective": {
    name: "Support us",
    colour: "rgb(59, 221, 110)",
    description: "on our OpenCollective",
    url: "https://opencollective.com/worm-blossom",
  },
};

export function WbMegabar(
  { location, rootStyles }: { location: MegabarLocation; rootStyles?: string },
) {
  return (
    <Details
      style={`color: white; background: black; font-size: 16px; ${rootStyles}`}
    >
      <Summary style="border-bottom: 1px solid rgb(134, 134, 134); padding-bottom: 0.05rem; padding: 0.15rem;">
        <MegabarSummary location={location} />
      </Summary>

      <Div style="display: flex; gap: 2ch; padding: 1rem;">
        <Img
          style="width: 100px;"
          src="/assets/graphics/megabar/side_illo.png"
        />
        <Ul style="padding: 0; margin: 0; list-style: none; line-height: 1.2rem;">
          {Object.keys(megabarProjects).filter((loc) => loc != location)
            .map((loc) => <MegabarRow location={loc as MegabarLocation} />)}
        </Ul>
      </Div>
    </Details>
  );
}

function MegabarRow({ location }: { location: MegabarLocation }) {
  const project = megabarProjects[location];

  return (
    <Li>
      <A style={`color:${project.colour}`} href={project.url}>
        {project.name}
      </A>{" "}
      {project.description}
    </Li>
  );
}

function MegabarSummary({ location }: { location: MegabarLocation }) {
  switch (location) {
    case "worm-blossom":
      return (
        <Div style="display: inline-flex; align-items: center; gap: 1ch;">
          see what else
          <Img
            style="image-rendering: pixelated; width: 16px; height: 16px;"
            src="https://worm-blossom.org/assets/favicon.png"
          />{" "}
          <Span style={`color: ${megabarProjects["worm-blossom"].colour}`}>
            worm-blossom
          </Span>{" "}
          has made!
        </Div>
      );
    default:
      return (
        <Div style="display: inline-flex; align-items: center; gap: 1ch;">
          <Img
            style="image-rendering: pixelated; width: 16px; height: 16px;"
            src="https://worm-blossom.org/assets/favicon.png"
          />{" "}
          <A style={`color: ${megabarProjects["worm-blossom"].colour}`}>
            worm-blossom
          </A>{" "}
          made this. come see what else we make!
        </Div>
      );
  }
}
