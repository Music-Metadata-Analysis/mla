import type {
  HttpApiClientInterface,
  HttpApiClientResponse,
  HttpApiClientHttpMethodType,
  HttpApiClientStatusMessageType,
} from "@src/contracts/api/types/clients/http.client.types";

class HttpApiClient implements HttpApiClientInterface {
  protected readonly serviceStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };

  constructor(serviceStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  }) {
    this.serviceStatusCodes = { ...serviceStatusCodes };
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
    const headers = params?.body
      ? {
          "Content-Type": "application/json",
        }
      : undefined;

    let fetchResponse = await fetch(url, {
      method,
      mode: "cors",
      cache,
      credentials: "same-origin",
      headers,
      referrerPolicy: "same-origin",
      body,
    });

    fetchResponse = this.handleConfiguredStatuses(fetchResponse);
    fetchResponse = this.handleUnconfiguredStatuses(fetchResponse, method, url);

    const json: RESPONSE | HttpApiClientStatusMessageType =
      await fetchResponse.json();

    return {
      ok: fetchResponse.ok,
      status: fetchResponse.status,
      headers: this.getHeaders(fetchResponse),
      response: json,
    };
  }

  protected handleConfiguredStatuses(response: Response): Response {
    if (response.status in this.serviceStatusCodes) {
      return {
        ok: response.ok,
        headers: response.headers,
        status: response.status,
        json: () => Promise.resolve(this.serviceStatusCodes[response.status]),
      } as Response;
    }
    return response;
  }

  protected handleUnconfiguredStatuses(
    response: Response,
    method: HttpApiClientHttpMethodType,
    url: string
  ): Response {
    if (!response.ok && !(response.status in this.serviceStatusCodes)) {
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
