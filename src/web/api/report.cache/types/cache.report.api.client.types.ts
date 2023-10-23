import type {
  ReportCacheCreateClientParamsInterface as ContractReportCacheCreateClientParamsInterface,
  ReportCacheRetrieveClientParamsInterface as ContractReportCacheRetrieveClientParamsInterface,
} from "@src/contracts/api/types/clients/report.cache.client.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export type ReportCacheCreateClientParamsInterface =
  ContractReportCacheCreateClientParamsInterface<ReportStateInterface>;

export type ReportCacheRetrieveClientParamsInterface =
  ContractReportCacheRetrieveClientParamsInterface;

export interface ReportCacheCreateClientInterface {
  getRoute(): string;
  populate: (params: ReportCacheCreateClientParamsInterface) => Promise<{
    bypassed: boolean;
  }>;
}

export interface ReportCacheRetrieveClientInterface {
  getRoute(): string;
  lookup: (params: ReportCacheRetrieveClientParamsInterface) => Promise<{
    bypassed: boolean;
  }>;
}
