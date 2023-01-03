import { LastFMApiEndpointFactory } from "@src/backend/api/exports";
import apiRoutes from "@src/config/apiRoutes";
import type { ApiRequestPathParamType } from "@src/types/api/request.types";

class Top20AlbumsEndpointFactoryV2 extends LastFMApiEndpointFactory {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.reports.lastfm.top20albums;

  protected getProxyResponse = async (params: ApiRequestPathParamType) => {
    return await this.proxy.getUserTopAlbums(params.username);
  };
}

export const endpointFactory = new Top20AlbumsEndpointFactoryV2();
export default endpointFactory.createHandler();
