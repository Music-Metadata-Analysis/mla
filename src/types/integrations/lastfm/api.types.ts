export interface LastFMImageDataInterface {
  size: "small" | "medium" | "large" | "extralarge" | "mega";
  "#text": string;
}

export interface LastFMArtistDataInterface {
  image?: LastFMImageDataInterface[];
  mbid: string;
  name?: string;
  playcount?: string;
  streamable?: string;
  url?: string;
  "@attr"?: {
    rank: string;
  };
  "#text"?: string;
}

export interface LastFMAlbumDataInterface {
  artist?: LastFMArtistDataInterface;
  image?: LastFMImageDataInterface[];
  mbid: string;
  name?: string;
  playcount?: string;
  url?: string;
  "@attr"?: {
    rank: string;
  };
  "#text"?: string;
}
