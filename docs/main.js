tocbase({
  config: {
    titleText: "Table of Contents",
    num: 1,
    hNum: 1,
    anchor: 1,
    anchorSymbol: "#",

    cUlIfNum: "ul-numbered",
    cTocNum: "num-toc",
    cHAnchor: "h-anchor",
    cHNum: "num-h",
  },
  omit: "h1",
  placeholderID: "toc",
  plugins: [
    autoID(),
    smartIndent(),
  ],
});
