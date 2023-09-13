import type {
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
} from "@src/web/api/lastfm/types/lastfm.api.response.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";
import type { LastFMBaseReportInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.base.report.types";
import type { LastFMPlayCountByArtistResponseInterface } from "@src/web/reports/lastfm/playcount.by.artist/types/state/aggregate.report.types";

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
