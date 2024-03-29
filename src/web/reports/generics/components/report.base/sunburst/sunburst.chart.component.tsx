import { Box, Center } from "@chakra-ui/react";
import settings from "@src/config/sunburst";
import SunBurstChartSVGContainer from "@src/web/reports/generics/components/report.base/sunburst/svg/svg.container";
import useColour from "@src/web/ui/colours/state/hooks/colour.hook";
import type { SunBurstData } from "@src/contracts/api/types/services/generics/aggregates/generic.sunburst.types";
import type { d3Node } from "@src/web/reports/generics/types/state/charts/sunburst.types";

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
