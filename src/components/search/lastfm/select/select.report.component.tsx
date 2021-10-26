import { Box, Flex, Avatar } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Option from "./inlay/select.option.component";
import config from "../../../../config/lastfm";
import Billboard from "../../../billboard/billboard.component";
import LastFMIcon from "../../../icons/lastfm/lastfm.icon";

export default function SearchSelection() {
  const { t } = useTranslation("lastfm");
  const router = useRouter();
  const [visibleIndicators, setVisibleIndicators] = useState(true);

  const hideIndicators = () => {
    if (window.innerWidth < config.select.indicatorWidth) {
      setVisibleIndicators(false);
    } else {
      setVisibleIndicators(true);
    }
  };

  useEffect(() => {
    hideIndicators();
    window.addEventListener("resize", hideIndicators);
    return () => {
      window.removeEventListener("resize", hideIndicators);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Billboard title={t("select.title")}>
      <Flex justify={"center"} align={"center"}>
        <Box mr={10} mb={5}>
          <Avatar
            icon={<LastFMIcon width={100} height={100} />}
            width={[50, 50, 75]}
          />
        </Box>
        <Flex direction={"column"} justify={"center"} align={"center"} mb={5}>
          {config.select.options.map((option, index) => {
            return (
              <Option
                key={index}
                analyticsName={option.analyticsName}
                buttonText={t(option.buttonTextKey)}
                clickHandler={() => router.push(option.route)}
                indicatorText={t(option.indicatorTextKey)}
                visibleIndicators={visibleIndicators}
              />
            );
          })}
        </Flex>
      </Flex>
    </Billboard>
  );
}
