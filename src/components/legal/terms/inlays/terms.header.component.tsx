import { Container } from "@chakra-ui/react";
import dialogueSettings from "../../../../config/dialogue";
import type { TFunction } from "next-i18next";

export default function TermsOfServiceHeader({ t }: { t: TFunction }) {
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
