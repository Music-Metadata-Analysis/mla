import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import routes from "../../../config/routes";
import Button from "../../button/button.standard/button.standard.component";
import type { TFunction } from "next-i18next";

export default function PrivacyButtons({ t }: { t: TFunction }) {
  const buttonWidth = "125px";
  const router = useRouter();

  return (
    <Flex>
      <Button
        mb={2}
        mr={2}
        onClick={() => router.push(routes.legal.privacy)}
        analyticsName={"About Page Privacy Policy"}
        w={buttonWidth}
      >
        {t("buttons.privacy")}
      </Button>
      <Button
        mb={2}
        ml={2}
        onClick={() => router.push(routes.search.lastfm.selection)}
        analyticsName={"About Page Start"}
        w={buttonWidth}
      >
        {t("buttons.start")}
      </Button>
    </Flex>
  );
}
