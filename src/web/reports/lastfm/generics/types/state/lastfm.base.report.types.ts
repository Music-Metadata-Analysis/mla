import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { LastFMUserProfileInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

export interface LastFMBaseReportInterface extends LastFMUserProfileInterface {
  albums?: unknown[];
  artists?: unknown[];
  playCountByArtist?: LastFMAggregateReportResponseInterface<unknown[]>;
  tracks?: unknown[];
}
