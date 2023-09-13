import type { LastFMUserProfileInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.aggregate.report.types";

export interface LastFMBaseReportInterface extends LastFMUserProfileInterface {
  albums?: unknown[];
  artists?: unknown[];
  playCountByArtist?: LastFMAggregateReportResponseInterface<unknown[]>;
  tracks?: unknown[];
}
