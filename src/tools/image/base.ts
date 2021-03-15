import { Image, ImageSource, ImageData } from "../../types";

export abstract class BaseImage implements Image {
  abstract loadImage(src: ImageSource): Promise<Image>;
  abstract getImageData(): Promise<ImageData>;
}
