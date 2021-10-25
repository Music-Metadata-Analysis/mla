import { Container, UnorderedList, ListItem } from "@chakra-ui/react";
import type { TFunction } from "next-i18next";

export default function PrivacyToggle({ t }: { t: TFunction }) {
  return (
    <div
      style={{
        listStylePosition: "outside",
      }}
    >
      <Container
        centerContent
        pl={5}
        pr={5}
        pb={5}
        ml={2}
        fontSize={[12, 14, 14, "md"]}
      >
        <UnorderedList>
          <ListItem p={[0.5, 0.5, 0, 0]}>{t("aboutText1")}</ListItem>
          <ListItem p={[0.5, 0.5, 0, 0]}>{t("aboutText2")}</ListItem>
          <ListItem p={[0.5, 0.5, 0, 0]}>{t("aboutText3")}</ListItem>
        </UnorderedList>
      </Container>
    </div>
  );
}
