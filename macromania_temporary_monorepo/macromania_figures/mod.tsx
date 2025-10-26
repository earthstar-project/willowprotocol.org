import {
  Context,
  createConfigOptions,
  createLogger,
  Figcaption,
  NumberingProps,
  P,
  TagProps,
} from "./deps.ts";
import {
  Counter,
  Def,
  Expression,
  Expressions,
  Figure as HtmlFigure,
  makeNumberingRenderer,
} from "./deps.ts";
import { NumberingInfo } from "./deps.ts";
import { Colors } from "./deps.ts";
import { DefProps } from "./deps.ts";
import { PreviewScope } from "../macromania_previews/mod.tsx";
import { Rc } from "./deps.ts";

const l = createLogger("LoggerFigures");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerFigures };

export type MakeFigureMacroOptions = {
  /**
   * The counter to use for these for figures.
   */
  figureCounter: Counter;
  /**
   * Are these figures numbered blocks (think LaTeX theorem-style) (true), or proper figures (false) with the title below the figure content.
   */
  isTheoremLike?: boolean;
  /**
   * Numbering information for the `<Rc/>` and `<Rcb/>` macros.
   */
  numberingInfo: NumberingInfo;
  /**
   * HTML classes to apply to the `<figure>` tag of each figure.
   */
  defClass?: Expression[] | Expression;
  /**
   * HTML classes to apply to the `<a>` tag of all refs to these figures.
   */
  refClass?: Expression[] | Expression;
  /**
   * HTML data attributes to apply to the `<figure>` tag of each figure.
   */
  defData?: Record<string, Expression>;
  /**
   * HTML data attributes to apply to the `<a>` tag of all refs to these figures.
   */
  refData?: Record<string, Expression>;
};

export type FigProps = {
  /**
   * The id of the figure.
   */
  n: string;
  /**
   * An optional title for the figure.
   */
  title?: Expressions;
  /**
   * An optional caption for the figure.
   */
  caption?: Expression;
  /**
   * Props for the html `Figure` macro that encloses the figure.
   */
  wrapperTagProps?: TagProps;
  /**
   * Should previews of this figure be wide?
   */
  wide?: boolean;
  /**
   * The main contents of the figure.
   */
  children?: Expressions;
};

export function makeFigureMacro(
  ctx: Context,
  {
    figureCounter,
    isTheoremLike = false,
    numberingInfo,
    defClass,
    refClass,
    defData,
    refData,
  }: MakeFigureMacroOptions,
): (props: FigProps) => Expression {
  return (props: FigProps) => {
    const { children, title, caption, n, wrapperTagProps } = props;
    return (
      <impure
        fun={(ctx) => {
            const counter = figureCounter;
            counter.increment(ctx);

            return (
              <PreviewScope>
                {Def({
                  ...props,
                  defTag: (inner: Expression, id: Expression) => {
                    const figureProps: TagProps & { children?: Expressions } =
                      wrapperTagProps ? wrapperTagProps : {};
                    figureProps.id = id;
                    figureProps.children = inner;
                    if (isTheoremLike) {
                      if (figureProps.clazz === undefined) {
                        figureProps.clazz = "theoremlike";
                      } else if (Array.isArray(figureProps.clazz)) {
                        figureProps.clazz.push("theoremlike");
                      } else {
                        figureProps.clazz = <><exps x={figureProps.clazz}/> theoremlike</>
                      }
                    }
                    return HtmlFigure(figureProps);
                  },
                  noLink: true,
                  noHighlight: true,
                  defClass: ["figure"],
                  refClass: ["figure"],
                  numbering: {
                    numbering: counter.getFullValue(ctx),
                    info: numberingInfo,
                  },
                  children: (
                    <>
                      <exps x={children} />
                      <Figcaption>
                        <P>
                          <Rc n={n} />
                          {title
                            ? (
                              <>
                                : <exps x={title} />
                              </>
                            )
                            : ""}
                        </P>
                        <exps x={caption} />
                      </Figcaption>
                    </>
                  ),
                })}
              </PreviewScope>
            );
        }}
      />
    );
  };
}

// export type FiguresConfig = {
//   /**
//    * The counter for figures.
//    */
//   figureCounter?: Counter;
//   /**
//    * How to render DefRef numbered references to figures.
//    */
//   numberingInfo?: NumberingInfo;
// };

// const [
//   getConfig,
//   ConfigFigures,
// ] = createConfigOptions<FiguresConfig, FiguresConfig>(
//   "ConfigFigures",
//   () => ({
//     figureCounter: undefined,
//     numberingInfo: {
//       r: "Figure",
//       rb: "Figure",
//       rs: "Figure",
//       rsb: "Figure",
//       render: makeNumberingRenderer(),
//     },
//   }),
//   (oldValue, update) => {
//     const newValue = { ...oldValue };
//     if (update.figureCounter !== undefined) {
//       newValue.figureCounter = update.figureCounter;
//     }
//     if (update.numberingInfo !== undefined) {
//       newValue.numberingInfo = update.numberingInfo;
//     }

//     return newValue;
//   },
// );
// export { ConfigFigures };

// export type FigureProps = {
//   /**
//    * An optional title for the figure.
//    */
//   title?: Expressions;
//   /**
//    * An optional caption for the figure.
//    */
//   caption?: Expression;
//   /**
//    * Props for the html `Figure` macro that encloses the figure.
//    */
//   wrapperTagProps?: TagProps;
// };

// /**
//  * A figure. The children to this macro become the figure's content.
//  */
// export function Fig(
//   props: FigureProps & DefProps & {
//     children?: Expressions;
//   },
// ) {
//   const { children, title, caption, n, wrapperTagProps } = props;
//   return (
//     <impure
//       fun={(ctx) => {
//         const config = getConfig(ctx);

//         if (config.figureCounter === undefined) {
//           l.error(
//             ctx,
//             `Must set a figure counter via the ${
//               Colors.yellow(`<Config/>`)
//             } macro before using the ${`<Figure>`} macro.`,
//           );
//           l.logGroup(ctx, () => {
//             l.error(
//               ctx,
//               `More specifically, in the ${
//                 Colors.yellow(`options`)
//               } prop of the ${Colors.yellow(`<Config/>`)}, use the ${
//                 Colors.yellow(`<ConfigFigures figureCounter={someCounter}/>`)
//               }.`,
//             );
//           });
//           return ctx.halt();
//         } else {
//           const counter = config.figureCounter;
//           counter.increment(ctx);

//           return (
//             <PreviewScope>
//               {Def({
//                 ...props,
//                 defTag: (inner: Expression, id: Expression) => {
//                   const figureProps: TagProps & { children?: Expressions } =
//                     wrapperTagProps ? wrapperTagProps : {};
//                   figureProps.id = id;
//                   figureProps.children = inner;
//                   return HtmlFigure(figureProps);
//                 },
//                 noLink: true,
//                 defClass: ["figure"],
//                 refClass: ["figure"],
//                 numbering: {
//                   numbering: counter.getFullValue(ctx),
//                   info: config.numberingInfo!,
//                 },
//                 children: (
//                   <>
//                     <exps x={children} />
//                     <Figcaption>
//                       <P>
//                         <Rc n={n} />
//                         {title
//                           ? (
//                             <>
//                               : <exps x={title} />
//                             </>
//                           )
//                           : ""}
//                       </P>
//                       <exps x={caption} />
//                     </Figcaption>
//                   </>
//                 ),
//               })}
//             </PreviewScope>
//           );
//         }
//       }}
//     />
//   );
// }
