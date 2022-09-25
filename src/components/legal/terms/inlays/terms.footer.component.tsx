import { Flex } from "@chakra-ui/react";
import Button from "@src/components/button/button.external.link/button.external.link.component";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default function TermsOfServiceFooter({ t }: { t: tFunctionType }) {
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
