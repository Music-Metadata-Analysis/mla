import { Box, Center } from "@chakra-ui/react";
import SunBurstChartContainer from "@src/components/reports/common/sunburst/chart.container";
import settings from "@src/config/sunburst";
import useColour from "@src/hooks/colour";
import type { d3Node, SunBurstData } from "@src/types/reports/sunburst.types";

export interface SunBurstChartUIProps {
  breakPoints: Array<number>;
  data: SunBurstData;
  leafEntity: SunBurstData["entity"];
  finishTransition: () => void;
  selectedNode: d3Node;
  setSelectedNode: (node: d3Node) => void;
}

export default function SunBurstChartUI({
  breakPoints,
  data,
  leafEntity,
  selectedNode,
  setSelectedNode,
  finishTransition,
}: SunBurstChartUIProps) {
  const { componentColour } = useColour();

  return (
    <Box
      ml={1}
      mr={1}
      borderWidth={2}
      borderColor={componentColour.border}
      bg={componentColour.background}
      color={componentColour.foreground}
      w={breakPoints}
      height={breakPoints}
    >
      <Center>
        <SunBurstChartContainer
          data={data}
          leafEntity={leafEntity}
          size={settings.sunburstSize}
          setSelectedNode={setSelectedNode}
          selectedNode={selectedNode}
          finishTransition={finishTransition}
        />
      </Center>
    </Box>
  );
}
