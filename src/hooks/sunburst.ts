import { useState } from "react";
import useNavBar from "./navbar";
import useToggle from "./utility/toggle";
import nullNode from "@src/providers/user/reports/sunburst.node.initial";
import type { d3Node } from "@src/types/reports/sunburst.types";

const useSunBurstController = () => {
  const navbar = useNavBar();
  const [selectedNode, setSelectedNode] = useState<d3Node>(nullNode as d3Node);
  const [svgTransitioning, setSvgTransitioning] = useState<boolean>(false);
  const drawer = useToggle(false);

  const closeDrawer = () => {
    navbar.hamburger.setTrue();
    drawer.setFalse();
  };

  const openDrawer = () => {
    navbar.hamburger.setFalse();
    drawer.setTrue();
  };

  const selectNode = (node: d3Node) => {
    setSvgTransitioning(true);
    setSelectedNode(node);
  };

  return {
    drawer: {
      setFalse: closeDrawer,
      setTrue: openDrawer,
      state: drawer.state,
    },
    node: {
      selected: selectedNode,
      setSelected: selectNode,
    },
    svg: {
      isTransitioning: svgTransitioning,
      setTransitioning: setSvgTransitioning,
    },
  };
};

export default useSunBurstController;

export type SunBurstControllerHookType = ReturnType<
  typeof useSunBurstController
>;
