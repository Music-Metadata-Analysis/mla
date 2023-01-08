import { useRef } from "react";
import LastFMSunBurstDrawer from "./sunburst.report.drawer.component";
import type SunBurstBaseNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";
import type { LastFMSunBurstDrawerInterface } from "@src/types/reports/lastfm/components/drawers/sunburst.types";

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
