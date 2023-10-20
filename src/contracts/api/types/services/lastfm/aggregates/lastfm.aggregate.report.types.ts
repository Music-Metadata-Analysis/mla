import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type {
  GenericAggregateBaseReportResponseInterface,
  GenericAggregateReportOperationType,
} from "@src/contracts/api/types/services/generics/aggregates/generic.aggregate.report.types";
import type { SunBurstData } from "@src/contracts/api/types/services/generics/aggregates/generic.sunburst.types";

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
