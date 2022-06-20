import { Text } from "@chakra-ui/react";
import type { TFunction } from "next-i18next";

export default function PrivacyHeader({ t }: { t: TFunction }) {
  return (
    <Text fontSize={[12, 14, 14, "md"]} mb={8} textAlign={"center"}>
      {t("privacy.text1")}
    </Text>
  );
}
