export interface BaseReportResponseInterface {
  aggregates?: {
    playcountByArtists?: AggregateBaseReportResponseInterface;
  };
  albums?: unknown[];
  artists?: unknown[];
  tracks?: unknown[];
  image: unknown[];
  playcount: number;
}

export interface AggregateBaseReportResponseInterface {
  aggregate_status: {
    complete: boolean;
    steps_total: number;
    steps_complete: number;
  };
  content: unknown;
  content_signature: string;
}
