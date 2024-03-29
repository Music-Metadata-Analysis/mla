import LastFMApiEndpointFactoryBaseV2 from "@src/api/services/lastfm/endpoints/v2.lastfm.endpoint.factory.base.class";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";

export default class ConcreteV2EndpointWithProxyError extends LastFMApiEndpointFactoryBaseV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public errorCode?: number;
  public flag = null;
  public mockError = "mockError";
  public route = "/api/v2/endpoint/:username";

  protected getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ApiEndpointRequestQueryParamType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: ApiEndpointRequestBodyType | null
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    throw new errorVendorBackend.ProxyError(this.mockError, this.errorCode);
    return Promise.resolve([]);
  }
}
