export interface LastFMReportClientInterface {
  getRoute(): string;
  retrieveReport: (params: LastFMReportClientParamsInterface) => void;
}

export interface LastFMReportClientParamsInterface {
  userName: string;
  artist?: string;
  album?: string;
  track?: string;
}
