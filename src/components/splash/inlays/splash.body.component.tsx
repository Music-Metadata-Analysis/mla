import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import dialogueSettings from "../../../config/dialogue";
import lastFMConfig from "../../../config/lastfm";
import ClickLink from "../../clickable/click.link.external/click.link.external.component";
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
                icon={<LastFMIcon {...dialogueSettings.iconComponentProps} />}
                width={dialogueSettings.iconSizes}
              />
            </DimOnHover>
          </ClickLink>
          <Text ml={2} fontSize={dialogueSettings.mediumTextFontSize}>
            LAST.FM
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
