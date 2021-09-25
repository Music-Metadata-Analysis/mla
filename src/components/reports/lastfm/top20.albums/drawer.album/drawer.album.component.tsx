import { Box, Divider, Flex, Img } from "@chakra-ui/react";
import { useEffect } from "react";
import EventDefinition from "../../../../../events/event.class";
import useAnalytics from "../../../../../hooks/analytics";
import useColour from "../../../../../hooks/colour";
import StyledButtonLink from "../../../../button/button.link/button.link.component";
import Drawer from "../../../common/drawer/drawer.component";
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
  const imageSize = "150";
  const lastFMImageSize = "large" as const;
  const albumName = userState.getAlbumName(albumIndex);
  const albumPlayCount = userState.getPlayCount(albumIndex);
  const albumExternalLink = userState.getAlbumExternalLink(albumIndex);
  const albumArtWork = userState.getAlbumArtWork(albumIndex, lastFMImageSize);
  const artistName = userState.getArtistName(albumIndex);

  useEffect(() => {
    analytics.event(
      new EventDefinition({
        category: "LASTFM",
        label: "DATA: ALBUM",
        action: `VIEW ALBUM DETAILS: ${artistName}:${albumName}`,
      })
    );
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
            width={`${imageSize}px`}
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
