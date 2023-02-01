import { Box, Center, Container } from "@chakra-ui/react";
import { testIDs } from "./error.panel.identifiers";
import settings from "@src/config/sunburst";
import useColour from "@src/hooks/ui/colour.hook";

export interface SunBurstErrorPanelProps {
  breakPoints: Array<number>;
  message: string;
}

export default function SunBurstErrorPanel({
  breakPoints,
  message,
}: SunBurstErrorPanelProps) {
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
          data-testid={testIDs.SunBurstErrorPanel}
        >
          {message}
        </Container>
      </Box>
    </Center>
  );
}
