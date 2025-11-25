import { Expression } from "macromania";

/**
The layouts (multiple instances of "free space" in the same layout have equal width),
from least available horizontal space to most.

L1: | paddingLeft | "as much main content as possible" | paddingRight |

L2: | paddingLeft | "free space" | maxMain | "free space" | paddingRight |

L3: | paddingLeft | "free space" | maxMain | paddingMarginalia | marginalia | "free space" | paddingRight |

L4: | paddingLeft | "free space" | toc | paddingToc | maxMain | paddingMarginalia | marginalia | "free space" | paddingRight |


All variables are given in rem (1 rem = htmlFontSizenPx px).
*/
export type LayoutProps = {
  htmlFontSizeInPx: number;
  paddingLeft: number;
  paddingRight: number;
  maxMain: number;
  paddingMarginalia: number;
  marginalia: number;
  paddingToc: number;
  toc: number;
  /**
   * Color the backgrounds to aid in debugging/development.
   */
  dev?: boolean;
};

export function LayoutStyles(
  {
    htmlFontSizeInPx,
    paddingLeft,
    paddingRight,
    maxMain,
    paddingMarginalia,
    marginalia,
    paddingToc,
    toc,
    dev,
  }: LayoutProps,
): Expression {
  // "content" refers to main and the marginalia.

  /*
    Wrapper html structure:

    <body>
        <Div class="wrapContent">
            Content HTML
        </Div>
    </body>
    */

  const SCROLLBAR = 17;

  return `
/* Automatically generated from src/layoutStyles.tsx */

/* Start implementing L1 */

body {
    ${dev ? "background-color: rgb(141, 141, 247) !important;" : ""}
}

body.isTooltip {
    margin-top: 1rem;
    padding-bottom: 1rem;
}

body:not(.isTooltip) {
    padding-left: ${paddingLeft}rem;
    padding-right: ${paddingRight}rem;
    padding-top: 4rem;
    padding-bottom: 2rem;
}

.toc {
    ${dev ? "background-color: darkseagreen !important;" : ""}
    display: none;
}

.marginale, .sidenoteCounter {
    ${dev ? "background-color: rgb(247, 141, 141) !important;" : ""}
    display: none;
}

.marginale.inlineable, .sidenoteCounter.inlineable {
  display: block;
}

.only-wide {
  display: none;
}

/* Start implementing L2 */

@media (min-width:${
    htmlFontSizeInPx * (paddingLeft + paddingRight + maxMain) + SCROLLBAR
  }px) {
    #wrapContent {
        ${dev ? "background-color: bisque !important;" : ""}
        width: ${maxMain}rem;
        margin: 0 auto;
    }
}

/* Start implementing L3 */

@media (min-width:${
    htmlFontSizeInPx *
      (paddingLeft + paddingRight + maxMain + paddingMarginalia + marginalia) +
    SCROLLBAR
  }px) {
    #wrapContent {
        width: ${maxMain + paddingMarginalia + marginalia}rem;

        >*:not(section, main), section>*:not(section, main, #sim-data-model)  {
            max-width: ${maxMain}rem;
        }

        .wide {
          max-width: ${maxMain + paddingMarginalia + marginalia}rem;
          clear: right;
        }
        
        .verywide {
            position: relative;
            min-width: calc(100vw - calc(${
    paddingLeft + paddingRight
  }rem + 0.5 * calc(100vw - ${maxMain}rem)));
            max-width: calc(100vw - ${paddingLeft}rem - 2 * ${paddingRight}rem);
            clear: right;
        }
        
        > ul, section > ul {
          max-width: calc(${maxMain}rem - 1.25em);
        }
    }

    .marginale {
      display: initial;
      float: right;
      clear: right;
      position: relative;
      width: ${marginalia}rem;
      margin-right: ${-(paddingMarginalia + marginalia)}rem;
    }

    .sidenoteCounter {
        display: initial;
    }
    
    .only-wide {
      display: block;
    }
    
    .only-narrow {
      display: none;
    }
}

/* Start implementing L4 */

@media (min-width:${
    htmlFontSizeInPx *
      (paddingLeft + paddingRight + maxMain + paddingMarginalia + marginalia +
        2 * (paddingToc + toc)) + SCROLLBAR
  }px) {
    .toc {
        display: initial;
        width: ${toc}rem;
        position: fixed;
        top: 6.5rem;
        transform: translateX(-${paddingToc + toc}rem);
        padding-left: 0;
    }
}

/* Other styling */

.tooltipContainer {
  max-width: min(${paddingLeft + paddingRight + maxMain}rem, 100vw);
}

@media (min-width:${
    htmlFontSizeInPx *
      (paddingLeft + paddingRight + maxMain + paddingMarginalia + marginalia) +
    SCROLLBAR
  }px) {
  .tooltipContainer.wide {
    max-width: min(calc(${
    paddingLeft + paddingRight + maxMain + paddingMarginalia + marginalia
  }rem + 18px), 100vw);
  }
}

`;
}
