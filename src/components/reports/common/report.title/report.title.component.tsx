import { Box, Container, Text } from "@chakra-ui/react";
import useColour from "@src/hooks/ui/colour.hook";

interface ReportTitleProps {
  title: string;
  userName: string;
  size: number;
}

const ReportTitle = ({ size, title, userName }: ReportTitleProps) => {
  const { componentColour, transparent } = useColour();
  const maxWidth = 4 * size + 20;

  return (
    <Box
      bg={componentColour.background}
      color={componentColour.foreground}
      mb={"5px"}
      ml={"5px"}
      mr={"5px"}
      mt={"45px"}
      p={3}
      w={"100%"}
    >
      <Container
        centerContent={true}
        maxW={`${maxWidth}px`}
        sx={{
          caretColor: transparent,
        }}
        textAlign={"center"}
      >
        <Text fontSize={["xl", "2xl", "3xl"]}>{userName}</Text>
        <Text fontSize={["l", "xl", "2xl"]}>{title}</Text>
      </Container>
    </Box>
  );
};

export default ReportTitle;
