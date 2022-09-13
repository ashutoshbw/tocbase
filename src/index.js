import { TB, $, $$, hasKey, elt, deepMerge, getHeadings, createPlugin, setupPlugins, resolveTocbaseInputInternal } from './util.js';
import { createTocCore, nodeBag } from './core.js';

function createToc(g = {}) {
  const bag = {
    setupPlugins,
    $, $$, elt, hasKey,
    ...nodeBag,
    plugins: {__applied: []},
  };

  const resolveInput = (valueName, defaultValue) => resolveTocbaseInputInternal(bag, valueName, defaultValue);

  // Add a style tag for tocbase and it's plugins
  bag.style = elt('style');
  bag.addCSS = css => bag.style.innerHTML += css;
  document.head.prepend(bag.style);

  const placeholderElt = document.getElementById(g.placeholderId);

  const plugins = g.plugins;
  delete g.plugins;

  // put everything useful in the bag to
  // pass to plugins to do awesome things
  deepMerge(bag, g, JSON.parse(placeholderElt?.textContent.trim() || "{}"));

  bag.hArray = getHeadings(g.getFrom, bag.glocalOmit, bag.omit);

  let pluginSliceIndex = 0;
  if (plugins && plugins[0]?.name == "auto-id") {
    plugins[0].setup({...bag});
    pluginSliceIndex = 1;
  }

  if (!(bag.toc = createTocCore(bag.hArray, resolveInput))) return;

  bag.addCSS(`
    .${bag.cNumList} {
      list-style-type: none;
    }
    .${bag.cTocNum}, .${bag.cHNum} {
      margin-right: 0.2rem;
    }
    .${bag.cHAnchor} {
      margin-${bag.anchorDir == "r" ? "left" : "right"}: 0.2rem;
    }
  `);

  placeholderElt?.replaceWith(bag.toc);

  return setupPlugins((plugins || []).slice(pluginSliceIndex), bag).toc;
}

export { createToc, createPlugin };
