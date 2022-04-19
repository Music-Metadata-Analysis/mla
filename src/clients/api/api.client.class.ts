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

  get = async <RESPONSE>(url: string): Promise<ApiResponse<RESPONSE>> => {
    let fetchResponse = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "default",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "same-origin",
    });

    fetchResponse = this.handleKnownStatuses(fetchResponse);
    fetchResponse = this.handleUnsuccessful(fetchResponse, "GET", url);

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
