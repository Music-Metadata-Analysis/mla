import { Text, Container } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default function PrivacyHeader({ t }: { t: tFunctionType }) {
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
