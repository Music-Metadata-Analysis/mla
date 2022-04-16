import type {
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
} from "../../clients/api/reports/lastfm.client.types";

export interface LocalStorageObjectInterface {
  index: string;
  expiry: Date;
  content:
    | LastFMTopAlbumsReportResponseInterface
    | LastFMTopArtistsReportResponseInterface
    | LastFMTopTracksReportResponseInterface;
}
