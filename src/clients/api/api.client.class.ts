import { knownStatuses } from "../../config/api";
import type {
  ApiResponse,
  FetchResponse,
  HttpMethodType,
  StatusMessageType,
} from "../../types/clients/api/api.client.types";

class APIClient {
  private handleUnsuccessful(
    response: FetchResponse,
    method: HttpMethodType,
    url: string
  ): FetchResponse {
    if (!response.ok) {
      throw Error(`${method}: ${url}`);
    }
    return response;
  }

  private handleKnownStatuses(response: FetchResponse): FetchResponse {
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

  request = async <RESPONSE>(
    url: string,
    method: HttpMethodType = "GET",
    cache: RequestCache = "default",
    body: Record<string, unknown> | null = null
  ): Promise<ApiResponse<RESPONSE>> => {
    let fetchResponse = await fetch(url, {
      method,
      mode: "cors",
      cache,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "same-origin",
      body: body ? JSON.stringify(body) : body,
    });

    fetchResponse = this.handleKnownStatuses(fetchResponse);
    fetchResponse = this.handleUnsuccessful(fetchResponse, method, url);

    const json: RESPONSE | StatusMessageType = await fetchResponse.json();
    return {
      status: fetchResponse.status,
      headers: this.getHeaders(fetchResponse),
      response: json,
    };
  };

  private getHeaders(response: FetchResponse) {
    const headers: Record<string, string> = {};
    for (const [key, value] of response.headers) {
      headers[key] = value;
    }
    return headers;
  }
}

export default APIClient;
