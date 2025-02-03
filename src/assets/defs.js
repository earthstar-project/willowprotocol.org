const styleEl = document.createElement("style");
document.head.appendChild(styleEl);
const styleSheet = styleEl.sheet;

const refStyle = `{ background: rgba(255, 228, 0, 0.1) }`;
const defStyle = `{ background: rgba(255, 228, 0, 0.309); }`;

const urlParams = window.location.search;
const searchParams = new URLSearchParams(urlParams);

const defaultName = searchParams.get("def") ?? null;

applyStyles(defaultName);

document.querySelector("body").addEventListener("mouseover", (evt) => {
  if (!(evt.target instanceof HTMLElement)) {
    return;
  }

  let refNode = evt.target;
  while (
    !(refNode.dataset.ref && refNode.dataset.previewAnchor &&
      refNode.dataset.hl) &&
    refNode.parentElement
  ) {
    refNode = refNode.parentElement;
  }

  const name = refNode.dataset.ref;
  if (name === undefined) {
    return;
  }

  if (name !== null) {
    removeAllStyles();
    applyStyles(name);

    evt.target.addEventListener("mouseleave", () => {
      removeAllStyles();
      applyStyles(defaultName);
    });
  }
});

function applyStyles(name) {
  if (name !== null) {
    styleSheet.insertRule(`[data-ref=${name}][data-hl] ${refStyle}`);
    styleSheet.insertRule(`#${name} > [data-ref=${name}][data-hl] ${defStyle}`);
  }
}

function removeAllStyles() {
  while (styleSheet.cssRules.length > 0) {
    styleSheet.deleteRule(0);
  }
}
