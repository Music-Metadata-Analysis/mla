import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.lastfm.endpoint.base.class";
import type { ApiEndpointRequestPathParamType } from "@src/backend/api/types/services/request.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";

export default class ConcreteV2EndpointWithProxySuccess extends LastFMApiEndpointFactoryV2 {
  public cacheMaxAgeValue = 1000;
  public delay = 1;
  public flag = null;
  public route = "/api/v2/endpoint/:username";

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ApiEndpointRequestPathParamType
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    return [];
  }
}
