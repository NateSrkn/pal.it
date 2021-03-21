import { HEX, HSL, RGB } from "../types/colors";

const parseColor = (hexCode: string, chunk: [number, number]): number =>
  parseInt(hexCode.slice(...chunk), 16);

const hexToRGB = (hexCode: string): RGB => [
  parseColor(hexCode, [1, 3]),
  parseColor(hexCode, [4, 5]),
  parseColor(hexCode, [6, 7]),
];

export const rgbToHex = ([red, green, blue]: RGB): HEX =>
  `#${((1 << 24) + (red << 16) + (green << 8) + blue)
    .toString(16)
    .slice(1, 7)}`;

export const invertHex = (hexCode: string, isBlackWhite = false): string => {
  if (isBlackWhite) {
    let [red, green, blue]: Array<string | number> = hexToRGB(hexCode);
    return red * 0.299 + green * 0.587 + blue * 0.114 > 186
      ? `#000000`
      : `#FFFFFF`;
  }

  let color: number | string = hexCode;
  color = color.substring(1); // remove #
  color = parseInt(color, 16); // convert to integer
  color = 0xffffff ^ color; // invert three bytes
  color = color.toString(16); // convert to hex
  color = ("000000" + color).slice(-6); // pad with leading zeros
  color = "#" + color; // prepend #
  return color;
};

export const rgbToHSL = ([red, green, blue]: RGB): HSL => {
  red /= 255;
  green /= 255;
  blue /= 255;

  const min = Math.min(red, green, blue);
  const max = Math.max(red, green, blue);

  let [hue, saturation, lightness] = [0, 0, (max + min) / 2];

  if (max === min) {
    hue = saturation = 0;
  } else {
    const delta = max - min;
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case red: {
        hue = ((green - blue) / delta + 0) * 60;
        break;
      }
      case green: {
        hue = ((blue - red) / delta + 2) * 60;
        break;
      }
      case blue: {
        hue = ((red - green) / delta + 4) * 60;
        break;
      }
      default: {
        break;
      }
    }
  }

  return [
    Math.round(hue),
    Math.round(saturation * 100),
    Math.round(lightness * 100),
  ];
};

export const hexSort = (hex1: string, hex2: string): 0 | 1 | -1 => {
  const [r1, g1, b1] = hexToRGB(hex1);
  const [r2, g2, b2] = hexToRGB(hex2);

  let red = 255 - Math.abs(r1 - r2);
  let green = 255 - Math.abs(g1 - g2);
  let blue = 255 - Math.abs(b1 - b2);
  red /= 255;
  green /= 255;
  blue /= 255;
  const simCode = Math.round((red + green + blue) / 3);
  if (simCode > 1) {
    return 0;
  }
  return 1;
};

export const hslToHex = ([hue, saturation, lightness]: HSL): HEX => {
  lightness /= 100;
  const alpha = (saturation * Math.min(lightness, 1 - lightness)) / 100;
  const convert = (num: number) => {
    const k = (num + hue / 30) % 12;
    const color = lightness - alpha * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${convert(0)}${convert(8)}${convert(4)}`;
};

const toolkit = {
  rgbToHex,
  rgbToHSL,
  hslToHex,
  invertHex,
};

export default toolkit;
