import type { LastFMPlayCountByArtistResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";
import type { LastFMTopArtistsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { LastFMTopTracksReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";
import type { LastFMBaseReportInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.base.report.types";

export interface LastFMReportStateBase extends ReportStateInterface {
  data: {
    report: LastFMBaseReportInterface;
    integration: "LASTFM";
  };
}

export interface LastFMReportStateAlbumReport extends ReportStateInterface {
  data: {
    report: LastFMTopAlbumsReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMReportStateArtistReport extends ReportStateInterface {
  data: {
    report: LastFMTopArtistsReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMReportStateTrackReport extends ReportStateInterface {
  data: {
    report: LastFMTopTracksReportResponseInterface;
    integration: "LASTFM";
  };
}

export interface LastFMReportStatePlayCountByArtistReport
  extends ReportStateInterface {
  data: {
    report: LastFMPlayCountByArtistResponseInterface;
    integration: "LASTFM";
  };
}
