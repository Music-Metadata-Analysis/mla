import { Box, Flex, Avatar } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import config from "../../../../config/lastfm";
import routes from "../../../../config/routes";
import Billboard from "../../../billboard/billboard.component";
import Button from "../../../button/button.standard/button.standard.component";
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

  const Indicator = ({
    indication,
    visible,
  }: {
    indication: string;
    visible: boolean;
  }) => {
    if (!visible) return null;
    return <Box mr={5}>{indication}</Box>;
  };

  return (
    <Billboard title={t("select.title")}>
      <Flex justify={"space-between"} align={"center"}>
        <Box mb={5}>
          <Avatar
            icon={<LastFMIcon width={100} height={100} />}
            width={[50, 50, 75]}
          />
        </Box>
        <Flex
          w={"100%"}
          direction={"column"}
          justify={"center"}
          align={"center"}
          mb={5}
        >
          <Flex mb={2} align={"center"} justify={"center"}>
            <Indicator
              visible={visibleIndicators}
              indication={t("select.indicators.topAlbums") + ":"}
            />
            <Button
              w={200}
              analyticsName={"Top Albums"}
              onClick={() => router.push(routes.search.lastfm.top20albums)}
            >
              {t("select.reports.topAlbums")}
            </Button>
          </Flex>
          <Flex mt={2} align={"center"} justify={"center"}>
            <Indicator
              visible={visibleIndicators}
              indication={t("select.indicators.topArtists") + ":"}
            />
            <Button
              w={200}
              analyticsName={"Top Artists"}
              onClick={() => router.push(routes.search.lastfm.top20artists)}
            >
              {t("select.reports.topArtists")}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Billboard>
  );
}
