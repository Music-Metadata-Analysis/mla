import type { LastFMAttrInterface } from "../elements/attribute.types";
import type { LastFMDateInterface } from "../elements/date.data.types";
import type { LastFMImageDataInterface } from "../elements/image.data.types";
import type { LastFMTagInterface } from "../elements/tag.data.types";
import type { LastFMTrackStreamableInterface } from "../elements/track.streamable.types";

interface LastFMAlbumInfoTrackInterface {
  "@attr": LastFMAttrInterface;
  date?: LastFMDateInterface;
  duration: number | null;
  mbid?: string;
  name?: string;
  playcount?: string;
  streamable?: LastFMTrackStreamableInterface | string;
  url?: string;
}

export type LastFMAlbumInfoInterface = {
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
  artist: string;
  image?: LastFMImageDataInterface[];
  listeners: string;
  mbid?: string;
  name?: string;
  playcount?: string;
  tags:
    | {
        tag: LastFMTagInterface[];
      }
    | "";
  tracks?: {
    track: Array<LastFMAlbumInfoTrackInterface>;
  };
  url?: string;
  userplaycount: number;
  wiki?: {
    published?: string;
    summary?: string;
    content?: string;
  };
};
