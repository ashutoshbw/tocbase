import { elt } from './util.js';

export function tocPleaseCore(headings, config = {}, firstTime = true, nums = []) {
  // just a optimized way to check if the array is empty
  if (!headings[0]) return;

  const ul = elt("ul", null, [config.classes?.ul, config.number && config.classes?.ulIfNumber].join(' ').trim());

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]; 
    const hID = h.id || `a${nums.join("_")}`;
    if (!h.id && config.modifyHeadings) h.id = hID;
    const getDepthNumSpan = className => config.number ? `<span${className ? ` class="${className}"` : ''}>${nums.map(n => n.toLocaleString(config.numberLocale ? config.numberLocale : "en-US")).join(config.hasOwnProperty("numberSeperator") ? config.numberSeperator : '.')}</span>${config.spaceAfterNum ? ' ' : ''}` : '';

    const li = elt("li", null, config.classes?.li);
    li.innerHTML = `${getDepthNumSpan(config.classes?.tocDepthNum)}<a href="#${hID}">${h.innerHTML}</a>`;

    // make the anchor
    let anchorHTML = '';
    if (config.anchor) {
      const anchor = elt("a");
      anchor.href = "#" + hID;
      anchor.setAttribute("aria-label", `Anchor link for: "${hID}"`);

      if (config.anchorText) anchor.textContent = config.anchorText;

      let anchorClassName = config.classes?.anchor;
      if (anchorClassName) anchor.className = anchorClassName;

      anchorHTML = anchor.outerHTML;
    }

    if (config.modifyHeadings) {
      if (!config.anchorDir) config.anchorDir = "right";

      // aL and aR variables anchor left and right
      let sA = config.spaceNearAnchor ? ' ' : '';
      let aL = config.anchorDir == "left" ? anchorHTML + sA : '';
      let aR = config.anchorDir == "right" ? sA + anchorHTML : '';
      h.innerHTML = aL + getDepthNumSpan(config.classes?.hDepthNum) + h.innerHTML + aR;
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
    let tocClassName = config.classes?.toc;
    let tocID = config.tocID;
    const toc = elt(config.wrapperTag || 'nav', tocID, tocClassName);

    if (config.titleHTML) toc.append(new DOMParser().parseFromString(config.titleHTML, "text/html").body.firstElementChild);

    toc.append(ul);

    return toc;
  } 
  return ul;
}
