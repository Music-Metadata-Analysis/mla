import { knownStatuses } from "../config/http";
import type {
  FetchResponse,
  HttpMethodType,
  StatusMessageType,
} from "../types/clients/https.types";
import type { ProxyResponse } from "../types/proxy.types";

class HTTPClient {
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
        status: response.status,
        json: () => Promise.resolve(knownStatuses[response.status]),
      } as FetchResponse;
    }
    return response;
  }

  post = async <POSTDATA, RESPONSE>(
    url: string,
    postData: POSTDATA
  ): Promise<ProxyResponse<RESPONSE>> => {
    let fetchResponse = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "same-origin",
      body: JSON.stringify(postData),
    });

    fetchResponse = this.handleKnownStatuses(fetchResponse);
    fetchResponse = this.handleUnsuccessful(fetchResponse, "POST", url);

    const json: RESPONSE | StatusMessageType = await fetchResponse.json();
    return {
      status: fetchResponse.status,
      response: json,
    };
  };
}

export default HTTPClient;
