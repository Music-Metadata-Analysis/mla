import { Flex } from "@chakra-ui/react";
import externalLinks from "../../../../config/external";
import Button from "../../../button/button.external.link/button.external.link.component";
import type { TFunction } from "next-i18next";

export default function PrivacyFooter({ t }: { t: TFunction }) {
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
        {t("privacy.buttons.contact")}
      </Button>
      <Button
        size={"xs"}
        href={externalLinks.privacyPolicy}
        ml={2}
        mb={1}
        w={buttonWidth}
      >
        {t("privacy.buttons.policy")}
      </Button>
    </Flex>
  );
}
