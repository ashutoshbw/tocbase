import { elt, hasKey } from './util.js';

export const nodeBag = {list:[], li:[], ta: [], ha: [], tn: [], hn: []};

export function createTocCore(headings, resolveInputs, firstTime = true, nums = []) {
  // just a optimized way to check if the array is empty
  if (!headings[0]) return;

  const TB = "tocbase";

  const input = resolveInputs({
    wrapperElt:   "nav",
    titleText:    "Table",
    tocId:        `${TB}-toc`,
    listType:     "ul",
    numLocale:    "en-US",
    numSep:       ".",
    numPostfix:   "",
    anchorSymbol: "#",
    anchorDir:    "r",

    bTocNum: 0,
    bHNum:   0,
    bAnchor: 0,

    cToc:       `${TB}-toc`,
    cTitle:     `${TB}-title`,
    cRootList:  `${TB}-root-list`,
    cList:      `${TB}-list`,
    cLi:        `${TB}-li`,
    cNumList:   `${TB}-num-list`,
    cH:         `${TB}-h`,
    cTocNum:    `${TB}-toc-num`,
    cHNum:      `${TB}-h-num`,
    cTocAnchor: `${TB}-toc-a`,
    cHAnchor:   `${TB}-h-a`,
  });

  const listElt = elt(input.listType, null, firstTime && input.cRootList);

  listElt.classList.add(input.bTocNum ? input.cNumList: input.cList);

  nodeBag.list.push(listElt);

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]; 
    if (!h.id) throw new Error(`Headings must have ids.`); 

    h.classList.add(input.cH);

    const getDepthNumSpan = className => {
      const span = elt("span", null, className);
      span.append(nums
        .map(n => n.toLocaleString(input.numLocale || "en-US", {useGrouping: false}))
        .join(input.numSep) + (input.numPostfix));
      return span;
    };

    const li = elt("li", null, input.cLi);
    nodeBag.li.push(li);

    const getAnchorHTML = (hID, className, innerHTML, textContent) => {
      let a = elt("a", null, className);
      a.href = '#' + hID;
      if (innerHTML) a.innerHTML = innerHTML;
      if (textContent) a.textContent = textContent;
      return a;
    };

    const tocAnchor = getAnchorHTML(h.id, input.cTocAnchor, h.innerHTML);
    li.append(tocAnchor);
    nodeBag.ta.push(tocAnchor);

    if (input.bTocNum) { 
      const tocNumSpan = getDepthNumSpan(input.cTocNum);
      li.prepend(tocNumSpan);
      nodeBag.tn.push(tocNumSpan);
    }

    const headingNumSpan = getDepthNumSpan(input.cHNum);

    if (input.bHNum) {
      h.prepend(headingNumSpan);
      nodeBag.hn.push(headingNumSpan);
    }

    if (input.bAnchor) {
      const headingAnchor = getAnchorHTML(h.id, input.cHAnchor, 0, input.anchorSymbol);

      if (input.anchorDir == "l") h.prepend(headingAnchor);
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
      li.append(createTocCore(subHeadings, resolveInputs, false, nums));
    } 

    listElt.append(li);

    ++nums[nums.length - 1];
    i = i + subHeadings.length;
  }

  nums.pop();

  if (firstTime) {
    const toc = elt(input.wrapperElt || 'nav', input.tocId, input.cToc);

    const title = elt("h2", null, input.cTitle); 
    title.textContent = input.titleText;
    nodeBag.title = title;
    toc.append(title);

    toc.append(listElt);

    return toc;
  } 
  return listElt;
}
