import { Flex } from "@chakra-ui/react";
import externalLinks from "../../../../config/external";
import Button from "../../../button/button.external.link/button.external.link.component";
import type { TFunction } from "next-i18next";

export default function TermsOfServiceFooter({ t }: { t: TFunction }) {
  const buttonWidth = ["100px", "125px"];

  return (
    <Flex>
      <Button
        size={"xs"}
        href={externalLinks.svsContact}
        mb={1}
        mr={2}
        w={buttonWidth}
      >
        {t("termsOfService.buttons.contact")}
      </Button>
      <Button
        size={"xs"}
        href={externalLinks.termsOfService}
        mb={1}
        mr={2}
        w={buttonWidth}
      >
        {t("termsOfService.buttons.terms")}
      </Button>
    </Flex>
  );
}
