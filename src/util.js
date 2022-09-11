export const $ = (s, n) => (n || document).querySelector(s);
export const $$ = (s, n) => [...(n || document).querySelectorAll(s)];
export const hasKey = (o, k) => o.hasOwnProperty(k);

export function elt(type, id, className) {
  const node = document.createElement(type);
  return id ? node.id = id : className && (node.className = className), node;
}

export function getHeadings(getFrom = "body", globalOmit = "", omit = "") {
  const headings = $$("h1,h2,h3,h4,h5,h6", $(getFrom)),
        e1 = globalOmit.trim(), 
        e2 = omit.trim();

  if (!e1 && !e2) return headings;

  return headings.filter(h => h.matches(`:not(${e1}${e1 && e2 ? ',' : ''}${e2})`));
}


function getValueInternal(bag, pluginName, config, valueName, defaultValue) {
  const p = bag.config.plugins[pluginName];
  const value = p[valueName] || config[valueName] || defaultValue;
  p[valueName] = value;
  return value;
}

function processPlugin(plugin) {
  return ({
    setup(bag) {
      const c = bag.config;
      if (!c.plugins) c.plugins = {};
      c.plugins[plugin.name] = Object.assign({}, c.plugins[plugin.name]);

      const getValue = (valueName, defaultValue) => getValueInternal(bag, plugin.name, plugin.config, valueName, defaultValue);
      plugin.setup(bag, getValue, plugin.config);
      return bag;
    }
  });
}

//export const setupPlugins = (plugins, bag) => plugins.reduce((acc, p) => p.setup(acc), bag);
export const setupPlugins = (plugins, bag) => plugins.reduce((acc, p) => {
  return processPlugin(p).setup(acc); 
}, bag);

export const createPlugin = (name, setup) => (config = {}) => ({ name, config, setup });
