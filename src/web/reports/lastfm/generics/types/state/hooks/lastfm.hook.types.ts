import type { LastFMHookType } from "@src/web/reports/lastfm/generics/state/hooks/lastfm.hook";
import type {
  LastFMReportStateBase,
  LastFMReportStateAlbumReport,
  LastFMReportStateArtistReport,
  LastFMReportStateTrackReport,
  LastFMReportStatePlayCountByArtistReport,
} from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

export interface reportHookAsLastFM extends LastFMHookType {
  reportProperties: LastFMReportStateBase;
}

export interface reportHookAsLastFMTop20AlbumReport extends LastFMHookType {
  reportProperties: LastFMReportStateAlbumReport;
}

export interface reportHookAsLastFMTop20ArtistReport extends LastFMHookType {
  reportProperties: LastFMReportStateArtistReport;
}

export interface reportHookAsLastFMTop20TrackReport extends LastFMHookType {
  reportProperties: LastFMReportStateTrackReport;
}

export interface reportHookAsLastFMPlayCountByArtistReport
  extends LastFMHookType {
  reportProperties: LastFMReportStatePlayCountByArtistReport;
}
