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
import aboutSettings from "../../config/about";
import externalLinks from "../../config/external";
import routes from "../../config/routes";
import Billboard from "../billboard/billboard.component";
import Button from "../button/button.standard/button.standard.component";
import ClickLink from "../clickable/click.external.link/click.external.link.component";
import SVSIcon from "../icons/svs/svs.icon";
import DimOnHover from "../styles/hover.dim/hover.dim.styles";

export const testIDs = {
  AboutList: "AboutList",
  AboutStartButton: "AboutStartButton",
};

export default function About() {
  const { t } = useTranslation("about");
  const router = useRouter();
  const [listVisible, setListVisible] = useState(true);

  const handleClick = () => {
    router.push(routes.search.lastfm.selection);
  };

  const recalculateHeight = () => {
    if (window.innerHeight < aboutSettings.listMinimumHeight) {
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
        <div
          style={{
            listStylePosition: "outside",
            display: listVisible ? "inherit" : "none",
          }}
        >
          <Container
            centerContent
            pl={5}
            pr={5}
            pb={5}
            ml={2}
            fontSize={[12, 14, 14, "md"]}
          >
            <UnorderedList data-testid={testIDs.AboutList}>
              <ListItem p={[0.5, 0.5, 0, 0]}>{t("aboutText1")}</ListItem>
              <ListItem p={[0.5, 0.5, 0, 0]}>{t("aboutText2")}</ListItem>
              <ListItem p={[0.5, 0.5, 0, 0]}>{t("aboutText3")}</ListItem>
            </UnorderedList>
          </Container>
        </div>
        <Box mb={3}>
          <Text ml={2} fontSize={["xxs"]}>
            {t("creditText")}
          </Text>
        </Box>
        <Box mb={[5, 5, 8]}>
          <Flex align={"center"} justifyContent={"center"}>
            <ClickLink href={externalLinks.svs}>
              <DimOnHover>
                <Avatar
                  icon={<SVSIcon width={75} height={75} />}
                  width={[50, 50, 75]}
                />
              </DimOnHover>
            </ClickLink>
            <Text ml={2} fontSize={["l", "xl", "2xl"]}>
              {t("company")}
            </Text>
          </Flex>
        </Box>
        <Button
          data-testid={testIDs.AboutStartButton}
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
