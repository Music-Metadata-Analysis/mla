import type {
  LastFMAlbumDataInterface,
  LastFMTrackDataInterface,
  LastFMArtistDataInterface,
  LastFMUserProfileInterface,
  LastFMArtistTopAlbumsInterface,
  LastFMAlbumInfoInterface,
  LastFMTrackInfoInterface,
} from "./api.types";

export interface LastFMUserClientInterface {
  secret_key: string;
  getTopAlbums: (username: string) => Promise<LastFMAlbumDataInterface[]>;
  getTopArtists: (username: string) => Promise<LastFMArtistDataInterface[]>;
  getTopTracks: (username: string) => Promise<LastFMTrackDataInterface[]>;
  getUserProfile: (username: string) => Promise<LastFMUserProfileInterface>;
}

export interface LastFMArtistClientInterface {
  secret_key: string;
  getTopAlbums: (artist: string) => Promise<LastFMArtistTopAlbumsInterface[]>;
}

export interface LastFMAlbumClientInterface {
  secret_key: string;
  getInfo: (
    album: string,
    artist: string,
    username: string
  ) => Promise<LastFMAlbumInfoInterface>;
}

export interface LastFMTrackClientInterface {
  secret_key: string;
  getInfo: (
    artist: string,
    track: string,
    username: string
  ) => Promise<LastFMTrackInfoInterface>;
}

export interface LastFMExternalClientError extends Error {
  statusCode: number;
}
