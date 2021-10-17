import {
  Avatar,
  Box,
  Container,
  Flex,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import lastFMConfig from "../../config/lastfm";
import routes from "../../config/routes";
import splashSettings from "../../config/splash";
import Billboard from "../billboard/billboard.component";
import Button from "../button/button.standard/button.standard.component";
import ClickLink from "../clickable/click.external.link/click.external.link.component";
import Highlight from "../highlight/highlight.component";
import LastFMIcon from "../icons/lastfm/lastfm.icon";
import DimOnHover from "../styles/hover.dim/hover.dim.styles";

export const testIDs = {
  SplashList: "SplashList",
  SplashStartButton: "SplashStartButton",
};

export default function Splash() {
  const { t } = useTranslation("splash");
  const router = useRouter();
  const [listVisible, setListVisible] = useState(true);

  const handleClick = () => {
    router.push(routes.search.lastfm.selection);
  };

  const recalculateHeight = () => {
    if (window.innerHeight < splashSettings.listMinimumHeight) {
      setListVisible(false);
    } else {
      setListVisible(true);
    }
  };

  useEffect(() => {
    recalculateHeight();
    window.addEventListener("resize", recalculateHeight);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Billboard title={t("title")}>
      <Flex direction={"column"} justify={"center"} align={"center"}>
        <Highlight
          mb={5}
          borderWidth={"1px"}
          style={{
            listStylePosition: "outside",
            display: listVisible ? "inherit" : "none",
          }}
        >
          <Container centerContent p={5} ml={2} fontSize={[12, 14, 14, "md"]}>
            <UnorderedList data-testid={testIDs.SplashList}>
              <ListItem p={[0.5, 0.5, 0, 0]}>{t("splashText1")}</ListItem>
              <ListItem p={[0.5, 0.5, 0, 0]}>{t("splashText2")}</ListItem>
              <ListItem p={[0.5, 0.5, 0, 0]}>{t("splashText3")}</ListItem>
            </UnorderedList>
          </Container>
        </Highlight>
        <Box mb={[3, 3, 7]}>
          <Text ml={2} fontSize={["xxs"]}>
            {t("creditText")}
          </Text>
        </Box>
        <Box mb={[5, 5, 8]}>
          <Flex align={"center"}>
            <ClickLink href={lastFMConfig.homePage}>
              <DimOnHover>
                <Avatar
                  icon={<LastFMIcon width={75} height={75} />}
                  width={[50, 50, 75]}
                />
              </DimOnHover>
            </ClickLink>
            <Text ml={2} fontSize={["2xl"]}>
              LAST.FM
            </Text>
          </Flex>
        </Box>
        <Button
          data-testid={testIDs.SplashStartButton}
          mb={2}
          onClick={() => handleClick()}
          analyticsName={"Splash Page Start"}
        >
          {t("button")}
        </Button>
      </Flex>
    </Billboard>
  );
}
