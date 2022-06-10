import { Box, Center, Container } from "@chakra-ui/react";
import settings from "../../../../../../config/sunburst";
import useColour from "../../../../../../hooks/colour";

export const testIDs = {
  SunBurstNotVisiblePanelMessage: "SunBurstInfoPanelMessage",
};

export interface SunBurstNotVisiblePanelProps {
  breakPoints: Array<number>;
  message: string;
}

export default function SunBurstNotVisiblePanel({
  breakPoints,
  message,
}: SunBurstNotVisiblePanelProps) {
  const { componentColour } = useColour();

  return (
    <Center height={`calc(100vh - ${settings.navbarOffset}px)`}>
      <Box
        mt={`${settings.navbarOffset}px`}
        ml={1}
        mr={1}
        borderWidth={2}
        borderColor={componentColour.border}
        bg={componentColour.background}
        color={componentColour.foreground}
        w={breakPoints}
      >
        <Container
          p={1}
          textAlign={"center"}
          data-testid={testIDs.SunBurstNotVisiblePanelMessage}
        >
          {message}
        </Container>
      </Box>
    </Center>
  );
}
