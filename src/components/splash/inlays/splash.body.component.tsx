import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import lastFMConfig from "../../../config/lastfm";
import ClickLink from "../../clickable/click.external.link/click.external.link.component";
import LastFMIcon from "../../icons/lastfm/lastfm.icon";
import DimOnHover from "../../styles/hover.dim/hover.dim.styles";
import type { TFunction } from "next-i18next";

export default function PrivacyText({ t }: { t: TFunction }) {
  return (
    <Flex align={"center"} justify={"center"} direction={"column"}>
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
    </Flex>
  );
}
