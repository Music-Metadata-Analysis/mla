import LastFMApiEndpointFactoryV1 from "@src/backend/api/lastfm/endpoints/v1.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { RequestBodyType } from "@src/types/api/request.types";

class Top20ArtistsEndpointFactoryV1 extends LastFMApiEndpointFactoryV1 {
  public readonly route = apiRoutes.v1.reports.lastfm.top20artists;

  protected getProxyResponse = async (params: RequestBodyType) => {
    return await this.proxy.getUserTopArtists(params.userName);
  };
}

export const endpointFactory = new Top20ArtistsEndpointFactoryV1();
export default endpointFactory.createHandler();
