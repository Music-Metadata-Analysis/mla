export interface CypressReportType {
  reportName: string;
  title: string;
  searchTitle: string;
  indicator: string;
  reportRoute: string;
  flag: string;
}

export interface CypressFlagEnabledReportType extends CypressReportType {
  enabled: boolean;
}
