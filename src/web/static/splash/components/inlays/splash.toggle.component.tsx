import { Container, UnorderedList, ListItem } from "@chakra-ui/react";
import Highlight from "@src/components/highlight/highlight.component";
import dialogueSettings from "@src/config/dialogue";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function PrivacyToggle({ t }: DialogueInlayComponentInterface) {
  return (
    <Highlight
      mb={3}
      borderWidth={"1px"}
      style={{
        listStylePosition: "outside",
      }}
    >
      <Container
        centerContent
        p={5}
        ml={2}
        fontSize={dialogueSettings.largeTextFontSize}
      >
        <UnorderedList>
          <ListItem p={dialogueSettings.listItemPadding}>
            {t("splashText1")}
          </ListItem>
          <ListItem p={dialogueSettings.listItemPadding}>
            {t("splashText2")}
          </ListItem>
          <ListItem p={dialogueSettings.listItemPadding}>
            {t("splashText3")}
          </ListItem>
        </UnorderedList>
      </Container>
    </Highlight>
  );
}
