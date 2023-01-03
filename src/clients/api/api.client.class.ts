import { knownStatuses } from "@src/config/api";
import type {
  APIClientInterface,
  APIClientResponse,
  APIClientHttpMethodType,
  APIClientStatusMessageType,
} from "@src/contracts/api/exports.types";

class APIClient implements APIClientInterface {
  async request<RESPONSE>(
    url: string,
    params?: {
      method?: APIClientHttpMethodType;
      cache?: RequestCache;
      body?: unknown;
    }
  ): Promise<APIClientResponse<RESPONSE>> {
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

    const json: RESPONSE | APIClientStatusMessageType =
      await fetchResponse.json();
    return {
      status: fetchResponse.status,
      headers: this.getHeaders(fetchResponse),
      response: json,
    };
  }

  protected handleKnownStatuses(response: Response): Response {
    if (response.status in knownStatuses) {
      return {
        ok: true,
        headers: response.headers,
        status: response.status,
        json: () => Promise.resolve(knownStatuses[response.status]),
      } as Response;
    }
    return response;
  }

  protected handleUnsuccessful(
    response: Response,
    method: APIClientHttpMethodType,
    url: string
  ): Response {
    if (!response.ok) {
      throw Error(`${method}: ${url}`);
    }
    return response;
  }

  protected getHeaders(response: Response) {
    const headers: Record<string, string> = {};
    for (const [key, value] of response.headers) {
      headers[key] = value;
    }
    return headers;
  }
}

export default APIClient;
