import { $, $$, elt, hasKey, getHeadings, setupPlugins } from './util.js';
import { createToc, nodeBag } from './create-toc.js';

export default function tocbase(g = {}) {
  const bag = {
    setupPlugins,
    $, $$, elt, hasKey,
    ...nodeBag
  }

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

  if (!(bag.toc = createToc(bag.hArray, bag.config))) return;

  placeholderElt?.replaceWith(bag.toc);

  return setupPlugins((g.plugins || []).slice(pluginSliceIndex), bag).toc;
}
