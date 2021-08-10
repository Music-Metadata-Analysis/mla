import { WarningTwoIcon } from "@chakra-ui/icons";
import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Billboard from "../../billboard/billboard.component";

export interface ErrorHandlerProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorHandler = ({ error, resetErrorBoundary }: ErrorHandlerProps) => {
  const { t } = useTranslation("main");
  const buttonBG = useColorModeValue("gray.500", "gray.700");
  const iconColor = useColorModeValue("yellow.800", "yellow.200");

  useEffect(() => {
    console.error(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Billboard title={t("error.title")}>
        <Flex direction={"column"} align={"center"} justify={"center"}>
          <WarningTwoIcon color={iconColor} boxSize={50} />
          <div>{error.message}</div>
          <br />
          <Button bg={buttonBG} size="sm" onClick={resetErrorBoundary}>
            {t("error.resetButton")}
          </Button>
        </Flex>
      </Billboard>
    </>
  );
};

export default ErrorHandler;
