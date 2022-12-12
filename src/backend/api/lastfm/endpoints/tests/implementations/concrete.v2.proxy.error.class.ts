import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/endpoints/v2.endpoint.base.class";
import { ProxyError } from "@src/errors/proxy.error.class";
import type { RequestQueryParamType } from "@src/types/api/request.types";

export default class ConcreteV2EndpointProxyErrorClass extends LastFMApiEndpointFactoryV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public errorCode?: number;
  public flag = null;
  public mockError = "mockError";
  public route = "/api/v2/endpoint/:username";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async getProxyResponse(_: RequestQueryParamType): Promise<never[]> {
    throw new ProxyError(this.mockError, this.errorCode);
    return [];
  }
}
