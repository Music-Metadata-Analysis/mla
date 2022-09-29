export interface LastFMReportInterface {
  getRoute(): string;
  retrieveReport: (params: LastFMReportParamsInterface) => void;
}

export interface LastFMReportParamsInterface {
  userName: string;
  artist?: string;
  album?: string;
  track?: string;
}

export interface LastFMClientParamsInterface {
  userName: string;
  artist?: string;
  album?: string;
  track?: string;
}
