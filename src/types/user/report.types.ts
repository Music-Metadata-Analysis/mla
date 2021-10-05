import type { LastFMTopAlbumsReportResponseInterface } from "../clients/api/reports/lastfm.client.types";
import type { BaseReportResponseInterface } from "../integrations/base.types";

export type UserReportType =
  | LastFMTopAlbumsReportResponseInterface
  | BaseReportResponseInterface;
