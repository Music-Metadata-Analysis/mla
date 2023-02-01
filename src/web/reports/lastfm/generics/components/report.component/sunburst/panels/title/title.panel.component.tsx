import { Text, Box, Container } from "@chakra-ui/react";
import { testIDs } from "./title.panel.identifiers";
import useColour from "@src/hooks/ui/colour.hook";

export interface SunBurstTitlePanelProps {
  breakPoints: Array<number>;
  title: string;
  userName: string;
}

export default function SunBurstTitlePanel({
  breakPoints,
  title,
  userName,
}: SunBurstTitlePanelProps) {
  const { componentColour, transparent } = useColour();

  return (
    <Box
      color={componentColour.foreground}
      mb={1}
      bg={componentColour.background}
      w={breakPoints}
      borderWidth={1}
      borderColor={componentColour.border}
    >
      <Container
        centerContent={true}
        textAlign={"center"}
        sx={{
          caretColor: transparent,
        }}
      >
        <Text
          data-testid={testIDs.SunBurstTitlePanelUserName}
          fontSize={["xl", "2xl", "3xl"]}
        >
          {userName}
        </Text>
        <Text
          data-testid={testIDs.SunBurstTitlePanelTitle}
          fontSize={["l", "xl", "2xl"]}
        >
          {title}
        </Text>
      </Container>
    </Box>
  );
}
