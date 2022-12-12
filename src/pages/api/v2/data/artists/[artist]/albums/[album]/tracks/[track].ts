import LastFMApiEndpointFactoryV2 from "@src/backend/api/lastfm/endpoints/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type {
  ApiEndpointRequestType,
  RequestPathParamType,
} from "@src/types/api/request.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.data.artists.tracksGet;

  protected getParams(
    req: ApiEndpointRequestType
  ): [RequestPathParamType, boolean] {
    const params = req.query as RequestPathParamType;
    const error = !params.artist || !params.track || !params.username;
    return [params, error];
  }

  protected getProxyResponse = async (params: RequestPathParamType) => {
    return await this.proxy.getTrackInfo(
      params.artist,
      params.track,
      params.username
    );
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.createHandler();
