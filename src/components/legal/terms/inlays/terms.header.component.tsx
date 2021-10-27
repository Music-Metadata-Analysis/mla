import { Container } from "@chakra-ui/react";
import type { TFunction } from "next-i18next";

export default function TermsOfServiceHeader({ t }: { t: TFunction }) {
  return (
    <>
      <Container centerContent mb={4} fontSize={[12, 14, 14, "md"]}>
        {t("termsOfService.text1")}
      </Container>
      <Container centerContent mb={8} fontSize={[10, 12, 12, 12]}>
        {t("termsOfService.text2")}
      </Container>
    </>
  );
}
