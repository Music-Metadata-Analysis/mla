import type { StatusMessageType } from "./clients/https.types";

export interface ProxyRequestInterface {
  userName: string;
}

export type ProxyResponse<REPORT> = {
  status: number;
  response: REPORT | StatusMessageType;
};

export interface TopAlbumsReportResponseInterface {
  albums: any[];
  image: any[];
}
