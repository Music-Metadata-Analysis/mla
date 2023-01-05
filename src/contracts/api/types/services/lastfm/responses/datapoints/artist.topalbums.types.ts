import type { LastFMAttrInterface } from "../elements/attribute.types";
import type { LastFMImageDataInterface } from "../elements/image.data.types";

export interface LastFMArtistTopAlbumsArtistInterface {
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
  image?: LastFMImageDataInterface[];
  mbid?: string;
  name?: string;
  playcount?: string;
  streamable?: string;
  url?: string;
}

export interface LastFMArtistTopAlbumsInterface {
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
  artist?: LastFMArtistTopAlbumsArtistInterface;
  image?: LastFMImageDataInterface[];
  mbid?: string;
  name?: string;
  playcount?: number;
  url?: string;
}
