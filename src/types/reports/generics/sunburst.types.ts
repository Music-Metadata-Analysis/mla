import type RGBA from "@src/utils/colours/rgba.class";

export interface SunBurstData {
  name: string;
  value?: number;
  entity: "albums" | "artists" | "tracks" | "root" | "unknown";
  children?: SunBurstData[];
}

export interface SunBurstData {
  name: string;
  value?: number;
  children?: SunBurstData[];
}
export interface d3Node extends d3.HierarchyRectangularNode<SunBurstData> {
  current: d3Node;
  target: d3Node;
  colour: RGBA;
}
