import LastFMApiEndpointFactoryV1 from "@src/backend/api/lastfm/endpoints/v1.endpoint.base.class";
import { ProxyError } from "@src/backend/api/lastfm/proxy/error/proxy.error.class";
import type { ApiRequestBodyType } from "@src/types/api/request.types";

export default class ConcreteV1EndpointProxyErrorClass extends LastFMApiEndpointFactoryV1 {
  public route = "/api/v1/endpoint";
  public mockError = "mockError";
  public errorCode?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async getProxyResponse(_: ApiRequestBodyType): Promise<never[]> {
    throw new ProxyError(this.mockError, this.errorCode);
    return [];
  }
}
