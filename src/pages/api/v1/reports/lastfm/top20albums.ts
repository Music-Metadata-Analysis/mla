import LastFMApiEndpointFactoryV1 from "../../../../../backend/api/lastfm/endpoint.v1.base.class";
import apiRoutes from "../../../../../config/apiRoutes";

class Top20AlbumsEndpointFactoryV1 extends LastFMApiEndpointFactoryV1 {
  route = apiRoutes.v1.reports.lastfm.top20albums;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopAlbums(userName);
  };
}

export const endpointFactory = new Top20AlbumsEndpointFactoryV1();
export default endpointFactory.create();
