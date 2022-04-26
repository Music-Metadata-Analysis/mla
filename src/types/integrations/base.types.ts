export interface BaseReportResponseInterface {
  albums?: unknown[];
  artists?: unknown[];
  playCountByArtist?: AggregateBaseReportResponseInterface<unknown>;
  tracks?: unknown[];
  image: unknown[];
  playcount: number;
}

export interface AggregateBaseReportResponseInterface<ReportContentType> {
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
  created: string;
  content: ReportContentType;
}
