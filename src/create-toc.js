import { elt, hasKey } from './util.js';

export const nodeBag = {ulol:[], li:[], ta: [], ha: [], tn: [], hn: []};

export function createToc(headings, config = {}, firstTime = true, nums = []) {
  // just a optimized way to check if the array is empty
  if (!headings[0]) return;

  const ulol = elt(config.ulol || "ul", null, [config.cUl, config.num ? config.cUlIfNum : null].join` `.trim());
  nodeBag.ulol.push(ulol);

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]; 
    if (!h.id) throw new Error(`Headings must have ids.`); 

    hasKey(config, "cH") && h.classList.add(config.cH);

    const getDepthNumSpan = className => {
      const span = elt("span", null, className);
      span.append(nums
        .map(n => n.toLocaleString(config.numLocale || "en-US", {useGrouping: false}))
        .join(hasKey(config, "numSep") ? config.numSep: '.') + (config.numPostfix || ''));
      return span;
    };

    const li = elt("li", null, config.cLi);
    nodeBag.li.push(li);

    const getAnchorHTML = (hID, className, innerHTML, textContent) => {
      let a = elt("a", null, className);
      a.href = '#' + hID;
      if (innerHTML) a.innerHTML = innerHTML;
      if (textContent) a.textContent = textContent;
      return a;
    };

    const tocAnchor = getAnchorHTML(h.id, config.cTAnchor, h.innerHTML);
    li.append(tocAnchor);
    nodeBag.ta.push(tocAnchor);

    if (config.num) { 
      const tocNumSpan = getDepthNumSpan(config.cTocNum);
      li.prepend(tocNumSpan);
      nodeBag.tn.push(tocNumSpan);
    }

    const headingNumSpan = getDepthNumSpan(config.cHNum);

    if (config.hNum) {
      h.prepend(headingNumSpan);
      nodeBag.hn.push(headingNumSpan);
    }

    if (config.anchor) {
      const headingAnchor = getAnchorHTML(h.id, config.cHAnchor, 0, config.anchorSymbol),
            dir = config.anchorDir = config.anchorDir == "l" ? "l" : "r";

      if (dir == "l") h.prepend(headingAnchor);
      else h.append(headingAnchor);

      nodeBag.ha.push(headingAnchor);
    }

    /* ------ Subheading generation start -------*/
    const subHeadings = [];
    for (let j = i + 1; j < headings.length; j++) {
      if (+headings[j].tagName[1] > h.tagName[1]) subHeadings.push(headings[j]);
      else break;
    }
    /* ------ Subheading generation end -------*/

    if (subHeadings.length > 0) {
      li.append(createToc(subHeadings, config, false, nums));
    } 

    ulol.append(li);

    ++nums[nums.length - 1];
    i = i + subHeadings.length;
  }

  nums.pop();

  if (firstTime) {
    const toc = elt(config.wrapperTag || 'nav', config.tocID, config.cToc);

    if (config.titleText?.trim()) {
      const title = elt("h2", null, config.cTitle); 
      title.textContent = config.titleText;
      nodeBag.titleText = title;
      toc.append(title);
    }

    toc.append(ulol);

    return toc;
  } 
  return ulol;
}
