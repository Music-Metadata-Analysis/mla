import { Flex, Box, Stat, StatLabel, StatHelpText } from "@chakra-ui/react";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import useColour from "@src/hooks/colour";
import type SunBurstNodeEncapsulation from "../encapsulations/sunburst.node.encapsulation.base";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { d3Node } from "@src/types/reports/sunburst.types";

export const testIDs = {
  SunBurstControlPanelName: "SunBurstControlPanelName",
  SunBurstControlPanelParentName: "SunBurstControlPanelParentName",
  SunBurstControlPanelValue: "SunBurstControlPanelValue",
  SunBurstControlPanelBack: "SunBurstControlPanelBack",
  SunBurstControlPanelSelect: "SunBurstControlPanelSelect",
};

export interface SunBurstControlPanelProps {
  setSelectedNode: (node: d3Node) => void;
  isOpen: boolean;
  openDrawer: () => void;
  breakPoints: Array<number>;
  lastFMt: tFunctionType;
  node: SunBurstNodeEncapsulation;
}

export default function SunBurstControlPanel({
  breakPoints,
  isOpen,
  node,
  openDrawer,
  setSelectedNode,
  lastFMt,
}: SunBurstControlPanelProps) {
  const { componentColour } = useColour();
  const parentName = node.getParentName();

  const getControlButtonLabel = () => {
    if (node.hasLeafChildren())
      return lastFMt("playCountByArtist.panel.leafNodeControl");
    return lastFMt("playCountByArtist.panel.control");
  };

  const truncateStyle = {
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const Display = (
    <Box ml={2} mr={2} mt={1} mb={2}>
      <Flex>
        <Stat>
          <StatLabel
            data-testid={testIDs.SunBurstControlPanelName}
            w={breakPoints.map((breakPoint) => breakPoint - 90)}
            style={truncateStyle}
          >
            {node.getNodeName()}
          </StatLabel>
          <StatHelpText w={breakPoints.map((breakPoint) => breakPoint - 90)}>
            <Flex>
              {parentName ? "(" : "\u00a0"}
              <Box
                data-testid={testIDs.SunBurstControlPanelParentName}
                style={truncateStyle}
              >
                {parentName}
              </Box>
              {parentName ? ")" : "\u00a0"}
            </Flex>
          </StatHelpText>
        </Stat>
      </Flex>
      <Box data-testid={testIDs.SunBurstControlPanelValue}>
        {`${lastFMt("playCountByArtist.panel.value")}: `}
        <strong>{node.getValue()}</strong>
      </Box>
    </Box>
  );

  return (
    <Box
      borderWidth={2}
      borderColor={componentColour.border}
      bg={componentColour.background}
      color={componentColour.foreground}
      w={breakPoints}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        {Display}
        <Flex flexDirection={"column"}>
          <ButtonWithoutAnalytics
            data-testid={testIDs.SunBurstControlPanelBack}
            ml={2}
            mr={2}
            mt={2}
            mb={2}
            size={"xs"}
            onClick={() => setSelectedNode(node.getParent() as d3Node)}
            width={50}
            disabled={!node.getParent() || isOpen}
          >
            {"\u25B2"}
          </ButtonWithoutAnalytics>
          <ButtonWithoutAnalytics
            data-testid={testIDs.SunBurstControlPanelSelect}
            ml={2}
            mr={2}
            mt={2}
            mb={2}
            size={"xs"}
            onClick={openDrawer}
            width={50}
            disabled={isOpen}
          >
            {getControlButtonLabel()}
          </ButtonWithoutAnalytics>
        </Flex>
      </Flex>
    </Box>
  );
}
