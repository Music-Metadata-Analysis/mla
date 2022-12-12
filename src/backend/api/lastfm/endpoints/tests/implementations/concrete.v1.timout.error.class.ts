import LastFMApiEndpointFactoryV1 from "@src/backend/api/lastfm/endpoints/v1.endpoint.base.class";
import type { RequestBodyType } from "@src/types/api/request.types";

export default class ConcreteV1EndpointTimeoutErrorClass extends LastFMApiEndpointFactoryV1 {
  public route = "/api/v1/endpoint";
  public timeOut = 100;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async getProxyResponse(_: RequestBodyType): Promise<never[]> {
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await sleep(this.timeOut * 2);
    return [];
  }
}
