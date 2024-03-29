import { Container, UnorderedList, ListItem } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import Highlight from "@src/web/ui/generics/components/highlight/highlight.component";
import type { DialogueInlayComponentInterface } from "@src/web/ui/generics/types/components/dialogue.types";

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
