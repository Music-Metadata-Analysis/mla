import LastFMApiEndpointFactoryV2 from "../../../../../../backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "../../../../../../config/apiRoutes";
import type { PathParamType } from "../../../../../../types/api.endpoint.types";

class Top20TracksEndpointFactoryV2 extends LastFMApiEndpointFactoryV2 {
  route = apiRoutes.v2.reports.lastfm.top20tracks;
  maxAgeValue = 3600 * 24;

  getProxyResponse = async (params: PathParamType) => {
    return await this.proxy.getUserTopTracks(params.username);
  };
}

export const endpointFactory = new Top20TracksEndpointFactoryV2();
export default endpointFactory.create();
