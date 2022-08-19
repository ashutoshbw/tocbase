export function elt(type, id, className) {
  const node = document.createElement(type);
  id ? node.id = id :
  className ? node.className = className : '';
  return node;
}

export function getHeadings(node = document.body, globalOmit = "", omit = "") {
  const headings = [...node.querySelectorAll("h1,h2,h3,h4,h5,h6")];
  const e1 = globalOmit.trim();
  const e2 = omit.trim();
  if (!e1 && !e2) return headings;
  const grandOmit = `:not(${e1}${e1 && e2 ? ',' : ''}${e2})`;
  return headings.filter(h => h.matches(grandOmit));
}

