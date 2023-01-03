export type APIClientResponse<ReportResponse> = {
  status: number;
  headers: Record<string, string>;
  response: ReportResponse | APIClientStatusMessageType;
};

export interface APIClientInterface {
  request<ReportResponse>(
    url: string,
    params?: {
      method?: APIClientHttpMethodType;
      cache?: RequestCache;
      body?: unknown;
    }
  ): Promise<APIClientResponse<ReportResponse>>;
}

export type APIClientHttpMethodType = "GET" | "POST";

export type APIClientStatusMessageType = {
  detail: string;
};
