---
title: Tocbase documentation
date: August 31, 2022
---

# Tocbase
<a href="https://bundlephobia.com/package/tocbase" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/tocbase?color=green" alt="Minimized and gzipped size"></a>

Tocbase is a **t**able **o**f **c**ontents maker that runs in the browser. It's simple, lightweight, and empowering.

It's **empowering** because it allows you to extend the functionality and look of the ToC and related things by writing plugins. It's way lot easier than you think.

Tocbase itself generates a simple HTML ToC and also helps you add anchors and numbers to headings and nothing else.

If you love playing with interaction and styles, you can use it as a solid base to craft your dream table of contents.

## Main features

- Support for anchors and numbering.
- Global and local configuration.
- Adds no CSS styles and interactions.
- Extendable through a robust plugin system.
- Less than 1.3 kb (minimized + gzipped).

## Installing

### CDN
You can directly add `tocbase` to your HTML page with it's CDN link like below:
```html
<script src="https://www.unpkg.com/tocbase@latest/dist/cdn.umd.min.js"></script>
```

Put the above `<script>` inside the `<head>` of your HTML. The above CDN link is for the latest version. If you want a specific version you can specify that in the place of `latest`.

### Node
If you are using bundler, this option is for you. The command to install `tocbase` is:

```
npm i tocbase
```

For accessing it you can use both ESM and Common JS style:
```js
// ESM
import tocbase from "tocbase";

// Common JS
const tocbase = require("tocbase");
```

Follow your bundler's instructions for generating the output file and then load it in your HTML page through `<script>` to use it.

## A micro tutorial
The goal of this micro tutorial is get you up and running. Let's create a HTML file `index.html` containing the following:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tocbase demo</title>
    <script src="https://www.unpkg.com/tocbase@latest/dist/cdn.umd.min.js"></script>
    <script defer src="index.js"></script>
  </head>
  <body>
    <h1 id="post-title">My awesome blog post title</h1>

    <!-- this p tag will be considered as the placeholder of our ToC -->
    <p id="toc"></p>

    <h2 id="introduction">Introduction</h2>
    <h2 id="how-to-do-this">How to do this</h2>
    <h3 id="some-details">Some details</h3>
    <h2 id="wrap-up">Wrap-up</h2>
  </body>
</html>
```

Now create a `index.js` in the same folder as your HTML file and add the following code there:
```js
tocbase({
  placeholderID: "toc"
});
```

Now if you open the page in the browser you shold see the ToC in the place of the `<p>` element with an id of `toc`.

But there is a problem. Your post title goes into the ToC, which you don't want to happen, right? Let's fix this by telling `tocbase` to **always** omit the heading that has the id `post-title` by adding the `omit` key like below:

```js
tocbase({
  placeholderID: "toc",
  omit: "#post-title"
});
```

Two important thing to note here:

- For tocbase to do make the ToC, headings must have ids. However you don't have an automated way make the ids for you, the `tocbase` plugin `tocbase-plugin-auto-id` can do this for you in the browser. In the next subsection we will cover it.
- The `omit` property contains a CSS selector string.

### Using a plugin
Let's use a the [`tocbase-plugin-auto-id`](https://www.npmjs.com/package/tocbase-plugin-auto-id) create ids for you. For for that load plugin via CDN in your `<head>`:
```js
<script src="https://unpkg.com/tocbase-plugin-auto-id@latest/dist/cdn.umd.min.js"></script>
```

This script will create a variable `autoID` to hold the plugin.

Now add some id-less headings after "Some details":
```html
<h4>Eney</h4>
<h4>Meeny</h4>
<h4>Miny</h4>
<h4>Moe</h4>
```

Now if you refresh the browser it will not work! Because If haven't yet told `tocbase` to use the plugin. Let's do this by add the plugin like below in our `index.js` file:
```js
tocbase({
  placeholderID: "toc",
  omit: "#post-title",
  plugins: [autoID()]
});
```

Now the ToC will appear as expected. When you call a plugin you can pass options to tweak the plugin. For example if you want the ids to be lowercased you can pass the `lowerCase option like below:
```js
tocbase({
  placeholderID: "toc",
  omit: "#post-title",
  plugins: [autoID({ lowerCase: true })]
});
```

See the plugins documentation for more info about it.

Congratulations! You have finished the micro tutorial. Now you are ready to explore and play around with the rest of this doc. Have fun!

## API
### The `tocbase` function
To create ToC you need to call this function.

**Note**: This function should not be called more than once, since if you add numberings and anchors, it considers those as the content of the headings and add numbers and anchors again along side them. If you really need to call it multiple times witout messing things out, you can write a plugin for that. If you think anything missing, plugins are the way!

You can control your ToC at two levels through global and local configs.

If it can make a toc, it always returns the DOM node of the resulted ToC, otherwise it returns `undefined`.

### Global Config
It is the object that you pass to `tocbase`. Tocbase also works if you don't pass a global config. In this case it will use the default values. The properties of global config are:

