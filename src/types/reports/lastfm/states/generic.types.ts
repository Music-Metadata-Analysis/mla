import type { AggregateBaseReportResponseInterface } from "@src/types/reports/generics/aggregate.types";
import type { PlayCountByArtistReportInterface } from "@src/types/reports/lastfm/states/aggregates/playcount.by.artist.types";
import type { LastFMUserProfileInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

export interface BaseReportResponseInterface
  extends LastFMUserProfileInterface {
  albums?: unknown[];
  artists?: unknown[];
  playCountByArtist?: AggregateBaseReportResponseInterface<
    PlayCountByArtistReportInterface[]
  >;
  tracks?: unknown[];
}

export type IntegrationTypes = "TEST" | "LAST.FM";
