import { Text, Container } from "@chakra-ui/react";
import dialogueSettings from "../../../../config/dialogue";
import type { TFunction } from "next-i18next";

export default function PrivacyHeader({ t }: { t: TFunction }) {
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
