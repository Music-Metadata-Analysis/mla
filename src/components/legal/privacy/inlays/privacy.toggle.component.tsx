import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import dialogueSettings from "../../../../config/dialogue";
import externalLinks from "../../../../config/external";
import ClickLink from "../../../clickable/click.link.external/click.link.external.component";
import SVSIcon from "../../../icons/svs/svs.icon";
import DimOnHover from "../../../styles/hover.dim/hover.dim.styles";
import type { TFunction } from "next-i18next";

export default function PrivacyToggle({ t }: { t: TFunction }) {
  return (
    <Box mb={[5, 5, 8]}>
      <Flex align={"center"} justify={"center"}>
        <ClickLink href={externalLinks.svs}>
          <DimOnHover>
            <Avatar
              icon={<SVSIcon {...dialogueSettings.iconComponentProps} />}
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
