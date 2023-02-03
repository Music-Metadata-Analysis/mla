import type {
  LastFMUserStateBase,
  LastFMUserStateAlbumReport,
  LastFMUserStateArtistReport,
  LastFMUserStateTrackReport,
  LastFMUserStatePlayCountByArtistReport,
} from "./state.types";
import type { LastFMHookType } from "@src/web/reports/lastfm/generics/state/hooks/lastfm.hook";

export interface userHookAsLastFM extends LastFMHookType {
  userProperties: LastFMUserStateBase;
}

export interface userHookAsLastFMTop20AlbumReport extends LastFMHookType {
  userProperties: LastFMUserStateAlbumReport;
}

export interface userHookAsLastFMTop20ArtistReport extends LastFMHookType {
  userProperties: LastFMUserStateArtistReport;
}

export interface userHookAsLastFMTop20TrackReport extends LastFMHookType {
  userProperties: LastFMUserStateTrackReport;
}

export interface userHookAsLastFMPlayCountByArtistReport
  extends LastFMHookType {
  userProperties: LastFMUserStatePlayCountByArtistReport;
}
