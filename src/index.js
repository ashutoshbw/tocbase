import { TB, $, $$, hasKey, elt, deepMerge, getHeadings, createPlugin, setupPlugins, usePlugin, destroy } from './util.js';
import { createTocCore } from './core.js';

function createToc(g = {}) {
  const bag = {
    lists:[], li:[], ta: [], ha: [], tn: [], hn: [], __bHClassAttribute: [],
    $, $$, elt, hasKey, TB,
    plugins: {__applied: []},
    setupPlugins(plugins) {
      setupPlugins(plugins, this)
    },
  };

  const resolveInput = (valueName, defaultValue) => {
    bag[valueName] = hasKey(bag, valueName) ? bag[valueName] : defaultValue;
    return bag[valueName];
  };

  // Add a style tag for tocbase and it's plugins
  bag.style = elt('style');
  bag.addCSS = css => bag.style.innerHTML += css;
  document.head.prepend(bag.style);

  const placeholderElt = document.getElementById(g.placeholderId);
  bag.placeholderElt = placeholderElt;

  const plugins = g.plugins;
  delete g.plugins;

  // put everything useful in the bag to
  // pass to plugins to do awesome things
  deepMerge(bag, g, JSON.parse(placeholderElt?.textContent.trim() || "{}"));

  const ipGetFrom = resolveInput("getFrom", "body");
  const ipGlocalOmit = resolveInput("glocalOmit", "");
  const ipOmit = resolveInput("omit", "");

  try {
    bag.h = getHeadings(ipGetFrom, ipGlocalOmit, ipOmit);
  } catch(e) {
    console.log(`%cTocbase warning: ${e.message}`, "color: yellow; font-weight: bold");
    return;
  }

  let pluginSliceIndex = 0;
  if (plugins && plugins[0]?.name == "autoId") {
    usePlugin(plugins[0], bag)
    pluginSliceIndex = 1;
  }

  if (!(bag.toc = createTocCore(bag, bag.h, resolveInput))) return;

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

  setupPlugins((plugins || []).slice(pluginSliceIndex), bag);

  return {
    element: bag.toc,
    destroy: () => destroy(bag)
  }
}

export { createToc, createPlugin };
