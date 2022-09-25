import type {
  LastFMAlbumInfoInterface,
  LastFMArtistTopAlbumsInterface,
  LastFMTrackInfoInterface,
} from "./api.types";
import type {
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
} from "@src/types/clients/api/lastfm/response.types";

export interface LastFMProxyInterface {
  getAlbumInfo: (
    artist: string,
    album: string,
    username: string
  ) => Promise<LastFMAlbumInfoInterface>;
  getArtistTopAlbums: (
    artist: string
  ) => Promise<LastFMArtistTopAlbumsInterface[]>;
  getTrackInfo: (
    track: string,
    artist: string,
    username: string
  ) => Promise<LastFMTrackInfoInterface>;
  getUserTopAlbums: (
    username: string
  ) => Promise<LastFMTopAlbumsReportResponseInterface>;
  getUserTopArtists: (
    username: string
  ) => Promise<LastFMTopArtistsReportResponseInterface>;
  getUserTopTracks: (
    username: string
  ) => Promise<LastFMTopTracksReportResponseInterface>;
}
