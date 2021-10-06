import { Box, Divider, Flex, Img } from "@chakra-ui/react";
import { useEffect } from "react";
import Events from "../../../../../events/events";
import useAnalytics from "../../../../../hooks/analytics";
import useColour from "../../../../../hooks/colour";
import StyledButtonLink from "../../../../button/button.external.link/button.external.link.component";
import Drawer from "../../../common/drawer/drawer.component";
import drawerSettings from "../../common/settings/drawer";
import type UserAlbumState from "../../../../../providers/user/encapsulations/user.state.album.class";
import type { TFunction } from "next-i18next";

export interface AlbumDrawerInterface {
  userState: UserAlbumState;
  albumIndex: number;
  fallbackImage: string;
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
}

export const testIDs = {
  AlbumDrawer: "AlbumDrawer",
  AlbumDrawerCloseButton: "AlbumDrawerCloseButton",
  AlbumDrawerExternalLink: "AlbumDrawerExternalLink",
  AlbumDrawerPlayCount: "AlbumDrawerPlayCount",
  AlbumDrawerRank: "AlbumDrawerRank",
};

const AlbumDrawer = ({
  userState,
  albumIndex,
  fallbackImage,
  isOpen,
  onClose,
  t,
}: AlbumDrawerInterface) => {
  const analytics = useAnalytics();
  const { componentColour } = useColour();
  const albumName = userState.getName(albumIndex);
  const albumPlayCount = userState.getPlayCount(albumIndex);
  const albumExternalLink = userState.getExternalLink(albumIndex);
  const albumArtWork = userState.getArtwork(
    albumIndex,
    drawerSettings.lastFMImageSize
  );
  const artistName = userState.getRelatedArtistName(albumIndex);

  useEffect(() => {
    analytics.event(Events.LastFM.AlbumViewed(artistName, albumName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Drawer
      title={`${artistName}: ${albumName}`}
      data-testid={testIDs.AlbumDrawer}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex>
        <Box borderWidth={"1px"} borderColor={componentColour.details}>
          <Img
            src={albumArtWork}
            alt={t("top20Albums.drawer.coverArtAltText")}
            width={`${drawerSettings.imageSize}px`}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
            style={{
              position: "relative",
            }}
          />
        </Box>
        <Divider ml={`10px`} mr={`10px`} orientation="vertical" />
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <div>
            <p data-testid={testIDs.AlbumDrawerRank}>
              <strong>{t("top20Albums.drawer.rank")}</strong>
              {`: ${albumIndex + 1}`}
            </p>
            <p data-testid={testIDs.AlbumDrawerPlayCount}>
              <strong>{t("top20Albums.drawer.playCount")}</strong>
              {`: ${albumPlayCount}`}
            </p>
          </div>
          <StyledButtonLink href={albumExternalLink}>
            {t("top20Albums.drawer.albumButtonText")}
          </StyledButtonLink>
        </Flex>
      </Flex>
    </Drawer>
  );
};

export default AlbumDrawer;
