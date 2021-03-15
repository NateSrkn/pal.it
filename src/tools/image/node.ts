import { BaseImage } from "./base";
import Jimp from "jimp/es";
import { ImageSource, Image } from "../../types";

export class NodeImage extends BaseImage {
  private image: InstanceType<typeof Jimp>;
  async loadImage(src: ImageSource) {
    return <Image>await Jimp.read(<string>src).then((res) => {
      this.image = res;
      return this;
    });
  }
  async getImageData() {
    return { ...this.image.bitmap };
  }
}
