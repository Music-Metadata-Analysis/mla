import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/lastfm/report.client.types";

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
  params: LastFMReportClientParamsInterface;
};

export interface StepInterface {
  getStep(): void;
}

export interface TransformationInterface {
  transform(): void;
}
