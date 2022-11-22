import { Box, Container, UnorderedList, ListItem } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function PrivacyToggle({ t }: DialogueInlayComponentInterface) {
  return (
    <Box listStylePosition={"outside"}>
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
    </Box>
  );
}
