import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@src/components/button/button.standard/button.standard.component";
import dialogueSettings from "@src/config/dialogue";
import routes from "@src/config/routes";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default function PrivacyButtons({ t }: { t: tFunctionType }) {
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
