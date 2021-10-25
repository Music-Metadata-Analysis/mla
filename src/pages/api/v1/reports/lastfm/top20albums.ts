import LastFMApiEndpointFactory from "../../../../../backend/api/lastfm/endpoint.base.class";
import apiRoutes from "../../../../../config/apiRoutes";

class Top20AlbumsEndpointFactory extends LastFMApiEndpointFactory {
  route = apiRoutes.v1.reports.lastfm.top20albums;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopAlbums(userName);
  };
}

export const endpointFactory = new Top20AlbumsEndpointFactory();
export default endpointFactory.create();
