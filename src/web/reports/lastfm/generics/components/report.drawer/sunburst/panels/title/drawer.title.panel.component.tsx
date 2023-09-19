import { Text, Container } from "@chakra-ui/react";
import { testIDs } from "./drawer.title.panel.identifiers";

export interface SunBurstDrawerTitlePanelProps {
  titleText: string;
  subTitleText: string;
}

export default function SunBurstDrawerTitlePanel({
  titleText,
  subTitleText,
}: SunBurstDrawerTitlePanelProps) {
  return (
    <Container m={0} p={0} w={"80%"} overflowWrap={"anywhere"}>
      <Text data-testid={testIDs.LastFMSunBurstDrawerTitle} fontSize="md">
        {titleText}
      </Text>
      <Text data-testid={testIDs.LastFMSunBurstDrawerSubTitle} fontSize="sm">
        {subTitleText}
      </Text>
    </Container>
  );
}
