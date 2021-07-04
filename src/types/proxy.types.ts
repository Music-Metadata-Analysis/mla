import {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "./lastfm.types";

export interface ProxyRequestInterface {
  userName: string;
}

export interface TopAlbumsResponseInterface {
  albums: LastFMAlbumDataInterface[];
  profileUrl: LastFMImageDataInterface[];
}

export interface ProxyTop20ClientInterface {
  secret_key: string;
  getTop20: (username: string) => Promise<LastFMAlbumDataInterface[]>;
}
