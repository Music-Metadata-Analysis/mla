import { Divider, Flex } from "@chakra-ui/react";
import { useRef } from "react";
import SunBurstNodeList from "./nodes/node.list.component";
import SunBurstDrawerControl from "./panels/drawer.control.panel.component";
import SunBurstDrawerTitle from "./panels/drawer.title.panel.component";
import Drawer from "@src/components/reports/common/drawer/drawer.component";
import useColour from "@src/hooks/colour";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { d3Node } from "@src/types/reports/sunburst.types";

export interface LastFMSunBurstDrawerInterface {
  alignment: "left" | "right";
  isOpen: boolean;
  lastFMt: tFunctionType;
  node: SunBurstNodeEncapsulation;
  onClose: () => void;
  sunBurstT: tFunctionType;
  setSelectedNode: (node: d3Node) => void;
  svgTransition: boolean;
}

export const testIDs = {
  LastFMSunBurstDrawer: "LastFMSunBurstDrawer",
  LastFMSunBurstDrawerBackButton: "LastFMSunBurstDrawerBackButton",
  LastFMSunBurstDrawerEntityList: "LastFMSunBurstDrawerEntityList",
  LastFMSunBurstDrawerListTitle: "LastFMSunBurstDrawerListTitle",
  LastFMSunBurstDrawerPercentage: "LastFMSunBurstDrawerPercentage",
  LastFMSunBurstDrawerSubTitle: "LastFMSunBurstDrawerSubTitle",
  LastFMSunBurstDrawerTitle: "LastFMSunBurstDrawerTitle",
  LastFMSunBurstDrawerValue: "LastFMSunBurstDrawerValue",
};

export default function LastFMSunBurstDrawer({
  alignment,
  isOpen,
  onClose,
  node,
  setSelectedNode,
  svgTransition,
}: LastFMSunBurstDrawerInterface) {
  const { componentColour } = useColour();
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectChildNode = (targetNode: SunBurstNodeEncapsulation) => {
    setSelectedNode(targetNode.getNode());
  };

  const selectParentNode = () => {
    setSelectedNode(node.getParent() as d3Node);
  };

  return (
    <Drawer
      data-testid={testIDs.LastFMSunBurstDrawer}
      isOpen={isOpen}
      onClose={onClose}
      placement={alignment}
      alwaysOpen={true}
    >
      <Flex
        flexDirection={"column"}
        bg={componentColour.background}
        color={componentColour.foreground}
        height={"100%"}
      >
        <SunBurstDrawerTitle node={node} />
        <Divider
          mt={"10px"}
          mb={"10px"}
          orientation="horizontal"
          bg={componentColour.details}
        />
        <SunBurstDrawerControl
          node={node}
          selectParentNode={selectParentNode}
        />
        <Divider
          mt={"10px"}
          mb={"10px"}
          orientation="horizontal"
          bg={componentColour.details}
        />
        <SunBurstNodeList
          node={node}
          scrollRef={scrollRef}
          selectChildNode={selectChildNode}
          svgTransition={svgTransition}
        />
      </Flex>
    </Drawer>
  );
}
