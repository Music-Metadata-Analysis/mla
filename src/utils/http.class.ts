import * as status from "../config/status";
import type {
  FetchResponse,
  HttpMethodType,
  StatusMessageType,
} from "../types/https.types";

class HTTPClient {
  private knownStatuses: { [index: number]: StatusMessageType } = {
    429: status.STATUS_429_MESSAGE,
  };

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
    if (response.status in this.knownStatuses) {
      return {
        ok: true,
        status: response.status,
        json: () => Promise.resolve(this.knownStatuses[response.status]),
      } as FetchResponse;
    }
    return response;
  }

  post = async <POSTDATA, RESPONSE>(
    url: string,
    postData: POSTDATA
  ): Promise<{
    status: number;
    response: RESPONSE | StatusMessageType;
  }> => {
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
