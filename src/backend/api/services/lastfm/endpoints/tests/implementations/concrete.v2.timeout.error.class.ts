import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import type { ApiRequestQueryParamType } from "@src/types/api/request.types";

export default class ConcreteV2EndpointTimeoutErrorClass extends LastFMApiEndpointFactoryV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public flag = null;
  public route = "/api/v2/endpoint/:username";
  public timeOut = 100;

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ApiRequestQueryParamType
  ): Promise<never[]> {
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await sleep(this.timeOut * 2);
    return [];
  }
}
