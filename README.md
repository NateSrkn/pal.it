# Pal.it

Pal.it is a simple library to pull a palette of colors from an image. This supports both node and browser environments.

## Installation

```bash
npm install pal-it
```

```bash
yarn add pal-it
```

## Usage

```javascript
import Pal from "pal-it";

const defaultPal = new Pal("../photo.jpeg"); // Supports local files, urls and an HTML img element.
const customPal = new Pal("../photo.jpeg", { paletteSize: 10, quality: 10 }); // Custom paletteSize and search quality can be added

// Returns the dominant color from the photo
defaultPal.getDominantColor();

// These each return their respective palette in the requested format.
defaultPal.getHexPalette();
defaultPal.getRGBPalette();
defaultPal.getHSLPalette();

const sortOptions = {
  format: "lightness", // hue, saturation, lightness - Defaults to lightness
  order: "desc", // desc or asc for the order - Defaults to desc
  returnFormat: "hex", // rgb, hex, hsl - Defaults to hex
};

const sortedPalette = defaultPal.sortBy(sortOptions);
```
