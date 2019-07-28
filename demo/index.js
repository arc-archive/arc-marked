import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '../arc-marked.js';

function configChangedHandler(e) {
  const prop = e.target.id;
  const value = e.target.checked;
  const nodes = document.querySelectorAll('arc-marked');
  Array.from(nodes).forEach((node) => {
    node[prop] = value;
  });
}

const nodes = document.querySelectorAll('#config input[type="checkbox"]');
Array.from(nodes).forEach((node) => {
  node.addEventListener('change', configChangedHandler);
});
