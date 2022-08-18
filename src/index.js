import { deepMerge, getHeadings, getTocComment } from './util.js';
import { tocPleaseCore } from './core.js';

export function tocPlease ({
  config = {},
  boundaryNode = document.body,
  render = true,
  globalExclude = null,
} = {}) {
  const tocComment = getTocComment(boundaryNode);

  const mergedConfig = deepMerge(config, tocComment?.data || {});
  const headings = getHeadings(boundaryNode, globalExclude, mergedConfig.exclude);
  const toc = tocPleaseCore(headings, mergedConfig);

  if (!toc) return;

  if (tocComment && render) {
    tocComment.node.replaceWith(toc);
  }
  return toc;
}