#### `getFrom`
Type: "String"<br>
Default value: "body"

This should contain a CSS selector to narrow down in the doc from where you want to grab headings to create the ToC.

#### `placeholderID`
Type: "String"<br>
Default value: `undefined`

If you don't specify this, `tocbase` will make the ToC if it got some headings with ids and then will return the resulted DOM node.

#### `omit`
Type: "String"<br>
Default value: `""`

If you want omit some headings in all the HTML pages where the `tocbase` global config is used, you can specify them here with a CSS selector.

**Note**: Empty strings as CSS selecters are not valid. In `tocbase` they are allowed. It treats them as signals for matching nothing.

#### `config`
Type: Object<br>
Default: `{}`

This is an object to let you control different aspects of the ToC, like add numbers to the ToC items or not, etc. It's property are:

##### `wrapperTag`
Type: String<br>
Default: `"nav"`

The outer HTML element of the ToC.

##### `ulOl`
Type: String<br>
Default: `"ul"`

The element to use for the ToC listing. You can specify `"ol"` for having `<ol>` lists for the ToC.

##### `tocId`
Type: String<br>
Default: `undefiend`

A string representing the id of the wrapper element.

##### `titleHTML`
Type: String<br>
Default: `undefiend`

If it exists it creates a `<h2>` element as the ToC title containing the given text.

##### `omit`
Type: String<br>
Default: `""`

A CSS Selector string. It should match the elements that you want to omit as headings.

Note that treats `""` as value value. It thinks that as not omiting any headings inside the boundary area defined by `getFrom`.

##### `tocNum`
Type: Any value<br>
Default: `undefined`

If it's truthy value, `tocbases` uses JavaScript to add numbers to the ToC. If your ToC have multiple depths, it creates nested numbering.

You can turn this off by giving it a falsy value.

##### `hNum`
Type: Any value<br>
Default: `undefined`

If it's truthy value, `tocbases` uses JavaScript to add numbers to the start of the headings. If your ToC have multiple depths, it creates nested numbering.

You can turn this off by giving it a falsy value.

##### `numLocale`
Type: Usually a string<br>
Default: `"en-US"`

The locale for number. E.g. `"bn-u-nu-beng"`, `"hi-u-nu-deva"`, can be used for Bengali and Hindi respectively. It internally uses the JavaScript [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) constructor. So see this if you need help to find out your locale. Not that if your browser doesn't support `Intl.NumberFormat`, the result is entirely implementation dependent.

##### `numSep`
Type: String<br>
Default: `"."`

The separator to use between number elements of ToC that represent different depth levels.

##### `numPostfix`
Type: String<br>
Default: `""`

It is added to the end of the numberings. For example by default a number may be `4.3`. Now if you want a dot at the end you could specify that here.

##### `anchor`
Type: Any value<br>
Default: `undefined`

If it's a truthy value it creates a anchor element at the heading of a heading pointing to that heading.

##### `anchorSymbol`
Type: String<br>
Default: `""`

The symbol for the anchor.

##### `anchorDir`
Type: String<br>
Default: `"r"`

Determines on which side you want the anchor. `"r"` is for right. `"l"` is for left.

##### `cToc`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the wrapper ToC element.

##### `cH`
Type: String<br>
Default: `undefined`

Use it to append class name(s) to all the headings that `tocbase` uses for generating the ToC.

##### `cTitle`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the toc title element(`<h2>`).

##### `cTocNum`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the toc numbers elements(`<span>s`).

##### `cHNum`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the heading numbers elements(`<span>s`).

##### `cTocAnchor`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the ToC anchor(`<a>`) elements.

##### `cHAnchor`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the heading anchor(`<a>`) elements.

##### `cRootUlOl`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the root `<ul>` or `<ol>` element of the ToC.

##### `cUlOl`
Type: String<br>
Default: `undefined`

If `config.tocNum` is a falsy value, this property adds class name(s) to the ToC's each `<ul>` or `<ol>` elements.

##### `cNumUlOl`
Type: String<br>
Default: `undefined`

If `config.tocNum` is a truthy value, this property adds class name(s) to the ToC's each `<ul>` or `<ol>` elements.

##### `cLi`
Type: String<br>
Default: `undefined`

Use it to specify class name(s) for the ToC `<li>` elements.

### Local Config

You can override the properties of the `config` object of global config through local config.

To write the local config you will need to pass that as a JSON object as the content of the placeholder element. Below is an exmaple:

```html
<p id="mytoc">
{
  "tocNum": 1,
  "hNum": 0
}
</p>
```

Because it is JSON object you will need to write qoutes around the property names.

Two things to keep in mind:

- You can use any HTML element as the placholder element of your ToC as long as it allows you to write someting inside it and get that with it's `textContent` property.
- Because you are writing JSON as HTML string, if you want to include some HTML reserved characters like `<` or `&` you will need use HTML entities for those.

## Plugin development Guide
Coming Soon!


## Changes made
- `glocalOmit`
- `placeholderId` (Still in todo)

