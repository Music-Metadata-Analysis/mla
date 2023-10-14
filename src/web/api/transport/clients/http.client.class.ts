import { knownStatuses as defaultKnownStatuses } from "@src/config/api";
import type {
  HttpApiClientInterface,
  HttpApiClientResponse,
  HttpApiClientHttpMethodType,
  HttpApiClientStatusMessageType,
} from "@src/contracts/api/types/clients/http.client.types";

class HttpApiClient implements HttpApiClientInterface {
  protected readonly knownStatuses: {
    [index: number]: HttpApiClientStatusMessageType;
  };

  constructor(
    knownStatuses: { [index: number]: HttpApiClientStatusMessageType } = {
      ...defaultKnownStatuses,
    }
  ) {
    this.knownStatuses = { ...knownStatuses };
  }

  async request<RESPONSE>(
    url: string,
    params?: {
      method?: HttpApiClientHttpMethodType;
      cache?: RequestCache;
      body?: unknown;
    }
  ): Promise<HttpApiClientResponse<RESPONSE>> {
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
    fetchResponse = this.handleUnknownStatus(fetchResponse, method, url);

    const json: RESPONSE | HttpApiClientStatusMessageType =
      await fetchResponse.json();

    return {
      ok: fetchResponse.ok,
      status: fetchResponse.status,
      headers: this.getHeaders(fetchResponse),
      response: json,
    };
  }

  protected handleKnownStatuses(response: Response): Response {
    if (response.status in this.knownStatuses) {
      return {
        ok: response.ok,
        headers: response.headers,
        status: response.status,
        json: () => Promise.resolve(this.knownStatuses[response.status]),
      } as Response;
    }
    return response;
  }

  protected handleUnknownStatus(
    response: Response,
    method: HttpApiClientHttpMethodType,
    url: string
  ): Response {
    if (!response.ok && !(response.status in this.knownStatuses)) {
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

export default HttpApiClient;
