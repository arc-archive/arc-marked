import { marked, Renderer } from 'marked';

const compatibleMarked = (source, options) => marked.parse(source, options);
compatibleMarked.Renderer = Renderer;

/* istanbul ignore if */
if (!window.marked) {
  // For webpack support for the Polymer 3 version created by the Polymer
  // Modulizer More info:
  // https://github.com/PolymerElements/marked-element/issues/81
  window.marked = compatibleMarked;
}

export {};
