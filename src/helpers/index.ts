import { Pixels } from "../types";

interface IElement {
  el: string;
  attributes?: {
    id?: string | null;
    className?: string | null;
    [key: string]: any;
  };
  children?: Array<IElement | HTMLElement>;
}

export const createElement = ({
  el = "div",
  attributes = { id: null, className: null },
  children = [],
}: IElement): HTMLElement => {
  const element: HTMLElement = Object.assign(
    document.createElement(el),
    attributes
  );
  if (children.length) {
    for (let i = 0, { length } = children; i < length; i++) {
      const child: IElement | HTMLElement = children[i];
      if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else {
        element.appendChild(createElement({ ...child }));
      }
    }
  }
  return element;
};

export const rgbToHex = (rgb = [0, 0, 0]): string => {
  const [red, green, blue] = rgb;
  return `#${((1 << 24) + (red << 16) + (green << 8) + blue)
    .toString(16)
    .slice(1, 7)}`;
};

export const extractColorArray = (
  pixels: Pixels,
  count: number,
  quality = 10
): any[] => {
  const colors = [];
  for (let i = 0; i < count; i += quality * 4) {
    const [red, green, blue, alpha] = [
      pixels[i],
      pixels[i + 1],
      pixels[i + 2],
      pixels[i + 3],
    ];
    if (!alpha || alpha >= 125) {
      if (!(red > 250 && green > 250 && blue > 250)) {
        colors.push([red, green, blue]);
      }
    }
  }

  return colors;
};
