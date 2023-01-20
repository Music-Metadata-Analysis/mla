import type { LastFMAlbumInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/album.info.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/track.info.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";
import type { LastFMUserAlbumInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";
import type { LastFMUserArtistInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { LastFMUserTrackInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";

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
