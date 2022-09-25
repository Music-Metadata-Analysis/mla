import { Container } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default function TermsOfServiceHeader({ t }: { t: tFunctionType }) {
  return (
    <>
      <Container
        centerContent
        mb={3}
        fontSize={dialogueSettings.smallTextFontSize}
      >
        {t("termsOfService.text1")}
      </Container>
      <Container
        centerContent
        mb={3}
        fontSize={dialogueSettings.smallTextFontSize}
      >
        {t("termsOfService.text2")}
      </Container>
    </>
  );
}
