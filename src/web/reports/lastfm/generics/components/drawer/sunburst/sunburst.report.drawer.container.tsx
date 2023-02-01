import { useRef } from "react";
import LastFMSunBurstDrawer from "./sunburst.report.drawer.component";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";
import type SunBurstBaseNodeEncapsulation from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { LastFMSunBurstDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";

export default function LastFMSunBurstDrawerContainer({
  alignment,
  isOpen,
  node,
  onClose,
  setSelectedNode,
  svgTransition,
}: LastFMSunBurstDrawerInterface) {
  const nodeListScrollRef = useRef<HTMLDivElement>(null);

  const selectChildNode = (targetNode: SunBurstBaseNodeEncapsulation) => {
    setSelectedNode(targetNode.getNode());
  };

  const selectParentNode = () => {
    setSelectedNode(node.getParent() as d3Node);
  };

  return (
    <LastFMSunBurstDrawer
      alignment={alignment}
      isOpen={isOpen}
      node={node}
      nodeListScrollRef={nodeListScrollRef}
      onClose={onClose}
      selectChildNode={selectChildNode}
      selectParentNode={selectParentNode}
      svgTransition={svgTransition}
    />
  );
}
