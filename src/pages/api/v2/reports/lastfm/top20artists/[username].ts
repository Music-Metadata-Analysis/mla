import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { PathParamType } from "@src/types/api.endpoint.types";

class Top20ArtistsEndpointFactoryV2 extends LastFMApiEndpointFactoryV2 {
  route = apiRoutes.v2.reports.lastfm.top20artists;
  maxAgeValue = 3600 * 24;

  getProxyResponse = async (params: PathParamType) => {
    return await this.proxy.getUserTopArtists(params.username);
  };
}

export const endpointFactory = new Top20ArtistsEndpointFactoryV2();
export default endpointFactory.create();
