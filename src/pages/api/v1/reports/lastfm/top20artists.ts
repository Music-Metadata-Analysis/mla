import LastFMApiEndpointFactoryV1 from "@src/backend/api/lastfm/v1.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { BodyType } from "@src/types/api.endpoint.types";

class Top20ArtistsEndpointFactoryV1 extends LastFMApiEndpointFactoryV1 {
  route = apiRoutes.v1.reports.lastfm.top20artists;

  getProxyResponse = async (params: BodyType) => {
    return await this.proxy.getUserTopArtists(params.userName);
  };
}

export const endpointFactory = new Top20ArtistsEndpointFactoryV1();
export default endpointFactory.create();
