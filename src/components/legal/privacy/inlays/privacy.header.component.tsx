import { Container } from "@chakra-ui/react";
import type { TFunction } from "next-i18next";

export default function PrivacyHeader({ t }: { t: TFunction }) {
  return (
    <Container centerContent mb={8} fontSize={[12, 14, 14, "md"]}>
      {t("privacy.text1")}
    </Container>
  );
}
