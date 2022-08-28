import { $, $$, elt, hasKey, getHeadings, applyPlugins } from './util.js';
import { createToc, nodeBag } from './create-toc.js';

export function tocbase(g = {}) {
  // The thing that toctree gives to it's plugins
  const bag = {
    applyPlugins,
    $, $$, elt, hasKey,
    ...nodeBag
  }

  let placeholderElt;
  if (hasKey(g, "placeholderID")) placeholderElt = $("#" + g.placeholderID);

  // merged config
  bag.config = {...(g.config || {}), ...JSON.parse(placeholderElt?.textContent.trim() || "{}")};

  bag.hArray = getHeadings(g.getFrom, g.omit, bag.config.omit);

  let pluginSliceIndex = 0;
  if (g.plugins && g.plugins[0]?.name == "autoID") {
    g.plugins[0]({hArray: bag.hArray});
    pluginSliceIndex = 1;
  }

  if (!(bag.toc = createToc(bag.hArray, bag.config))) return;

  placeholderElt?.replaceWith(bag.toc);

  return applyPlugins((g.plugins || []).slice(pluginSliceIndex), bag).toc;
}
