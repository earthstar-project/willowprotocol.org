import {
  Def,
  dependencyCss,
  dependencyJs,
  Div,
  Marginale,
  PreviewScope,
  PreviewScopePushWrapper,
  R,
  ResolveAsset,
  Span,
} from "../mod.tsx";
import { Config } from "./deps.ts";
import { createConfigOptions } from "./deps.ts";
import {
  Context,
  createLogger,
  createSubstate,
  Expression,
  Expressions,
} from "./deps.ts";

// const l = createLogger("LoggerWip");
// const ConfigMacro = l.ConfigMacro;
// export { ConfigMacro as LoggerWip };

export type EmitLatexConfig = {
  /**
   * Whether to hide WIP annotations (and not warn when there are any).
   */
  emitLatex?: boolean;
};

const [
  getConfig,
  ConfigEmitLatex,
] = createConfigOptions<EmitLatexConfig, EmitLatexConfig>(
  "ConfigEmitLatex",
  () => ({
    emitLatex: false,
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.emitLatex !== undefined) {
      newValue.emitLatex = update.emitLatex;
    }

    return newValue;
  },
);
export { ConfigEmitLatex };

/**
 * Should macros capable of Latex output produce Latex?
 */
export function shouldEmitLatex(ctx: Context): boolean {
  const config = getConfig(ctx);
  return !!config.emitLatex;
}

export type LatexMacroProps = {
  name: Expressions;
  options?: Expression[];
  children?: Expressions;
  multiargs?: Expression[];
};

export function LatexMacro({name, multiargs, options = [], children}: LatexMacroProps): Expression {
  if (multiargs === undefined) {
    multiargs = [<exps x={children}/>];
  }

  const args: Expression[] = [];
  for (const exp of multiargs) {
    args.push("{");
    args.push(exp);
    args.push("}");
  }

  const opts: Expression[] = [];
  for (let i = 0; i < opts.length; i++) {
    opts.push(opts[i]);
    if (i + 1 < opts.length) {
      opts.push(",");
    }
  }

  return <>\<exps x={name}/>{opts.length === 0 ? "" : <>[<exps x={opts}/>]</>}<exps x={args}/></>;
}

export type LatexBeginEndProps = {
  name: Expressions;
  children?: Expressions;
};

export function LatexBeginEnd({name, children}: LatexBeginEndProps): Expression {
  return <>
    <LatexMacro name="begin"><exps x={name}/></LatexMacro>
    <exps x={children}/>
    <LatexMacro name="end"><exps x={name}/></LatexMacro>
  </>;
}