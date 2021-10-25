import { Flex } from "@chakra-ui/react";
import externalLinks from "../../../../config/external";
import Button from "../../../button/button.external.link/button.external.link.component";
import type { TFunction } from "next-i18next";

export default function PrivacyFooter({ t }: { t: TFunction }) {
  const buttonWidth = "125px";

  return (
    <Flex>
      <Button href={externalLinks.svsContact} mb={2} mr={2} w={buttonWidth}>
        {t("privacy.buttons.contact")}
      </Button>
      <Button href={externalLinks.privacyPolicy} ml={2} mb={2} w={buttonWidth}>
        {t("privacy.buttons.policy")}
      </Button>
    </Flex>
  );
}
