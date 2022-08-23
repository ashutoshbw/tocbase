import { $, $$, elt, hasKey, getHeadings, applyPlugins } from './util.js';
import { tocPleaseCore, nodeBag } from './core.js';

export function tocPlease (g = {}) {
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

  if (!(bag.toc = tocPleaseCore(bag.hArray, bag.config))) return;

  placeholderElt?.replaceWith(bag.toc);

  return applyPlugins((g.plugins || []), bag).toc;
}
