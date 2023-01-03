import { LastFMApiEndpointFactory } from "@src/backend/api/exports";
import apiRoutes from "@src/config/apiRoutes";
import type {
  ApiEndpointRequestType,
  ApiRequestPathParamType,
} from "@src/types/api/request.types";

class ArtistTopAlbums extends LastFMApiEndpointFactory {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.data.artists.tracksGet;

  protected getParams(
    req: ApiEndpointRequestType
  ): [ApiRequestPathParamType, boolean] {
    const params = req.query as ApiRequestPathParamType;
    const error = !params.artist || !params.track || !params.username;
    return [params, error];
  }

  protected getProxyResponse = async (params: ApiRequestPathParamType) => {
    return await this.proxy.getTrackInfo(
      params.artist,
      params.track,
      params.username
    );
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.createHandler();
