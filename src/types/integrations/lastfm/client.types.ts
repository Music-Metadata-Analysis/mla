import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "./api.types";

export interface LastFMClientInterface {
  secret_key: string;
  getTopAlbums: (username: string) => Promise<LastFMAlbumDataInterface[]>;
  getUserImage: (username: string) => Promise<LastFMImageDataInterface[]>;
}

export interface LastFMExternalClientError extends Error {
  response: { status: number };
  clientStatusCode: number;
}
