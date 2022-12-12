import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/endpoints/v2.endpoint.base.class";
import type { RequestQueryParamType } from "@src/types/api/request.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/integrations/lastfm/api.types";

export default class ConcreteV2EndpointProxyResponseErrorClass extends LastFMApiEndpointFactoryV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public flag = null;
  public route = "/api/v2/endpoint/:username";

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: RequestQueryParamType
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    return undefined as unknown as LastFMArtistTopAlbumsInterface[];
  }
}
