import type { DataSourceType } from "../source.types";

export interface ReportCacheCreateClientParamsInterface<ReportType> {
  [param: string]: string | ReportType;
  authenticatedUserName: string;
  reportName: string;
  sourceName: DataSourceType;
  body: ReportType;
}

export interface ReportCacheRetrieveClientParamsInterface {
  [param: string]: string;
  authenticatedUserName: string;
  reportName: string;
  sourceName: DataSourceType;
  userName: string;
}
