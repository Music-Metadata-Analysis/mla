import { Box, Divider, Flex, Img, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import drawerSettings from "./settings/drawer";
import useAnalytics from "../../../../../hooks/analytics";
import useColour from "../../../../../hooks/colour";
import StyledButtonLink from "../../../../button/button.external.link/button.external.link.component";
import Drawer from "../../../common/drawer/drawer.component";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { TFunction } from "next-i18next";

export interface LastFMDrawerInterface<T extends UserState> {
  artWorkAltText: string;
  isOpen: boolean;
  fallbackImage: string;
  objectIndex: number;
  onClose: () => void;
  t: TFunction;
  userState: T;
}

export const testIDs = {
  LastFMDrawer: "LastFMDrawer",
  LastFMDrawerCloseButton: "LastFMDrawerCloseButton",
  LastFMDrawerExternalLink: "LastFMDrawerExternalLink",
  LastFMDrawerPlayCount: "LastFMDrawerPlayCount",
  LastFMDrawerRank: "LastFMDrawerRank",
};

export default function FlipCardDrawer<UserStateType extends UserState>({
  artWorkAltText,
  fallbackImage,
  isOpen,
  objectIndex,
  onClose,
  t,
  userState,
}: LastFMDrawerInterface<UserStateType>) {
  const analytics = useAnalytics();
  const { componentColour } = useColour();
  const artwork = userState.getArtwork(
    objectIndex,
    drawerSettings.lastFMImageSize
  );
  const externalLink = userState.getExternalLink(objectIndex);
  const playCount = userState.getPlayCount(objectIndex);
  const title = userState.getDrawerTitle(objectIndex);

  useEffect(() => {
    analytics.event(userState.getDrawerEvent(objectIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Drawer
      title={title}
      data-testid={testIDs.LastFMDrawer}
      isOpen={isOpen}
      onClose={onClose}
      placement={"bottom"}
    >
      <Flex>
        <Box>
          <Img
            alt={t(artWorkAltText)}
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
            src={artwork}
            width={`${drawerSettings.imageSize}px`}
          />
        </Box>
        <Divider ml={`10px`} mr={`10px`} orientation="vertical" />
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <div>
            <Text
              data-testid={testIDs.LastFMDrawerRank}
              fontSize={["xs", "md", "md"]}
            >
              <strong>{t("flipCardReport.drawer.rank")}</strong>
              {`: ${objectIndex + 1}`}
            </Text>
            <Text
              data-testid={testIDs.LastFMDrawerPlayCount}
              fontSize={["xs", "md", "md"]}
            >
              <strong>{t("flipCardReport.drawer.playCount")}</strong>
              {`: ${playCount}`}
            </Text>
          </div>
          <StyledButtonLink size={"sm"} href={externalLink}>
            <Text fontSize={["xs", "sm", "sm"]}>
              {t("flipCardReport.drawer.buttonText")}
            </Text>
          </StyledButtonLink>
        </Flex>
      </Flex>
    </Drawer>
  );
}
