import { Box, Center } from "@chakra-ui/react";
import settings from "@src/config/sunburst";
import useColour from "@src/hooks/ui/colour.hook";
import SunBurstChartSVGContainer from "@src/web/reports/generics/components/charts/sunburst/svg/svg.container";
import type {
  d3Node,
  SunBurstData,
} from "@src/web/reports/generics/types/charts/sunburst.types";

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
