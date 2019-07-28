import { nextFrame, fixture, expect, assert } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../arc-marked.js';

describe('<arc-marked>', () => {
  async function basicFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown">
        # Test
        </script>
      </arc-marked>`);
  }

  async function propertyMardownFixture() {
    return await fixture(`<arc-marked markdown="# Test">
        <div id="output" slot="markdown-html"></div>
      </arc-marked>`);
  }

  async function noContentFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown">

        </script>
      </arc-marked>`);
  }

  async function smartyPantsFixture() {
    return await fixture(`<arc-marked smartypants>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown">
        # foo
        ...
        </script>
      </arc-marked>`);
  }

  async function camelCaseHTMLFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown">
\`\`\`html
<div camelCase></div>
\`\`\`
        </script>
      </arc-marked>`);
  }

  async function badHTMLFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown">
\`\`\`html
<p><div></p></div>
\`\`\`
        </script>
      </arc-marked>`);
  }

  async function camelCaseHTMLWithoutChildFixture() {
    return await fixture(`<arc-marked>
        <script type="text/markdown">
\`\`\`html
<div camelCase></div>
\`\`\`
        </script>
      </arc-marked>`);
  }

  async function badHTMLWithoutChildFixture() {
    return await fixture(`<arc-marked>
        <script type="text/markdown">
\`\`\`html
<p><div></p></div>
\`\`\`
        </script>
      </arc-marked>`);
  }

  async function rendererFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown">
          [Link](http://url.com)
        </script>
      </arc-marked>`);
  }

  async function sanitizerFixture() {
    return await fixture(`<arc-marked sanitize>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown">
[Link](http://url.com" onclick="alert(1)")
<a href="http://url.com" onclick="alert(1)">Link</a>
\`\`\`html
<a href="http://url.com" onclick="alert(1)">Link</a>
\`\`\`
        </script>
      </arc-marked>`);
  }

  async function remoteContentFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown" src="base/test/test.md">
          # Loading
          Please wait...
        </script>
      </arc-marked>`);
  }

  async function badRemoteContentFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown" src="base/test/test3.md"></script>
      </arc-marked>`);
  }

  async function sanitizedRemoteContentFixture() {
    return await fixture(`<arc-marked>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown" src="base/test/remoteSanitization.md"></script>
      </arc-marked>`);
  }

  async function unsanitizedRemoteContentFixture() {
    return await fixture(`<arc-marked disableremotesanitization>
        <div id="output" slot="markdown-html"></div>
        <script type="text/markdown" src="base/test/remoteSanitization.md"></script>
      </arc-marked>`);
  }

  // Thanks IE10.
  function isHidden(element) {
    const rect = element.getBoundingClientRect();
    return rect.width === 0 && rect.height === 0;
  }
  // Replace reserved HTML characters with their character entity equivalents to
  // match the transform done by Markdown.
  //
  // The Marked library itself is not used because it wraps code blocks in
  // `<code><pre>`, which is superfluous for testing purposes.
  function escapeHTML(string) {
    const span = document.createElement('span');
    span.textContent = string;
    return span.innerHTML;
  }

  describe('Propery setters', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    [
      ['markdown', 'test'],
      ['breaks', true],
      ['pedantic', true],
      ['renderer', function() {}],
      ['sanitize', true],
      ['sanitizer', function() {}],
      ['smartypants', true]
    ].forEach((item) => {
      it(`Sets ${item[0]} property`, () => {
        const key = item[0];
        const value = item[1];
        element[key] = value;
        assert.equal(element[key], value, 'Getter has the value');
        assert.equal(element[`_${key}`], value, 'Sets the property');
      });

      it(`Setting ${item[0]} property triggers renderMarkdown()`, () => {
        const key = item[0];
        const value = item[1];
        const spy = sinon.spy(element, 'renderMarkdown');
        element[key] = value;
        assert.isTrue(spy.called);
      });

      it(`Setting the same value for ${item[0]} property won't trigger renderMarkdown()`, () => {
        const key = item[0];
        const value = item[1];
        element[key] = value;
        const spy = sinon.spy(element, 'renderMarkdown');
        element[key] = value;
        assert.isFalse(spy.called);
      });
    });
  });

  describe('<arc-marked> renders mardown from property setter', function() {
    let outputElement;
    beforeEach(async () => {
      await propertyMardownFixture();
      outputElement = document.getElementById('output');
    });

    it('Renders the code', () => {
      assert.equal(outputElement.innerHTML, '<h1 id="test">Test</h1>\n');
    });
  });

  describe('<arc-marked> has some options of marked available', function() {
    let markedElement;
    beforeEach(async () => {
      markedElement = await smartyPantsFixture();
    });

    it('has sanitize', function() {
      expect(markedElement.sanitize).to.equal(false);
    });

    it('has sanitizer', function() {
      expect(markedElement.sanitizer).to.equal(undefined);
    });

    it('has pedantic', function() {
      expect(markedElement.pedantic).to.equal(false);
    });

    it('has breaks', function() {
      expect(markedElement.breaks).to.equal(false);
    });

    it('has smartypants', function() {
      expect(markedElement.smartypants).to.equal(true);
    });
  });

  describe('<arc-marked> with .markdown-html child', function() {
    describe('ignores no content', function() {
      let markedElement;
      let proofElement;
      let outputElement;
      beforeEach(async () => {
        markedElement = await noContentFixture();
        proofElement = document.createElement('div');
        outputElement = document.getElementById('output');
      });

      it('in code blocks', function() {
        proofElement.innerHTML = '';
        assert.equal(outputElement, markedElement.outputElement);
        assert.isTrue(isHidden(markedElement.shadowRoot.querySelector('#content')));
        assert.equal(markedElement.markdown, undefined);
        assert.equal(outputElement.innerHTML, proofElement.innerHTML);
      });
    });

    describe('respects camelCased HTML', function() {
      let markedElement;
      let proofElement;
      let outputElement;

      beforeEach(async () => {
        markedElement = await camelCaseHTMLFixture();
        proofElement = document.createElement('div');
        outputElement = document.getElementById('output');
      });

      it('in code blocks', function() {
        proofElement.innerHTML = '<div camelCase></div>';
        expect(outputElement).to.equal(markedElement.outputElement);
        assert.isTrue(isHidden(markedElement.shadowRoot.querySelector('#content')));
        // If Markdown content were put into a `<template>` or directly into the
        // DOM, it would be rendered as DOM and be converted from camelCase to
        // lowercase per HTML parsing rules. By using `<script>` descendants,
        // content is interpreted as plain text.
        expect(proofElement.innerHTML).to.eql('<div camelcase=""></div>');
        expect(outputElement.innerHTML).to.include(escapeHTML('<div camelCase>'));
      });
    });

    describe('respects bad HTML', function() {
      let markedElement;
      let proofElement;
      let outputElement;

      beforeEach(async () => {
        markedElement = await badHTMLFixture();
        proofElement = document.createElement('div');
        outputElement = document.getElementById('output');
      });

      it('in code blocks', function() {
        proofElement.innerHTML = '<p><div></p></div>';
        expect(outputElement).to.equal(markedElement.outputElement);
        assert.isTrue(isHidden(markedElement.shadowRoot.querySelector('#content')));
        // If Markdown content were put into a `<template>` or directly into the
        // DOM, it would be rendered as DOM and close unbalanced tags. Because
        // they are in code blocks they should remain as typed. Turns out, however
        // IE and everybody else have slightly different opinions about how the
        // incorrect HTML should be fixed. It seems that: IE says:
        // <p><div></p></div> -> <p><div><p></p></div> Chrome/FF say:
        // <p><div></p></div> -> <p></p><div><p></p></div>. So that's cool.
        const isEqualToOneOfThem =
          proofElement.innerHTML === '<p><div><p></p></div>' || proofElement.innerHTML === '<p></p><div><p></p></div>';
        assert.isTrue(isEqualToOneOfThem);
        expect(outputElement.innerHTML).to.include(escapeHTML('<p><div></p></div>'));
      });
    });
  });

  describe('<arc-marked> without .markdown-html child', function() {
    describe('respects camelCased HTML', function() {
      let markedElement;
      let proofElement;
      beforeEach(async () => {
        markedElement = await camelCaseHTMLWithoutChildFixture();
        proofElement = document.createElement('div');
      });

      it('in code blocks', async () => {
        proofElement.innerHTML = '<div camelCase></div>';
        expect(markedElement.shadowRoot.querySelector('#content')).to.equal(markedElement.outputElement);
        await nextFrame();
        assert.isFalse(isHidden(markedElement.shadowRoot.querySelector('#content')));
        // If Markdown content were put into a `<template>` or directly into the
        // DOM, it would be rendered as DOM and be converted from camelCase to
        // lowercase per HTML parsing rules. By using `<script>` descendants,
        // content is interpreted as plain text.
        expect(proofElement.innerHTML).to.eql('<div camelcase=""></div>');
        expect(markedElement.shadowRoot.querySelector('#content').innerHTML).to.include(escapeHTML('<div camelCase>'));
      });
    });

    describe('respects bad HTML', function() {
      let markedElement;
      let proofElement;

      beforeEach(async () => {
        markedElement = await badHTMLWithoutChildFixture();
        proofElement = document.createElement('div');
      });

      it('in code blocks', async () => {
        proofElement.innerHTML = '<p><div></p></div>';
        expect(markedElement.shadowRoot.querySelector('#content')).to.equal(markedElement.outputElement);
        await nextFrame();
        assert.isFalse(isHidden(markedElement.shadowRoot.querySelector('#content')));
        // If Markdown content were put into a `<template>` or directly into the
        // DOM, it would be rendered as DOM and close unbalanced tags. Because
        // they are in code blocks they should remain as typed. Turns out, however
        // IE and everybody else have slightly different opinions about how the
        // incorrect HTML should be fixed. It seems that: IE says:
        // <p><div></p></div> -> <p><div><p></p></div> Chrome/FF say:
        // <p><div></p></div> -> <p></p><div><p></p></div>. So that's cool.
        const isEqualToOneOfThem =
          proofElement.innerHTML === '<p><div><p></p></div>' || proofElement.innerHTML === '<p></p><div><p></p></div>';
        assert.isTrue(isEqualToOneOfThem);
        expect(markedElement.shadowRoot.querySelector('#content').innerHTML).to.include(
          escapeHTML('<p><div></p></div>')
        );
      });
    });
  });

  describe('<arc-marked> with custom sanitizer', function() {
    let markedElement;
    let outputElement;
    let proofElement;

    beforeEach(async () => {
      markedElement = await sanitizerFixture();
      outputElement = document.getElementById('output');
      proofElement = document.createElement('div');
    });

    it('takes custom sanitizer', function() {
      markedElement.sanitizer = function(input) {
        return input.replace(/ onclick="[^"]+"/gim, '');
      };

      proofElement.innerHTML =
        '<p><a href="http://url.com&quot;">Link</a>\n&lt;a ' +
        'href="<a href="http://url.com&quot;>Link</a">http://url.com"&gt;Link&lt;/a</a>&gt;</p>\n' +
        '<pre><code class="language-html">&amp;lt;a href=&amp;quot;http://url.com&amp;quot;&amp;gt;' +
        'Link&amp;lt;/a&amp;gt;</code></pre>\n';
      expect(outputElement.innerHTML).to.include(proofElement.innerHTML);
    });
  });

  describe('<arc-marked> with custom renderer', function() {
    let markedElement;
    let outputElement;
    let proofElement;

    beforeEach(async () => {
      markedElement = await rendererFixture();
      outputElement = document.getElementById('output');
      proofElement = document.createElement('div');
    });

    it('takes custom link renderer', function() {
      markedElement.renderer = function(renderer) {
        renderer.link = (href, title, text) => {
          return `<a href="${href}" target="_blank">${text}</a>`;
        };
      };
      proofElement.innerHTML = '<a href="http://url.com" target="_blank">Link</a>';
      expect(outputElement.innerHTML).to.include(proofElement.innerHTML);
    });
  });

  describe('<arc-marked> with remote content', function() {
    let markedElement;
    let outputElement;
    let proofElement;

    describe('succesful fetch', function() {
      beforeEach(async () => {
        markedElement = await remoteContentFixture();
        outputElement = document.getElementById('output');
        proofElement = document.createElement('div');
      });

      it('renders remote content', function(done) {
        proofElement.innerHTML = '<h1 id="test">Test</h1>\n<p><a href="http://url.com/">Link</a></p>\n';
        markedElement.addEventListener('marked-loadend', function() {
          expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
          done();
        });
      });

      it('renders content while remote content is loading', function() {
        proofElement.innerHTML = '<h1 id="loading">Loading</h1>\n<p>Please wait...</p>\n';
        expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
      });

      it('renders new remote content when src changes', function(done) {
        markedElement.addEventListener('marked-loadend', function firstCheck() {
          markedElement.removeEventListener('marked-loadend', firstCheck);
          proofElement.innerHTML = '<h1 id="test-2">Test 2</h1>\n';
          markedElement.querySelector('[type="text/markdown"]').src = 'base/test/test2.md';
          markedElement.addEventListener('marked-loadend', function() {
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          });
        });
      });
    });

    describe('fails to load', function() {
      beforeEach(async () => {
        markedElement = await badRemoteContentFixture();
        outputElement = document.getElementById('output');
        proofElement = document.createElement('div');
      });

      it('renders error message', function(done) {
        proofElement.innerHTML = '<p>Failed loading markdown source</p>\n';
        markedElement.addEventListener('marked-loadend', function() {
          expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
          done();
        });
      });

      it("Doesn't render error message when default is prevented", function(done) {
        proofElement.innerHTML = '';
        markedElement.addEventListener('marked-request-error', function(e) {
          e.preventDefault();
          nextFrame().then(() => {
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          });
        });
      });
    });

    describe('sanitizing remote content', function() {
      describe('sanitized', function() {
        beforeEach(async () => {
          markedElement = await sanitizedRemoteContentFixture();
        });

        it('sanitizes remote content', function(done) {
          outputElement = markedElement.querySelector('#output');
          proofElement = document.createElement('div');
          proofElement.innerHTML = '<p>&lt;div&gt;&lt;/div&gt;</p>\n';
          markedElement.addEventListener('marked-loadend', function() {
            assert.isTrue(markedElement.sanitize);
            assert.isNotTrue(markedElement.disableRemoteSanitization);
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          });
        });
      });

      describe('unsanitized', function() {
        beforeEach(async () => {
          markedElement = await unsanitizedRemoteContentFixture();
        });

        it('Does not sanitize remote content', function(done) {
          outputElement = markedElement.querySelector('#output');
          proofElement = document.createElement('div');
          proofElement.innerHTML = '<div></div>\n';
          markedElement.addEventListener('marked-loadend', function() {
            assert.isNotTrue(markedElement.sanitize);
            assert.isTrue(markedElement.disableRemoteSanitization);
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          });
        });
      });
    });
  });

  describe('events', function() {
    let markedElement;
    let outputElement;
    beforeEach(async () => {
      markedElement = await camelCaseHTMLFixture();
      outputElement = document.getElementById('output');
    });

    it('render() fires marked-render-complete', function(done) {
      markedElement.addEventListener('marked-render-complete', function() {
        expect(outputElement.innerHTML).to.not.equal('');
        done();
      });
      markedElement.renderMarkdown();
    });
  });
});
