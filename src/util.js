export const TB = "tocbase";

export const $ = (s, n) => (n || document).querySelector(s);
export const $$ = (s, n) => [...(n || document).querySelectorAll(s)];
export const hasKey = (o, k) => o.hasOwnProperty(k);

export const addClassesToClassList = (elt, classes) => {
  if (typeof classes != "string") return;
  classes = classes.trim();

  // following is a trick to have [] when `classes` is empty string 
  // it's safe because a string can't have more classes than it's length
  const cArr = classes.split(/\s+/, classes.length);
  cArr.forEach(c => elt.classList.add(c));
};

export function elt(type, id, classes) {
  const node = document.createElement(type);
  if (typeof id == "string") {
    id = id.trim();
    if (id) node.id = id;
  }
  addClassesToClassList(node, classes);
  return node;
}

const isObj = o => !Array.isArray(o) && typeof o == 'object';
export function deepMerge(t, ...sources) {
  sources.forEach(s => {
    for (let k in s) {
      (!isObj(s[k])) ? t[k] = s[k] :
      isObj(t[k]) ? deepMerge(t[k], s[k]) : t[k] = s[k]
    }
  })
  return t;
}

export function getHeadings(getFrom = "body", globalOmit = "", omit = "") {
  const headings = $$("h1,h2,h3,h4,h5,h6", $(getFrom)),
        e1 = globalOmit.trim(), 
        e2 = omit.trim();

  if (!e1 && !e2) return headings;

  return headings.filter(h => h.matches(`:not(${e1}${e1 && e2 ? ',' : ''}${e2})`));
}

// For resolving input in tocbase core
export const resolveTocbaseInputInternal = (bag, valueName, defaultValue) => {
  bag[valueName] = bag[valueName] === null ? null :
                   hasKey(bag, valueName) ? bag[valueName] : defaultValue;
  return bag[valueName];
}

// For resolving input in plugins
const resolvePluginInputInternal = (bag, pluginName, config, valueName, defaultValue) => {
  const pc = bag.plugins[pluginName];
  const value = hasKey(pc, valueName) ? pc[valueName] :
                hasKey(config, valueName) ? config[valueName] : defaultValue;
  pc[valueName] = value;
  return value;
}

const preProcessPlugin = plugin => ({
  setup(bag) {
    const {name, config, parentName} = plugin;
    if (bag.plugins.__applied.some(p => p.name === name)) throw new Error(`"${name}" Plugin is called multiple times.`);

    const resolveInput = (valueName, defaultValue) => resolvePluginInputInternal(bag, name, config, valueName, defaultValue);

    bag.plugins[name] = Object.assign({}, bag.plugins[name]);

    const parentPlugin = Object.entries(bag.plugins).find(e => e[0] == parentName);

    if (parentName && (parentPlugin ? !parentPlugin[1].enable : 1)) {
      bag.plugins[name].enable = 0;
    } else if (resolveInput("enable", 1)) {
      plugin.setup(bag, resolveInput, config);
      bag.plugins.__applied.push(plugin);
    }

    return bag;
  }
});

export const setupPlugins = (plugins, bag) => plugins.reduce((acc, p) => preProcessPlugin(p).setup(acc), bag);

export const createPlugin = (name, setup, parentName = null) => (config = {}) => ({ name, config, setup, parentName });
