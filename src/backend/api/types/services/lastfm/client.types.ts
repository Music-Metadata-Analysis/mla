import type {
  LastFMArtistTopAlbumsInterface,
  LastFMAlbumInfoInterface,
  LastFMTrackInfoInterface,
} from "@src/contracts/api/exports/lastfm/datapoint.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/exports/lastfm/element.types";
import type {
  LastFMUserAlbumInterface,
  LastFMUserArtistInterface,
  LastFMUserTrackInterface,
} from "@src/contracts/api/exports/lastfm/report.types";

export interface LastFMUserClientInterface {
  secret_key: string;
  getTopAlbums: (username: string) => Promise<LastFMUserAlbumInterface[]>;
  getTopArtists: (username: string) => Promise<LastFMUserArtistInterface[]>;
  getTopTracks: (username: string) => Promise<LastFMUserTrackInterface[]>;
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
