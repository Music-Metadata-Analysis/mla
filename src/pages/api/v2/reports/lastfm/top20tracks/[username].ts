import LastFMApiEndpointFactoryV2 from "@src/api/services/lastfm/endpoints/v2.lastfm.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { ApiEndpointRequestPathParamType } from "@src/contracts/api/types/request.types";

class Top20TracksEndpointFactoryV2 extends LastFMApiEndpointFactoryV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.reports.lastfm.top20tracks;

  protected getProxyResponse = async (
    params: ApiEndpointRequestPathParamType
  ) => {
    return await this.proxy.getUserTopTracks(params.username);
  };
}

export const endpointFactory = new Top20TracksEndpointFactoryV2();
export default endpointFactory.createHandler();
