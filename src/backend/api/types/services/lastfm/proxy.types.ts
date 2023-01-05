import type {
  LastFMAlbumInfoInterface,
  LastFMArtistTopAlbumsInterface,
  LastFMTrackInfoInterface,
} from "@src/contracts/api/exports/lastfm/datapoint.types";
import type {
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
} from "@src/contracts/api/exports/lastfm/report.types";

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
