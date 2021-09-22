import { Box, Container, Text } from "@chakra-ui/react";
import useColour from "../../../../hooks/colour";

interface ReportTitleProps {
  title: string;
  userName: string | null;
  size: number;
}

const ReportTitle = ({ size, title, userName }: ReportTitleProps) => {
  const { componentColour, transparent } = useColour();
  const maxWidth = 4 * size + 20;

  if (!userName) return null;

  return (
    <Box
      ml={"5px"}
      mr={"5px"}
      mt={"45px"}
      mb={"5px"}
      color={componentColour.foreground}
      p={3}
      bg={componentColour.background}
      w={"100%"}
    >
      <Container
        centerContent={true}
        maxW={`${maxWidth}px`}
        textAlign={"center"}
        sx={{
          caretColor: transparent,
        }}
      >
        <Text fontSize={["xl", "2xl", "3xl"]}>{userName}</Text>
        <Text fontSize={["l", "xl", "2xl"]}>{title}</Text>
      </Container>
    </Box>
  );
};

export default ReportTitle;
