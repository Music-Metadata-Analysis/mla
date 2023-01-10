import { Flex, Box, Stat, StatLabel, StatHelpText } from "@chakra-ui/react";
import { testIDs } from "./details.panel.identifiers";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export interface SunBurstDetailsPanelProps {
  breakPoints: Array<number>;
  lastFMt: tFunctionType;
  nodeName: string;
  nodeParentName: string | null;
  nodeValue: number;
}

export default function SunBurstDetailsPanel({
  breakPoints,
  lastFMt,
  nodeName,
  nodeParentName,
  nodeValue,
}: SunBurstDetailsPanelProps) {
  const truncateStyle = {
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <Box mb={2} ml={2} mr={2} mt={1}>
      <Flex>
        <Stat>
          <StatLabel
            data-testid={testIDs.SunBurstDetailsPanelName}
            style={truncateStyle}
            w={breakPoints.map((breakPoint) => breakPoint - 90)}
          >
            {nodeName}
          </StatLabel>
          <StatHelpText w={breakPoints.map((breakPoint) => breakPoint - 90)}>
            <Flex>
              {nodeParentName ? "(" : "\u00a0"}
              <Box
                data-testid={testIDs.SunBurstDetailsPanelParentName}
                style={truncateStyle}
              >
                {nodeParentName}
              </Box>
              {nodeParentName ? ")" : "\u00a0"}
            </Flex>
          </StatHelpText>
        </Stat>
      </Flex>
      <Box data-testid={testIDs.SunBurstDetailsPanelValue}>
        {`${lastFMt("playCountByArtist.panel.value")}: `}
        <strong>{nodeValue}</strong>
      </Box>
    </Box>
  );
}
