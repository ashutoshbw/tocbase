import { elt, hasKey } from './util.js';

export const nodeBag = {ul:[], li:[], ta: [], ha: [], tn: [], hn: []};

/*
 * @return toc | undefined
 */

export function tocPleaseCore(headings, config = {}, firstTime = true, nums = []) {
  // just a optimized way to check if the array is empty
  if (!headings[0]) return;

  const ul = elt("ul", null, [config.cUl, config.num ? config.cUlIfNum : null].join` `.trim());
  nodeBag.ul.push(ul);

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]; 
    if (!h.id) throw new Error(`Headings must have ids.`); 

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

    if (config.anchor) {
      const headingAnchor = getAnchorHTML(h.id, config.cHAnchor, 0, config.anchorSymbol),
            headingNumSpan = getDepthNumSpan(config.cHNum),
            dir = config.anchorDir = config.anchorDir == "r" ? "r" : "l";

      if (config.hNum) {
        h.prepend(headingNumSpan);
        nodeBag.hn.push(headingNumSpan);
      }
      if (dir == "l") h.prepend(headingAnchor);
      else h.append(headingAnchor);

      nodeBag.ha.push(headingAnchor);
    }

    /* ------ Sub heading generation start -------*/
    const parentLevel = +h.tagName[1]; 
    const subHeadings = [];
    for (let j = i + 1; j < headings.length; j++) {
      const h = headings[j];
      const level = +headings[j].tagName[1]; 

      if (level > parentLevel) {
        subHeadings.push(h);
      } else {
        break;
      }
    }
    /* ------ Sub heading generation end -------*/


    i = i + subHeadings.length;
    if (subHeadings.length > 0) {
      li.append(tocPleaseCore(subHeadings, config, false, nums));
    } 

    ++nums[nums.length - 1];

    ul.append(li);
  }

  nums.pop();

  if (firstTime) {
    const toc = elt(config.wrapperTag || 'nav', config.tocID, config.cToc);

    if (config.titleHTML?.trim()) {
      const title = new DOMParser().parseFromString(config.titleHTML, "text/html").body.firstElementChild;
      nodeBag.title = title;
      toc.append(title);
    }

    toc.append(ul);

    return toc;
  } 
  return ul;
}

