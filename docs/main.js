tocbase({
  config: {
    titleText: "Table of Contents",
    anchor: 1,
    anchorSymbol: "#",

    cH: "toc-h",
    cUl: "toc-ul",
    cHAnchor: "h-anchor",
    cToc: "toc",
  },
  omit: "h1",
  placeholderID: "toc",
  plugins: [
    autoID(),
    smartIndent(),
  ],
});
