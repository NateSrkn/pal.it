import { quantize } from "./tools/quantize/index";
import { extractColorArray } from "./helpers";
import { rgbToHex, rgbToHSL, invertHex } from "./helpers/colors";
import { Image, ImageClass, ImageSource, Options } from "./types/image";
import {
  Palette,
  FormatStrings,
  Formats,
  HSL_String,
  RGB,
  HEX_Palette,
  HSL_Palette,
  RGB_Palette,
} from "./types/colors";

class PalIt {
  public src: ImageSource;
  public options: Options;
  public image: Promise<Image>;
  public palette: Promise<RGB[]>;
  static ImageClass: ImageClass;
  constructor(src: ImageSource, options?: Partial<Options>) {
    this.src = src;
    this.options = {
      quality: 10,
      paletteSize: 5,
      ImageClass: PalIt.ImageClass,
      ...options,
    };
    this._init();
  }
  private _init() {
    if (this.options.quality <= 0) {
      this.options.quality = 1;
    }
    if (this.options.paletteSize <= 2) {
      this.options.paletteSize = 3;
    }
    this._getImage();
  }
  private async _getImage() {
    if (!this.image) {
      this.image = await new this.options.ImageClass()
        .loadImage(this.src)
        .then((res) => res)
        .catch((err) => err);
    }
    return this.image;
  }
  private async _getPalette(): Promise<RGB[]> {
    if (!this.palette) {
      const image = await this._getImage();
      this.palette = image.getImageData().then(({ data, width, height }) => {
        const colors = extractColorArray(
          data,
          width * height,
          this.options.quality
        );
        const palette = quantize(colors, this.options.paletteSize).palette();
        return palette;
      });
    }
    return this.palette;
  }
  async getDominantColor(format: FormatStrings): Promise<Formats> {
    const { data } = await this._getImage().then((image) =>
      image.getImageData()
    );
    const [dominant] = extractColorArray(data, 5, this.options.quality);
    switch (format) {
      case "hex": {
        return rgbToHex(dominant);
      }
      case "hsl": {
        return rgbToHSL(dominant);
      }
      case "rgb": {
        return dominant;
      }
      default: {
        return dominant;
      }
    }
  }
  async getRGBPalette(): Promise<RGB_Palette> {
    return await this._getPalette();
  }
  async getHSLPalette(): Promise<HSL_Palette> {
    return await this._getPalette().then((palette) => palette.map(rgbToHSL));
  }
  async getHexPalette(): Promise<HEX_Palette> {
    return await this._getPalette().then((palette) => palette.map(rgbToHex));
  }
  async sortBy(
    options: {
      format?: HSL_String;
      order?: "asc" | "desc";
      returnFormat?: FormatStrings;
    } = {
      format: "lightness",
      order: "desc",
      returnFormat: "rgb",
    }
  ): Promise<Palette> {
    const hsl = await this.getHSLPalette();
    const palette = await this._getPalette().then((res) =>
      res.map((val, index) => ({ val, index }))
    );
    const index = {
      hue: 0,
      saturation: 1,
      lightness: 2,
    };
    const key = index[options.format || "lightness"];
    return palette
      .sort(({ index: aIndex }, { index: bIndex }) => {
        return options.order !== "asc"
          ? hsl[bIndex][key] - hsl[aIndex][key]
          : hsl[aIndex][key] - hsl[bIndex][key];
      })
      .map(({ val }) => {
        switch (options.returnFormat) {
          case "hex": {
            return rgbToHex(val);
          }
          case "rgb": {
            return val;
          }
          case "hsl": {
            return rgbToHSL(val);
          }
          default: {
            return val;
          }
        }
      });
  }
  invertPalette(palette: HEX_Palette): HEX_Palette {
    return palette.map((color: string) => invertHex(color));
  }
}

export default PalIt;
