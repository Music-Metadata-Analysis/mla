import { Flex } from "@chakra-ui/react";
import Button from "@src/components/button/button.external.link/button.external.link.component";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function PrivacyFooter({ t }: DialogueInlayComponentInterface) {
  return (
    <Flex>
      <Button
        {...dialogueSettings.buttonComponentProps}
        href={externalLinks.svsContact}
        w={dialogueSettings.buttonPairSizes}
      >
        {t("privacy.buttons.contact")}
      </Button>
      <Button
        {...dialogueSettings.buttonComponentProps}
        href={externalLinks.privacyPolicy}
        w={dialogueSettings.buttonPairSizes}
      >
        {t("privacy.buttons.policy")}
      </Button>
    </Flex>
  );
}
