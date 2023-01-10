import { Box, Divider, Flex, Img, Text } from "@chakra-ui/react";
import { testIDs } from "./flip.card.report.drawer.identifiers";
import StyledButtonLink from "@src/components/button/button.external.link/button.external.link.component";
import ReportDrawer from "@src/components/reports/common/drawer/drawer.component";
import settings from "@src/config/flip.card";
import useColour from "@src/hooks/ui/colour.hook";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export interface FlipCardDrawerProps {
  artWorkAltTranslatedText: string;
  artWorkSourceUrl: string;
  drawerTitle: string;
  externalLink: string;
  fallbackImage: string;
  isOpen: boolean;
  objectIndex: number;
  onClose: () => void;
  value: string;
  t: tFunctionType;
}

export default function FlipCardDrawer({
  artWorkAltTranslatedText,
  artWorkSourceUrl,
  drawerTitle,
  externalLink,
  fallbackImage,
  isOpen,
  objectIndex,
  onClose,
  value,
  t,
}: FlipCardDrawerProps) {
  const { componentColour } = useColour();

  return (
    <ReportDrawer
      title={drawerTitle}
      data-testid={testIDs.LastFMDrawer}
      isOpen={isOpen}
      onClose={onClose}
      placement={"bottom"}
    >
      <Flex>
        <Box>
          <Img
            alt={artWorkAltTranslatedText}
            borderWidth={"1px"}
            borderColor={componentColour.details}
            borderStyle={"solid"}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
            style={{
              position: "relative",
            }}
            src={artWorkSourceUrl}
            width={`${settings.drawer.imageSize}px`}
          />
        </Box>
        <Divider ml={"10px"} mr={"10px"} orientation={"vertical"} />
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <div>
            <Text
              data-testid={testIDs.LastFMDrawerRank}
              fontSize={["sm", "md"]}
            >
              <strong>{t("flipCardReport.drawer.rank")}</strong>
              {`: ${objectIndex + 1}`}
            </Text>
            <Text
              data-testid={testIDs.LastFMDrawerPlayCount}
              fontSize={["sm", "md"]}
            >
              <strong>{t("flipCardReport.drawer.playCount")}</strong>
              {`: ${value}`}
            </Text>
          </div>
          <StyledButtonLink size={"sm"} href={externalLink}>
            <Text fontSize={["sm", "md"]}>
              {t("flipCardReport.drawer.buttonText")}
            </Text>
          </StyledButtonLink>
        </Flex>
      </Flex>
    </ReportDrawer>
  );
}
