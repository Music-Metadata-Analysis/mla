import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import dialogueSettings from "../../../config/dialogue";
import routes from "../../../config/routes";
import Button from "../../button/button.standard/button.standard.component";
import type { TFunction } from "next-i18next";

export default function PrivacyButtons({ t }: { t: TFunction }) {
  const router = useRouter();

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
