import type { SunBurstData } from "@src/contracts/api/types/services/generics/aggregates/generic.sunburst.types";
import type RGBA from "@src/utilities/colours/rgba.class";

export interface d3Node extends d3.HierarchyRectangularNode<SunBurstData> {
  current: d3Node;
  target: d3Node;
  colour: RGBA;
}
