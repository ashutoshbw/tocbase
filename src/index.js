import { $, $$, elt, hasKey, getHeadings, createPlugin, setupPlugins } from './util.js';
import { createTocCore, nodeBag } from './core.js';

function createToc(g = {}) {
  const bag = {
    setupPlugins,
    $, $$, elt, hasKey,
    ...nodeBag,
    options: {}  // for holding plugin options and accessing them from any plugins
  };

  let placeholderElt;
  if (hasKey(g, "placeholderID")) placeholderElt = $("#" + g.placeholderID);

  // merged config
  bag.config = {...(g.config || {}), ...JSON.parse(placeholderElt?.textContent.trim() || "{}")};

  bag.hArray = getHeadings(g.getFrom, g.omit, bag.config.omit);

  let pluginSliceIndex = 0;
  if (g.plugins && g.plugins[0]?.name == "auto-id") {
    g.plugins[0].setup({...bag});
    pluginSliceIndex = 1;
  }

  if (!(bag.toc = createTocCore(bag.hArray, bag.config))) return;

  placeholderElt?.replaceWith(bag.toc);

  return setupPlugins((g.plugins || []).slice(pluginSliceIndex), bag).toc;
}

export { createToc, createPlugin };
