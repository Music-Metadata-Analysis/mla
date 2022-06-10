import { Text, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SunBurstNodeButton from "./node.button.component";
import SunBurstNodeDisplay from "./node.display.component";
import VerticalScrollBar from "../../../../../scrollbar/vertical.scrollbar.component";
import type SunBurstNodeEncapsulation from "../../sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type { RefObject } from "react";

export const testIDs = {
  SunBurstEntityNodeListTitle: "SunBurstEntityNodeListTitle",
  SunBurstEntityNodeList: "SunBurstEntityNodeList",
};

export interface SunBurstEntityNodeListProps {
  node: SunBurstNodeEncapsulation;
  scrollRef: RefObject<HTMLDivElement>;
  selectChildNode: (node: SunBurstNodeEncapsulation) => void;
  svgTransition: boolean;
}

export default function SunBurstEntityNodeList({
  node,
  scrollRef,
  selectChildNode,
  svgTransition,
}: SunBurstEntityNodeListProps) {
  const { t: lastFMt } = useTranslation("lastfm");
  const { t: sunBurstT } = useTranslation("sunburst");

  if (svgTransition) return null;

  let EntityComponent: typeof SunBurstNodeButton | typeof SunBurstNodeDisplay =
    SunBurstNodeButton;

  const listTitle = node.getDrawerListTitle(sunBurstT);

  if (node.hasLeafChildren()) {
    EntityComponent = SunBurstNodeDisplay;
  }

  return (
    <>
      <Text
        data-testid={testIDs.SunBurstEntityNodeListTitle}
        mb={"10px"}
        fontSize="sm"
      >
        {listTitle || lastFMt("playCountByArtist.drawer.noInformation")}
      </Text>

      <div
        id={"SunburstDrawerEntityListScrollArea"}
        ref={scrollRef}
        className={"scrollbar"}
      >
        <VerticalScrollBar
          scrollRef={scrollRef}
          update={node.getNodeName()}
          horizontalOffset={10}
          verticalOffset={0}
          zIndex={5000}
        />
        <Flex
          data-testid={testIDs.SunBurstEntityNodeList}
          flexDirection={"column"}
        >
          {node.getChildren().map((child, index) => (
            <EntityComponent
              key={index}
              index={index}
              node={child}
              selectChildNode={selectChildNode}
            />
          ))}
        </Flex>
      </div>
    </>
  );
}
