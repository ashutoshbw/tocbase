tocbase({
  config: {
    titleText: "Table of Contents",
    num: 1,
    hNum: 1,
    anchor: 1,
    anchorSymbol: "#",

    cH: "toc-h",
    cUl: "toc-ul",
    cTocNum: "toc-num",
    cHAnchor: "h-anchor",
    cHNum: "h-num",
    cToc: "toc",
  },
  omit: "h1",
  placeholderID: "toc",
  plugins: [
    autoID(),
    smartIndent(),
  ],
});
