import { Text, Container } from "@chakra-ui/react";
import useLocale from "@src/hooks/locale";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";

export const testIDs = {
  LastFMSunBurstDrawerTitle: "LastFMSunBurstDrawerTitle",
  LastFMSunBurstDrawerSubTitle: "LastFMSunBurstDrawerSubTitle",
};

export interface SunBurstDrawerTitlePanelProps {
  node: SunBurstNodeEncapsulation;
}

export default function SunBurstDrawerTitlePanel({
  node,
}: SunBurstDrawerTitlePanelProps) {
  const { t: sunBurstT } = useLocale("sunburst");

  const title = node.getDrawerTitle();
  const subTitle = node.getDrawerSubTitle(sunBurstT);

  return (
    <Container m={0} p={0} w={"80%"} overflowWrap={"anywhere"}>
      <Text data-testid={testIDs.LastFMSunBurstDrawerTitle} fontSize="md">
        {title}
      </Text>
      <Text data-testid={testIDs.LastFMSunBurstDrawerSubTitle} fontSize="sm">
        {subTitle ? `(${subTitle})` : "\u00A0"}
      </Text>
    </Container>
  );
}
