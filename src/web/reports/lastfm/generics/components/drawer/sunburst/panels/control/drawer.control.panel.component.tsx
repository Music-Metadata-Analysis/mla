import { Flex, Text } from "@chakra-ui/react";
import { testIDs } from "./drawer.control.panel.identifiers";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";

export interface SunBurstDrawerControlPanelProps {
  node: SunBurstNodeAbstractBase;
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
