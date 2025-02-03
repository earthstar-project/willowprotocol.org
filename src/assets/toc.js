const sections = document.querySelectorAll("section[data-hsection]");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const tocEntry = document.querySelector(
      `li[data-hsection=${entry.target.dataset.hsection}]`,
    );
    tocEntry.classList.toggle("tocVisible", entry.isIntersecting);
  });
}, { margin: "40px 0 40px 0" });

sections.forEach((section, i) => {
  if (i > 0) {
    observer.observe(section);
  }
});
