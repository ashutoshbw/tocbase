export const fccSettings = {
  // it's for global exclude
  globalExclude: [".article-title", ".author-name", ".post-full-title"],
  // it's for page specific exclude
  exclude: ["#a"],
  tocID: "simpleTOC",
  title: {html: "What we will cover", h: 4},
  number: true,
  numberLocale: "en-US",
  anchor: true,
  anchorText: "#",
  anchorDir: "left",
  classes: {
    toc: "my-toc fdbold",
    tocDepthNum: "toc-depth-num-my",
    hDepthNum: "h-depth-num-my",
    anchor: "anchor",
  },
  spaceAfterNum: true,
  spaceNearAnchor: true,
}

