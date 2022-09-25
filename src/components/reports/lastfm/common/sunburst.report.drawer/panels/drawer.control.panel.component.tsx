import { Flex, Text } from "@chakra-ui/react";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import useLocale from "@src/hooks/locale";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";

export const testIDs = {
  LastFMSunBurstDrawerValue: "LastFMSunBurstDrawerValue",
  LastFMSunBurstDrawerPercentage: "LastFMSunBurstDrawerPercentage",
  LastFMSunBurstDrawerBackButton: "LastFMSunBurstDrawerBackButton",
};

export interface SunBurstDrawerControlPanelProps {
  node: SunBurstNodeEncapsulation;
  selectParentNode: () => void;
}

export default function SunBurstDrawerControlPanel({
  node,
  selectParentNode,
}: SunBurstDrawerControlPanelProps) {
  const { t: lastFMt } = useLocale("lastfm");

  return (
    <Flex alignItems={"center"} justifyContent={"space-between"}>
      <Flex flexDirection={"column"}>
        <Text data-testid={testIDs.LastFMSunBurstDrawerValue} fontSize="xs">
          {`${lastFMt("playCountByArtist.drawer.value")}: `}
          <strong>{node.getValue()}</strong>
        </Text>
        <Text
          data-testid={testIDs.LastFMSunBurstDrawerPercentage}
          fontSize="xs"
        >
          {"("}
          {node.getDrawerPercentage()}
          {lastFMt("playCountByArtist.drawer.percentage")}
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
