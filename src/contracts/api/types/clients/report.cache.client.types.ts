export interface ReportCacheCreateClientParamsInterface<ReportType> {
  [param: string]: string | ReportType;
  authenticatedUserName: string;
  reportName: string;
  sourceName: string;
  userName: string;
  body: ReportType;
}

export interface ReportCacheRetrieveClientParamsInterface {
  [param: string]: string;
  authenticatedUserName: string;
  reportName: string;
  sourceName: string;
  userName: string;
}
