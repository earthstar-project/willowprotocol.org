// Adapted from https://dakotaleemartinez.com/tutorials/how-to-add-active-highlight-to-table-of-contents/
window.addEventListener("load", () => {
    const tocLinks = document.querySelectorAll(".toc_heading");
    const headers = Array.from(tocLinks).map(entry => document.querySelector(`#${entry.dataset.hsection}`));

    let activeHeader = headers[-1];

    let ticking = false;

    find_active();

    window.addEventListener("scroll", find_active);

    function find_active() {
        if (!ticking) {
            requestAnimationFrame(() => {
                let activeIndex = headers.findIndex((header) => {
                    return header.getBoundingClientRect().top > 180;
                });

                console.log(activeIndex);

                if (activeIndex == -1) {
                    activeIndex = headers.length - 1;
                } else if(activeIndex > 0) {
                    activeIndex--;
                }

                const active = headers[activeIndex];
                if(active !== activeHeader) {
                    activeHeader = active;
                    tocLinks.forEach(link => link.classList.remove('tocActive'));
                    tocLinks[activeIndex].classList.add('tocActive');
                }

                ticking = false;
            });

            ticking = true;
        }
    }
});