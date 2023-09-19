import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/lastfm.api.client.types";
import type {
  GenericAggregateBaseReportResponseInterface,
  GenericAggregateReportOperationType,
} from "@src/web/reports/generics/types/state/aggregate.report.types";
import type { SunBurstData } from "@src/web/reports/generics/types/state/charts/sunburst.types";

export type LastFMAggregateReportResponseInterface<ReportContentType> =
  GenericAggregateBaseReportResponseInterface<
    ReportContentType,
    LastFMReportClientParamsInterface
  >;

export type LastFMAggregateReportOperationType =
  GenericAggregateReportOperationType<LastFMReportClientParamsInterface>;

export type LastFMAggregateReportContentType = {
  [key in SunBurstData["entity"]]: unknown[];
} & { playcount: number; name: string };
