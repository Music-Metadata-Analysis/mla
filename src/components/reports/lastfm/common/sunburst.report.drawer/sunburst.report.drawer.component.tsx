import { Divider, Flex } from "@chakra-ui/react";
import { useRef } from "react";
import SunBurstNodeList from "./nodes/node.list.component";
import SunBurstDrawerControl from "./panels/drawer.control.panel.component";
import SunBurstDrawerTitle from "./panels/drawer.title.panel.component";
import useColour from "../../../../../hooks/colour";
import Drawer from "../../../common/drawer/drawer.component";
import type { d3Node } from "../../../../../types/reports/sunburst.types";
import type SunBurstNodeEncapsulation from "../sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type { TFunction } from "next-i18next";

export interface LastFMSunBurstDrawerInterface {
  alignment: "left" | "right";
  isOpen: boolean;
  lastFMt: TFunction;
  node: SunBurstNodeEncapsulation;
  onClose: () => void;
  sunBurstT: TFunction;
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
