import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import { ProxyError } from "@src/backend/api/services/lastfm/proxy/error/proxy.error.class";
import type { ApiEndpointRequestQueryParamType } from "@src/backend/api/types/services/request.types";

export default class ConcreteV2EndpointProxyErrorClass extends LastFMApiEndpointFactoryV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public errorCode?: number;
  public flag = null;
  public mockError = "mockError";
  public route = "/api/v2/endpoint/:username";

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ApiEndpointRequestQueryParamType
  ): Promise<never[]> {
    throw new ProxyError(this.mockError, this.errorCode);
    return [];
  }
}
