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
          src="data:image/png;base64,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"
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
