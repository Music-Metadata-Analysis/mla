import type { LastFMAttrInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/attribute.types";
import type { LastFMImageDataInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/image.data.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";

export interface LastFMUserArtistInterface {
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
  image?: LastFMImageDataInterface[];
  mbid?: string;
  name?: string;
  playcount?: string;
  streamable?: string;
  url?: string;
}

export interface LastFMTopArtistsReportResponseInterface
  extends LastFMUserProfileInterface {
  artists: LastFMUserArtistInterface[];
}
