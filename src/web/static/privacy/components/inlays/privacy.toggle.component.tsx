import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import SVSIconContainer from "@src/components/icons/svs/svs.icon.container";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.style";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import ClickLink from "@src/web/navigation/links/components/click.link.external/click.link.external.component";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function PrivacyToggle({ t }: DialogueInlayComponentInterface) {
  return (
    <Box mb={[5, 5, 8]}>
      <Flex align={"center"} justify={"center"}>
        <ClickLink href={externalLinks.svs}>
          <DimOnHover>
            <Avatar
              icon={
                <SVSIconContainer {...dialogueSettings.iconComponentProps} />
              }
              width={dialogueSettings.iconSizes}
            />
          </DimOnHover>
        </ClickLink>
        <Text fontSize={dialogueSettings.mediumTextFontSize} ml={2}>
          {t("privacy.company")}
        </Text>
      </Flex>
    </Box>
  );
}
