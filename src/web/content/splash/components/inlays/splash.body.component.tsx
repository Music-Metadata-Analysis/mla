import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import dialogueSettings from "@src/config/dialogue";
import lastFMConfig from "@src/config/lastfm";
import ClickLink from "@src/web/navigation/links/components/click.link.external/click.link.external.component";
import LastFMIconContainer from "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container";
import DimOnHover from "@src/web/ui/generics/components/styles/hover.dim/hover.dim.style";
import type { DialogueInlayComponentInterface } from "@src/web/ui/generics/types/components/dialogue.types";

export default function PrivacyText({ t }: DialogueInlayComponentInterface) {
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
                icon={<LastFMIconContainer />}
                height={dialogueSettings.iconSizes}
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
