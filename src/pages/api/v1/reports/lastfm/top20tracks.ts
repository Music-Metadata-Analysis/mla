import LastFMApiEndpointFactory from "../../../../../backend/api/lastfm/endpoint.base.class";
import apiRoutes from "../../../../../config/apiRoutes";

class Top20TracksEndpointFactory extends LastFMApiEndpointFactory {
  route = apiRoutes.v1.reports.lastfm.top20tracks;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopTracks(userName);
  };
}

export const endpointFactory = new Top20TracksEndpointFactory();
export default endpointFactory.create();
