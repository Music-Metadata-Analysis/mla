import type { LastFMTopAlbumsReportResponseInterface } from "./report.types";

export interface LastFMProxyInterface {
  getTopAlbums: (
    username: string
  ) => Promise<LastFMTopAlbumsReportResponseInterface>;
}
