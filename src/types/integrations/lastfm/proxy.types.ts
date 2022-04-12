import type {
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
} from "../../clients/api/reports/lastfm.client.types";

export interface LastFMProxyRequestInterface {
  userName: string;
}

export interface LastFMProxyInterface {
  getTopAlbums: (
    username: string
  ) => Promise<LastFMTopAlbumsReportResponseInterface>;
  getTopArtists: (
    username: string
  ) => Promise<LastFMTopArtistsReportResponseInterface>;
  getTopTracks: (
    username: string
  ) => Promise<LastFMTopTracksReportResponseInterface>;
}
