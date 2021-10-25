import { Container, UnorderedList, ListItem } from "@chakra-ui/react";
import Highlight from "../../highlight/highlight.component";
import type { TFunction } from "next-i18next";

export default function PrivacyToggle({ t }: { t: TFunction }) {
  return (
    <Highlight
      mb={3}
      borderWidth={"1px"}
      style={{
        listStylePosition: "outside",
      }}
    >
      <Container centerContent p={5} ml={2} fontSize={[12, 14, 14, "md"]}>
        <UnorderedList>
          <ListItem p={[0.5, 0.5, 0, 0]}>{t("splashText1")}</ListItem>
          <ListItem p={[0.5, 0.5, 0, 0]}>{t("splashText2")}</ListItem>
          <ListItem p={[0.5, 0.5, 0, 0]}>{t("splashText3")}</ListItem>
        </UnorderedList>
      </Container>
    </Highlight>
  );
}
