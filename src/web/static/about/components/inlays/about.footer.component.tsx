import { Flex } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import routes from "@src/config/routes";
import Button from "@src/web/ui/generics/components/buttons/button.standard/button.standard.component";
import type { DialogueInlayComponentInterface } from "@src/web/ui/generics/types/components/dialogue.types";

export default function PrivacyButtons({
  router,
  t,
}: DialogueInlayComponentInterface) {
  return (
    <Flex>
      <Button
        {...dialogueSettings.buttonComponentProps}
        analyticsName={"About Page Privacy Policy"}
        onClick={() => router.push(routes.legal.privacy)}
        w={dialogueSettings.buttonPairSizes}
      >
        {t("buttons.privacy")}
      </Button>
      <Button
        {...dialogueSettings.buttonComponentProps}
        analyticsName={"About Page Start"}
        onClick={() => router.push(routes.search.lastfm.selection)}
        w={dialogueSettings.buttonPairSizes}
      >
        {t("buttons.start")}
      </Button>
    </Flex>
  );
}
