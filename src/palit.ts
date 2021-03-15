import { quantize } from "./tools/quantize/index";
import { extractColorArray, rgbToHex } from "./helpers";
import { ImageClass, ImageSource, Options } from "./types";

class PalIt {
  public src: ImageSource;
  public options: Options;
  static ImageClass: ImageClass;
  constructor(src: ImageSource, options?: Partial<Options>) {
    this.src = src;
    this.options = {
      quality: 10,
      paletteSize: 5,
      ImageClass: PalIt.ImageClass,
      ...options,
    };
  }
  async getPalette(): Promise<string[]> {
    const image = new this.options.ImageClass();
    return image
      .loadImage(this.src)
      .then((img) => img.getImageData())
      .then(({ data, width, height }) => {
        const colors = extractColorArray(
          data,
          width * height,
          this.options.quality
        );
        return quantize(colors, this.options.paletteSize)
          .palette()
          .map(rgbToHex);
      });
  }
}

export default PalIt;
