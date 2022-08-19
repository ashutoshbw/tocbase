import { getHeadings } from './util.js';
import { tocPleaseCore } from './core.js';

export function tocPlease ({
  config = {},
  getFrom = "body",
  spawnID = undefined,
  render = true,
  omit = "",
} = {}) {
  // making it a one time use function
  if (tocPlease.$) return;
  tocPlease.$ = true;

  const $ = id => document.querySelector(id);

  const spawnElt = $("#" + spawnID);

  // From now config is the merged config
  Object.assign(config, JSON.parse(spawnElt?.innerHTML.trim() || "{}"));

  const headings = getHeadings($(getFrom), omit, config.omit);
  const toc = tocPleaseCore(headings, config);

  if (!toc) return;

  render && spawnElt?.replaceWith(toc);

  return toc;
}
