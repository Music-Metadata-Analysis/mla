import { Text, Container } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type SunBurstNodeEncapsulation from "../../sunburst.report/encapsulations/sunburst.node.encapsulation.base";

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
  const { t: sunBurstT } = useTranslation("sunburst");

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
