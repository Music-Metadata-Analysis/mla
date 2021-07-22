import type { LastFMTopAlbumsReportResponseInterface } from "../../clients/api/reports/lastfm.types";

export interface LastFMProxyInterface {
  getTopAlbums: (
    username: string
  ) => Promise<LastFMTopAlbumsReportResponseInterface>;
}
