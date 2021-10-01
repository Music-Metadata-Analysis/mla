import type useLastFM from "../../hooks/lastfm";
import type {
  LastFMUserStateBase,
  LastFMUserStateTop20AlbumReport,
} from "./state.types";

export interface userHookAsLastFM extends ReturnType<typeof useLastFM> {
  userProperties: LastFMUserStateBase;
}

export interface userHookAsLastFMTop20AlbumReport
  extends ReturnType<typeof useLastFM> {
  userProperties: LastFMUserStateTop20AlbumReport;
}
