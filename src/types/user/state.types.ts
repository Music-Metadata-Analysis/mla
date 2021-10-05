import type {
  LastFMTopBaseReportResponseInterface,
  LastFMTopAlbumsReportResponseInterface,
} from "../clients/api/reports/lastfm.client.types";
import type { UserActionType } from "./action.types";
import type { UserReportType } from "./report.types";

interface UserDataInterface {
  integration: string | null;
  report: UserReportType;
}

export interface UserStateInterface {
  data: UserDataInterface;
  error: null | UserActionType["type"];
  inProgress: boolean;
  profileUrl: string | null;
  ready: boolean;
  userName: string | null;
}

export interface LastFMUserStateBase extends UserStateInterface {
  data: {
    report: LastFMTopBaseReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStateTop20AlbumReport extends UserStateInterface {
  data: {
    report: LastFMTopAlbumsReportResponseInterface;
    integration: "LASTFM";
  };
}
