import { elt, hasKey, getHeadings } from './util.js';

export const nodeBag = {ul:[], li:[]};

/*
 * @return toc | undefined
 */
export function tocPleaseCore(headings, config = {}, firstTime = true, nums = []) {
  // just a optimized way to check if the array is empty
  if (!headings[0]) return;

  const ul = elt("ul", null, [config.cUl, config.num && config.cUlIfNum].join` `.trim());
  nodeBag.ul.push(ul);

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]; 
    const hID = h.id || nums.join`-` + "-" + h.textContent.replace(/\s+/g, "-");
    if (!h.id) h.id = hID;
    const getDepthNumSpan = className => config.num ? `<span${className ? ` class="${className}"` : ''}>${nums.map(n => n.toLocaleString(config.numLocale || "en-US", {useGrouping: false})).join(hasKey(config, "numSep") ? config.numSep: '.')}</span>${config.numPostfix || ''}${config.numSpace ? ' ' : ''}` : '';

    const li = elt("li", null, config.cLi);
    nodeBag.li.push(li);
    li.innerHTML = `${getDepthNumSpan(config.cTocNum)}<a href="#${hID}">${h.innerHTML}</a>`;

    // make the anchor
    let anchorHTML = '';
    if (config.anchor) {
      const anchor = elt("a");
      anchor.href = "#" + hID;

      anchor.textContent = hasKey(config, "anchorSymbol") ? config.anchorSymbol : "#";

      let anchorClassName = config.anchor;
      if (anchorClassName) anchor.className = anchorClassName;

      anchorHTML = anchor.outerHTML;
    }

    if (!config.anchorDir) config.anchorDir = "right";

    // aL and aR variables anchor left and right
    let sA = config.anchorSpace ? ' ' : '';
    let aL = config.anchorDir == "left" ? anchorHTML + sA : '';
    let aR = config.anchorDir == "right" ? sA + anchorHTML : '';
    h.innerHTML = aL + (config.hNum ? getDepthNumSpan(config.cHNum) : '') + h.innerHTML + aR;

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

