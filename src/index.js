import { getHeadings, $ } from './util.js';
import { tocPleaseCore } from './core.js';

export function tocPlease (g = {}) {
  // querySelector

  const spawnElt = $("#" + g.spawnID);

  // From now config is the merged config
  const mergedConfig = Object.assign({}, g.config, JSON.parse(spawnElt?.innerHTML.trim() || "{}"));

  const headings = getHeadings(g.getFrom, g.omit, mergedConfig?.omit);
  const toc = tocPleaseCore(headings, mergedConfig);

  if (!toc) return;

  spawnElt?.replaceWith(toc);

  return toc;
}
