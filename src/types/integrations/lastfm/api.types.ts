export interface LastFMAttrInterface {
  album?: string;
  artist?: string;
  from?: string;
  position?: string;
  page?: string;
  perPage?: string;
  rank?: string | number;
  tag?: string;
  to?: string;
  total?: string;
  totalPages?: string;
  track?: string;
  user?: string;
}

export interface LastFMAlbumDataInterface {
  artist?: LastFMArtistDataInterface;
  image?: LastFMImageDataInterface[];
  mbid: string;
  name?: string;
  playcount?: string;
  url?: string;
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
}

export interface LastFMArtistDataInterface {
  image?: LastFMImageDataInterface[];
  mbid: string;
  name?: string;
  playcount?: string;
  streamable?: string;
  url?: string;
  "@attr"?: LastFMAttrInterface;
  "#text"?: string;
}

export interface LastFMImageDataInterface {
  size: "small" | "medium" | "large" | "extralarge" | "mega";
  "#text": string;
}

export interface LastFMTagInterface {
  name: string;
  count?: string;
  url: string;
}

export interface LastFMTrackDataInterface {
  artist?: LastFMArtistDataInterface;
  date?: LastFMTrackDateInterface;
  duration?: string;
  image?: LastFMImageDataInterface[];
  mbid: string;
  name?: string;
  playcount?: string;
  streamable?: LastFMTrackStreamableInterface | string;
  url?: string;
  "@attr"?: LastFMAttrInterface;
}

export interface LastFMUserProfileInterface {
  image: LastFMImageDataInterface[];
  playcount: number;
}

interface LastFMTrackDateInterface {
  uts: string;
  "#text": string;
}

interface LastFMTrackStreamableInterface {
  fulltrack: string;
  "#text": string;
}

export type LastFMArtistTopAlbumsInterface = Omit<
  LastFMAlbumDataInterface,
  "playcount"
> & {
  playcount?: number;
  artist: LastFMArtistDataInterface;
};

type LASTFMAlbumInfoTrackType = Omit<
  LastFMTrackDataInterface,
  "duration" | "image"
> & {
  duration?: number;
  "@attr": LastFMAttrInterface;
};

export type LastFMAlbumInfoInterface = Omit<
  LastFMAlbumDataInterface,
  "artist"
> & {
  artist: string;
  listeners: string;
  tags:
    | {
        tag: LastFMTagInterface[];
      }
    | "";
  tracks?: {
    track: Array<LASTFMAlbumInfoTrackType> | LASTFMAlbumInfoTrackType;
  };
  userplaycount: number;
  wiki?: {
    published?: string;
    summary?: string;
    content?: string;
  };
};

export type LastFMTrackInfoInterface = Omit<
  LastFMTrackDataInterface,
  "image" | "title"
> & {
  album: Omit<LastFMAlbumDataInterface, "artist" | "name"> & {
    artist: string;
    title: string;
  };
  listeners?: string;
  toptags:
    | {
        tag: LastFMTagInterface[];
      }
    | "";
  userplaycount: string;
  wiki?: {
    published?: string;
    summary?: string;
    content?: string;
  };
};
