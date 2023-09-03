import { WarningTwoIcon } from "@chakra-ui/icons";
import { Container, Flex } from "@chakra-ui/react";
import StyledButton from "@src/components/button/button.standard/button.standard.component";
import useColour from "@src/hooks/ui/colour.hook";
import BillboardContainer from "@src/web/ui/generics/components/billboard/billboard.base/billboard.container";

export interface ErrorDisplayProps {
  buttonText: string;
  children: string;
  handleClick: () => void;
  titleText: string;
}

const ErrorDisplay = ({
  buttonText,
  children,
  handleClick,
  titleText,
}: ErrorDisplayProps) => {
  const { errorColour } = useColour();

  return (
    <BillboardContainer titleText={titleText}>
      <Flex align={"center"} direction={"column"} justify={"center"}>
        <WarningTwoIcon color={errorColour.icon} boxSize={50} />
        <Container
          centerContent={true}
          fontSize={[20, 24, 30]}
          maxW={"medium"}
          textAlign={"center"}
        >
          {children}
        </Container>
        <StyledButton
          analyticsName={"Clear Error State"}
          mt={5}
          onClick={handleClick}
        >
          {buttonText}
        </StyledButton>
      </Flex>
    </BillboardContainer>
  );
};

export default ErrorDisplay;
