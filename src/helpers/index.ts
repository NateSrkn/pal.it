import { Pixels } from "../types/image";
import { ICreateElement, IUpdateElement } from "../types/general";

export const createElement = (
  options: ICreateElement = { attributes: {}, children: [] }
): HTMLElement => {
  const { el = "div", attributes, children } = options;
  const element: HTMLElement = Object.assign(
    document.createElement(el),
    attributes
  );
  if (children?.length) {
    for (let i = 0, { length } = children; i < length; i++) {
      const child: ICreateElement | HTMLElement = children[i];
      if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else {
        element.appendChild(createElement({ ...child }));
      }
    }
  }
  return element;
};

export const updateElement = (options: IUpdateElement): HTMLElement => {
  const { el, attributes = {}, children = [] } = options;
  const element: HTMLElement = Object.assign(el, attributes);
  if (children.length) {
    for (let i = 0, { length } = children; i < length; i++) {
      const child: ICreateElement | HTMLElement = children[i];
      if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else {
        element.appendChild(createElement({ ...child }));
      }
    }
  }
  return element;
};

export const domtool = {
  create: createElement,
  update: updateElement,
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
