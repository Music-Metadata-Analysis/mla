import { Text, Container, Center, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Condition from "@src/components/condition/condition.component";
import { settings } from "@src/config/billboard";
import useColour from "@src/hooks/colour";
import useNavBarLayoutController from "@src/hooks/controllers/navbar.controller.hook";

interface BillboardProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

const Billboard = ({ children, title }: BillboardProps) => {
  const { componentColour, transparent } = useColour();
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const { navigation } = useNavBarLayoutController();

  const getNavBarOffset = () => {
    if (navigation.state) return 16;
    return 0;
  };

  const shouldDisplayTitle = () => {
    const shouldDisplay = window.innerHeight >= settings.minimumTitleHeight;
    setShowTitle(shouldDisplay);
  };

  useEffect(() => {
    shouldDisplayTitle();
    window.addEventListener("resize", shouldDisplayTitle);
    return () => {
      window.removeEventListener("resize", shouldDisplayTitle);
      setShowTitle(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Center height={"calc(100vh)"}>
      <Box
        color={componentColour.foreground}
        bg={componentColour.background}
        mt={getNavBarOffset()}
        p={3}
        pb={showTitle ? 5 : 3}
        w={["90%", "80%", "70%"]}
      >
        <Condition isTrue={showTitle}>
          <Container
            sx={{
              caretColor: transparent,
            }}
            centerContent={true}
            maxW={"medium"}
            textAlign={"center"}
            mb={3}
          >
            <Text fontSize={["xl", "2xl", "3xl"]}>{title}</Text>
          </Container>
        </Condition>
        {children}
      </Box>
    </Center>
  );
};

export default Billboard;
