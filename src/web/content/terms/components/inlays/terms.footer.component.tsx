import { Flex } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import Button from "@src/web/ui/generics/components/buttons/button.external.link/button.external.link.component";
import type { DialogueInlayComponentInterface } from "@src/web/ui/generics/types/components/dialogue.types";

export default function TermsOfServiceFooter({
  t,
}: DialogueInlayComponentInterface) {
  return (
    <Flex>
      <Button
        {...dialogueSettings.buttonComponentProps}
        href={externalLinks.svsContact}
        w={dialogueSettings.buttonPairSizes}
      >
        {t("termsOfService.buttons.contact")}
      </Button>
      <Button
        {...dialogueSettings.buttonComponentProps}
        href={externalLinks.termsOfService}
        w={dialogueSettings.buttonPairSizes}
      >
        {t("termsOfService.buttons.terms")}
      </Button>
    </Flex>
  );
}
