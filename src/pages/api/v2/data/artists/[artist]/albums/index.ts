import { LastFMApiEndpointFactory } from "@src/backend/api/exports/endpoints";
import apiRoutes from "@src/config/apiRoutes";
import type {
  ApiEndpointRequestType,
  ApiEndpointRequestPathParamType,
} from "@src/backend/api/exports/types/requests";

class ArtistTopAlbums extends LastFMApiEndpointFactory {
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
