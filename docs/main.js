tocbase({
  config: {
    titleText: "Table of Contents",
    num: 1,
    hNum: 1,
    cUlIfNum: "ul-numbered",
    cTocNum: "num-toc",
  },
  omit: "h1",
  placeholderID: "toc",
  plugins: [
    autoID(),
    smartIndent(),
  ],
});
