import type {
  LastFMAlbumDataInterface,
  LastFMTrackDataInterface,
  LastFMArtistDataInterface,
  LastFMUserProfileInterface,
} from "./api.types";

export interface LastFMClientInterface {
  secret_key: string;
  getTopAlbums: (username: string) => Promise<LastFMAlbumDataInterface[]>;
  getTopArtists: (username: string) => Promise<LastFMArtistDataInterface[]>;
  getTopTracks: (username: string) => Promise<LastFMTrackDataInterface[]>;
  getUserProfile: (username: string) => Promise<LastFMUserProfileInterface>;
}

export interface LastFMExternalClientError extends Error {
  statusCode: number;
}
