import { useState } from "react";
import nullNode from "../providers/user/reports/sunburst.node.initial";
import type { d3Node } from "../types/reports/sunburst.types";

const useSunBurstState = () => {
  const [selectedNode, setSelectedNode] = useState<d3Node>(nullNode as d3Node);
  const [svgTransition, setSvgTransition] = useState<boolean>(false);

  return {
    setters: {
      setSelectedNode,
      setSvgTransition,
    },
    getters: {
      selectedNode,
      svgTransition,
    },
  };
};

export default useSunBurstState;