import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";
import type SunBurstBaseNodeEncapsulation from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";

export interface LastFMSunBurstDrawerInterface {
  alignment: "left" | "right";
  isOpen: boolean;
  node: SunBurstBaseNodeEncapsulation;
  onClose: () => void;
  setSelectedNode: (node: d3Node) => void;
  svgTransition: boolean;
}

export interface SunBurstDrawerNodeComponentProps {
  node: SunBurstNodeAbstractBase;
  index: number;
  selectChildNode: (node: SunBurstNodeAbstractBase) => void;
}
