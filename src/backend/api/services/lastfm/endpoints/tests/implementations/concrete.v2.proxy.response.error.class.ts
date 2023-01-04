import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import type { ApiRequestQueryParamType } from "@src/backend/api/types/services/request.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/integrations/lastfm/api.types";

export default class ConcreteV2EndpointProxyResponseErrorClass extends LastFMApiEndpointFactoryV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public flag = null;
  public route = "/api/v2/endpoint/:username";

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ApiRequestQueryParamType
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    return undefined as unknown as LastFMArtistTopAlbumsInterface[];
  }
}
