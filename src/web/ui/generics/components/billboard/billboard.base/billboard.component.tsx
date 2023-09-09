import { Text, Container, Center, Box } from "@chakra-ui/react";
import { testIDs } from "./billboard.identifiers";
import Condition from "@src/components/condition/condition.component";
import useColour from "@src/web/ui/colours/state/hooks/colour.hook";

export interface BillboardProps {
  children: JSX.Element | JSX.Element[];
  isNavBarVisible: boolean;
  showTitle: boolean;
  titleText: string;
}

const Billboard = ({
  children,
  isNavBarVisible,
  showTitle,
  titleText,
}: BillboardProps) => {
  const { componentColour, transparent } = useColour();

  return (
    <Center height={"calc(100vh)"}>
      <Box
        color={componentColour.foreground}
        bg={componentColour.background}
        mt={isNavBarVisible ? 16 : 0}
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
            <Text
              data-testid={testIDs.BillBoardTitle}
              fontSize={["xl", "2xl", "3xl"]}
            >
              {titleText}
            </Text>
          </Container>
        </Condition>
        {children}
      </Box>
    </Center>
  );
};

export default Billboard;
