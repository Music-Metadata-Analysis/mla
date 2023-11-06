import LastFMApiEndpointFactoryBaseV2 from "@src/api/services/lastfm/endpoints/v2.lastfm.endpoint.factory.base.class";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";

export default class ConcreteV2EndpointWithProxyTimeout extends LastFMApiEndpointFactoryBaseV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public flag = null;
  public route = "/api/v2/endpoint/:username";
  public timeOut = 10;

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ApiEndpointRequestQueryParamType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: ApiEndpointRequestBodyType | null
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
