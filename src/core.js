import { elt, hasKey } from './util.js';

export const nodeBag = {list:[], li:[], ta: [], ha: [], tn: [], hn: []};

export function createTocCore(headings, resolveInput, firstTime = true, nums = []) {
  // just a optimized way to check if the array is empty
  if (!headings[0]) return;

  const TB = "tocbase";

  // the ip at the start of variable names means it is input
  const ipWrapperElt    = resolveInput("wrapperElt",   "nav");
  const ipTitleText     = resolveInput("titleText",    "Table of Contents");
  const ipTocId         = resolveInput("tocId",        `${TB}-toc`);
  const ipListType      = resolveInput("listType",     "ul");
  const ipNumLocale     = resolveInput("numLocale",    "en-US");
  const ipNumSep        = resolveInput("numSep",       ".");
  const ipNumPostfix    = resolveInput("numPostfix",   "");
  const ipAnchorSymbol  = resolveInput("anchorSymbol", "#");
  const ipAnchorDir     = resolveInput("anchorDir",    "r");

  const ipBTocNum = resolveInput("bTocNum", 0);
  const ipBHNum   = resolveInput("bHNum"  , 0);
  const ipBAnchor = resolveInput("bAnchor", 0);

  const ipCToc       = resolveInput("cToc",       `${TB}-toc`);
  const ipCTitle     = resolveInput("cTitle",     `${TB}-title`);
  const ipCRootList  = resolveInput("cRootList",  `${TB}-root-list`);
  const ipCList      = resolveInput("cList",      `${TB}-list`);
  const ipCLi        = resolveInput("cLi",        `${TB}-li`);
  const ipCNumList   = resolveInput("cNumList",   `${TB}-num-list`);
  const ipCH         = resolveInput("cH",         `${TB}-h`);
  const ipCTocNum    = resolveInput("cTocNum",    `${TB}-toc-num`);
  const ipCHNum      = resolveInput("cHNum",      `${TB}-h-num`);
  const ipCTocAnchor = resolveInput("cTocAnchor", `${TB}-toc-a`);
  const ipCHAnchor   = resolveInput("cHAnchor",   `${TB}-h-a`);

  const listElt = elt(ipListType, null, firstTime && ipCRootList);

  listElt.classList.add(ipBTocNum ? ipCNumList: ipCList);

  nodeBag.list.push(listElt);

  nums.push(1);

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]; 
    if (!h.id) throw new Error(`Headings must have ids.`); 

    h.classList.add(ipCH);

    const getDepthNumSpan = className => {
      const span = elt("span", null, className);
      span.append(nums
        .map(n => n.toLocaleString(ipNumLocale || "en-US", {useGrouping: false}))
        .join(ipNumSep) + (ipNumPostfix));
      return span;
    };

    const li = elt("li", null, ipCLi);
    nodeBag.li.push(li);

    const getAnchorHTML = (hID, className, innerHTML, textContent) => {
      let a = elt("a", null, className);
      a.href = '#' + hID;
      if (innerHTML) a.innerHTML = innerHTML;
      if (textContent) a.textContent = textContent;
      return a;
    };

    const tocAnchor = getAnchorHTML(h.id, ipCTocAnchor, h.innerHTML);
    li.append(tocAnchor);
    nodeBag.ta.push(tocAnchor);

    if (ipBTocNum) { 
      const tocNumSpan = getDepthNumSpan(ipCTocNum);
      li.prepend(tocNumSpan);
      nodeBag.tn.push(tocNumSpan);
    }

    const headingNumSpan = getDepthNumSpan(ipCHNum);

    if (ipBHNum) {
      h.prepend(headingNumSpan);
      nodeBag.hn.push(headingNumSpan);
    }

    if (ipBAnchor) {
      const headingAnchor = getAnchorHTML(h.id, ipCHAnchor, 0, ipAnchorSymbol);

      if (ipAnchorDir == "l") h.prepend(headingAnchor);
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
      li.append(createTocCore(subHeadings, resolveInput, false, nums));
    } 

    listElt.append(li);

    ++nums[nums.length - 1];
    i = i + subHeadings.length;
  }

  nums.pop();

  if (firstTime) {
    const toc = elt(ipWrapperElt || 'nav', ipTocId, ipCToc);

    const title = elt("h2", null, ipCTitle); 
    title.textContent = ipTitleText;
    nodeBag.title = title;
    toc.append(title);

    toc.append(listElt);

    return toc;
  } 
  return listElt;
}
