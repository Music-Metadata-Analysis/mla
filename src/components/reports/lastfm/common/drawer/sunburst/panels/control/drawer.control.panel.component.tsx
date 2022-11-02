import { Flex, Text } from "@chakra-ui/react";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base";

export const testIDs = {
  LastFMSunBurstDrawerValue: "LastFMSunBurstDrawerValue",
  LastFMSunBurstDrawerPercentage: "LastFMSunBurstDrawerPercentage",
  LastFMSunBurstDrawerBackButton: "LastFMSunBurstDrawerBackButton",
};

export interface SunBurstDrawerControlPanelProps {
  node: SunBurstNodeEncapsulation;
  percentageText: string;
  selectParentNode: () => void;
  valueText: string;
}

export default function SunBurstDrawerControlPanel({
  node,
  percentageText,
  selectParentNode,
  valueText,
}: SunBurstDrawerControlPanelProps) {
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"}>
      <Flex flexDirection={"column"}>
        <Text data-testid={testIDs.LastFMSunBurstDrawerValue} fontSize="xs">
          {valueText + ": "} <strong>{node.getValue()}</strong>
        </Text>
        <Text
          data-testid={testIDs.LastFMSunBurstDrawerPercentage}
          fontSize="xs"
        >
          {"("}
          {node.getDrawerPercentage()}
          {percentageText}
          {")"}
        </Text>
      </Flex>
      <ButtonWithoutAnalytics
        data-testid={testIDs.LastFMSunBurstDrawerBackButton}
        m={2}
        size={"xs"}
        onClick={() => selectParentNode()}
        width={50}
        disabled={!node.getParent()}
      >
        {"\u25B2"}
      </ButtonWithoutAnalytics>
    </Flex>
  );
}
