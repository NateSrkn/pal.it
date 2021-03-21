export type Children = Array<ICreateElement | HTMLElement>;
export type HTML_Attributes = {
  id?: string | null;
  className?: string | null;
  style?: string;
  [key: string]: any;
};
export interface ICreateElement {
  el?: string;
  attributes?: HTML_Attributes;
  children?: Children;
}

export interface IUpdateElement {
  el: HTMLElement;
  attributes?: HTML_Attributes;
  children?: Children;
}
