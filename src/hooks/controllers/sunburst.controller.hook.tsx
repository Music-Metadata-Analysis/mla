import { useState } from "react";
import nullNode from "@src/providers/user/reports/sunburst.node.initial";
import useToggle from "@src/utilities/react/hooks/toggle.hook";
import useNavBarLayoutController from "@src/web/navigation/navbar/state/controllers/navbar.controller.hook";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";

const useSunBurstController = () => {
  const navbar = useNavBarLayoutController();
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
