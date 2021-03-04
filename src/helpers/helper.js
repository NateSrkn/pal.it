const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const quantize = require("quantize");

class PaletteBuilder {
  constructor(src) {
    this.src = src;
  }
  async createImageCanvas() {
    return await loadImage(this.src).then((res) => {
      const { naturalHeight: height, naturalWidth: width } = res;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.drawImage(res, 0, 0);
      return { canvas, ctx };
    });
  }
  async getPalette(paletteSize = 5, quality = 10) {
    const { canvas, ctx } = await this.createImageCanvas();
    const { height, width } = canvas;
    const pixels = ctx.getImageData(0, 0, width, height);
    let colors = extractColorArray(pixels, pixels.data.length, quality);
    colors = quantize(colors, paletteSize);
    const palette = colors.palette().map(convertToHex);
    return { palette, canvas, ctx };
  }
  async createImage() {
    const { palette, canvas, ctx } = await this.getPalette();
    const { height, width } = canvas;
    const [x, y] = [height, width].sort((a, b) => b - a);
    const average = x / y;
    ctx.fillStyle = "#FFF";
    const paletteHeight = 75;
    ctx.fillRect(0, height - paletteHeight, width, height);
    palette.forEach((color, index) => {
      const offset = index + 1;
      ctx.beginPath();
      ctx.arc(
        average * 25 * offset,
        height - paletteHeight / 2,
        average * 10,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = color;
      ctx.fill();
    });
    fs.writeFileSync(
      path.join(__dirname, `../public/img/${palette[0]}.png`),
      canvas.toBuffer("image/png")
    );
  }

  async createGradientImage() {
    const { palette, canvas, ctx } = await this.getPalette();
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    palette.forEach((color, index) => {
      const offset = index + 1 / palette.length;
      gradient.addColorStop(offset, color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fs.writeFileSync(
      path.join(__dirname, `../public/img/${palette[0]}-gradient.png`),
      canvas.toBuffer("image/png")
    );
  }
}

const extractColorArray = (pixels, count, quality = 10) => {
  const colors = [];
  for (let i = 0; i < count; i += quality * 4) {
    const [red, green, blue, alpha] = [
      pixels.data[i],
      pixels.data[i + 1],
      pixels.data[i + 2],
      pixels.data[i + 3],
    ];
    if (!alpha || alpha >= 125) {
      if (!(red > 250 && green > 250 && blue > 250)) {
        colors.push([red, green, blue]);
      }
    }
  }

  return colors;
};

const convertToHex = (rgb = [0, 0, 0, 1]) => {
  return `#${rgb
    .map((color) => {
      let hex = color.toString(16);
      if (hex.length === 1) {
        hex = `0${hex}`;
      }
      return hex;
    })
    .join("")}`;
};

module.exports = PaletteBuilder;
