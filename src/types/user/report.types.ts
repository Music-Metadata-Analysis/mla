import type { LastFMTopAlbumsReportResponseInterface } from "../clients/api/reports/lastfm.types";
import type { BaseReportResponseInterface } from "../proxy.types";

export type UserReportType =
  | LastFMTopAlbumsReportResponseInterface
  | BaseReportResponseInterface;
