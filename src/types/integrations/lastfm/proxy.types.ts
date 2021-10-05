import type { LastFMTopAlbumsReportResponseInterface } from "../../clients/api/reports/lastfm.client.types";

export interface LastFMProxyRequestInterface {
  userName: string;
}

export interface LastFMProxyInterface {
  getTopAlbums: (
    username: string
  ) => Promise<LastFMTopAlbumsReportResponseInterface>;
}
