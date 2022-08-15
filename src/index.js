import { deepMerge, getHeadings, getTocComment } from './util.js';
import { powerTocCore } from './core.js';

export default function powerToc ({
  settings = {},
  node = document.body,
  targetID = null,
  replace = false,
  render = true,
} = {}) {
  if (!settings.globalExclude) settings.globalExclude = [];
  if (!settings.exclude) settings.exclude = [];

  const tocComment = getTocComment(node);

  const mergedSettings = deepMerge(settings, tocComment?.data || {});
  const headings = getHeadings(node, mergedSettings.globalExclude, mergedSettings.exclude);
  const toc = powerTocCore(headings, mergedSettings);

  if (targetID && render) {
    const elt = document.querySelector(`#${targetID}`);
    console.log(elt);
    if (replace) elt.replaceWith(toc);
    else elt.innerHTML = toc.innerHTML;

  } else if (tocComment && render) {
    tocComment.node.replaceWith(toc);
  }
  return toc;
}
