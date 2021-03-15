import { BaseImage } from "./base";
import { ImageSource, ImageData } from "../../types";
import { createElement } from "../../helpers/index";

export class BrowserImage extends BaseImage {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  height: number;
  width: number;
  async loadImage(src: ImageSource) {
    const image = <HTMLImageElement>createElement({
      el: "img",
      attributes: { src, crossOrigin: "anonymous" },
    });
    this.image = image;
    return new Promise<BaseImage>((res, rej) => {
      const onImageLoad = () => {
        this.initializeCanvas();
        res(this);
      };
      if (image!.complete) {
        onImageLoad();
      } else {
        image!.onload = onImageLoad;
        image!.onerror = (error) => rej(new Error(`Failed to load ${src}`));
      }
    });
  }
  async initializeCanvas() {
    const image = this.image;
    const { height, width } = image;
    const canvas = <HTMLCanvasElement>createElement({
      el: "canvas",
      attributes: { height, width },
    });

    const ctx = canvas.getContext("2d", { alpha: false })!;
    ctx?.drawImage(image, 0, 0);
    this.canvas = canvas;
    this.context = ctx;
    this.height = height;
    this.width = width;
  }
  async getImageData(): Promise<ImageData> {
    return this.context.getImageData(0, 0, this.height, this.width);
  }
}
