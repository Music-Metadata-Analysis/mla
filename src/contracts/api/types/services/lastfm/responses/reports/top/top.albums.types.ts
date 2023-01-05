import type { LastFMUserArtistInterface } from "./top.artists.types";
import type { LastFMAttrInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/attribute.types";
import type { LastFMImageDataInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/image.data.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";

export interface LastFMUserAlbumInterface {
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
  artist?: LastFMUserArtistInterface;
  image?: LastFMImageDataInterface[];
  mbid?: string;
  name?: string;
  playcount?: string;
  url?: string;
}

export interface LastFMTopAlbumsReportResponseInterface
  extends LastFMUserProfileInterface {
  albums: LastFMUserAlbumInterface[];
}
