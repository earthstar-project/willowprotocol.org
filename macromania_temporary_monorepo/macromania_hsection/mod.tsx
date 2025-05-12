import { Section } from "../macromania_html/src/elements/section.tsx";
import {
  Expressions,
  LatexMacro,
  Li,
  Ol,
  previewScopeDependencyCss,
  previewScopeDependencyJs,
  ScriptDependencyInfo,
  StylesheetDependencyInfo,
} from "./deps.ts";
import { makeNumberingRenderer } from "./deps.ts";
import { R } from "./deps.ts";
import { Div } from "./deps.ts";
import { Def } from "./deps.ts";
import { DefProps } from "./deps.ts";
import {
  Colors,
  Context,
  Counter,
  createConfigOptions,
  createLogger,
  createSubstate,
  Expression,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  NumberingInfo,
  TagProps,
  shouldEmitLatex,
} from "./deps.ts";

// Create logger.

const l = createLogger("LoggerHsection");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerHsection };

// Define config options and macro.

export type HsectionConfig = {
  /**
   * The `NumberingInfo` to attach to the `<Def>s` of each heading, if any.
   */
  level1NumberingInfo?: NumberingInfo | null;
  level2NumberingInfo?: NumberingInfo | null;
  level3NumberingInfo?: NumberingInfo | null;
  level4NumberingInfo?: NumberingInfo | null;
  level5NumberingInfo?: NumberingInfo | null;
  level6NumberingInfo?: NumberingInfo | null;
  /**
   * Text to place in the heading before the title of the section.
   *
   * Defaults to not adding anything.
   */
  titleRenderPre?: (ctx: Context, numbering: number[]) => Expression;
  /**
   * Text to place in the heading after the title of the section.
   *
   * Defaults to not adding anything.
   */
  titleRenderPost?: (ctx: Context, numbering: number[]) => Expression;
  /**
   * Css dependencies to add to all pages with a `<TableOfContents/>` macro.
   */
  depsCssToc?: StylesheetDependencyInfo[];
  /**
   * Js dependencies to add to all pages with a `<TableOfContents/>` macro.
   */
  depsJsToc?: ScriptDependencyInfo[];
};

function configNaming(config: HsectionConfig, i: number): NumberingInfo | null {
  if (i === 0) {
    return config.level1NumberingInfo!;
  } else if (i === 1) {
    return config.level2NumberingInfo!;
  } else if (i === 2) {
    return config.level3NumberingInfo!;
  } else if (i === 3) {
    return config.level4NumberingInfo!;
  } else if (i === 4) {
    return config.level5NumberingInfo!;
  } else if (i === 5) {
    return config.level6NumberingInfo!;
  } else {
    throw new Error(
      "unreachable, should never call configNaming with a different argument",
    );
  }
}

const defaultNumberingRenderer = makeNumberingRenderer(1);

const [getConfig, ConfigHsection] = createConfigOptions<
  HsectionConfig,
  HsectionConfig
>("ConfigHsection", () => ({
  level1NumberingInfo: null,
  level2NumberingInfo: {
    r: "Section",
    rb: "Section",
    rs: "Sections",
    rsb: "Sections",
    render: defaultNumberingRenderer,
  },
  level3NumberingInfo: {
    r: "Section",
    rb: "Section",
    rs: "Sections",
    rsb: "Sections",
    render: defaultNumberingRenderer,
  },
  level4NumberingInfo: {
    r: "Section",
    rb: "Section",
    rs: "Sections",
    rsb: "Sections",
    render: defaultNumberingRenderer,
  },
  level5NumberingInfo: {
    r: "Section",
    rb: "Section",
    rs: "Sections",
    rsb: "Sections",
    render: defaultNumberingRenderer,
  },
  level6NumberingInfo: {
    r: "Section",
    rb: "Section",
    rs: "Sections",
    rsb: "Sections",
    render: defaultNumberingRenderer,
  },
  titleRenderPre: (_ctx, _numbering: number[]) => {
    return "";
  },
  titleRenderPost: (_ctx, _numbering: number[]) => {
    return "";
  },
  depsCssToc: [],
  depsJsToc: [],
}), (old, update) => {
  const newValue: HsectionConfig = {
    level1NumberingInfo: update.level1NumberingInfo === undefined
      ? old.level1NumberingInfo
      : update.level1NumberingInfo,
    level2NumberingInfo: update.level2NumberingInfo === undefined
      ? old.level2NumberingInfo
      : update.level2NumberingInfo,
    level3NumberingInfo: update.level3NumberingInfo === undefined
      ? old.level3NumberingInfo
      : update.level3NumberingInfo,
    level4NumberingInfo: update.level4NumberingInfo === undefined
      ? old.level4NumberingInfo
      : update.level4NumberingInfo,
    level5NumberingInfo: update.level5NumberingInfo === undefined
      ? old.level5NumberingInfo
      : update.level5NumberingInfo,
    level6NumberingInfo: update.level6NumberingInfo === undefined
      ? old.level6NumberingInfo
      : update.level6NumberingInfo,
    titleRenderPre: update.titleRenderPre === undefined
      ? old.titleRenderPre
      : update.titleRenderPre,
    titleRenderPost: update.titleRenderPost === undefined
      ? old.titleRenderPost
      : update.titleRenderPost,
    depsCssToc: update.depsCssToc === undefined
      ? old.depsCssToc
      : update.depsCssToc,
    depsJsToc: update.depsJsToc === undefined
      ? old.depsJsToc
      : update.depsJsToc,
  };
  return newValue;
});
export { ConfigHsection };

