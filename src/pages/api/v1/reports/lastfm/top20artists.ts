import LastFMApiEndpointFactoryV1 from "../../../../../backend/api/lastfm/endpoint.v1.base.class";
import apiRoutes from "../../../../../config/apiRoutes";

class Top20ArtistsEndpointFactoryV1 extends LastFMApiEndpointFactoryV1 {
  route = apiRoutes.v1.reports.lastfm.top20artists;

  getProxyResponse = async (userName: string) => {
    return await this.proxy.getTopArtists(userName);
  };
}

export const endpointFactory = new Top20ArtistsEndpointFactoryV1();
export default endpointFactory.create();
