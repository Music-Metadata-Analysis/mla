import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";

export interface LastFMBaseReportInterface extends LastFMUserProfileInterface {
  albums?: unknown[];
  artists?: unknown[];
  playCountByArtist?: LastFMAggregateReportResponseInterface<unknown[]>;
  tracks?: unknown[];
}
