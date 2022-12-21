export type HttpMethodType = "GET" | "POST";

export type StatusMessageType = {
  detail: string;
};

export type ApiResponse<REPORT> = {
  status: number;
  headers: Record<string, string>;
  response: REPORT | StatusMessageType;
};
