import { Container } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function TermsOfServiceHeader({
  t,
}: DialogueInlayComponentInterface) {
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
