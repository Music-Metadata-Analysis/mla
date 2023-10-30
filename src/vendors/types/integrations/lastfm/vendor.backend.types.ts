import type { LastFMAlbumInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/album.info.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/track.info.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";
import type { LastFMUserAlbumInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";
import type { LastFMUserArtistInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { LastFMUserTrackInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";

export interface LastFMVendorArtistImageScraperInterface {
  defaultArtistImageResponse: string;
  invalidResponseMessage: string;
  invalidHTMLMessage: string;
  scrape(
    artistName: string | undefined,
    retries: number
  ): Promise<string> | string;
}

export interface LastFMVendorClientError extends Error {
  statusCode: number;
}

export type LastFMVendorClientBaseType = Record<never, never>;

export interface LastFMVendorAlbumClientInterface {
  getInfo: (
    album: string,
    artist: string,
    username: string
  ) => Promise<LastFMAlbumInfoInterface>;
}

export interface LastFMVendorArtistClientInterface {
  getTopAlbums: (artist: string) => Promise<LastFMArtistTopAlbumsInterface[]>;
}

export interface LastFMVendorTrackClientInterface {
  getInfo: (
    artist: string,
    track: string,
    username: string
  ) => Promise<LastFMTrackInfoInterface>;
}

export interface LastFMVendorSignedRequestInterface {
  method: "auth.getSession" | "user.getInfo";
  params: [string, string][];
}

export interface LastFMVendorSignedClientInterface {
  signedRequest(
    props: LastFMVendorSignedRequestInterface & { sk?: string }
  ): Promise<Response>;
}

export interface LastFMVendorUserClientInterface {
  getTopAlbums: (username: string) => Promise<LastFMUserAlbumInterface[]>;
  getTopArtists: (username: string) => Promise<LastFMUserArtistInterface[]>;
  getTopTracks: (username: string) => Promise<LastFMUserTrackInterface[]>;
  getUserProfile: (username: string) => Promise<LastFMUserProfileInterface>;
}

export interface LastFMVendorBackendInterface {
  AlbumClient: new (secret_key: string) => LastFMVendorAlbumClientInterface;
  ArtistClient: new (secret_key: string) => LastFMVendorArtistClientInterface;
  TrackClient: new (secret_key: string) => LastFMVendorTrackClientInterface;
  SignedClient: new (
    secret_key: string,
    shared_secret: string
  ) => LastFMVendorSignedClientInterface;
  UserClient: new (secret_key: string) => LastFMVendorUserClientInterface;
}
