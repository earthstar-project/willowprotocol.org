import {
  computePosition,
  flip,
  shift,
  offset,
  inline,
  autoUpdate,
} from "./floating-ui.dom.min.js";

let body = document.querySelector("body");

let root_tooltip = null;

const registry = [];

/*
{
  selector, // synchronous function: given a DOM node, return the data to pass to the lifecycle functions, or `undefined` to indicate that this handler does not apply to this DOM node
  start_delay, // milliseconds to wait until the tooltip begins rendering
  preprocess_data, // asynchronous, fallible function that converts the output of the `selector` into the input of the `render` function or the `render_err` function
  render, // synchronous function: given the successful output of preprocess_data, the mouseover event, and a callback for immediately removing the tooltip, return a DOM node to display
  render_err, // synchronous function: given the erroneous output of preprocess_data, the mouseover event, and a callback for immediately removing the tooltip, return a DOM node to display
}
*/
export function register_tooltip_handler(handler) {
  registry.push(handler)
}

body.addEventListener("mouseover", (evt) => {
  for (const {
    selector,
    start_delay,
    preprocess_data,
    render,
    render_err,
  } of registry) {
    const data = selector(evt.target);
    if (data != undefined) {
      let do_not_display = false;
      const cancel_listener = () => {
        do_not_display = true;
      };
      evt.target.addEventListener("mouseleave", cancel_listener);

      Promise.all([
        wait(start_delay ? start_delay : 400),
        preprocess_data
          ? preprocess_data(data)
            .then(yay => {return {"ok": yay}})
            .catch(nay => {return {"err": nay}})
          : Promise.resolve({ok: data}),
      ])
      .then(([_, result]) => {
        if (!do_not_display) {
          evt.target.removeEventListener("mouseleave", cancel_listener);

          clean_stack();

          const tooltip = {
            clientX: evt.clientX,
            clientY: evt.clientY,
            ref: evt.target,
            hovered: true,
          };

          const parent = leaf_tooltip();
          if (parent) {
            parent.child = tooltip;
            tooltip.parent = parent;
          } else {
            root_tooltip = tooltip;
            tooltip.parent = null;
          }

          tooltip.ref_onmouseenter = tooltip.ref.addEventListener("mouseenter", () => {
            tooltip.hovered = true;
          });
          tooltip.ref_onmouseleave = tooltip.ref.addEventListener("mouseleave", () => {
            tooltip.hovered = false;
            schedule_tooltip_removal(tooltip);
          });

          const remove_tooltip = () => {
            tooltip.hovered = false; // so that `clean_stack` removes it
            clean_stack();
          }

          const tooltip_node = result.ok ? render(result.ok, evt, remove_tooltip) : render_err(result.err, evt, remove_tooltip);
          tooltip_node.classList.add("tooltip");

          tooltip_node.addEventListener('mouseenter', () => {
            tooltip.hovered = true;
          });
          tooltip_node.addEventListener("mouseleave", () => {
            tooltip.hovered = false;
            schedule_tooltip_removal(tooltip);
          });

          tooltip.node = tooltip_node;
          position_tooltip(tooltip);

          body.appendChild(tooltip_node);
        }
      });

      return;
    }
  }
});

function leaf_tooltip() {
  function lf(current) {
    if (current.child) {
      return lf(current.child);
    } else {
      return current;
    }
  }

  if (root_tooltip) {
    return lf(root_tooltip);
  } else {
    return null;
  }
}

function clean_stack() {
  let tooltip = leaf_tooltip();

  while (tooltip != null && !tooltip.hovered) {
    if (tooltip.node) {
      tooltip.ref.removeEventListener("mouseenter", tooltip.ref_onmouseenter);
      tooltip.ref.removeEventListener("mouseleave", tooltip.ref_onmouseleave);
      const node = tooltip.node;
      node.classList.add("tooltipfadeout");
      node.style["pointer-events"] = "none";
      setTimeout(() => {
        node.remove();
      }, 200);
    }

    if (tooltip.parent) {
      tooltip.parent.child = null;
      tooltip = tooltip.parent;
    } else {
      root_tooltip = null;
      return;
    }
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function schedule_tooltip_removal(tooltip) {
  wait(300)
  .then(() => {
    clean_stack();
  });
}

function position_tooltip({clientX, clientY, ref: target, node: tooltip}) {
  computePosition(target, tooltip, {
    placement: 'top',
    middleware: [
      offset(6),
      flip(),
      inline({x: clientX, y: clientY}),
      shift({padding: 5}),
    ],
  }).then(({x, y}) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
}
