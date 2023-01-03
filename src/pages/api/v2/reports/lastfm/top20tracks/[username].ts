import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { ApiRequestPathParamType } from "@src/types/api/request.types";

class Top20TracksEndpointFactoryV2 extends LastFMApiEndpointFactoryV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.reports.lastfm.top20tracks;

  protected getProxyResponse = async (params: ApiRequestPathParamType) => {
    return await this.proxy.getUserTopTracks(params.username);
  };
}

export const endpointFactory = new Top20TracksEndpointFactoryV2();
export default endpointFactory.createHandler();