/**
 * Props for the `<Hsection>` macro.
 */
export type HsectionProps =
  & {
    /**
     * The title of the section.
     */
    title: Expression;
    /**
     * Do not render any numbering for this section. Do not count the section for numbering purposes either.
     */
    noNumbering?: boolean;
    /**
     * A short version of the title, to be used in space-constrained
     * tables of contents.
     *
     * Defaults to the normal `title`.
     */
    shortTitle?: Expressions;
    /**
     * Do not include this section in the rendered table of contents.
     */
    noToc?: boolean;
  }
  & DefProps
  & { children?: Expressions };

interface HSectionState {
  // evaluation round in which the section gets created (initially set to -1)
  creationRound: number;
  // heading level of the current hsection
  level: number;
  // sequence of indexes to locate the current hsection in the `structure`
  // only useful for building the SectionStructure during first invocation of each hsection macro,
  // contains garbage in further expansion attempts
  finger: number[];
  // virtual level 0 structure, containing all level 1 headings
  structure: SectionStructure;
  // hierarchy of ids leading to the current section. Unlike finger, this is always accurate
  current_breadcrumbs: string[];
  // counters for the six levels
  counterH1: Counter;
  counterH2: Counter;
  counterH3: Counter;
  counterH4: Counter;
  counterH5: Counter;
  counterH6: Counter;
}

interface SectionStructure {
  id: string;
  short_title: Expression | null;
  noToc: boolean;
  level: number;
  children: SectionStructure[];
  child_id_to_index: Map<string, number>;
}

function new_section_structure(id: string, short_title: Expression | null, noToc: boolean, level: number): SectionStructure {
  return {
    id,
    short_title,
    noToc,
    level,
    children: [],
    child_id_to_index: new Map(),
  };
}

const [getState, _setState] = createSubstate<HSectionState>(() => {
  const counterH1 = new Counter("hsection-counter-for-h1-tags", 0);
  const counterH2 = new Counter(
    "hsection-counter-for-h2-tags",
    0,
    counterH1,
  );
  const counterH3 = new Counter(
    "hsection-counter-for-h3-tags",
    0,
    counterH2,
  );
  const counterH4 = new Counter(
    "hsection-counter-for-h4-tags",
    0,
    counterH3,
  );
  const counterH5 = new Counter(
    "hsection-counter-for-h5-tags",
    0,
    counterH4,
  );
  const counterH6 = new Counter(
    "hsection-counter-for-h6-tags",
    0,
    counterH5,
  );

  return {
    creationRound: -1,
    level: -1,
    finger: [0],
    structure: new_section_structure("", "", false, 0),
    current_breadcrumbs: [],
    counterH1,
    counterH2,
    counterH3,
    counterH4,
    counterH5,
    counterH6,
  };
});

function levelToHmacro(i: number): (
  props: TagProps & { children?: Expressions },
) => Expression {
  if (i === 0) {
    return H1;
  } else if (i === 1) {
    return H2;
  } else if (i === 2) {
    return H3;
  } else if (i === 3) {
    return H4;
  } else if (i === 4) {
    return H5;
  } else if (i === 5) {
    return H6;
  } else {
    throw new Error(
      "unreachable, should never call levelToHmacro with a different argument",
    );
  }
}

/**
 * Obtain the `Counter` for the nesting level `i`.
 * `i` must be betweeen zero and five inclusive.
 */
export function getHsectionCounter(ctx: Context, i: number): Counter {
  const state = getState(ctx);

  if (i === 0) {
    return state.counterH1;
  } else if (i === 1) {
    return state.counterH2;
  } else if (i === 2) {
    return state.counterH3;
  } else if (i === 3) {
    return state.counterH4;
  } else if (i === 4) {
    return state.counterH5;
  } else if (i === 5) {
    return state.counterH6;
  } else {
    throw new Error(
      "getHsectionCounter must be called with a number between zero and five inclusive",
    );
  }
}

