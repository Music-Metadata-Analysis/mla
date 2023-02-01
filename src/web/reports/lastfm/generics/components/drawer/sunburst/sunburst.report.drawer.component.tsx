import { Divider, Flex } from "@chakra-ui/react";
import SunBurstNodeListContainer from "./nodes/node.list/node.list.container";
import SunBurstDrawerControlContainer from "./panels/control/drawer.control.panel.container";
import SunBurstDrawerTitleContainer from "./panels/title/drawer.title.panel.container";
import { testIDs } from "./sunburst.report.drawer.identifiers";
import useColour from "@src/hooks/ui/colour.hook";
import ReportDrawer from "@src/web/reports/generics/components/drawer/drawer.component";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { RefObject } from "react";

export interface LastFMSunBurstDrawerProps {
  alignment: "left" | "right";
  isOpen: boolean;
  node: SunBurstNodeAbstractBase;
  nodeListScrollRef: RefObject<HTMLDivElement>;
  onClose: () => void;

  selectChildNode: (targetNode: SunBurstNodeAbstractBase) => void;
  selectParentNode: () => void;
  svgTransition: boolean;
}

export default function LastFMSunBurstDrawer({
  alignment,
  isOpen,
  node,
  nodeListScrollRef,
  onClose,
  selectChildNode,
  selectParentNode,
  svgTransition,
}: LastFMSunBurstDrawerProps) {
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
