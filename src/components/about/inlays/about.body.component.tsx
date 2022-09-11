import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import dialogueSettings from "../../../config/dialogue";
import externalLinks from "../../../config/external";
import ClickLink from "../../clickable/click.link.external/click.link.external.component";
import SVSIcon from "../../icons/svs/svs.icon";
import DimOnHover from "../../styles/hover.dim/hover.dim.styles";
import type { TFunction } from "next-i18next";

export default function PrivacyBody({ t }: { t: TFunction }) {
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
                icon={<SVSIcon {...dialogueSettings.iconComponentProps} />}
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
