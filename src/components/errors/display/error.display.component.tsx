import { WarningTwoIcon } from "@chakra-ui/icons";
import { Button, Container, Flex, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Billboard from "../../billboard/billboard.component";

export interface ErrorHandlerProps {
  error?: Error;
  resetError: () => void;
  errorKey: string;
}

const ErrorDisplay = ({ errorKey, resetError, error }: ErrorHandlerProps) => {
  const { t } = useTranslation("main");
  const buttonBG = useColorModeValue("gray.500", "gray.700");
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
        <Button bg={buttonBG} size="sm" onClick={resetError}>
          {t(`errors.${errorKey}.resetButton`)}
        </Button>
      </Flex>
    </Billboard>
  );
};

export default ErrorDisplay;
