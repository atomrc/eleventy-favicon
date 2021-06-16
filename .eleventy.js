const sharp = require("sharp");
const toIco = require("to-ico");
const fs = require("fs").promises;

let count = 0;
function generateIcoFavicon({ width, height, density }, sourcePath, destPath) {
  const faviconDimensions = [32, 64];
  // Create buffer for each size
  return Promise.all(
    faviconDimensions.map((dimension) =>
      sharp(sourcePath, {
        density: (dimension / Math.max(width, height)) * density,
      }).toBuffer()
    )
  )
    .then((buffers) => toIco(buffers))
    .then((ico) => fs.writeFile(destPath, ico));
}

function generatePngFavicon({ density, width, height }, sourcePath, destPath) {
  return sharp(sourcePath, {
    density: (180 / Math.max(width, height)) * density,
  })
    .png()
    .toFile(destPath);
}

module.exports = function (config) {
  config.addShortcode("favicon", function (faviconFile) {
    count++;
    console.log(count);
    sharp(faviconFile)
      .metadata()
      .then((metadata) => {
        generateIcoFavicon(metadata, faviconFile, "./_site/favicon.ico");
        generatePngFavicon(
          metadata,
          faviconFile,
          "./_site/apple-touch-icon.png"
        );
      });

    return `
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
    `;
  });
};
