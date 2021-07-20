import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "./api.types";

export interface LastFMClientInterface {
  secret_key: string;
  getTopAlbums: (username: string) => Promise<LastFMAlbumDataInterface[]>;
  getUserImage: (username: string) => Promise<LastFMImageDataInterface[]>;
}
