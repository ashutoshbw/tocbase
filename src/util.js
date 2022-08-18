export function elt(type, id, className) {
  const node = document.createElement(type);
  if (id) node.id = id;
  if (className) node.className = className;
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

export function getHeadings(node = document.body, globalExclude = "", exclude = "") {
  const headings = [...node.querySelectorAll("h1,h2,h3,h4,h5,h6")];
  const e1 = globalExclude.trim();
  const e2 = exclude.trim();
  if (!e1 && !e2) return headings;
  const grandExclude = `:not(${e1}${e1 && e2 ? ',' : ''}${e2})`;
  return headings.filter(h => h.matches(grandExclude));
}

export function getTocComment(eltNode = document.body) {
  const childNodes = eltNode.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType == 1) {
      const result = getTocComment(node);
      if (result) return result;
    } else if (node.nodeType == 8) {
      const m = node.textContent.match(/^\s*toc\s*({[\s\S]*?})?\s*$/);
      if (m) return { node: node, data: m[1] ? JSON.parse(m[1]) : {} };
    }
  }
  return null;
}
