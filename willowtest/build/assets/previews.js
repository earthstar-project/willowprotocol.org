import { register_tooltip_handler } from "./tooltips.js";

register_tooltip_handler({
  selector: find_preview_url,
  start_delay: 400,
  preprocess_data: url => {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw response;
        } else {
          return response.text();
        }
      });
  },
  render: (text, evt) => {
    const content_node = document.createElement("div");
    content_node.classList.add("preview_content");
    content_node.innerHTML = text;

    const preview_node = document.createElement("div");
    preview_node.classList.add("preview");
    preview_node.classList.add(`preview${evt.target.dataset.width}`);

    preview_node.appendChild(content_node);
    return preview_node;
  },
  render_err: (err, evt) => {
    const content_node = document.createElement("div");
    content_node.classList.add("preview_content");
    content_node.innerHTML = "Could not load preview. You can still click the reference to jump to its target.";

    const preview_node = document.createElement("div");
    preview_node.classList.add("preview");
    preview_node.classList.add(`preview${evt.target.dataset.width}`);

    preview_node.appendChild(content_node);
    return preview_node;
  },
});

function find_preview_url(elem) {
  if (elem.dataset && elem.dataset.preview) {
    return elem.dataset.preview;
  }

  if (elem.parentNode) {
    return find_preview_url(elem.parentNode);
  }

  return undefined;
}