export function Hsection(props: HsectionProps): Expression {
  const id = props.n;
  const { children, title, noNumbering } = props;

  let first = true;

  return (
    <lifecycle pre={pre} post={post}>
      <impure
        fun={(ctx) => {
          const config = getConfig(ctx);
          const state = getState(ctx);

          if (state.level >= 6) {
            l.error(
              ctx,
              `Cannot nest ${Colors.yellow(`<Hsection>`)} macros ${
                state.level + 1
              } or more times.`,
            );
            ctx.halt();
          }

          const counter = getHsectionCounter(ctx, state.level);
          if (!noNumbering) {
            counter.increment(ctx);
          }

          const numberingInfo = configNaming(config, state.level);
          const numbering = counter.getFullValue(ctx);

          if (shouldEmitLatex(ctx)) {
            let macroname = "section";
            for (let i = 1; i < state.level; i++) {
              macroname = `sub${macroname}`;
            }

            return <>
              <LatexMacro name={macroname}><exps x={title}/></LatexMacro>
              <LatexMacro name="label"><exps x={props.n}/></LatexMacro>
              {"\n\n"}<exps x={children}/>
            </>
          } else {
            const Hmacro = levelToHmacro(state.level);
  
            return (
              <>
                {Def({
                  ...props,
                  noPreview: true,
                  defClass: ["hsection"],
                  defData: { "hsection-level": `${state.level}` },
                  refClass: ["hsection"],
                  refData: { "hsection-level": `${state.level}` },
                  numbering: numberingInfo === null ? undefined : {
                    numbering: numbering,
                    info: numberingInfo,
                  },
                  defTag: (children, id) => Hmacro({ id, children }),
                  children: (
                    <>
                      {noNumbering ? "" : config.titleRenderPre!(ctx, numbering)}
                      <exps x={title}/>
                      {noNumbering ? "" : config.titleRenderPost!(ctx, numbering)}
                    </>
                  ),
                  r: title,
                })}
                <Section data={{ hsection: props.n }}>
                  <exps x={children} />
                </Section>
              </>
            );
          }
        }}
      />
    </lifecycle>
  );

  function pre(ctx: Context) {
    const state = getState(ctx);
    state.level += 1;

    if (first) {
      let structure = state.structure;
      for (let level = 0; level + 1 < state.finger.length; level++) {
        structure = structure.children[state.finger[level]];
      }

      structure.children.push(new_section_structure(id, props.shortTitle === undefined ? null : <exps x={props.shortTitle}/>, props.noToc === undefined ? false : props.noToc, state.level));
      structure.child_id_to_index.set(id, structure.children.length - 1);

      state.finger.push(0);
    }

    state.current_breadcrumbs.push(id);
  }

  function post(ctx: Context) {
    const state = getState(ctx);
    state.level -= 1;

    if (first) {
      state.finger.pop();
      state.finger[state.finger.length - 1] =
        state.finger[state.finger.length - 1] + 1;

      first = false;
    }

    state.current_breadcrumbs.pop();
  }
}

export function TableOfContents(
  { stopLevel, headerExprs }: { stopLevel: number, headerExprs?: Expressions },
): Expression {
  return (
    <impure
      fun={(ctx) => {
        if (!ctx.mustMakeProgress()) {
          return null;
        }

        const config = getConfig(ctx);

        const state = getState(ctx);
        let structure = state.structure;
        for (const crumb of state.current_breadcrumbs) {
          structure =
            structure.children[structure.child_id_to_index.get(crumb)!];
        }

        for (const dep of config.depsCssToc!) {
          previewScopeDependencyCss(ctx, dep, true);
        }

        for (const dep of config.depsJsToc!) {
          previewScopeDependencyJs(ctx, dep, true);
        }

        return (
          <Div clazz="toc onlyLeft">
          <exps x={headerExprs} />
          <Ol
            children={structure.children.map((child) => (
              <TocStructure
                structure={child}
                maxDepth={stopLevel}
              />
            ))}
          />
          </Div>
        );
      }}
    />
  );
}

function TocStructure(
  { structure, maxDepth }: {
    structure: SectionStructure;
    maxDepth: number;
  },
): Expression {
  const data = { hsection: structure.id, hlevel: `${structure.level}` };

  if (structure.noToc) {
    return "";
  }

  return (
    <Li data={data}>
      {structure.short_title === null ? <R n={structure.id} /> : <R n={structure.id}>{structure.short_title}</R>}
      {structure.level >= maxDepth ? "" : (
        <Ol
          children={structure.children.map((child) => (
            <TocStructure structure={child} maxDepth={maxDepth} />
          ))}
        />
      )}
    </Li>
  );
}
