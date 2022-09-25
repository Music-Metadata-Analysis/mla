import type {
  LastFMUserStateBase,
  LastFMUserStateAlbumReport,
  LastFMUserStateArtistReport,
  LastFMUserStateTrackReport,
  LastFMUserStatePlayCountByArtistReport,
} from "./state.types";
import type useLastFM from "@src/hooks/lastfm";

export interface userHookAsLastFM extends ReturnType<typeof useLastFM> {
  userProperties: LastFMUserStateBase;
}

export interface userHookAsLastFMTop20AlbumReport
  extends ReturnType<typeof useLastFM> {
  userProperties: LastFMUserStateAlbumReport;
}

export interface userHookAsLastFMTop20ArtistReport
  extends ReturnType<typeof useLastFM> {
  userProperties: LastFMUserStateArtistReport;
}

export interface userHookAsLastFMTop20TrackReport
  extends ReturnType<typeof useLastFM> {
  userProperties: LastFMUserStateTrackReport;
}

export interface userHookAsLastFMPlayCountByArtistReport
  extends ReturnType<typeof useLastFM> {
  userProperties: LastFMUserStatePlayCountByArtistReport;
}
