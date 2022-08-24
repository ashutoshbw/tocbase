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

    const getDepthNumSpan = className => 
      config.num ? 
        `<span${className ? ` class="${className}"` : ''}>${ 
          nums
            .map(n => n.toLocaleString(config.numLocale || "en-US", {useGrouping: false}))
            .join(hasKey(config, "numSep") ? config.numSep: '.')
          }${config.numPostfix || ''
        }</span>${config.numSpace ? ' ' : ''}` 
        : '';

    const li = elt("li", null, config.cLi);
    nodeBag.li.push(li);

    const getAnchorHTML = (hID, className, innerHTML, textContent) => {
      let a = elt("a", null, className);
      a.href = '#' + hID;
      innerHTML && (a.innerHTML = innerHTML);
      textContent && (a.textContent = textContent);
      return a.outerHTML;
    };

    li.innerHTML = getDepthNumSpan(config.cTocNum) + getAnchorHTML(h.id, config.cTAnchor, h.innerHTML);
    nodeBag.ta.push(li.lastChild);

    if (config.anchor) {
      const anchorHTMLForHeading = getAnchorHTML(h.id, config.cHAnchor, 0, config.anchorSymbol);

      const dir = config.anchorDir = config.anchorDir || "right"

      let sA = config.anchorSpace ? ' ' : '';
      h.innerHTML = (dir == "left" ? anchorHTMLForHeading + sA : '')
                    + 
                    (config.hNum ? getDepthNumSpan(config.cHNum) : '') 
                    +
                    h.innerHTML 
                    + 
                    (dir == "right" ? sA + anchorHTMLForHeading : '');
      nodeBag.ha.push(dir == "left" ? h.firstChild : h.lastChild);
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

