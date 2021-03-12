# arc-marked

A port of Polymer's marked-element to LitElement with additional big fixes.

[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/arc-marked.svg)](https://www.npmjs.com/package/@advanced-rest-client/arc-marked)

[![Tests and publishing](https://github.com/advanced-rest-client/arc-marked/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/arc-marked/actions/workflows/deployment.yml)

```html
<arc-marked>
  <div slot="markdown-html"></div>
  <script type="text/markdown">
    ## Markdown Renderer

     <div>This is a HTML container</div>

    Example:

    ```html
    <paper-toolbar>
     <paper-icon-button icon="menu"></paper-icon-button>
     <div class="title">Title</div>
     <paper-icon-button icon="more"></paper-icon-button>
    </paper-toolbar>
    ```

    _Nifty_ features.
 </script>
</arc-marked>
```

## Usage

### Installation

```sh
npm install --save @advanced-rest-client/arc-marked
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/arc-marked/arc-marked.js';
    </script>
  </head>
  <body>
    <arc-marked markdown="..."></arc-marked>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/arc-marked/arc-marked.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <arc-marked .markdown="${this.markdown}"></arc-marked>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/arc-marked
cd arc-marked
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
