import { Divider, Flex } from "@chakra-ui/react";
import SunBurstNodeListContainer from "./nodes/node.list/node.list.container";
import SunBurstDrawerControlContainer from "./panels/control/drawer.control.panel.container";
import SunBurstDrawerTitleContainer from "./panels/title/drawer.title.panel.container";
import ReportDrawer from "@src/components/reports/common/drawer/drawer.component";
import useColour from "@src/hooks/colour";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base";
import type { RefObject } from "react";

export interface LastFMSunBurstDrawerInterface {
  alignment: "left" | "right";
  isOpen: boolean;
  node: SunBurstNodeEncapsulation;
  nodeListScrollRef: RefObject<HTMLDivElement>;
  onClose: () => void;

  selectChildNode: (targetNode: SunBurstNodeEncapsulation) => void;
  selectParentNode: () => void;
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
  node,
  nodeListScrollRef,
  onClose,
  selectChildNode,
  selectParentNode,
  svgTransition,
}: LastFMSunBurstDrawerInterface) {
  const { componentColour } = useColour();

  return (
    <ReportDrawer
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
        <SunBurstDrawerTitleContainer node={node} />
        <Divider
          mt={"10px"}
          mb={"10px"}
          orientation="horizontal"
          borderColor={componentColour.foreground}
        />
        <SunBurstDrawerControlContainer
          node={node}
          selectParentNode={selectParentNode}
        />
        <Divider
          mt={"10px"}
          mb={"10px"}
          orientation="horizontal"
          borderColor={componentColour.foreground}
        />
        <SunBurstNodeListContainer
          node={node}
          scrollRef={nodeListScrollRef}
          selectChildNode={selectChildNode}
          svgTransition={svgTransition}
        />
      </Flex>
    </ReportDrawer>
  );
}
