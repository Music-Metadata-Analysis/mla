import { useState } from "react";
import useNavBarLayoutController from "@src/web/navigation/navbar/state/controllers/navbar.controller.hook";
import nullNode from "@src/web/reports/generics/state/charts/sunburst/null.node";
import useToggle from "@src/web/ui/generics/state/hooks/toggle.hook";
import type { d3Node } from "@src/web/reports/generics/types/state/charts/sunburst.types";

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
