import LastFMApiEndpointFactoryV1 from "@src/backend/api/lastfm/v1.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { BodyType } from "@src/types/api.endpoint.types";

class Top20AlbumsEndpointFactoryV1 extends LastFMApiEndpointFactoryV1 {
  route = apiRoutes.v1.reports.lastfm.top20albums;

  getProxyResponse = async (params: BodyType) => {
    return await this.proxy.getUserTopAlbums(params.userName);
  };
}

export const endpointFactory = new Top20AlbumsEndpointFactoryV1();
export default endpointFactory.create();
