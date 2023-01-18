import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type {
  ApiEndpointRequestType,
  ApiEndpointRequestPathParamType,
} from "@src/backend/api/types/services/request.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.data.artists.albumsList;

  protected getParams(
    req: ApiEndpointRequestType
  ): [ApiEndpointRequestPathParamType, boolean] {
    const params = req.query as ApiEndpointRequestPathParamType;
    const error = !params.artist;
    return [params, error];
  }

  protected getProxyResponse = async (
    params: ApiEndpointRequestPathParamType
  ) => {
    return await this.proxy.getArtistTopAlbums(params.artist);
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.createHandler();
