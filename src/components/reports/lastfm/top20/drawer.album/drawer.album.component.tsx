import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  Flex,
  Img,
} from "@chakra-ui/react";
import useColour from "../../../../../hooks/colour";
import StyledButtonLink from "../../../../button/button.link/button.link.component";
import type { LastFMAlbumDataInterface } from "../../../../../types/integrations/lastfm/api.types";
import type { TFunction } from "next-i18next";

export interface AlbumDrawerInterface {
  albums: LastFMAlbumDataInterface[];
  albumIndex: number | null;
  fallbackImage: string;
  isOpen: boolean;
  top20GetAlbumArtWork: (index: number, size: string) => string;
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
  albums,
  albumIndex,
  fallbackImage,
  isOpen,
  top20GetAlbumArtWork,
  onClose,
  t,
}: AlbumDrawerInterface) => {
  const { componentColour, transparent } = useColour();
  const imageSize = "150";
  const lastFMImageSize = "large" as const;

  if (albumIndex === null) {
    return null;
  }

  const album = albums[albumIndex];
  const albumName = album.name ? album.name : t("top20.drawer.unknownAlbum");
  const artistName = album.artist
    ? album.artist.name
    : t("top20.drawer.unknownArtist");
  const albumPlayCount = album.playcount ? album.playcount : 0;
  const albumExternalLink = album.url
    ? album.url
    : `https://last.fm/music/${
        encodeURIComponent(artistName as string) +
        "/" +
        encodeURIComponent(albumName)
      }`;

  return (
    <Drawer
      data-testid={testIDs.AlbumDrawer}
      placement={"bottom"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent
        colorScheme={componentColour.scheme}
        bg={componentColour.background}
        color={componentColour.foreground}
        sx={{
          caretColor: transparent,
        }}
      >
        <DrawerCloseButton
          data-testid={testIDs.AlbumDrawerCloseButton}
          sx={{
            boxShadow: "none !important",
          }}
        />
        <DrawerHeader>{`${artistName}: ${albumName}`}</DrawerHeader>
        <Divider
          style={{ background: componentColour.scheme }}
          orientation="horizontal"
        />
        <DrawerBody>
          <Flex>
            <Box borderWidth={"1px"} borderColor={componentColour.details}>
              <Img
                src={top20GetAlbumArtWork(albumIndex, lastFMImageSize)}
                alt={t("top20.drawer.coverArtAltText")}
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
                  <strong>{t("top20.drawer.rank")}</strong>
                  {`: ${albumIndex + 1}`}
                </p>
                <p data-testid={testIDs.AlbumDrawerPlayCount}>
                  <strong>{t("top20.drawer.playCount")}</strong>
                  {`: ${albumPlayCount}`}
                </p>
              </div>
              <StyledButtonLink
                analyticsName="LastFM Top20 Album Report: Goto Album"
                href={albumExternalLink}
              >
                {t("top20.drawer.albumButtonText")}
              </StyledButtonLink>
            </Flex>
          </Flex>
        </DrawerBody>
        <Divider
          style={{ background: componentColour.scheme }}
          mb={2}
          orientation="horizontal"
        />
      </DrawerContent>
    </Drawer>
  );
};

export default AlbumDrawer;
