import { getHeadings, $, $$, elt, hasKey } from './util.js';
import { tocPleaseCore, nodeBag } from './core.js';



export function tocPlease (g = {}) {
  const proxyElt = $("#" + g.proxyID);

  const mergedConfig = Object.assign({}, g.config, JSON.parse(proxyElt?.value.trim() || "{}"));

  const hArr = getHeadings(g.getFrom, g.omit, mergedConfig?.omit);
  const toc = tocPleaseCore(hArr, mergedConfig);

  if (!toc) return;

  const showToc = () => (proxyElt?.replaceWith(toc), toc);

  if (!g.plugins || g.plugins.length == 0) return showToc();

  return g.plugins.reduce(
    (acc, p) => p({
      toc: acc,
      showToc: showToc,
      hArr: hArr,
      $, $$,
      config: mergedConfig,
      hasKey,
      ...nodeBag
    }),
    toc,
  );
}
