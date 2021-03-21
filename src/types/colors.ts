export type HSL_String = "hue" | "saturation" | "lightness";
export type HSL = [number, number, number];
export type RGB = [number, number, number];
export type HEX = string;
export type HEX_Palette = HEX[];
export type RGB_Palette = RGB[];
export type HSL_Palette = HSL[];
export type Formats = HSL | RGB | HEX;
export type FormatStrings = "hsl" | "rgb" | "hex";
export type Palette = Array<Formats>;
