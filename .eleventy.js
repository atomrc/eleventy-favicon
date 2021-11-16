const sharp = require("sharp");
const toIco = require("to-ico");
const fs = require("fs").promises;

// Caches all the file generations that were made.
// It keeps track of the mtime of the source file so the cache can be invalidated if the source changes
let cache = {};

function generateIcoFavicon({ width, height, density }, sourcePath) {
  const faviconDimensions = [32, 64];
  // Create buffer for each size
  return Promise.all(
    faviconDimensions.map((dimension) =>
      sharp(sourcePath, {
        density: (dimension / Math.max(width, height)) * density,
      })
        .resize(dimension, dimension)
        .toBuffer()
    )
  ).then((buffers) => toIco(buffers));
}

function generatePngFavicon({ density, width, height }, sourcePath) {
  return sharp(sourcePath, {
    density: (180 / Math.max(width, height)) * density,
  })
    .resize(180, 180)
    .png()
    .toBuffer();
}

function saveFile(destination) {
  return function (buffer) {
    return fs.writeFile(destination, buffer);
  };
}

const faviconTypes = [
  ["favicon.ico", generateIcoFavicon],
  ["apple-touch-icon.png", generatePngFavicon],
];

const defaultOptions = {
  destination: "./_site",
};
module.exports = function (config, options = defaultOptions) {
  const destination = options.destination || defaultOptions.destination;
  config.addAsyncShortcode("favicon", async function (faviconFile) {
    const { mtimeMs } = await fs.stat(faviconFile);
    const lastGeneration = cache[faviconFile] || { mtime: 0, svg: false };
    if (mtimeMs > lastGeneration.mtime) {
      const metadata = await sharp(faviconFile).metadata();
      cache[faviconFile] = { mtime: mtimeMs, svg: metadata.format === "svg" };
      faviconTypes.forEach(([name, generator]) =>
        generator(metadata, faviconFile).then(
          saveFile(`${destination}/${name}`)
        )
      );
      if (cache[faviconFile].svg) {
        fs.copyFile(faviconFile, `${destination}/favicon.svg`);
      }
    }

    const svgEntry = cache[faviconFile].svg
      ? '<link rel="icon" type="image/svg+xml" href="/favicon.svg"></link>'
      : "";

    return `
<link rel="icon" href="/favicon.ico">
${svgEntry}
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
    `;
  });
};
