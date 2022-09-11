import { Container, UnorderedList, ListItem } from "@chakra-ui/react";
import dialogueSettings from "../../../config/dialogue";
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
        fontSize={dialogueSettings.smallTextFontSize}
      >
        <UnorderedList>
          <ListItem p={dialogueSettings.listItemPadding}>
            {t("aboutText1")}
          </ListItem>
          <ListItem p={dialogueSettings.listItemPadding}>
            {t("aboutText2")}
          </ListItem>
          <ListItem p={dialogueSettings.listItemPadding}>
            {t("aboutText3")}
          </ListItem>
        </UnorderedList>
      </Container>
    </div>
  );
}
