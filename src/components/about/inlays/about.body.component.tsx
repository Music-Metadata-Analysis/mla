import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIcon from "@src/components/icons/svs/svs.icon";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.styles";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default function PrivacyBody({ t }: { t: tFunctionType }) {
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
