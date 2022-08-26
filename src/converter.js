function elt(type, id, className) {
  const node = document.createElement(type);
  return id ? node.id = id : className && (node.className = className), node;
}

//const nthParent = (n, node, fallbackNode) => n == 0 || !node ? node : nthParent(n - 1, node.parentElement);

// callback for li
function createLI(h) {
  const li = elt("li");
  li.textContent = h.textContent;
  return li;
}

function createUL(li) {
  const ul = elt("ul");
  ul.append(li);
  return ul;
}

function h2ul(headings, rootUL) {
  if (headings.length == 0) return;

  // This function is for getting the right UL parent
  // for LI elements to append to it. I'm creating the UL
  // in thin air, so going multiple parents deep may
  // return `null`, which is a good thing because based
  // on that `null` I'm returning the root UL as a fallback
  // return value. The fallback also helps for the first
  // iteration when lastLI is `undefined`.
  //
  // The following works because it can be shown that 
  // `node` can't be `null` when `n` is 0.
  const nthParent = (n, node) => n == 0 ? node :
                                 !node ? rootUL : nthParent(n - 1, node.parentElement);

  // Setting this initial value to lastH is a trick
  // to force the algorithm not to break down because of
  // no initial `lastH`. And it's `H9` to set the first
  // heading's correspoding ToC item to always be at the
  // top of root UL by not letting the distance evaluating
  // to 0. It could be choosen as `H7`. But for better safety
  // I've choosen `H9` :D
  let lastH = {tagName: 'H9'}, 
      lastLI;

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i],
          curLI = createLI(h),  // NON-ALGO
          distance = lastH.tagName[1] - h.tagName[1];

    if (distance >= 0) nthParent(2 * distance, lastLI?.parentElement).append(curLI);
    else lastLI.append(createUL(curLI));   // NON-ALGO

    lastLI = curLI, lastH = h;
  }
  return rootUL;
}

const headings = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
document.body.prepend(h2ul(headings, elt("ul")));

