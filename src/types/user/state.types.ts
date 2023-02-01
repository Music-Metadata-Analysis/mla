import type { UserActionType } from "./action.types";
import type { UserReportType } from "./report.types";
import type {
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
} from "@src/web/api/lastfm/types/response.types";
import type { LastFMBaseReportInterface } from "@src/web/reports/lastfm/generics/types/state/base.report.types";
import type { LastFMPlayCountByArtistResponseInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

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
  retries: number;
  userName: string | null;
}

export interface LastFMUserStateBase extends UserStateInterface {
  data: {
    report: LastFMBaseReportInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStateAlbumReport extends UserStateInterface {
  data: {
    report: LastFMTopAlbumsReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStateArtistReport extends UserStateInterface {
  data: {
    report: LastFMTopArtistsReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStateTrackReport extends UserStateInterface {
  data: {
    report: LastFMTopTracksReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMUserStatePlayCountByArtistReport
  extends UserStateInterface {
  data: {
    report: LastFMPlayCountByArtistResponseInterface;
    integration: "LASTFM";
  };
}
