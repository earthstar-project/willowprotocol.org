import { createSubstate } from "./deps.ts";
import { Expression, Expressions, Span } from "./deps.ts";

/**
 * Defines the widths and paddings for the layout.
 *
 * All distances are measured in `rem`.
 */
export type LayoutOptions = {
  // padding-top for the body
  paddingTop?: number;
  // padding-bottom for the body
  paddingBottom?: number;
  // padding-right for the body
  paddingRight?: number;
  // padding-left for the body
  paddingLeft?: number;

  // spacing between marginalia and the main contents
  spacingMarginalia?: number;
  // maximum width for the main contents
  maxWidthMain?: number;
  // maximum width for the marginalia
  maxWidthMarginalia?: number;
  // spacing between left and the main contents
  spacingLeft?: number;

  // width of the left
  left?: number;
};

export type LayoutOptionsFull = {
  // padding-top for the body
  paddingTop: number;
  // padding-bottom for the body
  paddingBottom: number;
  // padding-right for the body
  paddingRight: number;
  // padding-left for the body
  paddingLeft: number;

  // spacing between marginalia and the main contents
  spacingMarginalia: number;
  // maximum width for the main contents
  maxWidthMain: number;
  // maximum width for the marginalia
  maxWidthMarginalia: number;

  // spacing between left and the main contents
  spacingLeft: number;
  // width of the left
  left: number;
};

function optsWithDefaults(opts: LayoutOptions): LayoutOptionsFull {
  const ret = { ...opts };

  ret.paddingTop = opts.paddingTop ?? 0;
  ret.paddingBottom = opts.paddingBottom ?? 3;
  ret.paddingLeft = opts.paddingLeft ?? 0.5;
  ret.paddingRight = opts.paddingRight ?? 0.5;

  ret.spacingMarginalia = opts.spacingMarginalia ?? 1;
  ret.maxWidthMain = opts.maxWidthMain ?? 32;
  ret.maxWidthMarginalia = opts.maxWidthMarginalia ?? 12;

  ret.spacingLeft = opts.spacingLeft ?? 1;
  ret.left = opts.left ?? 10;

  return ret as LayoutOptionsFull;
}

// width of main content and the marginalia together
function wide(opts: LayoutOptionsFull): number {
  return opts.maxWidthMain + opts.spacingMarginalia +
    opts.maxWidthMarginalia;
}

// width of main content, the marginalia, and their left and right margins
// if the screen is less wide than this, the marginalia disappear
function wide_and_margins(opts: LayoutOptionsFull): number {
  return wide(opts) + opts.paddingLeft + opts.paddingRight;
}

function wide_and_margins_and_left(opts: LayoutOptionsFull): number {
  return wide_and_margins(opts) + opts.left + opts.spacingLeft;
}

export function LayoutMarginalia(
  { opts }: { opts: LayoutOptions },
): Expression {
  const opts_ = optsWithDefaults(opts);
  return `


  
/*
body {
    overflow-x: hidden;
}

body {
    padding-left: ${opts_.paddingLeft}rem;
    padding-right: ${opts_.paddingRight}rem;
    padding-bottom: ${opts_.paddingBottom}rem;
    padding-top: ${opts_.paddingTop}rem;
    max-width: ${wide(opts_)}rem;
    position: relative;
    margin: auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

body.isPreview {
  padding-bottom: 0rem;
  padding-top: 0rem;
}

body > * {
    max-width: ${opts_.maxWidthMain}rem;
}

.wide {
    width: 100%; 
}

@media (min-width: ${wide_and_margins(opts_)}rem) {
    .wide {
        position: relative;
        width: ${wide(opts_)}rem;
        max-width: calc(100vw - ${opts_.paddingLeft}rem - 2 * ${opts_.paddingRight}rem);
        clear: right;
    }
  
    .wideIfPossible {
        position: relative;
        width: ${wide(opts_)}rem;
        max-width: calc(100vw - ${opts_.paddingLeft}rem - 2 * ${opts_.paddingRight}rem);
        clear: right;
    }
}

.widefixed {
    position: relative;
    width: ${wide(opts_)}rem;
    clear: right;
}

.verywide {
    position: relative;
    min-width: calc(100vw - calc(${
    opts_.paddingLeft + opts_.paddingRight
  }rem + 0.5 * calc(100vw - ${wide(opts_)}rem)));
    max-width: calc(100vw - ${opts_.paddingLeft}rem - 2 * ${opts_.paddingRight}rem);
    clear: right;
}

.verywidefixed {
    position: relative;
    min-width: calc(100vw - calc(${
    opts_.paddingLeft + opts_.paddingRight
  }rem + 0.5 * calc(100vw - ${wide(opts_)}rem)));
    clear: right;
}

.onlyMargin {
  display: none;
}

.hideIfNoMargin {
  display: none;
}

.onlyLeft {
  display: none;
}

.hideIfNoLeft {
  display: none;
}

@media (max-width: ${wide_and_margins(opts_)}rem) {
  body > * {
    margin: auto;
  } 
}

@media (min-width: ${wide_and_margins(opts_)}rem) {
  .hideIfNoMargin {
    display: initial;
  }

    .onlyMargin {
        display: initial;
        float: right;
        clear: right;
        position: relative;
        width: ${opts_.maxWidthMarginalia}rem;
        margin-right: ${-(opts_.spacingMarginalia +
    opts_.maxWidthMarginalia)}rem;
    }
}

@media (min-width: ${wide_and_margins_and_left(opts_)}rem) {
  .onlyLeft, .hideIfNoLeft {
    display: initial;
    width: ${opts_.left}rem;
    transform: translateX(-${2 * (opts_.left + opts_.paddingLeft)}rem);
  }
}

.previewContainer {
  max-width: ${opts_.maxWidthMain + opts_.paddingLeft + opts_.paddingRight}rem;
}
*/
`;
}

/**
 * Elements to be placed in the right margin.
 */
export function Marginale({ children }: { children?: Expressions }) {
  return Span({ children, clazz: "marginale" });
}

type SidenoteState = {
  count: number;
};

const [getSidenoteState, setSidenoteState] = createSubstate<SidenoteState>(
  () => ({ count: 0 })
);

/**
 * Elements to be placed in the right margin, with a number in the text indicating the sidenote.
 *
 * @param note - The elements to place in the margin.
 * @param children - The elements to which to anchor the note.
 */
export function Sidenote(
  { children, note }: { children?: Expressions; note: Expressions },
) {
  return Sidenotes({ children, notes: [note] });
}

/**
 * Several sidenotes, all anchored to the same element.
 *
 * @param note - The elements to place in the margin.
 * @param children - The elements to which to anchor the note.
 */
export function Sidenotes(
  { children, notes }: { children?: Expressions; notes: Expressions[] },
) {
  return <impure fun={(ctx) => {
    const state = getSidenoteState(ctx);

    const counters: Expression[] = [];
    const theNotes: Expression[] = [];

    for (let i = 0; i < notes.length; i++) {
      const num = state.count;
      state.count += 1;;
  
      counters.push(`${num}`);
      theNotes.push(
        <Span clazz="marginale">
          <Span clazz="sidenoteCounter">{`${num}`}</Span>
          <exps x={notes[i]}/>
        </Span>
      );
  
      if (i + 1 < notes.length) {
        counters.push(",");
      }
    }

    return <>
      <Span clazz="nowrap">
        <exps x={children}/>
        <Span clazz="sidenoteCounter"><exps x={counters}/></Span>
      </Span>
      <exps x={theNotes}/>
    </>
  }}/>
  
}
