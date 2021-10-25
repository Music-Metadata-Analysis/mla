import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import externalLinks from "../../../config/external";
import ClickLink from "../../clickable/click.external.link/click.external.link.component";
import SVSIcon from "../../icons/svs/svs.icon";
import DimOnHover from "../../styles/hover.dim/hover.dim.styles";
import type { TFunction } from "next-i18next";

export default function PrivacyBody({ t }: { t: TFunction }) {
  return (
    <>
      <Center>
        <Box mb={3}>
          <Text ml={2} fontSize={["xxs"]}>
            {t("creditText")}
          </Text>
        </Box>
      </Center>
      <Box mb={[5, 5, 8]}>
        <Flex align={"center"} justify={"center"}>
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
    </>
  );
}
