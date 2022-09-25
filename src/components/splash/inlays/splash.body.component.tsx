import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import LastFMIcon from "@src/components/icons/lastfm/lastfm.icon";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.styles";
import dialogueSettings from "@src/config/dialogue";
import lastFMConfig from "@src/config/lastfm";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default function PrivacyText({ t }: { t: tFunctionType }) {
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
