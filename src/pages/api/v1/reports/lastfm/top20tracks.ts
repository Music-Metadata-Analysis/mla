import LastFMApiEndpointFactoryV1 from "@src/backend/api/lastfm/endpoints/v1.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { ApiRequestBodyType } from "@src/types/api/request.types";

class Top20TracksEndpointFactoryV1 extends LastFMApiEndpointFactoryV1 {
  public readonly route = apiRoutes.v1.reports.lastfm.top20tracks;

  protected getProxyResponse = async (params: ApiRequestBodyType) => {
    return await this.proxy.getUserTopTracks(params.userName);
  };
}

export const endpointFactory = new Top20TracksEndpointFactoryV1();
export default endpointFactory.createHandler();
