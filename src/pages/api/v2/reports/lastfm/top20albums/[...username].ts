import LastFMApiEndpointFactoryV2 from "../../../../../../backend/api/lastfm/endpoint.v2.base.class";
import apiRoutes from "../../../../../../config/apiRoutes";

class Top20AlbumsEndpointFactoryV2 extends LastFMApiEndpointFactoryV2 {
  route = apiRoutes.v2.reports.lastfm.top20albums;
  maxAgeValue = 3600 * 24;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopAlbums(userName);
  };
}

export const endpointFactory = new Top20AlbumsEndpointFactoryV2();
export default endpointFactory.create();
