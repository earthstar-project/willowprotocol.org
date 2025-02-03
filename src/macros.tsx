import { Expression, Expressions } from "macromania";
import { Wip } from "macromania-wip";
import { A, Span } from "macromania-html";
import { M } from "macromania-katex";
import { Def } from "macromania-defref";

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
