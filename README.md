# eleventy-favicon

Generate the perfect set of favicon icons **from a single image file**.
It will generate the `favicon.ico` and `apple-touch-icon.png` for you and will also generate all the `html` `link` tags (based on the recommendations of [How to favicon in 2021](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

**To make the most out of the plugin**, you can use an `svg` file as the source. In which case the file itself will also be copied to the destination folder and a `<link rel="icon" type="image/svg+xml" href="/favicon.svg"></link>` will also be added to your `html` :wink:

## Installation

```
npm i eleventy-favicon
```

In your eleventy config file (`.eleventy.js`) add:

```js
const faviconPlugin = require("eleventy-favicon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(faviconPlugin, options);
};
```

## Options

| Key           | Default     | description                                                                       |
| ------------- | ----------- | --------------------------------------------------------------------------------- |
| `destination` | `'./_site'` | Where your site is being built (this is where the icon files will be copied over) |

## Usage

Once installed, the `eleventy-favicon` plugin will add a `shortcode` that you can use on your sources files.

A classic use-case would be adding the following in your site's default layout:

```html
<head>
  <!-- [...] -->
  {% favicon './favicon.svg' %}
  <!-- [...] -->
</head>
```

## Under the hood

This plugin heavily relies on [sharp](https://github.com/lovell/sharp) package and on [to-ico](https://github.com/kevva/to-ico#readme)

## Limitations

As of now, the plugin does not generate the `manifest.json` suggested by [this article](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

Feel free to raise an issue or propose a PR if you need it. 
