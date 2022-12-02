import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIconContainer from "@src/components/icons/svs/svs.icon.container";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.style";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import type { DialogueInlayComponentInterface } from "@src/types/components/dialogue.types";

export default function PrivacyBody({ t }: DialogueInlayComponentInterface) {
  return (
    <>
      <Center>
        <Box mb={3}>
          <Text fontSize={["xxs"]} ml={2}>
            {t("creditText")}
          </Text>
        </Box>
      </Center>
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
            {t("company")}
          </Text>
        </Flex>
      </Box>
    </>
  );
}
