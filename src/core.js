import { elt } from './util.js';

export function tocPleaseCore(headings, config = {}, firstTime = true, nums = []) {
  // just a optimized way to check if the array is empty
  if (!headings[0]) return;

  const ul = elt("ul", null, [config.classes?.ul, config.num && config.classes?.ulIfNumber].join` `.trim());

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]; 
    const hID = h.id || nums.join`-`;
    if (!h.id) h.id = hID;
    const getDepthNumSpan = className => config.num ? `<span${className ? ` class="${className}"` : ''}>${nums.map(n => n.toLocaleString(config.numLocale || "en-US", {useGrouping: false})).join(config.hasOwnProperty("numSep") ? config.numSep: '.')}</span>${config.numPostfix || ''}${config.numSpace ? ' ' : ''}` : '';

    const li = elt("li", null, config.classes?.li);
    li.innerHTML = `${getDepthNumSpan(config.classes?.tocDepthNum)}<a href="#${hID}">${h.innerHTML}</a>`;

    // make the anchor
    let anchorHTML = '';
    if (config.anchor) {
      const anchor = elt("a");
      anchor.href = "#" + hID;
      anchor.setAttribute("aria-label", `Anchor link for: "${hID}"`);

      if (!config.anchorSymbol) config.anchorSymbol = "#";
      anchor.textContent = config.anchorSymbol;

      let anchorClassName = config.classes?.anchor;
      if (anchorClassName) anchor.className = anchorClassName;

      anchorHTML = anchor.outerHTML;
    }

    if (!config.anchorDir) config.anchorDir = "right";

    // aL and aR variables anchor left and right
    let sA = config.anchorSpace ? ' ' : '';
    let aL = config.anchorDir == "left" ? anchorHTML + sA : '';
    let aR = config.anchorDir == "right" ? sA + anchorHTML : '';
    h.innerHTML = aL + getDepthNumSpan(config.classes?.hDepthNum) + h.innerHTML + aR;

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
    const toc = elt(config.wrapperTag || 'nav', config.tocID, config.classes?.toc);

    if (config.titleHTML?.trim()) toc.append(new DOMParser().parseFromString(config.titleHTML, "text/html").body.firstElementChild);

    toc.append(ul);

    return toc;
  } 
  return ul;
}
