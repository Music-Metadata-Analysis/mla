import LastFMApiEndpointFactoryV2 from "../../../../../../backend/api/lastfm/endpoint.v2.base.class";
import apiRoutes from "../../../../../../config/apiRoutes";

class Top20TracksEndpointFactoryV2 extends LastFMApiEndpointFactoryV2 {
  route = apiRoutes.v2.reports.lastfm.top20tracks;
  maxAgeValue = 3600 * 24;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopTracks(userName);
  };
}

export const endpointFactory = new Top20TracksEndpointFactoryV2();
export default endpointFactory.create();
