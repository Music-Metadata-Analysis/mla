import LastFMApiEndpointFactoryV1 from "../../../../../backend/api/lastfm/endpoint.v1.base.class";
import apiRoutes from "../../../../../config/apiRoutes";

class Top20TracksEndpointFactoryV1 extends LastFMApiEndpointFactoryV1 {
  route = apiRoutes.v1.reports.lastfm.top20tracks;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopTracks(userName);
  };
}

export const endpointFactory = new Top20TracksEndpointFactoryV1();
export default endpointFactory.create();
