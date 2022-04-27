import type {
  PlayCountByArtistReportInterface,
  LastFMClientParamsInterface,
} from "../clients/api/reports/lastfm.client.types";

export interface BaseReportResponseInterface {
  albums?: unknown[];
  artists?: unknown[];
  playCountByArtist?: AggregateBaseReportResponseInterface<
    PlayCountByArtistReportInterface[]
  >;
  tracks?: unknown[];
  image: unknown[];
  playcount: number;
}

export interface AggregateBaseReportResponseInterface<ReportContentType> {
  status: {
    complete: boolean;
    steps_total: number;
    steps_complete: number;
    operation?: AggregateReportOperationType;
  };
  created: string;
  content: ReportContentType;
}

export type AggregateReportOperationType = {
  resource: string;
  type:
    | "Album Details"
    | "Artist's Albums"
    | "Top Artists"
    | "Top Albums"
    | "Track Details"
    | "User Profile";
  url: string;
  params: LastFMClientParamsInterface;
};

export type IntegrationTypes = "TEST" | "LAST.FM";
