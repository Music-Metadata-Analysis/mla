import { Text, Container } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function PrivacyHeader({ t }: DialogueInlayComponentInterface) {
  return (
    <Container>
      <Text
        fontSize={dialogueSettings.smallTextFontSize}
        mb={8}
        textAlign={"center"}
      >
        {t("privacy.text1")}
      </Text>
    </Container>
  );
}
