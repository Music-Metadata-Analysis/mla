export type HttpApiClientResponse<ReportResponse> = {
  status: number;
  headers: Record<string, string>;
  response: ReportResponse | HttpApiClientStatusMessageType;
};

export interface HttpApiClientInterface {
  request<ReportResponse>(
    url: string,
    params?: {
      method?: HttpApiClientHttpMethodType;
      cache?: RequestCache;
      body?: unknown;
    }
  ): Promise<HttpApiClientResponse<ReportResponse>>;
}

export type HttpApiClientHttpMethodType = "GET" | "POST";

export type HttpApiClientStatusMessageType = {
  detail: string;
};
