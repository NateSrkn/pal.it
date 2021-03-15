import { BaseImage } from "./tools/image/base";

export type ImageSource = string | HTMLImageElement | Buffer;

export interface Image {
  loadImage(src: ImageSource): Promise<Image>;
  getImageData(): Promise<ImageData>;
}

export interface ImageClass {
  new (): Image;
}

export interface Options {
  quality: number;
  paletteSize: number;
  ImageClass: ImageClass;
}
export type Pixels = Uint8ClampedArray | Buffer | Uint8Array;

export interface ImageData {
  data: Pixels | any;
  width: number;
  height: number;
}
