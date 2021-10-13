import type useLastFM from "../../hooks/lastfm";
import type {
  LastFMUserStateBase,
  LastFMUserStateAlbumReport,
  LastFMUserStateArtistReport,
} from "./state.types";

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
