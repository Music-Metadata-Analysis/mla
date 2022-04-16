import type {
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
  LastFMPlayCountByArtistResponseInterface,
} from "../../clients/api/lastfm/response.types";

export type LocalStorageResponseTypes =
  | LastFMTopAlbumsReportResponseInterface
  | LastFMTopArtistsReportResponseInterface
  | LastFMTopTracksReportResponseInterface
  | LastFMPlayCountByArtistResponseInterface;

export interface LocalStorageObjectInterface<
  T extends LocalStorageResponseTypes
> {
  index: string;
  expiry: Date;
  content: T;
}
