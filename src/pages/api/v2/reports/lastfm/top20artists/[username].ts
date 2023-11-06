import LastFMApiEndpointFactoryBaseV2 from "@src/api/services/lastfm/endpoints/v2.lastfm.endpoint.factory.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { ApiEndpointRequestPathParamType } from "@src/contracts/api/types/request.types";

class Top20ArtistsEndpointFactoryV2 extends LastFMApiEndpointFactoryBaseV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.reports.lastfm.top20artists;

  protected getProxyResponse = async (
    params: ApiEndpointRequestPathParamType
  ) => {
    return await this.proxy.getUserTopArtists(params.username);
  };
}

export const endpointFactory = new Top20ArtistsEndpointFactoryV2();
export default endpointFactory.createHandler();
