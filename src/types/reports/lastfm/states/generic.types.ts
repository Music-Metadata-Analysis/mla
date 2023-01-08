import type { LastFMUserProfileInterface } from "@src/types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/reports/generics/aggregate.types";
import type { PlayCountByArtistReportInterface } from "@src/types/reports/lastfm/states/aggregates/playcount.by.artist.types";

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
