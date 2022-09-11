import { Flex } from "@chakra-ui/react";
import dialogueSettings from "../../../../config/dialogue";
import externalLinks from "../../../../config/external";
import Button from "../../../button/button.external.link/button.external.link.component";
import type { TFunction } from "next-i18next";

export default function PrivacyFooter({ t }: { t: TFunction }) {
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
