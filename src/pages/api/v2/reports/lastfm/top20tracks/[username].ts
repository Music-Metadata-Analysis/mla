import { LastFMApiEndpointFactory } from "@src/backend/api/exports/endpoints";
import apiRoutes from "@src/config/apiRoutes";
import type { ApiEndpointRequestPathParamType } from "@src/backend/api/exports/types/requests";

class Top20TracksEndpointFactoryV2 extends LastFMApiEndpointFactory {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.reports.lastfm.top20tracks;

  protected getProxyResponse = async (
    params: ApiEndpointRequestPathParamType
  ) => {
    return await this.proxy.getUserTopTracks(params.username);
  };
}

export const endpointFactory = new Top20TracksEndpointFactoryV2();
export default endpointFactory.createHandler();
