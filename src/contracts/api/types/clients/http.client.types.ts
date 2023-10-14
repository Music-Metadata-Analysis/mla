export type HttpApiClientResponse<ReportResponse> = {
  ok: boolean;
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

export type HttpApiClientHttpMethodType = "GET" | "POST" | "PUT";

export type HttpApiClientStatusMessageType = {
  detail: string;
};
