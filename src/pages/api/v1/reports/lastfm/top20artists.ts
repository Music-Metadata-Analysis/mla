import LastFMApiEndpointFactory from "../../../../../backend/api/lastfm/endpoint.base.class";
import apiRoutes from "../../../../../config/apiRoutes";

class Top20AlbumsEndpointFactory extends LastFMApiEndpointFactory {
  route = apiRoutes.v1.reports.lastfm.top20artists;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopArtists(userName);
  };
}

export const endpointFactory = new Top20AlbumsEndpointFactory();
export default endpointFactory.create();
