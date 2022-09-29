import { knownStatuses } from "@src/config/api";
import type {
  ApiResponse,
  FetchResponse,
  HttpMethodType,
  StatusMessageType,
} from "@src/types/clients/api/api.client.types";

class APIClient {
  async request<RESPONSE>(
    url: string,
    params?: {
      method?: HttpMethodType;
      cache?: RequestCache;
      body?: unknown;
    }
  ): Promise<ApiResponse<RESPONSE>> {
    const method = params?.method ? params.method : "GET";
    const cache = params?.cache ? params.cache : "default";
    const body = params?.body ? JSON.stringify(params.body) : undefined;

    let fetchResponse = await fetch(url, {
      method,
      mode: "cors",
      cache,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "same-origin",
      body,
    });

    fetchResponse = this.handleKnownStatuses(fetchResponse);
    fetchResponse = this.handleUnsuccessful(fetchResponse, method, url);

    const json: RESPONSE | StatusMessageType = await fetchResponse.json();
    return {
      status: fetchResponse.status,
      headers: this.getHeaders(fetchResponse),
      response: json,
    };
  }

  protected handleKnownStatuses(response: FetchResponse): FetchResponse {
    if (response.status in knownStatuses) {
      return {
        ok: true,
        headers: response.headers,
        status: response.status,
        json: () => Promise.resolve(knownStatuses[response.status]),
      } as FetchResponse;
    }
    return response;
  }

  protected handleUnsuccessful(
    response: FetchResponse,
    method: HttpMethodType,
    url: string
  ): FetchResponse {
    if (!response.ok) {
      throw Error(`${method}: ${url}`);
    }
    return response;
  }

  protected getHeaders(response: FetchResponse) {
    const headers: Record<string, string> = {};
    for (const [key, value] of response.headers) {
      headers[key] = value;
    }
    return headers;
  }
}

export default APIClient;
