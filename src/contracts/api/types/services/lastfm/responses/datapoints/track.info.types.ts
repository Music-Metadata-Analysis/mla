import type { LastFMAttrInterface } from "../elements/attribute.types";
import type { LastFMDateInterface } from "../elements/date.data.types";
import type { LastFMImageDataInterface } from "../elements/image.data.types";
import type { LastFMTagInterface } from "../elements/tag.data.types";
import type { LastFMTrackStreamableInterface } from "../elements/track.streamable.types";

interface LastFMTrackInfoAlbumInterface {
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
  artist: string;
  image?: LastFMImageDataInterface[];
  mbid?: string;
  playcount?: string;
  title: string;
  url?: string;
}

export interface LastFMTrackInfoArtistInterface {
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
  image?: LastFMImageDataInterface[];
  mbid?: string;
  name?: string;
  playcount?: string;
  streamable?: string;
  url?: string;
}

export interface LastFMTrackInfoInterface {
  "@attr"?: LastFMAttrInterface;
  album: LastFMTrackInfoAlbumInterface;
  artist?: LastFMTrackInfoArtistInterface;
  date?: LastFMDateInterface;
  duration?: string;
  listeners?: string;
  mbid?: string;
  name?: string;
  playcount?: string;
  streamable?: LastFMTrackStreamableInterface | string;
  toptags:
    | {
        tag: LastFMTagInterface[];
      }
    | "";
  url?: string;
  userplaycount: string;
  wiki?: {
    published?: string;
    summary?: string;
    content?: string;
  };
}
