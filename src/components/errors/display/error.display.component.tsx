import { WarningTwoIcon } from "@chakra-ui/icons";
import { Container, Flex, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Billboard from "../../billboard/billboard.component";
import StyledButton from "../../button/button.standard/button.standard.component";

export interface ErrorHandlerProps {
  error?: Error;
  resetError: () => void;
  errorKey: string;
}

const ErrorDisplay = ({ errorKey, resetError, error }: ErrorHandlerProps) => {
  const { t } = useTranslation("main");
  const iconColor = useColorModeValue("yellow.800", "yellow.200");

  const displayMessage = () => {
    if (error) return <div>{error.message}</div>;
    return <div>{t(`errors.${errorKey}.message`)}</div>;
  };

  return (
    <Billboard title={t(`errors.${errorKey}.title`)}>
      <Flex direction={"column"} align={"center"} justify={"center"}>
        <WarningTwoIcon color={iconColor} boxSize={50} />
        <Container
          fontSize={[20, 24, 30]}
          centerContent={true}
          maxW={"medium"}
          textAlign={"center"}
        >
          {displayMessage()}
        </Container>
        <br />
        <StyledButton analyticsName={"Clear Error State"} onClick={resetError}>
          {t(`errors.${errorKey}.resetButton`)}
        </StyledButton>
      </Flex>
    </Billboard>
  );
};

export default ErrorDisplay;
