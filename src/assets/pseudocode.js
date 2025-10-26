/*
Code folding and line highlighting.
*/

/*
Highlighting based on URL parameters.
*/

const styleEl = document.createElement("style");
document.head.appendChild(styleEl);
const styleSheet = styleEl.sheet;

const lineStyle = `{ background: rgba(255, 228, 0, 0.309); }`;

const urlParams = window.location.search;
const searchParams = new URLSearchParams(urlParams);

const defaulthlLinesString = searchParams.get("hlLines") ?? null;
const defaultN = searchParams.get("hlPseudocode") ?? "";

applyStyles(defaulthlLinesString, defaultN);

document.querySelector("body").addEventListener("mouseover", (evt) => {
  if (!(evt.target instanceof HTMLElement)) {
    return;
  }

  let refNode = evt.target;
  while (
    !(refNode.dataset.ref && refNode.dataset.tooltipAnchor &&
      refNode.dataset.pseudocode && refNode.dataset.hllines) &&
    refNode.parentElement
  ) {
    refNode = refNode.parentElement;
  }

  const pseudocode = refNode.dataset.pseudocode;
  if (pseudocode === undefined) {
    return;
  } else {
    removeAllStyles();
    applyStyles(refNode.dataset.hllines, pseudocode);

    evt.target.addEventListener("mouseleave", () => {
      removeAllStyles();
      applyStyles(defaulthlLinesString, defaultN);
    });
  }
});

function applyStyles(encoded, n) {
  if (encoded !== null) {
    /**
     * The encoding is simple: if there are many lines, separate them with `.` characters.
     * Encode an individual line as a decimal int, and a sequence as two decimal ints, separated by the `-` character.
     */
    const parts = encoded.split(".");
    for (const part of parts) {
      const rangeParts = part.split("-");

      if (rangeParts.length === 1) {
        doApply(parseInt(rangeParts[0]), n);
      } else {
        const start = parseInt(rangeParts[0]);
        const end = parseInt(rangeParts[1]);

        for (let i = start; i <= end; i++) {
          doApply(i, n);
        }
      }
    }
  }
}

function doApply(lineNum, n) {
  if (n !== null && n !== "") {
    const theId = lineId(n, lineNum);
    styleSheet.insertRule(`#${theId} ${lineStyle}`);
    styleSheet.insertRule(`#${theId}+* ${lineStyle}`);
  }
}

function lineId(n, line) {
  return `${n}L${line}`;
}

function removeAllStyles() {
  while (styleSheet.cssRules.length > 0) {
    styleSheet.deleteRule(0);
  }
}

/*
Code folding
*/

const pseudoBlocks = document.querySelectorAll("code.pseudocode");
pseudoBlocks.forEach((pseudoBlock) => {
  // Iterate through all rows (each row consists of two divs).
  for (let i = 0; i < pseudoBlock.children.length; i += 2) {
    const gutter = pseudoBlock.children[i];
    gutter.foldCount = 0; // Track how many containing blocks have folded over this.
    const line = pseudoBlock.children[i + 1];

    // To hide folding buttons, when not hovering over the gutter, we need to track when we *do* hover over the gutter.
    gutter.addEventListener("mouseover", () => {
      pseudoBlock.classList.toggle("hoveredGutter", true);
    });
    gutter.addEventListener("mouseout", () => {
      pseudoBlock.classList.toggle("hoveredGutter", false);
    });

    // Line should offer folding if the row below it is indented.
    // It folds over all subsequent lines with greater indentation
    const ourIndentation = gutter.dataset.i;
    const foldOver = [];
    let j = i + 2;
    while (
      j < pseudoBlock.children.length &&
      pseudoBlock.children[j].dataset.i > ourIndentation
    ) {
      foldOver.push([pseudoBlock.children[j], pseudoBlock.children[j + 1]]);
      j += 2;
    }

    // Only offer folding if we fold over at least one line.
    if (foldOver.length > 0) {
      let folded = false;

      const unfoldButton = document.createElement("div");
      unfoldButton.innerHTML = "⋯";
      unfoldButton.classList.add("unfoldButton");

      const fold = () => {
        folded = true;
        gutter.children[1].innerHTML = "▶";
        line.appendChild(unfoldButton);
        if (line.children.length === 2) {
          line.style.display = "inline-block";
        }

        gutter.classList.toggle("isFolded", folded);
        gutter.classList.toggle("isUnfolded", !folded);
        line.classList.toggle("isFolded", folded);
        line.classList.toggle("isUnfolded", !folded);

        for (const [innerGutter, innerLoc] of foldOver) {
          innerGutter.foldCount += 1;
          innerGutter.style.display = "none";
          innerLoc.style.display = "none";
        }
      };

      const unfold = () => {
        gutter.children[1].innerHTML = "▼";
        folded = false;
        try {
          line.removeChild(unfoldButton);
        } catch (_err) {
          // ignore
        }

        gutter.classList.toggle("isFolded", folded);
        gutter.classList.toggle("isUnfolded", !folded);
        line.classList.toggle("isFolded", folded);
        line.classList.toggle("isUnfolded", !folded);

        for (const [innerGutter, innerLoc] of foldOver) {
          innerGutter.foldCount -= 1;
          if (innerGutter.foldCount === 0) {
            innerGutter.style.display = "inline-block";
            innerLoc.style.display = "inline-block";
          }
        }
      };

      unfold();

      gutter.children[1].classList.add("doesFold");

      gutter.children[1].addEventListener("click", () => {
        if (folded) {
          unfold();
        } else {
          fold();
        }
      });

      unfoldButton.addEventListener("click", () => {
        unfold();
      });
    }
  }
});
