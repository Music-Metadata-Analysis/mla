import type SunBurstBaseNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";

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
