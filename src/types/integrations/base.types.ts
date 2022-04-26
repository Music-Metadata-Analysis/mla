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
  status: {
    complete: boolean;
    steps_total: number;
    steps_complete: number;
    operation?: {
      resource: string;
      type:
        | "Top Artists"
        | "Top Albums"
        | "Track Details"
        | "Album Details"
        | "Artist's Albums";
    };
  };
  content: unknown;
  content_signature: string;
}
