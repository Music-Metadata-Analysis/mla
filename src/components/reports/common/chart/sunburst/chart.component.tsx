import { Box, Center } from "@chakra-ui/react";
import SunBurstChartSVGContainer from "@src/components/reports/common/chart/sunburst/svg/svg.container";
import settings from "@src/config/sunburst";
import useColour from "@src/hooks/ui/colour.hook";
import type {
  d3Node,
  SunBurstData,
} from "@src/types/reports/generics/sunburst.types";

export interface SunBurstChartProps {
  breakPoints: Array<number>;
  data: SunBurstData;
  leafEntity: SunBurstData["entity"];
  finishTransition: () => void;
  selectedNode: d3Node;
  setSelectedNode: (node: d3Node) => void;
}

export default function SunBurstChart({
  breakPoints,
  data,
  leafEntity,
  selectedNode,
  setSelectedNode,
  finishTransition,
}: SunBurstChartProps) {
  const {
    componentColour,
    sunBurstColour,
    utilities: { colourToCSS },
  } = useColour();

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
        <SunBurstChartSVGContainer
          colourSet={{ foreground: colourToCSS(sunBurstColour.foreground) }}
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
