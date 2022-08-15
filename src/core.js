import { elt } from './util.js';

export function powerTocCore(headings, settings = {}, firstTime = true, nums = []) {
  const ul = elt("ul");

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const getDepthNumSpan = className => settings.number ? `<span${className ? ` class="${className}"` : ''}>${nums.map(n => n.toLocaleString(settings.numberLocale ? settings.numberLocale : "en-US")).join(settings.hasOwnProperty("numberSeperator") ? settings.numberSeperator : '.')}</span>${settings.spaceAfterNum ? ' ' : ''}` : '';

    const li = elt("li");
    li.innerHTML = `${getDepthNumSpan(settings.classes?.tocDepthNum)}<a href="#${headings[i].id}">${headings[i].innerHTML}</a>`;

    // make the anchor
    let anchorHTML = '';
    if (settings.anchor) {
      const anchor = elt("a");
      anchor.href = "#" + headings[i].id;
      anchor.setAttribute("aria-label", `Anchor link for: "${headings[i].id}"`);

      if (settings.anchorText) anchor.textContent = settings.anchorText;

      let anchorClassName = settings.classes.anchor;
      if (anchorClassName) anchor.className = anchorClassName;

      anchorHTML = anchor.outerHTML;
    }

    // aL and aR variables anchor left and right
    let sA = settings.spaceNearAnchor ? ' ' : '';
    let aL = settings.anchorDir == "left" ? anchorHTML + sA : '';
    let aR = settings.anchorDir == "right" ? sA + anchorHTML : '';
    headings[i].innerHTML = aL + getDepthNumSpan(settings.classes?.hDepthNum) + headings[i].innerHTML + aR;

    /* ------ Sub heading generation start -------*/
    const parentLevel = +headings[i].tagName[1]; 
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
      li.append(powerTocCore(subHeadings, settings, false, nums));
    } 

    ++nums[nums.length - 1];

    ul.append(li);
  }

  nums.pop();

  if (firstTime) {
    let tocClassName = settings.classes?.toc;
    let tocID = settings.tocID;
    const toc = elt("div", tocID, tocClassName);

    if (settings.title) {
      const h = elt(`h${settings.title.h}`);
      h.innerHTML = settings.title.html;
      toc.append(h);
    }

    toc.append(ul);

    return toc;
  } 
  return ul;
}
