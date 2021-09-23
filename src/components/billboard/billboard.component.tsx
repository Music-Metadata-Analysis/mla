import { Text, Container, Center, Box } from "@chakra-ui/react";
import useColour from "../../hooks/colour";

interface BillboardProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

const Billboard = ({ children, title }: BillboardProps) => {
  const { componentColour, transparent } = useColour();

  return (
    <Center height={"calc(100vh)"}>
      <Box
        mt={16}
        p={3}
        color={componentColour.foreground}
        bg={componentColour.background}
        w={["90%", "80%", "70%"]}
      >
        <Container
          sx={{
            caretColor: transparent,
          }}
          centerContent={true}
          maxW={"medium"}
          textAlign={"center"}
        >
          <Text fontSize={["xl", "2xl", "3xl"]}>{title}</Text>
        </Container>
        <br />
        {children}
      </Box>
    </Center>
  );
};

export default Billboard;
