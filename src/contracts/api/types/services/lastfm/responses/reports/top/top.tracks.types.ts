import type { LastFMUserArtistInterface } from "./top.artists.types";
import type { LastFMAttrInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/attribute.types";
import type { LastFMDateInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/date.data.types";
import type { LastFMImageDataInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/image.data.types";
import type { LastFMTrackStreamableInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/track.streamable.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";

export interface LastFMUserTrackInterface {
  "@attr"?: LastFMAttrInterface;
  artist?: LastFMUserArtistInterface;
  date?: LastFMDateInterface;
  duration?: string;
  image?: LastFMImageDataInterface[];
  mbid?: string;
  name?: string;
  playcount?: string;
  streamable?: LastFMTrackStreamableInterface | string;
  url?: string;
}

export interface LastFMTopTracksReportResponseInterface
  extends LastFMUserProfileInterface {
  tracks: LastFMUserTrackInterface[];
}
