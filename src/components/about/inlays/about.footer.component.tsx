import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import routes from "../../../config/routes";
import Button from "../../button/button.standard/button.standard.component";
import type { TFunction } from "next-i18next";

export default function PrivacyButtons({ t }: { t: TFunction }) {
  const buttonWidth = ["100px", "125px"];
  const router = useRouter();

  return (
    <Flex>
      <Button
        analyticsName={"About Page Privacy Policy"}
        onClick={() => router.push(routes.legal.privacy)}
        mb={1}
        mr={2}
        size={"xs"}
        w={buttonWidth}
      >
        {t("buttons.privacy")}
      </Button>
      <Button
        analyticsName={"About Page Start"}
        onClick={() => router.push(routes.search.lastfm.selection)}
        mb={1}
        ml={2}
        size={"xs"}
        w={buttonWidth}
      >
        {t("buttons.start")}
      </Button>
    </Flex>
  );
}
